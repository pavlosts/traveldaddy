"""Remove dark plate backgrounds from clay lens JPGs → transparent PNGs.

Uses corner flood-fill so soft contact shadows stay on the subject while the
flat plate becomes alpha.
"""
from collections import deque
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "lens-icons"


def knock_out_plate(src: Path, dst: Path, tol: float = 28, feather: int = 2):
    im = Image.open(src).convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    h, w = arr.shape[:2]
    rgb = arr[:, :, :3]
    lum = rgb.mean(axis=2)

    # Sample plate color from corners
    samples = [
        lum[0:12, 0:12].mean(),
        lum[0:12, w - 12 : w].mean(),
        lum[h - 12 : h, 0:12].mean(),
        lum[h - 12 : h, w - 12 : w].mean(),
    ]
    plate = float(np.median(samples))

    # BFS flood-fill from edges through plate-similar pixels
    bg = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        q.append((0, x))
        q.append((h - 1, x))
    for y in range(h):
        q.append((y, 0))
        q.append((y, w - 1))

    while q:
        y, x = q.popleft()
        if y < 0 or y >= h or x < 0 or x >= w or bg[y, x]:
            continue
        if abs(float(lum[y, x]) - plate) > tol:
            continue
        bg[y, x] = True
        q.append((y - 1, x))
        q.append((y + 1, x))
        q.append((y, x - 1))
        q.append((y, x + 1))

    # Soften the mask edge
    alpha = np.where(bg, 0.0, 1.0).astype(np.float32)
    if feather > 0:
        # Cheap box blur on alpha for a couple passes
        for _ in range(feather):
            pad = np.pad(alpha, 1, mode="edge")
            alpha = (
                pad[0:-2, 0:-2]
                + pad[0:-2, 1:-1]
                + pad[0:-2, 2:]
                + pad[1:-1, 0:-2]
                + pad[1:-1, 1:-1]
                + pad[1:-1, 2:]
                + pad[2:, 0:-2]
                + pad[2:, 1:-1]
                + pad[2:, 2:]
            ) / 9.0

    arr[:, :, 3] = arr[:, :, 3] * alpha
    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA")
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst, optimize=True)
    pct = 100.0 * (alpha < 0.05).mean()
    print(
        f"wrote {dst.relative_to(ROOT.parent.parent)} "
        f"plate~{plate:.1f} transparent~{pct:.1f}%"
    )


def main():
    for src in sorted((ROOT / "clay").glob("*.jpg")):
        knock_out_plate(src, src.with_suffix(".png"))
    for src in sorted(ROOT.glob("*.jpg")):
        knock_out_plate(src, src.with_suffix(".png"))
    print("done")


if __name__ == "__main__":
    main()
