# Interactive Memory Puzzle

This is a self-contained, click-through photo puzzle. The interface contains no visible captions or piece numbers.

## Animation sequence

1. On the first click, the folded cocoa-felt puzzle mat unfolds; Mom then appears as the full original photograph and morphs into puzzle piece 1 on the mat.
2. Dad morphs into piece 2.
3. The farm morphs into piece 3.
4. The tasting morphs into piece 4.
5. Friends morph into piece 5.
6. The championship morphs into piece 6.
7. Pieces 1 and 2 physically snap together, then their image changes to photo 7.
8. Piece 3 grows and its image changes to photo 8.
9. Piece 5 grows and its image changes to photo 9.
10. Piece 6 grows and changes shape while keeping photo 6.
11. Pieces 7, 8, 9, and 6 assemble as four corner pieces around an empty circular center.
12. Piece 4 moves inward, changes to photo 10, and snaps into the center.
13. Photo 11 appears through a 15-second sequential 3D flip, inside one large puzzle-piece silhouette with all five internal seams preserved.

All pieces have layered cardboard edges and shadows, and every standard transition is one second longer than in the previous version.

The circular arrow in the upper-right corner restarts the sequence.

## Open it in VS Code

1. Open the `memory-puzzle` folder in VS Code.
2. Open `index.html` in a browser.

No installation or build command is required. With the VS Code **Live Server** extension, right-click `index.html` and select **Open with Live Server**.

## Main files

- `index.html` contains the page structure and animation layers.
- `styles.css` controls the folded mat, puzzle surface, and responsive visual design.
- `script.js` controls the thirteen-stage animation and restart behavior.
- `assets/images/` contains `photo1.jpg` through `photo11.jpg`.

## Publish an update to GitHub

After replacing the files in your existing local repository, run:

```powershell
git add index.html styles.css script.js README.md
git commit -m "Refine puzzle mat and transitions"
git push
```
