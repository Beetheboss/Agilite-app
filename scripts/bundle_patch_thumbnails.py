import json
from pathlib import Path
from PIL import Image, ImageOps

LEDGER = Path('/home/ubuntu/agilite_research/patch_image_ledger.json')
OUT = Path('/home/ubuntu/agilite-collection-tracker/assets/catalog-images')
MAP = Path('/home/ubuntu/agilite-collection-tracker/lib/catalog-images.ts')
OUT.mkdir(parents=True, exist_ok=True)
ledger = json.loads(LEDGER.read_text())
entries = []

for record_id, item in ledger.items():
    if not item.get('images'):
        continue
    source = Path(item['images'][0]['local_path'])
    if not source.exists():
        continue
    target = OUT / f'thumb-{record_id}.jpg'
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert('RGB')
        image.thumbnail((512, 512), Image.Resampling.LANCZOS)
        canvas = Image.new('RGB', (512, 512), '#F1F0EC')
        x = (512 - image.width) // 2
        y = (512 - image.height) // 2
        canvas.paste(image, (x, y))
        canvas.save(target, 'JPEG', quality=82, optimize=True, progressive=True)
    entries.append((record_id, target.name))

entries.sort(key=lambda value: int(value[0]))
lines = [
    'import type { ImageSourcePropType } from "react-native";',
    '',
    'export const catalogImageSources: Record<string, ImageSourcePropType> = {',
]
for record_id, filename in entries:
    lines.append(f'  "{record_id}": require("../assets/catalog-images/{filename}"),')
lines.extend(['};', ''])
MAP.write_text('\n'.join(lines))
print(f'Bundled {len(entries)} patch thumbnails')
print(f'Wrote {MAP}')
print(f'Total bytes: {sum((OUT / filename).stat().st_size for _, filename in entries)}')
