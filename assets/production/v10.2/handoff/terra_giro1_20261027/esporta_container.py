"""Esporta i sei master nella sagoma richiesta con Pillow e numpy."""
from pathlib import Path
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parent
for path in sorted((root / 'master').glob('*_master.png')):
    name = path.name.removesuffix('_master.png')
    image = Image.open(path).convert('RGBA')
    pixels = np.array(image)
    pixels[pixels[:, :, 3] <= 24, 3] = 0
    image = Image.fromarray(pixels)
    box = image.getchannel('A').getbbox()
    sprite = image.crop(box).resize((96, 147), Image.Resampling.LANCZOS)
    canvas = Image.new('RGBA', (128, 192))
    canvas.paste(sprite, (16, 22))
    canvas.save(root / 'asset' / f'RACE_ashdocks_container_{name}.png')
