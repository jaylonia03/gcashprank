// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.heroGrid = document.getElementById('heroGrid');
        this.gameUI = document.querySelector('.game-ui');
        this.heroSelect = document.querySelector('.hero-select');
        
        this.player = null;
        this.enemies = [];
        this.allies = [];
        this.projectiles = [];
        this.items = [];
        
        this.mapWidth = 1500;
        this.mapHeight = 1500;
        this.cameraX = 0;
        this.cameraY = 0;
        
        this.lastTime = 0;
        this.isRunning = false;
        
        this.setupCanvas();
        this.setupHeroSelection();
        this.setupEventListeners();
    }
    
    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }
    
    setupHeroSelection() {
        HEROES.forEach((hero, index) => {
            const heroCard = document.createElement('div');
            heroCard.className = 'hero-card';
            heroCard.innerHTML = `
                <div class="hero-icon">${hero.name.charAt(0)}</div>
                <div class="hero-name">${hero.name}</div>
                <div class="hero-role">${hero.role}</div>
            `;
            heroCard.addEventListener('click', () => this.selectHero(index));
            this.heroGrid.appendChild(heroCard);
        });
    }
    
    selectHero(index) {
        const heroData = HEROES[index];
        this.player = createHero(heroData, 0);
        
        // Position player in base
        this.player.x = 200;
        this.player.y = 200;
        
        // Create allies (4)
        for (let i = 0; i < 4; i++) {
            const allyData = HEROES[Utils.randomInt(0, HEROES.length - 1)];
            const ally = createHero(allyData, 0);
            ally.x = 200 + Utils.randomInt(-100, 100);
            ally.y = 200 + Utils.randomInt(-100, 100);
            this.allies.push(ally);
        }
        
        // Create enemies (5)
        for (let i = 0; i < 5; i++) {
            const enemyData = HEROES[Utils.randomInt(0, HEROES.length - 1)];
            const enemy = createHero(enemyData, 1);
            enemy.x = this.mapWidth - 200 + Utils.randomInt(-100, 100);
            enemy.y = this.mapHeight - 200 + Utils.randomInt(-100, 100);
            this.enemies.push(enemy);
        }
        
        // Hide hero select and show game UI
        this.heroSelect.classList.add('hidden');
        this.gameUI.classList.remove('hidden');
        
        // Start game
        this.start();
    }
    
    setupEventListeners() {
        // Canvas click for movement
        this.canvas.addEventListener('click', (e) => {
            if (!this.player) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left + this.cameraX;
            const y = e.clientY - rect.top + this.cameraY;
            
            this.player.moveTo(x, y);
        });
        
        // Ability buttons
        document.getElementById('ability1').addEventListener('click', () => this.player.castAbility(0));
        document.getElementById('ability2').addEventListener('click', () => this.player.castAbility(1));
        document.getElementById('ability3').addEventListener('click', () => this.player.castAbility(2));
        document.getElementById('ultimate').addEventListener('click', () => this.player.castAbility(3));
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.player) return;
            
            switch(e.key.toLowerCase()) {
                case 'q': this.player.castAbility(0); break;
                case 'w': this.player.castAbility(1); break;
                case 'e': this.player.castAbility(2); break;
                case 'r': this.player.castAbility(3); break;
            }
        });
    }
    
    start() {
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    gameLoop(currentTime) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Update game state
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    update(deltaTime) {
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
            
            // Update camera to follow player
            this.cameraX = this.player.x - this.canvas.width / 2;
            this.cameraY = this.player.y - this.canvas.height / 2;
            
            // Keep camera within bounds
            this.cameraX = Math.max(0, Math.min(this.cameraX, this.mapWidth - this.canvas.width));
            this.cameraY = Math.max(0, Math.min(this.cameraY, this.mapHeight - this.canvas.height));
            
            // Update UI
            document.getElementById('playerHealth').style.width = `${(this.player.health / this.player.maxHealth) * 100}%`;
            document.getElementById('playerMana').style.width = `${(this.player.mana / this.player.maxMana) * 100}%`;
            document.getElementById('playerLevel').textContent = this.player.level;
            document.getElementById('playerGold').textContent = this.player.gold;
        }
        
        // Update allies
        this.allies.forEach(ally => {
            ally.update(deltaTime);
            
            // Simple AI for allies
            if (!ally.isMoving && !ally.isAttacking && Math.random() < 0.01) {
                ally.moveTo(
                    this.player.x + Utils.randomInt(-200, 200),
                    this.player.y + Utils.randomInt(-200, 200)
                );
            }
        });
        
        // Update enemies
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            
            // Simple AI for enemies
            if (!enemy.isMoving && !enemy.isAttacking) {
                if (Math.random() < 0.02) {
                    // Move randomly
                    enemy.moveTo(
                        enemy.x + Utils.randomInt(-300, 300),
                        enemy.y + Utils.randomInt(-300, 300)
                    );
                } else if (Utils.distance(enemy.x, enemy.y, this.player.x, this.player.y) < 500 && Math.random() < 0.1) {
                    // Attack player if nearby
                    enemy.isAttacking = true;
                    enemy.target = this.player;
                }
            }
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map background
        this.drawMap();
        
        // Draw all game objects with camera offset
        const drawWithOffset = (drawFunc) => {
            this.ctx.save();
            this.ctx.translate(-this.cameraX, -this.cameraY);
            drawFunc();
            this.ctx.restore();
        };
        
        // Draw player
        if (this.player) {
            drawWithOffset(() => this.player.draw(this.ctx));
        }
        
        // Draw allies
        this.allies.forEach(ally => {
            drawWithOffset(() => ally.draw(this.ctx));
        });
        
        // Draw enemies
        this.enemies.forEach(enemy => {
            drawWithOffset(() => enemy.draw(this.ctx));
        });
        
        // Draw minimap
        this.drawMinimap();
    }
    
    drawMap() {
        // Draw base areas
        this.ctx.fillStyle = 'rgba(0, 0, 100, 0.3)';
        this.ctx.fillRect(0, 0, 400, 400);
        
        this.ctx.fillStyle = 'rgba(100, 0, 0, 0.3)';
        this.ctx.fillRect(this.mapWidth - 400, this.mapHeight - 400, 400, 400);
        
        // Draw lanes
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 5;
        
        // Top lane
        this.ctx.beginPath();
        this.ctx.moveTo(200, 200);
        this.ctx.lineTo(this.mapWidth - 200, this.mapHeight - 200);
        this.ctx.stroke();
        
        // Mid lane
        this.ctx.beginPath();
        this.ctx.moveTo(this.mapWidth / 2, 200);
        this.ctx.lineTo(this.mapWidth / 2, this.mapHeight - 200);
        this.ctx.stroke();
        
        // Bottom lane
        this.ctx.beginPath();
        this.ctx.moveTo(200, this.mapHeight - 200);
        this.ctx.lineTo(this.mapWidth - 200, 200);
        this.ctx.stroke();
        
        // Draw jungle areas
        this.ctx.fillStyle = 'rgba(0, 100, 0, 0.1)';
        this.ctx.fillRect(400, 400, this.mapWidth - 800, this.mapHeight - 800);
    }
    
    drawMinimap() {
        const minimapSize = 150;
        const minimapX = this.canvas.width - minimapSize - 20;
        const minimapY = 20;
        const scale = minimapSize / this.mapWidth;
        
        // Draw minimap background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(minimapX, minimapY, minimapSize, minimapSize);
        
        // Draw map on minimap
        this.ctx.fillStyle = 'rgba(0, 0, 100, 0.5)';
        this.ctx.fillRect(minimapX, minimapY, 400 * scale, 400 * scale);
        
        this.ctx.fillStyle = 'rgba(100, 0, 0, 0.5)';
        this.ctx.fillRect(
            minimapX + (this.mapWidth - 400) * scale,
            minimapY + (this.mapHeight - 400) * scale,
            400 * scale,
            400 * scale
        );
        
        // Draw player on minimap
        if (this.player) {
            this.ctx.fillStyle = 'blue';
            this.ctx.beginPath();
            this.ctx.arc(
                minimapX + this.player.x * scale,
                minimapY + this.player.y * scale,
                3,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        }
        
        // Draw allies on minimap
        this.ctx.fillStyle = 'lightblue';
        this.allies.forEach(ally => {
            this.ctx.beginPath();
            this.ctx.arc(
                minimapX + ally.x * scale,
                minimapY + ally.y * scale,
                2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
        
        // Draw enemies on minimap
        this.ctx.fillStyle = 'red';
        this.enemies.forEach(enemy => {
            this.ctx.beginPath();
            this.ctx.arc(
                minimapX + enemy.x * scale,
                minimapY + enemy.y * scale,
                2,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
        });
        
        // Draw viewport rectangle
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(
            minimapX + this.cameraX * scale,
            minimapY + this.cameraY * scale,
            this.canvas.width * scale,
            this.canvas.height * scale
        );
    }
}

// Initialize game when loaded
window.addEventListener('load', () => {
    const game = new Game();
});
