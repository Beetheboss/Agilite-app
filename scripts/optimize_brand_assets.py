from pathlib import Path
from PIL import Image

base = Path('/home/ubuntu/agilite-collection-tracker/assets/images')
for name in ['icon.png', 'splash-icon.png', 'favicon.png', 'android-icon-foreground.png', 'android-icon-monochrome.png', 'android-icon-background.png']:
    path = base / name
    image = Image.open(path).convert('RGB')
    image.thumbnail((900, 900), Image.Resampling.LANCZOS)
    image.save(path, format='PNG', optimize=True, compress_level=9)
    print(name, path.stat().st_size)
