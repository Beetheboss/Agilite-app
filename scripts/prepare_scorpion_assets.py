from pathlib import Path
from PIL import Image

source = Image.open('/home/ubuntu/webdev-static-assets/agilite-supplied-scorpion-icon.png').convert('RGB')
assets = Path('/home/ubuntu/agilite-collection-tracker/assets/images')

# Android adaptive icons crop the outer edges, so keep the full supplied mark
# inside a conservative safe area on a black square canvas.
launcher = Image.new('RGB', (1024, 1024), (0, 0, 0))
mark = source.copy()
mark.thumbnail((720, 720), Image.Resampling.LANCZOS)
launcher.paste(mark, ((1024 - mark.width) // 2, (1024 - mark.height) // 2))

for name in [
    'icon.png',
    'splash-icon.png',
    'favicon.png',
    'android-icon-foreground.png',
    'android-icon-monochrome.png',
    'android-icon-background.png',
]:
    launcher.save(assets / name, format='PNG', optimize=True, compress_level=9)

# The in-app header can use the larger original composition without adaptive masking.
header = source.copy()
header.thumbnail((640, 640), Image.Resampling.LANCZOS)
header.save(assets / 'header-logo.png', format='PNG', optimize=True, compress_level=9)

for path in [assets / name for name in [
    'icon.png', 'splash-icon.png', 'favicon.png',
    'android-icon-foreground.png', 'android-icon-monochrome.png',
    'android-icon-background.png', 'header-logo.png'
]]:
    print(path.name, path.stat().st_size)
