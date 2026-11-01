import json, csv, os, shutil, subprocess, collections, zipfile, hashlib, sys
S=sys.argv[1]; REPO='/home/user/Adventure-city'; B='origin/backup/chronos-v10-2-recovery-20261031'
OUT=f'{S}/CHRONOS_MANUS_RIMANENTI_20261101'; shutil.rmtree(OUT,ignore_errors=True)
for d in ('prompt','riferimenti'): os.makedirs(f'{OUT}/{d}')
idx=json.load(open(f'{S}/src/INDICE.json')); rows={r['path']:r for r in json.load(open(f'{S}/audit.json'))['rows']}
WAVE={'character':1,'enemy':2,'boss':3,'ability':4,'region':5}
WNAME={0:'0 · recupero dagli ZIP (non rigenerare)',1:'1 · personaggi',2:'2 · nemici',3:'3 · boss',4:'4 · abilità',5:'5 · regioni'}
team=[]; todo=[]; zipfix=[]; refs=set(); stat=collections.Counter(); promptstat=[]
for p in idx['prompts']:
    fam=p['asset_id'].split('.')[0]; ex=p['expected_files']
    gh=[f for f in ex if rows[f]['on_github']=='YES']; inzip=[f for f in ex if rows[f]['manifest296']=='IN_296_NOT_ON_GITHUB']
    gen=[f for f in ex if f not in gh and f not in inzip]
    st='COMPLETE' if len(gh)==len(ex) else ('MISSING' if not gh else 'PARTIAL')
    promptstat.append(dict(n=p['number'],asset_id=p['asset_id'],famiglia=fam,png_previsti=len(ex),su_github=len(gh),nei_zip_non_su_github=len(inzip),da_generare=len(gen),stato_produzione=st,stato_qa='QA_PENDING' if gh else '',file_su_github=';'.join(os.path.basename(f) for f in gh)))
    for f in inzip: zipfix.append((p,f))
    if gen and p['production']!='GPT_IMAGE':
        team.append((p,gen)); continue
    if gen:
        todo.append((p,gen,gh,inzip)); refs.update(p['attachments'])
        src=f"{S}/src/z/{p['path']}"; shutil.copy(src,f"{OUT}/prompt/{p['number']:03d}_{p['asset_id']}.md")
# riferimenti
for r in sorted(refs):
    data=subprocess.run(['git','-C',REPO,'show',f'{B}:deliveries/gpt-preproduzione-310-20261029/checkpoint_091/source_310/riferimenti/{r}'],capture_output=True,check=True).stdout
    open(f'{OUT}/riferimenti/{r}','wb').write(data)
# CSV per file
with open(f'{OUT}/ELENCO_FILE_DA_FARE.csv','w',newline='') as fh:
    w=csv.writer(fh); w.writerow(['ondata','n_prompt','asset_id','famiglia','file_da_consegnare','cartella_consegna','azione','allegati_riferimento','file_prompt'])
    for p,f in zipfix:
        w.writerow([0,p['number'],p['asset_id'],p['asset_id'].split('.')[0],os.path.basename(f),os.path.dirname(f)+'/','RECUPERA_DA_ZIP_296 (esiste già, non rigenerare)',' '.join(p['attachments']),''])
    for p,gen,gh,inzip in todo:
        fam=p['asset_id'].split('.')[0]
        for f in gen:
            w.writerow([WAVE[fam],p['number'],p['asset_id'],fam,os.path.basename(f),os.path.dirname(f)+'/','GENERA_CON_MANUS',' '.join(p['attachments']),f"prompt/{p['number']:03d}_{p['asset_id']}.md"])
            stat[(WAVE[fam],fam)]+=1
    for p,gen in team:
        for f in gen: w.writerow(['T',p['number'],p['asset_id'],'character',os.path.basename(f),os.path.dirname(f)+'/','NON_A_MANUS: composizione dagli sheet reali V8 (regola autore)',' '.join(p['attachments']),''])
with open(f'{OUT}/STATO_310_PROMPT.csv','w',newline='') as fh:
    w=csv.DictWriter(fh,fieldnames=list(promptstat[0])); w.writeheader(); w.writerows(promptstat)
with open(f'{OUT}/STATO_623_PNG_VERIFICATO.csv','w',newline='') as fh:
    k=['asset_id','path','on_github','branches','sha256','bytes','size','png_valid','manifest296','status091']
    w=csv.DictWriter(fh,fieldnames=k); w.writeheader(); [w.writerow({x:r[x] for x in k}) for r in rows.values()]
# prompt unico, ordinato per ondata
todo.sort(key=lambda t:(WAVE[t[0]['asset_id'].split('.')[0]],t[0]['number']))
with open(f'{OUT}/TUTTI_I_PROMPT_DA_FARE.md','w') as fh:
    fh.write(f'# CHRONOS V10.2 — prompt ancora da generare ({len(todo)} prompt, {sum(stat.values())} PNG)\n\nOrdine per ondata. Testo dei prompt identico all\'originale del checkpoint 083.\n\n')
    cur=None
    for p,gen,gh,inzip in todo:
        wv=WAVE[p['asset_id'].split('.')[0]]
        if wv!=cur: fh.write(f'\n\n# ONDATA {WNAME[wv]}\n\n'); cur=wv
        fh.write(f"\n\n## ▶ {p['number']:03d} · {p['asset_id']} — da generare: {', '.join(os.path.basename(f) for f in gen)}\n")
        if gh: fh.write(f"Già su GitHub (non rifare): {', '.join(os.path.basename(f) for f in gh)}\n")
        if inzip: fh.write(f"Già negli ZIP del recupero (non rifare): {', '.join(os.path.basename(f) for f in inzip)}\n")
        fh.write('\n'+open(f"{S}/src/z/{p['path']}").read())
json.dump(dict(prompts_todo=len(todo),png_todo=sum(stat.values()),zip_recover=len(zipfix),team=[p['asset_id'] for p,g in team],team_png=sum(len(g) for p,g in team),by_wave={f'{k[0]}:{k[1]}':v for k,v in sorted(stat.items())},refs=sorted(refs),
  prompt_states=collections.Counter(x['stato_produzione'] for x in promptstat)),open(f'{S}/build_stats.json','w'),indent=1)
print(open(f'{S}/build_stats.json').read())
