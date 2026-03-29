const FIELD_ROWS = 20;
const FIELD_COLS = 20;
const SNAKE_SPEED_MS = 300;

let snakeTimer = null;
let isGameStarted = false;
let score = 0;
let direction = 'top';
let snake = [];
let snakeCoordRow;
let snakeCoordCol;

function init() {
    prepareGameField();

    document.getElementById('snake-start').addEventListener('click', startGameHandler);
    document.getElementById('snake-renew').addEventListener('click', refreshGameHandler);
    window.addEventListener('keydown', changeDirectionHandler);
}

function prepareGameField() {
    const gameTable = document.createElement('table');
    gameTable.classList.add('game-table');
    gameTable.id = 'game-table';

    for (let row = 0; row < FIELD_ROWS; row++) {
        const tr = document.createElement('tr');
        tr.classList.add('game-table-row');

        for (let col = 0; col < FIELD_COLS; col++) {
            const td = document.createElement('td');
            td.classList.add('game-table-cell');
            tr.appendChild(td);
        }

        gameTable.appendChild(tr);
    }

    document.getElementById('snake-field').appendChild(gameTable);
}

function clearBoardCells() {
    document.querySelectorAll('.game-table-cell').forEach((cell) => {
        cell.classList.remove('snake-unit', 'food-unit', 'mongoose-unit');
    });
}

function startGameHandler() {
    if (snakeTimer) {
        clearInterval(snakeTimer);
        snakeTimer = null;
    }

    clearBoardCells();
    snake = [];
    score = 0;
    addScore(0);
    direction = 'top';
    isGameStarted = true;

    respawn();
    snakeTimer = setInterval(move, SNAKE_SPEED_MS);
    setTimeout(() => createFood('apple'), 500);
}

function refreshGameHandler() {
    if (snakeTimer) {
        clearInterval(snakeTimer);
        snakeTimer = null;
    }
    isGameStarted = false;
    snake = [];
    score = 0;
    addScore(0);
    direction = 'top';
    clearBoardCells();
}

function changeDirectionHandler(event) {
    const key = event.key;
    if (!['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(key)) {
        return;
    }
    event.preventDefault();

    switch (key) {
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowUp':
            if (direction !== 'bottom') direction = 'top';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
        case 'ArrowDown':
            if (direction !== 'top') direction = 'bottom';
            break;
    }
}

function respawn() {
    snakeCoordRow = Math.floor(FIELD_ROWS / 2);
    snakeCoordCol = Math.floor(FIELD_COLS / 2);

    const gameTable = document.getElementById('game-table');
    const snakeHead = gameTable.children[snakeCoordRow].children[snakeCoordCol];
    snakeHead.classList.add('snake-unit');

    const snakeTail = gameTable.children[snakeCoordRow + 1].children[snakeCoordCol];
    snakeTail.classList.add('snake-unit');

    snake.push(snakeTail);
    snake.push(snakeHead);
}

function move() {
    if (!isGameStarted) {
        return;
    }

    const gameTable = document.getElementById('game-table');
    let newUnit;

    switch (direction) {
        case 'top':
            if (snakeCoordRow === 0) {
                newUnit = gameTable.children[FIELD_ROWS - 1].children[snakeCoordCol];
                snakeCoordRow = FIELD_ROWS - 1;
            } else {
                snakeCoordRow--;
                newUnit = gameTable.children[snakeCoordRow].children[snakeCoordCol];
            }
            break;
        case 'bottom':
            if (snakeCoordRow === FIELD_ROWS - 1) {
                newUnit = gameTable.children[0].children[snakeCoordCol];
                snakeCoordRow = 0;
            } else {
                snakeCoordRow++;
                newUnit = gameTable.children[snakeCoordRow].children[snakeCoordCol];
            }
            break;
        case 'right':
            if (snakeCoordCol === FIELD_COLS - 1) {
                newUnit = gameTable.children[snakeCoordRow].children[0];
                snakeCoordCol = 0;
            } else {
                snakeCoordCol++;
                newUnit = gameTable.children[snakeCoordRow].children[snakeCoordCol];
            }
            break;
        case 'left':
            if (snakeCoordCol === 0) {
                newUnit = gameTable.children[snakeCoordRow].children[FIELD_COLS - 1];
                snakeCoordCol = FIELD_COLS - 1;
            } else {
                snakeCoordCol--;
                newUnit = gameTable.children[snakeCoordRow].children[snakeCoordCol];
            }
            break;
    }

    if (!isSnakeUnit(newUnit)) {
        newUnit.classList.add('snake-unit');
        snake.push(newUnit);

        if (!isFood(newUnit)) {
            const removed = snake.shift();
            removed.classList.remove('snake-unit');
        }
    } else {
        gameOver();
    }
}

function isSnakeUnit(unit) {
    return snake.includes(unit);
}

function isFood(unit) {
    if (unit.classList.contains('food-unit')) {
        unit.classList.remove('food-unit');
        score++;
        addScore(score);
        createFood('apple');
        createFood('mongoose');
        return true;
    }
    if (unit.classList.contains('mongoose-unit')) {
        unit.classList.remove('mongoose-unit');
        gameOver();
        return true;
    }
    return false;
}

function createFood(kind) {
    const gameTable = document.getElementById('game-table');
    let foodCreated = false;

    while (!foodCreated) {
        const foodRow = Math.floor(Math.random() * FIELD_ROWS);
        const foodCol = Math.floor(Math.random() * FIELD_COLS);
        const foodCell = gameTable.children[foodRow].children[foodCol];

        if (
            !foodCell.classList.contains('snake-unit') &&
            !foodCell.classList.contains('food-unit') &&
            !foodCell.classList.contains('mongoose-unit')
        ) {
            if (kind === 'apple') foodCell.classList.add('food-unit');
            if (kind === 'mongoose') foodCell.classList.add('mongoose-unit');
            foodCreated = true;
        }
    }
}

function gameOver() {
    isGameStarted = false;
    if (snakeTimer) {
        clearInterval(snakeTimer);
        snakeTimer = null;
    }
    alert('Игра окончена');
    refreshGameHandler();
}

function addScore(value) {
    document.getElementById('total-score').textContent = String(value);
}

window.addEventListener('DOMContentLoaded', init);
