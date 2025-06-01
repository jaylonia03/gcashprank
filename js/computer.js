// Computer opponent logic
function generateComputerDrawing() {
    // In a real implementation, this would generate more sophisticated drawings
    // For now, we'll use the simulateDrawing function from judge.js
    
    const computerDrawing = simulateDrawing(gameState.currentPrompt);
    gameState.opponentDrawings.push(computerDrawing);
    
    // Show results after a short delay to simulate "thinking"
    setTimeout(() => {
        showRoundResults();
    }, 1500);
}
