from pathlib import Path
from PIL import Image

PROJECT = Path(__file__).resolve().parents[1]
SOURCE = Path("/home/ubuntu/webdev-static-assets/agilite-icon-safe.png")
OUTPUTS = {
    "icon": PROJECT / "assets/images/icon.png",
    "header": PROJECT / "assets/images/header-logo.png",
    "splash": PROJECT / "assets/images/splash-icon.png",
    "favicon": PROJECT / "assets/images/favicon.png",
    "adaptive": PROJECT / "assets/images/android-icon-foreground.png",
}

canvas_size = 1024
background = (27, 38, 29)
source = Image.open(SOURCE).convert("RGB")
full_canvas = source.resize((canvas_size, canvas_size), Image.Resampling.LANCZOS)

# The adaptive-icon mask is more aggressive than the normal launcher canvas.
# Keep the same dark field, but scale the complete mark down inside it so no
# scorpion limb reaches the Android circular/squircle mask.
adaptive_canvas = Image.new("RGB", (canvas_size, canvas_size), background)
adaptive_art = source.resize((760, 760), Image.Resampling.LANCZOS)
adaptive_canvas.paste(adaptive_art, ((canvas_size - adaptive_art.width) // 2, (canvas_size - adaptive_art.height) // 2))

# The in-app header can use more of the safe canvas while retaining the entire mark.
header_crop = source.crop((120, 100, 1800, 1800)).resize((canvas_size, canvas_size), Image.Resampling.LANCZOS)

images = {
    OUTPUTS["icon"]: full_canvas,
    OUTPUTS["header"]: header_crop,
    OUTPUTS["splash"]: full_canvas,
    OUTPUTS["favicon"]: full_canvas.resize((512, 512), Image.Resampling.LANCZOS),
    OUTPUTS["adaptive"]: adaptive_canvas,
}

for output, image in images.items():
    output.parent.mkdir(parents=True, exist_ok=True)
    image.save(output, format="PNG", optimize=True)

print("Installed role-specific safe-area logo assets:")
for output in images:
    print(f"- {output} ({output.stat().st_size} bytes)")
print(f"- source canvas: {source.size}; launcher canvas: {full_canvas.size}; adaptive canvas: {adaptive_canvas.size}")
print("- launcher label target: Agilite Tracker")
