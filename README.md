# Interactive Memory Puzzle

This is a self-contained, click-through photo puzzle. Each click or tap advances one stage:

1. Mom appears as a full photograph, then becomes puzzle piece 1.
2. Dad becomes piece 2.
3. The farm becomes piece 3.
4. The tasting becomes piece 4.
5. Friends become piece 5.
6. The championship becomes piece 6.
7. Pieces 1 and 2 join and become piece 7.
8. Piece 3 grows and becomes piece 8.
9. Piece 5 grows and becomes piece 9.
10. Piece 6 triggers the assembly of every piece except piece 4.
11. Piece 4 becomes piece 10 and moves into the open center position, completing a rectangle with straight outside edges.
12. All six puzzle regions flip to reveal photo 11. The jigsaw seams remain visible.

The interface contains no visible captions or piece numbers. The circular arrow in the upper-right corner restarts the sequence.

## Open it in VS Code

1. Open the `memory-puzzle` folder in VS Code.
2. Open `index.html` in a browser.

No installation or build command is required. With the VS Code **Live Server** extension, right-click `index.html` and select **Open with Live Server**.

## Photo files

The project uses `assets/images/photo1.jpg` through `photo11.jpg`. Keep those filenames when replacing images.

## Main files

- `index.html` contains the puzzle geometry and page structure.
- `styles.css` controls the widescreen layout and visual design.
- `script.js` controls the twelve-stage animation and restart behavior.
- `assets/images/` contains the eleven photographs.
