// Tests zur Darreichung der Vorgaben: Gliederung, Preisquelle, Ergebniszeilen, Wirkungstexte, Stammdaten
// Ausführen: node tests/vorgaben.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const example = (page) => page.evaluate(() => { loadExampleProject(); document.querySelectorAll(".toast").forEach((t) => t.remove()); showTab(1); });
const result = (page, key) => page.textContent(`.sec-result[data-result="${key}"]`);

test("Gliederung: Durchsatzprofil getrennt, Zusatzflächen, kein Bereich Sicherheit", async (page) => {
  const r = await page.evaluate(() => {
    const sec = (g, t) => (PARAM_LAYOUT.find((x) => x.id === g).sections.find((s) => s.title === t) || { items: [] }).items.filter((i) => typeof i === "string");
    return {
      buffer: sec("vol", "WE-Puffer"), profile: sec("vol", "Durchsatzprofil"), extra: sec("gbp", "Zusatzflächen"),
      tunnels: sec("ffz", "Fluchttunnel"), groups: PARAM_LAYOUT.map((g) => g.id), tabs: [...document.querySelectorAll("#ptabs button")].map((b) => b.textContent.trim()),
    };
  });
  assert.ok(!r.buffer.some((p) => /peakHourShare|weShare|simultaneity/.test(p)));
  assert.deepEqual(r.profile, ["volume.peakHourShare", "volume.weShare", "volume.simultaneity"]);
  assert.deepEqual(r.extra, ["volume.operationalArea"]);
  assert.deepEqual(r.tunnels, ["fire.tunnelInterval", "fire.tunnelClear"]);
  assert.deepEqual(r.groups, ["gbp", "vol", "ffz", "blk", "cost"]);
  assert.equal(r.tabs.at(-1).replace(/\d+$/, ""), "6 Kosten & Optionen");
});

test("Preisquelle: Auswahl bestimmt die Datenqualität, Notiz ohne Einfluss", async (page) => {
  const q = () => page.evaluate(() => { recalc(); return R.dataQuality.score; });
  const base = await q();
  await page.evaluate(() => { S.costMeta.source = "Angebot Fa. X"; });
  assert.equal(await q(), base, "Notiz ändert die Datenqualität nicht");
  await page.evaluate(() => { S.costMeta.sourceKind = "angebot"; });
  assert.ok(await q() > base);
});

test("Preisquelle: ältere Planungsdatei mit Freitext wird als Angebot übernommen", async (page) => {
  const r = await page.evaluate(() => {
    const load = (src, ver) => { const st = defaults(); delete st.costMeta.sourceKind; st.costMeta.source = src; st.meta.toolVersion = ver; st.items = [Object.assign(newItem(), { name: "P" })]; applyJson(JSON.stringify(st)); return S.costMeta.sourceKind; };
    return [load("Angebot Muster", "V2.20"), load("Richtpreis", "V2.20"), load("Notiz", "V2.26")];
  });
  assert.deepEqual(r, ["angebot", "richtpreis", "richtpreis"]);
});

test("Ergebniszeilen zeigen die Wirkung im aktuellen Stand", async (page) => {
  await example(page);
  assert.match(await result(page, "stock"), /^→ Netto-Bestand 4\.070 Pal\./);
  assert.match(await result(page, "rack"), /Feldweite [\d.]+ mm \(\d Pal\.\/Feld\) · \d+ Ebenen · \d+ Doppelreihen · [\d.]+ Plätze/);
  assert.match(await result(page, "channels"), /\d+ Kanäle in \d+ Bändern · Kanallänge ≈ 7,5 m/);
  assert.match(await result(page, "blockshare"), /ABC: A 80 %, B 15 %, C 5 %/);
  assert.match(await result(page, "aisles"), /^→ Aus FFZ: Regal 2,8 m, Block 3,5 m/);
  // Wirkung einer Eingabe erscheint sofort
  await page.click("#ptab-vol");
  await page.fill("#in-peak", "1.2"); await page.dispatchEvent("#in-peak", "change"); await page.evaluate(() => recalc());
  assert.match(await result(page, "stock"), /Netto-Bestand 4\.884 Pal\./);
  await page.evaluate(() => { S.volume.bufferMode = "process"; S.volume.bufferTrucks = 6; S.volume.bufferPallets = 33; S.volume.bufferDwell = 2; syncAll(); recalc(); });
  assert.match(await result(page, "buffer"), /^→ 396 Pufferpaletten → [\d.,]+ m² · WE-Zonentiefe [\d,]+ m/);
});

test("Wirkungstext für jedes Feld", async (page) => {
  const missing = await page.evaluate(() => PARAMS.filter((d) => d.render !== false && !d.eff).map((d) => d.p));
  assert.deepEqual(missing, []);
  await page.evaluate(() => showTab(1));
  await page.focus("#in-peak");
  assert.match(await page.textContent('.fld.pfld[data-p="volume.peak"] > .eff'), /Multipliziert den Netto-Bestand/);
});

test("Feldweite: automatisch ermittelter Wert sichtbar, fest vorgeben schaltet frei", async (page) => {
  await example(page);
  assert.equal(await page.isDisabled("#in-fieldWidth"), true);
  assert.equal(await page.inputValue("#in-fieldWidth"), String(await page.evaluate(() => R.rack.fieldW)));
  assert.match(await page.textContent("#lbl-fieldw-mode"), /automatisch ermittelt/);
  await page.selectOption("#sel-fieldmode", "fix");
  await page.evaluate(() => recalc());
  assert.equal(await page.isDisabled("#in-fieldWidth"), false);
  await page.fill("#in-fieldWidth", "2700"); await page.dispatchEvent("#in-fieldWidth", "change"); await page.evaluate(() => recalc());
  assert.equal(await page.evaluate(() => R.rack.fieldW), 2700);
});

test("LKW-Stammdaten überschreibbar wie Paletten, mit Zurücksetzen", async (page) => {
  await example(page);
  await page.click("#ptab-pal");
  const sel = 'input[data-trk-ov="fl"][data-trk-key="standard"]';
  const before = await page.evaluate(() => fillTruck("standard", getLhm("euro")));
  await page.fill(sel, "15.5"); await page.dispatchEvent(sel, "change");
  const r = await page.evaluate(() => [S.truckOverrides.standard.fl, fillTruck("standard", getLhm("euro")), S.items.filter((i) => i.truck === "standard" && !i.pptManual).every((i) => i.ppt === fillTruck("standard", i))]);
  assert.equal(r[0], 15.5);
  assert.ok(r[1] > before, "mehr Paletten je LKW");
  assert.equal(r[2], true, "Positionen übernehmen die neue Füllmenge");
  await page.click('[data-trk-reset="fl"][data-trk-key="standard"]');
  assert.deepEqual(await page.evaluate(() => S.truckOverrides), {});
  // Ändern und Zurücksetzen sind je ein Rückgängig-Schritt, obwohl die Tabelle sich neu aufbaut
  await page.click("#btn-undo");
  assert.deepEqual(await page.evaluate(() => S.truckOverrides), { standard: { fl: 15.5 } });
  await page.click("#btn-undo");
  assert.deepEqual(await page.evaluate(() => S.truckOverrides), {});
  // Grenzen und Import
  const err = await page.evaluate(() => { try { validateTruckOverrides({ standard: { fl: 99 } }, "LKW"); return ""; } catch (e) { return e.message; } });
  assert.match(err, /Laderaumlänge muss zwischen 3,0 und 30,0 m liegen/);
});

test("Stammdaten: beschriftete Formulare, Kreuztabelle markiert genutzte Kombinationen", async (page) => {
  await example(page);
  await page.click("#ptab-pal");
  const labels = await page.$$eval(".lhmform .mf > span", (s) => s.map((x) => x.textContent));
  assert.ok(labels.includes("Bezeichnung") && labels.includes("Nutzlast t") && labels.includes("Gewicht kg"));
  const used = await page.$$eval("#truck-cross td.used", (c) => c.length);
  assert.ok(used >= 1, "genutzte Kombination markiert");
  // Paletten-Stammwert: Änderung ist rückgängig machbar
  const lsel = 'input[data-lhm-ov="g"][data-lhm-key="euro"]';
  await page.fill(lsel, "420"); await page.dispatchEvent(lsel, "change");
  assert.equal(await page.evaluate(() => S.lhmOverrides.euro.g), 420);
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => (S.lhmOverrides.euro || {}).g), undefined);
});

test("Kosten: Sprung zu den Einheitspreisen", async (page) => {
  await page.evaluate(() => showTab(1));
  await page.click('#pg-cost [data-goto="5"]');
  assert.equal(await page.evaluate(() => document.querySelector("#tabs [data-tab].on").dataset.tab), "5");
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
