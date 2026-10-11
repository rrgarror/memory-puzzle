# Interactive Memory Puzzle

This is a self-contained, click-through photo puzzle. The interface contains no visible captions or piece numbers.

## Animation sequence

1. On the first click, a single medium-gray matte-felt puzzle mat (`rgb(105, 105, 105)`) unrolls from left to right; Mom then appears as the full original photograph and morphs into puzzle piece 1 on the mat.
2. Dad morphs into piece 2.
3. The farm morphs into piece 3.
4. The tasting morphs into piece 4.
5. Friends morph into piece 5.
6. The championship morphs into piece 6.
7. Pieces 1 and 2 physically snap together, then become photo 7 in the final upper-left piece shape.
8. Piece 3 grows into the final upper-right piece shape and changes to photo 8.
9. Piece 5 grows into the final lower-left piece shape and changes to photo 9.
10. Piece 6 becomes the final lower-right shape, then all four outer pieces assemble automatically during the same click.
11. Piece 4 moves inward, changes to photo 10, and settles into a flush interlocking center piece.
12. Over exactly 15 seconds, the five pieces flip one at a time to reveal photo 11, with the center flipping last and every puzzle seam remaining visible.

The five-piece layout has four surrounding pieces and a fitted center with top and bottom sockets plus side tabs. Its outside contour has puzzle tabs rather than a rectangular edge. The supplied single-piece photo is used as the material reference: the pieces have thick dark side walls, a rounded highlighted bevel, fine parallel surface ridges, and realistic shadows while keeping the memory photographs visible. Clicks 7 through 11 each run two seconds longer than in the previous version.

The circular arrow in the upper-right corner restarts the sequence. The adjacent corner-frame button enters or exits fullscreen; on browsers without the fullscreen API, it uses a full-window fallback.

## Open it in VS Code

1. Open the `memory-puzzle` folder in VS Code.
2. Open `index.html` in a browser.

No installation or build command is required. With the VS Code **Live Server** extension, right-click `index.html` and select **Open with Live Server**.

## Main files

- `index.html` contains the page structure and animation layers.
- `styles.css` controls the rolled medium-gray mat, realistic puzzle materials, and responsive visual design.
- `script.js` controls the twelve-stage animation, fullscreen control, and restart behavior.
- `assets/images/` contains `photo1.jpg` through `photo11.jpg`.

## Publish an update to GitHub

After replacing the files in your existing local repository, run:

```powershell
git add index.html styles.css script.js README.md
git commit -m "Refine puzzle mat and transitions"
git push
```
