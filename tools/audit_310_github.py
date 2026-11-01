import subprocess, hashlib, json, csv, struct, sys, os
REPO='/home/user/Adventure-city'; S=sys.argv[1]
def git(*a, raw=False):
    r=subprocess.run(['git','-C',REPO,*a],capture_output=True,check=True); return r.stdout if raw else r.stdout.decode()
branches={'backup':'origin/backup/chronos-v10-2-recovery-20261031','delivery':'origin/delivery/gpt-preproduzione-310-20261029'}
idx=json.load(open(f'{S}/src/INDICE.json'))
expected=[]; owner={}
for p in idx['prompts']:
    for f in p['expected_files']: expected.append(f); owner[f]=p['asset_id']
man={r['path']:r for r in csv.DictReader(open(f'{S}/src/MANIFEST_310_EXPECTED_623.csv'))}
m296={r['canonical_path']:r for r in csv.DictReader(open(f'{S}/src/CHRONOS_V10_2_296_SHA256_MANIFEST_20261031.csv'))}
print('expected',len(expected),'unique',len(set(expected)),'manifest',len(man),'same set',set(expected)==set(man))
found={}
for name,b in branches.items():
    for line in git('ls-tree','-r','-l',b,'--','deliveries/gpt-preproduzione-310-20261029').splitlines():
        meta,path=line.split('\t',1)
        if not path.endswith('.png'): continue
        _,_,blob,size=meta.split()
        found.setdefault(path,{})[name]=blob
res=[]; cache={}
for path,bl in found.items():
    for name,blob in bl.items():
        if blob in cache: continue
        data=git('cat-file','blob',blob,raw=True)
        w=h=None; ok=data[:8]==b'\x89PNG\r\n\x1a\n'
        if ok: w,h=struct.unpack('>II',data[16:24])
        cache[blob]=dict(sha256=hashlib.sha256(data).hexdigest(),bytes=len(data),png=ok,w=w,h=h)
rows=[]
for f in expected:
    bl=found.get(f,{}); info=None; where=[]
    for name in ('backup','delivery'):
        if name in bl: where.append(name); info=info or cache[bl[name]]
    exp=m296.get(f); match=''
    if info and exp: match='SHA_MATCH' if exp['sha256']==info['sha256'] else 'SHA_DIFF'
    elif info: match='NOT_IN_296'
    rows.append(dict(asset_id=owner[f],path=f,on_github='YES' if info else 'NO',branches='+'.join(where),
        sha256=info['sha256'] if info else '',bytes=info['bytes'] if info else '',
        size=f"{info['w']}x{info['h']}" if info else '',png_valid=info['png'] if info else '',
        manifest296=match if info else ('IN_296_NOT_ON_GITHUB' if exp else ''),
        status091=man[f]['status']))
extra=[p for p in found if p not in owner]
json.dump(dict(rows=rows,extra=extra),open(f'{S}/audit.json','w'),indent=1)
from collections import Counter
print('on github',sum(r['on_github']=='YES' for r in rows)); print(Counter(r['manifest296'] for r in rows)); print(Counter(r['branches'] for r in rows))
print('invalid png',sum(1 for r in rows if r['png_valid'] is False)); print('extra',len(extra), extra[:10])
print(Counter(r['size'] for r in rows if r['size']))
