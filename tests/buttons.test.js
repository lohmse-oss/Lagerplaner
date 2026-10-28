// Button-Tests für Lagerplaner.html
//
//   Teil 1  Abdeckung: jedes anklickbare Element der Oberfläche steht im Aktionskatalog
//   Teil 2  Einzeltests: jede Aktion im leeren Projekt und mit Daten, mit erwarteter Wirkung
//   Teil 3  Bestätigungsdialoge: jeweils OK und Abbrechen
//   Teil 4  Rückgängig: legt eine Aktion einen Rückgängig-Schritt an, stellt Rückgängig den Stand exakt wieder her
//   Teil 5  Paarweise: Aktion A gefolgt von Aktion B, mit und ohne Daten im Wechsel. Standard: jedes 6. der
//           72 × 72 Paare (rund 4 Minuten); mit --voll alle Paare (rund 25 Minuten)
//   Teil 6  Zufallsfolgen: reproduzierbar über einen Startwert
//
// Nach jedem Schritt gelten die Grundregeln aus check(): keine Seitenfehler, Planungsstand und Browserspeicher
// bleiben ladbar, genau ein Register sichtbar, kein Darstellungsfehler, kein waagerechter Seitenüberlauf.
//
// Ausführen:  node tests/buttons.test.js [--voll] [--seed=N] [--folgen=N] [--schritte=N] [--teil=1,2,...]
// Benötigt das npm-Paket "playwright" mit Chromium.
"use strict";
const path = require("path");
const fs = require("fs");
const os = require("os");
const assert = require("assert/strict");
const { chromium } = require("playwright");

const FILE = "file://" + path.resolve(__dirname, "..", "Lagerplaner.html");
const ARGS = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, "").split("=")));
const SEED = Number(ARGS.seed || 20261027);
const SEQUENCES = Number(ARGS.folgen || 40);
const STEPS = Number(ARGS.schritte || 25);
const FULL = "voll" in ARGS;
const PAIR_STRIDE = FULL ? 1 : 6;
const PARTS = new Set(String(ARGS.teil || "1,2,3,4,5,6").split(",").map(Number));

/* ============================ Testdateien ============================ */
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "lagerplaner-buttons-"));
const PASTE_TEXT = "Bezeichnung\tLKW pro Tag\tArtikel\nExcel-1\t2,5\t1.200\nExcel-2\t1\t40\n";
const FIXTURES = {
  csv: path.join(TMP, "mengengeruest.csv"),
  project: path.join(TMP, "planung.json"),
  input: path.join(TMP, "tender-input.js"),
};
fs.writeFileSync(FIXTURES.csv, "Bezeichnung;LKW/Tag;Artikel;Stapelfaktor\nCSV-A;2;10;1+1\nCSV-B;1;5;1\nCSV-C;3;40;1+2\n");
// Planungs- und Eingabedatei werden beim Start aus der Anwendung selbst erzeugt (siehe makeFixtures)

/* ============================ Seite und Hilfen ============================ */
async function openApp(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
  const page = await context.newPage();
  page.setDefaultTimeout(5000);
  const ctx = { page, context, errors: [], dialogs: [], downloads: [], popups: [], confirm: true };
  page.on("pageerror", (e) => ctx.errors.push(e.message));
  page.on("dialog", async (d) => {
    ctx.dialogs.push({ type: d.type(), message: d.message() });
    if (d.type() === "confirm") await (ctx.confirm ? d.accept() : d.dismiss());
    else await d.accept();
  });
  page.on("download", (d) => ctx.downloads.push(d.suggestedFilename()));
  page.on("popup", async (p) => { ctx.popups.push(await p.title().catch(() => "")); await p.close().catch(() => {}); });
  await page.goto(FILE);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.evaluate(installHelpers);
  return ctx;
}

// Läuft im Seitenkontext: Zurücksetzen, Momentaufnahme und Grundregeln
function installHelpers() {
  window.__reset = (withData) => {
    document.querySelectorAll(".modal.on").forEach((m) => window.closeAccessibleModal(m.id));
    document.querySelectorAll(".dd.open").forEach((d) => d.classList.remove("open"));
    document.querySelectorAll(".toast").forEach((t) => t.remove());
    if (OPTIMIZATION_JOB) cancelOptimizationRun();
    $("opt-run-panel").hidden = true;
    $("opt-card").style.display = "none";
    LAST_OPT_ROWS = []; SENSI = null; clearDiff();
    S = defaults();
    if (withData) {
      const mk = (n, tr, st, sk) => Object.assign(newItem(), { name: n, trucks: tr, stack: st, skus: sk });
      S.items = [mk("A", 4, 1, 200), mk("B", 2, 3, 20), mk("C", 1, 1, 0)];
      S.building.L = 80; S.building.W = 60;
    }
    UNDO.length = 0; updateUndoBtn();
    VIEW.zoom = 1; VIEW.px = 0; VIEW.py = 0;
    if ($("app").classList.contains("kpis-collapsed")) setKpisCollapsed(false, true);
    closeItemDrawer();
    syncAll(); refreshModeUI(); renderItems(); recalc(); renderSensitivity(); showTab(0);
  };
  window.__snap = () => ({
    items: S.items.length,
    names: S.items.map((i) => i.name),
    tab: (document.querySelector("#tabs [data-tab].on") || {}).dataset?.tab,
    modals: [...document.querySelectorAll(".modal.on")].map((m) => m.id),
    menus: [...document.querySelectorAll(".dd.open")].map((m) => m.id),
    undo: UNDO.length,
    collapsed: $("app").classList.contains("kpis-collapsed"),
    zoom: VIEW.zoom,
    scenarios: (S.scenarios || []).map(Boolean),
    customLhm: Object.keys(S.customLhm || {}),
    customTrucks: Object.keys(S.customTrucks || {}),
    overrides: JSON.stringify(S.lhmOverrides || {}),
    sources: Object.keys(S.parameterSources || {}),
    diff: !$("btn-diff-clear").disabled,
    sensi: SENSI ? SENSI.rows.length : 0,
    optPanel: !$("opt-run-panel").hidden,
    optStatus: $("opt-run-status").textContent,
    optRows: LAST_OPT_ROWS.length,
    toasts: document.querySelectorAll(".toast").length,
    colw: localStorage.getItem("trbp-colw2"),
    drawer: DRAWER_INDEX,
    selected: document.querySelectorAll(".sel-cb:checked").length,
    trucks: S.items.map((i) => i.truck), lhm: S.items.map((i) => i.lhm),
    basis: S.items.map((i) => i.dataBasis), blockShare: S.items.map((i) => i.blockShare),
    status: $("calc-status").textContent, json: $("jsonArea").value.slice(0, 40), chip: $("src-chip").textContent,
  });
  window.__state = () => JSON.stringify(S);
  window.__check = () => {
    const p = [];
    try { validateImportedPayload(JSON.parse(JSON.stringify(S)), "project"); } catch (e) { p.push("Planungsstand nicht ladbar: " + e.message); }
    try { const st = localStorage.getItem("trbp-state"); if (st) validateImportedPayload(JSON.parse(st), "project"); } catch (e) { p.push("Browserspeicher nicht ladbar: " + e.message); }
    const visible = [...document.querySelectorAll(".panel.on")];
    if (visible.length !== 1) p.push("sichtbare Register: " + visible.length);
    const tab = document.querySelector("#tabs [data-tab].on");
    if (!tab || !$("panel-" + tab.dataset.tab).classList.contains("on")) p.push("Registerknopf und Inhalt passen nicht zusammen");
    if (/Darstellungsfehler/.test($("calc-status").textContent)) p.push($("calc-status").textContent);
    if (!$("kpi-ampel").textContent.trim()) p.push("Ampel ohne Text");
    if (document.documentElement.scrollWidth > innerWidth) p.push("waagerechter Seitenüberlauf");
    if (S.items.some((i) => !Number.isFinite(i.net))) p.push("Position ohne endlichen Bestand");
    return p;
  };
  // Schlüssel eines anklickbaren Elements; muss zu den Abdeckungsschlüsseln im Katalog passen
  window.__clickables = () => {
    const sel = "button,[role=button],[role=menuitem],[role=link],[data-goto],.lhm-reset,[data-del],#app-ver,tr[data-opt-idx]";
    const keys = new Set();
    for (const el of document.querySelectorAll(sel)) {
      const d = el.dataset;
      const key = el.id ? "#" + el.id
        : d.phase ? "phase:" + d.phase
        : d.goto ? (el.closest("#kpis") ? "kpi-goto" : "goto")
        : d.scenSave ? "scen-save" : d.scenLoad ? "scen-load" : d.scenClear ? "scen-clear"
        : d.del !== undefined ? "item-del" : d.edit !== undefined ? "item-edit"
        : d.paramReset ? "param-reset" : d.paramSource ? "param-source" : d.lhmReset ? "lhm-reset" : d.lhmDel ? "lhm-del" : d.trkDel ? "trk-del"
        : d.sourceSave !== undefined ? "source-save" : d.optIdx !== undefined ? "opt-row"
        : "?" + el.outerHTML.slice(0, 80);
      keys.add(key);
    }
    return [...keys];
  };
}

const ev = (page, fn, arg) => page.evaluate(fn, arg);
const go = (page, tab) => ev(page, (t) => showTab(t), tab);
const snap = (page) => ev(page, () => window.__snap());
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
async function withEvent(page, event, action, timeout = 2500) {
  const [res] = await Promise.all([page.waitForEvent(event, { timeout }).catch(() => null), action()]);
  return res;
}
async function chooseFile(page, selector, file, viaMenu) {
  if (viaMenu) await page.click("#btn-dd-file");
  const chooser = await withEvent(page, "filechooser", () => page.click(selector));
  assert.ok(chooser, "Dateiauswahl öffnet sich");
  await chooser.setFiles(file);
  await wait(150);
}
async function selectRows(page, n) {
  await go(page, 2);
  const boxes = await page.$$("#itemsBody .sel-cb");
  for (const box of boxes.slice(0, n)) await box.check();
  return Math.min(n, boxes.length);
}
async function menu(page, id) { await page.click("#btn-dd-file"); await page.click("#" + id); }
async function waitOptimization(page) {
  await page.waitForFunction(() => !OPTIMIZATION_JOB, null, { timeout: 30000 });
}

/* ============================ Aktionskatalog ============================
   key      Name der Aktion (Ausgabe)
   covers   Abdeckungsschlüssel der Elemente, die die Aktion anklickt (Teil 1)
   run      führt die Aktion wie ein Nutzer aus; liefert "übersprungen", wenn sie im Zustand nicht möglich ist
   expect   prüft die Wirkung (Teil 2); a = Momentaufnahme vorher, b = nachher
   confirm  Aktion fragt nach; Teil 3 prüft OK und Abbrechen
   slow     in Teil 5 und 6 nur in jedem 4. Paar bzw. seltener                                       */
const TAB_NAMES = { 0: "Start", 1: "Vorgaben", 2: "Mengengerüst", 3: "Layout", 4: "Regal & Block", 5: "Stückliste & CAPEX", 6: "Varianten", 7: "Annahmen", 8: "Sensitivität", 9: "Berichte", 10: "Übersicht", 11: "Methodik" };
const PHASE_OF = { 1: "in", 2: "in", 3: "eng", 4: "eng", 5: "eng", 6: "eval", 7: "eval", 8: "eval", 9: "rep", 10: "rep", 11: "rep" };

const ACTIONS = [
  /* ---------- Navigation ---------- */
  ...Object.keys(TAB_NAMES).map((n) => ({
    key: "Register " + TAB_NAMES[n], covers: ["#tab-" + n],
    run: async (p) => {
      if (n !== "0") await p.click(`#tabs .phase[data-phase="${PHASE_OF[n]}"]`);
      await p.click("#tab-" + n);
    },
    expect: (a, b) => assert.equal(b.tab, n),
  })),
  ...["in", "eng", "eval", "rep"].map((ph) => ({
    key: "Phase " + ph, covers: ["phase:" + ph],
    run: (p) => p.click(`#tabs .phase[data-phase="${ph}"]`),
    expect: (a, b) => assert.equal(PHASE_OF[b.tab], ph),
  })),
  ...["gbp", "vol", "pal", "ffz", "blk", "fir", "cost"].map((pg) => ({
    key: "Vorgaben-Bereich " + pg, covers: ["#ptab-" + pg],
    run: async (p) => { await go(p, 1); await p.click("#ptab-" + pg); },
    expect: async (a, b, p) => assert.equal(await p.getAttribute("#ptab-" + pg, "aria-current"), "true"),
  })),
  {
    key: "Startseite: Sprungziele", covers: ["goto"],
    run: async (p) => {
      for (const n of ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]) {
        await go(p, 0); await p.click(`#panel-0 .linkbtn[data-goto="${n}"]`);
        assert.equal((await snap(p)).tab, n, "Sprung nach " + TAB_NAMES[n]);
      }
    },
  },
  {
    key: "Kennzahlen: Sprungziele", covers: ["#kpi-ampel-wrap", "#kpi-rack-is-wrap", "#kpi-block-is-wrap", "#kpi-capex-wrap", "#kpi-warn", "kpi-goto"],
    run: async (p) => {
      if ((await snap(p)).collapsed) await p.click("#btn-kpis-toggle");
      await p.evaluate(() => { const d = document.querySelector("details.kpi-more"); if (d) d.open = true; });
      const cards = await p.$$("#kpis [data-goto]");
      for (const c of cards) {
        const target = await c.getAttribute("data-goto");
        await c.click();
        assert.equal((await snap(p)).tab, target);
      }
    },
  },
  {
    key: "Kennzahlen ein-/ausklappen", covers: ["#btn-kpis-toggle"],
    run: (p) => p.click("#btn-kpis-toggle"),
    expect: (a, b) => assert.equal(b.collapsed, !a.collapsed),
  },

  /* ---------- Kopfzeile ---------- */
  {
    key: "Berechnung aktualisieren", covers: ["#btn-calc"],
    run: (p) => p.click("#btn-calc"),
    expect: (a, b) => { assert.ok(b.toasts > a.toasts, "Meldung erscheint"); assert.match(b.status, /Manuell berechnet/); },
  },
  {
    key: "Menü Varianten öffnen/schließen", covers: ["#btn-dd-opt"],
    run: async (p) => { await p.click("#btn-dd-opt"); assert.deepEqual((await snap(p)).menus, ["dd-opt"]); await p.click("#btn-dd-opt"); },
    expect: (a, b) => assert.deepEqual(b.menus, []),
  },
  {
    key: "Menü Datei öffnen/schließen", covers: ["#btn-dd-file"],
    run: async (p) => { await p.click("#btn-dd-file"); assert.deepEqual((await snap(p)).menus, ["dd-file"]); await p.keyboard.press("Escape"); },
    expect: (a, b) => assert.deepEqual(b.menus, []),
  },
  {
    key: "Optimierungslauf", covers: ["#btn-optimize", "#btn-opt-dismiss"], slow: true,
    run: async (p, ctx) => {
      await p.click("#btn-dd-opt"); await p.click("#btn-optimize");
      await waitOptimization(p);
      if (await p.isVisible("#btn-opt-dismiss")) await p.click("#btn-opt-dismiss");
    },
    expect: (a, b, p, ctx) => {
      if (a.items) assert.ok(b.optRows > 0, "Varianten vorhanden: " + b.optStatus);
      else assert.ok(ctx.dialogs.some((d) => /Positionen mit Bedarfsangaben/.test(d.message)));
      assert.equal(b.optPanel, false, "Leiste ausgeblendet");
    },
  },
  {
    key: "Optimierung abbrechen", covers: ["#btn-opt-cancel"], slow: true,
    run: async (p) => {
      if (!(await snap(p)).items) return "übersprungen";
      // Greenfield-Lauf dauert einige Sekunden, genug zum Abbrechen
      await p.evaluate(() => { S.building.mode = "greenfield"; syncAll(); refreshModeUI(); recalc(); });
      await p.click("#btn-dd-opt"); await p.click("#btn-optimize");
      if (!(await p.isVisible("#btn-opt-cancel"))) { await waitOptimization(p); return "übersprungen"; }
      await p.click("#btn-opt-cancel");
    },
    expect: (a, b) => { assert.match(b.optStatus, /abgebrochen/); },
  },
  {
    key: "Variante übernehmen", covers: ["opt-row"], slow: true,
    run: async (p) => {
      if (!(await snap(p)).items) return "übersprungen";
      if (!(await snap(p)).optRows) { await p.click("#btn-dd-opt"); await p.click("#btn-optimize"); await waitOptimization(p); }
      if (!(await snap(p)).optRows) return "übersprungen";
      await go(p, 3); await p.click("#opt-body tr[data-opt-idx='0']");
    },
    expect: (a, b) => assert.ok(b.undo > a.undo, "Übernahme ist rückgängig machbar"),
  },
  {
    key: "Rückgängig", covers: ["#btn-undo"],
    run: async (p) => { if (await p.isDisabled("#btn-undo")) return "übersprungen"; await p.click("#btn-undo"); },
    expect: (a, b) => assert.equal(b.undo, a.undo - 1),
  },
  {
    key: "Datei: Neue Planung", covers: ["#btn-new"], confirm: true,
    run: (p) => menu(p, "btn-new"),
    expect: (a, b, p, ctx) => ctx.confirm ? assert.equal(b.items, 0) : assert.equal(b.items, a.items),
  },
  {
    key: "Datei: Planungsdatei öffnen", covers: ["#btn-load"], confirm: true,
    run: (p) => chooseFile(p, "#btn-load", FIXTURES.project, true),
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["Datei-1", "Datei-2"]) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Datei: Planungsdatei speichern", covers: ["#btn-save", "#btn-json-close"],
    run: async (p) => { await menu(p, "btn-save"); assert.deepEqual((await snap(p)).modals, ["modal-json"]); await p.click("#btn-json-close"); },
    expect: (a, b, p, ctx) => { assert.ok(ctx.downloads.some((f) => /\.json$/.test(f))); assert.match(b.json, /^\{/); assert.deepEqual(b.modals, []); },
  },
  {
    key: "Datei: Eingabedatei laden", covers: ["#btn-reload-input"], confirm: true,
    run: (p) => chooseFile(p, "#btn-reload-input", FIXTURES.input, true),
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["Eingabe-1", "Eingabe-2", "Eingabe-3"]) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Datei: Mengengerüst aus CSV", covers: ["#btn-menu-csv"], confirm: true,
    run: (p) => chooseFile(p, "#btn-menu-csv", FIXTURES.csv, true),
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["CSV-A", "CSV-B", "CSV-C"]) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Mengengerüst: CSV importieren", covers: ["#btn-csv"], confirm: true,
    run: async (p) => { await go(p, 2); await chooseFile(p, "#btn-csv", FIXTURES.csv); },
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["CSV-A", "CSV-B", "CSV-C"]) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Datei: Eingabedatei erzeugen", covers: ["#btn-export-input"],
    run: async (p) => { await menu(p, "btn-export-input"); await p.click("#btn-json-close"); },
    expect: (a, b, p, ctx) => { assert.ok(ctx.downloads.includes("tender-input.js")); assert.match(b.json, /^window\.TENDER_INPUT = /); },
  },
  {
    key: "Datei: Stückliste als CSV", covers: ["#btn-menu-bom-csv"],
    run: async (p) => { await menu(p, "btn-menu-bom-csv"); await wait(150); },
    expect: (a, b, p, ctx) => a.items ? assert.ok(ctx.downloads.some((f) => /_Stueckliste\.csv$/.test(f))) : assert.ok(ctx.dialogs.some((d) => /Keine Stückliste/.test(d.message))),
  },
  {
    key: "Datei: Hallenlayout als PNG", covers: ["#btn-menu-layout-png"],
    run: async (p) => { await menu(p, "btn-menu-layout-png"); await wait(200); },
    expect: (a, b, p, ctx) => { assert.equal(b.tab, "3"); assert.ok(ctx.downloads.some((f) => /_Layout\.png$/.test(f))); },
  },
  {
    key: "Hilfe öffnen/schließen", covers: ["#btn-help", "#btn-help-close"],
    run: async (p) => { await p.click("#btn-help"); assert.deepEqual((await snap(p)).modals, ["modal-help"]); await p.click("#btn-help-close"); },
    expect: (a, b) => assert.deepEqual(b.modals, []),
  },
  {
    key: "Änderungslog öffnen/schließen", covers: ["#app-ver", "#btn-log-close"],
    run: async (p) => { await p.click("#app-ver"); assert.match(await p.textContent("#log-body"), /V2\.\d+/); await p.click("#btn-log-close"); },
    expect: (a, b) => assert.deepEqual(b.modals, []),
  },
  {
    key: "JSON-Dialog: JSON laden", covers: ["#btn-json-apply"], confirm: true,
    run: async (p) => {
      await menu(p, "btn-save");
      await p.fill("#jsonArea", fs.readFileSync(FIXTURES.project, "utf8"));
      await p.click("#btn-json-apply");
      if ((await snap(p)).modals.length) await p.click("#btn-json-close");
    },
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["Datei-1", "Datei-2"]) : assert.deepEqual(b.names, a.names),
  },

  /* ---------- Mengengerüst ---------- */
  {
    key: "Position hinzufügen", covers: ["#btn-add-item"],
    run: async (p) => { await go(p, 2); await p.click("#btn-add-item"); },
    expect: (a, b) => { assert.equal(b.items, a.items + 1); assert.equal(b.undo, a.undo + 1); },
  },
  {
    key: "Position löschen (×)", covers: ["item-del"], confirm: true,
    run: async (p) => { await go(p, 2); if (!(await p.$("#itemsBody [data-del]"))) return "übersprungen"; await p.click("#itemsBody [data-del]"); },
    expect: (a, b, p, ctx) => assert.equal(b.items, ctx.confirm ? a.items - 1 : a.items),
  },
  {
    key: "Auswahl löschen", covers: ["#btn-sel-del"], confirm: true,
    run: async (p) => { if (!(await selectRows(p, 2))) return "übersprungen"; await p.click("#btn-sel-del"); },
    expect: (a, b, p, ctx) => assert.equal(b.items, ctx.confirm ? Math.max(0, a.items - 2) : a.items),
  },
  {
    key: "LKW-Typ zuweisen", covers: ["#btn-sel-truck"],
    run: async (p) => { if (!(await selectRows(p, 2))) return "übersprungen"; await p.selectOption("#sel-truck", "mega"); await p.click("#btn-sel-truck"); },
    expect: (a, b) => assert.deepEqual(b.trucks.slice(0, 2), ["mega", "mega"].slice(0, Math.min(2, b.items))),
  },
  {
    key: "LHM-Typ zuweisen", covers: ["#btn-sel-lhm"],
    run: async (p) => { if (!(await selectRows(p, 1))) return "übersprungen"; await p.selectOption("#sel-lhm", "indu"); await p.click("#btn-sel-lhm"); },
    expect: (a, b) => assert.equal(b.lhm[0], "indu"),
  },
  {
    key: "Blockanteil zuweisen", covers: ["#btn-sel-block"],
    run: async (p) => { if (!(await selectRows(p, 2))) return "übersprungen"; await p.fill("#sel-block", "35"); await p.click("#btn-sel-block"); },
    expect: (a, b) => assert.equal(b.blockShare[0], 35),
  },
  {
    key: "Datenbasis zuweisen", covers: ["#btn-sel-basis"],
    run: async (p) => { if (!(await selectRows(p, 3))) return "übersprungen"; await p.selectOption("#sel-basis", "customer"); await p.click("#btn-sel-basis"); },
    expect: (a, b) => assert.ok(b.basis.every((x) => x === "customer")),
  },
  {
    key: "Spaltenbreiten automatisch und Standard", covers: ["#btn-cols-auto", "#btn-cols-reset"],
    run: async (p) => {
      await go(p, 2); await p.click("#btn-cols-auto");
      assert.ok((await snap(p)).colw, "Breiten gespeichert");
      await p.click("#btn-cols-reset");
    },
    expect: (a, b) => assert.equal(b.colw, null),
  },

  {
    key: "Aus Excel einfügen: anhängen", covers: ["#btn-paste", "#btn-paste-append"],
    run: async (p) => {
      await go(p, 2); await p.click("#btn-paste");
      await p.fill("#paste-area", PASTE_TEXT);
      await p.click("#btn-paste-append");
    },
    expect: (a, b) => { assert.deepEqual(b.names.slice(-2), ["Excel-1", "Excel-2"]); assert.equal(b.items, a.items + 2); assert.deepEqual(b.modals, []); },
  },
  {
    key: "Aus Excel einfügen: ersetzen", covers: ["#btn-paste-replace"], confirm: true,
    run: async (p) => {
      if (!(await snap(p)).items) return "übersprungen";
      await go(p, 2); await p.click("#btn-paste");
      await p.fill("#paste-area", PASTE_TEXT);
      await p.click("#btn-paste-replace");
      if ((await snap(p)).modals.length) await p.click("#btn-paste-close");
    },
    expect: (a, b, p, ctx) => assert.deepEqual(b.names, ctx.confirm ? ["Excel-1", "Excel-2"] : a.names),
  },
  {
    key: "Einfügedialog abbrechen", covers: ["#btn-paste-close"],
    run: async (p) => { await go(p, 2); await p.click("#btn-paste"); await p.fill("#paste-area", PASTE_TEXT); await p.click("#btn-paste-close"); },
    expect: (a, b) => { assert.deepEqual(b.names, a.names); assert.deepEqual(b.modals, []); },
  },
  {
    key: "Strg+V im Mengengerüst", covers: [],
    run: async (p) => {
      await go(p, 2);
      await p.evaluate((text) => { const dt = new DataTransfer(); dt.setData("text/plain", text); document.body.dispatchEvent(new ClipboardEvent("paste", { clipboardData: dt, bubbles: true })); }, PASTE_TEXT);
      assert.deepEqual((await snap(p)).modals, ["modal-paste"], "Dialog öffnet sich");
      await p.click("#btn-paste-append");
    },
    expect: (a, b) => assert.equal(b.items, a.items + 2),
  },
  {
    key: "Positionsdetails: öffnen, blättern, ändern, schließen", covers: ["item-edit", "#btn-drawer-prev", "#btn-drawer-next", "#btn-drawer-close"],
    run: async (p) => {
      if ((await snap(p)).items < 2) return "übersprungen";
      await go(p, 2); await p.click('#itemsBody [data-edit="0"]');
      await p.click("#btn-drawer-next"); assert.equal((await snap(p)).drawer, 1);
      await p.click("#btn-drawer-prev"); assert.equal((await snap(p)).drawer, 0);
      await p.fill("#dr-name", "Detail geändert");
      await p.click("#btn-drawer-close");
    },
    expect: (a, b) => { assert.equal(b.names[0], "Detail geändert"); assert.equal(b.drawer, -1); },
  },
  {
    key: "Auswahl aufheben", covers: ["#btn-sel-clear"],
    run: async (p) => { if (!(await selectRows(p, 2))) return "übersprungen"; await p.click("#btn-sel-clear"); },
    expect: async (a, b, p) => { assert.equal(b.selected, 0); assert.equal(await p.isVisible("#selbar"), false); },
  },

  {
    key: "Vorgabe auf Standard zurücksetzen", covers: ["param-reset"],
    run: async (p) => {
      await go(p, 1); await p.click("#ptab-vol");
      await p.fill("#in-fillRack", "78"); await p.dispatchEvent("#in-fillRack", "change");
      await p.evaluate(() => recalc());
      await p.click('[data-param-reset="volume.fillRack"]');
    },
    expect: async (a, b, p) => { assert.equal(await p.inputValue("#in-fillRack"), "85"); assert.ok(b.undo > a.undo); },
  },
  {
    key: "Quelle am Feld öffnet das Annahmenregister", covers: ["param-source"],
    run: async (p) => {
      await go(p, 1); await p.click("#ptab-vol");
      await p.fill("#in-fillRack", "78"); await p.dispatchEvent("#in-fillRack", "change");
      await p.evaluate(() => recalc());
      await p.click('[data-param-source="volume.fillRack"]');
    },
    expect: async (a, b, p) => { assert.equal(b.tab, "7"); assert.equal(await p.evaluate(() => document.activeElement.closest("tr").dataset.sourcePath), "volume.fillRack"); },
  },

  {
    key: "Start: Beispielprojekt laden", covers: ["#start-example"], confirm: true,
    run: async (p) => { await go(p, 0); await p.click("#start-example"); },
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.equal(b.items, 6) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Start: Planungsdatei öffnen", covers: ["#start-open"], confirm: true,
    run: async (p) => { await go(p, 0); await chooseFile(p, "#start-open", FIXTURES.project); },
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["Datei-1", "Datei-2"]) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Start: Mengengerüst aus CSV", covers: ["#start-csv"], confirm: true,
    run: async (p) => { await go(p, 0); await chooseFile(p, "#start-csv", FIXTURES.csv); },
    expect: (a, b, p, ctx) => (ctx.confirm || !a.items) ? assert.deepEqual(b.names, ["CSV-A", "CSV-B", "CSV-C"]) : assert.deepEqual(b.names, a.names),
  },
  {
    key: "Start: aus Excel einfügen", covers: ["#start-paste"],
    run: async (p) => { await go(p, 0); await p.click("#start-paste"); await p.fill("#paste-area", PASTE_TEXT); await p.click("#btn-paste-append"); },
    expect: (a, b) => { assert.equal(b.tab, "2"); assert.equal(b.items, a.items + 2); },
  },

  /* ---------- Stammdaten ---------- */
  {
    key: "Palettentyp anlegen und löschen", covers: ["#btn-lhm-add", "lhm-del"],
    run: async (p) => {
      await go(p, 1); await p.click("#ptab-pal");
      for (const [id, v] of [["lhm-f-name", "Testpalette"], ["lhm-f-l", "1000"], ["lhm-f-b", "600"], ["lhm-f-h", "900"], ["lhm-f-g", "250"], ["lhm-f-s", "1"]]) await p.fill("#" + id, v);
      await p.click("#btn-lhm-add");
      const keys = (await snap(p)).customLhm.filter((k) => !a0.customLhm.includes(k));
      assert.equal(keys.length, 1, "Palettentyp angelegt");
      await p.click(`[data-lhm-del="${keys[0]}"]`);
    },
    before: async (p) => { a0 = await snap(p); },
    expect: (a, b) => assert.deepEqual(b.customLhm, a.customLhm),
  },
  {
    key: "Palettentyp ohne Bezeichnung", covers: [],
    run: async (p) => { await go(p, 1); await p.click("#ptab-pal"); await p.fill("#lhm-f-name", ""); await p.click("#btn-lhm-add"); },
    expect: (a, b, p, ctx) => { assert.ok(ctx.dialogs.some((d) => /Bezeichnung/.test(d.message))); assert.deepEqual(b.customLhm, a.customLhm); },
  },
  {
    key: "Palettenüberschreibung zurücksetzen", covers: ["lhm-reset"],
    run: async (p) => {
      await go(p, 1); await p.click("#ptab-pal");
      await p.fill('[data-lhm-ov="h"][data-lhm-key="euro"]', "1200");
      await p.dispatchEvent('[data-lhm-ov="h"][data-lhm-key="euro"]', "change");
      assert.match((await snap(p)).overrides, /"h":1200/);
      await p.click('[data-lhm-reset="h"][data-lhm-key="euro"]');
    },
    expect: (a, b) => assert.equal(b.overrides, "{}"),
  },
  {
    key: "LKW-Typ anlegen und löschen", covers: ["#btn-trk-add", "trk-del"],
    run: async (p) => {
      await go(p, 1); await p.click("#ptab-pal");
      for (const [id, v] of [["trk-f-name", "Testtrailer"], ["trk-f-l", "13.6"], ["trk-f-b", "2.48"], ["trk-f-h", "2.9"], ["trk-f-ay", "1"], ["trk-f-p", "24"]]) await p.fill("#" + id, v);
      await p.click("#btn-trk-add");
      const keys = (await snap(p)).customTrucks.filter((k) => !a0.customTrucks.includes(k));
      assert.equal(keys.length, 1, "LKW-Typ angelegt");
      await p.click(`[data-trk-del="${keys[0]}"]`);
    },
    before: async (p) => { a0 = await snap(p); },
    expect: (a, b) => assert.deepEqual(b.customTrucks, a.customTrucks),
  },

  /* ---------- Layout, Schnitte, Stückliste ---------- */
  {
    key: "Layout vergrößern, verkleinern, zurücksetzen", covers: ["#btn-zoom-in", "#btn-zoom-out", "#btn-zoom-reset"],
    run: async (p) => {
      await go(p, 3); await p.click("#btn-zoom-in"); await p.click("#btn-zoom-in");
      assert.ok((await snap(p)).zoom > 1.5); await p.click("#btn-zoom-out");
      assert.ok((await snap(p)).zoom > 1.2); await p.click("#btn-zoom-reset");
    },
    expect: (a, b) => assert.equal(b.zoom, 1),
  },
  {
    key: "Layout als PNG speichern", covers: ["#btn-layout-png"],
    run: async (p) => { await go(p, 3); await p.click("#btn-layout-png"); await wait(200); },
    expect: (a, b, p, ctx) => assert.ok(ctx.downloads.some((f) => /_Layout\.png$/.test(f))),
  },
  {
    key: "Stückliste als CSV exportieren", covers: ["#btn-bom-csv"],
    run: async (p) => { await go(p, 5); await p.click("#btn-bom-csv"); await wait(150); },
    expect: (a, b, p, ctx) => a.items ? assert.ok(ctx.downloads.some((f) => /_Stueckliste\.csv$/.test(f))) : assert.ok(ctx.dialogs.some((d) => /Keine Stückliste/.test(d.message))),
  },

  /* ---------- Varianten ---------- */
  ...[1, 2, 3].map((slot) => ({
    key: "Szenario speichern Slot " + slot, covers: ["scen-save"], confirm: true,
    run: async (p) => { await go(p, 6); await p.click(`[data-scen-save="${slot}"]`); },
    expect: (a, b, p, ctx) => {
      if (!a.items) assert.equal(b.scenarios[slot - 1] || false, a.scenarios[slot - 1] || false);
      else if (a.scenarios[slot - 1] && !ctx.confirm) assert.equal(b.scenarios[slot - 1], true);
      else assert.equal(b.scenarios[slot - 1], true);
    },
  })),
  {
    key: "Szenario laden (Slot-Knopf)", covers: ["scen-load"], confirm: true,
    run: async (p) => { await go(p, 6); const btn = await p.$("[data-scen-load]:not([disabled])"); if (!btn) return "übersprungen"; await btn.click(); },
  },
  {
    key: "Szenario aufrufen (Auswahlliste)", covers: ["#btn-scenario-load"], confirm: true,
    run: async (p) => {
      await go(p, 6);
      const opts = await p.$$eval("#sel-scenario-load option", (o) => o.map((x) => x.value).filter(Boolean));
      if (!opts.length) return "übersprungen";
      await p.selectOption("#sel-scenario-load", opts[0]); await p.click("#btn-scenario-load");
    },
  },
  {
    key: "Szenario leeren", covers: ["scen-clear"], confirm: true,
    run: async (p) => { await go(p, 6); const btn = await p.$("[data-scen-clear]:not([disabled])"); if (!btn) return "übersprungen"; await btn.click(); },
  },
  {
    key: "Vergleich laden und zurücksetzen", covers: ["#btn-diff-load", "#btn-diff-clear"],
    run: async (p) => {
      await go(p, 6); await chooseFile(p, "#btn-diff-load", FIXTURES.project);
      assert.equal((await snap(p)).diff, true, "Vergleich geladen");
      assert.match(await p.textContent("#diff-out"), /Datei-1|Positionen/);
      await p.click("#btn-diff-clear");
    },
    expect: (a, b) => assert.equal(b.diff, false),
  },

  /* ---------- Bewertung und Ergebnis ---------- */
  {
    key: "Sensitivitätsanalyse", covers: ["#btn-sensi"],
    run: async (p) => { await go(p, 8); await p.click("#btn-sensi"); },
    expect: (a, b) => a.items ? assert.ok(b.sensi > 5) : assert.equal(b.sensi, 0),
  },
  {
    key: "Quelle speichern", covers: ["source-save"],
    run: async (p) => {
      await go(p, 7);
      const row = '#reg-params tr[data-source-path="volume.fillRack"]';
      await p.selectOption(row + " [data-source-kind]", "customer");
      await p.check(row + " [data-source-confirmed]");
      await p.fill(row + " [data-source-reference]", "Ausschreibung S. 4");
      await p.click(row + " [data-source-save]");
    },
    expect: (a, b) => assert.ok(b.sources.includes("volume.fillRack")),
  },
  ...[["btn-print-gap", 7, /Fragekatalog/], ["btn-print-int", 9, /Interner Bericht/], ["btn-print-cust", 9, /Grobkonzeptbericht/]].map(([id, tab, title]) => ({
    key: "Druckfenster " + id, covers: ["#" + id],
    run: async (p) => { await go(p, tab); await withEvent(p, "popup", () => p.click("#" + id)); await wait(100); },
    expect: (a, b, p, ctx) => assert.ok(ctx.popups.some((t) => title.test(t)), "Druckfenster: " + ctx.popups.join(", ")),
  })),
];
let a0 = null; // Momentaufnahme für Aktionen mit before()

const FAST = ACTIONS.filter((a) => !a.slow);

/* ============================ Ausführung ============================ */
async function act(ctx, action) {
  const p = ctx.page;
  if (action.before) await action.before(p);
  const result = await action.run(p, ctx);
  await p.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));
  return result;
}
async function checkRules(ctx, where) {
  const problems = await ctx.page.evaluate(() => window.__check());
  const badDialogs = ctx.dialogs.filter((d) => /wegen eines Fehlers|undefined|NaN|TypeError|ReferenceError/.test(d.message));
  if (ctx.errors.length) problems.push("Seitenfehler: " + ctx.errors.join(" | "));
  if (badDialogs.length) problems.push("Fehlermeldung: " + badDialogs.map((d) => d.message).join(" | "));
  if (problems.length) throw new Error(where + "\n  " + problems.join("\n  "));
}
const resetCtx = async (ctx, withData, confirm = true) => {
  ctx.errors.length = 0; ctx.dialogs.length = 0; ctx.downloads.length = 0; ctx.popups.length = 0; ctx.confirm = confirm;
  await ctx.page.evaluate((d) => window.__reset(d), withData);
};
function rng(seed) { return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

async function makeFixtures(ctx) {
  const { project, input } = await ctx.page.evaluate(() => {
    const st = defaults();
    st.items = [Object.assign(newItem(), { name: "Datei-1", trucks: 2, skus: 30 }), Object.assign(newItem(), { name: "Datei-2", trucks: 1, stack: 2, skus: 8 })];
    st.meta.name = "Testplanung";
    const inp = { meta: { projekt: "Eingabetest" }, parameter: { volume: { range: 14 } },
      positionen: ["Eingabe-1", "Eingabe-2", "Eingabe-3"].map((n, i) => Object.assign(newItem(), { name: n, trucks: i + 1 })) };
    return { project: JSON.stringify(st), input: "window.TENDER_INPUT = " + JSON.stringify(inp) + ";" };
  });
  fs.writeFileSync(FIXTURES.project, project);
  fs.writeFileSync(FIXTURES.input, input);
}

const results = [];
async function part(name, fn) {
  const t0 = Date.now();
  try { const info = await fn(); results.push({ name, ok: true, info }); console.log(`ok   ${name}${info ? " – " + info : ""} (${((Date.now() - t0) / 1000).toFixed(1)} s)`); }
  catch (e) { results.push({ name, ok: false }); console.log(`FAIL ${name}\n     ${String(e.message).split("\n").join("\n     ")}`); }
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await openApp(browser);
  await makeFixtures(ctx);

  if (PARTS.has(1)) await part("Teil 1: jedes anklickbare Element steht im Katalog", async () => {
    const covered = new Set(ACTIONS.flatMap((a) => a.covers));
    const found = new Set();
    for (const withData of [false, true]) {
      await resetCtx(ctx, withData);
      // Elemente, die erst nach Aktionen erscheinen: Szenario, eigener Typ, Überschreibung, Optimierungszeile
      await ctx.page.evaluate(() => {
        saveScenario(1);
        S.customLhm = { u1: { label: "X", l: 1200, b: 800, h: 1000, g: 300, stack: 1 } };
        S.lhmOverrides = { euro: { h: 1100 } };
        S.volume.fillRack = 80; // geänderte Vorgabe: Zurücksetzen und Quelle am Feld
        S.customTrucks.t1 = { label: "Y", fl: 13, fw: 2.4, fh: 2.7, layers: 1, payload: 24000 };
        renderPalletMD(); renderTruckMD(); recalc();
        renderOptResults([{ o: "quer", bo: "N", w: 2700, n: 1, cap: 1, deck: 100, aisleA: 1, wReq: 1, area: 1, capex: 1, capexPP: 1, gx: 12, gy: 24, zones: {}, feasible: true, score: 0 }], null, "capex");
      });
      for (const n of Object.keys(TAB_NAMES)) { await go(ctx.page, n); for (const k of await ctx.page.evaluate(() => window.__clickables())) found.add(k); }
    }
    const missing = [...found].filter((k) => !covered.has(k));
    const stale = [...covered].filter((k) => !found.has(k));
    assert.deepEqual({ ohneTest: missing, ohneElement: stale }, { ohneTest: [], ohneElement: [] });
    return `${found.size} Elementarten, ${ACTIONS.length} Aktionen`;
  });

  if (PARTS.has(2)) for (const withData of [false, true]) await part(`Teil 2: jede Aktion ${withData ? "mit Daten" : "im leeren Projekt"}`, async () => {
    let done = 0, skipped = 0;
    for (const action of ACTIONS) {
      await resetCtx(ctx, withData);
      const a = await snap(ctx.page);
      try {
        if ((await act(ctx, action)) === "übersprungen") { skipped++; continue; }
        if (action.expect) await action.expect(a, await snap(ctx.page), ctx.page, ctx);
        await checkRules(ctx, action.key);
        done++;
      } catch (e) { throw new Error(`${action.key}: ${e.message}`); }
    }
    return `${done} geprüft, ${skipped} im Zustand nicht möglich`;
  });

  if (PARTS.has(3)) await part("Teil 3: Bestätigungsdialoge mit OK und Abbrechen", async () => {
    let n = 0;
    for (const action of ACTIONS.filter((x) => x.confirm)) for (const confirm of [true, false]) {
      await resetCtx(ctx, true, confirm);
      // Belegter Slot, damit Überschreiben, Laden und Leeren nachfragen
      await ctx.page.evaluate(() => { saveScenario(1); saveScenario(2); saveScenario(3); S.items[0].name = "geändert"; renderItems(); recalc(); });
      const a = await snap(ctx.page);
      try {
        if ((await act(ctx, action)) === "übersprungen") continue;
        if (action.expect) await action.expect(a, await snap(ctx.page), ctx.page, ctx);
        if (!confirm && /Szenario (laden|aufrufen)/.test(action.key)) assert.deepEqual((await snap(ctx.page)).names, a.names, "Abbrechen lässt den Stand unverändert");
        if (!confirm && /leeren/.test(action.key)) assert.deepEqual((await snap(ctx.page)).scenarios, a.scenarios);
        await checkRules(ctx, action.key);
        n++;
      } catch (e) { throw new Error(`${action.key} (${confirm ? "OK" : "Abbrechen"}): ${e.message}`); }
    }
    return `${n} Fälle`;
  });

  if (PARTS.has(4)) await part("Teil 4: Rückgängig stellt jeden Stand exakt wieder her", async () => {
    let n = 0;
    for (const withData of [false, true]) for (const action of ACTIONS) {
      await resetCtx(ctx, withData);
      await ctx.page.evaluate(() => { saveScenario(1); });
      const before = await ctx.page.evaluate(() => window.__state());
      const undoBefore = (await snap(ctx.page)).undo;
      if ((await act(ctx, action)) === "übersprungen") continue;
      const s = await snap(ctx.page);
      if (s.undo <= undoBefore || action.key === "Rückgängig") continue;
      // Mehrere Schritte (etwa Anlegen und Löschen) werden alle zurückgenommen
      for (let i = s.undo; i > undoBefore; i--) await ctx.page.click("#btn-undo");
      const after = await ctx.page.evaluate(() => window.__state());
      try { assert.equal(after, before); } catch (e) { throw new Error(`${action.key} ${withData ? "mit" : "ohne"} Daten: Stand nach Rückgängig weicht ab`); }
      await checkRules(ctx, "Rückgängig nach " + action.key);
      n++;
    }
    return `${n} Aktionen mit Rückgängig-Schritt`;
  });

  if (PARTS.has(5)) await part(`Teil 5: paarweise Kombinationen A → B${FULL ? " (vollständig)" : ` (jedes ${PAIR_STRIDE}. Paar)`}`, async () => {
    let n = 0, skipped = 0, k = 0, slow = 0;
    const failures = [];
    const list = ACTIONS;
    for (const first of list) for (const second of list) {
      k++;
      // Ohne --voll nur jedes PAIR_STRIDE. Paar; der Startwert verschiebt die Auswahl, so deckt man über Läufe alles ab
      if ((k + SEED) % PAIR_STRIDE) continue;
      // Langsame Aktionen (Optimierung) nur in jedem 4. Paar
      if ((first.slow || second.slow) && slow++ % 4) { skipped++; continue; }
      await resetCtx(ctx, k % 2 === 0);
      try {
        await act(ctx, first); await checkRules(ctx, "nach A");
        await act(ctx, second); await checkRules(ctx, "nach B");
        n++;
      } catch (e) { failures.push(`A = ${first.key}, B = ${second.key}, ${k % 2 === 0 ? "mit" : "ohne"} Daten: ${e.message.split("\n")[0]}`); }
    }
    if (failures.length) throw new Error(failures.length + " Paare fehlgeschlagen:\n" + failures.slice(0, 15).join("\n"));
    return `${n} Paare aus ${list.length} Aktionen (${skipped} Paare mit Optimierung ausgedünnt)`;
  });

  if (PARTS.has(6)) await part(`Teil 6: ${SEQUENCES} Zufallsfolgen à ${STEPS} Schritte (Startwert ${SEED})`, async () => {
    const random = rng(SEED);
    for (let seq = 0; seq < SEQUENCES; seq++) {
      const withData = random() < 0.7;
      await resetCtx(ctx, withData, random() < 0.8);
      const trail = [];
      for (let step = 0; step < STEPS; step++) {
        const pool = random() < 0.05 ? ACTIONS : FAST;
        const action = pool[Math.floor(random() * pool.length)];
        trail.push(action.key);
        ctx.confirm = random() < 0.8;
        try { await act(ctx, action); await checkRules(ctx, "Schritt " + (step + 1)); }
        catch (e) { throw new Error(`Folge ${seq + 1} (Startwert ${SEED}, ${withData ? "mit" : "ohne"} Daten):\n  ${trail.join(" → ")}\n  ${e.message}`); }
        ctx.errors.length = 0; ctx.dialogs.length = 0;
      }
    }
    return `${SEQUENCES * STEPS} Schritte`;
  });

  await ctx.context.close();
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} Teile bestanden`);
  process.exit(failed ? 1 : 0);
})();
