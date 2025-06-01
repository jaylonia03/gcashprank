// Fake AI judging system
function judgeDrawing(drawingData, prompt) {
    // This is a fake judging system that simulates AI scoring
    // In a real implementation, you might analyze the drawing more
    
    // Random base score (0.5 to 1.0)
    let score = 0.5 + Math.random() * 0.5;
    
    // Simulate judging criteria
    const originality = 0.3 + Math.random() * 0.7; // 0.3-1.0
    const effort = 0.4 + Math.random() * 0.6;      // 0.4-1.0
    const detail = 0.2 + Math.random() * 0.8;      // 0.2-1.0
    
    // Apply weights
    score = (originality * 0.4) + (effort * 0.35) + (detail * 0.25);
    
    // Adjust based on round (later rounds judged more harshly)
    const roundFactor = 1 + (gameState.round * 0.05);
    score /= roundFactor;
    
    // Ensure score is between 0 and 1
    score = Math.max(0, Math.min(1, score));
    
    // Scale to 1-10 for display
    return score * 10;
}

// Simulate an opponent drawing (for multiplayer)
function simulateDrawing(prompt) {
    // Create a simple drawing simulation
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw something based on prompt
    ctx.fillStyle = getRandomColor();
    
    // Very simple drawing based on prompt
    if (prompt.includes('robot')) {
        // Draw a robot
        ctx.fillRect(100, 100, 100, 150); // Body
        ctx.fillRect(75, 75, 50, 50);     // Head
        ctx.fillRect(200, 75, 50, 50);    // Head
        ctx.fillRect(85, 250, 30, 80);    // Legs
        ctx.fillRect(185, 250, 30, 80);   // Legs
    } else if (prompt.includes('monster')) {
        // Draw a monster
        ctx.beginPath();
        ctx.arc(200, 150, 80, 0, Math.PI * 2);
        ctx.fill();
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(170, 130, 15, 0, Math.PI * 2);
        ctx.arc(230, 130, 15, 0, Math.PI * 2);
        ctx.fill();
        // Mouth
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(200, 170, 40, 0, Math.PI);
        ctx.stroke();
    } else {
        // Default drawing
        ctx.fillStyle = getRandomColor();
        ctx.beginPath();
        ctx.arc(300, 200, 50 + Math.random() * 50, 0, Math.PI * 2);
        ctx.fill();
    }
    
    return canvas.toDataURL();
}

function getRandomColor() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
    return colors[Math.floor(Math.random() * colors.length)];
}
