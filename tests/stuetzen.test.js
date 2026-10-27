// Tests zu Hallenstützen: Greenfield-Hallensuche und Stützenausgleich im Bestandsmodus
// Ausführen: node tests/stuetzen.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// Rechnet einen Fall im Seitenkontext; items: [name, LKW/Tag, Stapelfaktor, Artikel]
const run = (page, items, building) => page.evaluate(([items, building]) => {
  S = defaults();
  S.items = items.map(([name, trucks, stack, skus]) => Object.assign(newItem(), { name, trucks, stack, skus }));
  Object.assign(S.building, building);
  const m = computeModel(), c = capacitySummary(m), f = assessModelFeasibility(m);
  return {
    found: !!(m.geo.hallSearch && m.geo.hallSearch.found), L: m.geo.L / 1000, W: m.geo.W / 1000,
    rack: [m.grossRackNeed, c.rackAvailable], block: [m.grossBlockNeed, c.blockAvailable],
    feasible: f.feasible, reasons: f.reasons.map((x) => x.code), compensation: m.geo.compensation,
    removedFields: m.geo.rackInventory ? m.geo.rackInventory.removedFieldIds.length : 0,
    blockedLanes: m.geo.blockChannelPlan.blockedCount,
    channelsOnBlockedLanes: m.geo.blockChannelPlan.assignments.filter((a) => a.placed && m.geo.blockChannelPlan.lanes[a.lane].blocked).length,
    warn: m.warn.map((w) => w.t),
  };
}, [items, building]);

const CASES = {
  "Regal und Block": [["A", 4, 1, 200], ["B", 2, 3, 20], ["C", 1, 2, 5]],
  "großes Blocklager": [["X", 6, 3, 30], ["Y", 3, 2, 8]],
  "reines Regallager": [["R", 8, 1, 0]],
};

for (const [name, items] of Object.entries(CASES)) {
  test(`Greenfield findet eine Halle trotz Stützen: ${name}`, async (page) => {
    const withCols = await run(page, items, { mode: "greenfield" });
    const noCols = await run(page, items, { mode: "greenfield", gridX: 1000, gridY: 1000 });
    assert.equal(withCols.found, true);
    assert.equal(withCols.feasible, true, withCols.reasons.join());
    assert.deepEqual([withCols.L, withCols.W], [noCols.L, noCols.W], "Stützenraster bestimmt die Hallengröße nicht");
    assert.equal(withCols.removedFields + withCols.blockedLanes, 0, "kein Stützenabzug im Greenfield");
  });
}

test("Greenfield: Stützenkollisionen erscheinen als Hinweis", async (page) => {
  const r = await run(page, CASES["reines Regallager"], { mode: "greenfield" });
  assert.ok(r.warn.some((t) => /^Greenfield: \d+ Stützen des Rasters 12,0 × 24,0 m treffen/.test(t)), r.warn.join("\n"));
});

test("Bestand: blockierte Kanalplätze werden übersprungen und ersetzt", async (page) => {
  const r = await run(page, CASES["Regal und Block"], { L: 60, W: 60 });
  assert.ok(r.blockedLanes > 0, "Testfall braucht blockierte Plätze");
  assert.equal(r.channelsOnBlockedLanes, 0, "kein Kanal auf einem blockierten Platz");
  assert.ok(r.block[1] >= r.block[0], `Block ${r.block[1]} < Bedarf ${r.block[0]}`);
  assert.equal(r.feasible, true, r.reasons.join());
  assert.ok(r.compensation.lanes >= r.blockedLanes);
  assert.ok(r.warn.some((t) => /^Stützenausgleich: \d+ durch Stützen blockierte Kanalplätze übersprungen/.test(t)));
});

test("Bestand: entfernte Regalfelder werden durch eine Doppelreihe ausgeglichen", async (page) => {
  const r = await run(page, [["R", 5, 1, 0]], { L: 80, W: 80, gridX: 6, gridY: 12 });
  assert.ok(r.removedFields > 0);
  assert.ok(r.rack[1] >= r.rack[0], `Regal ${r.rack[1]} < Bedarf ${r.rack[0]}`);
  assert.equal(r.compensation.rows, 1);
  assert.ok(!r.reasons.includes("RACK_DEFICIT"));
});

test("Bestand: ohne Platz bleibt die Unterdeckung sichtbar", async (page) => {
  const r = await run(page, CASES["reines Regallager"], { L: 80, W: 38, gridX: 10, gridY: 20 });
  assert.ok(r.reasons.includes("RACK_DEFICIT"));
});

test("Bestand: Stützen in Gängen bleiben harte Konflikte", async (page) => {
  const r = await run(page, CASES["reines Regallager"], { L: 80, W: 60, gridX: 10, gridY: 20 });
  assert.ok(r.reasons.includes("HARD_CONFLICT"));
  assert.ok(r.warn.some((t) => /Stuetzen liegen in Verkehrs-\/Arbeitsgaengen/.test(t)));
});

test("Zeichnung und Bericht mit übersprungenen Kanalplätzen", async (page) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.evaluate(() => {
    S = defaults();
    S.items = [["A", 4, 1, 200], ["B", 2, 3, 20], ["C", 1, 2, 5]].map(([name, trucks, stack, skus]) => Object.assign(newItem(), { name, trucks, stack, skus }));
    S.building.W = 60;
    syncAll(); renderItems(); recalc(); showTab(3); showTab(9);
  });
  assert.match(await page.textContent("#rep-int-body"), /Von Stützen blockierte und übersprungene Kanalplätze: \d+ \(Platz-Nr\./);
  assert.deepEqual(errors, []);
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
