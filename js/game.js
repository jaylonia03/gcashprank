// Game state
let gameState = {
    round: 1,
    scores: [0, 0], // Player 1, Player 2
    isMultiplayer: false,
    gameCode: '',
    isHost: false,
    opponentSubmitted: false,
    currentPrompt: '',
    playerDrawings: [],
    opponentDrawings: [],
    timer: null,
    timeLeft: 0
};

// DOM elements
const playOnlineBtn = document.getElementById('playOnline');
const playComputerBtn = document.getElementById('playComputer');
const gameCodeContainer = document.getElementById('gameCodeContainer');
const gameCodeInput = document.getElementById('gameCodeInput');
const joinGameBtn = document.getElementById('joinGame');

// Initialize landing page
if (playOnlineBtn) {
    playOnlineBtn.addEventListener('click', () => {
        gameCodeContainer.style.display = 'block';
    });
    
    playComputerBtn.addEventListener('click', () => {
        startGame(false);
    });
    
    joinGameBtn.addEventListener('click', () => {
        if (gameCodeInput.value.length === 6) {
            startGame(true, gameCodeInput.value.toUpperCase());
        } else {
            alert('Please enter a 6-character game code');
        }
    });
}

// Start game (called from landing page)
function startGame(isMultiplayer, code = '') {
    gameState.isMultiplayer = isMultiplayer;
    
    if (isMultiplayer) {
        if (code) {
            // Joining existing game
            gameState.gameCode = code;
            gameState.isHost = false;
        } else {
            // Creating new game
            gameState.gameCode = generateGameCode();
            gameState.isHost = true;
        }
        
        // In a real implementation, you would store/check the game code in localStorage
        // and use polling to check for opponent moves
        console.log(`Game code: ${gameState.gameCode}`);
    }
    
    // Redirect to game page
    window.location.href = 'game.html';
}

// Generate random 6-character game code
function generateGameCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Game page initialization
if (document.getElementById('drawingCanvas')) {
    initializeGame();
}

function initializeGame() {
    // Load game state from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    gameState.isMultiplayer = urlParams.get('multiplayer') === 'true';
    gameState.gameCode = urlParams.get('code') || '';
    gameState.isHost = urlParams.get('host') === 'true';
    
    // Display game code if multiplayer
    if (gameState.isMultiplayer) {
        document.getElementById('gameCode').textContent = gameState.gameCode;
    } else {
        document.getElementById('gameCodeDisplay').style.display = 'none';
    }
    
    // Start first round
    startRound();
}

function startRound() {
    // Set round info
    document.getElementById('roundNumber').textContent = gameState.round;
    
    // Set time based on round
    if (gameState.round <= 2) {
        gameState.timeLeft = 30; // Easy rounds
    } else if (gameState.round <= 4) {
        gameState.timeLeft = 45; // Medium rounds
    } else {
        gameState.timeLeft = 55; // Hard round
    }
    document.getElementById('timeLeft').textContent = gameState.timeLeft;
    
    // Get random prompt
    gameState.currentPrompt = getRandomPrompt();
    document.getElementById('promptText').textContent = gameState.currentPrompt;
    
    // Clear canvas
    clearCanvas();
    
    // Start timer
    startTimer();
}

function startTimer() {
    clearInterval(gameState.timer);
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timeLeft').textContent = gameState.timeLeft;
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            timeUp();
        }
    }, 1000);
}

function timeUp() {
    // Auto-submit if time runs out
    if (!document.getElementById('submitDrawing').disabled) {
        submitDrawing();
    }
}

function submitDrawing() {
    // Disable submit button
    document.getElementById('submitDrawing').disabled = true;
    
    // Save drawing
    const canvas = document.getElementById('drawingCanvas');
    const drawingData = canvas.toDataURL();
    gameState.playerDrawings.push(drawingData);
    
    if (gameState.isMultiplayer) {
        // In a real implementation, you would store the drawing in localStorage
        // with the game code and poll for opponent's drawing
        simulateOpponent();
    } else {
        // VS Computer - generate computer drawing
        generateComputerDrawing();
    }
    
    // Show waiting message
    document.getElementById('opponentContainer').style.display = 'block';
}

function simulateOpponent() {
    // Simulate waiting for opponent
    setTimeout(() => {
        // In a real game, you would check localStorage for opponent's drawing
        // For now, we'll simulate it
        const canvas = document.getElementById('drawingCanvas');
        const opponentDrawing = simulateDrawing(gameState.currentPrompt);
        gameState.opponentDrawings.push(opponentDrawing);
        
        showRoundResults();
    }, 2000);
}

function generateComputerDrawing() {
    // Generate computer drawing based on prompt
    const computerDrawing = simulateDrawing(gameState.currentPrompt);
    gameState.opponentDrawings.push(computerDrawing);
    
    showRoundResults();
}

function showRoundResults() {
    // Get the last drawings
    const playerDrawing = gameState.playerDrawings[gameState.playerDrawings.length - 1];
    const opponentDrawing = gameState.opponentDrawings[gameState.opponentDrawings.length - 1];
    
    // Judge the drawings
    const playerScore = judgeDrawing(playerDrawing, gameState.currentPrompt);
    const opponentScore = judgeDrawing(opponentDrawing, gameState.currentPrompt);
    
    // Determine winner
    let winner = '';
    if (playerScore > opponentScore) {
        winner = 'You won this round!';
        gameState.scores[0]++;
    } else if (opponentScore > playerScore) {
        winner = gameState.isMultiplayer ? 'Opponent won this round!' : 'Computer won this round!';
        gameState.scores[1]++;
    } else {
        winner = 'It\'s a tie!';
    }
    
    // Display results
    const resultsHTML = `
        <div class="result">
            <h3>${winner}</h3>
            <p>Your score: ${playerScore.toFixed(1)}</p>
            <p>${gameState.isMultiplayer ? 'Opponent' : 'Computer'} score: ${opponentScore.toFixed(1)}</p>
            <div class="drawings-comparison">
                <div>
                    <h4>Your Drawing</h4>
                    <img src="${playerDrawing}" alt="Your drawing" style="max-width: 250px; border: 2px solid #4ecdc4;">
                </div>
                <div>
                    <h4>${gameState.isMultiplayer ? 'Opponent' : 'Computer'} Drawing</h4>
                    <img src="${opponentDrawing}" alt="Opponent drawing" style="max-width: 250px; border: 2px solid #ff6b6b;">
                </div>
            </div>
            <p>Total score: You ${gameState.scores[0]} - ${gameState.scores[1]} ${gameState.isMultiplayer ? 'Opponent' : 'Computer'}</p>
        </div>
    `;
    
    document.getElementById('roundResults').innerHTML = resultsHTML;
    document.getElementById('resultsContainer').style.display = 'block';
    document.getElementById('opponentContainer').style.display = 'none';
    
    // Set up next round button
    const nextRoundBtn = document.getElementById('nextRound');
    nextRoundBtn.textContent = gameState.round < 5 ? 'Next Round' : 'See Final Results';
    nextRoundBtn.onclick = () => {
        if (gameState.round < 5) {
            gameState.round++;
            startRound();
            document.getElementById('resultsContainer').style.display = 'none';
            document.getElementById('submitDrawing').disabled = false;
        } else {
            showFinalResults();
        }
    };
}

function showFinalResults() {
    let resultMessage = '';
    if (gameState.scores[0] > gameState.scores[1]) {
        resultMessage = 'Congratulations! You won the game!';
    } else if (gameState.scores[1] > gameState.scores[0]) {
        resultMessage = gameState.isMultiplayer ? 'Opponent won the game!' : 'Computer won the game!';
    } else {
        resultMessage = 'The game ended in a tie!';
    }
    
    const resultsHTML = `
        <div class="result">
            <h2>Game Over!</h2>
            <h3>${resultMessage}</h3>
            <p>Final score: You ${gameState.scores[0]} - ${gameState.scores[1]} ${gameState.isMultiplayer ? 'Opponent' : 'Computer'}</p>
            <button class="btn" id="playAgain">Play Again</button>
        </div>
    `;
    
    document.getElementById('roundResults').innerHTML = resultsHTML;
    document.getElementById('nextRound').style.display = 'none';
    
    const playAgainBtn = document.createElement('button');
    playAgainBtn.className = 'btn';
    playAgainBtn.textContent = 'Play Again';
    playAgainBtn.onclick = () => {
        resetGame();
    };
    document.getElementById('roundResults').appendChild(playAgainBtn);
}

function resetGame() {
    // Reset game state
    gameState = {
        round: 1,
        scores: [0, 0],
        isMultiplayer: gameState.isMultiplayer,
        gameCode: gameState.gameCode,
        isHost: gameState.isHost,
        opponentSubmitted: false,
        currentPrompt: '',
        playerDrawings: [],
        opponentDrawings: [],
        timer: null,
        timeLeft: 0
    };
    
    // Start new game
    document.getElementById('resultsContainer').style.display = 'none';
    document.getElementById('submitDrawing').disabled = false;
    startRound();
}

// Get random drawing prompt
function getRandomPrompt() {
    const prompts = [
        "A robot chef",
        "A happy monster",
        "A flying car",
        "An alien pet",
        "A treehouse",
        "A superhero",
        "A futuristic city",
        "A talking animal",
        "A magical potion",
        "A time machine",
        "A underwater castle",
        "A giant cupcake",
        "A dragon",
        "A spaceship",
        "A rainbow waterfall",
        "A robot dog",
        "A floating island",
        "A candy forest",
        "A snowman in the desert",
        "A pirate ship"
    ];
    
    return prompts[Math.floor(Math.random() * prompts.length)];
}
