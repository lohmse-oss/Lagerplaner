# Testdaten

Drei Dateien zum Ausprobieren möglichst vieler Kombinationen. `tests/testdaten.test.js` lädt sie über die Menüs und prüft sie.

| Datei | Laden über | Inhalt |
|---|---|---|
| `testprojekt-kombinationen.json` | Datei › Planungsdatei öffnen | vollständiger Planungsstand mit drei Szenarien |
| `tender-input-kombinationen.js` | Datei › Eingabedatei laden | dieselben Positionen und Vorgaben als Eingabedatei |
| `mengengeruest-kombinationen.csv` | Datei › Mengengerüst aus CSV | 15 Positionen, alle Spalten des CSV-Imports |

## Planungsdatei und Eingabedatei

- **Positionen (16):**
  - alle vier Bedarfsarten: LKW/Tag, Paletten/Tag, Stückbasis, Ziel-Bestand;
  - alle LKW-Typen: 7,5t, Standard, Mega mit 2 Lagen, Jumbo, Giga, Sondermaß sowie die eigene Wechselbrücke;
  - Palettentypen: Euro, Industrie, Halbpalette und die eigene Gitterbox;
  - Paletten je LKW manuell überschrieben;
  - Stapelfaktoren von 1+0 bis 1+3;
  - hohe und schwere Paletten;
  - Datenbasis Kunde und Annahme;
  - eine Position ohne Artikelangabe (Datenlücke).
- **Stammdaten:**
  - Gewicht der Industriepalette überschrieben;
  - Laderaumlänge des Standard-LKW überschrieben.
- **Hauptstand – Bestandshalle 165 × 110 m:**
  - Stützenraster 15 × 30 m mit ausgeglichener Regalkollision;
  - Zonen: WE Nord, WE/WA kombiniert Ost, WA Süd;
  - Wachstum über 3 Jahre und Spitzenfaktor;
  - prozessbezogener WE-Puffer;
  - Transit mit Cross-Dock-Puffer;
  - Leergut, Einzelreihen, Miete, Rückbau;
  - Flurförderzeuge: Schubmast im Regal, Frontstapler und Hochhubwagen im Block, Mitgänger und Frontstapler in der Vorzone; Anzahl für drei Typen eingetragen, eine Bemerkung; Schichtmodell und Leasing für das FFZ-Anforderungsblatt;
  - Preisquelle Angebot;
  - dokumentierte Quellen, davon eine mit seither geändertem Wert.
- **Szenarien:**
  1. *Bestand Basis*: der Hauptstand.
  2. *Greenfield · Block manuell · Zugang West*: Seitenverhältnis 1,5 bis 2,5 mit Breitengrenze, Blockanteil je Position, Kanäle längs, Regale parallel zu den Toren, Leergut absolut.
  3. *Bestand VNA · Feldweite fest · In-Rack*: Schmalgang mit fester Feldweite 3.100 mm und In-Rack-Sprinklerung.

## CSV

- Bezeichnungen der LKW- und Palettentypen wie in der Oberfläche.
- Deutsche Zahlen: `1,5` und `1.200`.
- Stapelfaktor als `1+x` und als Gesamtzahl.
- Paletten je LKW angegeben.
- Freie Palettenmaße ohne Palettentyp.
- Name mit Semikolon in Anführungszeichen.
- Leere Zellen bis hin zu einer Zeile nur mit Bezeichnung: Hier gelten die Standardwerte.

Die Pauschale Volumenquote ist bewusst nicht enthalten. Bei 35 % landet auch nicht stapelbare Ware im Blocklager, und die Halle reicht dann für keine Regalreihe mehr. Das ist Modellverhalten und kein Fehler.
