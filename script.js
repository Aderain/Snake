const board = document.getElementById("board");

board.style.border = "5px solid grey";

const rows = 25;
const cols = 25;
const boxSize = 25;
const width = cols * boxSize;
const height = rows * boxSize;
let snakeX = 5 * boxSize;
let snakeY = 5 * boxSize;
let snakeBody = [];
let appleX = 0, appleY = 0;
let velocityX = 0, velocityY = 0;
let gameover = false
let score = 0;
let highScore = window.localStorage.getItem("highScore") || 0;
let intervalId;
const context = board.getContext("2d");


window.onload = () => {
    board.width = width;
    board.height = height;
    document.addEventListener("keydown", changeDirection)
    console.log(velocityX, velocityY)
    placeFood();
    intervalId = setInterval(update, 1000/20);
}

function update() {
    if(gameover){

        return
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = 'black'
    context.fillStyle = 'red'
    context.beginPath()
    context.arc(appleX + boxSize/2, appleY + boxSize/2, boxSize/2, 0, 2 * Math.PI, false) // full circle
    context.fill()
    context.stroke()

    if(appleX === snakeX && appleY === snakeY){
        snakeBody.push([appleX, appleY])
        score += 1;
        placeFood();
    }

    for(let i = snakeBody.length - 1; i > 0; i--){
        snakeBody[i] = snakeBody[i - 1];
    }

    if(snakeBody.length){
        snakeBody[0] = [snakeX, snakeY];
    }

    context.fillStyle = "lightgreen";
    snakeX += velocityX*boxSize;
    snakeY += velocityY*boxSize;
    context.fillRect(snakeX, snakeY, boxSize, boxSize);
    context.font = "16px Courier New";
    context.fillText("Score: " + score, cols*boxSize - 5*boxSize, boxSize)
    context.fillText("High Score: " + highScore, boxSize, boxSize)

    for(let i = 0; i < snakeBody.length; i++){
        context.fillRect(snakeBody[i][0], snakeBody[i][1], boxSize, boxSize)
    }


    //Game over states
    for(let i = 0; i < snakeBody.length; i++){
        if(snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]){
            alert("Game over!");
            clearInterval(intervalId);
            intervalId = null;

            if(score > highScore) {
                highScore = score;
                window.localStorage.clear();
                window.localStorage.setItem("highScore", highScore);
            }

            setTimeout(() => {
                document.location.reload();
            }, [3000]);
        }
    }

    //lose when hit the wall
    // if(snakeX >= cols*boxSize || snakeX < 0 || 
    //     snakeY >= rows*boxSize || snakeY < 0){
    //         alert("Game over!");
    //         clearInterval(intervalId);
    //         intervalId = null;

    //         setTimeout(() => {
    //             document.location.reload();
    //         }, [2000]);
    // }

    //walls are not collidable
    if(snakeX >= cols*boxSize){
        snakeX = 0;
    } else if(snakeY >= rows*boxSize){
        snakeY = 0;
    } else if(snakeX < 0){
        snakeX = cols*boxSize;
    } else if(snakeY < 0){
        snakeY = rows*boxSize;
    }

}

function placeFood() {
    appleX = Math.floor(Math.random()*cols) * boxSize;
    appleY = Math.floor(Math.random()*rows) * boxSize;
}

function changeDirection(e) {
    if(e.keyCode === 87 && velocityY !== 1){
        velocityX = 0;
        velocityY = -1;
    }
    else if(e.keyCode === 65 && velocityX !== 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if(e.keyCode === 83 && velocityY !== -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if(e.keyCode === 68 && velocityX !== -1){
        velocityX = 1;
        velocityY = 0;
    }
}