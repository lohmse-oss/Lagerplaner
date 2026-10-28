// Tests zu Anfragedaten und Immobiliensteckbrief (Aufbau der Anfragevorlagen, Deutsch und Englisch)
// Ausführen: node tests/anfragen.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");
const PROJECT = path.resolve(__dirname, "..", "testdaten", "testprojekt-kombinationen.json");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const load = (page) => page.evaluate((txt) => { applyJson(txt); showTab(9); }, fs.readFileSync(PROJECT, "utf8"));
const text = (page, key, lang) => page.evaluate(([k, l]) => briefText(k, l), [key, lang]);

test("Gliederung wie die Vorlage: Standort, Gebäude, Gelände, Weitere Informationen", async (page) => {
  await load(page);
  const r = await page.evaluate(() => BRIEF_SECTIONS.map(([sec, de, en]) => [de, en, BRIEF_ROWS.filter((x) => x.sec === sec).map((x) => x.de)]));
  assert.deepEqual(r, [
    ["Standort", "Location", ["Lage", "Infrastruktur-Anbindung", "Betriebszeiten", "Sonstiges"]],
    ["Gebäude", "Building", ["Allgemein", "Dimension Produktion", "Dimension Logistik", "Dimension Office", "Technische Ausstattung", "Logistische Gestaltung", "Sozialausstattung", "Brandschutz", "Sonstiges"]],
    ["Gelände", "Site", ["Dimension", "Logistische Gestaltung", "Technische Ausstattung", "Sonstiges"]],
    ["Weitere Informationen", "Additional information", ["Verkehrsaufkommen", "Notwendige Unterlagen"]],
  ]);
});

test("Vorschläge aus der Planung: Fläche, UKB, Tore, Brandschutz, Boden, Verkehr – deutsch und englisch", async (page) => {
  await load(page);
  const exp = await page.evaluate(() => ({ hall: Math.round(R.geo.area.hall / 1e6), top: briefStorageTop(), spr: S.fire.sprinkler }));
  const ukb = Math.ceil((exp.top + exp.spr) / 100) / 10;
  const de = await text(page, "logistics", "de"), en = await text(page, "logistics", "en");
  assert.match(de, new RegExp("^Hallenfläche ca\\. " + exp.hall.toLocaleString("de-DE") + " m² \\(165,0 × 110,0 m\\).*UK Binder mind\\. " + String(ukb).replace(".", ",") + " m"));
  assert.match(en, new RegExp("^Warehouse area approx\\. " + exp.hall.toLocaleString("en-GB") + " sqm.*clear height min\\. " + ukb + " m"));
  assert.match(await text(page, "logisticDesign", "de"), /^7 Verladetore: 3 Nord \(WE\), 1 Ost \(WE\/WA\), 3 Süd \(WA\)/);
  assert.match(await text(page, "logisticDesign", "en"), /^7 loading docks: 3 north \(inbound\), 1 east \(in-\/outbound\), 3 south \(outbound\)/);
  assert.match(await text(page, "fire", "de"), /selbsttätige Feuerlöschanlage erforderlich/);
  assert.match(await text(page, "buildingMisc", "de"), /Ständerlast ca\. \d+ kN; Blocklager: Flächenlast bis ca\. [\d,]+ kN\/m²/);
  assert.match(await text(page, "hours", "en"), /^2 shift\(s\) per day, 7\.5 h per shift, 6 days per week/);
  assert.match(await text(page, "technical", "de"), /^Ladeinfrastruktur für 13 Flurförderzeuge \(Lithium-Ionen\)/);
  assert.match(await text(page, "traffic", "de"), /^Wareneingang ca\. \d+ LKW je Tag/);
});

test("Freitexte je Sprache, englisch fällt auf deutsch zurück; Vorschlag abwählbar", async (page) => {
  await load(page);
  assert.equal(await text(page, "office", "de"), "für ca. 6 Personen");
  assert.equal(await text(page, "office", "en"), "für ca. 6 Personen");
  assert.equal(await text(page, "location", "en"), "Greater Leipzig/Halle area, max. 30 km to the motorway");
  assert.equal(await text(page, "siteLogistics", "de"), "", "in den Testdaten abgewählt");
  // Bedienung im Formular
  await page.uncheck('input[data-brief-skip="hours"]');
  await page.fill('textarea[data-brief-text="hours"][data-lang="de"]', "Mo–Sa 06:00–21:00");
  await page.dispatchEvent('textarea[data-brief-text="hours"][data-lang="de"]', "change");
  assert.equal(await text(page, "hours", "de"), "Mo–Sa 06:00–21:00");
  await page.check('input[data-brief-skip="hours"]');
  assert.match(await text(page, "hours", "de"), /^2-Schicht-Betrieb.*\nMo–Sa 06:00–21:00$/);
  assert.deepEqual(await page.evaluate(() => S.request.skip), ["siteLogistics"]);
  await page.click("#btn-undo");
  assert.deepEqual(await page.evaluate(() => S.request.skip), ["hours", "siteLogistics"]);
});

test("Kopfdaten: Eingabe, Datum, gemeinsame Nutzung im FFZ-Blatt", async (page) => {
  await load(page);
  assert.equal(await page.inputValue('input[data-req="sop"]'), "2027-04-01");
  await page.fill('input[data-req="contact"]', "M. Muster");
  await page.dispatchEvent('input[data-req="contact"]', "change");
  await page.fill('input[data-req="eop"]', "2033-03-31");
  await page.dispatchEvent('input[data-req="eop"]', "change");
  const r = await page.evaluate(() => [S.request.contact, buildFfzSpecs()[0].rows.find((x) => x.merkmal === "Einsatzzeitraum (SOP – EOP)").wert, ffzSpecPrintHtml().includes("M. Muster")]);
  assert.deepEqual(r, ["M. Muster", "01.04.2027 – 31.03.2033", true]);
  await page.fill('input[data-req="contact"]', "");
  await page.dispatchEvent('input[data-req="contact"]', "change");
  assert.equal(await page.evaluate(() => "contact" in S.request), false);
});

test("Druckfenster: deutsches und englisches Blatt", async (page, context) => {
  await load(page);
  const [popup] = await Promise.all([context.waitForEvent("page"), page.click("#btn-print-brief")]);
  await popup.waitForLoadState();
  const t = await popup.textContent("body");
  assert.match(t, /Immobiliensteckbrief – Testprojekt Kombinationen/);
  assert.match(t, /Leistungsstart Projekt01\.04\.2027/);
  assert.match(t, /Property profile/);
  assert.match(t, /Start of project1 Apr 2027/);
  assert.match(t, /Contract logistics for consumer goods/);
  assert.match(t, /Fire protectionStorage height up to/);
  assert.equal((await popup.$$("section")).length, 2);
});

test("Speichern, Eingabedatei und Import-Prüfung", async (page) => {
  await load(page);
  const r = await page.evaluate(() => {
    const json = JSON.stringify(S); S.request = {}; applyJson(json); const a = S.request.minTerm;
    exportInputFile(); const js = document.getElementById("jsonArea").value; S.request = {}; applyJson(js);
    return [a, S.request.extension, S.request.texts.documents.en];
  });
  assert.deepEqual(r, ["60 Monate", "2 × 24 Monate", "building permit for logistics use, fire protection concept"]);
  const msg = (req) => page.evaluate((req) => { try { validateRequest(req, "Anfragedaten"); return ""; } catch (e) { return e.message; } }, req);
  assert.match(await msg({ farbe: "rot" }), /unbekanntes Feld farbe/);
  assert.match(await msg({ sop: "1.4.2027" }), /sop muss ein Datum/);
  assert.match(await msg({ texts: { keller: { de: "x" } } }), /unbekanntes Kriterium keller/);
  assert.match(await msg({ texts: { office: { fr: "x" } } }), /Text je Sprache/);
  assert.match(await msg({ skip: ["dach"] }), /skip muss eine Liste bekannter Kriterien/);
  assert.equal(await msg({ sop: "2027-04-01", texts: { office: { de: "x", en: "y" } }, skip: ["hours"] }), "");
});

test("Leeres Projekt: Steckbrief ohne Planungswerte, keine Fehler", async (page) => {
  await page.evaluate(() => showTab(9));
  const r = await page.evaluate(() => [briefText("logistics", "de"), briefText("hours", "de").startsWith("2-Schicht"), document.querySelectorAll("#brief-form tr[data-brief]").length]);
  assert.deepEqual(r, ["", true, 19]);
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("dialog", (d) => { if (d.type() === "alert") errors.push("Meldung: " + d.message()); d.accept(); });
    try {
      await page.goto(FILE);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await t.fn(page, context);
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
