// DOM Elements
const authContainer = document.getElementById('auth-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const appContainer = document.getElementById('app-container');
const logoutButton = document.getElementById('logout-button');
const saveGoalsButton = document.getElementById('save-goals-button');
const historyTableBody = document.querySelector('#history-table tbody');

// Category IDs and names
const categories = [
    { id: 'protein', name: 'Protein' },
    { id: 'cereals', name: 'Cereals' },
    { id: 'fruits', name: 'Fruits' },
    { id: 'dairy', name: 'Dairy' },
    { id: 'healthy-fats', name: 'Healthy Fats' },
    { id: 'oil', name: 'Oil' },
    { id: 'vegetables', name: 'Vegetables' }
];

// Initialize App
function init() {
    checkForNewDay();
    setupEventListeners();
    if (localStorage.getItem('currentUser')) {
        showApp();
    } else {
        showAuth();
    }
}

// Event Listeners
function setupEventListeners() {
    showRegister.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    });

    showLogin.addEventListener('click', () => {
        registerForm.style.display = 'none';
        loginForm.style.display = 'flex';
    });

    registerButton.addEventListener('click', registerUser);
    loginButton.addEventListener('click', loginUser);
    logoutButton.addEventListener('click', logoutUser);
    saveGoalsButton.addEventListener('click', saveGoals);
}

// Registration Function
function registerUser() {
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;

    if (!username || !password) {
        alert('Please enter a username and password.');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username]) {
        alert('Username already exists.');
        return;
    }

    users[username] = {
        password: password,
        goals: {},
        history: {}
    };

    localStorage.setItem('users', JSON.stringify(users));
    alert('Registration successful! Please log in.');
    registerForm.style.display = 'none';
    loginForm.style.display = 'flex';
}

// Login Function
function loginUser() {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    let users = JSON.parse(localStorage.getItem('users')) || {};

    if (!users[username] || users[username].password !== password) {
        alert('Invalid username or password.');
        return;
    }

    localStorage.setItem('currentUser', username);
    showApp();
}

// Logout Function
function logoutUser() {
    localStorage.removeItem('currentUser');
    appContainer.style.display = 'none';
    authContainer.style.display = 'block';
}

// Show App Function
function showApp() {
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    loadUserData();
}

// Show Auth Function
function showAuth() {
    authContainer.style.display = 'block';
    appContainer.style.display = 'none';
}

// Save Goals Function
function saveGoals() {
    const currentUser = localStorage.getItem('currentUser');
    let users = JSON.parse(localStorage.getItem('users'));

    users[currentUser].goals = {};

    categories.forEach(category => {
        const goalValue = parseInt(document.getElementById(`${category.id}-goal`).value) || 0;
        users[currentUser].goals[category.id] = goalValue;
    });

    localStorage.setItem('users', JSON.stringify(users));
    createGrids();
}

// Load User Data Function
function loadUserData() {
    const currentUser = localStorage.getItem('currentUser');
    let users = JSON.parse(localStorage.getItem('users'));
    const user = users[currentUser];

    // Load Goals
    categories.forEach(category => {
        const goalInput = document.getElementById(`${category.id}-goal`);
        const goalValue = user.goals[category.id] || 0;
        goalInput.value = goalValue;
    });

    // Create Grids
    createGrids();

    // Load History
    loadHistory();
}

// Create Grids Function
function createGrids() {
    categories.forEach(category => {
        const gridContainer = document.getElementById(`${category.id}-grid`);
        gridContainer.innerHTML = ''; // Clear existing squares
        const currentUser = localStorage.getItem('currentUser');
        let users = JSON.parse(localStorage.getItem('users'));
        const user = users[currentUser];

        const servingsConsumed = user.today?.servings?.[category.id] || [];
        const goal = user.goals[category.id] || 0;

        for (let i = 0; i < goal; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if (servingsConsumed.includes(i)) {
                square.classList.add('filled');
            }
            square.addEventListener('click', () => toggleSquare(square, category.id, i));
            gridContainer.appendChild(square);
        }
    });
}

// Toggle Square Function
function toggleSquare(square, categoryId, index) {
    square.classList.toggle('filled');
    const currentUser = localStorage.getItem('currentUser');
    let users = JSON.parse(localStorage.getItem('users'));
    const user = users[currentUser];

    if (!user.today) {
        user.today = {
            date: getTodayDate(),
            servings: {}
        };
    }

    if (!user.today.servings[categoryId]) {
        user.today.servings[categoryId] = [];
    }

    if (square.classList.contains('filled')) {
        user.today.servings[categoryId].push(index);
    } else {
        user.today.servings[categoryId] = user.today.servings[categoryId].filter(i => i !== index);
    }

    users[currentUser] = user;
    localStorage.setItem('users', JSON.stringify(users));
}

// Load History Function
function loadHistory() {
    const currentUser = localStorage.getItem('currentUser');
    let users = JSON.parse(localStorage.getItem('users'));
    const user = users[currentUser];

    historyTableBody.innerHTML = '';

    for (let date in user.history) {
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        dateCell.textContent = date;
        row.appendChild(dateCell);

        categories.forEach(category => {
            const cell = document.createElement('td');
            cell.textContent = user.history[date][category.id] || 0;
            row.appendChild(cell);
        });

        historyTableBody.appendChild(row);
    }
}

// Check for New Day Function
function checkForNewDay() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;

    let users = JSON.parse(localStorage.getItem('users'));
    const user = users[currentUser];

    const today = getTodayDate();

    if (user.today && user.today.date !== today) {
        // Save yesterday's data to history
        if (!user.history) {
            user.history = {};
        }
        user.history[user.today.date] = {};

        categories.forEach(category => {
            const count = user.today.servings?.[category.id]?.length || 0;
            user.history[user.today.date][category.id] = count;
        });

        // Reset today's data
        user.today = {
            date: today,
            servings: {}
        };

        users[currentUser] = user;
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Get Today's Date Function
function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

// Initialize App
init();
