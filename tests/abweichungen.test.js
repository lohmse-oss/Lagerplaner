// Tests zu Vorgabenfeldern: Abweichung vom Standard, Zurücksetzen, Quelle am Feld, Wirkungstext
// Ausführen: node tests/abweichungen.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const openArea = async (page, area) => { await page.evaluate(() => showTab(1)); await page.click("#ptab-" + area); };
const setField = async (page, id, value) => { await page.fill(id, value); await page.dispatchEvent(id, "change"); await page.evaluate(() => recalc()); };
const meta = (page, p) => page.$eval(`.pmeta[data-pmeta="${p}"]`, (m) => [m.parentElement.classList.contains("is-changed"), m.textContent.trim()]);

test("Standardprojekt: keine Vorgabe markiert", async (page) => {
  await openArea(page, "vol");
  const n = await page.$$eval(".fld.pfld.is-changed", (x) => x.length);
  assert.equal(n, 0);
  assert.equal(await page.$$eval(".ptabs .pcount:not([hidden])", (x) => x.length), 0);
});

test("Geänderte Vorgabe: markiert, gezählt, Zurücksetzen mit Rückgängig", async (page) => {
  await openArea(page, "vol");
  await setField(page, "#in-fillRack", "80");
  assert.deepEqual(await meta(page, "volume.fillRack"), [true, "↺ StandardQuelle fehlt"]);
  assert.equal(await page.textContent("#ptab-vol .pcount"), "1");
  assert.match(await page.textContent("#pg-vol"), /1 geändert/);
  assert.match(await page.getAttribute('[data-param-reset="volume.fillRack"]', "title"), /Auf Standard zurücksetzen: 85 %/);
  await page.click('[data-param-reset="volume.fillRack"]');
  assert.deepEqual([await page.evaluate(() => S.volume.fillRack), await page.inputValue("#in-fillRack")], [85, "85"]);
  assert.deepEqual(await meta(page, "volume.fillRack"), [false, ""]);
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.volume.fillRack), 80);
});

test("Zurücksetzen von Auswahl, 1+x und Meter-Feldern", async (page) => {
  await openArea(page, "blk");
  await page.selectOption("#sel-blockmode", "quota");
  await setField(page, "#in-stackH", "2");
  await page.click('[data-param-reset="block.mode"]');
  await page.click('[data-param-reset="block.stackH"]');
  assert.deepEqual(await page.evaluate(() => [S.block.mode, S.block.stackH]), ["sku", 6]);
  assert.deepEqual([await page.inputValue("#sel-blockmode"), await page.inputValue("#in-stackH")], ["sku", "5"]);
  await openArea(page, "gbp");
  await setField(page, "#in-sprinkler", "1");
  await page.click('[data-param-reset="fire.sprinkler"]');
  assert.deepEqual([await page.evaluate(() => S.fire.sprinkler), await page.inputValue("#in-sprinkler")], [500, "0.5"]);
});

test("Greenfield: berechnete Hallenmaße gelten nicht als Abweichung", async (page) => {
  await page.evaluate(() => {
    S.items = [Object.assign(newItem(), { name: "A", trucks: 4, skus: 200 })];
    syncAll(); recalc(); showTab(1);
  });
  await page.selectOption("#sel-mode", "greenfield");
  await page.evaluate(() => recalc());
  assert.deepEqual(await meta(page, "building.L"), [false, ""]);
  assert.deepEqual(await meta(page, "building.W"), [false, ""]);
  assert.equal((await meta(page, "building.mode"))[0], true);
});

test("Quelle am Feld: dokumentiert, bestätigt, veraltet", async (page) => {
  await page.evaluate(() => { S.volume.peak = 1.2; syncAll(); recalc(); setParameterSource("volume.peak", "customer", true, "LV S. 3"); recalc(); });
  await openArea(page, "vol");
  assert.deepEqual(await meta(page, "volume.peak"), [true, "↺ StandardKunde ✓"]);
  assert.match(await page.getAttribute('[data-param-source="volume.peak"]', "title"), /Kundenangabe · Bestätigt · LV S\. 3/);
  await setField(page, "#in-peak", "1.3");
  assert.equal((await meta(page, "volume.peak"))[1], "↺ StandardKunde !");
  await page.evaluate(() => { setParameterSource("volume.safety", "assumption", false, ""); recalc(); });
  assert.deepEqual(await meta(page, "volume.safety"), [false, "Annahme"]);
});

test("Quelle am Feld öffnet die Zeile im Annahmenregister", async (page) => {
  await openArea(page, "vol");
  await setField(page, "#in-fillRack", "80");
  await page.click('[data-param-source="volume.fillRack"]');
  const r = await page.evaluate(() => [document.querySelector("#tabs [data-tab].on").dataset.tab, document.activeElement.closest("tr").dataset.sourcePath]);
  assert.deepEqual(r, ["7", "volume.fillRack"]);
});

test("Wirkungstext erscheint beim Bearbeiten", async (page) => {
  await openArea(page, "gbp");
  const eff = '.fld.pfld[data-p="building.ukb"] > .eff';
  assert.equal(await page.isVisible(eff), false);
  await page.focus("#in-ukb");
  assert.equal(await page.isVisible(eff), true);
  assert.match(await page.textContent(eff), /Ebenenzahl/);
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
