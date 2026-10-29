// Tests mit den Testdateien in testdaten/: Planungsdatei, Eingabedatei und CSV über die Menüs laden
// Ausführen: node tests/testdaten.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");
const DATA = (f) => path.resolve(__dirname, "..", "testdaten", f);

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const choose = async (page, menu, button, file) => {
  if (menu) await page.click(menu);
  const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click(button)]);
  await chooser.setFiles(file);
  await page.waitForTimeout(300);
};
const summary = (page) => page.evaluate(() => ({
  n: S.items.length, mode: S.building.mode, feasible: assessModelFeasibility(R).feasible,
  demands: [...new Set(S.items.map((i) => i.demand))].sort(), trucks: [...new Set(S.items.map((i) => i.truck))].sort(),
  lhm: [...new Set(S.items.map((i) => i.lhm))].sort(), net: R.netTotal,
}));

test("Planungsdatei: alle Bedarfsarten, Paletten- und LKW-Typen, Überschreibungen, machbar", async (page) => {
  await choose(page, "#btn-dd-file", "#btn-load", DATA("testprojekt-kombinationen.json"));
  const r = await summary(page);
  assert.equal(r.n, 16);
  assert.equal(r.mode, "box-fit");
  assert.equal(r.feasible, true);
  assert.deepEqual(r.demands, ["pallets", "pieces", "stock", "truck"]);
  assert.deepEqual(r.trucks, ["7.5t", "giga", "jumbo", "mega", "sonder", "standard", "wechsel"]);
  assert.deepEqual(r.lhm, ["euro", "gitterbox", "half", "indu"]);
  const x = await page.evaluate(() => ({ trk: S.truckOverrides, lhm: S.lhmOverrides, kind: S.costMeta.sourceKind, src: Object.keys(S.parameterSources).length, empty: S.empty.on, transit: S.volume.transitBufferOn, buffer: S.volume.bufferMode }));
  assert.deepEqual(x, { trk: { standard: { fl: 13.6 } }, lhm: { indu: { g: 520 } }, kind: "angebot", src: 7, empty: true, transit: true, buffer: "process" });
  // Quelle mit seither geändertem Wert ist als veraltet markiert
  await page.evaluate(() => showTab(1));
  assert.match(await page.textContent('.pmeta[data-pmeta="volume.transit"]'), /Kunde !/);
});

test("Planungsdatei: drei Szenarien laden und bleiben machbar", async (page) => {
  await choose(page, "#btn-dd-file", "#btn-load", DATA("testprojekt-kombinationen.json"));
  const names = await page.evaluate(() => S.scenarios.map((s) => s && s.name));
  assert.deepEqual(names, ["Bestand Basis", "Greenfield · Block manuell · Zugang West", "Bestand VNA · Feldweite fest · In-Rack"]);
  for (const i of [1, 2, 3]) {
    const r = await page.evaluate((i) => { restoreScenario(i); return { mode: S.building.mode, feasible: assessModelFeasibility(R).feasible, block: S.block.mode, ffz: S.ffz.rackFFZ.join() }; }, i);
    assert.equal(r.feasible, true, "Szenario " + i);
    if (i === 2) assert.deepEqual([r.mode, r.block], ["greenfield", "manual"]);
    if (i === 3) assert.equal(r.ffz, "vna");
  }
});

test("Volumenquote: Hinweis nennt nicht stapelbare Ware als Ursache", async (page) => {
  await choose(page, "#btn-dd-file", "#btn-load", DATA("testprojekt-kombinationen.json"));
  const flat = () => page.evaluate(() => { recalc(); const w = R.warn.find((x) => /^Nicht stapelbare Ware im Blocklager/.test(x.t)); return w ? [w.sev, w.t] : null; });
  assert.equal(await flat(), null, "Schätzmodell: keine Meldung");
  // Hohe Quote: Block verdrängt das Regal, Hinweis ist kritisch und nennt die Abhilfe
  await page.evaluate(() => { S.block.mode = "quota"; S.block.quota = 35; });
  const high = await flat();
  assert.equal(high[0], true);
  assert.match(high[1], /: 10 Positionen .* stehen mit [\d.]+ Paletten im Block, je Platz eine Palette\. Die Volumenquote \(35 %\) gilt .* Die Blockfläche verdrängt das Regal\. Abhilfe: Quote senken/);
  // Niedrige Quote: Hinweis bleibt, aber nicht kritisch
  await page.evaluate(() => { S.block.quota = 5; });
  const low = await flat();
  assert.equal(low[0], false);
  assert.doesNotMatch(low[1], /verdrängt/);
  // Manuell: nur Positionen mit Blockanteil zählen; im Testprojekt sind sie alle stapelbar
  await page.evaluate(() => { S.block.mode = "manual"; });
  assert.equal(await flat(), null);
  await page.evaluate(() => { S.items[0].blockShare = 40; });
  assert.match((await flat())[1], /^Nicht stapelbare Ware im Blocklager: 1 Position .* steht mit .* Blockanteil dieser Positionen auf 0 setzen/);
});

test("Eingabedatei: Positionen und Vorgaben wie in der Planungsdatei", async (page) => {
  await choose(page, "#btn-dd-file", "#btn-reload-input", DATA("tender-input-kombinationen.js"));
  const r = await summary(page);
  assert.equal(r.n, 16);
  assert.equal(r.feasible, true);
  assert.deepEqual(await page.evaluate(() => [S.truckOverrides, Object.keys(S.customLhm), Object.keys(S.customTrucks).sort()]), [{ standard: { fl: 13.6 } }, ["gitterbox"], ["sonder", "wechsel"]]);
});

test("CSV: Bezeichnungen, deutsche Zahlen, 1+x, leere Zellen, Anführungszeichen", async (page) => {
  await choose(page, "#btn-dd-file", "#btn-menu-csv", DATA("mengengeruest-kombinationen.csv"));
  const r = await summary(page);
  assert.equal(r.n, 15);
  assert.deepEqual(r.demands, ["pallets", "pieces", "stock", "truck"]);
  assert.deepEqual(r.trucks, ["7.5t", "giga", "jumbo", "mega", "sonder", "standard"]);
  const it = await page.evaluate(() => S.items.map((i) => [i.name, i.demand, i.trucks, i.palletsDay, i.pcsDay, i.targetStock, i.skus, i.h, i.g, i.stack, i.blockShare, i.dataBasis, i.pptManual ? i.ppt : null]));
  assert.deepEqual(it[1].slice(0, 3), ["C02 LKW Industrie Mega 2 Lagen", "truck", 1.5]);
  assert.equal(it[1][7], 1050);
  assert.deepEqual(it[4].slice(-1), [40]);
  assert.equal(it[7][3], 25.5);
  assert.equal(it[10][4], 4000);
  assert.equal(it[12][0], "C13 Ziel-Bestand; mit Semikolon im Namen");
  assert.deepEqual([it[6][9], it[8][9]], [4, 3], "1+3 und Gesamtzahl 3");
  assert.deepEqual(it[14].slice(1, 3), ["truck", 1], "leere Zeile übernimmt Standardwerte");
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("dialog", (d) => { if (d.type() === "alert") errors.push("Meldung: " + d.message()); d.accept(); });
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
