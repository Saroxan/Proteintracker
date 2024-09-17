body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

#auth-container, #app-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

h1, h2, h3 {
    text-align: center;
}

#login-form, #register-form, #goals-form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#login-form input, #register-form input, .goal-input input {
    padding: 10px;
    margin: 5px;
    width: 200px;
}

#login-button, #register-button, #save-goals-button, #logout-button {
    padding: 10px 20px;
    margin: 10px;
    font-size: 16px;
}

#tracking-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.category {
    margin: 20px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(30px, 1fr));
    gap: 5px;
    width: 200px;
    margin: 0 auto;
}

.square {
    width: 30px;
    height: 30px;
    background-color: lightgray;
    cursor: pointer;
}

.square.filled {
    background-color: green;
}

#history-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

#history-table th, #history-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

@media (max-width: 600px) {
    .grid-container {
        grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
    }

    .square {
        width: 20px;
        height: 20px;
    }
}
