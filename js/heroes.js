// Hero data and classes
class Hero {
    constructor(name, role, stats) {
        this.name = name;
        this.role = role;
        this.level = 1;
        this.x = 0;
        this.y = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.health = stats.health;
        this.maxHealth = stats.health;
        this.mana = stats.mana;
        this.maxMana = stats.mana;
        this.attackDamage = stats.attackDamage;
        this.abilityPower = stats.abilityPower;
        this.armor = stats.armor;
        this.magicResist = stats.magicResist;
        this.attackSpeed = stats.attackSpeed;
        this.moveSpeed = stats.moveSpeed;
        this.attackRange = stats.attackRange;
        this.color = Utils.getRandomColor();
        this.radius = 20;
        this.isMoving = false;
        this.team = 0; // 0 for player, 1 for enemy
        this.cooldowns = {};
        this.abilities = [
            { name: 'Ability 1', key: 'Q', cooldown: 5, current: 0 },
            { name: 'Ability 2', key: 'W', cooldown: 8, current: 0 },
            { name: 'Ability 3', key: 'E', cooldown: 10, current: 0 },
            { name: 'Ultimate', key: 'R', cooldown: 30, current: 0 }
        ];
        this.items = [];
        this.lastAttack = 0;
        this.target = null;
        this.isAttacking = false;
        this.kills = 0;
        this.deaths = 0;
        this.assists = 0;
        this.gold = 300;
        this.experience = 0;
    }

    moveTo(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.isMoving = true;
        this.isAttacking = false;
        this.target = null;
    }

    update(deltaTime) {
        // Update cooldowns
        this.abilities.forEach(ability => {
            if (ability.current > 0) {
                ability.current -= deltaTime;
                if (ability.current < 0) ability.current = 0;
            }
        });

        // Movement logic
        if (this.isMoving) {
            const angle = Utils.angleBetween(this.x, this.y, this.targetX, this.targetY);
            const distance = Utils.distance(this.x, this.y, this.targetX, this.targetY);
            const moveDistance = this.moveSpeed * deltaTime;

            if (distance < moveDistance) {
                this.x = this.targetX;
                this.y = this.targetY;
                this.isMoving = false;
            } else {
                this.x += Math.cos(angle) * moveDistance;
                this.y += Math.sin(angle) * moveDistance;
            }
        }

        // Attack logic
        if (this.isAttacking && this.target) {
            const now = Date.now();
            if (now - this.lastAttack > 1000 / this.attackSpeed) {
                this.attack(this.target);
                this.lastAttack = now;
            }

            // Move toward target if out of range
            const distance = Utils.distance(this.x, this.y, this.target.x, this.target.y);
            if (distance > this.attackRange) {
                const angle = Utils.angleBetween(this.x, this.y, this.target.x, this.target.y);
                this.x += Math.cos(angle) * this.moveSpeed * deltaTime * 0.5;
                this.y += Math.sin(angle) * this.moveSpeed * deltaTime * 0.5;
            }
        }
    }

    attack(target) {
        const damage = this.attackDamage;
        target.takeDamage(damage, this);
    }

    takeDamage(amount, source) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die(source);
        }
    }

    die(killer) {
        this.health = 0;
        this.deaths++;
        if (killer) {
            killer.kills++;
            killer.gold += 300;
        }
        // Respawn logic would go here
    }

    castAbility(index) {
        if (index < 0 || index >= this.abilities.length) return false;
        const ability = this.abilities[index];
        
        if (ability.current > 0 || this.mana < 50) return false;
        
        ability.current = ability.cooldown;
        this.mana -= 50;
        
        // Ability effects would go here
        console.log(`Casting ${ability.name}`);
        return true;
    }

    draw(ctx) {
        // Draw hero circle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw team indicator
        ctx.fillStyle = this.team === 0 ? 'blue' : 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Draw health bar
        const healthPercent = this.health / this.maxHealth;
        Utils.drawProgressBar(
            ctx, 
            this.x - this.radius, 
            this.y - this.radius - 10, 
            this.radius * 2, 
            5, 
            healthPercent, 
            healthPercent > 0.5 ? '#2ecc71' : healthPercent > 0.2 ? '#f1c40f' : '#e74c3c'
        );

        // Draw name
        ctx.fillStyle = 'white';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x, this.y + this.radius + 15);
    }
}

// Hero definitions
const HEROES = [
    {
        name: "Alucard",
        role: "Fighter",
        stats: {
            health: 650,
            mana: 200,
            attackDamage: 120,
            abilityPower: 0,
            armor: 25,
            magicResist: 15,
            attackSpeed: 0.9,
            moveSpeed: 260,
            attackRange: 150
        }
    },
    {
        name: "Miya",
        role: "Marksman",
        stats: {
            health: 500,
            mana: 180,
            attackDamage: 150,
            abilityPower: 0,
            armor: 15,
            magicResist: 10,
            attackSpeed: 1.2,
            moveSpeed: 250,
            attackRange: 300
        }
    },
    {
        name: "Eudora",
        role: "Mage",
        stats: {
            health: 450,
            mana: 400,
            attackDamage: 60,
            abilityPower: 150,
            armor: 10,
            magicResist: 30,
            attackSpeed: 0.7,
            moveSpeed: 240,
            attackRange: 200
        }
    },
    {
        name: "Tigreal",
        role: "Tank",
        stats: {
            health: 900,
            mana: 250,
            attackDamage: 80,
            abilityPower: 0,
            armor: 50,
            magicResist: 40,
            attackSpeed: 0.6,
            moveSpeed: 230,
            attackRange: 120
        }
    },
    {
        name: "Franco",
        role: "Support",
        stats: {
            health: 750,
            mana: 300,
            attackDamage: 90,
            abilityPower: 50,
            armor: 35,
            magicResist: 30,
            attackSpeed: 0.7,
            moveSpeed: 240,
            attackRange: 150
        }
    },
    {
        name: "Layla",
        role: "Marksman",
        stats: {
            health: 480,
            mana: 200,
            attackDamage: 160,
            abilityPower: 0,
            armor: 12,
            magicResist: 12,
            attackSpeed: 1.1,
            moveSpeed: 245,
            attackRange: 350
        }
    },
    {
        name: "Zilong",
        role: "Fighter",
        stats: {
            health: 700,
            mana: 220,
            attackDamage: 130,
            abilityPower: 0,
            armor: 30,
            magicResist: 20,
            attackSpeed: 1.0,
            moveSpeed: 270,
            attackRange: 140
        }
    },
    {
        name: "Alice",
        role: "Mage",
        stats: {
            health: 600,
            mana: 350,
            attackDamage: 70,
            abilityPower: 130,
            armor: 20,
            magicResist: 35,
            attackSpeed: 0.8,
            moveSpeed: 245,
            attackRange: 180
        }
    }
];

function createHero(heroData, team = 0) {
    return new Hero(heroData.name, heroData.role, heroData.stats, team);
}
