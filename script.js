// Get references to DOM elements
const dailyGoalElement = document.getElementById('daily-goal');
const gridContainer = document.getElementById('grid-container');
const changeGoalButton = document.getElementById('change-goal-button');

// Prompt the user for their daily goal
function promptForGoal() {
    let goal = parseInt(prompt('Enter your daily protein goal in servings (each serving = 13g):'));
    if (isNaN(goal) || goal <= 0) {
        alert('Please enter a valid number greater than 0.');
        return promptForGoal();
    }
    localStorage.setItem('dailyGoal', goal);
    localStorage.setItem('servingsConsumed', '[]'); // Reset consumed servings
    localStorage.setItem('lastUpdated', new Date().toISOString().split('T')[0]); // Store today's date
    updateGoalDisplay(goal);
    createGrid(goal);
}

// Update the displayed daily goal
function updateGoalDisplay(goal) {
    dailyGoalElement.textContent = goal;
}

// Create the grid of squares based on the daily goal
function createGrid(goal) {
    gridContainer.innerHTML = ''; // Clear existing squares
    const servingsConsumed = JSON.parse(localStorage.getItem('servingsConsumed')) || [];

    for (let i = 0; i < goal; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        if (servingsConsumed.includes(i)) {
            square.classList.add('filled');
        }
        square.addEventListener('click', () => toggleSquare(square, i));
        gridContainer.appendChild(square);
    }
}

// Toggle the square's fill state and update the servings consumed
function toggleSquare(square, index) {
    square.classList.toggle('filled');
    let servingsConsumed = JSON.parse(localStorage.getItem('servingsConsumed')) || [];
    if (square.classList.contains('filled')) {
        servingsConsumed.push(index);
    } else {
        servingsConsumed = servingsConsumed.filter(i => i !== index);
    }
    localStorage.setItem('servingsConsumed', JSON.stringify(servingsConsumed));
}

// Check if it's a new day and reset servings if necessary
function checkForNewDay() {
    const lastUpdated = localStorage.getItem('lastUpdated');
    const today = new Date().toISOString().split('T')[0];
    if (lastUpdated !== today) {
        localStorage.setItem('servingsConsumed', '[]');
        localStorage.setItem('lastUpdated', today);
    }
}

// Initialize the app
function init() {
    checkForNewDay();
    let dailyGoal = localStorage.getItem('dailyGoal');
    if (!dailyGoal) {
        promptForGoal();
    } else {
        updateGoalDisplay(dailyGoal);
        createGrid(parseInt(dailyGoal));
    }
}

// Event listener for the "Change Daily Goal" button
changeGoalButton.addEventListener('click', () => {
    promptForGoal();
});

// Start the app
init();
