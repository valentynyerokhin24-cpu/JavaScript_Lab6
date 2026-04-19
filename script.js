const matrix = [
    [1, 1, 1],
    [0, 0, 1],
    [1, 0, 1]
];

let board = [];
let steps = 0;

const boardEl = document.getElementById('game-board');
const stepsEl = document.getElementById('steps-count');
const resetBtn = document.getElementById('reset-btn');

function init() {
    steps = 0;
    if (stepsEl) stepsEl.textContent = steps;
    board = matrix.map(row => [...row]);
    render();
}

function render() {
    if (!boardEl) return;
    boardEl.innerHTML = ''; 
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const div = document.createElement('div');
            div.className = 'cell ' + (cell ? 'is-on' : 'is-off');
            div.textContent = cell;
            div.onclick = () => move(r, c);
            boardEl.appendChild(div);
        });
    });
}

function move(r, c) {
    const targets = [[r,c], [r-1,c], [r+1,c], [r,c-1], [r,c+1]];
    targets.forEach(([y, x]) => {
        if (board[y] && board[y][x] !== undefined) {
            board[y][x] = board[y][x] === 1 ? 0 : 1;
        }
    });
    steps++;
    if (stepsEl) stepsEl.textContent = steps;
    render();
    if (board.every(row => row.every(v => v === 0))) {
        setTimeout(() => alert('Перемога!'), 100);
    }
}

if (resetBtn) resetBtn.onclick = init;
init();