// Tests zum FFZ-Anforderungsblatt: Ableitung aus der Planung, Vorgaben, Anzahl, Druck, CSV, Import
// Ausführen: node tests/ffz.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const fs = require("fs");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");
const PROJECT = path.resolve(__dirname, "..", "testdaten", "testprojekt-kombinationen.json");

const tests = [];
const test = (name, fn) => tests.push({ name, fn });

const load = (page) => page.evaluate((txt) => { applyJson(txt); showTab(5); }, fs.readFileSync(PROJECT, "utf8"));
const sheet = (page, type) => page.evaluate((type) => {
  const sp = buildFfzSpecs().find((x) => x.type === type);
  return sp && Object.assign({}, sp, { by: Object.fromEntries(sp.rows.map((r) => [r.merkmal, r])) });
}, type);

test("Je gewähltem Fahrzeugtyp ein Blatt mit Einsatzbereichen und Anzahl", async (page) => {
  await load(page);
  const r = await page.evaluate(() => buildFfzSpecs().map((s) => [s.type, s.areas.join(", "), s.count]));
  assert.deepEqual(r, [["schubmast", "Regallager", 4], ["front", "Blocklager / Leergut, WE/WA & Vorzone", 3], ["hochhub", "Blocklager / Leergut", 0], ["ameise", "WE/WA & Vorzone", 6]]);
  assert.deepEqual(await page.$$eval("#ffz-spec section[data-ffz]", (s) => s.map((x) => x.dataset.ffz)), ["schubmast", "front", "hochhub", "ameise"]);
});

test("Regalstapler: Hubhöhe, Tragfähigkeit, Lastschwerpunkt und Gang aus der Planung", async (page) => {
  await load(page);
  const s = await sheet(page, "schubmast");
  const exp = await page.evaluate(() => ({ h3: Math.ceil((R.rack.topBeam + S.ffz.liftReserve) / 50) * 50, g: Math.max(...S.items.filter((i) => i.rackNet > 0).map((i) => i.g)), l: Math.max(...S.items.filter((i) => i.rackNet > 0).map((i) => i.l)) }));
  const num = (t) => Number(String(t).replace(/[^\d,]/g, "").replace(/\./g, "").replace(",", "."));
  assert.equal(num(s.by["Hub"].wert), exp.h3);
  assert.equal(s.by["Hub"].nr, "4.4");
  assert.equal(num(s.by["Tragfähigkeit/Last"].wert) * 1000, Math.ceil(exp.g / 100) * 100);
  assert.equal(num(s.by["Lastschwerpunktabstand"].wert), exp.l / 2);
  assert.equal(s.by["Arbeitsgangbreite (inkl. Sicherheitsabstand)"].wert, "≤ 2.800");
  assert.equal(s.by["Seitenschieber"].wert, "erforderlich");
  assert.equal(s.by["Hersteller"].art, "Lieferant");
  // Gliederung wie im Typenblatt
  const groups = [...new Set(s.rows.map((r) => r.grp))];
  assert.deepEqual(groups, ["0", "1", "2", "4", "5", "6", "10", "9"]);
});

test("Frontstapler in Block und Vorzone: Blockstapel, Bauhöhe und Freihub für den LKW", async (page) => {
  await load(page);
  const s = await sheet(page, "front");
  assert.match(s.by["Hub"].hinweis, /^Blockstapel 1\+\d/);
  assert.match(s.by["Bauhöhe Hubgerüst eingefahren"].wert, /^≤ /);
  assert.match(s.by["Freihub"].hinweis, /zweilagige Beladung/);
  assert.equal(s.by["Bemerkung"].wert, "Zwei Fahrzeuge mit Kabine für den Außeneinsatz am Leergutplatz");
  // Mitgänger ohne Hubgerüst: keine Hubhöhe
  const a = await sheet(page, "ameise");
  assert.equal(a.by["Hub"], undefined);
});

test("Vorgaben Einsatz und Beschaffung wirken im Blatt; Laufzeit nur bei Miete/Leasing", async (page) => {
  await load(page);
  let s = await sheet(page, "schubmast");
  assert.equal(s.by["Einsatzzeit"].wert, "4.680");
  assert.equal(s.by["Beschaffungsart"].wert, "Leasing, 60 Monate");
  await page.evaluate(() => showTab(1));
  await page.click("#ptab-ffz");
  assert.equal(await page.isVisible("#in-ffz-term"), true);
  await page.selectOption("#sel-ffz-proc", "kauf");
  await page.selectOption("#sel-ffz-env", "frozen");
  await page.evaluate(() => recalc());
  assert.equal(await page.isVisible("#in-ffz-term"), false);
  assert.match(await page.textContent('.sec-result[data-result="ffzuse"]'), /^→ 4\.680 Betriebsstunden je Fahrzeug und Jahr · Anforderungsblatt für 4 Fahrzeugtypen/);
  s = await sheet(page, "schubmast");
  assert.equal(s.by["Beschaffungsart"].wert, "Kauf");
  assert.match(s.by["Einsatzumgebung"].wert, /Tiefkühl/);
  // VNA-Felder nur bei VNA im Regal
  assert.equal(await page.isVisible("#sel-vna-guide"), false);
});

test("VNA: Gangführung, Fahrerplatz, P&D und Bodenebenheit", async (page) => {
  await load(page);
  await page.evaluate(() => { S.ffz.rackFFZ = ["vna"]; S.ffz.aisle = 1.9; S.ffz.vnaCab = "down"; S.ffz.vnaGuide = "wire"; syncAll(); recalc(); });
  const s = await sheet(page, "vna");
  assert.equal(s.by["Bedienung"].wert, "Mann-unten");
  assert.equal(s.by["Gangführung"].wert, "Induktive Führung");
  assert.equal(s.by["Bodenebenheit"].wert, "nach DIN 15185-1");
  assert.equal(s.by["Seitenschieber"], undefined);
  assert.equal(s.by["Arbeitsgangbreite (inkl. Sicherheitsabstand)"].wert, "≤ 1.900");
});

test("Anzahl und Bemerkung: gespeichert, rückgängig machbar, in Planungs- und Eingabedatei", async (page) => {
  await load(page);
  await page.fill('input[data-fleet-count="hochhub"]', "2");
  await page.dispatchEvent('input[data-fleet-count="hochhub"]', "change");
  await page.fill('input[data-fleet-note="hochhub"]', "für Leergut");
  await page.dispatchEvent('input[data-fleet-note="hochhub"]', "change");
  assert.deepEqual(await page.evaluate(() => S.ffzFleet.hochhub), { count: 2, note: "für Leergut" });
  assert.match(await page.textContent('#ffz-spec section[data-ffz="hochhub"]'), /für Leergut/);
  await page.click("#btn-undo");
  assert.deepEqual(await page.evaluate(() => S.ffzFleet.hochhub), { count: 2 });
  // Rundlauf über Planungs- und Eingabedatei
  const r = await page.evaluate(() => {
    const json = JSON.stringify(S); S.ffzFleet = {}; applyJson(json); const a = S.ffzFleet.hochhub;
    exportInputFile(); const js = document.getElementById("jsonArea").value; S.ffzFleet = {}; applyJson(js);
    return [a, S.ffzFleet.hochhub, S.ffzFleet.schubmast];
  });
  assert.deepEqual(r, [{ count: 2 }, { count: 2 }, { count: 4 }]);
});

test("Import weist ungültige Fahrzeugangaben ab", async (page) => {
  const msg = (fleet) => page.evaluate((fleet) => { try { validateFfzFleet(fleet, "FFZ-Anzahl"); return ""; } catch (e) { return e.message; } }, fleet);
  assert.match(await msg({ gabelstapler: { count: 1 } }), /unbekannter FFZ-Typ gabelstapler/);
  assert.match(await msg({ front: { count: -1 } }), /ganze Zahl zwischen 0 und 999/);
  assert.match(await msg({ front: { count: 2, farbe: "rot" } }), /unbekanntes Feld farbe/);
  assert.equal(await msg({ front: { count: 2, note: "x" } }), "");
});

test("Druckfenster und CSV", async (page, context) => {
  await load(page);
  const [popup] = await Promise.all([context.waitForEvent("page"), page.click("#btn-ffz-print")]);
  await popup.waitForLoadState();
  const text = await popup.textContent("body");
  assert.match(text, /FFZ-Anforderungsblatt – Testprojekt Kombinationen/);
  assert.match(text, /Schubmaststapler · 4 Stück/);
  assert.match(text, /in Anlehnung an das Typenblatt nach VDI 2198/);
  assert.match(text, /Grundabmessungen/);
  await popup.close();
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#btn-ffz-csv")]);
  assert.match(dl.suggestedFilename(), /^Testprojekt_Kombinationen_FFZ-Anforderungen\.csv$/);
  const csv = fs.readFileSync(await dl.path(), "utf8");
  assert.match(csv, /^﻿Fahrzeugtyp;Anzahl;Gruppe;Nr\.;Merkmal;Zeichen;Einheit;Anforderung;Herkunft;Erläuterung\r\n/);
  assert.match(csv, /"Schubmaststapler";4;"Grundabmessungen";"4\.4";"Hub";"h3";"mm";"≥ [\d.]+";"Planung"/);
});

test("Sprung zu Einsatz und Beschaffung; ohne FFZ-Auswahl ein Hinweis", async (page) => {
  await load(page);
  await page.click('#ffz-spec-card [data-goto="1"]');
  assert.equal(await page.evaluate(() => document.querySelector("#tabs [data-tab].on").dataset.tab), "1");
  assert.equal(await page.getAttribute("#ptab-ffz", "aria-current"), "true");
  await page.evaluate(() => { S.ffz.rackFFZ = []; S.ffz.blockFFZ = []; S.ffz.zoneFFZ = []; renderFfzSpec(); });
  assert.match(await page.textContent("#ffz-spec"), /Keine Flurförderzeuge gewählt/);
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
