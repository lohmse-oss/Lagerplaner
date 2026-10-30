# Kalkulationstool

Eigenständiger Nachbau des Excel-Kalkulationstools Light V1.0 als eine HTML-Datei. Das Tool läuft lokal im Browser, braucht keine Installation und baut keine Serververbindung auf.

| Datei | Inhalt |
|---|---|
| `Kalkulationstool.html` | das Werkzeug: per Doppelklick im Browser öffnen |
| `beispiele/beispiel-ersatzteillager.json` | Beispielkalkulation Ersatzteillager, 5 Jahre (Datei › Öffnen) |
| `testdaten/kalkulation-kombinationen.json` | Testkalkulation mit möglichst vielen Kombinationen (Datei › Öffnen) |
| `tests/kalkulationstool.test.js` | automatische Tests |

## Register

- **Start:** Projektkopf, Bearbeitungsstand, Einstieg in die Register und die **Handlungs- und Verfahrensanweisung**: Zweck, Rollen, Ablauf in neun Schritten, Prüfungen vor der Freigabe, Dokumentation, Datenhaltung und besondere Fälle; druckbar.

- **Projekt & Basisdaten:**
  - Projektdaten, Laufzeit aus Start und Ende (oder Laufzeit in Monaten);
  - Kalkulationswährung mit Wechselkurs (siehe unten);
  - Zuschläge, produktive Jahresstunden;
  - Tariferhöhung zum Stichtag und je Jahr, Hochlauf und Volumenwachstum;
  - Personalnebenkosten, SV-Sätze mit Beitragsbemessungsgrenzen;
  - Sachkostenparameter;
  - Vorlagen, Auswahllisten.
- **Personalkosten:**
  - Personalbedarf aus Mengen (Menge ÷ Leistung) oder Schichtmodell, zugeordnet über den Namen der Qualifikation;
  - Gehälter und Löhne je Qualifikation mit Tarifgruppe, Zuschlag je Zeile und Quelle;
  - Zuschlagskette 100 bis 700, Entwicklung und FTE je Kalenderjahr;
  - Lohn- und Gehaltsgruppen.
- **Sachkosten:**
  - Investitionen, monatliche Betriebskosten, Nachunternehmerleistung, Ramp-up; Durchreichposten mit eigenem Aufschlag;
  - Kategorie je Zeile (Detailansicht) für die Auswertung „Sachkosten nach Kategorie“;
  - Investitionen in der Detailansicht mit Beschaffung (Kauf, Leasing, Miete), Startjahr, Nutzungsdauer und Restwert sowie der Behandlung des Restbuchwerts zum Vertragsende (siehe Rechenmodus).
- **Summary:** Kostenaufbau bis zum Umsatz mit Verhandlung, Wasserfalldiagramm, Kennzahlen, Sachkosten nach Kategorie; druckbar.
- **Auswertung:**
  - Ergebnis je Kalenderjahr bei Festpreis (optional mit Preisgleitung);
  - Cashflow mit Amortisation, Kapitalwert und interner Verzinsung;
  - Preisuntergrenze und Verhandlungsspielraum;
  - Sensitivitätsanalyse mit Tornado-Diagramm;
  - Varianten;
  - Plausibilitätsprüfungen (u. a. Mindestlohn).
- **OtO-Werte:** Kopiervorlage für das OtO-Formular, alle Werte in EUR; kopieren, drucken, Link zum Ablageordner. Die Angebotswährung ist eine Angabe für das Formular ohne Umrechnung.
- **Dokumentation:**
  - Kalkulationsstand mit Version und Freigabestatus;
  - „Version abschließen“ übernimmt Umsatz und EBITA-Marge in die Versionshistorie, mit Vergleich zur Vorversion;
  - automatisches Änderungsprotokoll der Kalkulationsinhalte: jede Änderung mit altem und neuem Wert, Anlass, Version, Bearbeiter, Wirkung auf den Umsatz p.a. und Kommentar; Suche, Versionsfilter, Druck, Excel-Blatt.

Rechts zeigt die **KPI-Leiste** vier feste und bis zu vier wählbare Kennzahlen. Sie rechnet beim Tippen mit; ein Klick springt zur markierten Herkunft im jeweiligen Register.

## Bedienung

- **Kopfzeile:** links Titel, Projekt und Dateiname (● = ungespeicherte Änderungen), rechts Rückgängig, Speichern und das Datei-Menü, die Ansicht (Standard/Detail) und die Sprache (DE/EN).
- **Ansicht Standard/Detail:** die Detailansicht zeigt zusätzliche Parameter, etwa Kategorie und Abschreibung. Hinterlegte Detailwerte wirken auch in der Standardansicht; ein Hinweis zeigt das an.
- **Hilfe:** Jedes Register beginnt mit einer Hilfe-Box (Arbeitsschritte und Tipps), einzeln zuklappbar; der Knopf „? Hilfe“ blendet alle Hilfe-Boxen aus und ein. Das ⓘ an Feldern und Überschriften erklärt das jeweilige Feld.
- **Sprache DE/EN:** übersetzt die Oberfläche, Hilfen, Verfahrensanweisung, Meldungen, Bericht und die Bezeichnungen im Excel-Export. Zahlen und Datumsangaben folgen der Sprache (1.234,56 bzw. 1,234.56), auch bei der Eingabe. Eingaben und Nutzerdaten (Namen, Kategorien, Notizen, Protokolleinträge) werden nie übersetzt.

- Jede Liste zeigt wie in Excel mindestens fünf Zeilen. Leerzeilen enthalten keine Daten. Erst die erste Eingabe, ein Häkchen oder Einfügen macht sie zur Zeile der Liste (gegebenenfalls mit den leeren Zeilen davor). Unveränderte leere Zeilen lösen keine Prüfhinweise aus.
- Alle Listen sind erweiterbar: Zeilen anlegen, duplizieren, verschieben und löschen.
- Zellbereiche aus Excel kopieren und mit Strg+V einfügen; fehlende Zeilen werden angelegt.
- Enter und die Pfeiltasten wechseln wie in Excel die Zeile, auch in die Leerzeilen; Enter in der letzten Zeile einer vollen Liste legt eine neue an.
- Datei-Menü:
  - **Öffnen (Strg+O):** lädt eine Kalkulationsdatei (JSON).
  - **Speichern (Strg+S):** schreibt in die geöffnete bzw. zuletzt gespeicherte Datei. In Chrome und Edge geschieht das direkt in die Datei; beim ersten Speichern wird der Ablageort abgefragt. Andere Browser laden die Datei unter dem bekannten Namen in den Download-Ordner.
  - **Speichern unter (Strg+Umschalt+S):** neuer Dateiname und Ablageort (ohne Dateizugriff: Abfrage des Dateinamens, dann Download).
  - Der Stand bleibt außerdem im Browser des Geräts erhalten.
  - **Als Excel-Datei exportieren:** .xlsx mit dreizehn Blättern, darunter Versionen und Änderungen (Werte ohne Formeln).
  - **Gesamtbericht drucken / als PDF:** alle Register mit Diagrammen.
  - **Projektdaten aus Lagerplaner-Planungsdatei:** übernimmt Projektname, Kunde, Standort, Serviceline, SOP/EOP und weitere Kopfdaten.

## Währungen

- **Kalkulationswährung** (Projekt & Basisdaten › Projektdaten, Kürzel nach ISO 4217, z. B. PLN, CZK, CHF): Alle Beträge der Kalkulation werden in dieser Währung erfasst und angezeigt, also Löhne, Gehälter, Tarifgruppen, Sachkosten, BBG, VK-Spanne, Summary und Auswertung. Statt „€“ steht das Kürzel, auch im Excel-Export und im Bericht.
- **Wechselkurs** „1 EUR = x“ mit Kursdatum: Damit werden die OtO-Werte in EUR umgerechnet (Umsatz, EBITA, Gross Profit, Investment, Leasing, Walkaway). Prozentwerte bleiben gleich. In der KPI-Leiste stehen die OtO-Kennzahlen in EUR, die übrigen in der Kalkulationswährung.
- Die Währung ist Teil der Vorlage, sodass eine Landesvorlage Währung, Zuschläge und Tarifgruppen gemeinsam setzt.
- Mindestlohnprüfung und vorbelegte Beitragsbemessungsgrenzen beziehen sich auf Deutschland. Bei anderer Währung entfällt die Mindestlohnprüfung (Hinweis), die BBG sind anzupassen.
- Dateien bis V2.11 hatten einen Wechselkurs der Angebotswährung im OtO. Er entfällt beim Öffnen mit Hinweis; die Kalkulation gilt dann in EUR.

## Testdatei

`testdaten/kalkulation-kombinationen.json` enthält:

- **Projektdaten:** Teilmonate zu Beginn und Ende der Laufzeit.
- **Basisdaten:**
  - geänderte Zuschläge und Arbeitszeiten, SV-Liste mit eigener Zeile und Beitragsbemessungsgrenzen;
  - Tariferhöhung zum Juli mit eigenen Sätzen für zwei Jahre;
  - Hochlauf 80 % und Volumenwachstum 3 %;
  - Sachkostensteigerung, Kalkulationszins, Aufschlag für Durchreichposten.
- **Personal:**
  - Personalbedarf aus zwei Mengenzeilen und einem Schichtmodell;
  - Tarifgruppen für Lohn und Gehalt;
  - Zuschlag je Zeile, FTE je Kalenderjahr überschrieben;
  - eine Qualifikation ohne FTE.
- **Sachkosten:** Durchreichposten bei Betriebskosten und Nachunternehmer, Ramp-up mit Gutschrift, Quellenangaben, Kategorien.
- **Auswertung:** Preisgleitung, Diskontierungszins, Mindestmarge, Variation und VK-Spanne abweichend vom Standard.
- **Währung und OtO:** Kalkulation in CHF (1 EUR = 0,94 CHF), OtO-Werte in EUR, Korrekturangebot mit Link zum Ablageordner.
- **Dokumentation:**
  - freigegebener Stand mit Prüfer und Datum;
  - Versionshistorie mit und ohne Kennzahlen;
  - Änderungsprotokoll mit Kommentaren;
  - erweiterte Liste der Freigabestatus.
- **Varianten:** 3 Fahrer je Schicht; Stapler kaufen statt leasen.

Die Beispieldatei zeigt die Abschreibungsdetails: Regalanlage mit 10 Jahren Nutzungsdauer und Übernahme durch den Kunden zum Restbuchwert, geleaste Scanner, Ersatzbeschaffung im dritten Vertragsjahr.

Dateien aus V2.3 bis V2.10 enthalten bei Investitionen oft die damaligen Vorgaben Nutzungsdauer 1 und Startjahr 1. Diese verteilten die Investition auf das erste Jahr. Beim Öffnen werden solche unveränderten Vorgaben auf 0 zurückgesetzt (über die Laufzeit), mit Hinweis.

## Rechenmodus

Der Schalter **Excel-kompatibel** rechnet wie die Excel-Vorlage; mit dem Beispiel („Beispielkalkulation laden“) stimmen alle Werte auf den Cent überein.

Ohne den Schalter gelten Korrekturen und Erweiterungen:

- tagesgenaue Laufzeit ohne Begrenzung auf 10 Kalenderjahre;
- Gross Profit des Angebots-TO mit HV und BU auf den Umsatz ohne Verhandlung;
- Wechselkurs wirkt auf die OtO-Werte;
- Beitragsbemessungsgrenzen je SV-Satz, vorbelegt mit den Werten für 2026 (jährlich prüfen);
- Tariferhöhung zum Stichtag, Hochlauf, Volumenwachstum und FTE je Kalenderjahr;
- Sachkostensteigerung, Kalkulationszins für Einmalkosten und Durchreichposten;
- Investitionen mit Abschreibung (Detailansicht):
  - Nutzungsdauer 0 verteilt die Investition wie bisher über die Laufzeit, linear oder mit Kalkulationszins als Annuität;
  - Kauf mit Nutzungsdauer: lineare Abschreibung über die Vertragsmonate ab dem Startjahr, kalkulatorische Zinsen auf den Restbuchwert;
  - Restbuchwert zum Vertragsende wahlweise „Verwertung zum Restwert“ (übriger Buchwert im letzten Vertragsjahr belastet, Restwert als Rückfluss im Cashflow) oder „Übernahme durch den Kunden“ (keine Belastung, Restbuchwert als Rückfluss, Warnung zur vertraglichen Vereinbarung);
  - Leasing und Miete: Kosten über die Nutzung verteilt, ohne Kapitalbindung und ohne Investment im OtO; läuft die Nutzung über das Vertragsende hinaus, werden die vollen Kosten in der Laufzeit angesetzt (Warnung);
  - Kauf mit späterem Startjahr: Auszahlung im Kalenderjahr des Kaufs statt zum Start.

Personalbedarf, Tarifgruppen und Zuschläge je Zeile wirken in beiden Modi.

## Tests

```
node Kalkulationstool/tests/kalkulationstool.test.js
```

Die Tests benötigen das npm-Paket `playwright` mit Chromium.
