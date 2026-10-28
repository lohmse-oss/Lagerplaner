// Rechenlogik-Tests für Lagerplaner.html
// Ausführen: node tests/rechenlogik.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

// Jeder Test läuft im Seitenkontext auf einem frischen Planungsstand.
const inPage = (page, fn, arg) => page.evaluate(
  ([src, a]) => {
    S = defaults();
    const mk = (props) => Object.assign(newItem(), props);
    return new Function("mk", "arg", "return (" + src + ")(mk, arg);")(mk, a);
  },
  [fn.toString(), arg]
);

test("A1: Paletten je LKW folgen Maß- und Gewichtsänderungen", async (page) => {
  const r = await inPage(page, (mk) => {
    S.items = [mk({ name: "X", demand: "truck", trucks: 1, truck: "standard" })];
    recalc();
    const before = [S.items[0].ppt, R.netTotal];
    S.items[0].h = 2000; S.items[0].g = 1200;
    recalc();
    return { before, after: [S.items[0].ppt, R.netTotal] };
  });
  assert.deepEqual(r.before, [33, 330]);
  assert.deepEqual(r.after, [20, 200]);
});

test("A1: bewusst überschriebener Wert bleibt erhalten und wird gemeldet", async (page) => {
  const r = await inPage(page, (mk) => {
    S.items = [mk({ name: "X", demand: "truck", trucks: 1, truck: "standard", ppt: 30, pptManual: true, h: 2000, g: 1200 })];
    recalc();
    return { ppt: S.items[0].ppt, net: R.netTotal, warn: R.warn.some((w) => /Manuell gesetzte 30 Paletten/.test(w.t)) };
  });
  assert.deepEqual(r, { ppt: 30, net: 300, warn: true });
});

test("A1: CSV-Spalte Paletten je LKW gilt als Überschreibung", async (page) => {
  const r = await inPage(page, () => {
    const it = parseCsv("Bezeichnung;LKW/Tag;Paletten je LKW\nA;1;30")[0];
    return [it.ppt, it.pptManual];
  });
  assert.deepEqual(r, [30, true]);
});

test("A2: Mega-Trailer lädt nicht stapelbare Ware einlagig", async (page) => {
  const r = await inPage(page, () => {
    const euro = Object.assign({}, getLhm("euro"), { h: 1000, g: 300 });
    return [fillTruck("mega", Object.assign({}, euro, { stack: 1 })), fillTruck("mega", Object.assign({}, euro, { stack: 2 }))];
  });
  assert.deepEqual(r, [33, 66]);
});

test("A3: LKW/Tag enthält das Wachstum in allen Ermittlungsmodi", async (page) => {
  const r = await inPage(page, (mk) => {
    S.volume.planningYears = 10; S.volume.growthRate = 5;
    S.items = [mk({ name: "T", demand: "truck", trucks: 1 }), mk({ name: "P", demand: "pallets", palletsDay: 33 })];
    recalc();
    return R.calculatedItems.map((i) => [+i.trucksDay.toFixed(2), i.net]);
  });
  assert.deepEqual(r, [[1.63, 538], [1.63, 538]]);
});

test("A4: Quotenmodus plant artikelreine Kanäle", async (page) => {
  const r = await inPage(page, (mk) => {
    S.block.mode = "quota"; S.block.quota = 50;
    S.items = [mk({ name: "Q", demand: "truck", trucks: 1, skus: 60, stack: 3 })];
    recalc();
    return { gross: R.grossBlockNeed, skus: R.calculatedItems[0].blockSkus, channels: R.block.nL };
  });
  assert.deepEqual(r, { gross: 236, skus: 30, channels: 30 });
});

test("A4: ohne Artikelanzahl bleibt die Kanalzahl volumenbasiert", async (page) => {
  const r = await inPage(page, (mk) => {
    S.block.mode = "quota"; S.block.quota = 50;
    S.items = [mk({ name: "Q", demand: "truck", trucks: 1, stack: 3 })];
    recalc();
    return R.block.nL;
  });
  assert.equal(r, 14);
});

test("A5: Kanaltiefe gleich in Kapazität und Geometrie", async (page) => {
  const r = await inPage(page, (mk) => {
    S.block.mode = "quota"; S.block.quota = 50; S.block.channelDepth = 6.6;
    S.items = [mk({ name: "Q", demand: "truck", trucks: 1, stack: 3 })];
    recalc();
    return { cap: R.block.channelGroups[0].laneCapacity, depth: R.geo.laneRects[0].h, unit: R.block.laneUnit };
  });
  assert.equal(r.cap, 21);
  assert.equal(r.depth, 7 * r.unit - 100);
});

test("Regression: Bestand und Regalbedarf des Referenzbeispiels unverändert", async (page) => {
  const r = await inPage(page, (mk) => {
    S.items = [
      mk({ name: "A", demand: "truck", trucks: 4, stack: 1, skus: 200 }),
      mk({ name: "B", demand: "truck", trucks: 2, stack: 3, skus: 20 }),
      mk({ name: "C", demand: "truck", trucks: 1, stack: 2, skus: 5 })
    ];
    recalc();
    return [R.netTotal, R.grossRackNeed, R.grossBlockNeed];
  });
  assert.deepEqual(r, [2310, 1611, 1345]);
});

test("Optimierungs-Worker startet und liefert Varianten", async (page) => {
  await inPage(page, (mk) => {
    S.items = [mk({ name: "A", demand: "truck", trucks: 4, skus: 200 }), mk({ name: "B", demand: "truck", trucks: 2, stack: 3, skus: 20 })];
    S.building.L = 80; S.building.W = 60;
    recalc();
    startOptimizationRun();
  });
  await page.waitForFunction(() => /abgeschlossen|fehlgeschlagen/.test(document.getElementById("opt-run-status").textContent), null, { timeout: 30000 });
  const status = await page.evaluate(() => document.getElementById("opt-run-status").textContent);
  assert.match(status, /abgeschlossen: [1-9]\d* Vorschlaege/);
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("dialog", (d) => d.accept());
    try {
      await page.addInitScript(() => localStorage.clear());
      await page.goto(FILE);
      await t.fn(page);
      assert.deepEqual(errors, [], "Seitenfehler");
      console.log("ok   " + t.name);
    } catch (e) {
      failed++;
      console.log("FAIL " + t.name + "\n     " + String(e.message).split("\n").join("\n     "));
    } finally {
      await page.close();
    }
  }
  await browser.close();
  console.log(`\n${tests.length - failed}/${tests.length} Tests bestanden`);
  process.exit(failed ? 1 : 0);
})();
