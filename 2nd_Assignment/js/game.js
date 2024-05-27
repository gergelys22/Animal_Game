
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Animal objects
const animals = [
  { name: 'Beaver', food: ['Carrots', 'Salads', 'Tree Stomps'], speed: 0.2 },
  { name: 'Vole', food: ['Fruit', 'Berries', 'Leaf'], speed: 0.2 },
  { name: 'Badger', food: ['Worm', 'Insects', 'Fruits'], speed: 0.2 },
  { name: 'Duck', food: ['Seeds', 'Worm', 'Vegetables'], speed: 0.2 },
  { name: 'Snake', food: ['Birds', 'Rodents', 'Eggs'], speed: 0.2 },
];

// Initialize the selected animal
let selectedAnimalInstance;

let selectedDifficulty;

function setDifficulty(difficulty) {
  selectedDifficulty = difficulty;

  switch (selectedDifficulty) {
    case 'easy':
      environmentInstances.forEach((obj) => {
        obj.speed = 0.2; // Adjust the speed for easy difficulty
      });
      break;
    case 'medium':
      environmentInstances.forEach((obj) => {
        obj.speed = 0.5; // Adjust the speed for medium difficulty
      });
      break;
    case 'hard':
      environmentInstances.forEach((obj) => {
        obj.speed = 0.8; // Adjust the speed for hard difficulty
      });
      break;
    case 'impossible':
      environmentInstances.forEach((obj) => {
        obj.speed = 1;
      });
      break;
    default:
      // Default to medium difficulty
      environmentInstances.forEach((obj) => {
        obj.speed = 0.5;
      });
      break;
  }
}

// Set the initial position of the selected animal
function setInitialAnimal(image) {
  selectedAnimalInstance = {
    x: Math.random() * (canvas.width - 50),
    y: Math.random() * (canvas.height - 50),
    speed: 5,
    image: image,
    isVisible: true,
  };

  // Start the game loop
  gameLoop();
}
// Handle keyboard input

let isPopupOpen = false;

document.addEventListener('keydown', (event) => {
  if(!gameOver && !isPopupOpen) {
    switch (event.key) {
      case 'ArrowUp':
        moveAnimal(0, -5);
        break;
      case 'ArrowDown':
        moveAnimal(0, 5);
        break;
      case 'ArrowLeft':
        moveAnimal(-5, 0);
        break;
      case 'ArrowRight':
        moveAnimal(5, 0);
        break;
    }
  }
});


// Move the selected animal
function moveAnimal(dx, dy) {
  const newX = selectedAnimalInstance.x + dx * selectedAnimalInstance.speed;
  const newY = selectedAnimalInstance.y + dy * selectedAnimalInstance.speed;

  const isCollision = environmentInstances.some(obj => (
    newX < obj.x + 20 &&
    newX + 50 > obj.x &&
    newY < obj.y + 20 &&
    newY + 50 > obj.y
  ));

  if (!isCollision) {
    selectedAnimalInstance.x = newX;
    selectedAnimalInstance.y = newY;
  }
  else{
    handleCollision();
  }

  // Keep the selected animal within canvas bounds
  selectedAnimalInstance.x = Math.max(0, Math.min(canvas.width - 50, selectedAnimalInstance.x));
  selectedAnimalInstance.y = Math.max(0, Math.min(canvas.height - 50, selectedAnimalInstance.y));
}

function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + 20 &&
    obj1.x + 50 > obj2.x &&
    obj1.y < obj2.y + 20 &&
    obj1.y + 50 > obj2.y
  );
}


// Food objects with shape and color properties
const foodObjects = [
  { type: 'Carrots', shape: 'square', color: 'orange' },
  { type: 'Salads', shape: 'triangle', color: 'green' },
  { type: 'Tree Stomps', shape: 'circle', color: 'brown' },
  { type: 'Berries', shape: 'ellipse', color: 'red' },
  { type: 'Fish', shape: 'diamond', color: 'blue' },
  { type: 'Nuts', shape: 'rectangle', color: 'brown' },
];



// Initialize the environment objects
const environmentInstances = [];
const environmentObjects = ['Rock', 'Bush', 'Log', 'Puddle', 'Mushroom', 'Flower', 'Stone', 'Grass', 'Cactus', 'Fern', 'Hill'];

function initializeEnvironment() {
  const minDistance = 100;
  for (const _ of Array(15)) {
    let validPosition = false;
    let x, y;

    while (!validPosition) {
      validPosition = true;
      x = Math.random() * (canvas.width - 20);
      y = Math.random() * (canvas.height - 20);

      if (Math.abs(x - selectedAnimalInstance.x) < minDistance && Math.abs(y - selectedAnimalInstance.y) < minDistance) {
        validPosition = false;
        continue;
      }

      for (const obj of environmentInstances) {
        if (Math.abs(x - obj.x) < minDistance && Math.abs(y - obj.y) < minDistance) {
          validPosition = false;
          break;
        }
      }
    }

    const environmentObject = {
      x: x,
      y: y,
      type: environmentObjects[Math.floor(Math.random() * environmentObjects.length)],
      direction: Math.random() * 2 * Math.PI,
      speed: 0, 
    };
    environmentInstances.push(environmentObject);
  }
}




// Add this function to game.js
function selectDifficulty() {
  const modal = document.getElementById('difficultyModal');
  modal.style.display = 'block';

  // Define the closeDifficultyModal function here
  function closeDifficultyModal() {
    modal.style.display = 'none';
  }

  // Event listener for the "Apply" button in the difficulty modal
  document.getElementById('applyDifficulty').addEventListener('click', () => {
    const selectedDifficulty = document.getElementById('difficultyDropdown').value;
    setDifficulty(selectedDifficulty);
    closeDifficultyModal();
  });

  // Event listener for closing the difficulty modal
  document.getElementById('closeModal').addEventListener('click', closeDifficultyModal);
}


// Initialize the food objects
const foodInstances = [];
function initializeFood() {
  for (let i = 0; i < 10; i++) {
    const randomFood = foodObjects[Math.floor(Math.random() * foodObjects.length)];
    const foodObject = {
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      type: randomFood.type,
      shape: randomFood.shape,
      color: randomFood.color,
    };
    foodInstances.push(foodObject);
  }
}

let gameOver = false;


function handleCollision() {
  // Display game over popup
  gameOver = true;
  showGameOverPopup();
}

// Game loop
let score = 0;

function drawEnvironmentObject(obj) {
  switch (obj.type) {
    case 'Rock':
      ctx.fillStyle = 'gray';
      ctx.fillRect(obj.x, obj.y, 20, 20);
      break;
    case 'Bush':
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 10, 8, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'Log':
      ctx.fillStyle = 'brown';
      ctx.fillRect(obj.x, obj.y, 20, 5);
      break;
    case 'Puddle':
      ctx.fillStyle = 'blue';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 10, 8, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'Mushroom':
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 10, 10, 0, Math.PI, false);
      ctx.lineTo(obj.x, obj.y + 20);
      ctx.closePath();
      ctx.fill();
      break;
    case 'Flower':
      ctx.fillStyle = 'purple';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 10, 8, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = 'yellow';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 5, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(obj.x + 5, obj.y + 10, 5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(obj.x + 15, obj.y + 10, 5, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'Stone':
      ctx.fillStyle = 'gray';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 10, 10, 0, 2 * Math.PI);
      ctx.fill();
      break;
    case 'Grass':
      ctx.fillStyle = 'green';
      ctx.fillRect(obj.x, obj.y, 2, 15);
      break;
    case 'Cactus':
      ctx.fillStyle = 'green';
      ctx.fillRect(obj.x + 8, obj.y + 2, 4, 18);
      ctx.fillRect(obj.x + 6, obj.y + 10, 8, 2);
      ctx.fillRect(obj.x + 4, obj.y + 12, 12, 2);
      break;
    case 'Fern':
      ctx.fillStyle = 'green';
      ctx.fillRect(obj.x + 8, obj.y, 4, 10);
      ctx.fillRect(obj.x + 6, obj.y + 8, 8, 2);
      ctx.fillRect(obj.x + 4, obj.y + 10, 12, 2);
      break;
    case 'Hill':
      ctx.fillStyle = 'green';
      ctx.beginPath();
      ctx.arc(obj.x + 10, obj.y + 10, 10, 0, Math.PI, true);
      ctx.lineTo(obj.x, obj.y + 10);
      ctx.closePath();
      ctx.fill();
      break;
  }
}

const timeLimit = 30; 
let elapsedTime = 0;
let countdownStarted = false;

function gameLoop() {

  if(gameOver || isPopupOpen) {
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw environment objects
  if (selectedDifficulty) {
    // Draw environment objects
    environmentInstances.forEach((obj) => {
      drawEnvironmentObject(obj);

      // Update the position of environment objects based on their direction and speed
      obj.x += Math.cos(obj.direction) * obj.speed;
      obj.y += Math.sin(obj.direction) * obj.speed;

      // Wrap around the canvas if an object goes out of bounds
      obj.x = (obj.x + canvas.width) % canvas.width;
      obj.y = (obj.y + canvas.height) % canvas.height;

      // Check for collision with the selected animal
      if (checkCollision(selectedAnimalInstance, obj)) {
        handleCollision();
      }
    });

  // Draw food objects with different shapes and colors
  foodInstances.forEach((obj) => {
    ctx.fillStyle = obj.color;

    // Draw different shapes based on the 'shape' property
    switch (obj.shape) {
      case 'square':
        ctx.fillRect(obj.x, obj.y, 20, 20);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(obj.x, obj.y);
        ctx.lineTo(obj.x + 20, obj.y);
        ctx.lineTo(obj.x + 10, obj.y - 20);
        ctx.fill();
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(obj.x + 10, obj.y + 10, 10, 0, 2 * Math.PI);
        ctx.fill();
        break;
      case 'ellipse':
          ctx.beginPath();
          ctx.ellipse(obj.x + 10, obj.y + 10, 10, 15, 0, 0, 2 * Math.PI);
          ctx.fill();
          break;
      case 'diamond':
          ctx.beginPath();
          ctx.moveTo(obj.x + 10, obj.y);
          ctx.lineTo(obj.x + 20, obj.y + 10);
          ctx.lineTo(obj.x + 10, obj.y + 20);
          ctx.lineTo(obj.x, obj.y + 10);
          ctx.closePath();
          ctx.fill();
          break;
      case 'rectangle':
          ctx.fillRect(obj.x, obj.y, 20, 15); 
          break;         
    }
  });

  
  // Draw the selected animal
  if (selectedAnimalInstance.isVisible) {
    const img = new Image();
    img.src = selectedAnimalInstance.image;
    ctx.drawImage(img, selectedAnimalInstance.x, selectedAnimalInstance.y, 50, 50);

    // Check for collision with environment objects
    environmentInstances.forEach((obj) => {
      if (checkCollision(selectedAnimalInstance, obj)) {
        handleCollision();
      }
    });


    // Check for collision with food objects
    foodInstances.forEach((food, index) => {
      if (checkCollision(selectedAnimalInstance, food)) {
        // Increase score and remove collected food
        score++;
        foodInstances.splice(index, 1);
      }
    });

    // Display score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);  

      elapsedTime += 1 / 60;
      const remainingTime = Math.max(0, timeLimit - Math.floor(elapsedTime));
      ctx.fillText(`Time: ${remainingTime}s`, canvas.width - 100, 30);

      
      // Check if time limit is exceeded
      if (elapsedTime >= timeLimit || score === 10) {
        if(!gameOver) {
          showScorePopup(score);
          elapsedTime = 0; 
          gameOver = true;
        }
      }
  }
}

  // RequestAnimationFrame at the end of the game loop
  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}


function initializeGame() {
  score = 0;
  elapsedTime = 0;
  foodInstances.length = 0;
  environmentInstances.length = 0;

  initializeEnvironment();
  initializeFood();
  selectDifficulty();
  startCountdown();
}


// Call initializeGame on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeGame();
});

// Event listener for the Restart button
document.getElementById('restartButton').addEventListener('click', () => {
  // Restart the game
  gameOver = false;
  initializeGame();
  closeScorePopup();
});

document.getElementById('startNewGame').addEventListener('click', () => {
  gameOver = false;
  initializeGame();
  closeScorePopup();
})


function showScorePopup(score) {
  var scoreDisplay = document.getElementById('scoreDisplay');
  var scorePopup = document.getElementById('scorePopup');
  
  if (scoreDisplay && scorePopup) {
    isPopupOpen = true; // Set popup open flag
    scoreDisplay.textContent = `Your final score: ${score}`;
    scorePopup.style.display = 'block';

    var closeButtonPopup = document.getElementById('closeButton');
    if (closeButtonPopup) {
      closeButtonPopup.addEventListener('click', () => {
        endGame(score);
        closeScorePopup();
      });
    }
  }
}

function closeScorePopup() {
  var scorePopup = document.getElementById('scorePopup');
  scorePopup.style.display = 'none';
  isPopupOpen = false; // Reset popup open flag
}

function showGameOverPopup() {
  var scoreDisplay = document.getElementById('scoreDisplay');
  var scorePopup = document.getElementById('scorePopup');

  if (scoreDisplay && scorePopup) {
    isPopupOpen = true; // Set popup open flag
    scoreDisplay.textContent = 'Game over! You encountered an obstacle!';
    scorePopup.style.display = 'block';

    var closeButtonPopup = document.getElementById('closeButton');
    if (closeButtonPopup) {
      closeButtonPopup.addEventListener('click', () => {
        endGame(score);
        closeScorePopup();
      });
    }
  }
}


function addScoreToScoreboard(username, score) {
  const timestamp = new Date().toLocaleString();
  const scoreboardTableBody = document.querySelector('#scoreboardtable tbody');
  const newRow = document.createElement('tr');

  newRow.innerHTML = `
    <td>${username}</td>
    <td>${score}</td>
    <td>${timestamp}</td>
  `;

  scoreboardTableBody.appendChild(newRow);
}

// Event listener for the Restart button
document.getElementById('restartButton').addEventListener('click', () => {
  // Reset the score and restart the game
  score = 0;
  foodInstances.length = 0; // Clear the collected food
  environmentInstances.length = 0; // Clear the environment objects
  initializeEnvironment(); // Reinitialize the environment objects
  initializeFood(); // Reinitialize the food objects
  setInitialAnimal(selectedAnimalImage);
  gameOver = false; // Reset game over status
  closeScorePopup(); // Close the popup if open
  startCountdown(); // Restart the countdown
});


document.getElementById('startNewGame').addEventListener('click', () => {
  // Reset the score and restart the game
  score = 0;
  foodInstances.length = 0; // Clear the collected food
  environmentInstances.length = 0; // Clear the environment objects
  initializeEnvironment(); // Reinitialize the environment objects
  initializeFood(); // Reinitialize the food objects
  setInitialAnimal(selectedAnimalImage);
  gameOver = false; // Reset game over status
  closeScorePopup(); // Close the popup if open
  startCountdown(); // Restart the countdown
});

// Event listener for the Close button
// document.getElementById('closeButton').addEventListener('click', () => {
//   closeScorePopup();
// });


function startCountdown() {
  let countdown = timeLimit;
  const countdownDisplay = document.getElementById('countdown');

  const countdownInterval = setInterval(() => {
    if (isPopupOpen || gameOver) {
      clearInterval(countdownInterval);
      return;
    }

    countdown--;
    countdownDisplay.textContent = countdown;

    if (countdown <= 0 || gameOver) {
      clearInterval(countdownInterval);
      if (gameOver) {
        showGameOverPopup();
      }
    }
  }, 1000);
}


function endGame(score) {
  fetch('../php/save_scores.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `score=${score}`
  })
  .then(response => response.text())
  .then(data => {
    console.log(data);
    // Update scoreboard
    fetch('../php/get_scores.php')
      .then(response => response.text())
      .then(html => {
        document.getElementById('scoreboard').innerHTML = html;
      });
  })
  .catch(error => console.error('Error:', error));
}
