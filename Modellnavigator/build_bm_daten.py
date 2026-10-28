#!/usr/bin/env python3
"""Erzeugt die Datendatei bm-daten.js des Modellnavigators E09.

Eingang ist ein Ordner mit den Dokumenten des Kanons. Je Dokument liegt eine
Textfassung (.md) oder das Original (.docx) vor. Ein docx wird mit pandoc in
die Textfassung umgewandelt. Das Skript liest nur Tabellen, Überschriften,
Absätze und Listen. Es ordnet Objekte über ihre Kennung zu und löst die
Indexmarken (I1, I2, ...) über das Index-Verzeichnis des jeweiligen Dokuments
auf.

Aufruf:
    python3 build_bm_daten.py QUELLORDNER [AUSGABEDATEI]

Die Ausgabe ist bm-daten.js mit window.BM = {...}. Das Skript endet mit einem
Prüfbericht. Bei einem Fehler endet es mit dem Rückgabewert 1.
"""
import datetime
import json
import pathlib
import re
import subprocess
import sys
from html.parser import HTMLParser

ERZEUGER = 'build_bm_daten.py 1.0'
KANON_FASSUNG = '7.5'
PCF_DATEI = 'PCF_9.6_Process_Framework.html'

OBJ_RE = re.compile(r'\b(M-\d{2}-\d{2}|D-[A-Z]{2}-\d{2}|W-[RMIPQS]-\d{2}|RT-\d-\d{2}|K[34]-[SCORE]-\d{2})\b')
REGEL_RE = re.compile(r'\bRegel (\d{1,2})\b')
EBENEN = ['AU', 'NO', 'GE', 'BE', 'FU']
EBENE_NAME = {'Ausrichtung': 'AU', 'Normierung': 'NO', 'Gestaltung': 'GE', 'Befähigung': 'BE', 'Führung': 'FU'}
KOMPONENTEN = ['R', 'M', 'I', 'P', 'Q', 'S']

# Perspektiven nach A02 Kapitel 2.1: Ausrichtung und Normierung liefern den
# Maßstab, Gestaltung und Befähigung bilden die Struktur, die Führung erzeugt
# und steuert die Performance.
PERSPEKTIVEN = [
    {'code': 'PE', 'n': 'Performance', 'ebenen': ['FU'], 'text': 'SCORE bewertet die Leistung gegen das Zielsystem des Standorts.'},
    {'code': 'ST', 'n': 'Struktur', 'ebenen': ['BE', 'GE'], 'text': 'Das Reifegradmodell bewertet die Struktur gegen die Goldenen Regeln und prüft auch die Anwendung des Führungssystems.'},
    {'code': 'MA', 'n': 'Maßstab', 'ebenen': ['NO', 'AU'], 'text': 'Regeln für die Struktur und Zielsystem für die Performance.'},
]

# Blöcke der Ebenen in der Startsicht nach dem Bild von E01. Die Inhalte der
# Blöcke stammen aus den Daten. Die Auswahl der Blöcke ist Darstellung.
BLOECKE_FU = [
    {'id': 'score3', 'n': 'SCORE III', 'text': 'Shopfloor Control für Bereich und Schicht', 'ziel': 'fuehrung'},
    {'id': 'score4', 'n': 'SCORE IV', 'text': 'Performance Management des Standorts', 'ziel': 'fuehrung'},
    {'id': 'kaskade', 'n': 'Führungskaskade', 'text': 'Fünf Kaskadenstufen vom Management bis zum Arbeitsplatz', 'ziel': 'fuehrung'},
    {'id': 'routinen', 'n': 'Routinen und Boards', 'text': 'C05 Shopfloor-Management', 'ziel': 'fuehrung'},
    {'id': 'status', 'n': 'Statusbewertung und Eskalation', 'text': 'M-08-03 mit vier Status', 'obj': 'M-08-03'},
]
BLOECKE_AU = [
    {'id': 'au-ordnung', 'n': 'Kundennutzen, Positionierung, Strategie', 'text': 'Begründen Regeln und Zielsystem', 'ziel': 'ebene:AU'},
    {'id': 'au-matrix', 'n': 'Anforderungsmatrix', 'text': 'Prüfbare Anforderungen des Kunden', 'obj': 'D-KP-01'},
    {'id': 'au-aenderung', 'n': 'Kundenänderung', 'text': 'Klassen E1 bis E3', 'obj': 'M-06-03'},
    {'id': 'au-review', 'n': 'Ausrichtungsreview', 'text': 'Jährlich im Kundenmeeting', 'obj': 'RT-1-01'},
]


def clean(s):
    s = s.replace('**', '').replace('\\', '')
    return re.sub(r'\s+', ' ', s).strip()


class HtmlTables(HTMLParser):
    """Liest einfache HTML-Tabellen, die pandoc für verbundene Zellen ausgibt."""

    def __init__(self):
        super().__init__()
        self.tables, self.row, self.cell, self.in_cell = [], None, [], False

    def handle_starttag(self, tag, attrs):
        if tag == 'table':
            self.tables.append([])
        elif tag == 'tr':
            self.row = []
        elif tag in ('td', 'th'):
            self.in_cell, self.cell = True, []

    def handle_endtag(self, tag):
        if tag in ('td', 'th'):
            self.row.append(clean(' '.join(self.cell)))
            self.in_cell = False
        elif tag == 'tr' and self.row is not None and self.tables:
            self.tables[-1].append(self.row)
            self.row = None

    def handle_data(self, data):
        if self.in_cell:
            self.cell.append(data)


class Dokument:
    """Textfassung eines Dokuments mit Überschriften, Tabellen, Absätzen und Listen."""

    def __init__(self, kennung, text, datei):
        self.kennung, self.datei = kennung, datei
        self.tabellen, self.abschnitte, self.index = [], {}, {}
        self._lies(text)
        for t in self.tabellen:
            if t['kopf'][:3] == ['Index', 'Kennung', 'Bezeichnung']:
                for z in t['zeilen']:
                    self.index[z[0]] = z[1]

    def _lies(self, text):
        pfad, aktuell = [], None
        zeilen = text.splitlines()
        i = 0
        while i < len(zeilen):
            z = zeilen[i].rstrip()
            m = re.match(r'^(#{1,6})\s+(.*)$', z)
            if m:
                ebene, titel = len(m.group(1)), clean(m.group(2))
                pfad = [p for p in pfad if p[0] < ebene] + [(ebene, titel)]
                aktuell = titel
                self.abschnitte.setdefault(titel, {'absaetze': [], 'liste': []})
                i += 1
                continue
            if z.startswith('|'):
                block = []
                while i < len(zeilen) and zeilen[i].startswith('|'):
                    block.append(zeilen[i].rstrip())
                    i += 1
                zellen = [[clean(c) for c in b.strip('|').split('|')] for b in block if not re.match(r'^\|[\s\-:|]+\|?$', b)]
                if zellen:
                    self.tabellen.append({'kopf': zellen[0], 'zeilen': zellen[1:], 'ueberschrift': aktuell, 'pfad': [p[1] for p in pfad]})
                continue
            if z.lstrip().lower().startswith('<table'):
                block = []
                while i < len(zeilen):
                    block.append(zeilen[i])
                    if '</table>' in zeilen[i].lower():
                        i += 1
                        break
                    i += 1
                p = HtmlTables()
                p.feed('\n'.join(block))
                for t in p.tables:
                    if t:
                        self.tabellen.append({'kopf': t[0], 'zeilen': t[1:], 'ueberschrift': aktuell, 'pfad': [q[1] for q in pfad]})
                continue
            if aktuell and z.strip():
                if re.match(r'^\s*([-*]|\d+\.)\s+', z):
                    self.abschnitte[aktuell]['liste'].append(clean(re.sub(r'^\s*([-*]|\d+\.)\s+', '', z)))
                else:
                    self.abschnitte[aktuell]['absaetze'].append(clean(z))
            i += 1

    def tabelle(self, *kopf, unter=None):
        """Alle Tabellen, deren Kopf mit den genannten Spalten beginnt."""
        kopf = list(kopf)
        return [t for t in self.tabellen if t['kopf'][:len(kopf)] == kopf and (unter is None or unter in (t['ueberschrift'] or ''))]

    def abschnitt(self, beginn):
        for titel, inhalt in self.abschnitte.items():
            if titel.startswith(beginn):
                return inhalt
        return {'absaetze': [], 'liste': []}

    def profile(self, muster):
        """Profiltabellen Merkmal/Inhalt unter einer Überschrift, die dem Muster entspricht."""
        ergebnis = {}
        for t in self.tabelle('Merkmal', 'Inhalt'):
            m = re.match(muster, t['ueberschrift'] or '')
            if m:
                ergebnis[m.group(1)] = {'titel': t['ueberschrift'], 'felder': {z[0]: z[1] for z in t['zeilen'] if len(z) > 1}}
        return ergebnis

    def aufloesen(self, text, warnungen):
        """Ersetzt Indexmarken durch Kennungen nach dem Index-Verzeichnis."""
        def ersetze(m):
            marke, rest = m.group(1), m.group(2) or ''
            if marke in self.index:
                return '(' + self.index[marke] + rest + ')'
            warnungen.append(f'{self.kennung}: Indexmarke {marke} ohne Eintrag im Index-Verzeichnis')
            return m.group(0)
        return re.sub(r'\((I\d+)((?:,[^)]*)?)\)', ersetze, text)


def lade_quellen(ordner):
    dokumente = {}
    for datei in sorted(pathlib.Path(ordner).iterdir()):
        if datei.suffix.lower() not in ('.md', '.docx'):
            continue
        kennung = datei.name.split('_')[0]
        if datei.suffix.lower() == '.docx':
            text = subprocess.run(['pandoc', '-t', 'gfm', '--wrap=none', str(datei)], capture_output=True, text=True, check=True).stdout
        else:
            text = datei.read_text(encoding='utf-8')
        if kennung in dokumente:
            raise SystemExit(f'Quelle doppelt vorhanden: {kennung} ({datei.name} und {dokumente[kennung].datei})')
        dokumente[kennung] = Dokument(kennung, text, datei.name)
    return dokumente


def kennungen(text):
    return list(dict.fromkeys(OBJ_RE.findall(text or '')))


def regeln_aus(text):
    return sorted({int(n) for n in re.findall(r'\b(\d{1,2})\b', text or '') if 1 <= int(n) <= 10})


def baue(dokumente):
    w = []  # Warnungen
    def doc(k):
        if k not in dokumente:
            raise SystemExit(f'Quelle fehlt: {k}')
        return dokumente[k]

    a02, b01, b02, b03, c04, c05, d02, d03, d05 = (doc(k) for k in ['A02', 'B01', 'B02', 'B03', 'C04', 'C05', 'D02', 'D03', 'D05'])
    R = lambda d, t: d.aufloesen(t, w)

    # Ebenen nach A02 Kapitel 2.1
    ebenen = []
    t1 = a02.tabelle('Ebene', 'Bewertung')[0]
    t2 = {z[0]: z for z in a02.tabelle('Ebene', 'Ordnung')[0]['zeilen']}
    for z in t1['zeilen']:
        m = re.match(r'^(.*)\s+\((\w\w)\)$', z[0])
        name, code = m.group(1), m.group(2)
        r = t2[code]
        ebenen.append({'code': code, 'n': name, 'bewertung': z[1], 'leitfrage': z[2], 'fuehrenderOrt': z[3],
                       'ordnung': r[1], 'operationalisierung': R(a02, r[2]), 'nachweis': R(a02, r[3])})

    # Entwicklungsfelder und Regeln nach B01
    felder, regeln = [], {}
    for z in b01.tabelle('Entwicklungsfeld', 'Voraussetzung')[0]['zeilen']:
        nr, name = z[0].split(' ', 1)
        paar = []
        for rolle, zelle in (('Voraussetzung', z[1]), ('Wirkung', z[2])):
            m = re.match(r'^Regel (\d+) (\S+) (.*)$', zelle)
            rn = int(m.group(1))
            regeln[rn] = {'kennung': f'Regel {rn}', 'nr': rn, 'kurz': m.group(2), 'n': f'{m.group(2)} {m.group(3)}', 'feld': int(nr), 'rolle': rolle}
            paar.append(rn)
        felder.append({'nr': int(nr), 'n': name, 'regeln': paar})
    for rn, p in b01.profile(r'^Regel (\d+)\b').items():
        f = p['felder']
        regeln[int(rn)].update({'leitsatz': f.get('Leitsatz', ''), 'anforderung': f.get('Anforderung', ''), 'wirkung': f.get('Wirkung', ''),
                                'pruefendeStufen': f.get('Prüfende Stufen', ''), 'beobachtungsgroesse': R(b01, f.get('Beobachtungsgröße', '')),
                                'beispiel': R(b01, f.get('Beispiel Warenannahme', ''))})
    mk = b01.abschnitt('3 Mindestkriterien')
    mindestkriterien = {'gegenstaende': mk['liste'], 'text': mk['absaetze']}
    reihenfolge = b01.abschnitt('2.2 Reihenfolge')['absaetze']

    # Bausteine nach B02
    bausteine = []
    namen_bs = {}
    for z in b02.tabelle('Baustein', 'Kürzel')[0]['zeilen']:
        bausteine.append({'code': z[1], 'n': z[0], 'gegenstand': z[2]})
        namen_bs[z[0]] = z[1]
    for titel, p in b02.profile(r'^4\.\d+ (.+)$').items():
        code = namen_bs.get(titel)
        if not code:
            continue
        f = p['felder']
        b = next(x for x in bausteine if x['code'] == code)
        b.update({'leitfrage': f.get('Leitfrage', ''), 'kernkomponente': R(b02, f.get('Kernkomponente', '')),
                  'befaehigung': f.get('Befähigungskomponente', ''), 'pruefschwerpunkt': f.get('Prüfschwerpunkt', ''),
                  'schnittstellen': f.get('Schnittstellen', '')})
    zusatz = {
        'verbindlichkeit': b02.tabelle('Klasse', 'Bedeutung')[0]['zeilen'],
        'kundenaenderung': b02.tabelle('Klasse', 'Gegenstand')[0]['zeilen'],
        'partnerarten': [[R(b02, c) for c in z] for z in b02.tabelle('Partnerart', 'Beispiele')[0]['zeilen']],
    }

    # Befähigungskomponenten nach B03
    komponenten = []
    for z in b03.tabelle('Komponente', 'Kürzel')[0]['zeilen']:
        komponenten.append({'code': z[1], 'n': z[0], 'gegenstand': z[2]})
    weg = {z[0]: z for z in b03.tabelle('Komponente', 'Gestaltungsmittel')[0]['zeilen']}
    for k in komponenten:
        if k['n'] in weg:
            z = weg[k['n']]
            k['weg'] = {'gestaltungsmittel': R(b03, z[1]), 'methode': R(b03, z[2]), 'realisierung': z[3]}
    for titel, p in b03.profile(r'^3\.\d (\S+) Komponente$').items():
        k = next((x for x in komponenten if x['n'].lower().startswith(titel.lower()[:6])), None)
        if not k:
            w.append(f'B03: Profil {titel} ohne Komponente')
            continue
        f = p['felder']
        k.update({'erfuellt': R(b03, f.get('Erfüllt, wenn', '')), 'zufuehrend': [s.strip() for s in f.get('Zuführende Bausteine', '').split(',') if s.strip()],
                  'nachweisobjekte': R(b03, f.get('Typische Nachweisobjekte', '')), 'abgrenzung': R(b03, f.get('Abgrenzung', ''))})

    # Kaskadenstufen nach dem Referenzschema in A02 Kapitel 4.3
    schema = {z[0]: z for z in a02.tabelle('Objektart', 'Schema')[0]['zeilen']}
    stufen = [{'nr': int(n), 'n': s} for n, s in re.findall(r'(\d) (\w+)', schema['Routine'][3])]

    # SCORE nach C04
    dimensionen = [{'code': z[0], 'n': z[1], 'gegenstand': z[2], 'beispiele': z[3]} for z in c04.tabelle('Kürzel', 'Dimension')[0]['zeilen']]
    kontexte = c04.tabelle('Prozessart', 'Projekt')[0]['zeilen']

    objekte = []

    # Prinzipien
    for rn in sorted(regeln):
        r = regeln[rn]
        o = {'kennung': r['kennung'], 'art': 'P', 'n': r['n'], 'ebene': 'NO', 'regel': rn, 'feld': r['feld'],
             'zweck': r.get('leitsatz', ''), 'fundstelle': 'B01', 'bezuege': []}
        for k in kennungen(r.get('beobachtungsgroesse', '')):
            o['bezuege'].append({'ziel': k, 'art': 'Beobachtungsgröße'})
        objekte.append(o)

    # Methoden nach D02-MET
    profile = {}
    for d in dokumente.values():
        for k, p in d.profile(r'^(M-\d{2}-\d{2})\b').items():
            pf = {name: R(d, wert) for name, wert in p['felder'].items()}
            profile[k] = (d.kennung, pf)
    for z in d02.tabelle('Kennung', 'Methode')[0]['zeilen']:
        k = z[0]
        regel = 0 if z[2].startswith('regelübergreifend') else int(z[2])
        baustein = None if z[3].startswith('bausteinübergreifend') else z[3]
        komp = KOMPONENTEN[:] if z[4] == 'alle' else ([] if z[4] in ('–', '-') else [z[4]])
        ort, f = profile.get(k, (None, {}))
        if not f:
            w.append(f'{k}: kein Methodenprofil in den Quellen')
        o = {'kennung': k, 'art': 'M', 'n': z[1], 'ebene': EBENE_NAME[z[5]], 'regel': regel, 'baustein': baustein, 'komponenten': komp,
             'zweck': f.get('Zweck', ''), 'fundstelle': z[6], 'profil': {x: f[x] for x in ('Kaskadenstufe', 'Auslöser', 'Ergebnis', 'Dokumente', 'Verweise') if x in f},
             'stufen': [s['nr'] for s in stufen if s['n'] in f.get('Kaskadenstufe', '')], 'bezuege': []}
        if 'Alle Ebenen der Kaskade' in f.get('Kaskadenstufe', ''):
            o['stufen'] = [1, 2, 3, 4]
        for feld, art in (('Dokumente', 'nutzt'), ('Ergebnis', 'Ergebnis'), ('Verweise', 'Verweis')):
            for x in kennungen(f.get(feld, '')):
                if x != k and not any(b['ziel'] == x for b in o['bezuege']):
                    o['bezuege'].append({'ziel': x, 'art': art})
        objekte.append(o)

    # Dokumente nach D03-DOK
    anteile = {z[0]: {'anteile': z[1], 'grundlage': z[2]} for t in d03.tabelle('Kennung', 'Verbindliche Anteile') for z in t['zeilen']}
    for t in d03.tabelle('Kennung', 'Typ', 'Bezeichnung'):
        for z in t['zeilen']:
            k = z[0]
            o = {'kennung': k, 'art': 'D', 'n': z[2], 'ebene': 'GE', 'baustein': k.split('-')[1], 'typ': z[1],
                 'regeln': regeln_aus(z[4]), 'mindestkriterium': 'Mindestkriterium' in z[4],
                 'zweck': '', 'fundstelle': 'D03-DOK',
                 'profil': {'Herkunft': z[3], 'Regel': z[4], 'Pflege': z[5], 'Freigabe': z[6], 'Status': z[7]},
                 'status': z[7], 'bezuege': [{'ziel': x, 'art': 'Herkunft'} for x in kennungen(z[3]) if x != k]}
            if k in anteile:
                o['profil']['Verbindliche Anteile'] = anteile[k]['anteile']
                o['profil']['Grundlage der Anteile'] = anteile[k]['grundlage']
            objekte.append(o)

    # Betriebswerkzeuge nach D05-WZ
    kmap = {k['n'].lower(): k['code'] for k in komponenten}
    for z in d05.tabelle('Kennung', 'Betriebswerkzeug')[0]['zeilen']:
        objekte.append({'kennung': z[0], 'art': 'W', 'n': z[1], 'ebene': 'BE', 'komponenten': [kmap.get(z[2].lower(), z[2])],
                        'zweck': '', 'fundstelle': z[3], 'profil': {'Fundstelle': z[3], 'Rolle': z[4]}, 'bezuege': []})

    # Routinen nach C05
    rprof = c05.profile(r'^(RT-\d-\d{2})\b')
    for z in c05.tabelle('Routine', 'Leitende Rolle')[0]['zeilen']:
        k, name = z[0].split(' ', 1)
        f = {n: R(c05, v) for n, v in rprof.get(k, {'felder': {}})['felder'].items()}
        o = {'kennung': k, 'art': 'RT', 'n': name, 'ebene': 'FU', 'stufe': int(z[2].split(' ')[0]),
             'zweck': z[5][0].upper() + z[5][1:], 'fundstelle': 'C05',
             'profil': {'Leitende Rolle': z[1], 'Takt': z[3], 'Dauer': z[4], **{x: f[x] for x in ('Teilnehmer', 'Inhalte', 'Kennzahlensatz', 'Board', 'Nachweis') if x in f}},
             'bezuege': []}
        for feld, art in (('Nachweis', 'Nachweis'), ('Kennzahlensatz', 'Kennzahl'), ('Inhalte', 'Verweis')):
            for x in kennungen(f.get(feld, '')):
                if not any(b['ziel'] == x for b in o['bezuege']):
                    o['bezuege'].append({'ziel': x, 'art': art})
        objekte.append(o)

    # Kennzahlen nach C04
    defs, einord = {}, {}
    for t in c04.tabelle('Kennung', 'Kennzahl', 'Definition'):
        for z in t['zeilen']:
            defs[z[0]] = z
    for t in c04.tabelle('Kennung', 'Kennzahl'):
        if t['kopf'][2] == 'Definition':
            continue
        for z in t['zeilen']:
            einord[z[0]] = dict(zip(t['kopf'], z))
    for k, z in defs.items():
        e = einord.get(k, {})
        bereich = e.get('Bereich', '')
        o = {'kennung': k, 'art': 'K', 'n': z[1], 'ebene': 'FU', 'kontext': int(k[1]), 'dimension': k[3],
             'pflichtkern': bereich.startswith('Pflichtkern'), 'zweck': z[2][0].upper() + z[2][1:], 'fundstelle': 'C04 Anhang ' + ('B' if k[1] == '4' else 'C'),
             'profil': {'Formel': z[3], 'Einheit': z[4], 'Quelle': z[5], **{x: e[x] for x in ('Bereich', 'Entscheidende Rolle', 'Zielrichtung', 'Prognosecharakter', 'Überwachung', 'Vergleichsbasis', 'Messrhythmus') if e.get(x)}},
             'bezuege': [{'ziel': x, 'art': 'Quelle'} for x in kennungen(z[5] + ' ' + z[2] + ' ' + z[3])]}
        objekte.append(o)

    # Prüfung
    fehler = []
    ids = [o['kennung'] for o in objekte]
    doppelt = sorted({x for x in ids if ids.count(x) > 1})
    if doppelt:
        fehler.append('Doppelte Kennungen: ' + ', '.join(doppelt))
    bekannt = set(ids)
    for o in objekte:
        for b in o['bezuege']:
            if b['ziel'] not in bekannt:
                fehler.append(f"{o['kennung']}: Bezug {b['ziel']} ohne Objekt")
    zaehl = {a: sum(1 for o in objekte if o['art'] == a) for a in ('P', 'M', 'D', 'W', 'RT', 'K')}
    soll = {'P': 10, 'M': 29, 'D': 57, 'W': 12, 'RT': 8, 'K': 36}  # D02-MET 1.1, D03-DOK 2.9, D05-WZ A.1, C04 Anhang C, C05 Kapitel 2
    for a, n in soll.items():
        if zaehl[a] != n:
            fehler.append(f'Objektart {a}: {zaehl[a]} statt {n} Objekte')
    for k in komponenten:
        for b in k.get('zufuehrend', []):
            if b not in namen_bs.values():
                fehler.append(f"Komponente {k['code']}: unbekannter Baustein {b}")

    # Kanon und Begleitdarstellungen nach A02 Kapitel 6
    kanon = [{'kennung': z[0], 'n': z[1], 'inhalt': R(a02, z[2]), 'gruppe': z[0][0]} for z in a02.tabelle('Kennung', 'Dokument')[0]['zeilen']]
    kataloge = {z[0]: z[1] for z in a02.tabelle('Kennung', 'Inhalt')[0]['zeilen']}
    kanon = [x for x in kanon if not x['kennung'].startswith('D01-GL bis')]
    for k, inhalt in kataloge.items():
        kanon.append({'kennung': k, 'n': inhalt.split(':')[0], 'inhalt': inhalt.split(':', 1)[1].strip() if ':' in inhalt else inhalt, 'gruppe': 'D'})
    for z in a02.tabelle('Kennung', 'Begleitdarstellung')[0]['zeilen']:
        kanon.append({'kennung': z[0], 'n': z[1], 'inhalt': z[2], 'gruppe': 'E'})
    kanon.append({'kennung': 'E09', 'n': 'Modellnavigator', 'gruppe': 'E', 'vorgemerkt': '7.6-04',
                  'inhalt': 'Interaktive Sicht auf Ebenen, Ordnung und Objekte, erzeugt aus den Katalogen. Nicht normativ. Aufnahme in A02 Kapitel 6.2 mit Fassung 7.6.'})

    daten = {
        'meta': {
            'titel': 'Leadec Logistics Betriebsmodell',
            'darstellung': 'E09 Modellnavigator',
            'fassung': KANON_FASSUNG,
            'erzeugt': datetime.date.today().strftime('%d.%m.%Y'),
            'erzeuger': ERZEUGER,
            'status': 'Begleitdarstellung, nicht normativ. Bei einer Abweichung gilt das führende Dokument.',
            'quellen': sorted(f"{d.kennung} ({d.datei})" for d in dokumente.values()),
            'pcfDatei': PCF_DATEI,
        },
        'perspektiven': PERSPEKTIVEN,
        'ebenen': ebenen,
        'bloecke': {'FU': BLOECKE_FU, 'AU': BLOECKE_AU},
        'grundsaetze': [{'n': z[0], 'text': z[1]} for z in a02.tabelle('Grundsatz', 'Inhalt')[0]['zeilen']],
        'wirkungskette': [R(a02, x) for x in a02.abschnitt('2.2 Wirkungskette')['absaetze']],
        'ausrichtung': [R(a02, x) for x in a02.abschnitt('3 Ausrichtung')['absaetze']],
        'beispiel': [{'teil': z[0], 'fundstelle': z[1], 'inhalt': R(a02, z[2])} for z in a02.tabelle('Teil', 'Fundstelle')[0]['zeilen']],
        'bewertung': a02.tabelle('Merkmal', 'Strukturbewertung')[0]['zeilen'],
        'objektarten': [{'code': c, 'n': z[0], 'leistung': z[1], 'ordnung': z[2], 'regelebene': z[3], 'ort': z[4], 'schema': schema[z[0]][1], 'beispiel': schema[z[0]][2]}
                        for c, z in zip(['P', 'D', 'M', 'W', 'RT', 'K'], a02.tabelle('Objektart', 'Leistung')[0]['zeilen'])],
        'abgrenzung': a02.tabelle('Merkmal', 'Dokument', 'Methode')[0],
        'felder': felder,
        'regeln': [regeln[k] for k in sorted(regeln)],
        'reihenfolge': reihenfolge,
        'mindestkriterien': mindestkriterien,
        'bausteine': bausteine,
        'bausteinZusatz': zusatz,
        'komponenten': komponenten,
        'stufen': stufen,
        'dimensionen': dimensionen,
        'kontexte': kontexte,
        'statusbewertung': (doc('B04').tabelle('Status', 'Bedingung')[0]['zeilen'] if 'B04' in dokumente else []),
        'objekte': objekte,
        'kanon': kanon,
        'einstieg': [{'rolle': z[0], 'einstieg': z[1]} for z in a02.tabelle('Rolle', 'Einstieg')[0]['zeilen']],
    }
    return daten, fehler, w, zaehl


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    ordner = sys.argv[1]
    ziel = pathlib.Path(sys.argv[2] if len(sys.argv) > 2 else 'bm-daten.js')
    daten, fehler, warnungen, zaehl = baue(lade_quellen(ordner))
    js = ('// Leadec Logistics Betriebsmodell – Datendatei des Modellnavigators E09\n'
          '// Erzeugt mit ' + ERZEUGER + ' aus dem Kanon ' + KANON_FASSUNG + '. Nicht von Hand bearbeiten.\n'
          'window.BM = ' + json.dumps(daten, ensure_ascii=False, indent=1) + ';\n')
    ziel.write_text(js, encoding='utf-8')
    print(f'Datendatei geschrieben: {ziel} ({len(js) // 1024} KB)')
    print('Objekte je Art: ' + ', '.join(f'{a} {n}' for a, n in zaehl.items()))
    for x in warnungen:
        print('Hinweis: ' + x)
    for x in fehler:
        print('Fehler: ' + x)
    print('Prüfung: ' + ('bestanden' if not fehler else f'{len(fehler)} Fehler'))
    return 1 if fehler else 0


if __name__ == '__main__':
    sys.exit(main())
