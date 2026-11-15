"""Create a portable directory preview with streamed assets, sharing Android packaging."""
from pathlib import Path
import shutil,re
from prepare_android_assets import prepare,DEST,ROOT
prepare()
output=ROOT/'dist/Chronos_Adventure_Preview'
if output.exists():shutil.rmtree(output)
shutil.copytree(DEST,output)
# Development arena is browser-only until G0 native validation passes.
# Copy its local module graph; the campaign keeps using the tested classic bundle.
seen=set()
def copy_module(name):
    if name in seen:return
    seen.add(name)
    source=ROOT/'game'/name
    shutil.copyfile(source,output/name)
    for dep in re.findall(r"from ['\"]\./([^'\"]+)['\"]",source.read_text()):
        copy_module(dep)
copy_module('v9-combat-lab.mjs')
copy_module('v9-race-lab.mjs')
for name in ('v9-race-lab.html','v9-race-lab.css'):
    shutil.copyfile(ROOT/'game'/name,output/name)
shutil.copyfile(ROOT/'game/v9-combat-lab.html',output/'v9-combat-lab.html')
(output/'README.txt').write_text("Chronos Adventure — development preview\nRun: python3 -m http.server 8080\nCampaign: http://localhost:8080/\nV9 weapons training: http://localhost:8080/v9-combat-lab.html\nThe arena uses its own save slot. Racing preview: http://localhost:8080/v9-race-lab.html\nFull V9 campaign and commercial release are not complete.\n",encoding='utf-8')
shutil.make_archive(str(output),'zip',root_dir=output)
print('Serve this directory with a local HTTP server:',output)
