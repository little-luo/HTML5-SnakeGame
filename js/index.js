const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cellWidth = 10;
let cellHeight = 10;
const ROWS = 30;
const COLS = 30;

let p0 = {
  x: 0,
  y: 0,
};

p0.x = canvas.width / 2 - (COLS * cellWidth) / 2;
p0.y = canvas.height / 2 - (ROWS * cellHeight) / 2;

const strokeWidth = 1;
const gameState = {
  snakeBody: [{}],
  food: {},
  score: 0,
  direction: {
    up: false,
    right: false,
    down: false,
    left: false,
  },
  start: false,
  terminate: false,
  speed: 100,
};

const COLOR = {
  SNAKE: "red",
  FOOD: "green",
  SCORE: "black",
};

(function init() {
  gameState.snakeBody[0] = getRandomPosition();
  gameState.food = getRandomPosition();
  displaySnake(gameState.snakeBody);
  displayGrid();
  displayFood(gameState.food.x, gameState.food.y);
  displayScore();
})();

window.addEventListener("keydown", function (e) {
  let keyCode = e.keyCode;
  if (keyCode >= 37 && keyCode <= 40) {
    switch (keyCode) {
      case 37: {
        updateDirection("left");
        break;
      }
      case 38: {
        updateDirection("up");
        break;
      }
      case 39: {
        updateDirection("right");
        break;
      }
      case 40: {
        updateDirection("down");
        break;
      }
    }
  }
});

let speedUp_id = undefined;
window.addEventListener("keydown", function (e) {
  let keyCode = e.keyCode;
  if (keyCode >= 37 && keyCode <= 40) {
    gameState.start = true;
    if (gameState.start && speedUp_id === undefined) {
      speedUp_id = setInterval(speedUp, 5000);
    }
  }
});

function displaySnake(snakeBody) {
  ctx.fillStyle = COLOR.SNAKE;
  snakeBody.forEach((body) => {
    ctx.fillRect(body.x, body.y, cellWidth, cellHeight);
  });
}

function displayGrid() {
  ctx.lineWidth = strokeWidth;
  ctx.beginPath();
  // 繪製橫線
  for (let i = 0; i <= ROWS; i++) {
    ctx.moveTo(p0.x, p0.y + i * cellHeight);
    ctx.lineTo(p0.x + COLS * cellWidth, p0.y + i * cellWidth);
    ctx.stroke();
  }

  // 繪製直線
  for (let i = 0; i <= COLS; i++) {
    ctx.moveTo(p0.x + i * cellWidth, p0.y);
    ctx.lineTo(p0.x + i * cellWidth, p0.y + ROWS * cellHeight);
    ctx.stroke();
  }
  ctx.closePath();
}

function isCollidedX(x) {
  if (x >= p0.x && x <= p0.x + (COLS - 1) * cellWidth) {
    return false;
  } else {
    return true;
  }
}
function isCollidedY(y) {
  if (y >= p0.y && y <= p0.y + (ROWS - 1) * cellHeight) {
    return false;
  } else {
    return true;
  }
}

function updateDirection(str) {
  gameState.direction.up = false;
  gameState.direction.right = false;
  gameState.direction.down = false;
  gameState.direction.left = false;
  if (str !== undefined) {
    gameState.direction[str] = true;
  }
}

let terminate = false;
let newPosition = {
  x: gameState.snakeBody[0].x,
  y: gameState.snakeBody[0].y,
};
function updateSnakePosition() {
  if (gameState.direction.left) {
    if (!isCollidedX(gameState.snakeBody[0].x)) {
      newPosition.x = gameState.snakeBody[0].x - 10;
    } else {
      newPosition.x = p0.x;
      terminate = true;
    }
    newPosition.y = gameState.snakeBody[0].y;
  }
  if (gameState.direction.right) {
    if (!isCollidedX(gameState.snakeBody[0].x)) {
      newPosition.x = gameState.snakeBody[0].x + 10;
    } else {
      newPosition.x = p0.x + (COLS - 1) * cellWidth;
      terminate = true;
    }
    newPosition.y = gameState.snakeBody[0].y;
  }
  if (gameState.direction.up) {
    if (!isCollidedY(gameState.snakeBody[0].y)) {
      newPosition.y = gameState.snakeBody[0].y - 10;
    } else {
      newPosition.y = p0.y;
      terminate = true;
    }
    newPosition.x = gameState.snakeBody[0].x;
  }
  if (gameState.direction.down) {
    if (!isCollidedY(gameState.snakeBody[0].y)) {
      newPosition.y = gameState.snakeBody[0].y + 10;
    } else {
      newPosition.y = p0.y + (ROWS - 1) * cellHeight;
      terminate = true;
    }
    newPosition.x = gameState.snakeBody[0].x;
  }
  // 這裡根據是否吃到食物決定是否 pop
  gameState.snakeBody.unshift({ ...newPosition });
  if (!collidedWithFood()) {
    gameState.snakeBody.pop();
  } else {
    changeScore();
  }

  displaySnake(gameState.snakeBody);
}

function stopGame() {
  if (terminate) {
    alert("結束遊戲");
    clearInterval(id);
    clearInterval(speedUp_id);
    // 刷新頁面
    window.location.reload();
  }
}

function displayFood(x, y) {
  ctx.fillStyle = COLOR.FOOD;
  ctx.fillRect(x, y, cellWidth, cellHeight);
}
function getRandomPosition() {
  let position = {
    x: Math.floor(Math.random() * COLS) * cellWidth + p0.x,
    y: Math.floor(Math.random() * ROWS) * cellHeight + p0.y,
  };
  return position;
}

function collidedWithFood() {
  if (
    gameState.snakeBody[0].x === gameState.food.x &&
    gameState.snakeBody[0].y === gameState.food.y
  ) {
    return true;
  }
  return false;
}

function collideWithSelf() {
  for (let i = 1; i < gameState.snakeBody.length; i++) {
    if (
      gameState.snakeBody[0].x === gameState.snakeBody[i].x &&
      gameState.snakeBody[0].y === gameState.snakeBody[i].y
    ) {
      gameState.snakeBody = gameState.snakeBody.slice(0, i);
      return true;
    }
  }
  return false;
}

function displayScore() {
  ctx.fillStyle = COLOR.SCORE;
  ctx.font = "20px serif";
  ctx.fillText(
    "".concat("目前分數 : ", gameState.score),
    p0.x + COLS * cellWidth,
    p0.y - 1 * cellHeight
  );
  ctx.textAlign = "right";
}

function changeScore() {
  gameState.score += 10;
}

function speedUp() {
  // console.log(gameState.speed);
  if (gameState.speed > 40) {
    gameState.speed -= 5;
    clearInterval(id);
    id = setInterval(move, gameState.speed);
  }
}

function move() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateSnakePosition();

  stopGame();

  if (collidedWithFood()) {
    gameState.food = getRandomPosition();
    displayFood(gameState.food.x, gameState.food.y);
  }
  displayFood(gameState.food.x, gameState.food.y);

  displayGrid();

  collideWithSelf();

  displayScore();
}
let id = setInterval(move, gameState.speed);
