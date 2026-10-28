// Leadec Logistics Betriebsmodell – Datendatei des Modellnavigators E09
// Erzeugt mit build_bm_daten.py 1.0 aus dem Kanon 7.5. Nicht von Hand bearbeiten.
window.BM = {
 "meta": {
  "titel": "Leadec Logistics Betriebsmodell",
  "darstellung": "E09 Modellnavigator",
  "fassung": "7.5",
  "erzeugt": "28.10.2026",
  "erzeuger": "build_bm_daten.py 1.0",
  "status": "Begleitdarstellung, nicht normativ. Bei einer Abweichung gilt das führende Dokument.",
  "quellen": [
   "A02 (A02_7.5_Modellbeschreibung.md)",
   "B01 (B01_7.5_Normierung.md)",
   "B02 (B02_7.5_Gestaltung.md)",
   "B03 (B03_7.5_Befähigung.md)",
   "B04 (B04_7.5_Führung.md)",
   "C01 (C01_7.5_Reifegradmodell.md)",
   "C03 (C03_7.5_Operations Management System.md)",
   "C04 (C04_7.5_SCORE-Modell.md)",
   "C05 (C05_7.5_Shopfloor-Management.md)",
   "C07 (C07_7.5_Änderungsmanagement.md)",
   "D02 (D02_7.5_Methodenkatalog.md)",
   "D03 (D03_7.5_Dokumentenregister.md)",
   "D05 (D05_7.5_Werkzeugkatalog.md)"
  ],
  "pcfDatei": "PCF_9.6_Process_Framework.html"
 },
 "perspektiven": [
  {
   "code": "PE",
   "n": "Performance",
   "ebenen": [
    "FU"
   ],
   "text": "SCORE bewertet die Leistung gegen das Zielsystem des Standorts."
  },
  {
   "code": "ST",
   "n": "Struktur",
   "ebenen": [
    "BE",
    "GE"
   ],
   "text": "Das Reifegradmodell bewertet die Struktur gegen die Goldenen Regeln und prüft auch die Anwendung des Führungssystems."
  },
  {
   "code": "MA",
   "n": "Maßstab",
   "ebenen": [
    "NO",
    "AU"
   ],
   "text": "Regeln für die Struktur und Zielsystem für die Performance."
  }
 ],
 "ebenen": [
  {
   "code": "AU",
   "n": "Ausrichtung",
   "bewertung": "begründet den Maßstab der Performance",
   "leitfrage": "Worauf ist der Betrieb ausgerichtet?",
   "fuehrenderOrt": "A02 Kapitel 3",
   "ordnung": "Kundennutzen, Positionierung, Strategie",
   "operationalisierung": "Anforderungsmatrix (D-KP-01, aus Gestaltung), Anforderungs- und SLA-Analyse (M-01-04) und Bewertung von Kundenänderungen (M-06-03), beide aus Befähigung",
   "nachweis": "Bid-No-Bid-Prozess, jährliches Ausrichtungsreview im Kundenmeeting (RT-1-01, aus Führung)"
  },
  {
   "code": "NO",
   "n": "Normierung",
   "bewertung": "liefert den Maßstab der Struktur",
   "leitfrage": "Nach welchen Regeln soll der Betrieb funktionieren?",
   "fuehrenderOrt": "B01, C01",
   "ordnung": "Zehn Goldene Regeln in fünf Entwicklungsfeldern",
   "operationalisierung": "Reifegradmodell nach C01 mit Stufeninhalten je Entwicklungsfeld und Prüfmatrix aus Regel und Baustein, Mindestkriterien als zweite Normquelle",
   "nachweis": "Reifegradaudit (M-00-01), Reifegradprofil, Status der Mindestkriterien"
  },
  {
   "code": "GE",
   "n": "Gestaltung",
   "bewertung": "Struktur",
   "leitfrage": "Wie soll der Betrieb gestaltet sein?",
   "fuehrenderOrt": "B02, C02, C06, C07",
   "ordnung": "Acht Bausteine, Dokumente nach Baustein",
   "operationalisierung": "Modellvorgaben: Dokumente nach D03-DOK, freigegebener Datenstand des Process Framework nach C02, verbindliche Inhalte der C-Dokumente",
   "nachweis": "Freigabestand der Modellvorgaben, standortübergreifende Auswertung offener Prüfkriterien je Baustein nach Kapitel 7.8"
  },
  {
   "code": "BE",
   "n": "Befähigung",
   "bewertung": "Struktur",
   "leitfrage": "Wodurch wird der Betrieb ausführungsfähig?",
   "fuehrenderOrt": "B03, C03",
   "ordnung": "Sechs Befähigungskomponenten, Methoden nach Regel, Betriebswerkzeuge nach Komponente",
   "operationalisierung": "Methoden nach D02-MET, Standortvorgaben und Referenzzustand, Betriebswerkzeuge nach D05-WZ, eingerichtetes OMS nach der Einrichtung des OMS (M-07-02)",
   "nachweis": "Prüfkriterien mit dem Merkmal BE, Readiness-Audit (aus Normierung, Projektphase), Kriterienfilter je Anwendungsfall"
  },
  {
   "code": "FU",
   "n": "Führung",
   "bewertung": "Performance, Anwendung des Führungssystems in der Strukturbewertung",
   "leitfrage": "Wie wird der Betrieb bewertet und gesteuert?",
   "fuehrenderOrt": "B04, C04, C05",
   "ordnung": "Fünf SCORE-Dimensionen, Kontexte SCORE III und SCORE IV, Führungskaskade mit fünf Kaskadenstufen",
   "operationalisierung": "Kennzahlen nach C04, Zielvorgaben im KPI-Steckbrief (D-QV-01, aus Gestaltung), Routinen und Boards nach C05, Erstellung eines KPI-Steckbriefs (M-07-01), Statusbewertung und Befundanalyse (M-08-03)",
   "nachweis": "Performanceseite: Performanceprofil je Kontext. Strukturseite: Prüfkriterien mit dem Merkmal FU zur Anwendung von Routinen, Statusbewertung, Eskalation und Leader Standard Work."
  }
 ],
 "bloecke": {
  "FU": [
   {
    "id": "score3",
    "n": "SCORE III",
    "text": "Shopfloor Control für Bereich und Schicht",
    "ziel": "fuehrung"
   },
   {
    "id": "score4",
    "n": "SCORE IV",
    "text": "Performance Management des Standorts",
    "ziel": "fuehrung"
   },
   {
    "id": "kaskade",
    "n": "Führungskaskade",
    "text": "Fünf Kaskadenstufen vom Management bis zum Arbeitsplatz",
    "ziel": "fuehrung"
   },
   {
    "id": "routinen",
    "n": "Routinen und Boards",
    "text": "C05 Shopfloor-Management",
    "ziel": "fuehrung"
   },
   {
    "id": "status",
    "n": "Statusbewertung und Eskalation",
    "text": "M-08-03 mit vier Status",
    "obj": "M-08-03"
   }
  ],
  "AU": [
   {
    "id": "au-ordnung",
    "n": "Kundennutzen, Positionierung, Strategie",
    "text": "Begründen Regeln und Zielsystem",
    "ziel": "ebene:AU"
   },
   {
    "id": "au-matrix",
    "n": "Anforderungsmatrix",
    "text": "Prüfbare Anforderungen des Kunden",
    "obj": "D-KP-01"
   },
   {
    "id": "au-aenderung",
    "n": "Kundenänderung",
    "text": "Klassen E1 bis E3",
    "obj": "M-06-03"
   },
   {
    "id": "au-review",
    "n": "Ausrichtungsreview",
    "text": "Jährlich im Kundenmeeting",
    "obj": "RT-1-01"
   }
  ]
 },
 "grundsaetze": [
  {
   "n": "Gemeinsamer Bezugsrahmen",
   "text": "Alle Standorte werden nach derselben Ordnungslogik beschrieben, im Audit bewertet und weiterentwickelt."
  },
  {
   "n": "Lokale Gestaltungsfreiheit",
   "text": "Lokale Lösungen sind zulässig. Sie müssen begründet, dokumentiert und fachlich freigegeben sein, und ihre Wirkung muss geprüft sein."
  },
  {
   "n": "Trennung von Referenzzustand und Ist-Zustand",
   "text": "Der Referenzzustand beschreibt den freigegebenen Sollstand eines Standorts und wird getrennt von seinem tatsächlichen Betriebszustand betrachtet."
  },
  {
   "n": "Trennung von Struktur und Performance",
   "text": "Das Reifegradmodell bewertet die Struktur des Betriebs, das Kennzahlensystem SCORE seine Leistung. Beide Bewertungen werden getrennt erhoben und ausgewiesen und nicht verrechnet, dürfen aber auf dieselben Primärdaten zugreifen."
  },
  {
   "n": "Wirkung vor Übernahme",
   "text": "Eine Verbesserung verändert den Referenzzustand erst, wenn ihre Wirkung nachgewiesen und sie fachlich freigegeben ist. Eine Kundenänderung verändert ihn erst nach Freigabe und Anlaufüberwachung."
  }
 ],
 "wirkungskette": [
  "Die Ebenen wirken als Kette aufeinander, deren Glieder B03 Befähigung in Kapitel 1 an Beispielen zeigt. Die Ausrichtung bildet den Rahmen und begründet sowohl die Regeln als auch den Maßstab der Performance. Die Normierung gibt die Regeln vor, und die Gestaltung stellt Gestaltungsmittel und Best Practice bereit. Die Befähigung macht diese Mittel mit Methoden am Standort nutzbar, indem sie daraus Standortvorgaben erzeugt und realisiert. Die Führung wendet die so entstandene Struktur an, bewertet die Leistung und steuert den Betrieb.",
  "Die Rückführung ist die Wirkungsbeziehung, die von der Führung zurück in Gestaltung und Befähigung reicht. Über sie gelangen bestätigte Verbesserungen in den Referenzzustand und werden auf andere Standorte übertragen. Die Rückführung ist keine Ebene und erhält daher weder ein eigenes Raster noch ein eigenes Dokument.",
  "Routinen, das Reifegradaudit (M-00-01) und die Modellverantwortung lösen die Rückführung aus. C07 Änderungsmanagement regelt ihr Verfahren als internen Pfad im Baustein Qualität & Verbesserung. Änderungswünsche des Kunden verändern den Referenzzustand auf einem zweiten, externen Pfad. Der Baustein Kunden & Partner nimmt sie auf und führt sie über die Bewertung von Kundenänderungen (M-06-03) zur Entscheidung, während C07 ihre Umsetzung regelt."
 ],
 "ausrichtung": [
  "Die Ausrichtung legt fest, worauf der Betrieb ausgerichtet ist, und wird vom Betriebsmodell vorausgesetzt. Ihre Komponenten Kundennutzen, Positionierung und Strategie begründen die Regeln der Normierung und den Maßstab der Performance. Die Ausrichtung führt keine eigene Objektart, sondern nutzt Objekte anderer Ebenen.",
  "Die Anforderungs- und SLA-Analyse (M-01-04) überführt Vertrag und SLA in prüfbare Einzelanforderungen der Anforderungsmatrix (D-KP-01), die zum Baustein Kunden & Partner gehört. Den Maßstab der Performance legt das Zielsystem des Standorts in Zielvorgaben fest, deren Vorlage im KPI-Steckbrief (D-QV-01) zum Baustein Qualität & Verbesserung gehört.",
  "Den Nachweis der Ausrichtung liefert zum Zeitpunkt der Angebotsentscheidung der Bid-No-Bid-Prozess. Im Serienbetrieb gleicht das Kundenmeeting (RT-1-01) einmal im Jahr Anforderungsmatrix und Zielsystem mit den aktuellen Kundenanforderungen ab. Änderungswünsche des Kunden zwischen zwei Reviews durchlaufen die Bewertung von Kundenänderungen (M-06-03). Geänderte Ziele gehen über die Erstellung eines KPI-Steckbriefs (M-07-01) als Zielvorgaben in das Zielsystem ein. Als laufender Nachweis ist künftig die Kennzahl Serviceabweichungen nach C04 SCORE-Modell, Kapitel 11, vorgesehen."
 ],
 "beispiel": [
  {
   "teil": "Regeln",
   "fundstelle": "B01 Kapitel 4 bis 8",
   "inhalt": "Je Goldene Regel ein Beispiel aus der Warenannahme"
  },
  {
   "teil": "Prozessstufen",
   "fundstelle": "C02 Kapitel 2.4",
   "inhalt": "Die Warenannahme von der Leistungsdomäne bis zum Arbeitsschritt mit Einträgen aus dem Datenstand"
  },
  {
   "teil": "Teil 1: Regelkreis",
   "fundstelle": "B04 Kapitel 2",
   "inhalt": "Die Prozessabweichungen (K3-R-01) liegen jenseits der Eingriffsschwelle, sodass das Bereichsmeeting den Status eingriffspflichtig feststellt."
  },
  {
   "teil": "Teil 2: Befundanalyse",
   "fundstelle": "B04 Kapitel 5.2",
   "inhalt": "Die Befundanalyse bestätigt den Pfad Anwendung, weil neu eingesetzte Zeitarbeitskräfte die Etikettenprüfung auslassen."
  },
  {
   "teil": "Eskalation",
   "fundstelle": "C05 Kapitel 4.1",
   "inhalt": "Falsch etikettierte Einheiten lösen Andon aus, und die Abweichung geht über Mengenauslöser und Zeitregel an die Bereichsleitung."
  },
  {
   "teil": "Teil 3: Strukturmaßnahme",
   "fundstelle": "C07 Kapitel 4.1",
   "inhalt": "Ein Scan-Prüfschritt ergänzt das Standardarbeitsblatt und gelangt über Erprobung, Freigabe und Befähigung in den Referenzzustand."
  }
 ],
 "bewertung": [
  [
   "System",
   "Reifegradmodell (C01)",
   "SCORE (C04)"
  ],
  [
   "Maßstab",
   "Goldene Regeln der Normierung",
   "Zielsystem des Standorts"
  ],
  [
   "Gegenstand",
   "Gestaltung und Befähigung, Anwendung des Führungssystems",
   "Erbrachte Leistung"
  ],
  [
   "Ergebnis",
   "Reifegradprofil je Entwicklungsfeld, Status der Mindestkriterien",
   "Performanceprofil je Kontext: SCORE III für Bereich und Schicht, SCORE IV für den Standort"
  ],
  [
   "Verwendung",
   "Mittel- bis langfristige Weiterentwicklung",
   "Laufende Bewertung und Steuerung"
  ]
 ],
 "objektarten": [
  {
   "code": "P",
   "n": "Prinzip",
   "leistung": "legt fest, nach welchen Regeln der Betrieb funktionieren soll",
   "ordnung": "Entwicklungsfeld",
   "regelebene": "Normierung",
   "ort": "B01",
   "schema": "Regel 1 bis 10",
   "beispiel": "Regel 4"
  },
  {
   "code": "D",
   "n": "Dokument",
   "leistung": "hält Modellvorgaben und Nachweise fest",
   "ordnung": "Baustein",
   "regelebene": "Gestaltung",
   "ort": "D03-DOK, Lenkung durch das IMS",
   "schema": "D-Baustein-Nummer",
   "beispiel": "D-PW-04"
  },
  {
   "code": "M",
   "n": "Methode",
   "leistung": "macht die Gestaltungsmittel am Standort nutzbar",
   "ordnung": "Goldene Regel, Merkmale Baustein und Befähigungskomponente",
   "regelebene": "Befähigung, abweichende Ebene je Methode nach D02-MET",
   "ort": "D02-MET oder das B- oder C-Dokument, dessen Logik sie bildet",
   "schema": "M-Regel-Nummer",
   "beispiel": "M-04-01"
  },
  {
   "code": "W",
   "n": "Betriebswerkzeug",
   "leistung": "erfasst, berechnet, stellt bereit oder macht sichtbar, als eingerichtetes Mittel",
   "ordnung": "Befähigungskomponente",
   "regelebene": "Befähigung",
   "ort": "D05-WZ, Zuordnung zur Komponente nach B03 Kapitel 7",
   "schema": "W-Komponente-Nummer",
   "beispiel": "W-I-01"
  },
  {
   "code": "RT",
   "n": "Routine",
   "leistung": "legt fest, wie der Betrieb regelmäßig bewertet und gesteuert wird",
   "ordnung": "Kaskadenstufe der leitenden Rolle",
   "regelebene": "Führung",
   "ort": "C05",
   "schema": "RT-Stufe-Nummer",
   "beispiel": "RT-3-01"
  },
  {
   "code": "K",
   "n": "Kennzahl",
   "leistung": "legt fest, woran die Leistung des Betriebs gemessen wird",
   "ordnung": "SCORE-Dimension",
   "regelebene": "Führung",
   "ort": "C04 mit Definitionen in den Anhängen B und C",
   "schema": "K-Kontext-Dimension-Nummer",
   "beispiel": "K4-O-01"
  }
 ],
 "abgrenzung": {
  "kopf": [
   "Merkmal",
   "Dokument",
   "Methode",
   "Betriebswerkzeug",
   "Routine"
  ],
  "zeilen": [
   [
    "Frage",
    "Was gilt, was ist festgehalten?",
    "Wie wird ein Gestaltungsmittel am Standort nutzbar?",
    "Womit wird Information erfasst, berechnet oder sichtbar gemacht?",
    "Wann und von wem wird regelmäßig gesteuert?"
   ],
   [
    "Kern",
    "Festlegung oder Nachweis",
    "Vorgehen mit festen Schritten",
    "eingerichtetes technisches oder physisches Mittel",
    "Führungstermin mit Takt, Teilnehmerkreis und Agenda"
   ],
   [
    "Auslöser",
    "Freigabe",
    "Anlass, etwa ein neuer Standort oder eine Abweichung",
    "dauerhaft verfügbar",
    "Kalender"
   ],
   [
    "Entscheidung",
    "hält sie fest",
    "bereitet sie vor",
    "trifft keine",
    "trifft sie"
   ]
  ],
  "ueberschrift": "4.1 Objektarten",
  "pfad": [
   "4 Objektmodell",
   "4.1 Objektarten"
  ]
 },
 "felder": [
  {
   "nr": 1,
   "n": "Prozesse verstehen",
   "regeln": [
    1,
    2
   ]
  },
  {
   "nr": 2,
   "n": "Prozesse optimieren",
   "regeln": [
    3,
    4
   ]
  },
  {
   "nr": 3,
   "n": "Systeme definieren",
   "regeln": [
    5,
    6
   ]
  },
  {
   "nr": 4,
   "n": "Systeme steuern",
   "regeln": [
    7,
    8
   ]
  },
  {
   "nr": 5,
   "n": "Leistung optimieren",
   "regeln": [
    9,
    10
   ]
  }
 ],
 "regeln": [
  {
   "kennung": "Regel 1",
   "nr": 1,
   "kurz": "Transparenz",
   "n": "Transparenz durch Definition von Prozessen und Schnittstellen",
   "feld": 1,
   "rolle": "Voraussetzung",
   "leitsatz": "Wir machen Abläufe, Schnittstellen, Verantwortlichkeiten und Wertströme sichtbar. So wird nachvollziehbar, wie der Betrieb tatsächlich funktioniert.",
   "anforderung": "Der Standort kennt jeden seiner Hauptprozesse und grenzt ihn in der Prozesslandkarte ab. Jeder Hauptprozess ist einer Leistungsdomäne und einer Prozessreferenz zugeordnet. Der Standort legt für jeden Hauptprozess auf Übersichtsebene Anfang, Ende, verantwortliche Rolle und Schnittstellen fest. Wertstrom und End-to-End-Prozess ergänzen die hierarchische Prozesssicht.",
   "wirkung": "Die Rollen kennen Prozesse, Grenzen und Schnittstellen ihres Bereichs.",
   "pruefendeStufen": "Stufe 1 Anwenden und Stufe 2 Beherrschen des Feldes Prozesse verstehen",
   "beobachtungsgroesse": "keine, da das Reifegradaudit die Wirkung unmittelbar nachweist",
   "beispiel": "Die Prozesslandkarte führt die Warenannahme als Hauptprozess mit der Prozessreferenz PR-IN-03. Der Prozess beginnt mit der Ankunft des Lkw am Tor und endet mit der gebuchten, zur Einlagerung bereitgestellten Ware, wobei Schnittstellen zum Spediteur und zur Einlagerung bestehen."
  },
  {
   "kennung": "Regel 2",
   "nr": 2,
   "kurz": "Standardisierung",
   "n": "Standardisierung durch einheitliche Prozessbeschreibung und -umsetzung",
   "feld": 1,
   "rolle": "Wirkung",
   "leitsatz": "Wir beschreiben Prozesse einheitlich, grenzen sie klar ab und dokumentieren sie verständlich. So führen alle Mitarbeitenden eine Tätigkeit auf dieselbe Weise aus.",
   "anforderung": "Für jeden wiederkehrenden Hauptprozess gibt es eine standortbezogene Prozessbeschreibung. Sie konkretisiert die Prozessbeschreibungsvorlage der Prozessreferenz. Jeder Prozessschritt mit Standardisierungsbedarf hat ein Standardarbeitsblatt. Die zuständige Rolle gibt Prozessbeschreibung und Standardarbeitsblatt fachlich frei. Das IMS stellt sie bereit. Die Mitarbeitenden sind auf den Standard geschult.",
   "wirkung": "Die Ausführung entspricht der Beschreibung.",
   "pruefendeStufen": "Stufe 3 Entwickeln und Stufe 4 Verankern des Feldes Prozesse verstehen",
   "beobachtungsgroesse": "Prozessstandard-Compliance (K3-E-02)",
   "beispiel": "Die Prozessbeschreibung der Warenannahme konkretisiert die Prozessreferenz PR-IN-03 für den Standort. Für den Prozessschritt Entladen und Prüfen liegt ein Standardarbeitsblatt am Arbeitsplatz aus, auf das alle Mitarbeitenden der Warenannahme geschult sind."
  },
  {
   "kennung": "Regel 3",
   "nr": 3,
   "kurz": "Stabilität",
   "n": "Stabilität durch konsequente Einhaltung der Standards",
   "feld": 2,
   "rolle": "Voraussetzung",
   "leitsatz": "Wir reduzieren Abweichungen systematisch. Wir gestalten Prozesse so, dass sie reproduzierbar und beherrschbar ablaufen.",
   "anforderung": "Die Mitarbeitenden arbeiten nach dem gültigen Referenzzustand. Die Kennzeichnung am Ort der Leistung macht Abweichungen sichtbar. Führungskräfte prüfen die Einhaltung regelmäßig vor Ort. Die Mitarbeitenden erkennen Prozessabweichungen sofort und melden sie. Der Standard bleibt gültig, bis eine Änderung freigegeben ist.",
   "wirkung": "Abweichungen vom Standard nehmen ab. Die Einhaltung ist stabil.",
   "pruefendeStufen": "Stufe 1 Anwenden und Stufe 2 Beherrschen des Feldes Prozesse optimieren",
   "beobachtungsgroesse": "Prozessabweichungen (K3-R-01)",
   "beispiel": "Die Entladestellen sind gekennzeichnet, und die Schichtleitung prüft im Layered Process Audit, ob Etiketten und Begleitpapiere nach Standard geprüft werden. Eine ausgelassene Prüfung erfasst die Routine als Prozessabweichung."
  },
  {
   "kennung": "Regel 4",
   "nr": 4,
   "kurz": "Qualität",
   "n": "Qualität durch kontinuierliche Verbesserung der Standards",
   "feld": 2,
   "rolle": "Wirkung",
   "leitsatz": "Wir verbessern Prozesse kontinuierlich, methodisch und wirksam. Jede bestätigte Verbesserung wird zum neuen Standard.",
   "anforderung": "Der Standort verfolgt jede eingriffspflichtige Kennzahlabweichung und jede wiederkehrende oder kritische Prozessabweichung bis zur Ursache. Jede Maßnahme hat eine verantwortliche Rolle und eine Frist. Die verantwortliche Rolle prüft die Wirksamkeit jeder Maßnahme. Ein verbesserter Ablauf wird fachlich freigegeben, bereitgestellt und geschult.",
   "wirkung": "Ursachen werden beseitigt. Wiederholfehler nehmen ab.",
   "pruefendeStufen": "Stufe 3 Entwickeln und Stufe 4 Verankern des Feldes Prozesse optimieren",
   "beobachtungsgroesse": "Wiederholfehlerquote (K3-E-04)",
   "beispiel": "Mengenabweichungen eines Lieferanten treten wiederholt auf, und die Problemlösung findet die Ursache in der Prüfreihenfolge. Die geänderte Reihenfolge wird erst nach bestätigter Wirkung Teil des Standardarbeitsblatts."
  },
  {
   "kennung": "Regel 5",
   "nr": 5,
   "kurz": "Synchronisation",
   "n": "Synchronisation durch Verknüpfung von Informations- und Prozessfluss",
   "feld": 3,
   "rolle": "Voraussetzung",
   "leitsatz": "Wir stimmen Informationsfluss, Prozesslogik und Ausführung aufeinander ab. Die richtige Information liegt zur richtigen Zeit an der richtigen Stelle vor.",
   "anforderung": "Jeder Prozessschritt erhält die Informationen, die er für die Ausführung benötigt. Systeme und Prozesse arbeiten mit denselben Prozesscodes. Informationen gehen ohne Medienbruch über. Jede Kaskadenstufe kennt ihre Meeting- und Berichtswege. Für jede Übergabe an externe Partner sind Ansprechperson und Übergaberegel vereinbart.",
   "wirkung": "Informationsfluss und Prozessfluss stimmen überein. Medienbrüche nehmen ab. Übergaben an Partner verlaufen nach Vereinbarung.",
   "pruefendeStufen": "Stufe 1 Anwenden und Stufe 2 Beherrschen des Feldes Systeme definieren",
   "beobachtungsgroesse": "Bestandsgenauigkeit (K4-R-03)",
   "beispiel": "Das Lieferavis liegt vor Ankunft des Lkw im System vor, und die Buchung der Palette auf den Lagerplatz erfolgt am Scanner ohne Papierliste. Die Übergaberegel mit dem Spediteur des Kunden ist über den Kunden vereinbart."
  },
  {
   "kennung": "Regel 6",
   "nr": 6,
   "kurz": "Flexibilität",
   "n": "Flexibilität durch integrierte und anpassungsfähige Systemstrukturen",
   "feld": 3,
   "rolle": "Wirkung",
   "leitsatz": "Wir gestalten Systeme anpassungsfähig und skalierbar. Der Betrieb reagiert planbar auf wechselnde Volumen und Anforderungen.",
   "anforderung": "Für Volumensprung, Volumenabfall, Personalüberhang und Personalunterdeckung sind Maßnahmen festgelegt. Linienkritische Funktionen sind mehrfach besetzbar. Der Standort stuft jede Änderung der Kundenanforderungen ein, bewertet sie und überführt sie kontrolliert in den Referenzzustand.",
   "wirkung": "Volumenschwankungen und Kundenänderungen werden ohne Strukturbruch aufgefangen.",
   "pruefendeStufen": "Stufe 3 Entwickeln und Stufe 4 Verankern des Feldes Systeme definieren",
   "beobachtungsgroesse": "Personaleinsatz zu Bedarf (K3-C-01)",
   "beispiel": "Bei einer Sonderanlieferung greift die festgelegte Maßnahme für einen Volumensprung, sodass qualifiziertes Personal aus einem anderen Bereich die Warenannahme unterstützt. Eine neue Sachnummer des Kunden durchläuft die Einstufung und geht als Änderung in die Standortvorgaben ein."
  },
  {
   "kennung": "Regel 7",
   "nr": 7,
   "kurz": "Regelbarkeit",
   "n": "Regelbarkeit durch systematische Datenerhebung und Leistungsmessung",
   "feld": 4,
   "rolle": "Voraussetzung",
   "leitsatz": "Wir definieren für den Betrieb klare Steuerungslogiken, Kennzahlen, Rückkopplungen und Eingriffsmechanismen. Der Betrieb wird auf Basis von Daten gesteuert.",
   "anforderung": "Jede Kennzahl hat eine Definition, eine Datenquelle und eine verantwortliche Rolle. Der Standort erfasst Leistungsdaten laufend und einheitlich. Für jede Kennzahl gilt am Standort eine Zielvorgabe mit Zielwert, Meldeschwelle und Eingriffsschwelle.",
   "wirkung": "Kennzahlen liegen vollständig, geprüft und zeitgerecht vor.",
   "pruefendeStufen": "Stufe 1 Anwenden und Stufe 2 Beherrschen des Feldes Systeme steuern",
   "beobachtungsgroesse": "keine, da das Reifegradaudit die Wirkung unmittelbar nachweist",
   "beispiel": "Die Prozessabweichungen der Warenannahme haben eine Definition, das Schichtprotokoll als Datenquelle und eine verantwortliche Rolle. Zielwert, Meldeschwelle und Eingriffsschwelle legt der KPI-Steckbrief fest."
  },
  {
   "kennung": "Regel 8",
   "nr": 8,
   "kurz": "Robustheit",
   "n": "Robustheit durch kennzahlbasierte Steuerung und wirksame Regelkreise",
   "feld": 4,
   "rolle": "Wirkung",
   "leitsatz": "Wir halten die Steuerung auch unter Abweichungen, Unsicherheit und Belastung wirksam. Regelkreise greifen, bevor eine Abweichung den Kunden erreicht.",
   "anforderung": "Jede eingriffspflichtige Kennzahlabweichung löst die festgelegte Reaktion aus. Die zuständige Routine bearbeitet Prozessabweichungen. Die Eskalation folgt der Führungskaskade. Der Standort bewertet Risiken und verfolgt sie. Für kritische Störungen und Systemausfälle sind Ausweichverfahren festgelegt.",
   "wirkung": "Die Rollen reagieren innerhalb der Reaktions- und Lösungsfristen. Eingriffsfälle werden beherrscht.",
   "pruefendeStufen": "Stufe 3 Entwickeln und Stufe 4 Verankern des Feldes Systeme steuern",
   "beobachtungsgroesse": "Liefertermintreue (K4-R-02)",
   "beispiel": "Überschreiten die Prozessabweichungen die Eingriffsschwelle, löst die Schichtbesprechung die festgelegte Reaktion aus. Fällt ein Scanner aus, greift das Ausweichverfahren aus dem Notfallplan mit Ersatzgerät, und das Risiko von Fehlbuchungen steht im Risikoregister."
  },
  {
   "kennung": "Regel 9",
   "nr": 9,
   "kurz": "Effizienz",
   "n": "Effizienz durch Ausrichtung auf Wertschöpfung",
   "feld": 5,
   "rolle": "Voraussetzung",
   "leitsatz": "Wir setzen Ressourcen gezielt ein und reduzieren Verschwendung. Wir richten die Leistung auf Wertschöpfung aus.",
   "anforderung": "Jeder Standort kennt den Anteil wertschöpfender Zeit an der Anwesenheit. Er erkennt nicht wertschöpfende Tätigkeiten und baut sie ab. Personaleinsatz und Leistungsbedarf stimmen überein. Prozesscodes und gültige Vorgabezeiten verbinden Prozessbeschreibung, Planung und Leistungsbewertung.",
   "wirkung": "Nicht wertschöpfende Anteile nehmen ab.",
   "pruefendeStufen": "Stufe 1 Anwenden und Stufe 2 Beherrschen des Feldes Leistung optimieren",
   "beobachtungsgroesse": "Prozesseffizienz (K4-O-02)",
   "beispiel": "Die Wertstromdarstellung zeigt Wartezeiten vor dem Entladen als nicht wertschöpfend, und eine Zeitfensterplanung mit den Spediteuren baut sie ab. Prozesscodes und Vorgabezeiten der Warenannahme bilden die Grundlage des Personalbedarfs."
  },
  {
   "kennung": "Regel 10",
   "nr": 10,
   "kurz": "Nachhaltigkeit",
   "n": "Nachhaltigkeit durch kontinuierliche Leistungs- und Qualitätssteigerung",
   "feld": 5,
   "rolle": "Wirkung",
   "leitsatz": "Wir sichern die Leistung dauerhaft und entwickeln sie systematisch weiter. Kurzfristige Spitzenwerte haben keinen Vorrang vor stabiler Leistung.",
   "anforderung": "Der Standort hält bestätigte Verbesserungen über mehrere Perioden. Verbesserungen gehen nicht zulasten von Sicherheit, Gesundheit oder Qualität. Die Mitarbeitenden bringen Verbesserungsideen aktiv ein. Der Standort prüft seinen Reifegrad regelmäßig und entwickelt ihn nach einem Entwicklungsplan weiter.",
   "wirkung": "Verbesserungen werden dauerhaft gehalten und weitergeführt.",
   "pruefendeStufen": "Stufe 3 Entwickeln und Stufe 4 Verankern des Feldes Leistung optimieren",
   "beobachtungsgroesse": "Wirksamkeitsquote (K4-E-04)",
   "beispiel": "Die verbesserte Prüfreihenfolge aus Regel 4 wird auch ein Jahr später eingehalten. Eine Idee der Mitarbeitenden zur Ergonomie beim Entladen geht über das KVP-Formular ein, und der Entwicklungsplan führt die nächsten Schritte für das Feld Prozesse optimieren."
  }
 ],
 "reihenfolge": [
  "Die Felder bauen in der Entwicklung aufeinander auf, wobei bis zur Übergabe die Stufe 1 in allen Feldern parallel entsteht. Ab Stufe 2 entwickelt ein Standort die vorangehenden Felder zuerst. Das Reifegradaudit stuft dennoch jedes Feld unabhängig ein."
 ],
 "mindestkriterien": {
  "gegenstaende": [
   "Prüfung der Arbeitsmittel",
   "Betriebsanweisungen",
   "Unterweisung",
   "Gefährdungsbeurteilung",
   "gesetzliche Kennzeichnung",
   "Abstimmung des Arbeitsschutzes mit Auftragnehmern",
   "Pflichten des Standorts",
   "modellweite Prozessanforderungen mit rechtlichem Inhalt"
  ],
  "text": [
   "Neben den Goldenen Regeln besteht mit den Mindestkriterien eine zweite Normquelle, die rechtliche und sicherheitsbezogene Anforderungen umsetzt. Mindestkriterien betreffen folgende Gegenstände:",
   "Mindestkriterien bilden keine Stufe und gelten für jedes Entwicklungsfeld. Das Reifegradaudit prüft sie bei jeder Durchführung vollständig und weist ihren Status gesondert vom Reifegradprofil aus. Ein nicht erfülltes Mindestkriterium sperrt jede Freigabe. C01 regelt die Mindestkriterien in Kapitel 4 und führt sie in Anhang A.5."
  ]
 },
 "bausteine": [
  {
   "code": "OR",
   "n": "Organisation & Rollen",
   "gegenstand": "Aufgaben, Verantwortung, Befugnisse, Personalbedarf, Qualifikation",
   "leitfrage": "Wer verantwortet, entscheidet und führt aus, und ist er dafür qualifiziert?",
   "kernkomponente": "keine",
   "befaehigung": "Rollenbezogen",
   "pruefschwerpunkt": "Regeln 1, 2, 3, 6 und 9",
   "schnittstellen": "Kunden & Partner für das Personal von Personaldienstleistern. Information & Kommunikation für die Entscheidungsgrenze in der Eskalation nach Kapitel 5. Arbeitssicherheit & Ergonomie für die Unterweisung."
  },
  {
   "code": "PW",
   "n": "Prozesse & Wertstrom",
   "gegenstand": "Operative Leistung vom Wertstrom bis zum Arbeitsschritt und ihre Sichtbarkeit am Ort der Leistung",
   "leitfrage": "Wie läuft die Leistung ab, und wie wird der Soll-Zustand am Ort der Leistung sichtbar?",
   "kernkomponente": "C02 Process Framework: eigenständiges, interaktives Werkzeug mit Datendatei, das den Prozessbestand in fünf Stufen von der Leistungsdomäne bis zum Arbeitsschritt führt. Dazu gehören Prozessreferenzen mit Prozessanforderungen, Arbeitsstandards je Prozessschritt, Schrittbibliothek, Stellenkatalog, Prozesscodes, Zeitansätze, Häufigkeiten, Buchungspunkte, Wegzeitsätze und eine Muster-FMEA. Das Werkzeug ist auch ohne das Betriebsmodell nutzbar, ist kein Dokument und unterliegt nicht der Lenkung durch das IMS. D04-PROZ ordnet den Bestand. C06 Visual Management: Bodenmarkierung, Beschilderung und visuelle Standards am Arbeitsplatz, wobei C06 die Betriebsfarben dieser Kennzeichnung von den Statusfarben der Boards nach C05 trennt.",
   "befaehigung": "Prozessbezogen, qualitätsbezogen, schnittstellenbezogen",
   "pruefschwerpunkt": "Regeln 1, 2, 3, 5 und 9. Mindestkriterien zur gesetzlichen Kennzeichnung und zu modellweiten Prozessanforderungen mit rechtlichem Inhalt.",
   "schnittstellen": "Arbeitssicherheit & Ergonomie für die gesetzliche Kennzeichnung. Information & Kommunikation für Boards und für die Verarbeitung des Mappingverzeichnisses im OMS. Qualität & Verbesserung für Prozessaudit und Sperrware. Kunden & Partner für Übergaben an Partner in der Schnittstellenmatrix."
  },
  {
   "code": "TB",
   "n": "Technologie & Betriebsmittel",
   "gegenstand": "Hardware und Infrastruktur: Flurförderzeuge, Regale, Anlagen, Erfassungsgeräte, Instandhaltung und Verfügbarkeit",
   "leitfrage": "Welche Mittel braucht der Betrieb, und sind sie verfügbar, geprüft und sicher?",
   "kernkomponente": "keine",
   "befaehigung": "Mittelbezogen, qualitätsbezogen über die Prüfmittel",
   "pruefschwerpunkt": "Regel 8. Mindestkriterium zur Prüfung der Arbeitsmittel.",
   "schnittstellen": "Information & Kommunikation für Software. Kunden & Partner für Auftragnehmer in der Instandhaltung. Risiko & Compliance für Ausweichverfahren."
  },
  {
   "code": "IK",
   "n": "Information & Kommunikation",
   "gegenstand": "Informationsflüsse, Informationssysteme und Software, Dokumentenlenkung, Kommunikationswege",
   "leitfrage": "Welche Information braucht der Betrieb, und auf welchem Weg erreicht sie die richtige Rolle?",
   "kernkomponente": "OMS als Softwarelösung, dessen Einrichtung am Standort zur Befähigung gehört. C03 beschreibt sie mit der Einrichtung des OMS (M-07-02).",
   "befaehigung": "Informationsbezogen",
   "pruefschwerpunkt": "Regeln 2, 5, 7 und 8",
   "schnittstellen": "Technologie & Betriebsmittel für Erfassungsgeräte. Prozesse & Wertstrom für das Mappingverzeichnis. Alle Bausteine über den Eskalationsstandard nach Kapitel 5."
  },
  {
   "code": "KP",
   "n": "Kunden & Partner",
   "gegenstand": "Beziehungen zu Kunden und externen Partnern: Anforderungen, Vereinbarungen, Kundenänderungen, Einbindung und Steuerung der Partner",
   "leitfrage": "Was fordert der Kunde, und wie arbeitet der Standort mit Kunde und Partnern zusammen?",
   "kernkomponente": "keine. Die Detailregeln des Bausteins stehen in den Kapiteln 4.6.1 bis 4.6.3.",
   "befaehigung": "Informationsbezogen, schnittstellenbezogen",
   "pruefschwerpunkt": "Regeln 1, 4, 5 und 6",
   "schnittstellen": "Qualität & Verbesserung für Zielsystem und Umsetzung von Kundenänderungen. Organisation & Rollen für das Personal von Personaldienstleistern. Technologie & Betriebsmittel für Auftragnehmer in der Instandhaltung. Risiko & Compliance für operative Partnernachweise. Arbeitssicherheit & Ergonomie für die Abstimmung des Arbeitsschutzes mit Auftragnehmern."
  },
  {
   "code": "AE",
   "n": "Arbeitssicherheit & Ergonomie",
   "gegenstand": "Arbeitsschutz, Gesundheitsschutz, ergonomische Arbeitsgestaltung",
   "leitfrage": "Wie arbeiten die Beschäftigten sicher und gesund?",
   "kernkomponente": "keine",
   "befaehigung": "Rollenbezogen, mittelbezogen, prozessbezogen",
   "pruefschwerpunkt": "Regeln 2, 3 und 10. Mindestkriterien zu Betriebsanweisung, Unterweisung, Gefährdungsbeurteilung und Abstimmung des Arbeitsschutzes mit Auftragnehmern.",
   "schnittstellen": "Prozesse & Wertstrom für die gesetzliche Kennzeichnung. Risiko & Compliance für den Notfallplan. Organisation & Rollen für die Unterweisung. Kunden & Partner für Auftragnehmer."
  },
  {
   "code": "RC",
   "n": "Risiko & Compliance",
   "gegenstand": "Pflichten und Risiken des Standorts: rechtliche und vertragliche Pflichten, Betriebsrisiken, Kontinuität des Betriebs",
   "leitfrage": "Darf und kann der Betrieb laufen, auch bei einer Störung?",
   "kernkomponente": "keine",
   "befaehigung": "Mittelbezogen, informationsbezogen",
   "pruefschwerpunkt": "Regel 8. Mindestkriterium zum Pflichtenregister.",
   "schnittstellen": "Qualität & Verbesserung für die Übernahme von FMEA-Risiken in das Risikoregister. Technologie & Betriebsmittel für kritische Mittel. Arbeitssicherheit & Ergonomie für die personenbezogene Notfallorganisation. Kunden & Partner für operative Partnernachweise."
  },
  {
   "code": "QV",
   "n": "Qualität & Verbesserung",
   "gegenstand": "Leistungsqualität und ihre Entwicklung: Zielsystem, Sicherung der Standards, Verbesserung, Änderung des Referenzzustands",
   "leitfrage": "Wie gut läuft der Betrieb, und wie wird er besser?",
   "kernkomponente": "C07 Änderungsmanagement: interner und externer Pfad der Änderung des Referenzzustands, Übertragung von Referenzlösungen. Der Entwicklungsplan ist ein Weg des internen Pfads, und seine Erstellung regelt C01.",
   "befaehigung": "Informationsbezogen, prozessbezogen, qualitätsbezogen",
   "pruefschwerpunkt": "Regeln 2, 3, 4, 7, 8 und 10",
   "schnittstellen": "Kunden & Partner für Anforderungen und Kundenänderungen. Risiko & Compliance für Betriebsrisiken. Prozesse & Wertstrom für Standards und Sperrflächen. Information & Kommunikation für Maßnahmenliste und Eskalation."
  }
 ],
 "bausteinZusatz": {
  "verbindlichkeit": [
   [
    "verbindlich",
    "Der Anteil muss in jeder Standortvorgabe enthalten oder erfüllt sein.",
    "Pflichtangaben füllt der Standort lokal aus. Von einer verbindlichen Anforderung weicht er nur begründet und mit Freigabe ab.",
    "Pflichtangaben, modellweite Prozessanforderungen, rechtliche Anforderungen"
   ],
   [
    "anpassbar",
    "Der Anteil ist vorbefüllt oder empfohlen.",
    "Der Standort passt ihn an seine Bedingungen an oder wählt eine Alternative.",
    "Musterablauf, Gestaltungsvorschlag"
   ],
   [
    "optional",
    "Der Anteil gilt für einen festgelegten Anwendungsfall.",
    "Der Standort übernimmt ihn nur, wenn die Bedingung zutrifft.",
    "Auswahlmodul"
   ]
  ],
  "kundenaenderung": [
   [
    "E1",
    "Anpassung im vereinbarten Leistungsumfang mit einer Kostenwirkung bis zur Grenze nach diesem Kapitel und ohne dauerhaften zusätzlichen Personalbedarf, etwa eine neue Sachnummer in einem bestehenden Ablauf",
    "Die Standortleitung entscheidet. Die Umsetzung folgt C07."
   ],
   [
    "E2",
    "Änderung von Leistungsumfang, Kapazität oder Preis innerhalb der bestehenden Leistungsdomänen",
    "Die Standortleitung legt Bewertung und Nachtrag vor. Der Kunde gibt frei. Die Vertragswirkung klären Vertrieb und Rechtsbereich. Die Umsetzung folgt C07."
   ],
   [
    "E3",
    "Neuer Leistungsumfang, etwa eine neue Leistungsdomäne oder ein neuer Hauptprozess mit eigenem Aufbau",
    "Die Änderung wird ein Projekt nach A03 mit Bid-No-Bid-Entscheidung."
   ]
  ],
  "partnerarten": [
   [
    "Personaldienstleister",
    "Arbeitnehmerüberlassung",
    "Leadec gegenüber den überlassenen Beschäftigten",
    "Die Zeitarbeitskräfte arbeiten in Rollen, Qualifikationsmatrix, Unterweisung und Routinen wie Stammpersonal. Leadec steuert den Dienstleister über Verfügbarkeit, Qualifikation und Fluktuation, und das Partnergespräch (RT-1-04) bewertet ihn."
   ],
   [
    "Auftragnehmer mit eigener Leistung",
    "Instandhaltung der Flurförderzeuge, Transport, Reinigung, IT-Betrieb",
    "Auftragnehmer gegenüber seinen Beschäftigten",
    "Leadec steuert über die vereinbarten Leistungsmerkmale und eine benannte Ansprechperson, an die allein Anweisungen gehen. Das Partnergespräch bewertet die Leistung."
   ],
   [
    "Schnittstellenpartner des Kunden",
    "Lieferanten und Spediteure des Kunden, weitere Dienstleister des Kunden",
    "ohne Vertragsbeziehung zu Leadec",
    "Übergaberegeln werden über den Kunden in der Leistungsschnittstellenvereinbarung (D-KP-04) festgelegt, und Abweichungen gehen an den Kunden."
   ]
  ]
 },
 "komponenten": [
  {
   "code": "R",
   "n": "Rollenbezogen",
   "gegenstand": "Einsatzfähigkeit der Rollen einschließlich Partnerpersonal",
   "weg": {
    "gestaltungsmittel": "Allgemeines Rollenmodell aus den Rollen der Kaskade nach B04 und dem Stellenkatalog nach C02, Vorlage Rollenprofil (D-OR-02)",
    "methode": "Rollen- und Verantwortungszuordnung nach RASIC (M-01-03), Qualifikations- und Rotationsplanung (M-06-01)",
    "realisierung": "Besetzte und qualifizierte Rolle im realen Organigramm"
   },
   "erfuellt": "Bereitschaft, Befugnis, Qualifikation, Berechtigung, Besetzung und Verfügbarkeit der Rolle sind geklärt und nachgewiesen. Dazu gehört das Personal externer Partner, das am Standort tätig ist.",
   "zufuehrend": [
    "OR",
    "AE"
   ],
   "nachweisobjekte": "Rollenprofil (D-OR-02), Qualifikationsmatrix (D-OR-04), Unterweisungsnachweis (D-AE-02), Partnerverzeichnis (D-KP-03)",
   "abgrenzung": "Das Partnerpersonal gehört zu dieser Komponente. Die Übergabe an den Partner prüft die schnittstellenbezogene Komponente."
  },
  {
   "code": "M",
   "n": "Mittelbezogen",
   "gegenstand": "Verfügbarkeit und Funktionsfähigkeit der Mittel",
   "weg": {
    "gestaltungsmittel": "Betriebsmittelübersicht (D-TB-02), Wartungs- und Prüfplan (D-TB-03)",
    "methode": "Beschaffung und Inbetriebnahme von Betriebsmitteln (M-08-05), Verfahrensanweisung Betriebsmittelmanagement (D-TB-01)",
    "realisierung": "Funktionsfähiges und geprüftes Mittel"
   },
   "erfuellt": "Bedarf, Kritikalität, Anforderungen, Freigabe, Verfügbarkeit und Funktionsfähigkeit der Mittel sind geklärt und nachgewiesen.",
   "zufuehrend": [
    "TB",
    "AE",
    "RC"
   ],
   "nachweisobjekte": "Verfahrensanweisung Betriebsmittelmanagement (D-TB-01), Betriebsmittelübersicht (D-TB-02), Wartungs- und Prüfplan (D-TB-03), Prüfprotokoll Betriebsmittel (D-TB-04), Abnahme- und Übergabeprotokoll (D-TB-06)",
   "abgrenzung": "Die Dokumente bleiben im Baustein Technologie & Betriebsmittel. Prüfmittel für kritische Merkmale tragen zusätzlich zur qualitätsbezogenen Komponente bei."
  },
  {
   "code": "I",
   "n": "Informationsbezogen",
   "gegenstand": "Bereitstellung und Qualität der Informationen und Systeme",
   "weg": {
    "gestaltungsmittel": "Systemlandkarte (D-IK-17), OMS als Softwarelösung",
    "methode": "Informationsfluss- und Schnittstellenanalyse (M-05-01), Einrichtung des OMS (M-07-02) in C03",
    "realisierung": "Angebundenes OMS, am Arbeitsplatz bereitgestellte Prozessbeschreibung"
   },
   "erfuellt": "Bedarf, Kritikalität, Spezifikation, Freigabe, Bereitstellung, Datenqualität und Nachvollziehbarkeit der Informationen und Systeme sind geklärt und nachgewiesen. Dazu gehören die Angaben zum Leistungsgegenstand: Kunden- und Produktanforderungen, Sachnummern, Gebindeformen, Forecast-Mengen und SLA-Merkmale.",
   "zufuehrend": [
    "IK",
    "KP",
    "RC",
    "QV"
   ],
   "nachweisobjekte": "Anforderungsmatrix (D-KP-01), Systemlandkarte (D-IK-17), KPI-Steckbrief (D-QV-01), eingerichtetes OMS",
   "abgrenzung": "Datenqualität, Systemlandkarte und Systemanbindung gehören zu dieser Komponente, auch wenn sie eine Übergabe betreffen."
  },
  {
   "code": "P",
   "n": "Prozessbezogen",
   "gegenstand": "Ausführbarkeit der Abläufe einschließlich Kennzeichnung",
   "weg": {
    "gestaltungsmittel": "Prozessreferenz und Arbeitsstandard im Process Framework nach C02",
    "methode": "Erstellung einer standortbezogenen Prozessbeschreibung (M-02-02), Erstellung eines Standardarbeitsblatts (M-02-01)",
    "realisierung": "Ausführbarer Ablauf mit geschultem Standard"
   },
   "erfuellt": "Die Abläufe sind nach Prozessbeschreibung, Standardarbeitsblatt, Prozesscodes und Vorgabezeiten ausführbar, und Flächen, Wege und Plätze sind nach C06 gekennzeichnet.",
   "zufuehrend": [
    "PW",
    "AE",
    "QV"
   ],
   "nachweisobjekte": "Prozessbeschreibung, Standardarbeitsblatt (D-PW-04), Flächen- und Kennzeichnungsstandard (D-PW-06), Mappingverzeichnis (D-PW-08), Standortlayout (D-PW-12)",
   "abgrenzung": "Das Layered Process Audit prüft die Einhaltung der Abläufe und gehört zu dieser Komponente. Auch die Erfassung und Bearbeitung von Gefahrmeldungen in den Routinen trägt zur Ausführbarkeit der Abläufe bei."
  },
  {
   "code": "Q",
   "n": "Qualitätsbezogen",
   "gegenstand": "Prüf- und Reaktionsfähigkeit am Ort der Leistung",
   "weg": {
    "gestaltungsmittel": "Kritische Merkmale in der Anforderungsmatrix (D-KP-01), Grenzmuster nach C06 Kapitel 8",
    "methode": "Risikobewertung nach FMEA (M-08-01), Erstellung eines Standardarbeitsblatts",
    "realisierung": "Prüfvorgabe, Prüfmittel und Grenzmuster am Ort der Leistung verfügbar"
   },
   "erfuellt": "Der Standort kann fehlerhafte Leistung am Ort der Leistung erkennen und eindämmen. Für jedes kritische Merkmal nach der Anforderungsmatrix (D-KP-01) sind Prüfvorgabe, Prüfmittel, Grenzmuster und Reaktionsregel festgelegt, freigegeben und am Ort der Leistung verfügbar.",
   "zufuehrend": [
    "PW",
    "TB",
    "QV"
   ],
   "nachweisobjekte": "Anforderungsmatrix mit kritischen Merkmalen, Prüfmittel in der Betriebsmittelübersicht (D-TB-02), Grenzmuster nach C06 Kapitel 8, Sperrware und Eindämmung (D-QV-12), Statusanhänger nach C06 Kapitel 7.1",
   "abgrenzung": "Der Baustein Qualität & Verbesserung gestaltet Prüfvorgaben und Reaktionsregeln, und die Komponente prüft ihre Verfügbarkeit am Ort der Leistung. Die Einhaltung der Abläufe prüft die prozessbezogene Komponente. Eine Prüfstation nach C07 Kapitel 4.4 ergänzt die Komponente befristet."
  },
  {
   "code": "S",
   "n": "Schnittstellenbezogen",
   "gegenstand": "Funktionsfähige Übergaben zwischen zwei Seiten",
   "weg": {
    "gestaltungsmittel": "Leistungsschnittstellenvereinbarung (D-KP-04)",
    "methode": "Prozesserfassung (M-01-01), Einbindung und Steuerung externer Partner (M-05-02)",
    "realisierung": "Übergaberegel am Tor bekannt, Ansprechpersonen beider Seiten erreichbar"
   },
   "erfuellt": "Jede Übergabe zwischen Bereichen, zum Kunden, zu Schnittstellenpartnern des Kunden und zu Auftragnehmern ist vereinbart. Für jede Übergabe nach außen liegt eine freigegebene Leistungsschnittstellenvereinbarung vor. Die Ansprechpersonen beider Seiten sind benannt und erreichbar. Übergaberegel und kritische Übergabemerkmale sind am Ort der Leistung bekannt. Der Informationsaustausch an der Übergabe funktioniert.",
   "zufuehrend": [
    "PW",
    "KP"
   ],
   "nachweisobjekte": "Schnittstellenmatrix (D-PW-01), Partnerverzeichnis (D-KP-03), Leistungsschnittstellenvereinbarung (D-KP-04)",
   "abgrenzung": "Die Komponente prüft die Übergabe zwischen zwei Seiten, während die übrigen Komponenten eine Voraussetzung selbst prüfen. Ein kritisches Übergabemerkmal ist ein kritisches Merkmal nach der Anforderungsmatrix (D-KP-01) an einer Übergabe."
  }
 ],
 "stufen": [
  {
   "nr": 1,
   "n": "Management"
  },
  {
   "nr": 2,
   "n": "Bereich"
  },
  {
   "nr": 3,
   "n": "Teilbereich"
  },
  {
   "nr": 4,
   "n": "Team"
  },
  {
   "nr": 5,
   "n": "Arbeitsplatz"
  }
 ],
 "dimensionen": [
  {
   "code": "S",
   "n": "Safety",
   "gegenstand": "Arbeitssicherheit und Gesundheit",
   "beispiele": "Unfälle, Beinaheunfälle, Gefahrmeldungen, Prävention"
  },
  {
   "code": "C",
   "n": "Costs",
   "gegenstand": "Kommerzielle Performance",
   "beispiele": "Kosten je Leistungsstunde, Personaleinsatz zu Bedarf, Fremdpersonal"
  },
  {
   "code": "O",
   "n": "Output",
   "gegenstand": "Operative Leistung",
   "beispiele": "Produktivität, Prozesseffizienz, Arbeitsfortschritt"
  },
  {
   "code": "R",
   "n": "Reliability",
   "gegenstand": "Servicequalität",
   "beispiele": "Reklamationen, Liefertermintreue, Bestandsgenauigkeit, Prozessabweichungen"
  },
  {
   "code": "E",
   "n": "Excellence",
   "gegenstand": "Wirkung der Verbesserung",
   "beispiele": "Prozessstandard-Compliance, KVP-Quote, Wirksamkeitsquote"
  }
 ],
 "kontexte": [
  [
   "Leistungsprozesse (Operations)",
   "Kalibrierphase von SCORE III",
   "SCORE III – Shopfloor Control"
  ],
  [
   "Führungsprozesse (Management)",
   "SCORE I – Project Management",
   "SCORE IV – Performance Management"
  ]
 ],
 "statusbewertung": [
  [
   "im Toleranzbereich",
   "Istwert innerhalb der Meldeschwelle",
   "keine"
  ],
  [
   "meldepflichtig",
   "Istwert jenseits der Meldeschwelle",
   "Die zuständige Routine beobachtet die Abweichung."
  ],
  [
   "nicht bewertbar",
   "Wert fehlt, ist ungeprüft oder fehlerhaft",
   "Der Wert wird weder geschätzt noch ersetzt. Die Datenqualität wird geklärt."
  ],
  [
   "eingriffspflichtig",
   "Istwert jenseits der Eingriffsschwelle",
   "Die festgelegte Reaktion wird ausgelöst. Die Befundanalyse beginnt."
  ]
 ],
 "objekte": [
  {
   "kennung": "Regel 1",
   "art": "P",
   "n": "Transparenz durch Definition von Prozessen und Schnittstellen",
   "ebene": "NO",
   "regel": 1,
   "feld": 1,
   "zweck": "Wir machen Abläufe, Schnittstellen, Verantwortlichkeiten und Wertströme sichtbar. So wird nachvollziehbar, wie der Betrieb tatsächlich funktioniert.",
   "fundstelle": "B01",
   "bezuege": []
  },
  {
   "kennung": "Regel 2",
   "art": "P",
   "n": "Standardisierung durch einheitliche Prozessbeschreibung und -umsetzung",
   "ebene": "NO",
   "regel": 2,
   "feld": 1,
   "zweck": "Wir beschreiben Prozesse einheitlich, grenzen sie klar ab und dokumentieren sie verständlich. So führen alle Mitarbeitenden eine Tätigkeit auf dieselbe Weise aus.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K3-E-02",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 3",
   "art": "P",
   "n": "Stabilität durch konsequente Einhaltung der Standards",
   "ebene": "NO",
   "regel": 3,
   "feld": 2,
   "zweck": "Wir reduzieren Abweichungen systematisch. Wir gestalten Prozesse so, dass sie reproduzierbar und beherrschbar ablaufen.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K3-R-01",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 4",
   "art": "P",
   "n": "Qualität durch kontinuierliche Verbesserung der Standards",
   "ebene": "NO",
   "regel": 4,
   "feld": 2,
   "zweck": "Wir verbessern Prozesse kontinuierlich, methodisch und wirksam. Jede bestätigte Verbesserung wird zum neuen Standard.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K3-E-04",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 5",
   "art": "P",
   "n": "Synchronisation durch Verknüpfung von Informations- und Prozessfluss",
   "ebene": "NO",
   "regel": 5,
   "feld": 3,
   "zweck": "Wir stimmen Informationsfluss, Prozesslogik und Ausführung aufeinander ab. Die richtige Information liegt zur richtigen Zeit an der richtigen Stelle vor.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K4-R-03",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 6",
   "art": "P",
   "n": "Flexibilität durch integrierte und anpassungsfähige Systemstrukturen",
   "ebene": "NO",
   "regel": 6,
   "feld": 3,
   "zweck": "Wir gestalten Systeme anpassungsfähig und skalierbar. Der Betrieb reagiert planbar auf wechselnde Volumen und Anforderungen.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K3-C-01",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 7",
   "art": "P",
   "n": "Regelbarkeit durch systematische Datenerhebung und Leistungsmessung",
   "ebene": "NO",
   "regel": 7,
   "feld": 4,
   "zweck": "Wir definieren für den Betrieb klare Steuerungslogiken, Kennzahlen, Rückkopplungen und Eingriffsmechanismen. Der Betrieb wird auf Basis von Daten gesteuert.",
   "fundstelle": "B01",
   "bezuege": []
  },
  {
   "kennung": "Regel 8",
   "art": "P",
   "n": "Robustheit durch kennzahlbasierte Steuerung und wirksame Regelkreise",
   "ebene": "NO",
   "regel": 8,
   "feld": 4,
   "zweck": "Wir halten die Steuerung auch unter Abweichungen, Unsicherheit und Belastung wirksam. Regelkreise greifen, bevor eine Abweichung den Kunden erreicht.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K4-R-02",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 9",
   "art": "P",
   "n": "Effizienz durch Ausrichtung auf Wertschöpfung",
   "ebene": "NO",
   "regel": 9,
   "feld": 5,
   "zweck": "Wir setzen Ressourcen gezielt ein und reduzieren Verschwendung. Wir richten die Leistung auf Wertschöpfung aus.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K4-O-02",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "Regel 10",
   "art": "P",
   "n": "Nachhaltigkeit durch kontinuierliche Leistungs- und Qualitätssteigerung",
   "ebene": "NO",
   "regel": 10,
   "feld": 5,
   "zweck": "Wir sichern die Leistung dauerhaft und entwickeln sie systematisch weiter. Kurzfristige Spitzenwerte haben keinen Vorrang vor stabiler Leistung.",
   "fundstelle": "B01",
   "bezuege": [
    {
     "ziel": "K4-E-04",
     "art": "Beobachtungsgröße"
    }
   ]
  },
  {
   "kennung": "M-00-01",
   "art": "M",
   "n": "Reifegradaudit mit den Prüftiefen Readiness, Checkup, Ausgangslage und Vollaudit",
   "ebene": "NO",
   "regel": 0,
   "baustein": null,
   "komponenten": [],
   "zweck": "Die erreichte Stufe je Entwicklungsfeld und den Status der Mindestkriterien unabhängig feststellen.",
   "fundstelle": "C01",
   "profil": {
    "Kaskadenstufe": "Management",
    "Auslöser": "Prüftiefe Readiness vor SOP, Checkup am Ende der Hypercare, Ausgangslage bei Einführung im bestehenden Betrieb, Vollaudit jährlich, bei wesentlicher Änderung und als Nachbewertung",
    "Ergebnis": "Reifegradprofil, Status der Mindestkriterien, Ergebnis je Prüfkriterium, Feststellung zu den Kriterienfiltern der Prüftiefe, klassifizierte Feststellungen, bei Readiness die Aussage freigabefähig, Auditbericht nach Kapitel 5.3",
    "Dokumente": "keine eigenen. Nachweisobjekte nach Prüfmatrix.",
    "Verweise": "Anhang A, Kapitel 8 und 9, Entwicklungsplanung (M-10-03), A02, A03"
   },
   "stufen": [
    1
   ],
   "bezuege": [
    {
     "ziel": "M-10-03",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-01-01",
   "art": "M",
   "n": "Prozesserfassung",
   "ebene": "BE",
   "regel": 1,
   "baustein": "PW",
   "komponenten": [
    "P"
   ],
   "zweck": "Alle Prozesse eines Standorts erfassen, abgrenzen und einer verantwortlichen Rolle zuordnen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich",
    "Auslöser": "Aufbau eines Standorts, neuer Leistungsumfang, unklare Prozessgrenzen",
    "Ergebnis": "Freigegebene Prozesslandkarte, Schnittstellenmatrix",
    "Dokumente": "D-PW-01, D-PW-07",
    "Verweise": "M-01-02, M-05-02 für Schnittstellen zu Partnern, C02, D04-PROZ"
   },
   "stufen": [
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-PW-01",
     "art": "nutzt"
    },
    {
     "ziel": "D-PW-07",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-05-02",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-01-02",
   "art": "M",
   "n": "Wertstrom- und Layoutplanung",
   "ebene": "BE",
   "regel": 1,
   "baustein": "PW",
   "komponenten": [
    "P"
   ],
   "zweck": "Material- und Informationsfluss sichtbar machen und ein Soll-Layout ableiten.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich",
    "Auslöser": "Neuer Leistungsumfang, Engpass, Flächenänderung",
    "Ergebnis": "Ist- und Soll-Wertstrom, freigegebenes Standortlayout, Maßnahmenliste",
    "Dokumente": "D-PW-02, D-PW-12",
    "Verweise": "M-01-01, D-QV-09, C06 für die Kennzeichnung des Soll-Layouts, C07 für die Pflege des Standortlayouts"
   },
   "stufen": [
    2
   ],
   "bezuege": [
    {
     "ziel": "D-PW-02",
     "art": "nutzt"
    },
    {
     "ziel": "D-PW-12",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-09",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-01-03",
   "art": "M",
   "n": "Rollen- und Verantwortungszuordnung nach RASIC",
   "ebene": "BE",
   "regel": 1,
   "baustein": "OR",
   "komponenten": [
    "R"
   ],
   "zweck": "Aufgaben, Verantwortung und Entscheidungsgrenzen je Rolle eindeutig zuordnen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Aufbau eines Standorts, Organisationsänderung, unklare Zuständigkeit",
    "Ergebnis": "Freigegebene RASIC-Matrix, Rollenprofile",
    "Dokumente": "D-OR-01, D-OR-02",
    "Verweise": "M-03-03, B04"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-OR-01",
     "art": "nutzt"
    },
    {
     "ziel": "D-OR-02",
     "art": "nutzt"
    },
    {
     "ziel": "M-03-03",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-01-04",
   "art": "M",
   "n": "Anforderungs- und SLA-Analyse",
   "ebene": "BE",
   "regel": 1,
   "baustein": "KP",
   "komponenten": [
    "I"
   ],
   "zweck": "Kundenanforderungen, Vertragsinhalte und SLA in prüfbare Einzelanforderungen überführen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Neuer Auftrag, Vertragsänderung, Änderung eines SLA, neues oder geändertes Regelwerk des Kunden, freigegebene Kundenänderung nach M-06-03, Ausrichtungsreview im Kundenmeeting",
    "Ergebnis": "Freigegebene Anforderungsmatrix mit Abgleich der Regelwerke des Kunden",
    "Dokumente": "D-KP-01",
    "Verweise": "M-06-03, M-07-01 für Zielvorgaben und Schwellen"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-KP-01",
     "art": "nutzt"
    },
    {
     "ziel": "M-06-03",
     "art": "Verweis"
    },
    {
     "ziel": "M-07-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-02-02",
   "art": "M",
   "n": "Erstellung einer standortbezogenen Prozessbeschreibung",
   "ebene": "BE",
   "regel": 2,
   "baustein": "PW",
   "komponenten": [
    "P"
   ],
   "zweck": "Die lokale Ausprägung eines Hauptprozesses aus der zugehörigen Prozessreferenz vollständig, einheitlich und prüfbar festlegen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich",
    "Auslöser": "Neuer Standort, neuer oder geänderter Leistungsumfang, neue oder geänderte Prozessreferenz, wesentliche Prozessänderung, unvollständige oder ungeeignete Prozessbeschreibung",
    "Ergebnis": "Fachlich freigegebene standortbezogene Prozessbeschreibung, dokumentierte Abweichungen, Zuordnung der erforderlichen Standardarbeitsblätter, Prozesscodes und zeitbewertbaren Tätigkeiten",
    "Dokumente": "Prozessbeschreibung auf Grundlage der Prozessbeschreibungsvorlage der Prozessreferenz, D-PW-01, D-PW-07",
    "Verweise": "M-01-01, M-01-02, M-02-01, M-09-01, D-KP-01, D-QV-09, D-QV-10, C02"
   },
   "stufen": [
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-PW-01",
     "art": "nutzt"
    },
    {
     "ziel": "D-PW-07",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-01-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-02-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-09-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-KP-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-09",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-10",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-02-01",
   "art": "M",
   "n": "Erstellung eines Standardarbeitsblatts",
   "ebene": "BE",
   "regel": 2,
   "baustein": "PW",
   "komponenten": [
    "P"
   ],
   "zweck": "Den besten bekannten Ablauf eines Arbeitszyklus festlegen und schulen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Teilbereich, Team, Arbeitsplatz",
    "Auslöser": "Neue oder geänderte freigegebene Prozessbeschreibung, neuer oder geänderter Arbeitsstandard im Process Framework, wiederholte Abweichung",
    "Ergebnis": "Freigegebenes Standardarbeitsblatt, Schulungsnachweis",
    "Dokumente": "D-PW-04",
    "Verweise": "M-02-02, M-03-01, D-IK-01, D-QV-09, C02, A03 Kapitel 7.2 für die Stände im Projekt"
   },
   "stufen": [
    3,
    4,
    5
   ],
   "bezuege": [
    {
     "ziel": "D-PW-04",
     "art": "nutzt"
    },
    {
     "ziel": "M-02-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-03-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-IK-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-09",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-03-01",
   "art": "M",
   "n": "Layered Process Audit",
   "ebene": "BE",
   "regel": 3,
   "baustein": "QV",
   "komponenten": [
    "P"
   ],
   "zweck": "Die Einhaltung der Standards durch kurze, gestaffelte Prüfungen der Kaskadenstufen sichern.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich, Teilbereich",
    "Auslöser": "Auditplan je Kaskadenstufe",
    "Ergebnis": "Auditnachweis, Kennzahl Prozessstandard-Compliance K3-E-02",
    "Dokumente": "D-QV-02, D-QV-03",
    "Verweise": "M-02-01, C05 Kapitel 6"
   },
   "stufen": [
    1,
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-QV-02",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-03",
     "art": "nutzt"
    },
    {
     "ziel": "K3-E-02",
     "art": "Ergebnis"
    },
    {
     "ziel": "M-02-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-03-02",
   "art": "M",
   "n": "5S-Arbeitsplatzorganisation",
   "ebene": "BE",
   "regel": 3,
   "baustein": "PW",
   "komponenten": [
    "P"
   ],
   "zweck": "Arbeitsplätze so ordnen, dass Abweichungen sofort sichtbar werden, und den Zustand halten.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Team, Arbeitsplatz",
    "Auslöser": "Einrichtung eines Arbeitsplatzes, Ergebnis unter Zielwert",
    "Ergebnis": "5S-Standard, Ergebnis des Rundgangs",
    "Dokumente": "D-PW-09",
    "Verweise": "C05 für den Takt des Rundgangs, C06 und D-PW-06 für die Kennzeichnung"
   },
   "stufen": [
    4,
    5
   ],
   "bezuege": [
    {
     "ziel": "D-PW-09",
     "art": "nutzt"
    },
    {
     "ziel": "D-PW-06",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-03-03",
   "art": "M",
   "n": "Voraussetzungsprüfung",
   "ebene": "BE",
   "regel": 3,
   "baustein": null,
   "komponenten": [
    "R",
    "M",
    "I",
    "P",
    "Q",
    "S"
   ],
   "zweck": "Feststellen, ob Rollen, Mittel, Informationen, Prozesse, Qualitätsvorgaben und Schnittstellen realisiert und verfügbar sind.",
   "fundstelle": "B03",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich",
    "Auslöser": "Vor Aufnahme einer Leistung in einem Bereich oder an einem Arbeitsplatz, nach einer Änderung, beim Einsatz eines neuen Partners, bei wiederholter Abweichung",
    "Ergebnis": "Befund je Komponente als Arbeitsergebnis, Aufträge zur Bereitstellung",
    "Dokumente": "Maßnahmenliste (D-IK-03) für die Aufträge zur Bereitstellung. Bei Änderungen halten Änderungsantrag (D-KP-02) und Verfahrensanweisung Änderungsmanagement (D-QV-10) die Bestätigung fest.",
    "Verweise": "Auftrag und Maßnahmensteuerung (D-IK-02), Schnittstellenmatrix (D-PW-01), Partnerverzeichnis (D-KP-03), Leistungsschnittstellenvereinbarung (D-KP-04), Einbindung und Steuerung externer Partner (M-05-02), Änderung des Referenzzustands (M-04-02) in C07, Statusbewertung und Befundanalyse (M-08-03) in B04 für die Befundanalyse, C01 für die Prüftiefe Readiness, C05 Kapitel 4 für die Eskalation"
   },
   "stufen": [
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-IK-03",
     "art": "nutzt"
    },
    {
     "ziel": "D-KP-02",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-10",
     "art": "nutzt"
    },
    {
     "ziel": "D-IK-02",
     "art": "Verweis"
    },
    {
     "ziel": "D-PW-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-KP-03",
     "art": "Verweis"
    },
    {
     "ziel": "D-KP-04",
     "art": "Verweis"
    },
    {
     "ziel": "M-05-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-04-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-03",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-04-01",
   "art": "M",
   "n": "Problemlösung in zwei Tiefen",
   "ebene": "BE",
   "regel": 4,
   "baustein": "QV",
   "komponenten": [
    "Q"
   ],
   "zweck": "Abweichungen und Reklamationen bis zur bestätigten Ursache bearbeiten und die Wirkung prüfen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich, Teilbereich, Team, Arbeitsplatz",
    "Auslöser": "Bestätigter Ursachenpfad nach M-08-03, Prozessabweichung mit Wiederholung oder Bezug zu Kunde, Sicherheit oder Recht, Kundenreklamation, Wiederholungsregel der Eskalation nach C05 Kapitel 4.1",
    "Ergebnis": "Problemlösungsbericht, Wirksamkeitsnachweis",
    "Dokumente": "D-QV-04, D-QV-07",
    "Verweise": "M-04-02, M-05-02 für Abweichungen an Partnerschnittstellen, M-08-03, D-QV-10, D-IK-02, C05, C07"
   },
   "stufen": [
    1,
    2,
    3,
    4,
    5
   ],
   "bezuege": [
    {
     "ziel": "D-QV-04",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-07",
     "art": "nutzt"
    },
    {
     "ziel": "M-04-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-05-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-03",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-10",
     "art": "Verweis"
    },
    {
     "ziel": "D-IK-02",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-04-02",
   "art": "M",
   "n": "Änderung des Referenzzustands",
   "ebene": "BE",
   "regel": 4,
   "baustein": "QV",
   "komponenten": [
    "R",
    "M",
    "I",
    "P",
    "Q",
    "S"
   ],
   "zweck": "Eine Standortvorgabe geordnet ändern und die Änderung erst nach Freigabe und Bereitstellung in den Referenzzustand übernehmen.",
   "fundstelle": "C07",
   "profil": {
    "Kaskadenstufe": "Management, Bereich. Sofortänderungen ordnet auch die Schichtleitung an.",
    "Auslöser": "Befund aus KVP, Problemlösung, Layered Process Audit, Befundanalyse oder Audit, freigegebene Kundenänderung nach der Bewertung von Kundenänderungen (M-06-03), Übernahme einer Referenzlösung, rechtliche oder vertragliche Pflicht",
    "Ergebnis": "Freigegebene und nach der Festlegung eines Referenzzustands (D-QV-09) bereitgestellte Standortvorgabe mit Wirksamkeitsnachweis oder abgeschlossener Anlaufüberwachung",
    "Dokumente": "Wirksamkeitsnachweis (D-QV-07), Festlegung eines Referenzzustands (D-QV-09), Änderungsmanagement (D-QV-10), Änderungsantrag (D-KP-02), Maßnahmenliste (D-IK-03)",
    "Verweise": "Voraussetzungsprüfung (M-03-03), Problemlösung in zwei Tiefen (M-04-01), Bewertung von Kundenänderungen (M-06-03), Beschaffung und Inbetriebnahme von Betriebsmitteln (M-08-05), Kontinuierlicher Verbesserungsprozess mit Wirkungskontrolle (M-10-01), Referenzlösung und Übertragung (M-10-02), B03 Kapitel 2, C05 Kapitel 4, C06, A03"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-QV-07",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-09",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-10",
     "art": "nutzt"
    },
    {
     "ziel": "D-KP-02",
     "art": "nutzt"
    },
    {
     "ziel": "D-IK-03",
     "art": "nutzt"
    },
    {
     "ziel": "M-03-03",
     "art": "Verweis"
    },
    {
     "ziel": "M-04-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-06-03",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-05",
     "art": "Verweis"
    },
    {
     "ziel": "M-10-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-10-02",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-05-01",
   "art": "M",
   "n": "Informationsfluss- und Schnittstellenanalyse",
   "ebene": "BE",
   "regel": 5,
   "baustein": "IK",
   "komponenten": [
    "I"
   ],
   "zweck": "Informationsfluss und Prozessfluss je Hauptprozess abgleichen. Medienbrüche, manuelle Übertragungen und fehlende Informationen erkennen und abbauen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich",
    "Auslöser": "Aufbau eines Standorts, neues oder geändertes System, neuer Hauptprozess, wiederholte Befunde im Ursachenpfad Datenqualität, Abweichungen der Bestandsgenauigkeit",
    "Ergebnis": "Freigegebene Systemlandkarte und Informationsflussmatrix je Hauptprozess, Maßnahmen zu Medienbrüchen",
    "Dokumente": "D-IK-17, D-PW-08",
    "Verweise": "M-01-01, M-02-02, M-05-02, M-07-02, M-08-03, D-IK-02, C02 Kapitel 7.3, C03"
   },
   "stufen": [
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-IK-17",
     "art": "nutzt"
    },
    {
     "ziel": "D-PW-08",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-02-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-05-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-07-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-03",
     "art": "Verweis"
    },
    {
     "ziel": "D-IK-02",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-05-02",
   "art": "M",
   "n": "Einbindung und Steuerung externer Partner",
   "ebene": "BE",
   "regel": 5,
   "baustein": "KP",
   "komponenten": [
    "S"
   ],
   "zweck": "Externe Partner nach ihrer Partnerart in Prozesse, Befähigung und Routinen einbinden und ihre Leistung steuern.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Aufbau eines Standorts, neuer oder gewechselter Partner, geänderter Leistungsumfang eines Partners, wiederholte Abweichung an einer Partnerschnittstelle, jährliche Überprüfung des Partnerverzeichnisses",
    "Ergebnis": "Freigegebenes Partnerverzeichnis, Leistungsschnittstellenvereinbarungen, Befunde zur Partnerleistung",
    "Dokumente": "D-KP-03, D-KP-04, D-IK-18",
    "Verweise": "M-01-01, M-03-03, M-04-01, M-05-01, M-06-02, D-PW-01, D-RC-04 für operative Partnernachweise, C05 für das Partnergespräch RT-1-04, B02 Kapitel 4.6.2 und 4.6.3, IMS für Auswahl, Vertrag, Lieferantenbewertung und Arbeitsschutzabstimmung"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-KP-03",
     "art": "nutzt"
    },
    {
     "ziel": "D-KP-04",
     "art": "nutzt"
    },
    {
     "ziel": "D-IK-18",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-03-03",
     "art": "Verweis"
    },
    {
     "ziel": "M-04-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-05-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-06-02",
     "art": "Verweis"
    },
    {
     "ziel": "D-PW-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-RC-04",
     "art": "Verweis"
    },
    {
     "ziel": "RT-1-04",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-06-01",
   "art": "M",
   "n": "Qualifikations- und Rotationsplanung",
   "ebene": "BE",
   "regel": 6,
   "baustein": "OR",
   "komponenten": [
    "R"
   ],
   "zweck": "Kritische Qualifikationen mehrfach besetzen und Redundanz auf linienkritischen Funktionen aufbauen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich, Team",
    "Auslöser": "Planungszyklus, Personalwechsel, Unterlastphase",
    "Ergebnis": "Qualifikationsmatrix, Schulungsplan",
    "Dokumente": "D-OR-04, D-OR-05, D-OR-07",
    "Verweise": "M-06-02, C04 für die Kennzahl K3-C-01"
   },
   "stufen": [
    2,
    3,
    4
   ],
   "bezuege": [
    {
     "ziel": "D-OR-04",
     "art": "nutzt"
    },
    {
     "ziel": "D-OR-05",
     "art": "nutzt"
    },
    {
     "ziel": "D-OR-07",
     "art": "nutzt"
    },
    {
     "ziel": "M-06-02",
     "art": "Verweis"
    },
    {
     "ziel": "K3-C-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-06-02",
   "art": "M",
   "n": "Szenariomodell für Volumen- und Personalschwankung",
   "ebene": "BE",
   "regel": 6,
   "baustein": "OR",
   "komponenten": [
    "R"
   ],
   "zweck": "Für Personalüberhang, Personalunterdeckung, Volumenabfall und Volumensprung Maßnahmen vorab festlegen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich",
    "Auslöser": "Planung, Forecast-Änderung, Eintritt eines Szenarios",
    "Ergebnis": "Maßnahmenkatalog je Szenario",
    "Dokumente": "D-OR-06",
    "Verweise": "M-05-02, M-06-03, M-09-02, C05 für die Routine"
   },
   "stufen": [
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-OR-06",
     "art": "nutzt"
    },
    {
     "ziel": "M-05-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-06-03",
     "art": "Verweis"
    },
    {
     "ziel": "M-09-02",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-06-03",
   "art": "M",
   "n": "Bewertung von Kundenänderungen",
   "ebene": "BE",
   "regel": 6,
   "baustein": "KP",
   "komponenten": [
    "I"
   ],
   "zweck": "Änderungswünsche des Kunden erfassen, einstufen, bewerten und zur Entscheidung führen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Änderungswunsch des Kunden zu Teilen, Varianten, Takt, Volumen, Layout, Systemen oder Abläufen. Ursachenpfad Planungsannahme oder Äußere Bedingung nach M-08-03 mit geänderter Kundenanforderung. Ergebnis des Ausrichtungsreviews im Kundenmeeting RT-1-01.",
    "Ergebnis": "Eingestufter und bewerteter Änderungsantrag, Entscheidung, aktualisierte Anforderungsmatrix",
    "Dokumente": "D-KP-01, D-KP-02",
    "Verweise": "M-01-04, M-04-02, M-07-01, M-08-01, M-09-02, M-03-03 in B03, B02 Kapitel 4.6.1, C07 Kapitel 4.2, A03"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-KP-01",
     "art": "nutzt"
    },
    {
     "ziel": "D-KP-02",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-04",
     "art": "Verweis"
    },
    {
     "ziel": "M-04-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-07-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-09-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-03-03",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-07-01",
   "art": "M",
   "n": "Erstellung eines KPI-Steckbriefs",
   "ebene": "FU",
   "regel": 7,
   "baustein": "QV",
   "komponenten": [
    "I"
   ],
   "zweck": "Jede steuerungsrelevante Kennzahl vollständig und prüfbar festlegen.",
   "fundstelle": "C04",
   "profil": {
    "Kaskadenstufe": "Management, Bereich. Die Definition nach Teil 1 legt die Modellverantwortung fest.",
    "Auslöser": "Neue Kennzahl, Änderung von Zielwert oder Schwelle, Kalibrierphase von SCORE III, Erstrevision nach A03, Ausrichtungsreview im Kundenmeeting (RT-1-01), freigegebene Kundenänderung nach der Bewertung von Kundenänderungen (M-06-03)",
    "Ergebnis": "Freigegebene Definition in Anhang B oder C, freigegebener KPI-Steckbrief im Zielsystem",
    "Dokumente": "KPI-Steckbrief mit Zielvorgabe (D-QV-01)",
    "Verweise": "Anforderungs- und SLA-Analyse (M-01-04) und Anforderungsmatrix (D-KP-01) für Anforderungen und Messgrößen, Bewertung von Kundenänderungen (M-06-03), Statusbewertung und Befundanalyse (M-08-03) in B04, Kapitel 6.1"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-QV-01",
     "art": "nutzt"
    },
    {
     "ziel": "M-01-04",
     "art": "Verweis"
    },
    {
     "ziel": "D-KP-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-06-03",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-03",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-07-02",
   "art": "M",
   "n": "Einrichtung des OMS",
   "ebene": "BE",
   "regel": 7,
   "baustein": "IK",
   "komponenten": [
    "I"
   ],
   "zweck": "Ein Modul des OMS an einem Standort oder Leistungsbereich einrichten, die Quellsysteme anbinden und den Anwendungsfall zur Freigabe führen.",
   "fundstelle": "C03",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Startup im Projekt, Einführung im bestehenden Betrieb, neuer Leistungsbereich, Wechsel oder Änderung eines Quellsystems",
    "Ergebnis": "Eingerichtetes Modul OMS Workforce Management oder OMS Performance Measurement, beim Modul OMS Performance Measurement freigegebenes Mappingverzeichnis, freigegebene Datenanbindung, freigegebener Anwendungsfall",
    "Dokumente": "Mappingverzeichnis (D-PW-08), Systemlandkarte (D-IK-17)",
    "Verweise": "Informationsfluss- und Schnittstellenanalyse (M-05-01), Notfall- und Wiederanlaufplanung (M-08-02), Prozess- und Zeitaufnahme (M-09-01), C01 Kapitel 8, C02 Kapitel 7, C04, D04-PROZ, A02 Kapitel 1.3, A03 Kapitel 4.2"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-PW-08",
     "art": "nutzt"
    },
    {
     "ziel": "D-IK-17",
     "art": "nutzt"
    },
    {
     "ziel": "M-05-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-09-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-08-01",
   "art": "M",
   "n": "Risikobewertung nach FMEA",
   "ebene": "BE",
   "regel": 8,
   "baustein": "QV",
   "komponenten": [
    "Q"
   ],
   "zweck": "Betriebs-, Prozess-, Vertrags-, Partner- und Standortrisiken erkennen und bewerten.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich, Teilbereich",
    "Auslöser": "Planung, Änderung, Kundenänderung nach M-06-03, jährliche Neubewertung, kritisches Ereignis",
    "Ergebnis": "Bewertete Risiken mit Maßnahmen im Risikoregister",
    "Dokumente": "D-RC-01 Risikoregister, D-QV-05 FMEA-Formblatt",
    "Verweise": "M-08-02, M-08-05, C02 Kapitel 3.2 für die Muster-FMEA, C05 für die Verfolgung des Risikoregisters, AIAG & VDA FMEA-Handbuch, 1. Ausgabe 2019"
   },
   "stufen": [
    1,
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-RC-01",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-05",
     "art": "nutzt"
    },
    {
     "ziel": "M-08-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-05",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-08-02",
   "art": "M",
   "n": "Notfall- und Wiederanlaufplanung",
   "ebene": "BE",
   "regel": 8,
   "baustein": "RC",
   "komponenten": [
    "M"
   ],
   "zweck": "Für kritische Störungen und Systemausfälle Ausweichverfahren und Wiederanlauf vorab festlegen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Aufbau eines Standorts, Ergebnis der Risikobewertung, eingetretener Notfall, Einrichtung des OMS nach M-07-02, Inbetriebnahme eines kritischen Betriebsmittels nach M-08-05",
    "Ergebnis": "Notfallplan mit Rückfallplan für Systemausfälle, Übungsprotokoll",
    "Dokumente": "D-RC-02, D-RC-03",
    "Verweise": "M-07-02, M-08-01, M-08-05, D-TB-01, C03, IMS für die personenbezogene Notfallorganisation"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-RC-02",
     "art": "nutzt"
    },
    {
     "ziel": "D-RC-03",
     "art": "nutzt"
    },
    {
     "ziel": "M-07-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-05",
     "art": "Verweis"
    },
    {
     "ziel": "D-TB-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-08-05",
   "art": "M",
   "n": "Beschaffung und Inbetriebnahme von Betriebsmitteln",
   "ebene": "BE",
   "regel": 8,
   "baustein": "TB",
   "komponenten": [
    "M"
   ],
   "zweck": "Ein Betriebsmittel so beschaffen, abnehmen und in Betrieb nehmen, dass es die Anforderungen des Betriebs erfüllt und an die Instandhaltung übergeben werden kann.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Neuer Leistungsumfang, Kundenänderung nach M-06-03 mit Bedarf an Betriebsmitteln, Ersatz oder Erweiterung eines Betriebsmittels, Strukturmaßnahme nach C07",
    "Ergebnis": "Freigegebene Anforderungsspezifikation, abgenommenes und in Betrieb genommenes Betriebsmittel, Eintrag in D-TB-02, Übergabe an die Instandhaltung",
    "Dokumente": "D-TB-05, D-TB-06, D-TB-02, D-TB-03, D-IK-03",
    "Verweise": "D-TB-01, M-05-02, M-08-01, M-08-02, M-10-02, Leistungsnachweis unter Last nach A03 Kapitel 4.5, C06, C07, D-PW-12, IMS für Vergabe und Vertrag"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-TB-05",
     "art": "nutzt"
    },
    {
     "ziel": "D-TB-06",
     "art": "nutzt"
    },
    {
     "ziel": "D-TB-02",
     "art": "nutzt"
    },
    {
     "ziel": "D-TB-03",
     "art": "nutzt"
    },
    {
     "ziel": "D-IK-03",
     "art": "nutzt"
    },
    {
     "ziel": "D-TB-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-05-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-10-02",
     "art": "Verweis"
    },
    {
     "ziel": "D-PW-12",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-08-03",
   "art": "M",
   "n": "Statusbewertung und Befundanalyse",
   "ebene": "FU",
   "regel": 8,
   "baustein": "QV",
   "komponenten": [],
   "zweck": "Istwerte bewerten und bei Handlungsbedarf den Ursachenpfad bestimmen.",
   "fundstelle": "B04",
   "profil": {
    "Kaskadenstufe": "Alle Ebenen der Kaskade, die Kennzahlen behandeln",
    "Auslöser": "Neuer Istwert in einer Routine, kritische Statusänderung",
    "Ergebnis": "Performancestatus je Kennzahl, Dimensionsstatus, Performanceprofil je Kontext, bestätigter Ursachenpfad mit Maßnahmenart"
   },
   "stufen": [
    1,
    2,
    3,
    4
   ],
   "bezuege": []
  },
  {
   "kennung": "M-08-04",
   "art": "M",
   "n": "Einrichtung der Boards",
   "ebene": "BE",
   "regel": 8,
   "baustein": "IK",
   "komponenten": [
    "I"
   ],
   "zweck": "Boards und Tafeln nach dem Boardstandard so einrichten, dass die Routinen sie nutzen können.",
   "fundstelle": "C05",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich, Team",
    "Auslöser": "Aufbau eines Standorts, Einführung oder Änderung einer Routine, Änderung des Boardstandards, Befund im Ursachenpfad Voraussetzung",
    "Ergebnis": "Eingerichtetes Board je Routine mit Pflichtbereichen und Pflichtfeldern",
    "Dokumente": "Boardstandard (D-IK-06)",
    "Verweise": "Voraussetzungsprüfung (M-03-03), B03 Kapitel 8, D05-WZ, Kapitel 5.1 bis 5.5"
   },
   "stufen": [
    2,
    3,
    4
   ],
   "bezuege": [
    {
     "ziel": "D-IK-06",
     "art": "nutzt"
    },
    {
     "ziel": "M-03-03",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-09-01",
   "art": "M",
   "n": "Prozess- und Zeitaufnahme",
   "ebene": "BE",
   "regel": 9,
   "baustein": "PW",
   "komponenten": [
    "P"
   ],
   "zweck": "Belastbare Vorgabezeiten und Häufigkeiten je Prozesscode ermitteln.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Teilbereich, Team",
    "Auslöser": "Neuer Prozess, Prozessänderung, auffällige Abweichung zwischen Plan- und Istzeit oder zwischen geplanter und beobachteter Häufigkeit, Erstrevision",
    "Ergebnis": "Freigegebene Vorgabezeit und Häufigkeit je Prozesscode mit Herleitung",
    "Dokumente": "D-PW-03",
    "Verweise": "M-09-02, C02 Kapitel 6 und 7, D04-PROZ"
   },
   "stufen": [
    3,
    4
   ],
   "bezuege": [
    {
     "ziel": "D-PW-03",
     "art": "nutzt"
    },
    {
     "ziel": "M-09-02",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-09-02",
   "art": "M",
   "n": "Personalbedarfsplanung",
   "ebene": "BE",
   "regel": 9,
   "baustein": "OR",
   "komponenten": [
    "R"
   ],
   "zweck": "Den Personalbedarf je Periode, Bereich und Qualifikation aus Mengen, Vorgabezeiten und Häufigkeiten ableiten.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Bereich, Teilbereich",
    "Auslöser": "Planungszyklus, Forecast-Änderung, Volumensprung, Bewertung einer Kundenänderung nach M-06-03",
    "Ergebnis": "Personalbedarf und Einsatzplan je Periode",
    "Dokumente": "D-OR-03",
    "Verweise": "M-09-01, M-06-02, M-06-03, W-I-01 OMS Workforce Management, C02 Kapitel 7, C03"
   },
   "stufen": [
    2,
    3
   ],
   "bezuege": [
    {
     "ziel": "D-OR-03",
     "art": "nutzt"
    },
    {
     "ziel": "M-09-01",
     "art": "Verweis"
    },
    {
     "ziel": "M-06-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-06-03",
     "art": "Verweis"
    },
    {
     "ziel": "W-I-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-10-01",
   "art": "M",
   "n": "Kontinuierlicher Verbesserungsprozess mit Wirkungskontrolle",
   "ebene": "BE",
   "regel": 10,
   "baustein": "QV",
   "komponenten": [
    "R",
    "M",
    "I",
    "P",
    "Q",
    "S"
   ],
   "zweck": "Verbesserungsideen erfassen, umsetzen und ihre Wirkung prüfen.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Teilbereich, Team, Arbeitsplatz",
    "Auslöser": "Idee aus dem Team, Ergebnis einer Problemlösung",
    "Ergebnis": "KVP-Formular mit Wirkungsnachweis",
    "Dokumente": "D-QV-06, D-QV-07",
    "Verweise": "M-04-02, D-QV-10, C07, C05 für Daily Kaizen"
   },
   "stufen": [
    3,
    4,
    5
   ],
   "bezuege": [
    {
     "ziel": "D-QV-06",
     "art": "nutzt"
    },
    {
     "ziel": "D-QV-07",
     "art": "nutzt"
    },
    {
     "ziel": "M-04-02",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-10",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-10-02",
   "art": "M",
   "n": "Referenzlösung und Übertragung",
   "ebene": "BE",
   "regel": 10,
   "baustein": "QV",
   "komponenten": [
    "R",
    "M",
    "I",
    "P",
    "Q",
    "S"
   ],
   "zweck": "Bewährte Lösungen so beschreiben, dass andere Standorte sie übernehmen können.",
   "fundstelle": "D02-MET",
   "profil": {
    "Kaskadenstufe": "Management, Bereich",
    "Auslöser": "Bestätigte Wirkung mit standortübergreifendem Nutzen, Lessons learnt aus Projekten und Beschaffungen",
    "Ergebnis": "Referenzlösung, Übertragungsnachweis",
    "Dokumente": "D-QV-08",
    "Verweise": "M-04-02, M-08-05, D-QV-09, D-QV-10, C07"
   },
   "stufen": [
    1,
    2
   ],
   "bezuege": [
    {
     "ziel": "D-QV-08",
     "art": "nutzt"
    },
    {
     "ziel": "M-04-02",
     "art": "Verweis"
    },
    {
     "ziel": "M-08-05",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-09",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-10",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "M-10-03",
   "art": "M",
   "n": "Entwicklungsplanung",
   "ebene": "BE",
   "regel": 10,
   "baustein": "QV",
   "komponenten": [
    "R",
    "M",
    "I",
    "P",
    "Q",
    "S"
   ],
   "zweck": "Aus Reifegradprofil und angestrebter Stufe die Entwicklungsschritte ableiten.",
   "fundstelle": "C01",
   "profil": {
    "Kaskadenstufe": "Management",
    "Auslöser": "Ergebnis eines Reifegradaudits oder einer Selbstbewertung, Änderung der angestrebten Stufe, Einführung im bestehenden Betrieb, Restpunkte aus der Projektphase nach A03",
    "Ergebnis": "Entwicklungsplan",
    "Dokumente": "Entwicklungsplan",
    "Verweise": "Kapitel 5 und 6, C07, A03, Kontinuierlicher Verbesserungsprozess mit Wirkungskontrolle (M-10-01), Verfahrensanweisung Änderungsmanagement (D-QV-10)"
   },
   "stufen": [
    1
   ],
   "bezuege": [
    {
     "ziel": "M-10-01",
     "art": "Verweis"
    },
    {
     "ziel": "D-QV-10",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "D-OR-01",
   "art": "D",
   "n": "RASIC-Matrix",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    1
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-03",
    "Regel": "1",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-01-03.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-01-03",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-OR-02",
   "art": "D",
   "n": "Rollenprofil",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    1
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-03",
    "Regel": "1",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-01-03.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-01-03",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-OR-03",
   "art": "D",
   "n": "Personalbedarf und Einsatzplan",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    9
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-09-02",
    "Regel": "9",
    "Pflege": "Administration",
    "Freigabe": "Bereichsleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-09-02.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-09-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-OR-04",
   "art": "D",
   "n": "Qualifikationsmatrix",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    2,
    6
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-06-01",
    "Regel": "2, 6",
    "Pflege": "Schichtleitung",
    "Freigabe": "Bereichsleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-06-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-06-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-OR-05",
   "art": "D",
   "n": "Einarbeitung",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Checkliste",
   "regeln": [],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "HR-Prozess",
    "Regel": "–",
    "Pflege": "Teamleitung",
    "Freigabe": "nach HR-Prozess",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach HR-Prozess.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-OR-06",
   "art": "D",
   "n": "Maßnahmenkatalog je Szenario",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    6
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-06-02",
    "Regel": "6",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-06-02.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-06-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-OR-07",
   "art": "D",
   "n": "Schulungsplan",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    6
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-06-01",
    "Regel": "6",
    "Pflege": "Schichtleitung",
    "Freigabe": "Bereichsleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-06-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-06-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-OR-08",
   "art": "D",
   "n": "Leader Standard Work mit Zeitansatz je Pflichtaufgabe, Gemba-Leitfragen und Coachingfragen",
   "ebene": "GE",
   "baustein": "OR",
   "typ": "Vorlage",
   "regeln": [
    3
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C05",
    "Regel": "3",
    "Pflege": "jede Führungskraft",
    "Freigabe": "nächsthöhere Rolle der Kaskade",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Pflichtaufgaben mit Zeitansatz, Gemba-Leitfragen und Coachingfragen. Prüfung durch die nächsthöhere Rolle.",
    "Grundlage der Anteile": "C05 Kapitel 7"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-PW-01",
   "art": "D",
   "n": "Prozesssteckbrief und Schnittstellenmatrix einschließlich Übergaben an Partner",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Vorlage",
   "regeln": [
    1,
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-01",
    "Regel": "1, 5",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-01-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-01-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-02",
   "art": "D",
   "n": "Wertstromdarstellung",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Vorlage",
   "regeln": [
    9
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-02",
    "Regel": "9",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-01-02.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-01-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-03",
   "art": "D",
   "n": "Zeitaufnahmebogen mit Herleitung der Zeit in Sekunden je Ausführung und der Häufigkeit je Leistungseinheit",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Vorlage",
   "regeln": [
    9
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-09-01",
    "Regel": "9",
    "Pflege": "Prozessplanung",
    "Freigabe": "Bereichsleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-09-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-09-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-04",
   "art": "D",
   "n": "Standardarbeitsblatt je Prozessschritt",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Anweisung",
   "regeln": [
    2,
    3,
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-02-01, Arbeitsstandard nach C02",
    "Regel": "2, 3, 5",
    "Pflege": "Teamleitung",
    "Freigabe": "Schichtleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Verbindliche Anteile des Arbeitsstandards, Prozesscodes und Zeitanteile, Markierung der kritischen Übergabemerkmale, Ausweis wertschöpfender und nicht wertschöpfender Anteile.",
    "Grundlage der Anteile": "C02 Kapitel 5, M-02-01"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-02-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-06",
   "art": "D",
   "n": "Flächen- und Kennzeichnungsstandard mit Vorlage Farbplan",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Anweisung",
   "regeln": [
    3
   ],
   "mindestkriterium": true,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C06",
    "Regel": "3, Mindestkriterium",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Standardfarbplan mit Abweichungen nur nach einem Regelwerk des Kunden. Farbplan mit Element, Material und Farbton je Fläche und Träger je Schildart. Der Farbplan führt die Kennzeichnungen nach C06 Kapitel 4 einschließlich der gesetzlichen Kennzeichnung der Verkehrswege, Flucht- und Rettungswege. Die Vorlage Farbplan hat einen Abschnitt Verkehrswege und Gefahrstellen mit Fahrwegbegrenzung, Gefahrstellen, Durchfahrtshöhe, Anfahrschutz und Fahrbereichen fahrerloser Transportfahrzeuge. Beschilderungsstandard.",
    "Grundlage der Anteile": "C06 Kapitel 4 bis 6, 7.2-54, KR-03-PW-E-01"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-PW-07",
   "art": "D",
   "n": "Prozesslandkarte",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Vorlage",
   "regeln": [
    1
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-01",
    "Regel": "1",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-01-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-01-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-08",
   "art": "D",
   "n": "Mappingverzeichnis: Zuordnung der Buchungscodes der Quellsysteme zu Buchungspunkten nach C02 mit Umrechnungsfaktoren, beim Anwendungsfall OMS Performance Measurement",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Vorlage",
   "regeln": [
    5,
    7,
    9
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C03, M-07-02",
    "Regel": "5, 7, 9",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Beim Anwendungsfall OMS Performance Measurement Zuordnung jedes Buchungscodes zu genau einem Buchungspunkt. Der Standort befüllt das Mappingverzeichnis bei der Einrichtung des OMS nach M-07-02. Umrechnungsfaktoren zwischen Leistungseinheiten aus dem Mengengerüst nach A03 Kapitel 4.2 als freigegebene Standortvorgabe. Regeln des Mappings.",
    "Grundlage der Anteile": "C02 Kapitel 7.3, C03 Kapitel 4.1, KR-05-IK-E-03, 7.1-75"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-07-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-09",
   "art": "D",
   "n": "5S",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Checkliste",
   "regeln": [
    3
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-03-02",
    "Regel": "3",
    "Pflege": "Teamleitung",
    "Freigabe": "Bereichsleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Prüfpunkte nach M-03-02. Erkennbarkeit der Markierungen, Freihalteflächen und Min-Max-Markierungen.",
    "Grundlage der Anteile": "M-03-02, C06 Kapitel 5.4 und 7.2, 7.2-54"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-03-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-PW-10",
   "art": "D",
   "n": "Permanente Inventur und Bestandsklärung mit den Bestandsstatus frei, gesperrt und frei mit Auflagen",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Verfahrensanweisung",
   "regeln": [
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "standortspezifisch",
    "Regel": "5",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach der Verfahrensanweisung des Standorts.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-PW-11",
   "art": "D",
   "n": "Leergut- und Verpackungsmanagement",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Verfahrensanweisung",
   "regeln": [
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "B02 Anhang A.3",
    "Regel": "5",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "Entwurf",
    "Verbindliche Anteile": "Mindestinhalt nach B02 Anhang A.3.",
    "Grundlage der Anteile": "B02 Anhang A.3"
   },
   "status": "Entwurf",
   "bezuege": []
  },
  {
   "kennung": "D-PW-12",
   "art": "D",
   "n": "Standortlayout mit Flächen, Wegen, Lagerbereichen, Stellplätzen, Materialfluss und Ergonomiebewertung",
   "ebene": "GE",
   "baustein": "PW",
   "typ": "Vorlage",
   "regeln": [
    1
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-02, B02 Anhang A.5",
    "Regel": "1",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "Entwurf",
    "Verbindliche Anteile": "Mindestinhalt nach B02 Anhang A.5. Grundlage des Flucht- und Rettungsplans.",
    "Grundlage der Anteile": "B02 Anhang A.5, C06 Kapitel 4.1"
   },
   "status": "Entwurf",
   "bezuege": [
    {
     "ziel": "M-01-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-TB-01",
   "art": "D",
   "n": "Betriebsmittelmanagement mit Freigabe und Aussonderung",
   "ebene": "GE",
   "baustein": "TB",
   "typ": "Verfahrensanweisung",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-05",
    "Regel": "8",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Freigabe und Aussonderung von Betriebsmitteln. Beschaffung und Abnahme folgen M-08-05 mit D-TB-05 und D-TB-06.",
    "Grundlage der Anteile": "M-08-05, 7.2-16, KR-08-TB-E-01"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-08-05",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-TB-02",
   "art": "D",
   "n": "Betriebsmittelübersicht mit Kritikalität, Freigabe und Prüfstatus",
   "ebene": "GE",
   "baustein": "TB",
   "typ": "Vorlage",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "D-TB-01",
    "Regel": "8",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach D-TB-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "D-TB-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-TB-03",
   "art": "D",
   "n": "Wartungs- und Prüfplan",
   "ebene": "GE",
   "baustein": "TB",
   "typ": "Vorlage",
   "regeln": [],
   "mindestkriterium": true,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "IMS",
    "Regel": "Mindestkriterium",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach IMS.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-TB-04",
   "art": "D",
   "n": "Prüfprotokoll Betriebsmittel",
   "ebene": "GE",
   "baustein": "TB",
   "typ": "Nachweis",
   "regeln": [],
   "mindestkriterium": true,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "IMS",
    "Regel": "Mindestkriterium",
    "Pflege": "prüfende Person nach IMS",
    "Freigabe": "–",
    "Status": "zu prüfen"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-TB-05",
   "art": "D",
   "n": "Anforderungsspezifikation",
   "ebene": "GE",
   "baustein": "TB",
   "typ": "Vorlage",
   "regeln": [],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-05",
    "Regel": "–",
    "Pflege": "Prozessplanung",
    "Freigabe": "Standortleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Anforderungen aus Prozessbeschreibung, Mengengerüst, Anforderungsmatrix D-KP-01, rechtlichen Vorgaben und früheren Beschaffungen.",
    "Grundlage der Anteile": "M-08-05"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-08-05",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-TB-06",
   "art": "D",
   "n": "Abnahme- und Übergabeprotokoll mit Ergebnis des Leistungsnachweises",
   "ebene": "GE",
   "baustein": "TB",
   "typ": "Vorlage",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-05",
    "Regel": "8",
    "Pflege": "Prozessplanung",
    "Freigabe": "Bereichsleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Ergebnis von Vorabnahme und Endabnahme. Ergebnis des Leistungsnachweises je Stufe mit erfüllt, mit Auflage oder nicht erfüllt. Offene Punkte mit Verweis auf D-IK-03.",
    "Grundlage der Anteile": "M-08-05, A03 Kapitel 4.5"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-08-05",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-IK-01",
   "art": "D",
   "n": "Dokumentenlenkung",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Verfahrensanweisung",
   "regeln": [
    2
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "IMS",
    "Regel": "2",
    "Pflege": "IMS-Schnittstellenfunktion",
    "Freigabe": "nach IMS",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach IMS.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-IK-02",
   "art": "D",
   "n": "Auftrag und Maßnahmensteuerung",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Verfahrensanweisung",
   "regeln": [
    4
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "B03",
    "Regel": "4",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach B03.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-IK-03",
   "art": "D",
   "n": "Maßnahmenliste",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Vorlage",
   "regeln": [
    1,
    2,
    3,
    4,
    5,
    8,
    9
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "D-IK-02",
    "Regel": "1, 2, 3, 4, 5, 8, 9",
    "Pflege": "leitende Rolle der Routine",
    "Freigabe": "–",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Maßnahme mit Bezug zur Abweichung, Maßnahmenart, verantwortlicher Rolle, Termin und Status. Bei eskalierten Abweichungen die Zeitpunkte von Eskalation, Reaktion und Abschluss.",
    "Grundlage der Anteile": "D-IK-02, C05 Kapitel 4, 7.1-62"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "D-IK-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-IK-06",
   "art": "D",
   "n": "Boardstandard mit Pflichtbereichen, Layouts, Statusfarben und Signalen",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Anweisung",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C05, M-08-04",
    "Regel": "8",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Pflichtbereiche, Boardlayout je Kaskadenstufe, Status- und Signalfarben. Pflichtbereiche und Bedeutung der Signalfarben sind Pilotwerte und gelten im Pilotbetrieb verbindlich (OP-35). 1-3-10-Regel als Gestaltungsgrundsatz mit Pilotwerten. Prüfung bei der Freigabe nach M-08-04.",
    "Grundlage der Anteile": "C05 Kapitel 5, 7.2-45"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-08-04",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-IK-07",
   "art": "D",
   "n": "Eskalationsstandard",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Verfahrensanweisung",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C05",
    "Regel": "8",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Eskalationsfolge der Zielrollen. Reaktionsfrist und Lösungsfrist je Zielrolle als Pilotwerte. Eskalationsregeln in fester Rangfolge mit Zeitregel. Mengenbezogene Auslöser. Grenze für Eskalationen aus vorläufigen Schwellen bis zu deren Freigabe mit der Erstrevision. Ansprechpartner je Zielrolle auf der Kundenseite nach D-KP-04.",
    "Grundlage der Anteile": "B04 Kapitel 7, C05 Kapitel 4 und 4.1, A03 Kapitel 5, 7.1-58 bis 7.1-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-IK-09",
   "art": "D",
   "n": "Protokoll Kundenmeeting",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Nachweis",
   "regeln": [
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "RT-1-01, C05",
    "Regel": "5",
    "Pflege": "Standortleitung",
    "Freigabe": "–",
    "Status": "zu prüfen"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "RT-1-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-IK-17",
   "art": "D",
   "n": "Systemlandkarte und Informationsflussmatrix",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Vorlage",
   "regeln": [
    5,
    7
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-05-01",
    "Regel": "5, 7",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-05-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-05-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-IK-18",
   "art": "D",
   "n": "Protokoll Partnergespräch mit Auftragnehmern und Personaldienstleistern",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Nachweis",
   "regeln": [
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "RT-1-04, C05",
    "Regel": "5",
    "Pflege": "Standortleitung",
    "Freigabe": "–",
    "Status": "offen"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "RT-1-04",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-IK-19",
   "art": "D",
   "n": "Protokoll der Routine mit Ausprägungen je Routine nach C05 Kapitel 3",
   "ebene": "GE",
   "baustein": "IK",
   "typ": "Vorlage",
   "regeln": [
    3,
    5,
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C05",
    "Regel": "3, 5, 8",
    "Pflege": "leitende Rolle der Routine",
    "Freigabe": "–",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Mindestinhalte je Ausprägung nach C05 Kapitel 3. Die Mindestinhalte sind Pilotwerte und gelten im Pilotbetrieb verbindlich (OP-35).",
    "Grundlage der Anteile": "C05 Kapitel 3"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-KP-01",
   "art": "D",
   "n": "Anforderungsmatrix mit Einzelanforderungen, kritischen Merkmalen, kritischen Übergabemerkmalen und Abgleich der Regelwerke des Kunden",
   "ebene": "GE",
   "baustein": "KP",
   "typ": "Vorlage",
   "regeln": [
    1,
    3,
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-01-04",
    "Regel": "1, 3, 5",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Einzelanforderungen mit Baustein, verantwortlicher Rolle und Messgröße. Kritische Merkmale und kritische Übergabemerkmale. Abgleich jedes Regelwerks des Kunden mit den Werten erfüllt, abweichend vereinbart oder Lücke. Ausweis der Änderungen, die dem Kunden anzuzeigen sind. Kürzere Eskalationsfristen aus Regelwerken des Kunden.",
    "Grundlage der Anteile": "M-01-04, C05 Kapitel 4, C07 Kapitel 4.1, 7.1-72, 7.2-59"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-01-04",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-KP-02",
   "art": "D",
   "n": "Änderungsantrag mit Einstufung, Änderungsbewertung, Entscheidung und Abschluss der Anlaufüberwachung",
   "ebene": "GE",
   "baustein": "KP",
   "typ": "Vorlage",
   "regeln": [
    1,
    6,
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-06-03, M-04-02, C07",
    "Regel": "1, 6, 10",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung, bei Klasse E2 der Kunde",
    "Status": "Entwurf",
    "Verbindliche Anteile": "Mindestinhalt, Eingangsprüfung, Bewertung der Fachstellen und Entscheidungsmöglichkeiten nach C07 Kapitel 4.3. Einstufung in die Klassen E1 bis E3 nach B02 Kapitel 4.6.1. Bestätigung nach M-03-03 und Abschluss der Anlaufüberwachung nach C07 Kapitel 4.2.",
    "Grundlage der Anteile": "C07 Kapitel 4.2 und 4.3, B02 Kapitel 4.6.1"
   },
   "status": "Entwurf",
   "bezuege": [
    {
     "ziel": "M-06-03",
     "art": "Herkunft"
    },
    {
     "ziel": "M-04-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-KP-03",
   "art": "D",
   "n": "Partnerverzeichnis mit Partnerart, Leistungsumfang, Leistungsmerkmalen und Ansprechpersonen",
   "ebene": "GE",
   "baustein": "KP",
   "typ": "Vorlage",
   "regeln": [
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-05-02",
    "Regel": "5",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-05-02.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-05-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-KP-04",
   "art": "D",
   "n": "Leistungsschnittstellenvereinbarung mit Übergabepunkt, Übergabemerkmalen, Verantwortungsübergang, Ansprechpersonen, Informationsaustausch und Reaktionsweg",
   "ebene": "GE",
   "baustein": "KP",
   "typ": "Vorlage",
   "regeln": [
    4,
    5
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-05-02",
    "Regel": "4, 5",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung und Gegenseite",
    "Status": "Entwurf",
    "Verbindliche Anteile": "Mindestinhalt nach B02 Kapitel 4.6.3.",
    "Grundlage der Anteile": "B02 Kapitel 4.6.3"
   },
   "status": "Entwurf",
   "bezuege": [
    {
     "ziel": "M-05-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-AE-01",
   "art": "D",
   "n": "Betriebsanweisung",
   "ebene": "GE",
   "baustein": "AE",
   "typ": "Anweisung",
   "regeln": [],
   "mindestkriterium": true,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "IMS, ArbSchG",
    "Regel": "Mindestkriterium",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach IMS, ArbSchG.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-AE-02",
   "art": "D",
   "n": "Unterweisungsnachweis",
   "ebene": "GE",
   "baustein": "AE",
   "typ": "Nachweis",
   "regeln": [],
   "mindestkriterium": true,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "IMS",
    "Regel": "Mindestkriterium",
    "Pflege": "Teamleitung",
    "Freigabe": "–",
    "Status": "zu prüfen"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-AE-03",
   "art": "D",
   "n": "Ergonomiebewertung nach den Leitmerkmalmethoden der BAuA mit Risikobereich und Maßnahme je Arbeitsplatz",
   "ebene": "GE",
   "baustein": "AE",
   "typ": "Vorlage",
   "regeln": [
    2
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "ArbSchG § 5, B02 Anhang A.5, C07",
    "Regel": "2",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Bewertung nach den Leitmerkmalmethoden der BAuA mit Risikobereich und Maßnahme je Arbeitsplatz mit Standardarbeitsblatt.",
    "Grundlage der Anteile": "ArbSchG § 5, KR-02-AE-E-01"
   },
   "status": "offen",
   "bezuege": []
  },
  {
   "kennung": "D-RC-01",
   "art": "D",
   "n": "Risikoregister",
   "ebene": "GE",
   "baustein": "RC",
   "typ": "Vorlage",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-01",
    "Regel": "8",
    "Pflege": "benannte Rolle nach M-08-01",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-08-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-08-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-RC-02",
   "art": "D",
   "n": "Notfallplan mit Rückfallplan für Systemausfälle und Wiederbeschaffungszeiten",
   "ebene": "GE",
   "baustein": "RC",
   "typ": "Vorlage",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-02",
    "Regel": "8",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-08-02.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-08-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-RC-03",
   "art": "D",
   "n": "Übungsprotokoll Notfallplan",
   "ebene": "GE",
   "baustein": "RC",
   "typ": "Nachweis",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-02",
    "Regel": "8",
    "Pflege": "Bereichsleitung",
    "Freigabe": "–",
    "Status": "zu prüfen"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-08-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-RC-04",
   "art": "D",
   "n": "Pflichtenregister des Standorts mit rechtlichen und vertraglichen Pflichten und operativen Nachweisen",
   "ebene": "GE",
   "baustein": "RC",
   "typ": "Vorlage",
   "regeln": [],
   "mindestkriterium": true,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "IMS",
    "Regel": "Mindestkriterium",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "offen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach IMS.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "offen",
   "bezuege": []
  },
  {
   "kennung": "D-QV-01",
   "art": "D",
   "n": "KPI-Steckbrief mit Zielvorgabe",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    7
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-07-01, C04",
    "Regel": "7",
    "Pflege": "verantwortliche Rolle der Zielvorgabe",
    "Freigabe": "nach M-07-01 in C04",
    "Status": "offen",
    "Verbindliche Anteile": "Definition nach C04 als Verweis mit Formel, Einheit, Datenquelle und Zielrichtung. Zielwert, Meldeschwelle und Eingriffsschwelle mit Herleitung und Status vorläufig oder freigegeben. Reaktionsfrist und Lösungsfrist der zuständigen Rolle. Verantwortliche Rolle. Datenquelle, verantwortliche Rolle und das Vorhandensein der Schwellen gehören zum Referenzzustand. Die Werte von Zielwert und Schwellen gehören zum Zielsystem. Definitionen ändert die Modellverantwortung nach M-07-01 Teil 1.",
    "Grundlage der Anteile": "C04 Kapitel 6 und 6.1, B03 Kapitel 2, 7.1-44, 7.1-71"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-07-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-02",
   "art": "D",
   "n": "Layered Process Audit mit Mindestthemen nach M-03-01",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Checkliste",
   "regeln": [
    2,
    3,
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-03-01",
    "Regel": "2, 3, 10",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Mindestthemen nach M-03-01.",
    "Grundlage der Anteile": "M-03-01"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-03-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-03",
   "art": "D",
   "n": "Auditplan Layered Process Audit",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    3
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-03-01",
    "Regel": "3",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-03-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-03-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-04",
   "art": "D",
   "n": "Problemlösung: 5-Why, 8D-Report, A3",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    3,
    4
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-04-01",
    "Regel": "3, 4",
    "Pflege": "Leitung der Problemlösung",
    "Freigabe": "–",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-04-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-04-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-05",
   "art": "D",
   "n": "FMEA-Formblatt mit Aufgabenpriorität",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    8
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-08-01",
    "Regel": "8",
    "Pflege": "geschulte Rolle nach M-08-01",
    "Freigabe": "Bereichsleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-08-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-08-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-06",
   "art": "D",
   "n": "KVP-Formular",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-10-01",
    "Regel": "10",
    "Pflege": "einreichende Person",
    "Freigabe": "Teamleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-10-01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-10-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-07",
   "art": "D",
   "n": "Wirksamkeitsnachweis",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Nachweis",
   "regeln": [
    4,
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-04-01, M-10-01",
    "Regel": "4, 10",
    "Pflege": "verantwortliche Rolle der Maßnahme",
    "Freigabe": "–",
    "Status": "zu prüfen"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-04-01",
     "art": "Herkunft"
    },
    {
     "ziel": "M-10-01",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-08",
   "art": "D",
   "n": "Referenzlösung",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-10-02",
    "Regel": "10",
    "Pflege": "Standortleitung",
    "Freigabe": "Modellverantwortung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-10-02.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-10-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-09",
   "art": "D",
   "n": "Festlegung eines Referenzzustands",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Verfahrensanweisung",
   "regeln": [
    2,
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "B03",
    "Regel": "2, 10",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach B03.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "zu prüfen",
   "bezuege": []
  },
  {
   "kennung": "D-QV-10",
   "art": "D",
   "n": "Änderungsmanagement für Änderungen am Referenzzustand eines Standorts mit Änderungskategorien, Verfahrenstiefe, Erprobung für Verbesserungen, Anlaufüberwachung für Kundenänderungen und Sofortänderung",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Verfahrensanweisung",
   "regeln": [
    2,
    8,
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "C07, M-04-02",
    "Regel": "2, 8, 10",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "zu prüfen",
    "Verbindliche Anteile": "Änderungskategorien mit Änderungsobjekten, Umsetzungsaufgaben und Verfahrenstiefe einschließlich verkürztem Weg. Mindestinhalt des Antrags. Fachstellen mit Leitfragen je Änderungskategorie. Entscheidung nach C07 Kapitel 4.3 am Ende von Schritt 3. Zustimmung des Kunden bei anzeigepflichtigen Änderungen vor der Entscheidung, auch auf dem verkürzten Weg. Übernahme oder Rücknahme nach der Wirkungsprüfung. Sperrzeiten. Bestätigung nach M-03-03. Prüfung der Rückkehr nach einer befristeten Abweichung.",
    "Grundlage der Anteile": "C07 Kapitel 3.1, 4.1, 4.3 und 4.5, 7.1-30, 7.1-45, 7.2-58 bis 7.2-60"
   },
   "status": "zu prüfen",
   "bezuege": [
    {
     "ziel": "M-04-02",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-11",
   "art": "D",
   "n": "Entwicklungsplan",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Vorlage",
   "regeln": [
    10
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "M-10-03, C01",
    "Regel": "10",
    "Pflege": "Standortleitung",
    "Freigabe": "–",
    "Status": "offen",
    "Verbindliche Anteile": "Festlegung offen. Inhalte nach M-10-03, C01.",
    "Grundlage der Anteile": "OP-61"
   },
   "status": "offen",
   "bezuege": [
    {
     "ziel": "M-10-03",
     "art": "Herkunft"
    }
   ]
  },
  {
   "kennung": "D-QV-12",
   "art": "D",
   "n": "Sperrware und Eindämmung",
   "ebene": "GE",
   "baustein": "QV",
   "typ": "Verfahrensanweisung",
   "regeln": [
    4
   ],
   "mindestkriterium": false,
   "zweck": "",
   "fundstelle": "D03-DOK",
   "profil": {
    "Herkunft": "B02 Anhang A.2",
    "Regel": "4",
    "Pflege": "Bereichsleitung",
    "Freigabe": "Standortleitung",
    "Status": "Entwurf",
    "Verbindliche Anteile": "Mindestinhalt nach B02 Anhang A.2.",
    "Grundlage der Anteile": "B02 Anhang A.2"
   },
   "status": "Entwurf",
   "bezuege": []
  },
  {
   "kennung": "W-R-01",
   "art": "W",
   "n": "Personaleinsatztafel",
   "ebene": "BE",
   "komponenten": [
    "R"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.5",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.5",
    "Rolle": "Schichtleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-M-01",
   "art": "W",
   "n": "Ampelsäulen an Anlagen",
   "ebene": "BE",
   "komponenten": [
    "M"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.3 und 5.4",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.3 und 5.4",
    "Rolle": "Schichtleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-01",
   "art": "W",
   "n": "OMS Workforce Management",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C03 Kapitel 2.1",
   "profil": {
    "Fundstelle": "C03 Kapitel 2.1",
    "Rolle": "Administration, Bereichsleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-02",
   "art": "W",
   "n": "OMS Performance Measurement",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C03 Kapitel 2.2",
   "profil": {
    "Fundstelle": "C03 Kapitel 2.2",
    "Rolle": "Administration, Bereichsleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-03",
   "art": "W",
   "n": "Shopfloor-Board für Team, Schicht, Bereich und Management",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.1, 5.2 und 5.6",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.1, 5.2 und 5.6",
    "Rolle": "leitende Rolle der Routine"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-04",
   "art": "W",
   "n": "BDE-Dashboard",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C03 Kapitel 2.2, C05 Kapitel 5.1",
   "profil": {
    "Fundstelle": "C03 Kapitel 2.2, C05 Kapitel 5.1",
    "Rolle": "Schichtleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-05",
   "art": "W",
   "n": "KPI-Dashboard mit Kennzahlenreport",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C03 Kapitel 2.2, C05 Kapitel 3 und 5.1",
   "profil": {
    "Fundstelle": "C03 Kapitel 2.2, C05 Kapitel 3 und 5.1",
    "Rolle": "Standort-, Abteilungs- und Bereichsleitung, Administration"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-06",
   "art": "W",
   "n": "Andon",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.4",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.4",
    "Rolle": "Mitarbeitende, Teamleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-07",
   "art": "W",
   "n": "Kamishibai-Board",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.5",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.5",
    "Rolle": "Bereichs- und Schichtleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-08",
   "art": "W",
   "n": "Steuerungstafeln für Stunden-Soll-Ist, Wellen und Cut-off, Tore und Zeitfenster, Routenzug und Milkrun sowie Torampeln und Torstatusanzeigen",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.3, 5.4 und 5.5",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.3, 5.4 und 5.5",
    "Rolle": "Schichtleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-09",
   "art": "W",
   "n": "Themenspeicher",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 2.2 und 5.5",
   "profil": {
    "Fundstelle": "C05 Kapitel 2.2 und 5.5",
    "Rolle": "leitende Rolle der Routine"
   },
   "bezuege": []
  },
  {
   "kennung": "W-I-10",
   "art": "W",
   "n": "Sicherheitskreuz",
   "ebene": "BE",
   "komponenten": [
    "I"
   ],
   "zweck": "",
   "fundstelle": "C05 Kapitel 5.3 und 5.5",
   "profil": {
    "Fundstelle": "C05 Kapitel 5.3 und 5.5",
    "Rolle": "Teamleitung"
   },
   "bezuege": []
  },
  {
   "kennung": "RT-1-01",
   "art": "RT",
   "n": "Kundenmeeting",
   "ebene": "FU",
   "stufe": 1,
   "zweck": "Zielvorgaben",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Standortleitung",
    "Takt": "monatlich",
    "Dauer": "60–90 min",
    "Teilnehmer": "Standortleitung, Kunde",
    "Inhalte": "Zielerreichung nach SLA und Kennzahlen, Abweichungen und Maßnahmen, Forecast, offene Kundenänderungen nach der Bewertung von Kundenänderungen (M-06-03). Einmal im Jahr gleicht die Routine Anforderungsmatrix (D-KP-01) und Zielsystem mit den aktuellen Kundenanforderungen ab.",
    "Kennzahlensatz": "Kennzahlen von SCORE IV im Kundenreporting nach C04 Kapitel 5, Zielerreichung nach SLA",
    "Board": "kein eigenes Board, Managementreport",
    "Nachweis": "Managementreport nach dem Protokoll der Routine (D-IK-19), Protokoll Kundenmeeting (D-IK-09)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Nachweis"
    },
    {
     "ziel": "D-IK-09",
     "art": "Nachweis"
    },
    {
     "ziel": "M-06-03",
     "art": "Verweis"
    },
    {
     "ziel": "D-KP-01",
     "art": "Verweis"
    }
   ]
  },
  {
   "kennung": "RT-1-02",
   "art": "RT",
   "n": "Managementmeeting",
   "ebene": "FU",
   "stufe": 1,
   "zweck": "Strategische Entscheidungen",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Standortleitung",
    "Takt": "14-täglich",
    "Dauer": "60 min",
    "Teilnehmer": "Standortleitung, Abteilungsleitungen",
    "Inhalte": "Ein Termin je Monat behandelt SCORE IV, Abweichungen und Maßnahmen. Der andere Termin behandelt Maßnahmen, Risk Review, Entwicklungsplan und die langfristige Kapazität über 24 Monate. Einmal im Quartal bewertet die Routine die fünf höchsten Risiken.",
    "Kennzahlensatz": "SCORE IV mit Performanceprofil des Standorts",
    "Board": "Managementboard",
    "Nachweis": "Maßnahmenreport nach dem Protokoll der Routine (D-IK-19), Kennzahlenreport aus dem KPI-Dashboard (W-I-05)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Nachweis"
    },
    {
     "ziel": "W-I-05",
     "art": "Nachweis"
    }
   ]
  },
  {
   "kennung": "RT-1-03",
   "art": "RT",
   "n": "Abteilungsmeeting",
   "ebene": "FU",
   "stufe": 1,
   "zweck": "Taktische Steuerung",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Abteilungsleitung",
    "Takt": "wöchentlich",
    "Dauer": "30–45 min",
    "Teilnehmer": "Abteilungsleitung, Bereichsleitungen, Administration",
    "Inhalte": "Leistung je Bereich, Maßnahmen, mittelfristige Kapazität über drei bis sechs Monate, Risikoampel",
    "Kennzahlensatz": "SCORE III im Wochenverlauf je Bereich",
    "Board": "Bereichsboard",
    "Nachweis": "Maßnahmenliste (D-IK-03), Kennzahlenreport aus dem KPI-Dashboard (W-I-05)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-03",
     "art": "Nachweis"
    },
    {
     "ziel": "W-I-05",
     "art": "Nachweis"
    }
   ]
  },
  {
   "kennung": "RT-1-04",
   "art": "RT",
   "n": "Partnergespräch",
   "ebene": "FU",
   "stufe": 1,
   "zweck": "Partnerleistung",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Standortleitung oder in ihrer Vertretung Abteilungsleitung",
    "Takt": "quartalsweise je Partner",
    "Dauer": "30–60 min",
    "Teilnehmer": "Standortleitung oder in ihrer Vertretung Abteilungsleitung, Ansprechperson des Auftragnehmers oder Personaldienstleisters, bei Bedarf Bereichsleitung",
    "Inhalte": "Bei Auftragnehmern behandelt die Routine die Leistung nach den vereinbarten Leistungsmerkmalen und die Abstimmung des Arbeitsschutzes. Bei Personaldienstleistern behandelt sie Verfügbarkeit, Qualifikation und Fluktuation der Zeitarbeitskräfte. Bei beiden behandelt sie Abweichungen und Maßnahmen an der Schnittstelle sowie geplante Änderungen.",
    "Kennzahlensatz": "Begleitgrößen Partnerleistung und Fluktuation Zeitarbeit nach C04 Anhang D",
    "Board": "kein eigenes Board",
    "Nachweis": "Protokoll Partnergespräch (D-IK-18)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-18",
     "art": "Nachweis"
    }
   ]
  },
  {
   "kennung": "RT-2-01",
   "art": "RT",
   "n": "Bereichsmeeting",
   "ebene": "FU",
   "stufe": 2,
   "zweck": "Operative Steuerung",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Bereichsleitung",
    "Takt": "wöchentlich",
    "Dauer": "30 min",
    "Teilnehmer": "Bereichsleitung, Schichtleitungen",
    "Inhalte": "Wochenleistung, Maßnahmen, kurzfristige Kapazität, offene Änderungen nach C07, Ergebnisse des Layered Process Audit",
    "Kennzahlensatz": "SCORE III im Wochenverlauf",
    "Board": "Bereichsboard",
    "Nachweis": "Maßnahmenliste (D-IK-03), Wochenreport nach dem Protokoll der Routine (D-IK-19)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-03",
     "art": "Nachweis"
    },
    {
     "ziel": "D-IK-19",
     "art": "Nachweis"
    }
   ]
  },
  {
   "kennung": "RT-3-01",
   "art": "RT",
   "n": "Schichtübergabe",
   "ebene": "FU",
   "stufe": 3,
   "zweck": "Kontinuität",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Schichtleitung",
    "Takt": "je Schichtwechsel",
    "Dauer": "10–15 min",
    "Teilnehmer": "Schichtleitungen der übergebenden und der übernehmenden Schicht",
    "Inhalte": "Übergabe nach fester Agenda, Sofortmaßnahmen, Kapazitätssteuerung",
    "Kennzahlensatz": "Kennzahlen aus SCORE III je Schicht",
    "Board": "Schichtboard",
    "Nachweis": "Übergabeprotokoll nach dem Protokoll der Routine (D-IK-19)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Nachweis"
    }
   ]
  },
  {
   "kennung": "RT-3-02",
   "art": "RT",
   "n": "Schichtbesprechung",
   "ebene": "FU",
   "stufe": 3,
   "zweck": "Einsatzsteuerung",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Schichtleitung",
    "Takt": "je Schichtwechsel",
    "Dauer": "5 min",
    "Teilnehmer": "Schichtleitung, Teamleitungen",
    "Inhalte": "Sicherheit, Tagesziel, Abweichungen, Einsatz",
    "Kennzahlensatz": "Kennzahlen aus SCORE III je Schicht",
    "Board": "Schichtboard",
    "Nachweis": "Schichtprotokoll nach dem Protokoll der Routine (D-IK-19)"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Nachweis"
    }
   ]
  },
  {
   "kennung": "RT-4-01",
   "art": "RT",
   "n": "Teamstart",
   "ebene": "FU",
   "stufe": 4,
   "zweck": "Umsetzung",
   "fundstelle": "C05",
   "profil": {
    "Leitende Rolle": "Teamleitung",
    "Takt": "Schichtbeginn und -ende",
    "Dauer": "3 min",
    "Teilnehmer": "Teamleitung, Mitarbeitende",
    "Inhalte": "Sicherheit mit Daily Risk Check und gemeldeten Beinaheunfällen, Tagesziel, Abweichungen, Einsatz",
    "Kennzahlensatz": "Gefahrmeldungen und Beinaheunfälle (K3-S-02), Tagesziel und Ist je Stunde nach Arbeitsfortschritt zu Auftrag (K3-O-02)",
    "Board": "Teamboard",
    "Nachweis": "Teamstart-Protokoll nach dem Protokoll der Routine (D-IK-19), Einträge am Teamboard"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Nachweis"
    },
    {
     "ziel": "K3-S-02",
     "art": "Kennzahl"
    },
    {
     "ziel": "K3-O-02",
     "art": "Kennzahl"
    }
   ]
  },
  {
   "kennung": "K4-S-01",
   "art": "K",
   "n": "Unfallhäufigkeit (LTI-Rate)",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "S",
   "pflichtkern": false,
   "zweck": "Arbeitsunfälle mit mindestens einem Ausfalltag nach dem Unfalltag je 1 Mio. Anwesenheitsstunden",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Unfälle mit Ausfalltag / Anwesenheitsstunden × 1.000.000",
    "Einheit": "Unfälle/Mio. h",
    "Quelle": "Arbeitssicherheitssystem",
    "Entscheidende Rolle": "Standortleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-S-02",
   "art": "K",
   "n": "Präventionsdichte",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "S",
   "pflichtkern": false,
   "zweck": "Sicherheitsbegehungen je 1.000 Anwesenheitsstunden",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Anzahl Sicherheitsbegehungen / Anwesenheitsstunden × 1.000",
    "Einheit": "Begehungen/1.000 h",
    "Quelle": "Aufschreibung",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-S-03",
   "art": "K",
   "n": "Abwesenheitsquote",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "S",
   "pflichtkern": false,
   "zweck": "Anteil ausgefallener Arbeitszeit durch ungeplante Abwesenheit",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "ungeplante Abwesenheitsstunden / geplante Anwesenheitsstunden",
    "Einheit": "%",
    "Quelle": "Zeitwirtschaft, HR",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-C-01",
   "art": "K",
   "n": "Kosten je Leistungsstunde",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "C",
   "pflichtkern": false,
   "zweck": "Direkte Standortkosten bezogen auf erbrachte Leistungsstunden",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Gesamtkosten Standort / Leistungsstunden",
    "Einheit": "€/h",
    "Quelle": "Controlling",
    "Entscheidende Rolle": "Standortleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-C-02",
   "art": "K",
   "n": "Fremdpersonalquote",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "C",
   "pflichtkern": false,
   "zweck": "Anteil der durch Zeitarbeit abgedeckten Anwesenheitsstunden",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Fremdpersonalstunden / Gesamt-Anwesenheitsstunden",
    "Einheit": "%",
    "Quelle": "Zeiterfassung, Dienstleisterrechnung",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-C-03",
   "art": "K",
   "n": "Schadenskosten je Leistungsstunde",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "C",
   "pflichtkern": false,
   "zweck": "Kosten aus Beschädigungen bezogen auf Leistungsstunden",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Schadenskosten / Leistungsstunden",
    "Einheit": "€/h",
    "Quelle": "Controlling",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-O-01",
   "art": "K",
   "n": "Gesamtproduktivität",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Produktive Arbeitszeit gegenüber Arbeitskapazität",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Leistungsstunden / Arbeitskapazität",
    "Einheit": "%",
    "Quelle": "OMS, Zeiterfassung",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-O-02",
   "art": "K",
   "n": "Prozesseffizienz",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Produktive Arbeitszeit gegenüber Anwesenheit",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Leistungsstunden / Anwesenheitsstunden",
    "Einheit": "%",
    "Quelle": "OMS, Zeiterfassung",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-O-03",
   "art": "K",
   "n": "Personalverfügbarkeit",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Anwesenheit gegenüber Arbeitskapazität",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Anwesenheitsstunden / Arbeitskapazität",
    "Einheit": "%",
    "Quelle": "OMS, Zeiterfassung",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "Korridor um 100 %",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-R-01",
   "art": "K",
   "n": "Kundenreklamationsquote",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "R",
   "pflichtkern": false,
   "zweck": "Vom Kunden beanstandete Einheiten je Million gelieferter Einheiten. Die Bezugseinheit, Teil oder Position, folgt dem Kundenvertrag.",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "beanstandete Einheiten / gelieferte Einheiten × 1.000.000",
    "Einheit": "ppm",
    "Quelle": "QMS",
    "Entscheidende Rolle": "Standortleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-R-02",
   "art": "K",
   "n": "Liefertermintreue",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "R",
   "pflichtkern": false,
   "zweck": "Anteil fristgerecht erfüllter Aufträge",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "termingerechte Aufträge / alle Aufträge",
    "Einheit": "%",
    "Quelle": "ERP, Auftragsmanagement",
    "Entscheidende Rolle": "Standortleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-R-03",
   "art": "K",
   "n": "Bestandsgenauigkeit",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "R",
   "pflichtkern": false,
   "zweck": "Übereinstimmung von System- und physischem Bestand",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Positionen ohne Abweichung / geprüfte Positionen",
    "Einheit": "%",
    "Quelle": "Lagerverwaltung, Inventur",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-E-03",
   "art": "K",
   "n": "KVP-Quote",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "E",
   "pflichtkern": false,
   "zweck": "Verbesserungsideen je Anwesenheitsstunden",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "eingereichte Ideen / Anwesenheitsstunden × 1.000",
    "Einheit": "Ideen/1.000 h",
    "Quelle": "CI-Tool",
    "Entscheidende Rolle": "Standortleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K4-E-04",
   "art": "K",
   "n": "Wirksamkeitsquote",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "E",
   "pflichtkern": false,
   "zweck": "Anteil der Korrektur- und Strukturmaßnahmen mit bestätigter Wirkung",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "bestätigte Wirksamkeitsnachweise D-QV-07 / abgeschlossene Korrektur- und Strukturmaßnahmen",
    "Einheit": "%",
    "Quelle": "Maßnahmenliste D-IK-03",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": [
    {
     "ziel": "D-IK-03",
     "art": "Quelle"
    },
    {
     "ziel": "D-QV-07",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K4-E-05",
   "art": "K",
   "n": "Übernommene Referenzlösungen",
   "ebene": "FU",
   "kontext": 4,
   "dimension": "E",
   "pflichtkern": false,
   "zweck": "Am Standort übernommene Referenzlösungen nach M-10-02",
   "fundstelle": "C04 Anhang B",
   "profil": {
    "Formel": "Anzahl übernommener Referenzlösungen, rollierend über zwölf Monate",
    "Einheit": "Anzahl/Jahr",
    "Quelle": "D-QV-08, D-QV-09",
    "Entscheidende Rolle": "Standortleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Benchmark",
    "Messrhythmus": "monatlich, rollierend"
   },
   "bezuege": [
    {
     "ziel": "D-QV-08",
     "art": "Quelle"
    },
    {
     "ziel": "D-QV-09",
     "art": "Quelle"
    },
    {
     "ziel": "M-10-02",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-S-01",
   "art": "K",
   "n": "Sicherheitsbegehungen und Audits",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "S",
   "pflichtkern": false,
   "zweck": "Durchgeführte Shopfloor-Audits und Sicherheitsbegehungen je Zeitraum",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Anzahl durchgeführter Sicherheitsbegehungen und Shopfloor-Audits im Bereich",
    "Einheit": "Anzahl/Woche",
    "Quelle": "Aufschreibung, Kamishibai-Board W-I-07",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "wöchentlich"
   },
   "bezuege": [
    {
     "ziel": "W-I-07",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-S-02",
   "art": "K",
   "n": "Gefahrmeldungen und Beinaheunfälle",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "S",
   "pflichtkern": true,
   "zweck": "Gemeldete Beinaheunfälle und Gefährdungen",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Anzahl gemeldeter Beinaheunfälle und Gefährdungen",
    "Einheit": "Anzahl/Schicht",
    "Quelle": "Teamboard oder Arbeitssicherheitssystem",
    "Bereich": "Pflichtkern",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-S-03",
   "art": "K",
   "n": "PSA-Compliance",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "S",
   "pflichtkern": false,
   "zweck": "Anteil korrekt angewendeter persönlicher Schutzausrüstung laut Beobachtung",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Beobachtungen mit korrekt angewendeter Schutzausrüstung / alle Beobachtungen",
    "Einheit": "%",
    "Quelle": "Beobachtung im Rundgang, Kamishibai-Board W-I-07",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "W-I-07",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-C-01",
   "art": "K",
   "n": "Personaleinsatz zu Bedarf",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "C",
   "pflichtkern": true,
   "zweck": "Ist-Besetzung im Verhältnis zum aktuellen Soll-Personalbedarf",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "eingesetzte Stunden / Soll-Personalbedarf in Stunden",
    "Einheit": "%",
    "Quelle": "Soll aus W-I-01 oder D-OR-03, Ist aus W-R-01 oder Zeiterfassung",
    "Bereich": "Pflichtkern",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "Korridor um 100 %",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "W-I-01",
     "art": "Quelle"
    },
    {
     "ziel": "D-OR-03",
     "art": "Quelle"
    },
    {
     "ziel": "W-R-01",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-C-02",
   "art": "K",
   "n": "Einsatz Fremdpersonal",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "C",
   "pflichtkern": false,
   "zweck": "Anteil kurzfristig eingesetzter externer Kräfte an der Schichtbesetzung",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "kurzfristig eingesetzte externe Kräfte / Besetzung der Schicht",
    "Einheit": "%",
    "Quelle": "Personaleinsatztafel W-R-01",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "W-R-01",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-C-03",
   "art": "K",
   "n": "Überstundenquote",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "C",
   "pflichtkern": false,
   "zweck": "Anteil kurzfristig angeordneter Mehrarbeit an den Anwesenheitsstunden",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "kurzfristig angeordnete Mehrarbeitsstunden / Anwesenheitsstunden",
    "Einheit": "%",
    "Quelle": "Zeiterfassung",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "wöchentlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-01",
   "art": "K",
   "n": "Durchsatz je Stunde",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Bearbeitete Einheiten je Arbeitsstunde, prozess- oder bereichsspezifisch",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "bearbeitete Einheiten / Anwesenheitsstunden im Prozess oder Bereich",
    "Einheit": "Einheiten/h",
    "Quelle": "WMS oder BDE, Zeiterfassung",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-02",
   "art": "K",
   "n": "Arbeitsfortschritt zu Auftrag",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": true,
   "zweck": "Erfüllungsgrad laufender Aufträge im Zeitverlauf",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "erledigte Auftragsmenge / bis zum Messzeitpunkt geplante Auftragsmenge",
    "Einheit": "%",
    "Quelle": "WMS oder Stunden-Soll-Ist-Tafel",
    "Bereich": "Pflichtkern",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "stündlich"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-03",
   "art": "K",
   "n": "Rüst- und Wartezeiten",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Anteil nicht wertschöpfender Zeiten im laufenden Prozess",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Rüst- und Wartezeiten / Anwesenheitsstunden im Prozess",
    "Einheit": "%",
    "Quelle": "BDE, Aufschreibung",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-04",
   "art": "K",
   "n": "Bestand im Prozess",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Menge der Einheiten, die zwischen Prozessschritten auf Bearbeitung warten",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Anzahl der Einheiten in Puffern zwischen Prozessschritten zum Messzeitpunkt",
    "Einheit": "Einheiten",
    "Quelle": "WMS, Zählung",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-05",
   "art": "K",
   "n": "Durchlaufzeit",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Zeit vom Eingang einer Einheit bis zum Abschluss ihrer Bearbeitung",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Mittelwert aus Abschlusszeitpunkt minus Eingangszeitpunkt je Einheit",
    "Einheit": "h",
    "Quelle": "WMS",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Soll-Ist-Vergleich",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "täglich"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-06",
   "art": "K",
   "n": "Engpässe",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Zahl und Dauer der Engpassereignisse im Prozessfluss je Schicht",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Anzahl und Summe der Dauer der Engpassereignisse",
    "Einheit": "Anzahl, min/Schicht",
    "Quelle": "Schichtprotokoll D-IK-19, Steuerungstafeln W-I-08",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Quelle"
    },
    {
     "ziel": "W-I-08",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-O-07",
   "art": "K",
   "n": "Lagerfüllgrad",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Belegte Lagerplätze zu verfügbaren Lagerplätzen, gemessen gegen die Obergrenze des Standorts",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "belegte Lagerplätze / verfügbare Lagerplätze",
    "Einheit": "%",
    "Quelle": "WMS",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "täglich"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-O-08",
   "art": "K",
   "n": "Leergutverfügbarkeit",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "O",
   "pflichtkern": false,
   "zweck": "Verfügbare zu benötigten Leergutbehältern je Behältertyp",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "verfügbare Behälter / benötigte Behälter je Behältertyp",
    "Einheit": "%",
    "Quelle": "WMS, Leergutkonto",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "täglich"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-R-01",
   "art": "K",
   "n": "Prozessabweichungen",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "R",
   "pflichtkern": true,
   "zweck": "Erkannte Abweichungen vom Referenzzustand, etwa Fehlbuchungen und Scanfehler",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Anzahl erkannter Abweichungen vom Referenzzustand",
    "Einheit": "Anzahl/Schicht",
    "Quelle": "Schichtprotokoll D-IK-19, Maßnahmenliste D-IK-03",
    "Bereich": "Pflichtkern",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Quelle"
    },
    {
     "ziel": "D-IK-03",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-R-02",
   "art": "K",
   "n": "Fehler im Prozessfluss",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "R",
   "pflichtkern": false,
   "zweck": "Fehlerhafte Bearbeitungen vor Abschluss",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "fehlerhafte Bearbeitungen / bearbeitete Einheiten",
    "Einheit": "%",
    "Quelle": "QMS, Schichtprotokoll D-IK-19",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-R-03",
   "art": "K",
   "n": "Auftragsverzögerungen",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "R",
   "pflichtkern": false,
   "zweck": "Nicht fristgerecht gestartete oder bearbeitete Aufträge",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "verzögerte Aufträge / alle Aufträge der Schicht",
    "Einheit": "%",
    "Quelle": "WMS, ERP",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": []
  },
  {
   "kennung": "K3-R-04",
   "art": "K",
   "n": "Versorgungsstillstände",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "R",
   "pflichtkern": false,
   "zweck": "Stillstände der Kundenproduktion durch fehlende oder falsche Versorgung, mit Zahl und Dauer je Schicht",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "Anzahl und Summe der Dauer der Stillstände",
    "Einheit": "Anzahl, min/Schicht",
    "Quelle": "Meldung des Kunden, Schichtprotokoll D-IK-19",
    "Bereich": "Wahl, bei Produktionsversorgung gewählt",
    "Entscheidende Rolle": "Schichtleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "je Schicht"
   },
   "bezuege": [
    {
     "ziel": "D-IK-19",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-E-01",
   "art": "K",
   "n": "Umgesetzte Verbesserungsmaßnahmen",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "E",
   "pflichtkern": false,
   "zweck": "Anteil umgesetzter Maßnahmen aus Daily Management und KVP",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "umgesetzte Maßnahmen / beschlossene Maßnahmen",
    "Einheit": "%",
    "Quelle": "Maßnahmenliste D-IK-03, CI-Tool",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "wöchentlich"
   },
   "bezuege": [
    {
     "ziel": "D-IK-03",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-E-02",
   "art": "K",
   "n": "Prozessstandard-Compliance",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "E",
   "pflichtkern": true,
   "zweck": "Anteil eingehaltener Standards laut Layered Process Audit M-03-01",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "eingehaltene Prüfpunkte / geprüfte Prüfpunkte",
    "Einheit": "%",
    "Quelle": "LPA-Ergebnisse nach D-QV-02",
    "Bereich": "Pflichtkern",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "höher",
    "Prognosecharakter": "vorlaufend",
    "Überwachung": "Schwelle",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "wöchentlich"
   },
   "bezuege": [
    {
     "ziel": "D-QV-02",
     "art": "Quelle"
    },
    {
     "ziel": "M-03-01",
     "art": "Quelle"
    }
   ]
  },
  {
   "kennung": "K3-E-04",
   "art": "K",
   "n": "Wiederholfehlerquote",
   "ebene": "FU",
   "kontext": 3,
   "dimension": "E",
   "pflichtkern": false,
   "zweck": "Anteil der Prozessabweichungen gleicher Art und Ursache, die innerhalb von 90 Tagen nach abgeschlossener Abstellmaßnahme erneut auftreten. Die 90 Tage sind ein Pilotwert. Die Wiederholungsregel der Eskalation nach C05 Kapitel 4.1 bleibt davon getrennt.",
   "fundstelle": "C04 Anhang C",
   "profil": {
    "Formel": "wiederholte Abweichungen / alle erfassten Prozessabweichungen",
    "Einheit": "%",
    "Quelle": "Maßnahmenliste D-IK-03",
    "Bereich": "Wahl",
    "Entscheidende Rolle": "Bereichsleitung",
    "Zielrichtung": "niedriger",
    "Prognosecharakter": "nachlaufend",
    "Überwachung": "Trend",
    "Vergleichsbasis": "Planwert",
    "Messrhythmus": "monatlich"
   },
   "bezuege": [
    {
     "ziel": "D-IK-03",
     "art": "Quelle"
    }
   ]
  }
 ],
 "kanon": [
  {
   "kennung": "A01",
   "n": "Executive Summary",
   "inhalt": "Verdichtete Gesamtschau, die aus den übrigen Dokumenten abgeleitet ist und keine eigenen Normen setzt",
   "gruppe": "A"
  },
  {
   "kennung": "A02",
   "n": "Modellbeschreibung",
   "inhalt": "Architektur, Ausrichtung, Objektmodell, Bewertungsperspektiven, Kanon, Governance, Regeln der Liste offener Punkte, Zuordnung zur ISO 9001",
   "gruppe": "A"
  },
  {
   "kennung": "A03",
   "n": "Projektierung und Implementierung",
   "inhalt": "Projektphase bis zur Übergabe, Projektorganisation mit Projektleitung und Projektdokumentation, Prüftiefen Readiness, Checkup und Ausgangslage, Leistungsnachweis unter Last, SCORE I, Stände der Standortvorgaben und Erstrevision, Einführung im bestehenden Betrieb, Migration",
   "gruppe": "A"
  },
  {
   "kennung": "B01",
   "n": "Ebene Normierung",
   "inhalt": "Goldene Regeln mit Leitsatz, Anforderung, Wirkung, prüfenden Stufen, Beobachtungsgröße und Beispiel, Mindestkriterien als zweite Normquelle",
   "gruppe": "B"
  },
  {
   "kennung": "B02",
   "n": "Ebene Gestaltung",
   "inhalt": "Bausteine mit acht Bausteinprofilen, Modellvorgaben und verbindliche Anteile, Kundenänderung und Partnerarten, Aufteilung der Eskalation, Regelungen außerhalb des Modells",
   "gruppe": "B"
  },
  {
   "kennung": "B03",
   "n": "Ebene Befähigung",
   "inhalt": "Standortvorgaben und Referenzzustand, sechs Komponentenprofile mit zuführenden Bausteinen, Methoden, Voraussetzungsprüfung (M-03-03), Betriebswerkzeuge",
   "gruppe": "B"
  },
  {
   "kennung": "B04",
   "n": "Ebene Führung",
   "inhalt": "Führungsregelkreis, Kaskade mit Rückfallregel, Größenklassen, Statusbewertung und Befundanalyse (M-08-03), Eskalationsrahmen mit Fristen",
   "gruppe": "B"
  },
  {
   "kennung": "C01",
   "n": "Reifegradmodell (zu B01)",
   "inhalt": "Stufenlogik, Stufeninhalte, Mindestkriterien, Reifegradaudit (M-00-01) mit vier Prüftiefen, Entwicklungsplanung (M-10-03), Freigabe von Anwendungsfällen, Governance der Audits, Prüfmatrix",
   "gruppe": "C"
  },
  {
   "kennung": "C02",
   "n": "Process Framework (zu B02)",
   "inhalt": "Eigenständiges, interaktives Werkzeug: Ebenenmodell L0 bis L4, Prozessreferenzen und Prozessanforderungen, Prozessmerkmale, Arbeitsstandards, Schrittbibliothek, Prozesscodes, Zeitbasis, Buchungspunkt-Modell, Planungsrechner, Muster-FMEA, Standortinstanz, Fassung von Werkzeug und Datenstand",
   "gruppe": "C"
  },
  {
   "kennung": "C03",
   "n": "Operations Management System (zu B03)",
   "inhalt": "OMS Workforce Management, OMS Performance Measurement, Datenbasis, Mapping, Datenqualität, Betrieb ohne OMS, Einrichtung des OMS (M-07-02)",
   "gruppe": "C"
  },
  {
   "kennung": "C04",
   "n": "SCORE-Modell (zu B04)",
   "inhalt": "Dimensionen, Kontexte, Pflichtkern, Wahlbereich je Größenklasse, Zielvorgabe, Erstellung eines KPI-Steckbriefs (M-07-01), Zeitbasis, Kennzahldefinitionen, Begleitgrößen",
   "gruppe": "C"
  },
  {
   "kennung": "C05",
   "n": "Shopfloor-Management (zu B04)",
   "inhalt": "Routinen mit Routinenprofilen, Agenda, Dokumentations- und Eskalationskaskade mit Fristen, Boards und Statusfarben, Einrichtung der Boards (M-08-04), Leader Standard Work, Individualisierung",
   "gruppe": "C"
  },
  {
   "kennung": "C06",
   "n": "Visual Management (zu B02)",
   "inhalt": "Farbsysteme, Verkehrswege und Gefahrstellen, Standardfarbplan, Markierungselemente und Markierungsmaterial, Blocklager, Beschilderung, Bestand und Nachschub, visuelle Standards am Arbeitsplatz",
   "gruppe": "C"
  },
  {
   "kennung": "C07",
   "n": "Änderungsmanagement (zu B02)",
   "inhalt": "Interner und externer Pfad, Verfahren und Verfahrenstiefe, Änderung des Referenzzustands (M-04-02), befristete Abweichung, Sofortänderung, Übernahmeregeln, Abgrenzung zur Problemlösung",
   "gruppe": "C"
  },
  {
   "kennung": "D01-GL",
   "n": "Glossar",
   "inhalt": "Definitionen der Modellbegriffe und Liste der Dokumenttypen",
   "gruppe": "D"
  },
  {
   "kennung": "D02-MET",
   "n": "Methodenkatalog",
   "inhalt": "Übersicht aller Methoden mit Regel, Baustein, Befähigungskomponente und Ebene, Profile der Methoden, Überleitung früherer Kennungen",
   "gruppe": "D"
  },
  {
   "kennung": "D03-DOK",
   "n": "Dokumentenregister",
   "inhalt": "Dokumente je Baustein mit Typ, Herkunft, Regel, Pflege, Freigabe, Status und verbindlichen Anteilen, Überleitung gesperrter Kennungen. Ein Skript leitet die Spalte Regel aus der Prüfmatrix ab.",
   "gruppe": "D"
  },
  {
   "kennung": "D04-PROZ",
   "n": "Prozesskatalog",
   "inhalt": "Hauptprozessverzeichnis mit Prozessanforderungen, Codeschema mit Lebenszyklus, Zeitarten und Häufigkeiten",
   "gruppe": "D"
  },
  {
   "kennung": "D05-WZ",
   "n": "Werkzeugkatalog",
   "inhalt": "Betriebswerkzeuge mit Komponente, Fundstelle und Rolle, Quellsysteme und optionale Hilfsmittel als Verweis",
   "gruppe": "D"
  },
  {
   "kennung": "E01",
   "n": "Ebenenmodell",
   "inhalt": "Je Ebene ein Band mit ihren Komponenten als Blöcke, Anzeigen der Bewertungssysteme und der Führung, Perspektiven, Kernkomponenten und Rückführung",
   "gruppe": "E"
  },
  {
   "kennung": "E02",
   "n": "Wirkungsbild",
   "inhalt": "Blatt 1 Wirkungslogik des Modells, Blatt 2 Wirkungskette Prozesse & Wertstrom, beide in einer Datei",
   "gruppe": "E"
  },
  {
   "kennung": "E03",
   "n": "Mindmap",
   "inhalt": "Ebenen und Tiefenstufen mit ihren Objekten, erzeugt aus den Katalogen",
   "gruppe": "E"
  },
  {
   "kennung": "E04",
   "n": "Rollenkarten",
   "inhalt": "Je Rolle der Kaskade: Routinen, Kennzahlen, Entscheidungen, Eskalation, Kunden und Partner, Pflichten und Risiken, Methoden, Werkzeuge und Dokumente. Die Karte der Mitarbeitenden ist verkürzt.",
   "gruppe": "E"
  },
  {
   "kennung": "E05",
   "n": "Präsentation",
   "inhalt": "Vorstellung des Modells für die Leitungsebene mit einem Detailgrad zwischen A01 und A02",
   "gruppe": "E"
  },
  {
   "kennung": "E06",
   "n": "Prozessmodell",
   "inhalt": "Ebenenmodell und logistische Kette des Process Framework mit Beispielen aus dem Datenstand",
   "gruppe": "E"
  },
  {
   "kennung": "E07",
   "n": "Matrix Baustein und Befähigung",
   "inhalt": "Zuführung der Bausteine der Gestaltung zu den Befähigungskomponenten nach C01 Anhang A.8",
   "gruppe": "E"
  },
  {
   "kennung": "E09",
   "n": "Modellnavigator",
   "gruppe": "E",
   "vorgemerkt": "7.6-04",
   "inhalt": "Interaktive Sicht auf Ebenen, Ordnung und Objekte, erzeugt aus den Katalogen. Nicht normativ. Aufnahme in A02 Kapitel 6.2 mit Fassung 7.6."
  }
 ],
 "einstieg": [
  {
   "rolle": "Schicht- und Teamleitung",
   "einstieg": "Rollenkarte, C05, C06, Methoden in D02-MET mit den Kaskadenstufen Teilbereich, Team und Arbeitsplatz"
  },
  {
   "rolle": "Bereichsleitung",
   "einstieg": "zusätzlich A02 Kapitel 1 bis 4, B02 bis B04, C02, C04, C07 und D02-MET vollständig"
  },
  {
   "rolle": "Standort- und Abteilungsleitung",
   "einstieg": "A01, A02 vollständig, B01 bis B04, C01, C04 und C07"
  }
 ]
};
