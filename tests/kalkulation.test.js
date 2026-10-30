// Tests zur Phase Kalkulation (Nachbau des Kalkulationstools Light V1.0)
//   Rechenkern gegen die Werte der Excel-Vorlage (Excel-kompatibel) und die Korrekturen,
//   Listen (anlegen, duplizieren, verschieben, löschen, aus Excel einfügen), Auswahllisten,
//   gemeinsame Projektdaten, Rückgängig, Speichern und Laden, Import-Prüfung, Druck und Kopie.
// Ausführen: node tests/kalkulation.test.js   (benötigt das npm-Paket "playwright" mit Chromium)
"use strict";
const path = require("path");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");

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
  await page.click('#tabs .phase[data-phase="calc"]');
  await page.click("#tab-12");
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
  await page.click("#tab-15");
  assert.match(await page.textContent("#calc-panel-15"), /Excel-kompatibel/);
  assert.match(await page.textContent("#calc-panel-15"), /5\.800\.235 €/);
});

test("Korrigiert: Gross Profit mit HV und BU auf den Umsatz ohne Verhandlung, Wechselkurs wirkt", async (page) => {
  await loadExample(page);
  let r = await result(page);
  near(r.umv, EXCEL.umv, "Umsatz unverändert");
  near(r.gp, GP_CORRECTED, "Gross Profit korrigiert");
  near(r.gpWalk, EXCEL.gpWalk, "Walkaway unverändert");
  await page.click("#tab-16");
  await page.fill('[data-cf="calc.oto.rate"]', "1,1");
  r = await result(page);
  near(r.to, EXCEL.umv * 1.1, "TO in Angebotswährung");
  assert.match(await page.textContent("#calc-panel-16"), /6\.380\.257,95 EUR/);
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
  await page.evaluate(() => { S.calc.excelMode = false; S.request.eop = "2026-01-01"; showTab(15); });
  assert.match(await page.textContent("#calc-panel-15"), /Leistungsende liegt vor dem Start/);
});

test("Eingabe: deutsche Zahlen, Ausgaben laufen mit, Rückgängig je Feld", async (page) => {
  await loadExample(page);
  await page.click("#tab-13");
  const cell = '[data-cf="calc.salaries.0.rate"]';
  const before = await page.evaluate(() => computeCalc(S).sal.AG);
  await page.fill(cell, "80.000");
  assert.equal(await page.evaluate(() => S.calc.salaries[0].rate), 80000);
  const live = await page.textContent("#calc-card-salaries tbody tr:first-child td:nth-child(11)");
  assert.match(live, /104\.602 €/, "Kosten p.a. sofort aktualisiert");
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
  await page.click("#tab-14");
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
  await page.click("#tab-14");
  assert.deepEqual(await names(), start);
});

test("Einfügen aus Excel: Zellbereich füllt Zeilen und legt fehlende an", async (page) => {
  await loadExample(page);
  await page.click("#tab-13");
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
  assert.match(await page.textContent("#calc-panel-12"), /24,860 %/);
});

test("Gemeinsame Projektdaten: Kopfzeile und Projekt- und Anfragedaten", async (page) => {
  await loadExample(page);
  await page.fill('[data-cf="meta.name"]', "ZV-Packmittel");
  assert.equal(await page.inputValue("#in-projname"), "ZV-Packmittel");
  await page.fill('[data-cf="request.contact"]', "Erika Muster");
  await page.press('[data-cf="request.contact"]', "Tab");
  await page.click('#tabs .phase[data-phase="rep"]'); await page.click("#tab-9");
  assert.equal(await page.inputValue('#request-form [data-req="contact"]'), "Erika Muster");
  assert.equal(await page.inputValue('#request-form [data-req="sop"]'), "2027-03-01");
  await page.fill('#request-form [data-req="eop"]', "2031-02-28");
  await page.dispatchEvent('#request-form [data-req="eop"]', "change");
  await page.click('#tabs .phase[data-phase="calc"]'); await page.click("#tab-12");
  assert.equal(await page.inputValue('[data-cf="request.eop"]'), "2031-02-28");
  assert.equal(await page.evaluate(() => computeCalc(S).period.monthsTotal), 48);
  await page.fill("#in-kunde", "Neuer Kunde");
  await page.waitForTimeout(300);
  assert.equal(await page.inputValue('[data-cf="meta.kunde"]'), "Neuer Kunde");
});

test("Speichern und Laden: Browserspeicher, Planungsdatei, Szenario", async (page) => {
  await loadExample(page);
  await page.click("#tab-16");
  await page.fill('[data-cf="calc.oto.offerNo"]', "A-4711");
  await page.press('[data-cf="calc.oto.offerNo"]', "Tab");
  await page.waitForTimeout(300);
  const json = await page.evaluate(() => JSON.stringify(S));
  await page.reload();
  assert.equal(await page.evaluate(() => S.calc.oto.offerNo), "A-4711");
  assert.equal(await page.evaluate(() => S.calc.salaries.length), 7);
  await page.evaluate(() => { S = defaults(); recalc(); });
  await page.evaluate((t) => applyJson(t), json);
  near(await page.evaluate(() => computeCalc(S).sum.pa.umv), EXCEL.umv, "nach Laden");
  // Ältere Planungsdatei ohne Kalkulation: Standardwerte
  await page.evaluate(() => { const st = JSON.parse(JSON.stringify(S)); delete st.calc; applyJson(JSON.stringify(st)); });
  assert.equal(await page.evaluate(() => S.calc.salaries.length), 0);
  assert.equal(await page.evaluate(() => S.calc.base.profit), 6);
  // Zeilen mit fehlenden Feldern und Werten außerhalb der Grenzen werden ergänzt und begrenzt
  await page.evaluate(() => { const st = JSON.parse(JSON.stringify(S)); st.calc.wages = [{ name: "X", fte: -3 }]; applyJson(JSON.stringify(st)); });
  assert.deepEqual(await page.evaluate(() => S.calc.wages), [{ name: "X", fte: 0, rate: 0, gross: 0 }]);
  // Szenario speichert die Kalkulation mit (Szenarien setzen Positionen voraus)
  await page.click('#tabs [data-tab="0"]');
  await page.click("#start-example");
  await page.evaluate(() => { S.calc.capex = [{ name: "Regal", qty: 2, price: 10 }]; saveScenario(1); S.calc.capex = []; restoreScenario(1); });
  assert.equal(await page.evaluate(() => S.calc.capex[0].name), "Regal");
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
      try { validateImportedPayload(JSON.parse(JSON.stringify(st)), "project"); return null; } catch (e) { return e.message; }
    });
  });
  errors.forEach((e, i) => assert.ok(e && /Kalkulation/.test(e), "Fall " + (i + 1) + ": " + e));
  const ok = await page.evaluate(() => { const st = defaults(); st.calc = calcExample(); st.calc.oto.link = "https://example.sharepoint.com/sites/x"; validateImportedPayload(JSON.parse(JSON.stringify(st)), "project"); return true; });
  assert.equal(ok, true);
});

test("CAPEX aus Stückliste, Link zum Ablageordner, Kopieren und Drucken", async (page) => {
  await page.click("#start-example");
  await loadExample(page);
  await page.click("#tab-14");
  const capex = await page.evaluate(() => Math.round(R.capex.total));
  assert.ok(capex > 0);
  await page.click("#calc-capex-bom");
  await page.click("#calc-capex-bom");
  const rows = await page.evaluate(() => S.calc.capex.filter((x) => x.name === CALC_BOM_ROW));
  assert.deepEqual(rows, [{ name: "Lagertechnik lt. Stückliste (Lagerplaner)", qty: 1, price: capex }], "einmal angelegt, danach aktualisiert");
  await page.click("#tab-16");
  await page.fill('[data-cf="calc.oto.link"]', "https://example.sharepoint.com/sites/OtO");
  await page.press('[data-cf="calc.oto.link"]', "Tab");
  await page.waitForSelector(".calc-link");
  assert.equal(await page.getAttribute(".calc-link", "href"), "https://example.sharepoint.com/sites/OtO");
  await page.fill('[data-cf="calc.oto.link"]', "javascript:alert(1)");
  await page.press('[data-cf="calc.oto.link"]', "Tab");
  await page.waitForTimeout(100);
  assert.equal(await page.locator(".calc-link").count(), 0, "nur http- und https-Adressen als Link");
  // Der übernommene CAPEX erhöht den Umsatz um seinen Jahresanteil im Hundert
  const r = await page.evaluate(() => { const r = computeCalc(S); return { to: r.oto.offer.to, text: calcOtoText(r) }; });
  near(r.to, EXCEL.umv + (capex / 60 * 12) / 0.82 / 0.92, "Angebots-TO mit Stücklisten-CAPEX");
  const toText = r.to.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  assert.ok(r.text.includes("Angebots TO | Offer TO\t" + toText + " EUR"), r.text.slice(0, 600));
  assert.match(r.text, /Investment \(total netto\) \| Invest \(total net\)\t/);
  await page.click("#calc-oto-copy");
  await page.waitForSelector(".toast");
  for (const [id, title] of [["calc-print-oto", /OtO-Werte/], ["calc-print-summary", /Summary Kalkulation/]]) {
    if (id === "calc-print-summary") await page.click("#tab-15");
    const [popup] = await Promise.all([page.waitForEvent("popup"), page.click("#" + id)]);
    await popup.waitForLoadState();
    assert.match(await popup.title(), title);
    const body = await popup.textContent("body"), whole = r.to.toLocaleString("de-DE", { maximumFractionDigits: 0 });
    assert.ok(body.includes(whole + " €") || body.includes(toText + " EUR"), "Angebots-TO im Druck");
    await popup.close();
  }
});

test("Leere Kalkulation: alle Register ohne Fehler und ohne waagerechten Überlauf", async (page) => {
  await page.click('#tabs .phase[data-phase="calc"]');
  for (const n of ["12", "13", "14", "15", "16"]) {
    await page.click("#tab-" + n);
    assert.equal(await page.isVisible("#panel-" + n), true);
    const text = await page.textContent("#calc-panel-" + n);
    assert.doesNotMatch(text, /NaN|undefined|Infinity/, "Register " + n);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(sw <= 0, "Überlauf in Register " + n);
  }
  assert.match(await page.textContent("#calc-panel-15"), /Start und Ende der Leistung eingeben/);
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
