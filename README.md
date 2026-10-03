# Interactive Memory Puzzle

This is a self-contained, click-through photo puzzle. The interface contains no visible captions or piece numbers.

## Animation sequence

1. The folded cocoa-felt puzzle mat unfolds.
2. Mom appears as the full original photograph, then morphs into puzzle piece 1 on the mat.
3. Dad morphs into piece 2.
4. The farm morphs into piece 3.
5. The tasting morphs into piece 4.
6. Friends morph into piece 5.
7. The championship morphs into piece 6.
8. Pieces 1 and 2 physically snap together, then their image changes to photo 7.
9. Piece 3 grows and its image changes to photo 8.
10. Piece 5 grows and its image changes to photo 9.
11. Piece 6 grows and changes shape while keeping photo 6.
12. Pieces 7, 8, 9, and 6 assemble around an empty center.
13. Piece 4 moves inward, changes to photo 10, and snaps into the center. The outside edges form a rectangle.
14. Photo 11 develops from the center outward while all five puzzle regions and their seams remain visible.

The circular arrow in the upper-right corner restarts the sequence.

## Open it in VS Code

1. Open the `memory-puzzle` folder in VS Code.
2. Open `index.html` in a browser.

No installation or build command is required. With the VS Code **Live Server** extension, right-click `index.html` and select **Open with Live Server**.

## Main files

- `index.html` contains the page structure and animation layers.
- `styles.css` controls the folded mat, puzzle surface, and responsive visual design.
- `script.js` controls the fourteen-stage animation and restart behavior.
- `assets/images/` contains `photo1.jpg` through `photo11.jpg`.

## Publish an update to GitHub

After replacing the files in your existing local repository, run:

```powershell
git add index.html styles.css script.js README.md
git commit -m "Refine puzzle mat and transitions"
git push
```
