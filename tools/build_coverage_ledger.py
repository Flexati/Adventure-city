#!/usr/bin/env python3
"""R19: builds docs/gold/COVERAGE_LEDGER.{json,md} from `git ls-files` and a raw `node --test` coverage report.
Usage: python3 tools/build_coverage_ledger.py docs/evidence/r19/coverage-raw.txt"""
import json,re,subprocess,sys
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
GAME={ # file: (purpose, risk class, risk level)
 'runtime.mjs':('Ciclo dei frame, disegno, tocco, tastiera, gamepad, schermate','input, rendering, salvataggi, acquisto','alto'),
 'campaign.mjs':('Simulazione del combattimento, nemici, Perfect Dodge','combattimento','alto'),
 'input-v9.mjs':('Joystick, mappature, lettura del gamepad','input','alto'),
 'progress-store.mjs':('Salvataggi e recupero','salvataggi','alto'),
 'missions.mjs':('Le 31 tappe di ogni rotta','campagna','alto'),
 'weapons-v9.mjs':('Armi, caricatori, ricompense','combattimento','alto'),
 'racing-v9.mjs':('Gare di Veyra: simulazione, strade, medaglie','gare','medio'),
 'veyra-v9.mjs':('Serie di gare e rivalità con Veyra','gare','medio'),
 'driving.mjs':('Missioni di guida della campagna','guida','medio'),
 'hubs.mjs':('Hub, incarichi, servizi','campagna','medio'),
 'interiors.mjs':('Interni in prima persona','rendering, testi','medio'),
 'narrative.mjs':('Stato narrativo, scelte, flag','salvataggi, storia','alto'),
 'story-v08.mjs':('Dialoghi e varianti','storia','medio'),
 'audio-engine.mjs':('Missaggio, musica in streaming, effetti','audio','medio'),
 'locale.mjs':('Lingua, traduzione a vista','testi','medio'),
 'chrono-art.mjs':('Atlanti e animazioni dei personaggi e dei nemici','rendering','medio'),
 'chrono-manifest.mjs':('Manifesto degli atlanti (dati)','rendering','basso'),
 'visuals.mjs':('Fotogrammi di eroi, auto, effetti','rendering','medio'),
 'village-art.mjs':('Disegno dei villaggi e della loro vita','rendering','basso'),
 'villages.mjs':('Dati dei villaggi','rendering','basso'),
 'layouts.mjs':('Mappe, muri, percorsi','combattimento, collisioni','alto'),
 'scenery.mjs':('Scenografia dipinta a runtime','rendering','basso'),
 'traversal.mjs':('Attraversamento e punti di passaggio','collisioni','medio'),
 'hud.mjs':('Calcoli dell\'HUD','rendering','medio'),
 'sheet-layout.mjs':('Geometria dei fogli sprite','rendering','basso'),
 'stability.mjs':('Protezione del ciclo dei frame','stabilità','alto'),
 'runtime-en.mjs':('Testi inglesi dell\'interfaccia','testi','basso'),'world-en.mjs':('Testi inglesi del mondo','testi','basso'),
 'interiors-en.mjs':('Testi inglesi degli interni','testi','basso'),'story-en.mjs':('Testi inglesi della storia','testi','basso'),
 'index.html':('Pagina e pannelli del gioco','rendering, input','medio'),'style.css':('Stile e impaginazione','rendering','medio'),
 'android_bootstrap.js':('Avvio dentro il WebView','build, input','alto'),
 'v9-combat-lab.mjs':('Laboratorio di combattimento (non entra nell\'APK)','strumento','basso'),'v9-race-lab.mjs':('Laboratorio gare (non entra nell\'APK)','strumento','basso'),
 'v9-combat-lab.html':('Pagina del laboratorio di combattimento','strumento','basso'),'v9-race-lab.html':('Pagina del laboratorio gare','strumento','basso'),
 'v9-race-lab.css':('Stile del laboratorio gare','strumento','basso'),'chrono-lab.html':('Laboratorio degli atlanti','strumento','basso'),
}
def first_comment(text):
    for line in text.split('\n')[:12]:
        m=re.match(r'\s*(?://|#(?!!)|/\*\*?|\*|""")\s*(.{12,})',line)
        if m: return m.group(1).strip(' */"')[:150]
    m=re.search(r"test\('([^']{8,})'",text)
    return m.group(1)[:150] if m else ''
def main(raw):
    files=subprocess.run(['git','ls-files','game','android','tools','tests','server.js'],cwd=ROOT,capture_output=True,text=True,check=True).stdout.split()
    files=[f for f in files if not re.match(r'game/(art|audio|video)/',f)]
    head=subprocess.run(['git','rev-parse','--short','HEAD'],cwd=ROOT,capture_output=True,text=True).stdout.strip()
    cov={};stack=[]
    for line in Path(raw).read_text().split('\n'):
        m=re.match(r'# ( *)(\S+)\s+\|\s+([\d.]*)\s+\|\s+([\d.]*)\s+\|\s+([\d.]*)\s+\|\s*(.*)$',line)
        if not m or m.group(2) in ('file','all'): continue
        depth,name,l,b,fn,unc=m.groups();stack=stack[:len(depth)]
        if not l: stack.append(name);continue
        cov['/'.join(stack+[name])]={'line':float(l),'branch':float(b),'funcs':float(fn),'uncovered':unc.strip()}
    texts={f:(ROOT/f).read_text(errors='replace') for f in files if not f.endswith(('.png','.jpg','.webp','.ogg','.jar','.keystore'))}
    checkers={f:t for f,t in texts.items() if f.startswith('tests/') or re.match(r'tools/verify_',f)}
    rows=[]
    for f in files:
        base=f.split('/')[-1];text=texts.get(f,'')
        if f.startswith('game/'): purpose,risk,level=GAME.get(base,(first_comment(text),'—','basso'))
        elif f.startswith('android/'): purpose,risk,level=(first_comment(text) or 'App Android (WebView, risorse, manifest)','build, sicurezza','alto' if f.endswith(('.java','.xml')) else 'basso')
        elif f.startswith('tests/'): purpose,risk,level=(first_comment(text),'test','—')
        elif re.match(r'tools/(build_apk|build_aab|build_play_aab|prepare_android|generate_play)',f): purpose,risk,level=(first_comment(text),'build, firma','alto')
        elif re.match(r'tools/verify_',f): purpose,risk,level=(first_comment(text),'verificatore browser','—')
        else: purpose,risk,level=(first_comment(text),'strumento' if f.startswith('tools/') else 'server locale','basso' if f.startswith('tools/') else 'medio')
        owners=sorted(c for c,t in checkers.items() if c!=f and base in t)
        c=cov.get(f)
        if f.startswith('tests/') or re.match(r'tools/verify_',f): status='è una prova'
        elif c: status='misurata'
        elif owners: status='solo riferimenti'
        else: status='nessuna prova'
        rows.append({'file':f,'purpose':purpose,'risk':risk,'level':level,'owners':owners,'coverage':c,'status':status,'verified_at':head})
    out={'schema':1,'commit':head,'source':raw,'files':len(rows),'rows':rows}
    (ROOT/'docs/gold/COVERAGE_LEDGER.json').write_text(json.dumps(out,ensure_ascii=False,indent=1)+'\n')
    md=['# Registro di copertura R19','',f'Generato da `tools/build_coverage_ledger.py` sul commit `{head}`, dal rapporto `{raw}`.',
        'La copertura è **[MISURATO]** da `node --test --experimental-test-coverage`: conta le righe eseguite dai test di Node.',
        'I file che girano solo nel browser non compaiono in quel rapporto: per loro valgono i verificatori `tools/verify_*.cjs`.',
        '«Solo riferimenti» vuol dire che un test o un verificatore nomina il file, non che ogni riga sia provata.','',
        f'File censiti: **{len(rows)}**.','']
    for title,pred in (('Gioco','game/'),('Android','android/'),('Server','server.js'),('Strumenti','tools/'),('Test','tests/')):
        part=[r for r in rows if r['file'].startswith(pred)]
        md+=['## '+title+f' ({len(part)})','','| File | Scopo | Rischio | Livello | Righe % | Rami % | Funzioni % | Prove | Stato |','|---|---|---|---|---|---|---|---|---|']
        for r in part:
            c=r['coverage'] or {};own=len(r['owners']);names=', '.join(o.split('/')[-1] for o in r['owners'][:3])+(f' (+{own-3})' if own>3 else '')
            md.append(f"| `{r['file']}` | {r['purpose'].replace('|','/')} | {r['risk']} | {r['level']} | {c.get('line','—')} | {c.get('branch','—')} | {c.get('funcs','—')} | {names or '—'} | {r['status']} |")
        md.append('')
    gaps=[r for r in rows if r['status'] in ('nessuna prova','solo riferimenti') and r['level'] in ('alto','medio')]
    md+=['## Zone a rischio medio o alto senza copertura misurata','','| File | Livello | Stato | Prove che lo nominano |','|---|---|---|---|']
    md+=[f"| `{r['file']}` | {r['level']} | {r['status']} | {len(r['owners'])} |" for r in gaps]+['']
    (ROOT/'docs/gold/COVERAGE_LEDGER.md').write_text('\n'.join(md))
    print(len(rows),'file;',sum(1 for r in rows if r['status']=='misurata'),'misurati;',len(gaps),'zone da coprire')
    for r in gaps: print(' ',r['file'],r['status'],len(r['owners']))
main(sys.argv[1])
