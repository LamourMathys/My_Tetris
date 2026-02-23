const DROP_INTERVAL = 400; // How fast the piece falls  (ms)

let lastTime = 0;
let dropCounter = 0;

// Handles the downward movement and locking logic
function updatePiece() {
  if (!hasCollision(0, 1)) {
    piece.y += 1;
  } else {
    // Piece hit the floor or another block
    lockPiece();
    piece = createPiece();
    holdUsed = false; // Reset hold status for the next drop
    
    // If the new piece immediately collides upon spawning, you're dead
   if (hasCollision(0, 0)) {
      alert('Game Over! \n LOOSER');
      
      
      if (window.bgMusic) {
        window.bgMusic.pause();
        window.bgMusic.currentTime = 0; // music from the start
      }
      // Wipe the board clean
      for(let y = 0; y < ROWS; y++) field[y].fill(null);
      
      // Reset stats
      score = 0;
      document.getElementById('score').innerText = score;
      holdPiece = null;
      
      // Reset UI buttons
      window.isPlaying = false;
      document.getElementById('start-btn').disabled = false;
      document.getElementById('start-btn').innerText = "RETRY";
      
      document.getElementById('pause-btn').disabled = true;
      document.getElementById('pause-btn').innerText = "PAUSE";
      
      return true; // Tells the game loop to stop running
    }
  }
  return false;
}

//Runs every frame via requestAnimationFrame
function gameLoop(time = 0) {
  // Don't do anything if game is stopped or paused
  if (!window.isPlaying || window.isPaused) return; 

  if (!lastTime) lastTime = time;
  const delta = time - lastTime;
  lastTime = time;

  dropCounter += delta;
  
  // Only drop the piece if enough time has passed
  while (dropCounter > DROP_INTERVAL) {
    const isGameOver = updatePiece();
    if (isGameOver) {
      lastTime = 0; 
      render(); 
      return; // Kill the loop completely
    }
    Cline(); // Check for completed lines
    dropCounter -= DROP_INTERVAL;
  }
   
  render();
  requestAnimationFrame(gameLoop);
}