// Tests der Darstellungssteuerung in Lagerplaner.html (nur sichtbare Register zeichnen, CAPEX, Szenarien)
// Ausführen: node tests/darstellung.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const withData = (page, n) => page.evaluate((count) => {
  const mk = (i) => Object.assign(newItem(), { name: "P" + i, trucks: 1 + (i % 4), stack: 1 + (i % 3), skus: 10 + i });
  S.items = Array.from({ length: count || 2 }, (_, i) => mk(i));
  S.building.L = 80; S.building.W = 60;
  syncAll(); renderItems(); recalc();
}, n);

// Zählt Aufrufe einer globalen Funktion; recalc und showTab greifen über PANEL_RENDERERS auf sie zu
const countCalls = (page, names) => page.evaluate((list) => {
  window.__calls = {};
  for (const name of list) {
    window.__calls[name] = 0;
    for (const steps of Object.values(PANEL_RENDERERS)) steps.forEach((f, i) => {
      if (f.name === name) steps[i] = function () { window.__calls[name]++; return f.apply(this, arguments); };
    });
  }
}, names);

test("Verdeckte Register werden nicht neu gezeichnet", async (page) => {
  await withData(page);
  await countCalls(page, ["renderReports", "renderRegister", "renderBOM", "renderScenarios", "updateAllCalc"]);
  for (let i = 0; i < 5; i++) await page.evaluate(() => recalc());
  assert.deepEqual(await page.evaluate(() => window.__calls), { renderReports: 0, renderRegister: 0, renderBOM: 0, renderScenarios: 0, updateAllCalc: 0 });
});

test("Beim Öffnen wird ein veraltetes Register einmal gezeichnet", async (page) => {
  await withData(page);
  await countCalls(page, ["renderReports"]);
  await page.evaluate(() => { S.volume.fillRack = 80; recalc(); recalc(); showTab(9); });
  assert.equal(await page.evaluate(() => window.__calls.renderReports), 1);
  assert.match(await page.textContent("#rep-cust-body"), /Füllgrad Regal: 80 %/);
  await page.evaluate(() => { showTab(1); showTab(9); });
  assert.equal(await page.evaluate(() => window.__calls.renderReports), 1, "unverändert: kein zweites Zeichnen");
});

test("Sichtbares Register wird bei jeder Neuberechnung aktualisiert", async (page) => {
  await withData(page);
  await page.evaluate(() => showTab(2));
  await page.evaluate(() => { S.items[0].trucks = 10; recalc(); });
  const net = await page.textContent('#itemsBody .calc-net[data-i="0"]');
  assert.equal(net, await page.evaluate(() => fmt(S.items[0].net)));
});

test("CAPEX: Kennzahl, Stückliste, CSV und Bericht stimmen überein", async (page) => {
  await withData(page);
  await page.evaluate(() => { S.costMeta.realizationYears = 2; S.costMeta.priceEscalation = 5; S.costMeta.projectOverhead = 10; syncAll(); recalc(); showTab(5); });
  const r = await page.evaluate(() => ({ total: R.capex.total, calc: calculateCapex(R.bom).total, bom: document.getElementById("bom-total").textContent, eur: eur(R.capex.total) }));
  assert.equal(r.total, r.calc);
  assert.equal(r.bom, r.eur);
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#btn-bom-csv")]);
  const csv = require("fs").readFileSync(await download.path(), "utf8");
  const line = csv.split("\r\n").find((l) => l.startsWith('"CAPEX gesamt"'));
  assert.equal(line.split(";").pop(), String(Math.round(r.total * 100) / 100).replace(".", ","));
  assert.match(csv, /Preissteigerung bis Realisierung/);
  assert.match(csv, /Projektnebenkosten/);
});

test("Szenarien ohne Kennzahlen werden beim Laden nachgerechnet, nicht beim Zeichnen", async (page) => {
  await withData(page);
  const r = await page.evaluate(() => {
    saveScenario(1);
    const file = JSON.parse(JSON.stringify(S));
    file.scenarios[0].metrics = {};
    applyJson(JSON.stringify(file));
    const metrics = S.scenarios[0].metrics;
    let calls = 0;
    const orig = computeModel;
    computeModel = function () { calls++; return orig.apply(this, arguments); };
    renderScenarios();
    computeModel = orig;
    return { capex: metrics.capex, capexPP: metrics.capexPP, callsWhileRendering: calls };
  });
  assert.ok(r.capex > 0 && r.capexPP > 0, JSON.stringify(r));
  assert.equal(r.callsWhileRendering, 0);
});

test("Rechenmodell: gleiche Ergebnisse ohne Szenario-Kopien", async (page) => {
  await withData(page, 20);
  const r = await page.evaluate(() => {
    const pick = (m) => JSON.stringify([m.netTotal, m.grossRackNeed, m.grossBlockNeed, m.geo.capacity, m.geo.L, m.geo.W, m.bom]);
    S.building.mode = "greenfield";
    const before = pick(computeModel());
    for (let i = 1; i <= 3; i++) saveScenario(i);
    const copy = modelStateCopy(S);
    return { same: before === pick(computeModel()), scen: copy.scenarios.length, src: Object.keys(copy.parameterSources).length };
  });
  assert.deepEqual(r, { same: true, scen: 0, src: 0 });
});

test("Interner Bericht: Kanalzuordnung je Positionsgruppe", async (page) => {
  await withData(page, 60);
  await page.evaluate(() => showTab(9));
  const r = await page.evaluate(() => {
    const table = [...document.querySelectorAll("#rep-int-body table")].find((t) => /Positionsgruppe/.test(t.textContent));
    return { rows: table.tBodies[0].rows.length, groups: R.block.channelGroups.length, channels: R.block.nL };
  });
  assert.equal(r.rows, r.groups);
  assert.ok(r.channels > r.groups, JSON.stringify(r));
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
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
