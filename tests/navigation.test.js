// Tests zu Einstieg und Navigation: Startseite, Vorgaben als eine Seite mit Feldsuche, benannte Szenarien
// Ausführen: node tests/navigation.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const progress = (page) => page.$$eval("#start-progress li", (li) => li.map((x) => [x.className, x.querySelector("b").textContent, x.querySelector(".t").textContent]));

test("Startseite: Einstiege und Fortschritt im leeren Projekt", async (page) => {
  for (const id of ["start-paste", "start-open", "start-csv", "start-example"]) assert.equal(await page.isVisible("#" + id), true, id);
  const p = await progress(page);
  assert.deepEqual(p.map((x) => x[1]), ["Positionen erfassen", "Halle festlegen", "Annahmen belegen", "Ergebnis prüfen"]);
  assert.deepEqual(p.map((x) => x[0]), ["open", "", "done", ""]);
  assert.match(p[1][2], /Standardwerte prüfen/);
});

test("Beispielprojekt: machbar, ohne kritische Hinweise, Fortschritt vollständig, rückgängig", async (page) => {
  await page.click("#start-example");
  const r = await page.evaluate(() => ({ n: S.items.length, feasible: assessModelFeasibility(R).feasible, sev: R.warn.filter((w) => w.sev).length, gf: S.building.mode }));
  assert.deepEqual(r, { n: 6, feasible: true, sev: 0, gf: "greenfield" });
  const p = await progress(page);
  assert.deepEqual(p.map((x) => x[0]), ["done", "done", "done", "done"]);
  assert.match(p[3][2], /^(Grün|Gelb · Hinweise offen)/);
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.items.length), 0);
});

test("Fortschritt: geänderte Vorgabe ohne Quelle hält „Annahmen belegen“ offen", async (page) => {
  await page.evaluate(() => { S.items = [Object.assign(newItem(), { name: "A", trucks: 2 })]; S.volume.fillRack = 80; syncAll(); renderItems(); recalc(); });
  const p = await progress(page);
  assert.deepEqual(p[2], ["open", "Annahmen belegen", "0 von 1 geänderten Vorgaben mit Quelle"]);
  await page.click('#start-progress li:nth-child(3) .linkbtn');
  assert.equal(await page.evaluate(() => document.querySelector("#tabs [data-tab].on").dataset.tab), "7");
});

test("Vorgaben auf einer Seite: Sprung zum Bereich und mitlaufende Markierung", async (page) => {
  await page.evaluate(() => showTab(1));
  const visible = await page.$$eval("#pgroups .pgroup", (g) => g.map((x) => !!x.offsetParent));
  assert.ok(visible.every(Boolean), "alle Bereiche sichtbar");
  await page.click("#ptab-blk");
  const r = await page.evaluate(() => [document.getElementById("pg-blk").getBoundingClientRect().top - document.getElementById("panels").getBoundingClientRect().top, document.getElementById("ptab-blk").getAttribute("aria-current")]);
  assert.ok(r[0] >= 0 && r[0] < 120, "Bereich oben: " + r[0]);
  assert.equal(r[1], "true");
  await page.waitForTimeout(450);
  await page.evaluate(() => document.getElementById("pg-vol").scrollIntoView({ block: "start" }));
  await page.waitForFunction(() => document.getElementById("ptab-vol").getAttribute("aria-current") === "true", null, { timeout: 2000 });
});

test("Feldsuche: Treffer, ausgeblendete Abschnitte, Esc leert", async (page) => {
  await page.evaluate(() => showTab(1));
  await page.fill("#param-search", "füllgrad");
  assert.equal(await page.textContent("#param-search-count"), "3 Treffer");
  const shown = await page.$$eval(".fld.pfld", (f) => f.filter((x) => x.offsetParent).map((x) => x.dataset.p));
  assert.deepEqual(shown, ["volume.fillRack", "volume.fillBlock", "block.minFill"]);
  assert.equal(await page.isVisible("#pg-gbp"), false);
  assert.equal(await page.isVisible("#pg-pal"), false);
  await page.fill("#param-search", "tore");
  assert.equal(await page.isVisible("#zone-grid"), true);
  await page.fill("#param-search", "gewicht");
  assert.equal(await page.isVisible("#zone-grid"), false);
  await page.focus("#param-search"); await page.keyboard.press("Escape");
  assert.equal(await page.inputValue("#param-search"), "");
  assert.equal(await page.isVisible("#pg-gbp"), true);
});

test("Szenarien mit Namen und hervorgehobenen Abweichungen", async (page) => {
  await page.click("#start-example");
  await page.evaluate(() => showTab(6));
  await page.fill('[data-scen-name="2"]', "Schmalgang");
  await page.click('[data-scen-save="2"]');
  assert.equal(await page.textContent("#scen-h2"), "Schmalgang");
  assert.match(await page.textContent("#sel-scenario-load"), /Schmalgang/);
  assert.equal(await page.$$eval("#scen-body td.diff", (x) => x.length), 0);
  await page.evaluate(() => { S.volume.range = 14; recalc(); renderScenarios(); });
  assert.ok(await page.$$eval("#scen-body td.diff", (x) => x.length) > 0, "Abweichungen markiert");
  await page.fill('[data-scen-name="2"]', "Schmalgang VNA");
  await page.dispatchEvent('[data-scen-name="2"]', "change");
  assert.equal(await page.textContent("#scen-h2"), "Schmalgang VNA");
  await page.click('[data-scen-save="1"]');
  assert.equal(await page.textContent("#scen-h1"), "Variante 1");
});

test("Ältere Szenarien ohne Namen bleiben ladbar", async (page) => {
  const r = await page.evaluate(() => {
    const st = defaults(); st.items = [Object.assign(newItem(), { name: "P", trucks: 2 })];
    st.scenarios = [{ stand: "1.1.2026", projekt: "Alt", metrics: {}, data: JSON.parse(JSON.stringify(Object.assign({}, st, { scenarios: undefined }))) }, null, null];
    applyJson(JSON.stringify(st)); showTab(6);
    return document.getElementById("scen-h1").textContent;
  });
  assert.equal(r, "Slot 1 · Alt");
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
