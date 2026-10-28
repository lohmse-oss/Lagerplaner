// Tests zu Hallenmaßen (Greenfield-Proportion, Höchstmaße, Migration) und zur Gliederung der Vorgaben
// Ausführen: node tests/hallenmasse.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// Rechnet eine Greenfield-Halle; f skaliert den Bedarf
const hall = (page, building, f = 1) => page.evaluate(([building, f]) => {
  S = defaults();
  const mk = (name, trucks, stack, skus) => Object.assign(newItem(), { name, trucks: trucks * f, stack, skus });
  S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20), mk("C", 1, 2, 5)];
  Object.assign(S.building, { mode: "greenfield" }, building);
  const m = computeModel(), g = m.geo;
  return {
    found: !!(g.hallSearch && g.hallSearch.found), L: g.L / 1000, W: g.W / 1000, area: g.L * g.W / 1e6,
    prop: Math.max(g.L, g.W) / Math.min(g.L, g.W), feasible: assessModelFeasibility(m).feasible,
    warn: m.warn.map((w) => w.t),
  };
}, [building, f]);

test("Greenfield: kleinste Halle innerhalb des Seitenverhältnis-Bereichs", async (page) => {
  for (const f of [0.3, 1, 6]) {
    const range = await hall(page, {}, f);
    assert.ok(range.found && range.feasible, "Halle gefunden");
    assert.ok(range.prop >= 1 && range.prop <= 3 + 1e-9, "Proportion " + range.prop);
    for (const r of [1, 2, 3]) {
      const fixed = await hall(page, { ratioMin: r, ratioMax: r }, f);
      assert.ok(Math.abs(fixed.prop - r) < 0.05, `festes Verhältnis ${r}: ${fixed.prop}`);
      assert.ok(range.area <= fixed.area * 1.01, `Bereich ${range.area} m² > festes ${r}:1 ${fixed.area} m² (Bedarf ×${f})`);
    }
  }
});

test("Greenfield: Höchstmaße werden eingehalten, sonst harter Hinweis", async (page) => {
  const r = await hall(page, { maxL: 40, maxW: 80 });
  assert.ok(r.found && r.L <= 40 && r.W <= 80, `${r.L} × ${r.W}`);
  const none = await hall(page, { maxL: 30, maxW: 30 }, 6);
  assert.equal(none.found, false);
  assert.ok(none.warn.some((t) => /keine machbare Halle gefunden/.test(t)));
});

test("Greenfield: vorgegebene Länge mit Hinweis bei ungünstiger Proportion", async (page) => {
  const long = await hall(page, { gfShape: "length", L: 300 });
  assert.equal(long.L, 300);
  assert.ok(long.warn.some((t) => /Seitenverhältnis von 9,8 : 1 .* über dem zulässigen Bereich bis 3,00 : 1/.test(t)), long.warn.join("\n"));
  const ok = await hall(page, { gfShape: "length", L: 60 });
  assert.ok(!ok.warn.some((t) => /über dem zulässigen Bereich/.test(t)));
});

test("Greenfield-Optimierung bleibt schnell (begrenzte Hallensuche je Variante)", async (page) => {
  const r = await page.evaluate(() => {
    S = defaults();
    const mk = (name, trucks, stack, skus) => Object.assign(newItem(), { name, trucks, stack, skus });
    S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20), mk("C", 1, 2, 5)];
    S.building.mode = "greenfield";
    let calls = 0; const original = computeModel;
    computeModel = function () { calls++; return original(); };
    try { $("sel-goal").value = "capex"; optimizeLayout(); } finally { computeModel = original; }
    return { calls, rows: LAST_OPT_ROWS.length };
  });
  assert.ok(r.rows > 0);
  assert.ok(r.calls < 20000, "Modellaufrufe: " + r.calls);
});

test("Ältere Planungsdatei: festes Seitenverhältnis wird zu einem Bereich", async (page) => {
  const r = await page.evaluate(() => {
    const load = (ratio) => {
      const st = defaults(); delete st.building.gfShape; delete st.building.ratioMin; delete st.building.ratioMax;
      st.building.ratio = ratio; st.building.mode = "greenfield";
      st.items = [Object.assign(newItem(), { name: "P", trucks: 2 })];
      applyJson(JSON.stringify(st));
      return [S.building.gfShape, S.building.ratioMin, S.building.ratioMax, "ratio" in S.building];
    };
    return [load(0.5), load(1.5), load(0)];
  });
  assert.deepEqual(r, [["range", 2, 2, false], ["range", 1.5, 1.5, false], ["length", 1, 3, false]]);
});

test("Sprinkler-Freiraum und Bedienreserve in Metern, gespeichert in Millimetern", async (page) => {
  await page.evaluate(() => showTab(1));
  assert.equal(await page.inputValue("#in-sprinkler"), "0.5");
  await page.fill("#in-sprinkler", "0.8");
  assert.equal(await page.evaluate(() => S.fire.sprinkler), 800);
  await page.fill("#in-liftreserve", "5");
  assert.match(await page.getAttribute("#in-liftreserve", "title"), /Zulässig: 0,00 bis 1,00 m/);
  await page.dispatchEvent("#in-liftreserve", "change");
  assert.deepEqual(await page.evaluate(() => [S.ffz.liftReserve, document.getElementById("in-liftreserve").value]), [1000, "1"]);
});

test("Tore und Zonen in einer Tabelle je Hallenseite", async (page) => {
  await page.evaluate(() => showTab(1));
  const rows = await page.$$eval("#zone-grid tbody tr", (r) => r.map((x) => x.cells[0].textContent));
  assert.deepEqual(rows, ["Nord", "Ost", "Süd", "West"]);
  await page.fill("#in-doors-O", "3");
  await page.check("#in-zone-O-wa");
  assert.deepEqual(await page.evaluate(() => [S.building.doors.O, S.building.zones.O]), [3, "wa"]);
});

test("Gliederung: Halle mit Länge, Breite, UKB; Höhenkette; Ausrichtung und Miete verschoben", async (page) => {
  const r = await page.evaluate(() => {
    const sec = (g, t) => PARAM_LAYOUT.find((x) => x.id === g).sections.find((s) => s.title === t).items.filter((i) => typeof i === "string");
    return {
      halle: sec("gbp", "Halle").slice(0, 4),
      hoehe: sec("gbp", "Höhenkette"),
      regal: sec("ffz", "Regalsystem")[0],
      miete: sec("cost", "Hallenkosten"),
      balance: !!document.querySelector("#pg-gbp #height-balance"),
    };
  });
  assert.deepEqual(r.halle, ["building.mode", "building.L", "building.W", "building.ukb"]);
  assert.deepEqual(r.hoehe, ["fire.sprinkler", "fire.inRack", "ffz.liftHeight", "ffz.liftReserve", "block.maxTop"]);
  assert.equal(r.regal, "building.orient");
  assert.deepEqual(r.miete, ["building.rent"]);
  assert.equal(r.balance, true);
});

test("Höhenbilanz folgt der Berechnung", async (page) => {
  await page.evaluate(() => {
    S.items = [Object.assign(newItem(), { name: "A", trucks: 4, skus: 200 })];
    S.building.L = 80; S.building.W = 60;
    syncAll(); recalc(); showTab(1);
  });
  const text = await page.textContent("#height-balance");
  assert.doesNotMatch(text, /OK letzte Traversenebene0,00 m/);
  assert.doesNotMatch(text, /keine zulaessige Regalbemessung/);
});

test("Sichtbarkeit: Greenfield-Felder nur im Greenfield, Bereich nur ohne vorgegebene Länge", async (page) => {
  await page.evaluate(() => showTab(1));
  const vis = () => page.evaluate(() => ["sel-gfshape", "in-ratioMin", "in-ratioMax", "in-maxL", "in-maxW"].map((id) => !!document.getElementById(id).offsetParent));
  assert.deepEqual(await vis(), [false, false, false, false, false]);
  await page.selectOption("#sel-mode", "greenfield");
  assert.deepEqual(await vis(), [true, true, true, true, true]);
  assert.equal(await page.isDisabled("#in-L"), true);
  await page.selectOption("#sel-gfshape", "length");
  assert.deepEqual(await vis(), [true, false, true, false, true]);
  assert.equal(await page.isDisabled("#in-L"), false);
});

test("Stapelhöhen einheitlich als 1 + x", async (page) => {
  await page.evaluate(() => showTab(1));
  await page.click("#ptab-blk");
  assert.equal(await page.textContent("#pg-blk .plusx-in > span"), "1 +");
  assert.equal(await page.inputValue("#in-stackH"), "5");
  assert.equal(await page.evaluate(() => paramShow(PARAM_BY_PATH.get("block.stackH"), 6)), "1+5");
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
