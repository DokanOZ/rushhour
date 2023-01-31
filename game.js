const l1 = [
    [0,4,0,7,7,7],
    [2,4,0,8,10,0],
    [2,1,1,8,10,11],
    [3,5,5,5,10,11],
    [3,0,6,0,0,12],
    [0,0,6,9,9,12]
]

const l2 = [
    [2,0,0,6,6,6],
    [2,3,3,7,0,0],
    [1,1,4,7,0,11],
    [0,0,4,8,8,11],
    [0,0,5,9,9,11],
    [0,0,5,10,10,10]
]

const l3 = [
    [2,2,6,0,9,9],
    [3,3,6,0,10,0],
    [4,0,1,1,10,0],
    [4,7,7,7,10,11],
    [4,0,0,8,0,11],
    [5,5,0,8,12,12]
]

const l4 = [
    [3,3,7,9,0,0],
    [2,2,7,9,0,0],
    [8,1,1,9,0,0],
    [8,4,4,4,0,0],
    [8,5,5,0,0,0],
    [6,6,6,0,0,0]
]

let levels = [l1, l2, l3, l4]
let copyLevels = []

const exitCor = "2-5" //the exit coordinate where the player needs to get to win

let currentLevel //the level we currently are on
let currentCar //the car that is currently moving

let moveC //count the moves the player makes
let timer //counts the time the player takes to finish a level

//Loads on start
window.onload = function() {
    currentLevel = 1

    createBoard(levels[currentLevel - 1])
    populateBoard(levels[currentLevel - 1])

    moveC = 0

    gameTimer()
    copyLevels = copy()

    document.getElementById("moveCounter").innerHTML = moveC;
}

//https://stackoverflow.com/questions/13756482/create-copy-of-multi-dimensional-array-not-reference-javascript
//Makes a copy of the levels
//Gives back a coppied version of the array levels
function copy(){
    let rows = []
    let c = [] //copy

    for (let i = 0; i < levels.length; i++){
        for (let row = 0; row < levels[i].length; row++){
            rows[row] = levels[i][row].slice();
        }
        c.push(rows)
        rows = []
    }
    return c
}

//resets the level, by resetting the array levels
//gives back a coppied version of the array copylevels
function rollBack() {
    let board = []
    let c = []

    for (let i = 0; i < copyLevels.length; i++){
        for (let l = 0; l < copyLevels[i].length; l++){
            board[l] = copyLevels[i][l].slice();
        }
        c.push(board)
        board = []
    }

    return c
}

function createBoard(level) {

    let rows = level.length
    let columns = level[0].length

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            //block is an empty square
            let block = document.createElement("div")

            block.id = r + "-" + c
            block.classList.add("tile")

            if (block.id === exitCor) {block.classList.add("exit")}

            document.getElementById("board").append(block)
        }
    }
}

function populateBoard(level) {

    let rows = level.length
    let columns = level[0].length

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (level[r][c] !== 0){
                let car = document.createElement("div")
                let block = document.getElementById(`${r}-${c}`)

                car.id = level[r][c]
                car.classList.add("car")
                car.style.backgroundColor = getColors(level[r][c])

                if (validateEnv(level, r, c, level[r][c], "left")) {
                    //https://www.w3schools.com/cssref/pr_class_cursor.php
                    car.style.cursor = "pointer"
                    //https://stackoverflow.com/questions/69595294/how-to-add-rounded-corners-to-a-single-side-in-html-css
                    car.style.borderBottomLeftRadius = "100%30px"
                    car.style.borderTopLeftRadius = "100%30px"
                    //https://stackoverflow.com/questions/73764240/drag-event-listener-on-div
                    car.addEventListener('click', function () {move(level, r, c, level[r][c], "left")})
                }
                else if (validateEnv(level, r, c, level[r][c], "right")) {
                    car.style.cursor = "pointer"
                    car.style.borderBottomRightRadius = "100%30px"
                    car.style.borderTopRightRadius = "100%30px"
                    car.addEventListener('click', function () {move(level, r, c, level[r][c], "right")})
                }
                else if (validateEnv(level, r, c, level[r][c], "up")) {
                    car.style.cursor = "pointer"
                    car.style.borderTopLeftRadius = "100%30px"
                    car.style.borderTopRightRadius = "100%30px"
                    car.addEventListener('click', function () {move(level, r, c, level[r][c], "up")})
                }
                else if (validateEnv(level, r, c, level[r][c], "down")) {
                    car.style.cursor = "pointer"
                    car.style.borderBottomLeftRadius = "100%30px"
                    car.style.borderBottomRightRadius = "100%30px"
                    car.addEventListener('click', function () {move(level, r, c, level[r][c], "down")})
                }

                block.appendChild(car)
            }
        }
    }
}

function move(level, r, c, id, direction) {
    //https://www.w3schools.com/js/js_switch.asp
    switch (direction) {
        case "left":
            level[r][c - 1] = id
            if (level[r][c + 2] === id){
                level[r][c + 2] = 0
            }
            else {
                level[r][c + 1] = 0
            }
            break;
        case "right":
            level[r][c + 1] = id
            if (level[r][c - 2] === id){
                level[r][c - 2] = 0
            }
            else {
                level[r][c - 1] = 0
            }
            break;
        case "up":
            if (r - 1 >= 0) {
                level[r - 1][c] = id
                if(r + 3 > level.length) {level[r + 1][c] = 0; break;}
                if (level[r + 2][c] === id){
                    level[r + 2][c] = 0
                }
                else {
                    level[r + 1][c] = 0
                }
            }
            break;
        case "down":
            level[r + 1][c] = id
            if (r - 2 < 0) {level[r - 1][c] = 0; break;}
            if (level[r - 2][c] === id){
                level[r - 2][c] = 0
            }
            else {
                level[r - 1][c] = 0
            }
            break;
    }
    moveCounter(id)
    clearBoard()
    createBoard(level)
    populateBoard(winCheck(level))
}

function validateEnv(level, r, c, id, direction) {

    switch (direction) {
        case "left":
            return c - 1 >= 0 && level[r][c + 1] === id && level[r][c - 1] === 0
        case "right":
            return c + 1 < level[0].length && level[r][c - 1] === id && level[r][c + 1] === 0
        case "up":
            if (r + 2 > level.length) {return false}
            return r - 1 >= 0 && level[r + 1][c] === id && level[r - 1][c] === 0
        case "down":
            if (r - 1 < 0) {return false}
            return r + 1 < level.length && level[r - 1][c] === id && level[r + 1][c] === 0
        default:
            console.log("validateEnv error")
    }
}

function clearBoard() {
    document.getElementById("board").innerHTML = ''
}

function getColors(n) {
    //https://www.w3schools.com/js/js_switch.asp
    switch(n) {
        case 1:
            return "#FF0000"
        case 2:
            return "#DCFF00"
        case 3:
            return "#46FF00"
        case 4:
            return "#00FF59"
        case 5:
            return "#00FFF3"
        case 6:
            return "#0061FF"
        case 7:
            return "#5D00FF"
        case 8:
            return "#D500FF"
        case 9:
            return "#0C2E06"
        case 10:
            return "#114D45"
        case 11:
            return "#1A114D"
        case 12:
            return "#370B0B"
    }
}

function winCheck(level) {
    let cor = exitCor.split("-")

    if (level[cor[0]][cor[1]] === 1 && level[cor[0]][cor[1] - 1] === 1){
        alert("Congratz! It took you " + moveC + " moves and " + timer + " seconds to complete!")
        moveC = 0
        timer = 0
        document.getElementById("timer").innerHTML = timer;
        currentLevel += 1

        if (currentLevel === 4) {
            currentLevel = 1
        }
        moveCounter(0)
        levels = rollBack()
        return levels[currentLevel - 1]
    }

    return level
}

function resetGame() {
    //https://stackoverflow.com/questions/3715047/how-to-reload-a-page-using-javascript
    window.location.reload(); //reloads the page
}

function resetLevel() {
    moveC = 0
    timer = 0
    document.getElementById("timer").innerHTML = timer;
    levels = rollBack()
    moveCounter(0)
    clearBoard()
    createBoard(levels[currentLevel - 1])
    populateBoard(levels[currentLevel - 1])
}

// id is the the car's ID that is currently moving
function moveCounter(id) {

    //currentCar is the last car's ID that moved
    if (currentCar !== id && id !== 0){
        moveC += 1
    }
    currentCar = id
    document.getElementById("moveCounter").innerHTML = moveC;
}

//https://stackoverflow.com/questions/19683761/how-do-you-add-1-every-second
function gameTimer() {
    timer = 0

    window.setInterval(function () {
        timer += 1;
        //https://stackoverflow.com/questions/40858456/how-to-display-a-javascript-var-in-html-body
        document.getElementById("timer").innerHTML = timer;
    }, 1000);
}