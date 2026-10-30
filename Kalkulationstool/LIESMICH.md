# Kalkulationstool

Eigenständiger Nachbau des Excel-Kalkulationstools Light V1.0 als eine HTML-Datei. Das Tool läuft lokal im Browser, braucht keine Installation und baut keine Serververbindung auf.

| Datei | Inhalt |
|---|---|
| `Kalkulationstool.html` | das Werkzeug: per Doppelklick im Browser öffnen |
| `beispiele/beispiel-ersatzteillager.json` | Beispielkalkulation Ersatzteillager, 5 Jahre (Datei › Kalkulation öffnen) |
| `testdaten/kalkulation-kombinationen.json` | Testkalkulation (Datei › Kalkulation öffnen) |
| `tests/kalkulationstool.test.js` | automatische Tests |

## Register

- **Projekt & Basisdaten:**
  - Projektdaten, Laufzeit aus Start und Ende (oder Laufzeit in Monaten);
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
- **Sachkosten:** Investitionen, monatliche Betriebskosten, Nachunternehmerleistung, Ramp-up; Durchreichposten mit eigenem Aufschlag.
- **Summary:** Kostenaufbau bis zum Umsatz mit Verhandlung, Wasserfalldiagramm, Kennzahlen; druckbar.
- **Auswertung:**
  - Ergebnis je Kalenderjahr bei Festpreis (optional mit Preisgleitung);
  - Cashflow mit Amortisation, Kapitalwert und interner Verzinsung;
  - Preisuntergrenze und Verhandlungsspielraum;
  - Sensitivitätsanalyse mit Tornado-Diagramm;
  - Varianten;
  - Plausibilitätsprüfungen (u. a. Mindestlohn).
- **OtO-Werte:** Kopiervorlage für das OtO-Formular; kopieren, drucken, Link zum Ablageordner.
- **Dokumentation:**
  - Kalkulationsstand mit Version und Freigabestatus;
  - „Version abschließen“ übernimmt Umsatz und EBITA-Marge in die Versionshistorie, mit Vergleich zur Vorversion;
  - automatisches Änderungsprotokoll der Kalkulationsinhalte: jede Änderung mit altem und neuem Wert, Anlass, Version, Bearbeiter, Wirkung auf den Umsatz p.a. und Kommentar; Suche, Versionsfilter, Druck, Excel-Blatt.

## Bedienung

- Alle Listen sind erweiterbar: Zeilen anlegen, duplizieren, verschieben und löschen.
- Zellbereiche aus Excel kopieren und mit Strg+V einfügen; fehlende Zeilen werden angelegt.
- Enter und die Pfeiltasten wechseln wie in Excel die Zeile; Enter in der letzten Zeile legt eine neue an.
- Datei-Menü:
  - **Kalkulation speichern:** legt eine JSON-Datei ab; der Stand bleibt außerdem im Browser des Geräts erhalten.
  - **Als Excel-Datei exportieren:** .xlsx mit dreizehn Blättern, darunter Versionen und Änderungen (Werte ohne Formeln).
  - **Gesamtbericht drucken / als PDF:** alle Register mit Diagrammen.
  - **Projektdaten aus Lagerplaner-Planungsdatei:** übernimmt Projektname, Kunde, Standort, Serviceline, SOP/EOP und weitere Kopfdaten.

## Rechenmodus

Der Schalter **Excel-kompatibel** rechnet wie die Excel-Vorlage; mit dem Beispiel („Beispielkalkulation laden“) stimmen alle Werte auf den Cent überein.

Ohne den Schalter gelten Korrekturen und Erweiterungen:

- tagesgenaue Laufzeit ohne Begrenzung auf 10 Kalenderjahre;
- Gross Profit des Angebots-TO mit HV und BU auf den Umsatz ohne Verhandlung;
- Wechselkurs wirkt auf die OtO-Werte;
- Beitragsbemessungsgrenzen je SV-Satz, vorbelegt mit den Werten für 2026 (jährlich prüfen);
- Tariferhöhung zum Stichtag, Hochlauf, Volumenwachstum und FTE je Kalenderjahr;
- Sachkostensteigerung, Kalkulationszins für Einmalkosten und Durchreichposten.

Personalbedarf, Tarifgruppen und Zuschläge je Zeile wirken in beiden Modi.

## Tests

```
node Kalkulationstool/tests/kalkulationstool.test.js
```

Die Tests benötigen das npm-Paket `playwright` mit Chromium.
