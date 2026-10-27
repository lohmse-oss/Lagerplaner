// Tests des Parameterschemas in Lagerplaner.html
// Ausführen: node tests/parameterschema.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const withData = (page) => page.evaluate(() => {
  S.items = [Object.assign(newItem(), { name: "Wichtige Position", trucks: 3, skus: 40, stack: 2 })];
  S.meta.name = "Projekt X";
  syncAll(); renderItems(); recalc();
});
const openVorgaben = async (page, area) => {
  await page.evaluate(() => showTab(1));
  if (area) await page.click("#ptab-" + area);
};

test("Abdeckung: jeder Wert der Vorgaben hat genau einen Schemaeintrag", async (page) => {
  const r = await page.evaluate(() => {
    const leaves = [];
    const visit = (v, p) => {
      if (v && typeof v === "object" && !Array.isArray(v)) { for (const [k, c] of Object.entries(v)) visit(c, p + "." + k); return; }
      leaves.push(p);
    };
    const d = defaults();
    for (const g of ["building", "volume", "block", "ffz", "fire", "empty", "costMeta", "prices", "bom"]) visit(d[g], g);
    leaves.push("lhmDefault");
    const schema = PARAMS.map((x) => x.p).filter((p) => p !== "building.zones");
    const dup = schema.filter((p, i) => schema.indexOf(p) !== i);
    return {
      missing: leaves.filter((p) => !PARAM_BY_PATH.has(p) && !PARAM_INTERNAL_PATHS.includes(p)),
      unknown: schema.filter((p) => getP(d, p) === undefined),
      dup,
    };
  });
  assert.deepEqual(r, { missing: [], unknown: [], dup: [] });
});

test("Abdeckung: Standardwerte sind typgerecht und liegen in den Grenzen", async (page) => {
  const r = await page.evaluate(() => {
    const d = defaults();
    validateParamTypes(d, "defaults");
    return repairParamRanges(d);
  });
  assert.deepEqual(r, []);
});

test("Formular: jedes Feld kommt aus dem Schema, mit Beschriftung und Grenzen", async (page) => {
  const r = await page.evaluate(() => {
    const problems = [];
    const inLayout = PARAM_LAYOUT.flatMap((g) => g.sections.flatMap((s) => s.items.filter((i) => typeof i === "string")));
    for (const d of PARAMS) {
      if (d.render === false) continue;
      const n = inLayout.filter((p) => p === d.p).length;
      if (n !== 1) problems.push(d.p + " steht " + n + "-mal im Layout");
      const el = document.getElementById(d.id);
      if (!el) { problems.push(d.p + ": Element #" + d.id + " fehlt"); continue; }
      if (d.type === "ffz" || d.type === "zone") continue;
      if (!(el.labels && el.labels.length)) problems.push(d.p + ": ohne Beschriftung");
      if (d.type === "num" || d.type === "range") {
        for (const a of ["min", "max", "step"]) if (Number(el.getAttribute(a)) !== d[a]) problems.push(d.p + ": " + a + " " + el.getAttribute(a) + " ≠ " + d[a]);
      }
    }
    return problems;
  });
  assert.deepEqual(r, []);
});

test("Eingabe außerhalb der Grenzen: markiert, beim Verlassen begrenzt", async (page) => {
  await openVorgaben(page, "vol");
  await page.fill("#in-fillRack", "30");
  assert.equal(await page.evaluate(() => S.volume.fillRack), 85, "ungültiger Wert wird nicht übernommen");
  assert.equal(await page.getAttribute("#in-fillRack", "aria-invalid"), "true");
  assert.match(await page.getAttribute("#in-fillRack", "title"), /Zulässig: 40 bis 100 %/);
  await page.dispatchEvent("#in-fillRack", "change");
  assert.equal(await page.evaluate(() => S.volume.fillRack), 40);
  assert.equal(await page.inputValue("#in-fillRack"), "40");
  assert.equal(await page.getAttribute("#in-fillRack", "aria-invalid"), null);
});

test("Datenverlust behoben: Planung bleibt nach Fehleingabe und Neuladen erhalten", async (page) => {
  await withData(page);
  await openVorgaben(page, "vol");
  await page.fill("#in-fillRack", "30");
  await page.dispatchEvent("#in-fillRack", "change");
  await page.waitForTimeout(300);
  await page.reload();
  const r = await page.evaluate(() => [S.items.length, S.meta.name, S.volume.fillRack]);
  assert.deepEqual(r, [1, "Projekt X", 40]);
});

test("Browserspeicher mit Werten außerhalb: repariert statt verworfen, mit Hinweis", async (page) => {
  await withData(page);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem("trbp-state"));
    st.volume.fillRack = 30; st.block.channelDepth = 0.5; st.building.doors.N = -2;
    localStorage.setItem("trbp-state", JSON.stringify(st));
  });
  await page.reload();
  const r = await page.evaluate(() => [S.items.length, S.volume.fillRack, S.block.channelDepth, S.building.doors.N]);
  assert.deepEqual(r, [1, 40, 1, 0]);
  const notice = await page.textContent(".toast.notice");
  assert.match(notice, /3 Werte lagen außerhalb/);
  assert.match(notice, /Füllgrad Regal: 30 % → 40 %/);
});

for (const [what, tab, sel, val] of [["Einheitspreis", 5, "#bomBody input[data-price=frame]", "-5"], ["Artikellänge", 2, '#itemsBody input[data-k="l"]', "0"]]) {
  test(`Datenverlust behoben: ungültige(s) ${what} wird nicht übernommen`, async (page) => {
    await withData(page);
    await page.evaluate((t) => { S.items[0].skus = 0; renderItems(); recalc(); showTab(t); }, tab);
    const before = await page.inputValue(sel);
    await page.fill(sel, val);
    assert.equal(await page.getAttribute(sel, "aria-invalid"), "true");
    await page.dispatchEvent(sel, "change");
    assert.equal(await page.inputValue(sel), what === "Einheitspreis" ? "0" : before);
    await page.waitForTimeout(300);
    await page.reload();
    assert.equal(await page.evaluate(() => S.items.length), 1);
  });
}

test("Browserspeicher mit ungültigen Positionswerten: repariert statt verworfen", async (page) => {
  await withData(page);
  await page.evaluate(() => {
    const st = JSON.parse(localStorage.getItem("trbp-state"));
    st.items[0].l = 0; st.items[0].g = -10;
    localStorage.setItem("trbp-state", JSON.stringify(st));
  });
  await page.reload();
  assert.deepEqual(await page.evaluate(() => [S.items.length, S.items[0].l, S.items[0].g]), [1, 1, 0]);
  assert.match(await page.textContent(".toast.notice"), /Positionswerte: 2 außerhalb → begrenzt/);
});

test("Planungsdatei: Werte außerhalb werden angepasst, falsche Typen abgelehnt", async (page) => {
  const r = await page.evaluate(() => {
    const st = defaults();
    st.items = [Object.assign(newItem(), { name: "P" })];
    st.ffz.aisle = 9; st.volume.peak = 0.5;
    applyJson(JSON.stringify(st));
    const after = [S.ffz.aisle, S.volume.peak, document.querySelector(".toast.notice").textContent];
    const alerts = [];
    window.alert = (t) => alerts.push(t);
    const bad = defaults(); bad.items = []; bad.volume.fillRack = "85";
    applyJson(JSON.stringify(bad));
    return { after, alerts, fillRack: S.volume.fillRack };
  });
  assert.deepEqual(r.after.slice(0, 2), [6, 1]);
  assert.match(r.after[2], /2 Werte lagen außerhalb/);
  assert.equal(r.alerts.length, 1);
  assert.match(r.alerts[0], /volume\.fillRack muss eine endliche Zahl sein/);
  assert.equal(r.fillRack, 85, "abgelehnte Datei ändert nichts");
});

test("1+x-Felder: Anzeige x, gespeichert 1+x, begrenzt", async (page) => {
  await openVorgaben(page, "blk");
  await page.fill("#in-stackH", "3");
  assert.equal(await page.evaluate(() => S.block.stackH), 4);
  await page.fill("#in-stackH", "20");
  await page.dispatchEvent("#in-stackH", "change");
  assert.equal(await page.evaluate(() => S.block.stackH), 9);
  assert.equal(await page.inputValue("#in-stackH"), "8");
});

test("Lagerreichweite: Schieberegler und Zahlenfeld bleiben gleich", async (page) => {
  await openVorgaben(page, "vol");
  await page.fill("#num-range", "21");
  assert.equal(await page.evaluate(() => [S.volume.range, document.getElementById("in-range").value].join()), "21,21");
  assert.match(await page.textContent("#out-range"), /21,0 Tage/);
});

test("Sichtbarkeit aus dem Schema: Prozesspuffer nur im Prozessmodus", async (page) => {
  await openVorgaben(page, "vol");
  assert.equal(await page.isVisible("#in-buffer-trucks"), false);
  await page.selectOption("#sel-buffer-mode", "process");
  await page.waitForFunction(() => document.getElementById("in-buffer-trucks").offsetParent !== null);
});

test("Annahmenregister: alle Parameter mit lesbarer Bezeichnung", async (page) => {
  await withData(page);
  await page.evaluate(() => showTab(7));
  const labels = await page.$$eval("#reg-params tr", (rows) => rows.map((r) => r.cells[0].textContent.trim()));
  assert.ok(labels.length >= 80, "Zeilen: " + labels.length);
  assert.deepEqual(labels.filter((l) => /^[a-zA-Z]+(\.[a-zA-Z]+)+$/.test(l)), []);
});

test("Dateivergleich und Kundenbericht verwenden Schemabeschriftungen", async (page) => {
  await withData(page);
  const r = await page.evaluate(() => {
    const other = JSON.parse(JSON.stringify(S));
    other.volume.fillRack = 70;
    renderDiff(other);
    S.volume.fillRack = 80; recalc();
    return { diff: document.getElementById("diff-out").textContent, report: buildReportKundeHtml() };
  });
  assert.match(r.diff, /Füllgrad Regal\s*85 %\s*70 %/);
  assert.match(r.report, /<li>Füllgrad Regal: 80 % \(Planerannahme\)<\/li>/);
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("dialog", (d) => d.accept());
    try {
      await page.goto(FILE);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await t.fn(page);
      assert.deepEqual(errors, [], "Seitenfehler");
      console.log("ok   " + t.name);
    } catch (e) {
      failed++;
      console.log("FAIL " + t.name + "\n     " + String(e.message).split("\n").join("\n     "));
    } finally {
      await context.close();
    }
  }
  await browser.close();
  console.log(`\n${tests.length - failed}/${tests.length} Tests bestanden`);
  process.exit(failed ? 1 : 0);
})();
