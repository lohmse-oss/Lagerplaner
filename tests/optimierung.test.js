// Tests der Layout-Optimierung: Ziele, Hallenmaße je Modus, Regalbelegung "Halle füllen"
// Ausführen: node tests/optimierung.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// Bestandshalle ohne Stützenkonflikte (Raster außerhalb der Halle), damit "Halle füllen" machbar ist
const BESTAND = { L: 80, W: 60, gridX: 1000, gridY: 1000 };

// Optimiert synchron im Seitenkontext und liefert die Variantenliste
const optimize = (page, goal, building) => page.evaluate(([goal, building]) => {
  S = defaults();
  const mk = (name, trucks, stack, skus) => Object.assign(newItem(), { name, trucks, stack, skus });
  S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20), mk("C", 1, 2, 5)];
  Object.assign(S.building, building);
  syncAll(); refreshModeUI(); recalc();
  $("sel-goal").value = goal;
  optimizeLayout();
  return { rows: LAST_OPT_ROWS, goal: LAST_OPT_GOAL, before: JSON.parse(JSON.stringify(S)) };
}, [goal, building]);

test("Menü: drei Ziele, keine Parameter-Kontrollkästchen", async (page) => {
  const goals = await page.$$eval("#sel-goal option", (o) => o.map((x) => x.value));
  assert.deepEqual(goals, ["capex", "density", "capacity"]);
  assert.equal(await page.$$eval("[id^=chk-opt-]", (c) => c.length), 0);
});

test("Minimaler CAPEX: erste Variante hat den kleinsten CAPEX", async (page) => {
  const { rows } = await optimize(page, "capex", BESTAND);
  assert.ok(rows.length > 3);
  assert.equal(rows[0].capex, Math.min(...rows.map((r) => r.capex)));
  assert.ok(rows.every((r) => r.fill === "need" && r.deck >= 100));
});

test("Flächennutzungsgrad: Plätze je m² belegter Lagerfläche, absteigend", async (page) => {
  const { rows } = await optimize(page, "density", BESTAND);
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i - 1].density >= rows[i].density);
  const r = rows[0];
  assert.ok(Math.abs(r.density - r.places / r.storeA) < 1e-9);
  assert.ok(r.storeA < r.area, "belegte Lagerfläche kleiner als die Halle");
});

test("Maximale Lagerkapazität: Halle mit Regal gefüllt, mehr Plätze als nach Bedarf", async (page) => {
  const need = await optimize(page, "capex", BESTAND);
  const full = await optimize(page, "capacity", BESTAND);
  assert.ok(full.rows.every((r) => r.fill === "hall"));
  assert.equal(full.rows[0].places, Math.max(...full.rows.map((r) => r.places)));
  assert.ok(full.rows[0].places > Math.max(...need.rows.map((r) => r.places)));
  assert.deepEqual([full.rows[0].hallL, full.rows[0].hallW], [80, 60], "Hallenmaße bleiben fest");
});

test("Optimierung verändert keine Vorgaben (Gang, Stapelhöhe, Tunnel, Zonen, Raster, Quote)", async (page) => {
  const { before } = await optimize(page, "density", BESTAND);
  const after = await page.evaluate(() => JSON.parse(JSON.stringify(S)));
  assert.deepEqual(after, before, "Projektstand bleibt bis zur Übernahme unverändert");
  const keys = await page.evaluate(() => Object.keys(LAST_OPT_ROWS[0]));
  for (const k of ["ai", "sh", "ti", "zd", "q", "gx", "gy"]) assert.ok(!keys.includes(k), k);
});

test("Übernahme einer Kapazitätsvariante setzt die Regalbelegung auf Halle füllen", async (page) => {
  const { rows } = await optimize(page, "capacity", BESTAND);
  const r = await page.evaluate(() => {
    applyOptimizationRow(LAST_OPT_ROWS[0]);
    return { fill: S.ffz.rackFill, places: capacitySummary(R).rackAvailable + capacitySummary(R).blockAvailable, undo: UNDO.length };
  });
  assert.deepEqual(r, { fill: "hall", places: rows[0].places, undo: 1 });
  await page.evaluate(() => showTab(1));
  await page.click("#ptab-ffz");
  assert.equal(await page.inputValue("#sel-rackfill"), "hall");
});

test("Greenfield: Kapazitätsziel gesperrt, Hallenmaße je Variante", async (page) => {
  const { rows, goal } = await optimize(page, "density", { mode: "greenfield" });
  assert.equal(goal, "density");
  assert.ok(new Set(rows.map((r) => r.hallW)).size > 1, "unterschiedliche Hallenmaße");
  assert.equal(await page.$eval('#sel-goal option[value="capacity"]', (o) => o.disabled), true);
  const alerts = await page.evaluate(() => {
    const seen = []; window.alert = (t) => seen.push(t);
    $("sel-goal").querySelector('option[value="capacity"]').disabled = false;
    $("sel-goal").value = "capacity";
    return [startOptimizationRun(), seen];
  });
  assert.equal(alerts[0], false);
  assert.match(alerts[1][0], /feste Hallenmaße/);
});

test("Ohne machbare Variante wird der häufigste Ausschlussgrund genannt", async (page) => {
  const { rows } = await optimize(page, "capacity", { L: 80, W: 60 });
  assert.equal(rows.length, 0);
  assert.match(await page.textContent("#opt-body"), /Häufigster Ausschlussgrund \(\d+ von \d+ Varianten\): .*Stützen/);
});

test("Regalbelegung nur in der Bestandshalle sichtbar", async (page) => {
  await page.evaluate(() => showTab(1));
  await page.click("#ptab-ffz");
  assert.equal(await page.isVisible("#sel-rackfill"), true);
  await page.click("#ptab-gbp");
  await page.selectOption("#sel-mode", "greenfield");
  await page.click("#ptab-ffz");
  assert.equal(await page.isVisible("#sel-rackfill"), false);
});

test("Worker-Lauf mit Ziel Flächennutzungsgrad", async (page) => {
  await page.evaluate(() => {
    const mk = (name, trucks, stack, skus) => Object.assign(newItem(), { name, trucks, stack, skus });
    S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20)];
    Object.assign(S.building, { L: 80, W: 60, gridX: 1000, gridY: 1000 });
    syncAll(); recalc();
    $("sel-goal").value = "density";
    startOptimizationRun();
  });
  await page.waitForFunction(() => /abgeschlossen|fehlgeschlagen/.test(document.getElementById("opt-run-status").textContent), null, { timeout: 30000 });
  assert.match(await page.textContent("#opt-run-status"), /abgeschlossen: [1-9]\d* Vorschläge/);
  assert.match(await page.textContent("#opt-summary"), /Ziel Maximaler Flächennutzungsgrad .* Pl\.\/m²/);
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
