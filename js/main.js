window.isPlaying = false; 
window.isPaused = false; 


window.bgMusic = new Audio('theme.mp3');
window.bgMusic.loop = true;  
window.bgMusic.volume = 0.5; 

const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const pauseMenu = document.getElementById('pause-menu');
const resumeBtn = document.getElementById('resume-btn');
const gameCanvas = document.getElementById('game');

function togglePause() {
  if (!window.isPlaying) return; 

  window.isPaused = !window.isPaused;

  if (window.isPaused) {
    // PAUSE
    pauseMenu.classList.remove('hidden');
    gameCanvas.classList.add('blurred');
    pauseBtn.innerText = "RESUME";
    
    window.bgMusic.pause(); 
  } else {
   
    pauseMenu.classList.add('hidden');
    gameCanvas.classList.remove('blurred');
    pauseBtn.innerText = "PAUSE";
    
  
    window.bgMusic.play(); 
    
    lastTime = 0; 
    requestAnimationFrame(gameLoop); 
  }
}

startBtn.addEventListener('click', () => {
  if (!window.isPlaying) {
    window.isPlaying = true;
    window.isPaused = false;
    
    startBtn.disabled = true;
    pauseBtn.disabled = false; 
    startBtn.innerText = "PLAYING...";
  
    window.bgMusic.currentTime = 0; 
    window.bgMusic.play();
    
    lastTime = 0;
    gameLoop(); 
  }
});

pauseBtn.addEventListener('click', togglePause);
resumeBtn.addEventListener('click', togglePause);

// Main Keyboard inputs
document.addEventListener('keydown', (e) => {
  if (!window.isPlaying) return; 

  // P or Esc to pause
  if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
    togglePause();
    return;
  }

  // Freeze controls completely if paused
  if (window.isPaused) return; 

  // Movement
  if (e.key === 'ArrowLeft' && !hasCollision(-1, 0)) piece.x -= 1;
  if (e.key === 'ArrowRight' && !hasCollision(1, 0)) piece.x += 1;
  
  // Soft drop (hold down)
  if (e.key === 'ArrowDown' && !hasCollision(0, 1)) {
    piece.y += 1;
    dropCounter = 0;  
  }
  
  // Hard drop (Spacebar) - slams the piece straight down instantly
  if (e.key === ' ') {
    while (!hasCollision(0, 1)) piece.y += 1;
    lockPiece();
    piece = createPiece();
    holdUsed = false;
    dropCounter = 0;
  }
      
  // Utility keys
  if (e.key === 'r' || e.key === 'ArrowUp') rotatePiece();
  if (e.key === 'h') holdCurrentPiece();
});

// --- EASTER EGGS ---

// 1. Classic Konami Code
const konamiCode = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a"
];
let index = 0;
document.addEventListener("keydown", (event) => {
  if (event.key === konamiCode[index]) {
    index++;
    if (index === konamiCode.length) {
      window.location.href = "easteregg.html"; //send them to doom
    }
  } else {
    index = 0; 
  }
});

const MarioCode = ["m", "a", "r", "i", "o"];
let index2 = 0;
document.addEventListener("keydown", (event) => {
  if (event.key === MarioCode[index2]) {
    index2++;
    if (index2 === MarioCode.length) {
      window.location.href = "easteregg2.html"; //it's a me mario
    }
  } else {
    index2 = 0; 
  }
});

const JoJoCode = ["j", "o", "j", "o"];
let index3 = 0;
document.addEventListener("keydown", (event) => {
  if (event.key === JoJoCode[index3]) {
    index3++;
    
    if (index3 === JoJoCode.length) {
      if (window.bgMusic) {
        window.bgMusic.pause();
      }
      
      window.bgMusic = new Audio('easteregg.mp3'); 
      window.bgMusic.loop = true;
      window.bgMusic.volume = 0.5;

      document.body.classList.add('jojo-mode');

      if (window.isPlaying && !window.isPaused) {
        window.bgMusic.play();
      } else {
        alert("Awaken, my masters!");
      }
      
      index3 = 0; 
    }
    
  } else {
    index3 = 0; 
  }
});
