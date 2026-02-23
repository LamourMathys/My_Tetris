// Game board dimensions
const COLS = 10;
const ROWS = 40;
const VISIBLE_ROWS = 20;
const CELL_SIZE = 24;

// Initialize an empty 2D array for the playfield
const field = Array.from({ length: ROWS }, () => Array(COLS).fill(null));

// Picks a random Tetromino and spawns it
function createPiece() {
  const pieces = [
    { shape: [[1,1],[1,1]], color: 'yellow' },       // O piece
    { shape: [[0,1,0],[1,1,1]], color: 'purple' },   // T piece
    { shape: [[1,1,0],[0,1,1]], color: 'green' },    // S piece
    { shape: [[0,1,1],[1,1,0]], color: 'red' },      // Z piece
    { shape: [[1,0,0],[1,1,1]], color: 'blue' },     // J piece
    { shape: [[0,0,1],[1,1,1]], color: 'orange' },   // L piece
    { shape: [[1,1,1,1]], color: 'cyan' },           // I piece (line)
   
    /* A huge Creeper shape as an easter egg 
    { shape: [[1,1,0,0,1,1],
              [1,1,0,0,1,1],
              [0,0,1,1,0,0],
              [0,1,1,1,1,0],
              [0,1,1,1,1,0],
              [0,1,0,0,1,0]], color: 'black' }, */ 
  ];       
  
  const index = Math.floor(Math.random() * pieces.length);
  const p = pieces[index];
  
  return {
    x: 3, 
    y: ROWS - VISIBLE_ROWS - p.shape.length, // Spawn just above the visible screen
    shape: p.shape,
    color: p.color,
  };
}

// Global state for pieces
let piece = createPiece();
let holdPiece = null;
let holdUsed = false; 
let score = 0;


function hasCollision(dx = 0, dy = 0, testShape = piece.shape) {
  for (let y = 0; y < testShape.length; y++) {
    for (let x = 0; x < testShape[y].length; x++) {
      // Skip empty parts of the block matrix
      if (!testShape[y][x]) continue;

      const nx = piece.x + x + dx;
      const ny = piece.y + y + dy;

      // Out of bounds checks (walls and floor)
      if (nx < 0 || nx >= COLS) return true;
      if (ny >= ROWS) return true;
      // Hit an existing block on the field
      if (ny >= 0 && field[ny][nx] !== null) return true;
    }
  }
  return false;
}
  
// Solidify the piece onto the grid once it lands
function lockPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) field[piece.y + y][piece.x + x] = piece.color;
    });
  });
}

//mathematically rotate a 2D array 90 degrees clockwise
function rotateMatrix(matrix) {
  const result = [];
  for (let x = 0; x < matrix[0].length; x++) {
    const row = [];
    for (let y = matrix.length - 1; y >= 0; y--) {
      row.push(matrix[y][x]);
    }
    result.push(row);
  }
  return result;
}

// Applies rotation if it doesn't cause a collision
function rotatePiece() {
  const rotated = rotateMatrix(piece.shape);
  if (!hasCollision(0, 0, rotated)) {
    piece.shape = rotated;
  }
}

// Checks for completed rows, clears them, and shifts everything down
function Cline() {
  for (let y = ROWS - 1; y >= 0; y--) {
    // If there's no 'null' left in the row, it's a full line!
    if (!field[y].includes(null)) {
      field.splice(y, 1);
      field.unshift(new Array(COLS).fill(null)); 
      y++; 
      
      score += 10;
      document.getElementById('score').innerText = score;
    }
  }
} 

// Swaps current piece with the stash
function holdCurrentPiece() {
  if (holdUsed) return; // Can only hold once per drop
  
  if (holdPiece === null) {
    holdPiece = piece;
    piece = createPiece(); // First time holding, grab a fresh piece
  } else {
    // Swap
    const temp = piece;
    piece = holdPiece;
    holdPiece = temp;
  }
  
  // Reset coordinates for the newly spawned/swapped piece
  piece.x = 3;
  piece.y = ROWS - VISIBLE_ROWS - piece.shape.length;
  holdUsed = true;
}