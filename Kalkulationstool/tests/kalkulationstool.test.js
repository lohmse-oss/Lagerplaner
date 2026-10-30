// Tests zum Kalkulationstool (Nachbau des Kalkulationstools Light V1.0, eigenständige Datei)
//   Rechenkern gegen die Werte der Excel-Vorlage (Excel-kompatibel) und die Korrekturen,
//   Listen (anlegen, duplizieren, verschieben, löschen, aus Excel einfügen), Auswahllisten,
//   Projektdaten, Rückgängig, Speichern und Öffnen, Übernahme aus dem Lagerplaner, Import-Prüfung, Druck und Kopie.
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
const test = (name, fn) => tests.push({ name, fn });
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
  const live = await page.textContent("#calc-card-salaries tbody tr:first-child td:nth-child(11)");
  assert.equal(live, await page.evaluate(() => calcEur(computeCalc(S).sal.rows[0].AG)), "Kosten p.a. sofort aktualisiert");
  assert.notEqual(live, await page.evaluate((b) => calcEur(b), before));
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
  assert.deepEqual(await page.evaluate(() => S.calc.nu[2]), { name: "Wachdienst", qty: 2, price: 12000.5 });
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
  const w = await page.evaluate(() => S.calc.wages.slice(2));
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
  assert.match(await page.title(), /^Neues Projekt · Kalkulationstool/);
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
  assert.deepEqual(r.lists, [3, 3, 2, 3, 1, 2, 9]);
  assert.deepEqual([r.months, r.warn, r.fx, r.cur, r.sl, r.name], [60, [], 0.94, "CHF", "Warehouse", "Testkalkulation Kombinationen"]);
  near(r.to, r.umv * 0.94, "Angebots-TO in CHF");
  assert.equal(r.rampup, 100000, "Gutschrift mindert den Ramp-up");
  assert.equal(await page.textContent("#hdr-proj"), "Testkalkulation Kombinationen · Testkunde");
  // Rückgängig stellt den gespeicherten Stand wieder her
  await page.click("#btn-undo");
  assert.equal(await page.evaluate(() => S.calc.oto.offerNo), "A-4711");
  // Werte außerhalb der Grenzen werden beim Öffnen begrenzt
  const st = await page.evaluate(() => { const st = JSON.parse(JSON.stringify(S)); st.calc.wages = [{ name: "X", fte: -3 }]; return st; });
  await page.evaluate((t) => loadText(t), JSON.stringify(st));
  assert.deepEqual(await page.evaluate(() => S.calc.wages), [{ name: "X", fte: 0, rate: 0, gross: 0 }]);
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
  for (const tab of ["projekt", "personal", "sachkosten", "summary", "oto"]) {
    await page.click("#tab-" + tab);
    const n = await page.locator(`#panel-${tab} button:not([disabled])`).count();
    for (let i = 0; i < n; i++) {
      const b = page.locator(`#panel-${tab} button:not([disabled])`).nth(i);
      if (await b.count()) await b.click();
    }
    await page.click("#tab-" + tab);
  }
  // Beschriftung für jedes Eingabefeld
  for (const tab of ["projekt", "personal", "sachkosten", "summary", "oto"]) await page.evaluate((t) => showTab(t), tab);
  const unlabeled = await page.$$eval("#panels input:not([type=hidden]),#panels textarea", (els) => els.filter((e) => !(e.labels && e.labels.length) && !e.getAttribute("aria-label")).map((e) => e.outerHTML.slice(0, 80)));
  assert.deepEqual(unlabeled, []);
  await page.setViewportSize({ width: 390, height: 844 });
  for (const tab of ["projekt", "personal", "sachkosten", "summary", "oto"]) {
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
  near(await page.evaluate(() => computeCalc(S).sum.pa.umv), 5798336.976193844, "Umsatz mit Grenzen");
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
  assert.deepEqual(await page.evaluate(() => S.calc.nu.slice(1)), [{ name: "Sammel", qty: 1, price: 5000 }, { name: "", qty: 1, price: 0 }]);
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

test("Leere Kalkulation: alle Register ohne Fehler und ohne waagerechten Überlauf", async (page) => {
  for (const n of ["projekt", "personal", "sachkosten", "summary", "oto"]) {
    await page.click("#tab-" + n);
    assert.equal(await page.isVisible("#panel-" + n), true);
    const text = await page.textContent("#calc-panel-" + n);
    assert.doesNotMatch(text, /NaN|undefined|Infinity/, "Register " + n);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(sw <= 0, "Überlauf in Register " + n);
  }
  assert.match(await page.textContent("#calc-panel-summary"), /Start und Ende der Leistung eingeben/);
});

(async () => {
  const browser = await chromium.launch();
  let failed = 0;
  for (const t of tests) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]).catch(() => {});
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
