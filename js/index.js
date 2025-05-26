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

let snakeBody = [{
    x: undefined,
    y: undefined,
}];

let food = {
    x:undefined,
    y:undefined,
}

const strokeWidth = 1;
(function init(){
    // snakeBody[0].x = Math.floor(Math.random() * cols) * cellWidth + p0.x;
    // snakeBody[0].y = Math.floor(Math.random() * rows) * cellHeight + p0.y;
    snakeBody[0] = getRandomPosition();
    food = getRandomPosition();
    displaySnake(snakeBody);
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

function displaySnake(snakeBody){
    ctx.fillStyle = 'red';
    snakeBody.forEach(body => {
        ctx.fillRect(body.x,body.y,cellWidth,cellHeight); 
    });
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
let newPosition = {
    x: snakeBody[0].x,
    y: snakeBody[0].y,
}
function updateSnakePosition(){
    if(direction.left){
        if(!isCollidedX(snakeBody[0].x)){
           newPosition.x = snakeBody[0].x - 10;
        }else{
            newPosition.x = p0.x;
            terminate = true;
        }
        newPosition.y = snakeBody[0].y;
    }
    if(direction.right){
        if(!isCollidedX(snakeBody[0].x)){
             newPosition.x = snakeBody[0].x + 10;
        }else{
            newPosition.x = p0.x + (cols - 1) * cellWidth;
            terminate = true;
        }
        newPosition.y = snakeBody[0].y;
    }
    if(direction.up){
        if(!isCollidedY(snakeBody[0].y)){
            newPosition.y = snakeBody[0].y - 10;
        }else{
            newPosition.y = p0.y
            terminate = true;
        }
        newPosition.x = snakeBody[0].x;
    }
    if(direction.down){
        if(!isCollidedY(snakeBody[0].y)){
            newPosition.y = snakeBody[0].y + 10;
        }else{
            newPosition.y = p0.y + (rows - 1) * cellHeight;
            terminate = true;
        }
        newPosition.x = snakeBody[0].x;
    }
    // 這裡根據是否吃到食物決定是否 pop
    snakeBody.unshift({...newPosition});
    if (!collidedWithFood()) {
        snakeBody.pop();
    }
    displaySnake(snakeBody); 
}

function stopGame(){
    if(terminate){
        alert('結束遊戲');
        clearInterval(id);
        // 刷新頁面
        window.location.reload();
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
    if(snakeBody[0].x === food.x && snakeBody[0].y === food.y){
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