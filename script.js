// Дані рівнів з методички (1.2.2) 
const gameLevels = {
    'a': { target: 7, matrix: [
        [1,1,1,1,0], [0,0,1,0,0], [1,0,1,1,0], [0,0,1,1,0], [0,0,1,0,0]
    ]},
    'b': { target: 8, matrix: [
        [1,0,0,0,0], [0,1,1,1,1], [0,0,1,1,0], [0,0,1,0,0], [0,1,0,0,0]
    ]},
    'c': { target: 9, matrix: [
        [1,0,0,0,0], [0,1,0,1,0], [1,0,0,1,0], [0,0,1,1,0], [1,0,0,0,0]
    ]}
};

let currentBoard = [];
let steps = 0;
let activeLevelKey = 'a';

// Доступ до елементів DOM [cite: 68]
const boardEl = document.getElementById('game-board');
const stepsEl = document.getElementById('steps-count');
const targetEl = document.getElementById('target-moves');

function setupGame(levelKey) {
    activeLevelKey = levelKey;
    const level = gameLevels[levelKey];
    
    // Імітація роботи з JSON 
    currentBoard = JSON.parse(JSON.stringify(level.matrix));
    steps = 0;
    
    targetEl.textContent = level.target;
    updateUI();
    render();
}

function render() {
    boardEl.innerHTML = ''; // Очищення контейнера [cite: 78]
    
    currentBoard.forEach((row, r) => {
        row.forEach((cell, c) => {
            const div = document.createElement('div');
            div.className = `cell ${cell ? 'is-on' : 'is-off'}`;
            
            // Обробник події (ввід користувача) 
            div.onclick = () => makeMove(r, c);
            boardEl.appendChild(div);
        });
    });
}

function makeMove(r, c) {
    // Логіка інверсії клітинок
    const toggle = (y, x) => {
        if (currentBoard[y] && currentBoard[y][x] !== undefined) {
            currentBoard[y][x] = currentBoard[y][x] === 1 ? 0 : 1;
        }
    };

    toggle(r, c);       // Центр
    toggle(r - 1, c);   // Топ
    toggle(r + 1, c);   // Низ
    toggle(r, c - 1);   // Ліво
    toggle(r, c + 1);   // Право

    steps++;
    updateUI();
    render();
    checkWin();
}

function updateUI() {
    stepsEl.textContent = steps; // Оновлення тексту [cite: 77]
}

function checkWin() {
    const isWin = currentBoard.every(row => row.every(val => val === 0));
    if (isWin) {
        setTimeout(() => alert(`Перемога! Кроків: ${steps}`), 100);
    }
}

document.getElementById('reset-btn').onclick = () => setupGame(activeLevelKey);

// Початковий запуск
setupGame('a');
