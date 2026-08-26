from pathlib import Path
from PIL import Image

source = Path('/home/ubuntu/webdev-static-assets/agilite-icon-refined.png')
project = Path('/home/ubuntu/agilite-collection-tracker/assets/images')
project.mkdir(parents=True, exist_ok=True)

with Image.open(source) as image:
    icon = image.convert('RGB').resize((1024, 1024), Image.Resampling.LANCZOS)
    icon = icon.quantize(colors=256, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
    for filename in (
        'icon.png',
        'splash-icon.png',
        'favicon.png',
        'android-icon-foreground.png',
    ):
        icon.save(project / filename, format='PNG', optimize=True, compress_level=9)
