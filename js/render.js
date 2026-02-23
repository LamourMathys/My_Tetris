// Grab our canvas contexts
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const holdCanvas = document.getElementById('hold-canvas');
const holdCtx = holdCanvas.getContext('2d');

// Helper to draw a single square with a dark border
function drawCell(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  
  ctx.strokeStyle = '#333';
  ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// Draw the blocks that have already landed
function drawField() {
  // Only loop through the visible portion of the grid
  for (let y = ROWS - VISIBLE_ROWS; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      const cell = field[y][x];
      // Offset Y by the hidden rows so it draws properly on the canvas
      drawCell(x, y - (ROWS - VISIBLE_ROWS), cell ? cell : '#000'); 
    }
  }
}

// Renders the piece stashed in the hold box
function drawHold() {
  holdCtx.clearRect(0, 0, holdCanvas.width, holdCanvas.height);
  
  if (!holdPiece) return; // Nothing to draw

  // Math to center the piece inside the 4x4 hold grid
  const offsetX = (4 - holdPiece.shape[0].length) / 2;
  const offsetY = (4 - holdPiece.shape.length) / 2;

  holdPiece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        holdCtx.fillStyle = holdPiece.color;
        holdCtx.fillRect((x + offsetX) * CELL_SIZE, (y + offsetY) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        holdCtx.strokeStyle = '#333';
        holdCtx.strokeRect((x + offsetX) * CELL_SIZE, (y + offsetY) * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    });
  });
} 

// The master render function called every frame
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 1. Draw the background grid / solidified blocks
  drawField();

  // 2. Draw the currently falling piece
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        drawCell(piece.x + x, piece.y + y - (ROWS - VISIBLE_ROWS), piece.color);
      }
    });
  });
  
  // 3. Update the UI hold box
  drawHold();
}