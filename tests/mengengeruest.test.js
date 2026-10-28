// Tests zum Mengengerüst: kompakte Tabelle, Detailfeld, Tastatur, Sammelleiste, Einfügen aus Excel
// Ausführen: node tests/mengengeruest.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const withData = (page) => page.evaluate(() => {
  const mk = (name, trucks, stack, skus) => Object.assign(newItem(), { name, trucks, stack, skus });
  S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20), mk("C", 1, 2, 5)];
  S.items[2].demand = "pieces"; S.items[2].pcsDay = 5000; S.items[2].pcsPerKlt = 20; S.items[2].kltPerPallet = 24;
  S.building.L = 80; S.building.W = 60;
  syncAll(); renderItems(); recalc(); showTab(2);
});
const paste = (page, text) => page.evaluate((text) => {
  const dt = new DataTransfer(); dt.setData("text/plain", text);
  (document.activeElement || document.body).dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
}, text);

test("Kompakte Tabelle: eine Zeile je Position, Hauptwert je Ermittlungsart", async (page) => {
  await withData(page);
  const r = await page.evaluate(() => ({
    cols: document.querySelectorAll("#items-table thead th").length,
    rows: [...document.querySelectorAll("#itemsBody tr")].map((tr) => [tr.cells.length, tr.querySelector(".dem-main .unit").textContent, tr.querySelector(".dem-main input").dataset.k]),
    lhm: document.querySelector('#itemsBody tr[data-row="1"] .lhm-sum').textContent,
  }));
  assert.equal(r.cols, 12);
  assert.deepEqual(r.rows, [[12, "LKW/Tag", "trucks"], [12, "LKW/Tag", "trucks"], [12, "Stk./Tag", "pcsDay"]]);
  assert.match(r.lhm, /Euro 800×1200.*1\.200 × 800 × 1\.000 mm · 350 kg · 1\+2/);
  await page.fill('#itemsBody tr[data-row="0"] .dem-main input', "6");
  assert.equal(await page.evaluate(() => S.items[0].trucks), 6);
});

test("Detailfeld: alle Felder, Änderungen wirken in Tabelle und Modell", async (page) => {
  await withData(page);
  await page.click('#itemsBody [data-edit="1"]');
  assert.equal(await page.textContent("#drawer-title"), "Position 2 von 3");
  assert.equal(await page.evaluate(() => document.activeElement.id), "dr-name");
  await page.fill("#dr-h", "1500");
  assert.equal(await page.evaluate(() => S.items[1].h), 1500);
  assert.match(await page.textContent('#itemsBody tr[data-row="1"] .lhm-sum'), /1\.500 mm/);
  await page.fill("#dr-name", "B neu");
  assert.equal(await page.inputValue('#itemsBody tr[data-row="1"] input[data-k="name"]'), "B neu");
  // Ermittlungsart wechseln: Felder im Detailfeld folgen, Fokus bleibt
  await page.selectOption("#dr-demand", "stock");
  assert.equal(await page.isVisible("#dr-targetStock"), true);
  assert.equal(await page.evaluate(() => document.activeElement.id), "dr-demand");
  assert.equal(await page.textContent('#itemsBody tr[data-row="1"] .dem-main .unit'), "Pal. Bestand");
  await page.click("#btn-drawer-next");
  assert.equal(await page.isDisabled("#btn-drawer-next"), true);
  await page.keyboard.press("Escape");
  assert.equal(await page.isVisible("#item-drawer"), false);
});

test("Detailfeld neben den Kennzahlen; Tabelle bleibt erreichbar", async (page) => {
  await withData(page);
  await page.click('#itemsBody [data-edit="0"]');
  const r = await page.evaluate(() => {
    const d = document.getElementById("item-drawer").getBoundingClientRect(), k = document.getElementById("kpis").getBoundingClientRect();
    return { overlap: d.right > k.left + 1, header: d.top >= document.querySelector("header").getBoundingClientRect().bottom - 1 };
  });
  assert.deepEqual(r, { overlap: false, header: true });
  await page.click('#itemsBody tr[data-row="2"] [data-del]');
  assert.equal(await page.evaluate(() => S.items.length), 2, "Löschen hinter dem Detailfeld erreichbar");
});

test("Detailfeld verdeckt die Optimierungsleiste nicht", async (page) => {
  await withData(page);
  await page.click('#itemsBody [data-edit="0"]');
  await page.evaluate(() => { S.building.mode = "greenfield"; syncAll(); refreshModeUI(); recalc(); });
  await page.click("#btn-dd-opt"); await page.click("#btn-optimize");
  const r = await page.evaluate(() => document.getElementById("item-drawer").getBoundingClientRect().top >= document.getElementById("opt-run-panel").getBoundingClientRect().bottom);
  assert.equal(r, true);
  if (await page.isVisible("#btn-opt-cancel")) await page.click("#btn-opt-cancel", { timeout: 3000 });
  await page.waitForFunction(() => !OPTIMIZATION_JOB, null, { timeout: 30000 });
});

test("Neue Position öffnet das Detailfeld", async (page) => {
  await withData(page);
  await page.click("#btn-add-item");
  assert.equal(await page.textContent("#drawer-title"), "Position 4 von 4");
});

test("Tastatur: Enter springt zur nächsten Zeile, Umschalt+Enter zurück", async (page) => {
  await withData(page);
  await page.focus('#itemsBody tr[data-row="0"] input[data-k="skus"]');
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.closest("tr").dataset.row + document.activeElement.dataset.k), "1skus");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Shift+Enter");
  assert.equal(await page.evaluate(() => document.activeElement.closest("tr").dataset.row), "1");
});

test("Sammelleiste erscheint erst mit Auswahl", async (page) => {
  await withData(page);
  assert.equal(await page.isVisible("#selbar"), false);
  await page.check('#itemsBody .sel-cb[data-sel="0"]');
  await page.check('#itemsBody .sel-cb[data-sel="2"]');
  assert.equal(await page.isVisible("#selbar"), true);
  assert.equal(await page.textContent("#sel-count"), "2 Positionen ausgewählt");
  await page.click("#btn-sel-clear");
  assert.equal(await page.isVisible("#selbar"), false);
});

test("Einfügen aus Excel: Spaltenerkennung, deutsche Zahlen, leere Zellen", async (page) => {
  await withData(page);
  await page.click("#btn-paste");
  await page.fill("#paste-area", "Pos.\tBezeichnung\tLKW pro Tag\tArtikel\tGewicht kg\tStapel\tBemerkung\n1\tMöbel\t2,5\t1.200\t420\t1+1\tx\n2\tTextil\t1\t300\t\t\t\n");
  const map = await page.$$eval("#paste-map select", (s) => s.map((x) => x.value));
  assert.deepEqual(map, ["", "name", "trucks", "skus", "g", "stack", ""]);
  assert.match(await page.textContent("#paste-msg"), /^2 Positionen erkannt/);
  await page.click("#btn-paste-append");
  const r = await page.evaluate(() => S.items.slice(3).map((i) => [i.name, i.demand, i.trucks, i.skus, i.g, i.stack]));
  assert.deepEqual(r, [["Möbel", "truck", 2.5, 1200, 420, 2], ["Textil", "truck", 1, 300, 350, 1]]);
  assert.match(await page.textContent(".toast.notice"), /2 Positionen angehängt/);
});

test("Einfügen: Zuordnung änderbar, Fehler verständlich, Ersetzen mit Rückfrage und Rückgängig", async (page) => {
  await withData(page);
  await page.click("#btn-paste");
  await page.fill("#paste-area", "Name\tMenge\nX\t40\nY\t12\n");
  assert.deepEqual(await page.$$eval("#paste-map select", (s) => s.map((x) => x.value)), ["name", ""]);
  await page.selectOption('#paste-map select[data-pcol="1"]', "name");
  assert.match(await page.textContent("#paste-msg"), /„Bezeichnung“ ist mehrfach zugeordnet/);
  assert.equal(await page.isDisabled("#btn-paste-append"), true);
  await page.selectOption('#paste-map select[data-pcol="1"]', "palletsDay");
  await page.click("#btn-paste-replace");
  const r = await page.evaluate(() => S.items.map((i) => [i.name, i.demand, i.palletsDay]));
  assert.deepEqual(r, [["X", "pallets", 40], ["Y", "pallets", 12]]);
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.items.length), 3);
});

test("Strg+V: mehrzellig öffnet den Dialog, Einzelwert geht ins Feld", async (page) => {
  await withData(page);
  await page.focus('#itemsBody tr[data-row="0"] input[data-k="name"]');
  await paste(page, "Neu\t3\nNeu2\t4");
  assert.equal(await page.isVisible("#modal-paste"), true);
  assert.equal(await page.inputValue("#paste-area"), "Neu\t3\nNeu2\t4");
  await page.click("#btn-paste-close");
  await page.focus('#itemsBody tr[data-row="0"] input[data-k="name"]');
  await paste(page, "Einzelwert");
  assert.equal(await page.isVisible("#modal-paste"), false);
});

test("CSV-Import: leere Zellen übernehmen Standardwerte", async (page) => {
  const r = await page.evaluate(() => parseCsv("Bezeichnung;LKW/Tag;Artikel;Höhe;Stapel\nA;2;;;\nB;;10;1200;1+2").map((i) => [i.name, i.trucks, i.skus, i.h, i.stack]));
  assert.deepEqual(r, [["A", 2, 0, 1000, 1], ["B", 1, 10, 1200, 3]]);
});

test("Beschriftungen in Detailfeld und Einfügedialog", async (page) => {
  await withData(page);
  await page.click('#itemsBody [data-edit="0"]');
  await page.click("#btn-paste");
  await page.fill("#paste-area", "Bezeichnung\tArtikel\nA\t1\n");
  const missing = await page.$$eval("#item-drawer input, #item-drawer select, #modal-paste input, #modal-paste select, #modal-paste textarea", (els) =>
    els.filter((e) => !(e.labels && e.labels.length) && !e.getAttribute("aria-label")).map((e) => e.id || e.outerHTML.slice(0, 60)));
  assert.deepEqual(missing, []);
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
