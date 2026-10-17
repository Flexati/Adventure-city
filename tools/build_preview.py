"""Create a portable directory preview with streamed assets, sharing Android packaging."""
from pathlib import Path
import shutil
from prepare_android_assets import prepare,DEST,ROOT
prepare()
output=ROOT/'dist/City_Adventure_Preview_v05'
if output.exists():shutil.rmtree(output)
shutil.copytree(DEST,output)
print('Serve this directory with a local HTTP server:',output)
