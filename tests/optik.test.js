// Tests zu Schreibweise, Knopfstufen und Kennzahlen
// Ausführen: node tests/optik.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const withData = (page, building) => page.evaluate((building) => {
  const mk = (name, trucks, stack, skus) => Object.assign(newItem(), { name, trucks, stack, skus });
  S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20), mk("C", 1, 2, 5)];
  Object.assign(S.building, { L: 80, W: 60 }, building || {});
  syncAll(); renderItems(); recalc();
}, building);

// Ersatzschreibungen deutscher Umlaute, die in sichtbaren Texten nicht vorkommen dürfen
const ASCII_UMLAUT = /\b\w*(Kapazitaet|Gebaeude|[Hh]oehe|pruef|Pruef|Stuetz|ueber|Ueber|fuer|Flaeche|flaeche|Plaetze|zulaessig|moeglich|verfuegbar|Laenge|Stueckliste|gueltig|Gaenge|aendert|uebernomm)\w*/;

test("Sichtbare Texte, Hinweise und Berichte mit Umlauten", async (page) => {
  // Fälle mit vielen Hinweisen: Bestand mit Stützenkonflikten und Unterdeckung, Greenfield mit vorgegebener Länge
  for (const b of [{}, { L: 60, W: 36 }, { mode: "greenfield", gfShape: "length", L: 300 }]) {
    await withData(page, b);
    const texts = await page.evaluate(() => {
      for (const n of ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16"]) showTab(n);
      return [document.body.innerText, R.warn.map((w) => w.t).join("\n"), buildReportKundeHtml(), JSON.stringify(assessModelFeasibility(R).reasons)];
    });
    for (const t of texts) {
      const m = t.match(ASCII_UMLAUT);
      assert.equal(m, null, m && "Ersatzschreibung: " + m[0] + " … " + t.slice(Math.max(0, m.index - 60), m.index + 60));
    }
  }
});

test("Knopfstufen: primär blau, sekundär umrandet, Werkzeug dezent, Kopfzeile dunkel", async (page) => {
  const r = await page.evaluate(() => {
    const bg = (id) => getComputedStyle(document.getElementById(id)).backgroundColor;
    showTab(2);
    return { primary: bg("btn-add-item"), secondary: bg("btn-csv"), tool: bg("btn-cols-auto"), header: bg("btn-help"), danger: getComputedStyle(document.getElementById("btn-sel-del")).color };
  });
  assert.equal(r.primary, "rgb(37, 99, 235)");
  assert.equal(r.secondary, "rgb(255, 255, 255)");
  assert.equal(r.tool, "rgba(0, 0, 0, 0)");
  assert.equal(r.header, "rgb(30, 41, 59)");
  assert.equal(r.danger, "rgb(185, 28, 28)");
});

test("CAPEX-Kennzahl: Gesamtwert mit Bandbreite", async (page) => {
  await withData(page);
  const r = await page.evaluate(() => ({ v: document.getElementById("kpi-capex").textContent, sub: document.getElementById("kpi-capex-range").textContent, total: eur(R.capex.total), low: eur(R.capex.low), high: eur(R.capex.high) }));
  assert.equal(r.v, r.total);
  assert.equal(r.sub, `Bandbreite ${r.low} – ${r.high} (± 20 %)`);
  assert.equal(await page.isVisible("#kpi-capex-wrap"), true);
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
