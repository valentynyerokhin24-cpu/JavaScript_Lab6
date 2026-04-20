let gameData = null;
let currentLevel = null;
let board = [];
let moves = 0;
let timerInterval = null;
let seconds = 0;

// 1. Завантаження даних (Ajax/Fetch)
fetch('levels.json')
    .then(response => response.json())
    .then(data => {
        gameData = data.levels;
        loadLevel(0); // Завантаження першого за замовчуванням
    });

function loadLevel(index) {
    currentLevel = JSON.parse(JSON.stringify(gameData[index])); // Глибоке копіювання
    board = currentLevel.matrix;
    moves = 0;
    seconds = 0;
    
    document.getElementById('target-moves').textContent = currentLevel.target;
    updateStats();
    startTimer();
    renderBoard();
}

function renderBoard() {
    const container = document.getElementById('game-board');
    container.innerHTML = '';
    // Поле 5х5 згідно відео 
    container.style.gridTemplateColumns = 'repeat(5, 60px)';

    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const div = document.createElement('div');
            div.className = `cell ${cell ? 'is-on' : 'is-off'}`;
            // Обробка вводу користувача
            div.onclick = () => makeMove(r, c);
            container.appendChild(div);
        });
    });
}

function makeMove(r, c) {
    const toggle = (y, x) => {
        if (board[y] !== undefined && board[y][x] !== undefined) {
            board[y][x] = board[y][x] === 1 ? 0 : 1;
        }
    };

    // Логіка хреста (без циклічності)
    toggle(r, c);
    toggle(r - 1, c);
    toggle(r + 1, c);
    toggle(r, c - 1);
    toggle(r, c + 1);

    moves++;
    updateStats();
    renderBoard();
    checkWin();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function updateStats() {
    document.getElementById('current-moves').textContent = moves;
}

function checkWin() {
    if (board.every(row => row.every(v => v === 0))) {
        clearInterval(timerInterval);
        alert(`Перемога! Кроків: ${moves}. Час: ${document.getElementById('timer').textContent}`);
    }
}

document.getElementById('restart-btn').onclick = () => {
    // Рестарт без запиту до сервера
    loadLevel(gameData.findIndex(l => l.id === currentLevel.id));
};
