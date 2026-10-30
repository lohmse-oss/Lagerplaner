# Kalkulationstool

Eigenständiger Nachbau des Excel-Kalkulationstools Light V1.0 als eine HTML-Datei. Das Tool läuft lokal im Browser, braucht keine Installation und baut keine Serververbindung auf.

| Datei | Inhalt |
|---|---|
| `Kalkulationstool.html` | das Werkzeug: per Doppelklick im Browser öffnen |
| `testdaten/kalkulation-kombinationen.json` | Testkalkulation (Datei › Kalkulation öffnen) |
| `tests/kalkulationstool.test.js` | automatische Tests |

## Register

- **Projekt & Basisdaten:** Projektdaten, Laufzeit aus Start und Ende (oder Laufzeit in Monaten), Zuschläge, produktive Jahresstunden, Personalnebenkosten, SV-Sätze mit Beitragsbemessungsgrenzen, Sachkostenparameter, Auswahllisten.
- **Personalkosten:** Gehälter und Löhne je Qualifikation; Stundensätze der Zuschlagskette 100 bis 700, Entwicklung je Kalenderjahr.
- **Sachkosten:** Investitionen, monatliche Betriebskosten, Nachunternehmerleistung, Ramp-up.
- **Summary:** Kostenaufbau bis zum Umsatz mit Verhandlung; druckbar.
- **OtO-Werte:** Kopiervorlage für das OtO-Formular; kopieren, drucken, Link zum Ablageordner.

## Bedienung

- Alle Listen sind erweiterbar: Zeilen anlegen, duplizieren, verschieben und löschen.
- Zellbereiche aus Excel kopieren und mit Strg+V einfügen; fehlende Zeilen werden angelegt.
- Enter und die Pfeiltasten wechseln wie in Excel die Zeile; Enter in der letzten Zeile legt eine neue an.
- Datei › Kalkulation speichern legt eine JSON-Datei ab; der Stand bleibt außerdem im Browser des Geräts erhalten.
- Datei › Projektdaten aus Lagerplaner-Planungsdatei übernimmt Projektname, Kunde, Standort, Serviceline, SOP/EOP und weitere Kopfdaten.

## Rechenmodus

Der Schalter **Excel-kompatibel** rechnet wie die Excel-Vorlage; mit dem Beispiel („Beispielkalkulation laden“) stimmen alle Werte auf den Cent überein.

Ohne den Schalter gelten Korrekturen:

- tagesgenaue Laufzeit ohne Begrenzung auf 10 Kalenderjahre;
- Gross Profit des Angebots-TO mit HV und BU auf den Umsatz ohne Verhandlung;
- Wechselkurs wirkt auf die OtO-Werte;
- Beitragsbemessungsgrenzen je SV-Satz, vorbelegt mit den Werten für 2026 (jährlich prüfen);
- optional Sachkostensteigerung p.a. und Kalkulationszins für Einmalkosten.

## Tests

```
node Kalkulationstool/tests/kalkulationstool.test.js
```

Die Tests benötigen das npm-Paket `playwright` mit Chromium.
