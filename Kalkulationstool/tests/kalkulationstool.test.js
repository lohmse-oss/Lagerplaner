// Tests zum Kalkulationstool (Nachbau des Kalkulationstools Light V1.0, eigenständige Datei)
//   Rechenkern gegen die Werte der Excel-Vorlage (Excel-kompatibel) und die Korrekturen,
//   Listen (anlegen, duplizieren, verschieben, löschen, aus Excel einfügen), Auswahllisten,
//   Projektdaten, Rückgängig, Speichern und Öffnen, Übernahme aus dem Lagerplaner, Import-Prüfung, Druck und Kopie.
//   Ab V2.11: Abschreibung, Restbuchwert und Beschaffung, Kategorien, KPI-Leiste, Kopfzeile, Speichern unter, Sprache Deutsch/Englisch.
// Ausführen: node Kalkulationstool/tests/kalkulationstool.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Kalkulationstool.html");
const DATA = path.resolve(__dirname, "..", "testdaten", "kalkulation-kombinationen.json");
const LAGERPLANER_DATA = path.resolve(__dirname, "..", "..", "testdaten", "testprojekt-kombinationen.json");
const choose = async (page, button, file) => {
  await page.click("#btn-dd-file");
  const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click(button)]);
  await chooser.setFiles(file);
  await page.waitForTimeout(300);
};

const tests = [];
const test = (name, fn, o) => tests.push(Object.assign({ name, fn }, o));
const near = (a, b, msg) => assert.ok(Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(b)), `${msg}: ${a} ≠ ${b}`);

// Zellwerte der Excel-Vorlage PM_Kali_Tool_Light_V1.0 (Blatt und Zelle in Klammern)
const EXCEL = {
  months: 60, // A. Start E5
  soz: 0.2238010657193605, // B. Basisdaten L4
  hWage: 1801.6000000000004, hSal: 1700.2600000000002, // B. Basisdaten G17, G20
  salAG: 477768.9432881177, salAH: 2388844.7164405887, // I-1 AG33, AH33
  salV1: 57.676021916067356, salAD1: 95.56604903908296, // I-1 V23, AD23
  wageAG: 1691655.8484124425, wageAH: 8458279.242062211, // I-2 AG33, AH33
  wageV1: 36.35238544417984, wageAD1: 60.233936645313875, // I-2 V23, AD23
  salFactorX: 1.3896487804878048, salFactorAB: 1.641834570519618, salFactorAD: 2.0522932131495226, // I-1 C12, C17, C19
  wageFactorAB: 2.074952279957582, // I-2 C17
  K: 4375696.909172081, um: 533621.5742892782, sk: 4909318.4834613595, // V. Summary D23, D24, D25
  ge: 320172.9445735669, ri: 106724.31485785564, uov: 5336215.742892782, ve: 464018.7602515463, umv: 5800234.5031443285, // D26 … D30
  lzUmv: 29001172.51572164, lzK: 21878484.545860406, // E30, E23
  perFte: 172101.75037959733, // C13
  ebita: 784191.7048251132, gp: 1219209.2925609376, gpWalk: 720389.1252905255, // D34, D35, D40
};
const GP_CORRECTED = EXCEL.ebita + EXCEL.um * 0.75; // HV + BU = 7,5 % von 10 % Umlagen

async function loadExample(page) {
  await page.click("#tab-projekt");
  await page.click("#calc-example");
}
const result = (page) => page.evaluate(() => {
  const r = computeCalc(S);
  return { months: r.period.monthsTotal, monthsP: r.period.monthsPersonnel, years: r.period.years, soz: r.days.soz, hWage: r.days.hWage, hSal: r.days.hSal,
    salAG: r.sal.AG, salAH: r.sal.AH, salV1: r.sal.rows[0].V, salAD1: r.sal.rows[0].AD, wageAG: r.wage.AG, wageAH: r.wage.AH, wageV1: r.wage.rows[0].V, wageAD1: r.wage.rows[0].AD,
    salFactorX: r.sal.factors.X, salFactorAB: r.sal.factors.AB, salFactorAD: r.sal.factors.AD, wageFactorAB: r.wage.factors.AB,
    K: r.sum.pa.K, um: r.sum.pa.um, sk: r.sum.pa.sk, ge: r.sum.pa.ge, ri: r.sum.pa.ri, uov: r.sum.pa.uov, ve: r.sum.pa.ve, umv: r.sum.pa.umv,
    lzUmv: r.sum.lz.umv, lzK: r.sum.lz.K, perFte: r.perFte, ebita: r.oto.offer.ebita, gp: r.oto.offer.gp, gpWalk: r.oto.walk.gp, to: r.oto.offer.to, warn: r.warn };
});

test("Excel-kompatibel: Beispiel ergibt die Werte der Excel-Vorlage", async (page) => {
  await loadExample(page);
  await page.check('[data-cf="calc.excelMode"]');
  const r = await result(page);
  for (const k of Object.keys(EXCEL)) near(r[k], EXCEL[k], k);
  assert.deepEqual(r.warn, []);
  await page.click("#tab-summary");
  assert.match(await page.textContent("#calc-panel-summary"), /Excel-kompatibel/);
  assert.match(await page.textContent("#calc-panel-summary"), /5\.800\.235 €/);
});

test("Korrigiert: Gross Profit mit HV und BU auf den Umsatz ohne Verhandlung, Wechselkurs wirkt", async (page) => {
  await loadExample(page);
  // Ohne Beitragsbemessungsgrenzen entsprechen die Kosten der Excel
  await page.evaluate(() => { for (const x of S.calc.base.sv) x.bbg = 0; });
  let r = await result(page);
  near(r.umv, EXCEL.umv, "Umsatz unverändert");
  near(r.gp, GP_CORRECTED, "Gross Profit korrigiert");
  near(r.gpWalk, EXCEL.gpWalk, "Walkaway unverändert");
  await page.click("#tab-oto");
  await page.fill('[data-cf="calc.oto.rate"]', "1,1");
  r = await result(page);
  near(r.to, EXCEL.umv * 1.1, "TO in Angebotswährung");
  assert.match(await page.textContent("#calc-panel-oto"), /6\.380\.257,95 EUR/);
  await page.evaluate(() => { S.calc.excelMode = true; });
  r = await result(page);
  near(r.to, EXCEL.umv, "Excel: Wechselkurs ohne Wirkung");
});

test("Laufzeit: tagesgenau, über 10 Jahre; Excel-kompatibel mit Begrenzung und Hinweis", async (page) => {
  await loadExample(page);
  await page.evaluate(() => { S.request.sop = "2027-03-15"; S.request.eop = "2028-03-14"; });
  let r = await result(page);
  near(r.months, 12, "Teilmonate ergänzen sich");
  await page.evaluate(() => { S.request.sop = "2027-01-01"; S.request.eop = "2038-12-31"; });
  r = await result(page);
  assert.equal(r.years.length, 12);
  near(r.months, 144, "12 Jahre");
  assert.deepEqual(r.warn, []);
  await page.evaluate(() => { S.calc.excelMode = true; });
  r = await result(page);
  assert.equal(r.years.length, 10);
  assert.equal(r.monthsP, 120);
  assert.ok(r.warn.some((w) => /10 Kalenderjahre/.test(w)));
  // Ende vor Start: Hinweis, keine Fehler
  await page.evaluate(() => { S.calc.excelMode = false; S.request.eop = "2026-01-01"; showTab("summary"); });
  assert.match(await page.textContent("#calc-panel-summary"), /Leistungsende liegt vor dem Start/);
});

test("Eingabe: deutsche Zahlen, Ausgaben laufen mit, Rückgängig je Feld", async (page) => {
  await loadExample(page);
  await page.click("#tab-personal");
  const cell = '[data-cf="calc.salaries.0.rate"]';
  const before = await page.evaluate(() => computeCalc(S).sal.AG);
  await page.fill(cell, "80.000");
  assert.equal(await page.evaluate(() => S.calc.salaries[0].rate), 80000);
  const live = await page.textContent('#calc-card-salaries table[data-cl="salaries"] > tbody > tr:first-child');
  assert.ok(live.includes(await page.evaluate(() => calcEur(computeCalc(S).sal.rows[0].AG))), "Kosten p.a. sofort aktualisiert");
  assert.ok(!live.includes(await page.evaluate((b) => calcEur(b), before)));
  await page.press(cell, "Tab");
  assert.equal(await page.inputValue(cell), "80.000");
  await page.fill('[data-cf="calc.wages.0.fte"]', "2,5");
  await page.press('[data-cf="calc.wages.0.fte"]', "Tab");
  assert.equal(await page.evaluate(() => S.calc.wages[0].fte), 2.5);
  await page.fill('[data-cf="calc.wages.0.gross"]', "abc");
  assert.equal(await page.getAttribute('[data-cf="calc.wages.0.gross"]', "class").then((c) => /bad/.test(c)), true, "ungültige Zahl markiert");
  assert.equal(await page.evaluate(() => S.calc.wages[0].gross), 15.99, "ungültige Zahl nicht übernommen");
  await page.fill('[data-cf="calc.wages.0.gross"]', "15,99");
  await page.press('[data-cf="calc.wages.0.gross"]', "Tab");
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.wages[0].fte), 2);
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.salaries[0].rate), 75000);
  near(await page.evaluate(() => computeCalc(S).sal.AG), before, "Stand wiederhergestellt");
});

test("Listen: anlegen, duplizieren, verschieben, löschen, je Schritt rückgängig", async (page) => {
  await loadExample(page);
  await page.click("#tab-sachkosten");
  const names = () => page.evaluate(() => S.calc.nu.map((x) => x.name + ":" + x.price));
  const start = await names();
  await page.click('#calc-card-nu [data-calc-act="add"]');
  assert.equal((await names()).length, 3);
  assert.equal(await page.evaluate(() => document.activeElement.dataset.cf), "calc.nu.2.name", "Fokus in der neuen Zeile");
  await page.keyboard.type("Wachdienst");
  await page.keyboard.press("Tab"); await page.keyboard.type("2");
  await page.keyboard.press("Tab"); await page.keyboard.type("12.000,50");
  await page.keyboard.press("Tab");
  assert.deepEqual(await page.evaluate(() => S.calc.nu[2]), { name: "Wachdienst", qty: 2, price: 12000.5, pass: false, note: "", category: "" });
  await page.click('#calc-card-nu [data-calc-act="up"][data-ci="2"]');
  assert.equal((await names())[1], "Wachdienst:12000.5");
  await page.click('#calc-card-nu [data-calc-act="dup"][data-ci="1"]');
  assert.deepEqual((await names()).slice(1, 3), ["Wachdienst:12000.5", "Wachdienst:12000.5"]);
  await page.click('#calc-card-nu [data-calc-act="down"][data-ci="0"]');
  assert.equal((await names())[1], start[0]);
  await page.click('#calc-card-nu [data-calc-act="del"][data-ci="0"]');
  assert.equal((await names()).length, 3);
  assert.match(await page.textContent("#calc-card-nu tfoot"), /718\.840,92 €/, "Summe Jahr");
  const undo = await page.evaluate(() => UNDO.length);
  for (let i = 0; i < undo; i++) await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.nu.length), 0, "bis vor das Beispiel zurück");
  await page.evaluate(() => { while (UNDO.length) UNDO.pop(); });
  await loadExample(page);
  await page.click("#tab-sachkosten");
  assert.deepEqual(await names(), start);
});

test("Einfügen aus Excel: Zellbereich füllt Zeilen und legt fehlende an", async (page) => {
  await loadExample(page);
  await page.click("#tab-personal");
  const text = "Lagerist\t3\t18,50\t15 %\nStaplerfahrer\t1,5\t19,75\t16%\nTeamleiter\t1\t24\t0\n";
  // Einfügen ab Zeile 3 (Index 2): Zeile 3 wird überschrieben, Zeilen 4 und 5 neu
  await page.focus('[data-cf="calc.wages.2.name"]');
  await page.evaluate((t) => {
    const dt = new DataTransfer(); dt.setData("text/plain", t);
    document.activeElement.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
  }, text);
  const w = await page.evaluate(() => S.calc.wages.slice(2).map(({ name, fte, rate, gross }) => ({ name, fte, rate, gross })));
  assert.deepEqual(w, [
    { name: "Lagerist", fte: 3, rate: 18.5, gross: 15 },
    { name: "Staplerfahrer", fte: 1.5, rate: 19.75, gross: 16 },
    { name: "Teamleiter", fte: 1, rate: 24, gross: 0 },
  ]);
  assert.equal(await page.locator('#calc-card-wages table[data-cl="wages"] > tbody > tr').count(), 5);
  assert.ok(await page.isVisible(".toast"));
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.wages.length), 3);
  // Einzelner Wert ohne Tabulator: normales Einfügen ins Feld
  await page.focus('[data-cf="calc.wages.0.name"]');
  const prevented = await page.evaluate(() => {
    const dt = new DataTransfer(); dt.setData("text/plain", "Kommissionierer");
    return !document.activeElement.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true }));
  });
  assert.equal(prevented, false);
});

test("Auswahllisten und SV-Liste erweitern", async (page) => {
  await loadExample(page);
  await page.fill('[data-calc-choices="serviceLines"]', "TFM\nIFM\nLOG\nPEM\nTC\nSCS\nLOG\n");
  await page.press('[data-calc-choices="serviceLines"]', "Tab");
  assert.deepEqual(await page.evaluate(() => S.calc.lists.serviceLines), ["TFM", "IFM", "LOG", "PEM", "TC", "SCS"], "doppelte und leere Einträge entfallen");
  assert.equal(await page.locator('#calc-dl-serviceLines option[value="SCS"]').count(), 1);
  assert.equal(await page.getAttribute('[data-cf="request.serviceLine"]', "list"), "calc-dl-serviceLines");
  // SV-Liste: eigene Zeile erhöht den SV-Anteil Arbeitgeber
  await page.click('[data-calc-act="add"][data-cl="sv"]');
  await page.fill('[data-cf="calc.base.sv.8.name"]', "Zusatzbeitrag");
  await page.fill('[data-cf="calc.base.sv.8.pct"]', "1");
  await page.press('[data-cf="calc.base.sv.8.pct"]', "Tab");
  near(await page.evaluate(() => computeCalc(S).days.sv), 0.2486, "SV-Summe");
  assert.match(await page.textContent("#calc-panel-projekt"), /24,860 %/);
});

test("Projektdaten: Kopfzeile zeigt Projekt und Kunde, Laufzeit aus SOP/EOP", async (page) => {
  await loadExample(page);
  assert.equal(await page.textContent("#hdr-proj"), "ZV-Packmittel · Mercedes-Benz");
  await page.fill('[data-cf="meta.name"]', "Neues Projekt");
  assert.equal(await page.textContent("#hdr-proj"), "Neues Projekt · Mercedes-Benz");
  assert.match(await page.title(), /^(● )?Neues Projekt · Kalkulationstool/);
  await page.fill('[data-cf="request.contact"]', "");
  await page.press('[data-cf="request.contact"]', "Tab");
  assert.equal(await page.evaluate(() => "contact" in S.request), false, "leere Felder entfallen");
  await page.fill('[data-cf="request.eop"]', "2031-02-28");
  await page.dispatchEvent('[data-cf="request.eop"]', "change");
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(() => computeCalc(S).period.monthsTotal), 48);
  assert.equal(await page.inputValue("[data-calc-duration]"), "48");
});

test("Lagerplaner-Planungsdatei: Projektdaten übernehmen, als Kalkulation abgelehnt", async (page) => {
  await loadExample(page);
  const before = await page.evaluate(() => JSON.stringify(S.calc));
  await choose(page, "#btn-open-lp", LAGERPLANER_DATA);
  const r = await page.evaluate(() => ({ meta: S.meta, req: S.request }));
  assert.deepEqual(r.meta, { name: "Testprojekt Kombinationen", kunde: "Testkunde" });
  assert.equal(r.req.sop, "2027-04-01");
  assert.equal(r.req.eop, "2032-03-31");
  assert.equal(r.req.serviceLine, "Warehouse");
  assert.equal(r.req.serviceSite, "Leipzig");
  assert.equal(await page.evaluate(() => JSON.stringify(S.calc)), before, "Kalkulation unverändert");
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.meta.name), "ZV-Packmittel");
  // Über „Kalkulation öffnen“ wird die Planungsdatei mit Hinweis abgelehnt
  const dialogs = [];
  page.on("dialog", (d) => dialogs.push(d.message()));
  await choose(page, "#btn-open", LAGERPLANER_DATA);
  assert.ok(dialogs.some((m) => /Lagerplaner-Planungsdatei/.test(m)), dialogs.join(" | "));
  assert.equal(await page.evaluate(() => S.meta.name), "ZV-Packmittel");
});

test("Speichern und Öffnen: Browserspeicher, Datei speichern, Testdatei öffnen, Neue Kalkulation", async (page) => {
  await loadExample(page);
  await page.click("#tab-oto");
  await page.fill('[data-cf="calc.oto.offerNo"]', "A-4711");
  await page.press('[data-cf="calc.oto.offerNo"]', "Tab");
  await page.waitForTimeout(300);
  await page.reload();
  assert.equal(await page.evaluate(() => S.calc.oto.offerNo), "A-4711");
  assert.equal(await page.evaluate(() => S.calc.salaries.length), 7);
  // Datei speichern
  await page.click("#btn-dd-file");
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#btn-save")]);
  assert.equal(download.suggestedFilename(), "ZV-Packmittel_kalkulation.json");
  const saved = JSON.parse(require("fs").readFileSync(await download.path(), "utf8"));
  assert.equal(saved.tool, "Kalkulationstool");
  assert.equal(saved.calc.oto.offerNo, "A-4711");
  // Testdatei mit allen Listen, Korrekturen und Fremdwährung öffnen (ersetzt nach Rückfrage)
  await choose(page, "#btn-open", DATA);
  const r = await page.evaluate(() => {
    const c = computeCalc(S);
    return { lists: Object.keys(CALC_LISTS).map((k) => getP(S, CALC_LISTS[k].path).length), months: c.period.monthsTotal, warn: c.warn, fx: c.oto.fx, cur: c.oto.currency,
      to: c.oto.offer.to, umv: c.sum.pa.umv, rampup: c.cost.rampup.nominal, sl: S.calc.lists.serviceLines.at(-1), name: S.meta.name };
  });
  assert.deepEqual(r.lists, [3, 3, 2, 3, 1, 2, 9, 3, 3, 3]);
  near(r.months, 60, "Teilmonate am Anfang und Ende ergänzen sich");
  assert.deepEqual([r.warn, r.fx, r.cur, r.sl, r.name], [[], 0.94, "CHF", "Warehouse", "Testkalkulation Kombinationen"]);
  near(r.to, r.umv * 0.94, "Angebots-TO in CHF");
  assert.equal(r.rampup, 100000, "Gutschrift mindert den Ramp-up");
  // Funktionen ab V2.1: Personalbedarf, Tarifgruppen, Zuschlag, FTE je Jahr, Durchreichposten, Tarif je Jahr, Auswertung, Dokumentation
  const k = await page.evaluate(() => {
    const c = computeCalc(S), w = c.wage.rows, sl = c.sal.rows;
    return { lag: w[0].fteIn, stap: w[1].fteIn, linked: w.map((x) => x.linked), grade: [sl[0].gradeRate, w[0].gradeRate], extra: S.calc.wages[1].extra,
      dispo: sl[2].yr.map((x) => x.fte), pass: c.sum.pa.Kp > 0, raise: c.rates.raiseIdx.map((x) => +x.toFixed(6)), vol: c.rates.vol.map((x) => +x.toFixed(4)),
      pg: c.eval.priceIndex, checks: calcChecks(S, c).filter((x) => x.sev === "warn").length, variants: S.variants.map((v) => v.name),
      audit: S.audit.map((e) => e.action), doc: S.calc.doc.status, hist: S.calc.history.filter((h) => h.umv).length };
  });
  near(k.lag, (4200 / (60 * 8) * 1.12) + (180 / (12 * 8) * 1.1), "Lagerist aus zwei Mengenzeilen");
  near(k.stap, 3 * 2 * 1.05, "Staplerfahrer aus dem Schichtmodell");
  assert.deepEqual(k.linked, [true, true, false]);
  assert.deepEqual(k.grade, [98000, 17.9]);
  assert.equal(k.extra, 12.5);
  assert.deepEqual([k.dispo[0], k.dispo[4]], [1, 2], "FTE je Jahr überschrieben");
  assert.equal(k.pass, true, "Durchreichposten");
  assert.equal(k.vol[0], 0.8, "Hochlauf 80 %");
  near(k.vol[1], 1.03, "Wachstum 3 %");
  assert.ok(k.raise[1] > 1 && k.raise[1] < 1.035, "2028: Erhöhung 3,5 % ab Juli");
  near(k.pg, 0.015, "Preisgleitung");
  assert.equal(k.checks, 0, "keine Warnungen");
  assert.deepEqual(k.variants, ["3 Fahrer je Schicht", "Stapler kaufen statt leasen"]);
  assert.deepEqual(k.audit.slice(0, 4), ["Eingabe", "Zeile gelöscht (Investitionen)", "Eingabe", "Variante gespeichert"]);
  assert.equal(k.audit.at(-1), "Kalkulation geöffnet", "Öffnen wird protokolliert");
  assert.deepEqual([k.doc, k.hist], ["Freigegeben", 2]);
  await page.click("#tab-auswertung");
  const head = await page.$$eval("#calc-card-variants thead th", (th) => th.map((x) => x.textContent));
  assert.equal(head.length, 4, "aktueller Stand und zwei Varianten");
  await page.click("#tab-projekt");
  assert.equal(await page.textContent("#hdr-proj"), "Testkalkulation Kombinationen · Testkunde");
  // Rückgängig stellt den gespeicherten Stand wieder her
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.oto.offerNo), "A-4711");
  // Werte außerhalb der Grenzen werden beim Öffnen begrenzt
  const st = await page.evaluate(() => { const st = JSON.parse(JSON.stringify(S)); st.calc.wages = [{ name: "X", fte: -3 }]; return st; });
  await page.evaluate((t) => loadText(t), JSON.stringify(st));
  assert.deepEqual(await page.evaluate(() => S.calc.wages), [{ name: "X", fte: 0, rate: 0, gross: 0, grade: "", extra: 0, note: "", fteYears: {} }]);
  assert.ok(await page.isVisible(".toast"));
  // Ältere Datei ohne Kalkulationsteil: Standardwerte
  await page.evaluate(() => loadText(JSON.stringify({ meta: { name: "Alt" } })));
  assert.deepEqual(await page.evaluate(() => [S.calc.salaries.length, S.calc.base.profit, S.meta.name]), [0, 6, "Alt"]);
  // Neue Kalkulation
  await page.click("#btn-dd-file");
  await page.click("#btn-new");
  assert.deepEqual(await page.evaluate(() => [S.meta.name, S.calc.salaries.length]), ["", 0]);
  assert.equal(await page.textContent("#hdr-proj"), "Neue Kalkulation");
});

test("Import-Prüfung: ungültige Kalkulationsdaten werden abgelehnt", async (page) => {
  const errors = await page.evaluate(() => {
    const cases = [
      (c) => { c.salaries = [{ name: "A", fte: "drei" }]; },
      (c) => { c.capex = "keine Liste"; },
      (c) => { c.base.unbekannt = 1; },
      (c) => { c.oto.link = "javascript:alert(1)"; },
      (c) => { c.oto.rate = 0; },
      (c) => { c.lists.status = [1, 2]; },
      (c) => { c.calcDate = "30.03.2026"; },
      (c) => { c.wages = Array.from({ length: 501 }, () => ({ name: "x" })); },
      (c) => { c.fremd = true; },
    ];
    return cases.map((mutate) => {
      const st = defaults(); mutate(st.calc);
      try { validateFile(JSON.parse(JSON.stringify(st))); return null; } catch (e) { return e.message; }
    });
  });
  errors.forEach((e, i) => assert.ok(e && /Kalkulation/.test(e), "Fall " + (i + 1) + ": " + e));
  const ok = await page.evaluate(() => { const st = defaults(); st.calc = calcExample(); st.calc.oto.link = "https://example.sharepoint.com/sites/x"; validateFile(JSON.parse(JSON.stringify(st))); return true; });
  assert.equal(ok, true);
});

test("Link zum Ablageordner, Kopieren und Drucken", async (page) => {
  await loadExample(page);
  await page.click("#tab-oto");
  await page.fill('[data-cf="calc.oto.link"]', "https://example.sharepoint.com/sites/OtO");
  await page.press('[data-cf="calc.oto.link"]', "Tab");
  await page.waitForSelector(".calc-link");
  assert.equal(await page.getAttribute(".calc-link", "href"), "https://example.sharepoint.com/sites/OtO");
  await page.fill('[data-cf="calc.oto.link"]', "javascript:alert(1)");
  await page.press('[data-cf="calc.oto.link"]', "Tab");
  await page.waitForTimeout(100);
  assert.equal(await page.locator(".calc-link").count(), 0, "nur http- und https-Adressen als Link");
  const r = await page.evaluate(() => { const r = computeCalc(S); return { to: r.oto.offer.to, text: calcOtoText(r) }; });
  const toText = r.to.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  assert.ok(r.text.includes("Angebots TO | Offer TO\t" + toText + " EUR"), r.text.slice(0, 600));
  assert.match(r.text, /Walkaway EBITA\t/);
  await page.click("#calc-oto-copy");
  await page.waitForSelector(".toast");
  for (const [id, title] of [["calc-print-oto", /OtO-Werte/], ["calc-print-summary", /Summary Kalkulation/]]) {
    if (id === "calc-print-summary") await page.click("#tab-summary");
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.click("#" + id)]);
    await popup.waitForLoadState();
    assert.match(await popup.title(), title);
    const body = await popup.textContent("body"), whole = r.to.toLocaleString("de-DE", { maximumFractionDigits: 0 });
    assert.ok(body.includes(whole + " €") || body.includes(toText + " EUR"), "Angebots-TO im Druck");
    await popup.close();
  }
});

test("Alle Knöpfe und Felder: ohne Seitenfehler, bei 390 px ohne Seitenüberlauf", async (page) => {
  await loadExample(page);
  page.on("popup", (p) => p.close().catch(() => {}));
  for (const tab of ["projekt", "personal", "sachkosten", "summary", "auswertung", "oto", "dokumentation"]) {
    await page.click("#tab-" + tab);
    const n = await page.locator(`#panel-${tab} button:not([disabled])`).count();
    for (let i = 0; i < n; i++) {
      const b = page.locator(`#panel-${tab} button:not([disabled])`).nth(i);
      if (await b.count()) await b.click();
    }
    await page.click("#tab-" + tab);
  }
  // Beschriftung für jedes Eingabefeld
  for (const tab of ["projekt", "personal", "sachkosten", "summary", "auswertung", "oto", "dokumentation"]) await page.evaluate((t) => showTab(t), tab);
  const unlabeled = await page.$$eval("#panels input:not([type=hidden]),#panels textarea", (els) => els.filter((e) => !(e.labels && e.labels.length) && !e.getAttribute("aria-label")).map((e) => e.outerHTML.slice(0, 80)));
  assert.deepEqual(unlabeled, []);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const tab of ["projekt", "personal", "sachkosten", "summary", "auswertung", "oto", "dokumentation"]) {
    await page.evaluate((t) => showTab(t), tab);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Überlauf in " + tab);
  }
});

test("Beitragsbemessungsgrenzen: SV nur bis zur Grenze, Excel-kompatibel ohne Grenze", async (page) => {
  await loadExample(page);
  const r = await page.evaluate(() => {
    const c = computeCalc(S), x = c.sal.rows[0], w = c.wage.rows[0];
    S.calc.excelMode = true; const e = computeCalc(S).sal.rows[0]; S.calc.excelMode = false;
    return { T: x.T, U: x.U, h: c.sal.hours, wT: w.T, wU: w.U, eU: e.U, eT: e.T };
  });
  const ann = r.T * r.h; // Ø Jahresgehalt Test 1 über die Laufzeit
  assert.ok(ann > 69750 && ann < 101400, "zwischen den Grenzen: " + ann);
  near(r.U, r.T * (0.093 + 0.013 + 0.0056 + 0.0015 + 0.01 + 0.01) + (0.0875 + 0.018) * 69750 / r.h, "KV/PV gedeckelt");
  near(r.wU, r.wT * 0.2386, "Lohn unter den Grenzen: voller Satz");
  near(r.eU, r.eT * 0.2386, "Excel: ohne Grenze");
  // Grenze je Kalenderjahr mit dem gestiegenen Gehalt geprüft
  near(await page.evaluate(() => computeCalc(S).sum.pa.umv), 5798310.093861093, "Umsatz mit Grenzen");
});

test("Sachkosten: Steigerung je Kalenderjahr und Kalkulationszins als Annuität", async (page) => {
  await loadExample(page);
  await page.fill('[data-cf="calc.base.costRaise"]', "2");
  await page.fill('[data-cf="calc.base.interest"]', "5");
  await page.press('[data-cf="calc.base.interest"]', "Tab");
  const r = await page.evaluate(() => { const c = computeCalc(S); return { opex: c.cost.opex.pa, nu: c.cost.nu.pa, capex: c.cost.capex.pa, capexLz: c.cost.capex.lz, invest: c.oto.invest }; });
  const w = [10, 12, 12, 12, 12, 2].map((m) => m / 12), esc = w.reduce((a, x, i) => a + x * 1.02 ** i, 0) / w.reduce((a, x) => a + x, 0);
  near(r.opex, 1386787 * esc, "Betriebskosten mit Ø-Faktor");
  near(r.nu, (671146.6666666664 + 23693.250804854837) * esc, "Nachunternehmer mit Ø-Faktor");
  const ann = 0.05 / (1 - 1.05 ** -5);
  near(r.capex, 209877 * ann, "Annuität");
  near(r.capexLz, 209877 * ann * 5, "Laufzeit inklusive Zins");
  near(r.invest, 209877, "OtO-Investment bleibt nominal");
  assert.match(await page.textContent("#calc-panel-projekt"), /23,10 %/, "Annuität angezeigt");
  await page.click("#tab-sachkosten");
  assert.match(await page.textContent("#calc-panel-sachkosten"), /Annuität mit 5,0 % Zins/);
  await page.evaluate(() => { S.calc.excelMode = true; });
  near(await page.evaluate(() => computeCalc(S).cost.opex.pa), 1386787, "Excel: ohne Steigerung");
});

test("Eingabehilfen: Enter und Pfeiltasten, Laufzeit setzt das Ende, Vorschlag Brutto-Zuschlag, Begrenzung", async (page) => {
  await loadExample(page);
  // Laufzeit in Monaten setzt das Leistungsende
  await page.fill("[data-calc-duration]", "36");
  await page.press("[data-calc-duration]", "Tab");
  await page.waitForTimeout(50);
  assert.equal(await page.evaluate(() => S.request.eop), "2030-02-28");
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.request.eop), "2032-02-29");
  await page.evaluate(() => { S.request.sop = "2027-01-31"; });
  await page.evaluate(() => showTab("projekt"));
  await page.fill("[data-calc-duration]", "1");
  await page.press("[data-calc-duration]", "Tab");
  assert.equal(await page.evaluate(() => S.request.eop), "2027-02-28", "Monatsende");
  // Enter: nächste Zeile, in der letzten Zeile neue Zeile; Pfeil auf zurück
  await page.click("#tab-sachkosten");
  await page.click('[data-cf="calc.nu.0.price"]');
  assert.equal(await page.evaluate(() => { const e = document.activeElement; return e.value.slice(e.selectionStart, e.selectionEnd); }), "671.146,6666666664", "Klick markiert den Inhalt");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.dataset.cf), "calc.nu.1.price");
  await page.keyboard.type("5000");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => document.activeElement.dataset.cf), "calc.nu.2.price", "neue Zeile");
  assert.deepEqual(await page.evaluate(() => S.calc.nu.slice(1).map(({ name, qty, price }) => ({ name, qty, price }))), [{ name: "Sammel", qty: 1, price: 5000 }, { name: "", qty: 1, price: 0 }]);
  await page.keyboard.press("ArrowUp");
  assert.equal(await page.evaluate(() => document.activeElement.dataset.cf), "calc.nu.1.price");
  // Begrenzung mit Hinweis
  await page.click("#tab-projekt");
  await page.fill('[data-cf="calc.base.profit"]', "120");
  await page.press('[data-cf="calc.base.profit"]', "Tab");
  assert.equal(await page.evaluate(() => S.calc.base.profit), 90);
  assert.match(await page.textContent(".toast:last-of-type"), /zulässigen Bereich begrenzt: 90 %/);
  // Vorschlag FTE-Brutto-Zuschlag
  await page.click("#tab-personal");
  await page.click("#calc-gross-wages");
  assert.deepEqual(await page.evaluate(() => S.calc.wages.map((x) => x.gross)), [17.76, 17.76, 17.76]);
  await page.click("#btn-undo");
  assert.deepEqual(await page.evaluate(() => S.calc.wages.map((x) => x.gross)), [15.99, 15.99, 15.99]);
});


const calcOf = (page) => page.evaluate(() => computeCalc(S));

test("Personalbedarf aus Mengen und Schichten: FTE der Qualifikation abgeleitet, Hinweis bei fehlender Zuordnung", async (page) => {
  await loadExample(page);
  await page.click("#tab-personal");
  await page.click('#calc-card-need [data-calc-act="add"]');
  await page.keyboard.type("Kommissionierung");
  await page.fill('[data-cf="calc.need.0.qual"]', "Lohn 2");
  await page.fill('[data-cf="calc.need.0.a"]', "1.200");
  await page.fill('[data-cf="calc.need.0.b"]', "50");
  await page.fill('[data-cf="calc.need.0.allow"]', "10");
  await page.press('[data-cf="calc.need.0.allow"]', "Tab");
  near(await page.evaluate(() => computeCalc(S).wage.rows[1].fteIn), 1200 / (50 * 8) * 1.1, "Menge ÷ (Leistung × Stunden) × Verteilzeit");
  await page.click('#calc-card-need [data-calc-act="add"]');
  await page.fill('[data-cf="calc.need.1.qual"]', "Lohn 2");
  await page.selectOption('[data-cf="calc.need.1.mode"]', "Schicht");
  await page.fill('[data-cf="calc.need.1.a"]', "2");
  await page.fill('[data-cf="calc.need.1.b"]', "3");
  await page.press('[data-cf="calc.need.1.b"]', "Tab");
  await page.waitForTimeout(50);
  const r = await page.evaluate(() => { const r = computeCalc(S); return { fte: r.wage.rows[1].fteIn, linked: r.wage.rows[1].linked, other: r.wage.rows[0].fteIn }; });
  near(r.fte, 3.3 + 6, "Summe aus Menge und Schicht");
  assert.equal(r.linked, true);
  near(r.other, 2, "andere Zeilen unverändert");
  // Zelle als Ausgabe (grün) statt Eingabe
  assert.equal(await page.locator('[data-cf="calc.wages.1.fte"]').count(), 0);
  assert.match(await page.textContent('#calc-card-wages table[data-cl="wages"] > tbody > tr:nth-child(2) td.linked'), /9,30/);
  // Unbekannte Qualifikation: Warnung in der Plausibilität
  await page.fill('[data-cf="calc.need.1.qual"]', "Unbekannt");
  await page.press('[data-cf="calc.need.1.qual"]', "Tab");
  const checks = await page.evaluate(() => calcChecks(S, computeCalc(S)).map((x) => x.text).join("\n"));
  assert.match(checks, /Qualifikation „Unbekannt“ nicht in Gehältern oder Löhnen gefunden/);
});

test("Tarifgruppen und Zuschlag je Zeile", async (page) => {
  await loadExample(page);
  await page.click("#tab-personal");
  await page.click('#calc-card-grades [data-calc-act="add"]');
  await page.keyboard.type("E5");
  await page.fill('[data-cf="calc.grades.0.rate"]', "18");
  await page.press('[data-cf="calc.grades.0.rate"]', "Tab");
  await page.fill('[data-cf="calc.wages.0.grade"]', "E5");
  await page.press('[data-cf="calc.wages.0.grade"]', "Tab");
  await page.waitForTimeout(50);
  let r = await calcOf(page);
  assert.equal(r.wage.rows[0].rate, 18);
  assert.equal(r.wage.rows[0].gradeRate, 18);
  assert.equal(await page.locator('[data-cf="calc.wages.0.rate"]').count(), 0, "Satz aus der Tarifgruppe");
  // Gehaltsgruppe passt nicht zu einem Lohn: Warnung
  await page.evaluate(() => { S.calc.grades.push({ name: "G1", kind: "Gehalt", rate: 60000, note: "" }); S.calc.wages[1].grade = "G1"; });
  assert.match(await page.evaluate(() => calcChecks(S, computeCalc(S)).map((x) => x.text).join("\n")), /Tarifgruppe „G1“ nicht gefunden \(Art Lohn\)/);
  // Zuschlag je Zeile erhöht nur diese Qualifikation
  await page.evaluate(() => { S.calc.wages[1].grade = ""; });
  const before = await page.evaluate(() => computeCalc(S).wage.rows.map((x) => x.T / x.R));
  await page.evaluate(() => { S.calc.wages[0].extra = 25; });
  r = await calcOf(page);
  near(r.wage.rows[0].T / r.wage.rows[0].R, before[0] + 0.25, "Zuschlag 25 %");
  near(r.wage.rows[1].T / r.wage.rows[1].R, before[1], "andere Zeile unverändert");
});

test("Tariferhöhung zum Stichtag und je Jahr, Hochlauf, Wachstum, FTE je Jahr; Excel-kompatibel ohne Wirkung", async (page) => {
  await loadExample(page);
  await page.fill('[data-cf="calc.base.raiseMonth"]', "7");
  await page.press('[data-cf="calc.base.raiseMonth"]', "Tab");
  await page.fill('[data-cf="calc.base.raises.2029"]', "5");
  await page.press('[data-cf="calc.base.raises.2029"]', "Tab");
  let r = await calcOf(page);
  near(r.rates.raiseIdx[1], (6 + 6 * 1.025) / 12, "2028: halbes Jahr erhöht");
  near(r.rates.raiseIdx[2], (6 * 1.025 + 6 * 1.025 * 1.05) / 12, "2029: eigener Satz 5 %");
  // Leeres Feld: Eintrag entfällt
  await page.fill('[data-cf="calc.base.raises.2029"]', "");
  await page.press('[data-cf="calc.base.raises.2029"]', "Tab");
  assert.deepEqual(await page.evaluate(() => S.calc.base.raises), {});
  await page.evaluate(() => { S.calc.base.raiseMonth = 1; S.calc.base.firstYearPct = 50; S.calc.base.volumeGrowth = 10; S.calc.wages[0].fteYears = { 2030: 4 }; });
  r = await calcOf(page);
  const f = r.wage.rows[0].yr.map((x) => x.fte);
  [2 * 0.5, 2 * 1.1, 2 * 1.21, 4, 2 * 1.1 ** 4, 2 * 1.1 ** 5].forEach((v, i) => near(f[i], v, "FTE " + (2027 + i)));
  // Kosten je Jahr summieren sich zur Laufzeit
  near(r.wage.rows[0].AH, r.wage.rows[0].yr.reduce((a, x) => a + x.cost, 0), "Summe der Jahre");
  await page.click("#tab-personal");
  assert.equal(await page.getAttribute('[data-cf="calc.wages.0.fteYears.2028"]', "placeholder"), "2,20");
  // Excel-kompatibel: alles ohne Wirkung
  await page.evaluate(() => { S.calc.excelMode = true; S.calc.base.raiseMonth = 7; S.calc.base.raises = { 2029: 9 }; S.calc.nu[0].pass = true; S.calc.base.costRaise = 3; S.calc.base.interest = 5; });
  r = await result(page);
  for (const k of ["salAG", "wageAG", "umv", "lzUmv", "gp"]) near(r[k], EXCEL[k], k);
});

test("Durchreichposten: fester Aufschlag statt Zuschläge im Hundert", async (page) => {
  await loadExample(page);
  await page.click("#tab-sachkosten");
  const r0 = await calcOf(page);
  await page.check('[data-cf="calc.nu.0.pass"]');
  await page.waitForTimeout(50);
  const r = await calcOf(page), s = r.sum.pa, Kp = 671146.6666666664;
  near(s.Kp, Kp, "Durchreichposten");
  near(s.uov, (s.K - Kp) / 0.82 + Kp * 1.03, "Umsatz ohne Verhandlung");
  near(s.umv, s.uov / 0.92, "mit Verhandlung");
  assert.ok(s.umv < r0.sum.pa.umv, "günstiger als mit vollen Zuschlägen");
  near(r.oto.offer.ebita, s.ge + s.pm + s.ve, "EBITA inklusive Aufschlag");
  await page.click("#tab-summary");
  assert.match(await page.textContent("#calc-panel-summary"), /Aufschlag Durchreichposten/);
});

test("Auswertung: Jahre bei Festpreis, Preisgleitung, Cashflow, Kapitalwert, Preisuntergrenze", async (page) => {
  await loadExample(page);
  let r = await calcOf(page);
  const sum = (k) => r.years.reduce((a, x) => a + x[k], 0), lz = r.sum.lz;
  near(sum("rev"), lz.umv, "Umsatz über die Jahre");
  near(sum("pers") + sum("mat"), lz.K, "Kosten über die Jahre");
  near(sum("ebita"), lz.umv - lz.sk - lz.ri, "EBITA über die Jahre");
  assert.ok(r.years[0].ebita / r.years[0].rev > r.years.at(-2).ebita / r.years.at(-2).rev, "Festpreis: Marge sinkt mit steigenden Löhnen");
  // Preisgleitung verschiebt den Umsatz, die Summe bleibt
  await page.click("#tab-auswertung");
  await page.fill('[data-cf="calc.eval.priceIndex"]', "2,5");
  await page.press('[data-cf="calc.eval.priceIndex"]', "Tab");
  r = await calcOf(page);
  near(r.years.reduce((a, x) => a + x.rev, 0), lz.umv, "Summe mit Preisgleitung");
  assert.ok(r.years[1].rev < r.sum.pa.umv && r.years[4].rev > r.sum.pa.umv);
  // Cashflow, Amortisation, Kapitalwert, interne Verzinsung
  const c = r.cash, inv = 209877 + 413349;
  near(c.invest, inv, "Kapitalbindung");
  let t = 0, npv = -inv;
  for (const x of r.years) { t += x.months / 12; npv += x.cash / 1.08 ** t; }
  near(c.npv, npv, "Kapitalwert bei 8 %");
  assert.ok(c.payback > 0 && c.payback < 60, "Amortisation in Monaten: " + c.payback);
  let t2 = 0, atIrr = -inv;
  for (const x of r.years) { t2 += x.months / 12; atIrr += x.cash / (1 + c.irr) ** t2; }
  assert.ok(Math.abs(atIrr) < 1, "Kapitalwert bei interner Verzinsung ≈ 0: " + atIrr);
  near(r.price.floor, (r.sum.pa.sk + r.sum.pa.ri) / 0.95, "Preisuntergrenze bei 5 % Mindestmarge");
  near(r.price.headroom, r.sum.pa.umv - r.price.floor, "Verhandlungsspielraum");
  const text = await page.textContent("#calc-panel-auswertung");
  assert.match(text, /Verhandlungsspielraum p\.a\./);
  assert.equal(await page.locator("#calc-card-years svg").count(), 1);
  assert.equal(await page.locator("#calc-card-sensi svg").count(), 1);
});

test("Sensitivitätsanalyse: Treiber, Richtung, Sortierung, Variation einstellbar", async (page) => {
  await loadExample(page);
  const rows = await page.evaluate(() => calcSensitivity(S, computeCalc(S)));
  assert.equal(rows.length, 10);
  const by = Object.fromEntries(rows.map((x) => [x.key, x]));
  assert.ok(by.wage.eHigh < 0 && by.wage.eLow > 0, "höhere Löhne senken das EBITA bei festem Preis");
  assert.ok(by.wage.pHigh > 0, "und erhöhen den kostendeckenden Preis");
  near(by.wage.eHigh, -by.wage.eLow, "symmetrisch");
  // Längere Laufzeit: Einmalkosten verteilen sich (günstiger), ein weiteres Jahr Tariferhöhung hebt den Ø-Lohn (teurer)
  assert.ok(Number.isFinite(by.term.eHigh) && Number.isFinite(by.term.eLow));
  const noRaise = await page.evaluate(() => { const st = JSON.parse(JSON.stringify(S)); st.calc.base.raise = 0; return calcSensitivity(st, computeCalc(st)).find((x) => x.key === "term").eHigh; });
  assert.ok(noRaise > 0, "ohne Tariferhöhung senkt eine längere Laufzeit die Kosten p.a.");
  const mags = rows.map((x) => Math.max(Math.abs(x.eLow), Math.abs(x.eHigh)));
  assert.deepEqual(mags, [...mags].sort((a, b) => b - a), "nach Wirkung sortiert");
  await page.click("#tab-auswertung");
  await page.fill('[data-cf="calc.eval.sensi"]', "20");
  await page.press('[data-cf="calc.eval.sensi"]', "Tab");
  assert.match(await page.textContent("#calc-card-sensi"), /−20 % \/ \+20 %/);
  const w20 = await page.evaluate(() => calcSensitivity(S, computeCalc(S)).find((x) => x.key === "wage").eHigh);
  near(w20, 2 * by.wage.eHigh, "doppelte Variation, doppelte Wirkung");
});

test("Varianten: speichern, vergleichen, laden, löschen, rückgängig, in der Datei", async (page) => {
  await loadExample(page);
  await page.click("#tab-auswertung");
  await page.fill("#calc-variant-name", "Basis");
  await page.click("#calc-variant-save");
  await page.evaluate(() => { S.calc.wages[0].rate = 25; persistState(); });
  await page.click("#tab-projekt"); await page.click("#tab-auswertung");
  await page.fill("#calc-variant-name", "Teurer Lohn");
  await page.click("#calc-variant-save");
  assert.deepEqual(await page.evaluate(() => S.variants.map((v) => v.name)), ["Basis", "Teurer Lohn"]);
  const head = await page.$$eval("#calc-card-variants thead th", (th) => th.map((x) => x.textContent));
  assert.equal(head.length, 4);
  assert.match(head[2], /^Basis/);
  await page.click('[data-variant-load="0"]');
  near(await page.evaluate(() => S.calc.wages[0].rate), 21.99909548268, "Variante geladen");
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.wages[0].rate), 25);
  await page.click('[data-variant-del="1"]');
  assert.deepEqual(await page.evaluate(() => S.variants.map((v) => v.name)), ["Basis"]);
  // Datei enthält die Varianten und ist ladbar
  const ok = await page.evaluate(() => { const o = JSON.parse(JSON.stringify(S)); validateFile(o); return o.variants.length; });
  assert.equal(ok, 1);
  await page.reload();
  assert.equal(await page.evaluate(() => S.variants.length), 1);
  const bad = await page.evaluate(() => { const o = JSON.parse(JSON.stringify(S)); o.variants[0].data.calc.salaries = "x"; try { validateFile(o); return ""; } catch (e) { return e.message; } });
  assert.match(bad, /Variante 1/);
});

test("Plausibilität: Mindestlohn, Festpreis-Risiko, Anzeige in Summary und Auswertung", async (page) => {
  await loadExample(page);
  await page.evaluate(() => { S.calc.wages[0].rate = 13.5; });
  const checks = await page.evaluate(() => calcChecks(S, computeCalc(S)));
  const text = checks.map((x) => x.text).join("\n");
  assert.match(text, /Mindestlohn: „Lohn 1“ liegt 2027 mit 13,50 €\/h unter 14,60 €\/h/);
  assert.match(text, /Mindestlohn ab 2028 noch nicht festgelegt/);
  assert.ok(checks.some((x) => x.sev === "warn"));
  await page.click("#tab-summary");
  assert.match(await page.textContent("#calc-panel-summary"), /\d+ Warnung/);
  await page.click("#tab-auswertung");
  assert.match(await page.textContent("#calc-card-checks"), /Mindestlohn/);
  // Ohne Auffälligkeit bei üblichen Löhnen
  await page.evaluate(() => { S.calc.wages[0].rate = 21.99909548268; });
  assert.doesNotMatch(await page.evaluate(() => calcChecks(S, computeCalc(S)).map((x) => x.text).join("\n")), /Mindestlohn: /);
});

test("Excel-Export (.xlsx) und Gesamtbericht", async (page) => {
  await loadExample(page);
  await page.click("#btn-dd-file");
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#btn-export-xlsx")]);
  assert.equal(download.suggestedFilename(), "ZV-Packmittel_kalkulation.xlsx");
  const buf = require("fs").readFileSync(await download.path());
  assert.equal(buf.slice(0, 2).toString(), "PK");
  const txt = buf.toString("utf8");
  for (const n of ["[Content_Types].xml", "xl/workbook.xml", "xl/styles.xml", "xl/worksheets/sheet11.xml"]) assert.ok(txt.includes(n), n);
  for (const n of ["Projekt", "Basisdaten", "Personal", "Personalbedarf", "Sachkosten", "Summary", "Jahre", "Cashflow", "Sensitivität", "Plausibilität", "OtO", "Versionen", "Änderungen"]) assert.ok(txt.includes('name="' + n + '"'), "Blatt " + n);
  const umv = await page.evaluate(() => computeCalc(S).sum.pa.umv);
  assert.ok(txt.includes("<v>" + umv + "</v>"), "Umsatz als Zahl");
  page.on("popup", () => {});
  await page.click("#btn-dd-file");
  const [popup] = await Promise.all([page.waitForEvent("popup"), page.click("#btn-report")]);
  await popup.waitForLoadState();
  assert.match(await popup.title(), /^Kalkulation – ZV-Packmittel/);
  const body = await popup.textContent("body");
  for (const h of ["Summary", "Personalkosten", "Sachkosten", "Ergebnis je Kalenderjahr", "Cashflow", "Sensitivitätsanalyse", "Plausibilität", "OtO-Werte", "Dokumentation und Freigabe", "Änderungsprotokoll"]) assert.ok(body.includes(h), h);
  assert.ok((await popup.locator("svg").count()) >= 3, "Diagramme im Bericht");
});

test("Vorlagen: speichern, laden, Standard für neue Kalkulationen; Dokumentation und Versionshistorie", async (page) => {
  await loadExample(page);
  await page.fill('[data-cf="calc.base.profit"]', "7");
  await page.press('[data-cf="calc.base.profit"]', "Tab");
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#calc-tpl-save")]);
  const tplPath = await download.path(), tpl = JSON.parse(require("fs").readFileSync(tplPath, "utf8"));
  assert.equal(tpl.tool, "Kalkulationstool-Vorlage");
  assert.equal(tpl.base.profit, 7);
  assert.equal(tpl.salaries, undefined, "keine Projektinhalte in der Vorlage");
  // Als Standard: neue Kalkulation übernimmt die Vorlage
  await page.click("#calc-tpl-default");
  await page.click("#btn-dd-file"); await page.click("#btn-new");
  assert.deepEqual(await page.evaluate(() => [S.calc.base.profit, S.calc.salaries.length]), [7, 0]);
  await page.click("#calc-tpl-clear");
  await page.click("#btn-dd-file"); await page.click("#btn-new");
  assert.equal(await page.evaluate(() => S.calc.base.profit), 6);
  // Vorlage laden: Basisdaten ändern sich, Projektinhalte bleiben
  await loadExample(page);
  const [chooser] = await Promise.all([page.waitForEvent("filechooser"), page.click("#calc-tpl-load")]);
  await chooser.setFiles(tplPath);
  await page.waitForTimeout(300);
  assert.deepEqual(await page.evaluate(() => [S.calc.base.profit, S.calc.salaries.length]), [7, 7]);
  // Dokumentation
  await page.click("#tab-dokumentation");
  await page.fill('[data-cf="calc.doc.version"]', "1.1");
  await page.fill('[data-cf="calc.doc.status"]', "Freigegeben");
  await page.click('[data-calc-act="add"][data-cl="history"]');
  await page.keyboard.type("1.1");
  await page.fill('[data-cf="calc.history.0.note"]', "Löhne aktualisiert");
  await page.press('[data-cf="calc.history.0.note"]', "Tab");
  assert.deepEqual(await page.evaluate(() => [S.calc.doc.version, S.calc.doc.status, S.calc.history[0].version, S.calc.history[0].note]), ["1.1", "Freigegeben", "1.1", "Löhne aktualisiert"]);
  await page.click("#tab-summary");
  assert.match(await page.textContent("#calc-panel-summary"), /1\.1 \(Freigegeben\)/);
});


test("Änderungsprotokoll: Felder, Zeilen, Einfügen, Reihenfolge, Rückgängig, Kommentar, Bearbeiter", async (page) => {
  await loadExample(page);
  const log = () => page.evaluate(() => S.audit.map((e) => ({ action: e.action, area: e.area, item: e.item, field: e.field, from: e.from, to: e.to, delta: e.delta, user: e.user, version: e.version })));
  const n0 = (await log()).length;
  assert.equal((await log())[0].action, "Beispielkalkulation geladen");
  await page.click("#tab-dokumentation");
  await page.fill("#calc-audit-user", "Erika Beispiel");
  await page.press("#calc-audit-user", "Tab");
  assert.equal((await log()).length, n0, "Bearbeitername ist keine Kalkulationsänderung");
  // Feldänderung mit alt, neu und Wirkung auf den Umsatz
  await page.click("#tab-personal");
  const umv0 = await page.evaluate(() => computeCalc(S).sum.pa.umv);
  await page.fill('[data-cf="calc.wages.0.rate"]', "23");
  await page.press('[data-cf="calc.wages.0.rate"]', "Tab");
  let e = (await log()).at(-1);
  assert.deepEqual([e.action, e.area, e.item, e.field, e.from, e.to, e.user, e.version], ["Eingabe", "Löhne", "Lohn 1", "Satz Jahr 1", "21,9991", "23", "Erika Beispiel", "1.0"]);
  near(e.delta, (await page.evaluate(() => computeCalc(S).sum.pa.umv)) - umv0, "Δ Umsatz p.a.");
  // Zeile gelöscht, Reihenfolge, Einfügen
  await page.click("#tab-sachkosten");
  await page.click('#calc-card-nu [data-calc-act="del"][data-ci="1"]');
  e = (await log()).at(-1);
  assert.deepEqual([e.action, e.area, e.field, e.from], ["Zeile gelöscht (Nachunternehmerleistung)", "Nachunternehmerleistung", "Zeile entfernt", "Menge 1; Preis 23.693,2508"]);
  await page.click('#calc-card-nu [data-calc-act="add"]');
  await page.keyboard.type("Wachdienst");
  await page.keyboard.press("Tab");
  e = (await log()).at(-1);
  assert.deepEqual([e.item, e.field, e.from, e.to], ["Wachdienst", "Bezeichnung", "–", "Wachdienst"]);
  await page.click('#calc-card-nu [data-calc-act="up"][data-ci="1"]');
  assert.equal((await log()).at(-1).field, "Reihenfolge geändert");
  await page.focus('[data-cf="calc.opex.0.name"]');
  await page.evaluate(() => { const dt = new DataTransfer(); dt.setData("text/plain", "Miete\t1\t80000\nEnergie\t1\t9000"); document.activeElement.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true, cancelable: true })); });
  const pasted = (await log()).filter((x) => x.action === "Einfügen in Betriebskosten").map((x) => x.field);
  assert.deepEqual(pasted, ["Bezeichnung", "Preis", "Zeile angelegt"]);
  // Rückgängig nimmt den Eintrag zurück
  const before = (await log()).length;
  await page.click("#btn-undo");
  assert.equal((await log()).length, before - 3);
  // Kommentar zu einem Eintrag erzeugt keinen neuen Eintrag und bleibt gespeichert
  await page.click("#tab-dokumentation");
  const cnt = (await log()).length;
  await page.fill('[data-cf="audit.' + (cnt - 1) + '.note"]', "Angebot Wachdienst neu");
  await page.press('[data-cf="audit.' + (cnt - 1) + '.note"]', "Tab");
  assert.equal((await log()).length, cnt);
  await page.waitForTimeout(200);
  await page.reload();
  assert.equal(await page.evaluate((i) => S.audit[i].note, cnt - 1), "Angebot Wachdienst neu");
  // Suche filtert die Tabelle
  await page.click("#tab-dokumentation");
  await page.fill("#calc-audit-search", "Wachdienst");
  // Treffer in Werten oder im Kommentar (Eingabefeld)
  const rows = await page.$$eval(".calc-audit tbody tr", (tr) => tr.map((x) => x.textContent + " " + [...x.querySelectorAll("input")].map((i) => i.value).join(" ")));
  assert.ok(rows.length >= 2 && rows.every((t) => /Wachdienst/.test(t)), rows.join(" | "));
  assert.equal(rows.length, await page.evaluate(() => S.audit.filter((e) => JSON.stringify(e).includes("Wachdienst")).length));
});

test("Versionen: abschließen mit Kennzahlen, Vergleich zur Vorversion, Filter, Datei-Prüfung", async (page) => {
  await loadExample(page);
  await page.click("#tab-dokumentation");
  await page.fill('[data-cf="calc.doc.note"]', "Erstkalkulation");
  await page.press('[data-cf="calc.doc.note"]', "Tab");
  await page.click("#calc-version-close");
  let st = await page.evaluate(() => ({ v: S.calc.doc.version, note: S.calc.doc.note, h: S.calc.history.map((x) => [x.version, x.note, x.umv, x.ebita]), umv: computeCalc(S).sum.pa.umv, eb: computeCalc(S).oto.offer.ebitaPct }));
  assert.equal(st.v, "1.1");
  assert.equal(st.note, "");
  assert.equal(st.h[0][0], "1.0");
  assert.match(st.h[0][1], /^Erstkalkulation · \d+ Änderungen$/);
  near(st.h[0][2], Math.round(st.umv * 100) / 100, "Umsatz der Version");
  near(st.h[0][3], Math.round(st.eb * 1e6) / 1e4, "EBITA-Marge der Version");
  // Änderung in Version 1.1, zweite Version, Vergleich zur Vorversion
  await page.click("#tab-personal");
  await page.fill('[data-cf="calc.wages.0.rate"]', "23");
  await page.press('[data-cf="calc.wages.0.rate"]', "Tab");
  assert.equal(await page.evaluate(() => S.audit.at(-1).version), "1.1");
  await page.click("#tab-dokumentation");
  await page.click("#calc-version-close");
  const h = await page.evaluate(() => S.calc.history.map((x) => x.umv));
  const txt = await page.textContent("#calc-card-history");
  assert.ok(txt.includes("+" + Math.round(h[1] - h[0]).toLocaleString("de-DE") + " €"), "Δ zur Vorversion: " + txt);
  // Filter nach Version
  await page.selectOption("#calc-audit-version", "1.1");
  const versions = await page.$$eval(".calc-audit tbody tr td:nth-child(2)", (td) => [...new Set(td.map((x) => x.textContent))]);
  assert.deepEqual(versions, ["1.1"]);
  // Datei: Protokoll enthalten und geprüft
  const ok = await page.evaluate(() => { const o = JSON.parse(JSON.stringify(S)); validateFile(o); return o.audit.length > 3; });
  assert.equal(ok, true);
  const errs = await page.evaluate(() => [
    (o) => { o.audit[0].fremd = "x"; }, (o) => { o.audit[0].delta = "viel"; }, (o) => { o.audit = "kein Protokoll"; },
  ].map((f) => { const o = JSON.parse(JSON.stringify(S)); f(o); try { validateFile(o); return ""; } catch (e) { return e.message; } }));
  errs.forEach((m) => assert.match(m, /Änderungsprotokoll/));
  assert.deepEqual(await page.evaluate(() => ["1.9", "2", "V3", "A", ""].map(calcNextVersion)), ["1.10", "3", "V4", "A.1", "1.1"]);
});

test("Leere Kalkulation: alle Register ohne Fehler und ohne waagerechten Überlauf", async (page) => {
  for (const n of ["projekt", "personal", "sachkosten", "summary", "auswertung", "oto", "dokumentation"]) {
    await page.click("#tab-" + n);
    assert.equal(await page.isVisible("#panel-" + n), true);
    const text = await page.textContent("#calc-panel-" + n);
    assert.doesNotMatch(text, /NaN|undefined|Infinity/, "Register " + n);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(sw <= 0, "Überlauf in Register " + n);
  }
  assert.match(await page.textContent("#calc-panel-summary"), /Start und Ende der Leistung eingeben/);
});

/* ---------------- V2.11 ---------------- */
const openTestData = async (page) => {
  await page.evaluate((t) => loadText(t), require("fs").readFileSync(DATA, "utf8"));
  await page.waitForTimeout(100);
};
const capex = (page) => page.evaluate(() => {
  const r = computeCalc(S), k = r.cost.capex;
  return { rows: k.rows.map((x) => ({ proc: x.proc, lz: x.lz, dep: x.dep, interest: x.interest, bookEnd: x.bookEnd, endCharge: x.endCharge, recovery: x.recovery, nominal: x.nominal, outside: x.outside })),
    cashT0: k.cashT0, invest: r.cash.invest, investLater: r.cash.investLater, otoInvest: r.oto.invest, fx: r.oto.fx, years: r.years.map((y) => ({ year: y.year, invOut: y.invOut, recovery: y.recovery })),
    checks: calcChecks(S, r).map((x) => x.text).join(" | "), mT: r.period.monthsTotal };
});
const setField = async (page, cf, value) => {
  const el = page.locator(`[data-cf="${cf}"]`);
  if ((await el.evaluate((e) => e.tagName)) === "SELECT") await el.selectOption(value);
  else { await el.fill(value); await el.press("Tab"); }
  await page.waitForTimeout(60);
};

test("Investitionen: Abschreibung über Vertragsmonate, Restbuchwert, Leasing, Startjahr; Excel-kompatibel ohne Wirkung", async (page) => {
  await openTestData(page);
  await page.click("#view-detail");
  await page.click("#tab-sachkosten");
  const base = await capex(page);
  assert.equal(base.mT, 60);
  // Nutzungsdauer 0: wie bisher über die Laufzeit (Annuität mit Kalkulationszins), Kapitalbindung zum Start
  assert.equal(base.rows[0].proc, "Kauf");
  near(base.rows[0].dep, 850000, "Abschreibung = Anschaffung");
  near(base.cashT0, base.rows[0].nominal + base.rows[1].nominal, "Kapitalbindung zum Start");
  // 8 Jahre Nutzungsdauer, Restwert 10.000: 60 von 96 Monaten abgeschrieben, Restbuchwert 325.000
  await setField(page, "calc.capex.0.usefulLife", "8");
  await setField(page, "calc.capex.0.residual", "10.000");
  let c = await capex(page);
  near(c.rows[0].dep, 840000 * 60 / 96, "Abschreibung über Vertragsmonate");
  near(c.rows[0].bookEnd, 325000, "Restbuchwert zum Vertragsende");
  near(c.rows[0].recovery, 10000, "Verwertung zum Restwert");
  near(c.rows[0].endCharge, 315000, "übriger Buchwert im letzten Jahr");
  near(c.rows[0].lz, c.rows[0].dep + c.rows[0].interest + c.rows[0].endCharge, "Kosten Laufzeit");
  assert.ok(c.rows[0].interest > 0, "kalkulatorische Zinsen auf den Restbuchwert");
  near(c.years.at(-1).recovery, 10000, "Rückfluss im letzten Jahr");
  assert.match(c.checks, /Restbuchwert über dem Restwert/);
  assert.match(await page.textContent("#calc-card-capex"), /Abschreibung, Beschaffung und Restbuchwert/);
  // Übernahme durch den Kunden: keine Belastung, Rückfluss in Höhe des Restbuchwerts, Warnung
  await setField(page, "calc.base.residualMode", "1");
  c = await capex(page);
  near(c.rows[0].endCharge, 0, "keine Belastung");
  near(c.rows[0].recovery, 325000, "Kunde zahlt den Restbuchwert");
  near(c.rows[0].lz, c.rows[0].dep + c.rows[0].interest, "Kosten Laufzeit ohne Restbuchwert");
  assert.match(c.checks, /vom Kunden übernommen/);
  await setField(page, "calc.base.residualMode", "0");
  // Leasing: keine Kapitalbindung, kein Investment im OtO, Kosten über die Nutzung; über das Vertragsende hinaus mit Warnung
  await setField(page, "calc.capex.0.procurement", "Leasing");
  c = await capex(page);
  near(c.rows[0].lz, 850000, "Leasingkosten vollständig in der Laufzeit");
  near(c.rows[0].nominal, 0, "kein Investment");
  near(c.cashT0, base.rows[1].nominal, "nur der Kauf bindet Kapital");
  near(c.otoInvest, base.rows[1].nominal * c.fx, "OtO-Investment ohne Leasing");
  assert.match(c.checks, /Leasing läuft über das Vertragsende hinaus/);
  assert.match(c.checks, /Restwert wird bei Leasing nicht berücksichtigt/);
  // Kauf im dritten Vertragsjahr: Auszahlung im Kalenderjahr des Kaufs, nicht zum Start
  await setField(page, "calc.capex.0.procurement", "Kauf");
  await setField(page, "calc.capex.0.residual", "0");
  await setField(page, "calc.capex.0.startYear", "3");
  await setField(page, "calc.capex.0.usefulLife", "3");
  c = await capex(page);
  near(c.cashT0, base.rows[1].nominal, "Start ohne die spätere Investition");
  assert.deepEqual(c.years.filter((y) => y.invOut > 0).map((y) => y.year), [2029]);
  near(c.investLater, 850000, "Investition im Startjahr");
  near(c.rows[0].dep, 850000, "voll abgeschrieben");
  near(c.rows[0].bookEnd, 0, "kein Restbuchwert");
  // Startjahr nach dem Vertragsende: nicht berücksichtigt, Warnung
  await setField(page, "calc.capex.0.startYear", "9");
  c = await capex(page);
  assert.ok(c.rows[0].outside);
  near(c.rows[0].lz, 0, "außerhalb der Laufzeit");
  assert.match(c.checks, /Startjahr 9 liegt nach dem Vertragsende/);
  // Excel-kompatibel: Angaben ohne Wirkung, linear über die Laufzeit
  await page.evaluate(() => { S.calc.excelMode = true; refreshAll(); });
  c = await capex(page);
  near(c.rows[0].lz, 850000, "linear, ohne Startjahr und Zinsen");
  assert.match(await page.textContent("#calc-card-capex"), /Excel-kompatibel: Beschaffung, Startjahr, Nutzungsdauer und Restwert wirken nicht/);
});

test("Migration V2.10: Vorgaben Nutzungsdauer 1 und Startjahr 1 werden zurückgesetzt, eigene Werte bleiben", async (page) => {
  const obj = JSON.parse(require("fs").readFileSync(DATA, "utf8"));
  obj.toolVersion = "V2.10";
  Object.assign(obj.calc.capex[0], { procurement: "Kauf", startYear: 1, usefulLife: 1, residual: 0 });
  Object.assign(obj.calc.capex[1], { procurement: "Kauf", startYear: 1, usefulLife: 5, residual: 0 });
  obj.calc.opex[0].usefulLife = 1; // Altfeld aus V2.10 in den Betriebskosten
  await page.evaluate((t) => loadText(t), JSON.stringify(obj));
  await page.waitForTimeout(100);
  const r = await page.evaluate(() => ({ c: S.calc.capex.map((x) => [x.usefulLife, x.startYear]), opex: "usefulLife" in S.calc.opex[0], toast: [...document.querySelectorAll(".toast")].map((t) => t.textContent).join(" ") }));
  assert.deepEqual(r.c, [[0, 0], [5, 1]]);
  assert.equal(r.opex, false, "Altfelder der Betriebskosten entfernt");
  assert.match(r.toast, /Vorgabe aus V2\.10/);
  // Ab V2.11 gespeicherte Werte bleiben unverändert
  obj.toolVersion = "V2.11";
  await page.evaluate((t) => loadText(t), JSON.stringify(obj));
  assert.deepEqual(await page.evaluate(() => S.calc.capex.map((x) => [x.usefulLife, x.startYear])), [[1, 1], [5, 1]]);
});

test("Kategorien und Ansicht: Spalte in der Detailansicht, Auswertung in Summary und Excel", async (page) => {
  await openTestData(page);
  // Kategorien der Testdatei leeren, damit die Auswertung nur die hier gesetzten zeigt
  await page.evaluate(() => { for (const k of ["capex", "opex", "nu", "rampup"]) S.calc[k].forEach((r) => (r.category = "")); refreshAll(); });
  await page.click("#view-standard");
  await page.click("#tab-sachkosten");
  assert.equal(await page.locator('#calc-card-capex th:has-text("Kategorie")').first().isVisible(), false, "Standard ohne Kategorie");
  assert.equal(await page.locator(".calc-capex-detail").isVisible(), false);
  await page.click("#view-detail");
  assert.ok(await page.locator('#calc-card-capex th:has-text("Kategorie")').first().isVisible());
  await setField(page, "calc.capex.0.category", "Fördertechnik");
  await setField(page, "calc.opex.0.category", "Gebäude/Miete");
  await setField(page, "calc.opex.1.category", "Gebäude/Miete");
  const r = await page.evaluate(() => { const c = computeCalc(S); return { cats: c.categories, mat: ["capex", "opex", "nu", "rampup"].reduce((a, k) => a + c.cost[k].lz, 0) }; });
  assert.deepEqual(r.cats.filter((x) => x.name).map((x) => [x.name, x.n]).sort(), [["Fördertechnik", 1], ["Gebäude/Miete", 2]]);
  assert.equal(r.cats.at(-1).name, "", "ohne Kategorie zuletzt");
  near(r.cats.reduce((a, x) => a + x.lz, 0), r.mat, "Kategorien ergeben die Sachkosten");
  await page.click("#tab-summary");
  const card = await page.textContent("#calc-card-categories");
  assert.match(card, /Fördertechnik/);
  assert.match(card, /ohne Kategorie/);
  const sheets = await page.evaluate(() => calcExportSheets().find((x) => x.name === "Sachkosten").rows.map((row) => row.map((c) => (c && typeof c === "object" ? c.v : c)).join("|")).join("\n"));
  assert.match(sheets, /Kategorie\|Menge/);
  assert.match(sheets, /Sachkosten nach Kategorie/);
  assert.match(sheets, /Fördertechnik/);
  // Standardansicht: Hinweis, dass Abschreibungsdetails wirken
  await page.evaluate(() => { S.calc.capex[0].usefulLife = 8; refreshAll(); });
  await page.click("#view-standard");
  await page.click("#tab-sachkosten");
  assert.ok(await page.locator("text=Abschreibungsdetails sind hinterlegt").isVisible());
});

test("KPI-Leiste: läuft beim Tippen mit, springt zur markierten Herkunft", async (page) => {
  await openTestData(page);
  await page.click("#tab-sachkosten");
  const value = () => page.locator('.kpi-card[data-origin-source="toPa"] .kpi-value').textContent();
  const before = await value();
  const inp = page.locator('[data-cf="calc.capex.0.price"]');
  await inp.click();
  await inp.press("End");
  await page.keyboard.type("0");
  await page.waitForTimeout(100);
  assert.notEqual(await value(), before, "ohne Verlassen des Feldes aktualisiert");
  await page.keyboard.press("Tab");
  // Jede Kennzahl hat eine markierte Herkunft im Zielregister
  const cards = await page.$$eval(".kpi-card", (els) => els.map((e) => [e.dataset.originTab, e.dataset.originSource]));
  assert.equal(cards.length, 8);
  for (const [tab, src] of cards) {
    await page.evaluate((t) => showTab(t), tab);
    assert.ok(await page.locator(`#panel-${tab} [data-kpi-source~="${src}"]`).count(), "Herkunft " + src);
  }
  await page.click('.kpi-card[data-origin-source="investment"]');
  await page.waitForTimeout(100);
  assert.equal(await page.getAttribute("#tab-sachkosten", "aria-selected"), "true");
  assert.equal(await page.locator('#panel-sachkosten [data-kpi-source~="investment"]').getAttribute("id"), "calc-card-capex");
  // Auswahl bleibt beim Rechnen geöffnet
  await page.click("#kpi-config");
  await page.evaluate(() => refreshCalcOutputs());
  assert.ok(await page.locator("#kpi-picker.open").count());
});

test("Kopfzeile und Fußzeile: Anordnung, Version, Fußzeile unten auf der Startseite", async (page) => {
  assert.equal(await page.locator("#btn-home").count(), 0, "kein doppelter Start-Knopf");
  const order = await page.$$eval("header .hdr-actions > *:not(input)", (els) => els.map((e) => e.className.split(" ").pop() || e.id));
  assert.deepEqual(order, ["hdr-group", "view-switch", "lang-switch"]);
  assert.deepEqual(await page.$$eval("header .hdr-group > *", (els) => els.map((e) => e.id)), ["btn-undo", "btn-save-quick", "dd-file"]);
  const ver = await page.evaluate(() => APP_VERSION);
  assert.equal(ver, "V2.11");
  assert.match(await page.title(), /Kalkulationstool V2\.11/);
  assert.match(await page.textContent("#app-footer"), /V2\.11/);
  assert.match(await page.textContent("#app-ver"), /V2\.11/);
  // Fußzeile am unteren Rand, auch wenn die Startseite kürzer als das Fenster ist
  await page.setViewportSize({ width: 1440, height: 1400 });
  const f = await page.evaluate(() => ({ bottom: Math.round($("app-footer").getBoundingClientRect().bottom), h: innerHeight }));
  assert.equal(f.bottom, f.h);
  await page.setViewportSize({ width: 390, height: 844 });
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "Kopfzeile bei 390 px ohne Überlauf");
});

test("Speichern unter ohne Dateizugriff: Dateiname abfragen, danach Speichern unter diesem Namen", async (page) => {
  await loadExample(page);
  assert.ok(await page.locator("#hdr-dirty").isVisible(), "ungespeicherte Änderungen markiert");
  await page.click("#btn-dd-file");
  const [d1] = await Promise.all([page.waitForEvent("download"), page.click("#btn-save-as")]);
  assert.equal(d1.suggestedFilename(), "ZV-Packmittel_kalkulation.json");
  assert.equal(await page.textContent("#hdr-file-name"), "ZV-Packmittel_kalkulation.json");
  assert.equal(await page.locator("#hdr-dirty").isVisible(), false);
  // Ansicht, Register und Sprache ändern die Kalkulation nicht
  await page.click("#view-detail");
  await page.click("#tab-summary");
  await page.click('.lang-switch [data-lang="en"]');
  await page.click('.lang-switch [data-lang="de"]');
  await page.click("#tab-projekt");
  assert.equal(await page.locator("#hdr-dirty").isVisible(), false, "ohne Änderung nicht markiert");
  await setField(page, "calc.base.profit", "7");
  assert.ok(await page.locator("#hdr-dirty").isVisible());
  const [d2] = await Promise.all([page.waitForEvent("download"), page.keyboard.press("Control+s")]);
  assert.equal(d2.suggestedFilename(), "ZV-Packmittel_kalkulation.json");
  assert.equal(JSON.parse(require("fs").readFileSync(await d2.path(), "utf8")).calc.base.profit, 7);
  assert.equal(await page.locator("#hdr-dirty").isVisible(), false);
  // Dateiname und Status bleiben nach dem Neuladen erhalten
  await page.reload();
  assert.equal(await page.textContent("#hdr-file-name"), "ZV-Packmittel_kalkulation.json");
});

test("Speichern unter und Öffnen mit Dateizugriff: gleiche Datei wird überschrieben", async (page) => {
  await page.addInitScript(() => {
    window.__files = {};
    window.__pickerCalls = 0;
    const handle = (name) => ({ name, createWritable: async () => ({ write: async (b) => { window.__files[name] = await b.text(); }, close: async () => {} }),
      getFile: async () => new File([window.__files[name] || ""], name, { type: "application/json" }) });
    window.showSaveFilePicker = async (o) => { window.__pickerCalls++; window.__suggested = o.suggestedName; return handle("angebot-a.json"); };
    window.showOpenFilePicker = async () => [handle("angebot-a.json")];
  });
  await page.reload();
  await loadExample(page);
  await page.click("#btn-save-quick"); // erstes Speichern fragt nach Ablageort
  await page.waitForTimeout(100);
  let r = await page.evaluate(() => ({ calls: __pickerCalls, sug: __suggested, saved: JSON.parse(__files["angebot-a.json"]).meta.name }));
  assert.deepEqual(r, { calls: 1, sug: "ZV-Packmittel_kalkulation.json", saved: "ZV-Packmittel" });
  assert.equal(await page.textContent("#hdr-file-name"), "angebot-a.json");
  await setField(page, "meta.name", "Variante A");
  await page.keyboard.press("Control+s");
  await page.waitForTimeout(100);
  r = await page.evaluate(() => ({ calls: __pickerCalls, saved: JSON.parse(__files["angebot-a.json"]).meta.name }));
  assert.deepEqual(r, { calls: 1, saved: "Variante A" }, "ohne erneute Abfrage in dieselbe Datei");
  await page.keyboard.press("Control+Shift+S");
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => __pickerCalls), 2, "Speichern unter fragt erneut");
  // Öffnen über den Dateizugriff
  await page.evaluate(() => { newCalc(); });
  await page.click("#btn-dd-file");
  await page.click("#btn-open");
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => S.meta.name), "Variante A");
  assert.equal(await page.textContent("#hdr-file-name"), "angebot-a.json");
  assert.equal(await page.locator("#hdr-dirty").isVisible(), false);
}, { fsAccess: true });

test("Sprache Englisch: Oberfläche, Zahlenformat, Meldungen, Bericht und Excel; Nutzerdaten unverändert", async (page) => {
  await openTestData(page);
  // Nutzerdaten, die zufällig Begriffen der Oberfläche entsprechen
  await page.evaluate(() => { S.meta.kunde = "Investitionen"; S.calc.capex[1].name = "Kauf"; S.calc.capex[1].category = "Sachkosten"; refreshAll(); });
  await page.click('.lang-switch [data-lang="en"]');
  assert.equal(await page.getAttribute("html", "lang"), "en");
  assert.equal(await page.textContent("#tab-sachkosten"), "Material costs");
  assert.equal(await page.textContent("#btn-save-quick"), "Save");
  assert.match(await page.textContent("#app-footer"), /runs locally in the browser/);
  await page.click("#tab-home");
  assert.match(await page.textContent(".home-hero"), /Investitionen/, "Kunde unverändert");
  await page.click("#view-detail");
  await page.click("#tab-summary");
  const sum = await page.textContent("#calc-panel-summary");
  assert.match(sum, /Revenue incl\. negotiation/);
  assert.match(sum, /Investitionen/);
  assert.match(sum, /Sachkosten/, "Kategorie als Nutzerdatum");
  await page.click("#tab-sachkosten");
  assert.match(await page.textContent(".calc-capex-detail"), /Kauf/, "Name der Position unverändert");
  assert.match(await page.textContent(".calc-capex-detail"), /Depreciation, procurement and residual book value/);
  // Zahlen im englischen Format, Eingabe ebenso
  assert.equal(await page.inputValue('[data-cf="calc.capex.1.price"]'), "1,450.5");
  await setField(page, "calc.capex.1.price", "2,000.75");
  assert.equal(await page.evaluate(() => S.calc.capex[1].price), 2000.75);
  assert.match(await page.textContent(".kpi-card .kpi-value"), /^\d{1,3}(,\d{3})+ €$/);
  // Meldungen
  const msgs = [];
  page.on("dialog", (d) => msgs.push(d.message()));
  await page.evaluate(() => newCalc());
  assert.match(msgs.join(" | "), /Start a new calculation\?/);
  await page.click("#btn-undo");
  // Bericht
  await page.click("#btn-dd-file");
  const [popup] = await Promise.all([page.waitForEvent("popup"), page.click("#btn-report")]);
  await popup.waitForLoadState();
  assert.match(await popup.title(), /^Calculation – Testkalkulation Kombinationen/);
  assert.match(await popup.textContent("body"), /Cash flow and capital commitment/);
  await popup.close();
  // Excel mit englischen Blattnamen und Überschriften
  const sheets = await page.evaluate(() => calcExportTranslate(calcExportSheets()).map((x) => x.name));
  assert.ok(sheets.includes("Material costs") && sheets.includes("Base data"), sheets.join(","));
  // Sprache bleibt nach dem Neuladen, Rückkehr zu Deutsch
  await page.reload();
  assert.equal(await page.textContent("#tab-sachkosten"), "Material costs");
  await page.click('.lang-switch [data-lang="de"]');
  assert.equal(await page.textContent("#tab-sachkosten"), "Sachkosten");
  await page.click("#tab-sachkosten");
  assert.equal(await page.inputValue('[data-cf="calc.capex.1.price"]'), "2.000,75");
  assert.equal(await page.evaluate(() => S.meta.kunde), "Investitionen");
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
    if (!t.fsAccess) await context.addInitScript(() => { window.showOpenFilePicker = undefined; window.showSaveFilePicker = undefined; });
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
