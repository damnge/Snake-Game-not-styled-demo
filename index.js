// constant variables that won't change

const grid = document.querySelector('.grid')
const startButton = document.getElementById('restart')
const playAndPause = document.getElementById('play-pause')
const scoreDisplay = document.getElementById('score')
const highestScoreDisplay = document.getElementById('highest-score')
const scoreFromLocalStorage = localStorage.getItem("highestScore")
const width = 10

// all stored variables that can change during the game

let squares = []
let currentSnake = [2,1,0]
let direction = 1
let appleIndex = 0
let turtleIndex = 0
let score = 0
let intervalTime = 1000
let turtleShow = 30000
let speed = 0.9
let slow = 1.25
let timerId = 0
let turtleId = 0
let paused = true

// Dispaly the highest score saved in Local Storage

highestScoreDisplay.textContent = scoreFromLocalStorage

// Function the create all the divs for the gird

function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div')
    //add styling to the element
    square.classList.add('square')
    //put the element into our grid
    grid.appendChild(square)
    //push it into a new squares array    
    squares.push(square)
    }
}
createGrid()

// creat snake a the begining that takes 3 field marked in the currentSnake array

currentSnake.forEach(index => squares[index].classList.add('snake'))

function startGame() {
    //remove the snake
    currentSnake.forEach(index => squares[index].classList.remove('snake'))
    //remove the apple
    squares[appleIndex].classList.remove('apple')
    clearInterval(timerId)
    // remove the turtle
    squares[turtleIndex].classList.remove('turtle')
    clearTimeout(turtleId)
    // recreat a new array for snake
    currentSnake = [2,1,0]
    // reset score
    score = 0
    //re add new score to browser
    scoreDisplay.textContent = score
    // set direction to the default right
    direction = 1
    // reset time speed
    intervalTime = 1000
    // creat new apple
    generateApple()
    // creat in some time turtle
    turtleId = setTimeout(generateTurtle, turtleShow)
    //readd the class of snake to our new currentSnake
    currentSnake.forEach(index => squares[index].classList.add('snake'))
    // move the snake
    timerId = setInterval(move, intervalTime)
    // set pause to false
    paused = false
}

// here is the function to pause the game

function togglePause() {
    // when toggled if game is not paused function stops the time and turtle that appears every 30 seconds in the game.
    if(!paused){
        clearInterval(timerId)
        clearTimeout(turtleId)
        paused = true
    } else if (paused){
        if(timerId === 0) {
            generateApple()
        } // if it's paused and you toggle play at the begginging it will generate apple, start time and generate turtle in 30 seconds.
        timerId = setInterval(move, intervalTime)
        turtleId = setTimeout(generateTurtle, turtleShow)
        paused = false
    }
}


function move() {
    if (
        (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
        (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
        (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
        (currentSnake[0] - width < 0 && direction === -width) || //if snake has hit top
        squares[currentSnake[0] + direction].classList.contains('snake') //if snake hit itself
    ){
        alert("Game Over!") // alert Game over and stop the game.
        clearTimeout(turtleId)
    return clearInterval(timerId)
    }
    //remove last element from our currentSnake array
    const tail = currentSnake.pop()
    //remove styling from last element
    squares[tail].classList.remove('snake')
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction)
    
    //if snake gets an apple
    if (squares[currentSnake[0]].classList.contains('apple')) {
        //remove the class of apple
        squares[currentSnake[0]].classList.remove('apple')
        //grow our snake by adding class of snake to it
        squares[tail].classList.add('snake')
        //grow our snake array
        currentSnake.push(tail)
        //generate new apple
        setTimeout(generateApple, 500)
        //add one to the score
        score++
        //display our score
        scoreDisplay.textContent = score
        //if the highest score is smaller than score during the game update the result
        if(scoreFromLocalStorage < score) {
            highestScoreDisplay.textContent = score
            localStorage.setItem("highestScore", score)
        }
       
        //speed up our snake
        clearInterval(timerId)
        intervalTime = intervalTime * speed
        timerId = setInterval(move, intervalTime)
    } 

        // if snake meet the turtle
    if (squares[currentSnake[0]].classList.contains('turtle')){
        squares[currentSnake[0]].classList.remove('turtle')
        clearInterval(timerId)
        intervalTime = intervalTime * slow
        timerId = setInterval(move, intervalTime)
        turtleId = setTimeout(generateTurtle, turtleShow)
    } 
    
    squares[currentSnake[0]].classList.add('snake')
}




// Here is the function that Generates Apples

function generateApple() {
    do {
        // picks a random number from all the squares
        appleIndex = Math.floor(Math.random() * squares.length) 
        // random number of the apple index can't be the same as numbers of current snake array
    } while (squares[appleIndex].classList.contains('snake'))
    // if the square with apple index already has a class of turtle repeat and generate apple again
    if(squares[appleIndex].classList.contains('turtle') === false && appleIndex !== currentSnake.includes(appleIndex)){
    squares[appleIndex].classList.add('apple')} else {
        generateApple()
    }
} 

// here is the function that Generates Turtles works the same as the  generating Apple just slight difference in terms of reapting the function if the square is already taken by other element.

function generateTurtle() {
    do {
        turtleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[turtleIndex].classList.contains('snake') && turtleIndex !== currentSnake.includes(turtleIndex) && squares[turtleIndex].classList.contains('apple') === false )
    squares[turtleIndex].classList.add('turtle')
} 

// function for the arrow controlers 

// 39 is right arrow
// 38 is for the up arrow
// 37 is for the left arrow
// 40 is for the down arrow

function control(e) {
    if (e.keyCode === 39) {
        direction = 1
    } else if (e.keyCode === 38) {
        direction = -width
    } else if (e.keyCode === 37) {
        direction = -1
    } else if (e.keyCode === 40) {
        direction = +width
    }
}

document.addEventListener('keyup', control)
startButton.addEventListener('click', startGame)
playAndPause.addEventListener("click", playGame =>{
    togglePause()
})
