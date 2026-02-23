window.isJojoMode = false;
window.isTimeStopped = false;
window.canUseTheWorld = true;

const theWorldSound = new Audio('resource/eg-sound.mp3');

const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
let konamiIndex = 0;

const MarioCode = ["m", "a", "r", "i", "o"];
let marioIndex = 0;

const JoJoCode = ["j", "o", "j", "o"];
let jojoIndex = 0;

document.addEventListener("keydown", (event) => {
  const keyStr = event.key.toLowerCase();

  if (event.key === konamiCode[konamiIndex] || keyStr === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) window.location.href = "resource/easteregg.html"; 
  } else {
    konamiIndex = 0; 
  }

  if (keyStr === MarioCode[marioIndex]) {
    marioIndex++;
    if (marioIndex === MarioCode.length) window.location.href = "resource/easteregg2.html"; 
  } else {
    marioIndex = 0; 
  }

  if (keyStr === JoJoCode[jojoIndex]) {
    jojoIndex++;
    if (jojoIndex === JoJoCode.length) {
      if (window.bgMusic) window.bgMusic.pause();
      
      window.bgMusic = new Audio('resource/easteregg.mp3'); 
      window.bgMusic.loop = true;
      window.bgMusic.volume = 0.5;
      
      document.body.classList.add('jojo-mode');
      window.isJojoMode = true;
      window.dropInterval = 150; 

      if (window.isPlaying && !window.isPaused) {
        window.bgMusic.play();
      } else {
        alert("Awaken, my masters!");
      }
      jojoIndex = 0; 
    }
  } else {
    jojoIndex = 0; 
  }

  if (keyStr === 't' && window.isJojoMode) {
    if (window.canUseTheWorld && window.isPlaying && !window.isPaused && !window.isTimeStopped) {
      window.canUseTheWorld = false;
      window.isTimeStopped = true;
      
      theWorldSound.currentTime = 0;
      theWorldSound.play();

      const zwText = document.getElementById('zawarudo-text');
      if (zwText) {
        zwText.classList.add('activated');
        setTimeout(() => {
          zwText.classList.remove('activated');
        }, 500);
      }
      
      document.body.classList.add('za-warudo');
      window.dropInterval = Infinity; 

      setTimeout(() => {
        window.isTimeStopped = false;
        window.dropInterval = 150; 
        document.body.classList.remove('za-warudo');
      }, 3000);

      setTimeout(() => {
        window.canUseTheWorld = true;
      }, 15000);
    }
  }
});