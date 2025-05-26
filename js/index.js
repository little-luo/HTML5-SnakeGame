const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let cellWidth = 10;
let cellHeight = 10;
let rows = 30;
let cols = 30;


let p0 = {
    x: 0,
    y: 0
};

p0.x = canvas.width / 2 - (cols * cellWidth) / 2;
p0.y = canvas.height / 2 - (rows * cellHeight) / 2;

let snake = {
    x: undefined,
    y: undefined,
};

let food = {
    x:undefined,
    y:undefined,
}

const strokeWidth = 1;
(function init(){
    // snake.x = Math.floor(Math.random() * cols) * cellWidth + p0.x;
    // snake.y = Math.floor(Math.random() * rows) * cellHeight + p0.y;
    snake = getRandomPosition();
    food = getRandomPosition();
    displaySnake(snake.x,snake.y);
    displayGrid();
    displayFood(food.x,food.y);
})();

let direction = {
    up: false,
    right: false,
    down: false,
    left: false,
}

window.addEventListener('keydown',function(e){
    let keyCode = e.keyCode;
    if(keyCode >= 37 && keyCode <= 40){
        switch(keyCode){
            case 37: {
                updateDirection('left');
                break;
            }
            case 38: {
                updateDirection('up');
                break;
            }
            case 39: {
                updateDirection('right');
                break;
            }
            case 40: {
                updateDirection('down');
                break;
            }
        }
    }
}) 

function displaySnake(x,y){
    ctx.fillStyle = 'red';
    ctx.fillRect(x,y,cellWidth,cellHeight); 
}

function displayGrid(){
    ctx.lineWidth = strokeWidth;
    ctx.beginPath();
    // 繪製橫線
    for(let i = 0; i <= rows; i++){
        ctx.moveTo(p0.x,p0.y + i * cellHeight);
        ctx.lineTo(p0.x + cols * cellWidth,p0.y + i * cellWidth);
        ctx.stroke();
    }

    // 繪製直線
    for(let i = 0; i <= cols; i++){
        ctx.moveTo(p0.x + i * cellWidth, p0.y);
        ctx.lineTo(p0.x + i * cellWidth, p0.y + rows * cellHeight);
        ctx.stroke();
    }
    ctx.closePath(); 
}

function isCollidedX(x){
    if(x >= p0.x && x <= p0.x + (cols - 1) * cellWidth){
        return false;
    }else{
        return true;
    }
}
function isCollidedY(y){
    if(y >= p0.y && y <= p0.y + (rows - 1) * cellHeight){
        return false;
    }else{
        return true;
    }

}

function updateDirection(str){
    direction.up = false;
    direction.right = false;
    direction.down = false;
    direction.left = false;
    if(str !== undefined){
        direction[str] = true;
    }
}

let terminate = false;
function updateSnakePosition(){
    if(direction.left){
        if(!isCollidedX(snake.x)){
            snake.x -= 10;
        }else{
            snake.x = p0.x;
            terminate = true;
        }
    }
    if(direction.right){
        if(!isCollidedX(snake.x)){
            snake.x += 10;
        }else{
            snake.x = p0.x + (cols - 1) * cellWidth;
            terminate = true;
        }
    }
    if(direction.up){
        if(!isCollidedY(snake.y)){
            snake.y -= 10;
        }else{
            snake.y = p0.y
            terminate = true;
        }
    }
    if(direction.down){
        if(!isCollidedY(snake.y)){
            snake.y += 10;
        }else{
            snake.y = p0.y + (rows - 1) * cellHeight;
            terminate = true;
        }
    }
    displaySnake(snake.x,snake.y,cellWidth,cellHeight); 
}

function stopGame(){
    if(terminate){
        alert('結束遊戲');
        clearInterval(id);
    }
}

function displayFood(x,y){
    ctx.fillStyle = 'green';
    ctx.fillRect(x,y,cellWidth,cellHeight);
}
function getRandomPosition(){
    let position = {
        x: Math.floor(Math.random() * cols) * cellWidth + p0.x,
        y: Math.floor(Math.random() * rows) * cellHeight + p0.y,
    }
    return position;
}

function collidedWithFood(){
    if(snake.x === food.x && snake.y === food.y){
        return true;
    }
    return false;
}
function move(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    
    updateSnakePosition();    
    
    if(collidedWithFood()){
        food = getRandomPosition();
        displayFood(food.x,food.y);
    }
    displayFood(food.x,food.y);
    
    displayGrid();
    
    stopGame();
}
const id = setInterval(move,100);