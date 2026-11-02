# Interactive Memory Puzzle

This is a self-contained, click-through photo puzzle. The interface contains no visible captions or piece numbers.

## Animation sequence

1. On the first click, a single medium-gray matte-felt puzzle mat (`rgb(105, 105, 105)`) unrolls from left to right; Mom then appears as the full original photograph and morphs into puzzle piece 1 on the mat. The placement portion is one second faster than in the previous version.
2. Dad morphs into piece 2.
3. The farm morphs into piece 3.
4. The tasting morphs into piece 4.
5. Friends morph into piece 5.
6. The championship morphs into piece 6 through one continuously cropped image, without a second overlapping copy.
7. Pieces 1 and 2 physically snap together, then continuously morph into photo 7 in the final upper-left piece shape without overlapping source and destination pieces. This stage is two seconds shorter than in the previous version.
8. Piece 3 morphs and grows into the final upper-right piece shape while changing to photo 8, using a single visible piece throughout. This stage is one second shorter.
9. Piece 5 morphs and grows into the final lower-left piece shape while changing to photo 9. This stage is also one second shorter.
10. Piece 6 morphs into the final lower-right shape, then all four outer pieces assemble automatically during the same click. This click is one second faster than in the previous version.
11. The original rectangular photo 10 appears above all the pieces while the mat disappears. It then morphs into the center-piece contour, moves into the middle, and becomes flat once seated. Pieces 6 and 7 also flatten during this same click.
12. All five pieces flip simultaneously over exactly three seconds to reveal photo 11, with every puzzle seam remaining visible.

Every loose piece and the completed five-piece board is 20% larger than in the earlier version. The layout has four surrounding pieces and a fitted center with top and bottom sockets plus side tabs. Its outside contour has puzzle tabs rather than a rectangular edge. The supplied single-piece photo is used as the material reference: the outer pieces have thick dark side walls, a rounded highlighted bevel, fine parallel surface ridges, and realistic shadows while keeping the memory photographs visible. Photo 10 becomes a flat center piece after it is placed.

The circular arrow in the upper-right corner restarts the sequence. The adjacent corner-frame button enters or exits fullscreen; on browsers without the fullscreen API, it uses a full-window fallback.

## Open it in VS Code

1. Open the `memory-puzzle` folder in VS Code.
2. Open `index.html` in a browser.

No installation or build command is required. With the VS Code **Live Server** extension, right-click `index.html` and select **Open with Live Server**.

## Main files

- `index.html` contains the page structure and animation layers.
- `styles.css` controls the rolled medium-gray mat, realistic puzzle materials, and responsive visual design.
- `script.js` controls the twelve-stage animation, fullscreen control, and restart behavior.
- `assets/images/` contains `photo1.jpg` through `photo10.jpg`, plus `photo11.JPG`.

## Publish an update to GitHub

After replacing the files in your existing local repository, run:

```powershell
git add -A
git commit -m "Update puzzle timing and final transitions"
git push
```

The code uses the existing filename `photo11.JPG`, including its uppercase extension.
