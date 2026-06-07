// Глобальний стан гри
let currentMatrix = [];
let initialMatrix = []; 
let currentLevelId = null;
let moves = 0;
let timerInterval = null;
let secondsElapsed = 0;

// Очікуємо повного завантаження структури сторінки (DOM)
document.addEventListener("DOMContentLoaded", () => {
    // Прив'язка обробників подій до кнопок керування
    document.getElementById("btn-new-game").addEventListener("click", loadRandomLevel);
    document.getElementById("btn-restart").addEventListener("click", restartCurrentLevel);
    
    // Запуск першої гри при завантаженні сторінки
    loadRandomLevel();
});

// Асинхронне завантаження рівнів з сервера за допомогою Ajax (Fetch API)
async function loadRandomLevel() {
    try {
        const response = await fetch('db.json');
        if (!response.ok) {
            throw new Error("Не вдалося завантажити db.json з сервера.");
        }
        
        // Обов'язково з дужками (), щоб викликати метод
        const data = await response.json(); 
        const levels = data.levels;

        // Вибір випадкового рівня (щоб він не повторював поточний, якщо рівнів кілька)
        let availableLevels = levels;
        if (currentLevelId !== null && levels.length > 1) {
            availableLevels = levels.filter(lvl => lvl.id !== currentLevelId);
        }
        
        const randomLevel = availableLevels[Math.floor(Math.random() * availableLevels.length)];
        
        // Оновлення інтерфейсу та фіксація початкового стану рівня
        currentLevelId = randomLevel.id;
        document.getElementById("target-count").textContent = randomLevel.target;
        
        // Глибоке копіювання (клонування) матриці для збереження оригіналу
        initialMatrix = JSON.parse(JSON.stringify(randomLevel.matrix));
        
        initGame(initialMatrix);

    } catch (error) {
        console.error("Помилка Ajax запиту:", error);
        alert("Помилка: Не вдалося отримати дані з файлу db.json через Ajax.");
    }
}

// Ініціалізація параметрів гри
function initGame(matrix) {
    currentMatrix = JSON.parse(JSON.stringify(matrix));
    moves = 0;
    document.getElementById("moves-count").textContent = moves;
    
    resetTimer();
    startTimer();
    renderBoard();
}

// Перезапуск поточного рівня без повторного Ajax-запиту
function restartCurrentLevel() {
    if (initialMatrix.length > 0) {
        initGame(initialMatrix);
    }
}

// Динамічна генерація ігрового поля в DOM
function renderBoard() {
    const board = document.getElementById("game-board");
    board.innerHTML = ""; // Очищення поля перед оновленням

    for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 5; c++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            
            // Встановлення класу підсвічування відповідно до значення в матриці (1 чи 0)
            if (currentMatrix[r][c] === 1) {
                cell.classList.add("is-on");
            } else {
                cell.classList.add("is-off");
            }
            
            // Збереження координат у дата-атрибутах клітинки
            cell.dataset.row = r;
            cell.dataset.col = c;
            
            // Додавання слухача події кліку
            cell.addEventListener("click", handleCellClick);
            
            board.appendChild(cell);
        }
    }
}

// Обробка ходу користувача
function handleCellClick(event) {
    const r = parseInt(event.currentTarget.dataset.row);
    const c = parseInt(event.currentTarget.dataset.col);
    
    // Перемикання станів обраної клітинки та її сусідів (хрестом)
    toggleCell(r, c);       // Центр
    toggleCell(r - 1, c);   // Верх
    toggleCell(r + 1, c);   // Ниж
    toggleCell(r, c - 1);   // Ліворуч
    toggleCell(r, c + 1);   // Праворуч

    // Збільшення лічильника ходів
    moves++;
    document.getElementById("moves-count").textContent = moves;
    
    // Оновлення відображення поля
    renderBoard();

    // Перевірка умови перемоги (всі елементи матриці мають стати 0)
    if (checkWinCondition()) {
        clearInterval(timerInterval);
        setTimeout(() => {
            alert(`Перемога! Ви вимкнули все світло за ${moves} ходів!`);
        }, 50);
    }
}

// Інверсія значення клітинки (з перевіркою меж матриці 5х5)
function toggleCell(r, c) {
    if (r >= 0 && r < 5 && c >= 0 && c < 5) {
        currentMatrix[r][c] = currentMatrix[r][c] === 1 ? 0 : 1;
    }
}

// Перевірка, чи гра завершена
function checkWinCondition() {
    return currentMatrix.every(row => row.every(val => val === 0));
}

// --- Функції керування таймером ---
function startTimer() {
    timerInterval = setInterval(() => {
        secondsElapsed++;
        const mins = Math.floor(secondsElapsed / 60);
        const secs = secondsElapsed % 60;
        document.getElementById("timer-count").textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
}

function resetTimer() {
    if (timerInterval) clearInterval(timerInterval);
    secondsElapsed = 0;
    document.getElementById("timer-count").textContent = "0:00";
}
