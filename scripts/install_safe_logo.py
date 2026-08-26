from pathlib import Path
from PIL import Image

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = Path("/home/ubuntu/webdev-static-assets/agilite-icon-safe.png")
OUTPUTS = [
    PROJECT / "assets/images/icon.png",
    PROJECT / "assets/images/header-logo.png",
    PROJECT / "assets/images/splash-icon.png",
    PROJECT / "assets/images/favicon.png",
    PROJECT / "assets/images/android-icon-foreground.png",
]

canvas_size = 1024
background = (27, 38, 29)
source = Image.open(SOURCE).convert("RGB")
# The generated source is already a square, safe-area composition.
# Resizing the full source preserves the complete mark and its intentional margin.
canvas = source.resize((canvas_size, canvas_size), Image.Resampling.LANCZOS)

for output in OUTPUTS:
    output.parent.mkdir(parents=True, exist_ok=True)
    image = canvas.resize((1024, 1024), Image.Resampling.LANCZOS)
    if output.name == "favicon.png":
        image = image.resize((512, 512), Image.Resampling.LANCZOS)
    image.save(output, format="PNG", optimize=True, compress_level=9)

print("Installed centered safe-area logo assets:")
for output in OUTPUTS:
    print(f"- {output} ({output.stat().st_size} bytes)")
print(f"- source canvas: {source.size}; artwork canvas: {canvas.size}")
print("- launcher label target: Agilite Tracker")
