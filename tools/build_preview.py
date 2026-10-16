"""Build one offline HTML file from the verified prepared assets; original ZIPs stay intact."""
from pathlib import Path
import base64,re
ROOT=Path(__file__).resolve().parents[1]
game=ROOT/'game'
engine=re.sub(r'\bexport ', '', (game/'engine.mjs').read_text())
story=re.sub(r'\bexport ', '', (game/'story.mjs').read_text())
ui=(game/'game.mjs').read_text()
ui=re.sub(r'^import .*?;\n','',ui,flags=re.M)
ui=ui.replace("const {choose}=await import('./engine.mjs');",'')
assets={}
for p in [*(game/'assets').iterdir(),*(game/'art').iterdir()]:
 if p.suffix not in ['.png','.ogg']:continue
 mime='image/png' if p.suffix=='.png' else 'audio/ogg'
 assets[p.name]=f'data:{mime};base64,'+base64.b64encode(p.read_bytes()).decode()
import json
ui=ui.replace('new Audio(`assets/${name}.ogg`)','new Audio(ASSETS[`${name}.ogg`])')
ui=ui.replace("heroes.src='assets/heroes.png'","heroes.src=ASSETS['heroes.png']").replace("bosses.src='assets/bosses.png'","bosses.src=ASSETS['bosses.png']")
ui=ui.replace("combat.src='art/combat.png'","combat.src=ASSETS['combat.png']")
html=(game/'index.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style>'+(game/'style.css').read_text()+'</style>')
script='const ASSETS='+json.dumps(assets)+';\n'+engine+'\n'+story+'\n'+ui
html=html.replace('<script type="module" src="game.mjs"></script>','<script type="module">'+script+'</script>')
out=ROOT/'preview.html';out.write_text(html);print(f'{out}: {out.stat().st_size} bytes')
