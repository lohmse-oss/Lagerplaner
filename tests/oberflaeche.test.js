// Oberflächen-Tests für Lagerplaner.html
// Ausführen: node tests/oberflaeche.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");
const TABS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const withData = (page) => page.evaluate(() => {
  const mk = (n, tr, st, sk) => Object.assign(newItem(), { name: n, trucks: tr, stack: st, skus: sk });
  S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20)];
  S.building.L = 80; S.building.W = 60;
  syncAll(); renderItems(); recalc();
});
const visiblePanels = (page) => page.$$eval(".panel", (ps) => ps.filter((p) => p.offsetParent !== null).map((p) => p.id));

test("Start: Startseite aktiv, Optimierungsleiste verborgen", async (page) => {
  assert.deepEqual(await visiblePanels(page), ["panel-0"]);
  assert.equal(await page.isVisible("#opt-run-panel"), false);
  assert.equal(await page.isVisible("#tabs .sub-row"), false);
});

test("Navigation: jedes Register über Phase und Registerzeile erreichbar", async (page) => {
  for (const n of TABS.slice(1)) {
    const phase = await page.getAttribute(`#tabs [data-tab="${n}"]`, "data-phase");
    await page.click(`#tabs .phase[data-phase="${phase}"]`);
    await page.click(`#tabs .sub-row [data-tab="${n}"]`);
    assert.deepEqual(await visiblePanels(page), ["panel-" + n], "Register " + n);
    assert.equal(await page.getAttribute(`#tab-${n}`, "aria-selected"), "true");
    const shown = await page.$$eval("#tabs .sub-row [role=tab]", (bs) => bs.filter((b) => !b.hidden).map((b) => b.dataset.phase));
    assert.ok(shown.length > 0 && shown.every((p) => p === phase), "nur Register der Phase " + phase);
  }
});

test("Navigation: Phase merkt das zuletzt genutzte Register", async (page) => {
  await page.click('#tabs .phase[data-phase="eng"]');
  assert.deepEqual(await visiblePanels(page), ["panel-3"]);
  await page.click('#tabs [data-tab="5"]');
  await page.click('#tabs .phase[data-phase="in"]');
  await page.click('#tabs .phase[data-phase="eng"]');
  assert.deepEqual(await visiblePanels(page), ["panel-5"]);
});

test("Navigation: Pfeiltasten wechseln das Register", async (page) => {
  await page.click('#tabs .phase[data-phase="eval"]');
  await page.focus("#tab-6");
  await page.keyboard.press("ArrowRight");
  assert.deepEqual(await visiblePanels(page), ["panel-8"]);
  await page.keyboard.press("End");
  assert.deepEqual(await visiblePanels(page), ["panel-7"]);
  assert.equal(await page.evaluate(() => document.activeElement.id), "tab-7");
});

test("Datei-Menü: Tastaturbedienung und Fokus-Rückgabe", async (page) => {
  await page.click("#btn-dd-file");
  assert.equal(await page.getAttribute("#btn-dd-file", "aria-expanded"), "true");
  assert.equal(await page.evaluate(() => document.activeElement.id), "btn-new");
  await page.keyboard.press("ArrowDown");
  assert.equal(await page.evaluate(() => document.activeElement.id), "btn-load");
  await page.keyboard.press("Escape");
  assert.equal(await page.isVisible("#menu-file"), false);
  assert.equal(await page.evaluate(() => document.activeElement.id), "btn-dd-file");
  const items = await page.$$eval("#menu-file [role=menuitem]", (bs) => bs.map((b) => b.id));
  assert.deepEqual(items, ["btn-new", "btn-load", "btn-save", "btn-reload-input", "btn-menu-csv", "btn-export-input", "btn-menu-bom-csv", "btn-menu-layout-png"]);
});

test("Datei-Menü: Stückliste als CSV wird heruntergeladen", async (page) => {
  await withData(page);
  await page.click("#btn-dd-file");
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#btn-menu-bom-csv")]);
  assert.match(download.suggestedFilename(), /_Stueckliste\.csv$/);
  assert.equal(await page.isVisible("#menu-file"), false);
});

test("Kennzahlen: Klick springt ins zuständige Register", async (page) => {
  await withData(page);
  await page.click("#kpi-rack-is-wrap");
  assert.deepEqual(await visiblePanels(page), ["panel-3"]);
  await page.focus("#kpi-warn");
  await page.keyboard.press("Enter");
  assert.deepEqual(await visiblePanels(page), ["panel-10"]);
});

test("Kennzahlen: Leiste einklappbar, Zustand bleibt nach Neuladen", async (page) => {
  const before = await page.$eval("#kpis", (k) => k.getBoundingClientRect().width);
  await page.click("#btn-kpis-toggle");
  const after = await page.$eval("#kpis", (k) => k.getBoundingClientRect().width);
  assert.ok(before > 250 && after < 60, `Breite ${before} → ${after}`);
  assert.equal(await page.getAttribute("#btn-kpis-toggle", "aria-expanded"), "false");
  await page.reload();
  assert.equal(await page.evaluate(() => document.getElementById("app").classList.contains("kpis-collapsed")), true);
}, { keepStorage: true });

test("Leeres Projekt: neutrale Ampel statt Alarm", async (page) => {
  assert.equal(await page.textContent("#kpi-ampel"), "Noch keine Positionen");
  assert.match(await page.getAttribute("#kpi-ampel-wrap", "class"), /amp-neutral/);
  assert.equal(await page.textContent("#kpi-warnv"), "–");
  await withData(page);
  assert.doesNotMatch(await page.getAttribute("#kpi-ampel-wrap", "class"), /amp-neutral/);
});

test("Vorgaben: Greenfield-Ergebniszeile nur im Greenfield-Modus", async (page) => {
  await page.click('#tabs .phase[data-phase="in"]');
  assert.equal(await page.isVisible("#out-dim"), false);
  await page.selectOption("#sel-mode", "greenfield");
  await page.waitForFunction(() => document.getElementById("out-dim").offsetParent !== null);
});

test("Optimierungsleiste erscheint beim Lauf und lässt sich ausblenden", async (page) => {
  await withData(page);
  await page.click("#btn-dd-opt");
  await page.click("#btn-optimize");
  assert.equal(await page.isVisible("#opt-run-panel"), true);
  await page.waitForFunction(() => /abgeschlossen|fehlgeschlagen/.test(document.getElementById("opt-run-status").textContent), null, { timeout: 30000 });
  assert.match(await page.textContent("#opt-run-status"), /abgeschlossen/);
  assert.equal(await page.isVisible("#btn-opt-cancel"), false);
  await page.click("#btn-opt-dismiss");
  assert.equal(await page.isVisible("#opt-run-panel"), false);
});

test("Barrierefreiheit: jedes Eingabefeld hat eine Beschriftung", async (page) => {
  await withData(page);
  for (const n of TABS) await page.evaluate((t) => showTab(t), n);
  const missing = await page.$$eval("input:not([type=hidden]),select,textarea", (els) =>
    els.filter((e) => !(e.labels && e.labels.length) && !e.getAttribute("aria-label") && !e.getAttribute("aria-labelledby") && !e.title)
      .map((e) => e.id || e.dataset.k || e.outerHTML.slice(0, 60)));
  assert.deepEqual(missing, []);
});

for (const width of [1440, 1024, 390]) {
  test(`Kein waagerechter Seitenüberlauf bei ${width} px`, async (page) => {
    await page.setViewportSize({ width, height: 900 });
    await withData(page);
    for (const n of TABS) {
      await page.evaluate((t) => showTab(t), n);
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      assert.ok(sw <= width, `Register ${n}: Seitenbreite ${sw} > ${width}`);
    }
  });
}

test("Registerzeile passt bei 1440 px ohne Scrollen", async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const phase of ["in", "eng", "eval", "rep"]) {
    await page.click(`#tabs .phase[data-phase="${phase}"]`);
    const [sw, cw] = await page.$eval("#tabs .sub-row", (r) => [r.scrollWidth, r.clientWidth]);
    assert.ok(sw <= cw, `Phase ${phase}: ${sw} > ${cw}`);
  }
  const phaseRow = await page.$eval("#tabs .phase-row", (r) => r.getBoundingClientRect().height);
  assert.ok(phaseRow < 50, "Phasenzeile einzeilig");
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
