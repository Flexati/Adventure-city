"""Bundle the current district prototype offline, without modifying original packs."""
from pathlib import Path
import base64,json,re
ROOT=Path(__file__).resolve().parents[1];game=ROOT/'game'
assets={}
for name in ['city','port','clinic','fracture','walk','enemies','car','combat']:
 assets[name+'.png']='data:image/png;base64,'+base64.b64encode((game/'art'/f'{name}.png').read_bytes()).decode()
for name in ['hub','boss','hit','zara','dodge','duo','choice']:
 assets[name+'.ogg']='data:audio/ogg;base64,'+base64.b64encode((game/'assets'/f'{name}.ogg').read_bytes()).decode()
engine=re.sub(r'\bexport ', '', (game/'campaign.mjs').read_text())
ui=re.sub(r'^import .*?;\n','',(game/'runtime.mjs').read_text(),flags=re.M)
ui=ui.replace('im.src=`art/${name}.png`','im.src=ASSETS[`${name}.png`]').replace('new Audio(`assets/${name}.ogg`)','new Audio(ASSETS[`${name}.ogg`])')
html=(game/'index.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>'+(game/'style.css').read_text()+'</style>')
html=html.replace('<script type="module" src="runtime.mjs"></script>','<script type="module">const ASSETS='+json.dumps(assets)+';\n'+engine+'\n'+ui+'</script>')
(ROOT/'preview.html').write_text(html);print('Offline bundle:',len(html),'characters')
