// Item data and classes
class Item {
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
        this.cost = stats.cost || 500;
    }
}

const ITEMS = [
    {
        name: "Blade of Despair",
        stats: {
            attackDamage: 170,
            cost: 3000
        }
    },
    {
        name: "Bloodlust Axe",
        stats: {
            attackDamage: 70,
            abilityPower: 30,
            cost: 2000
        }
    },
    {
        name: "Demon Shoes",
        stats: {
            moveSpeed: 40,
            manaRegen: 10,
            cost: 800
        }
    },
    {
        name: "Immortality",
        stats: {
            armor: 40,
            magicResist: 40,
            health: 200,
            cost: 2500
        }
    },
    {
        name: "Lightning Truncheon",
        stats: {
            abilityPower: 100,
            mana: 300,
            cost: 2200
        }
    },
    {
        name: "Warrior Boots",
        stats: {
            armor: 25,
            moveSpeed: 45,
            cost: 900
        }
    }
];

function createItem(itemData) {
    return new Item(itemData.name, itemData.stats);
}
