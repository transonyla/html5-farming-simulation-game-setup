
// Player stats, leveling, and inventory management
export class Player {
    constructor(saveData = null) {
        this.money = saveData?.money || 1000;
        this.stamina = saveData?.stamina || 100;
        this.maxStamina = saveData?.maxStamina || 100;
        this.level = saveData?.level || 1;
        this.experience = saveData?.experience || 0;
        this.experienceToNext = saveData?.experienceToNext || 100;
        
        this.inventory = saveData?.inventory || {};
        this.inventoryCapacity = saveData?.inventoryCapacity || 20;
    }

    update(deltaTime) {
        // Passive stamina regeneration during day
        if (this.stamina < this.maxStamina) {
            this.stamina = Math.min(this.maxStamina, this.stamina + deltaTime * 0.1);
        }
    }

    addMoney(amount) {
        this.money += amount;
        return this.money;
    }

    spendMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        }
        return false;
    }

    useStamina(amount) {
        if (this.stamina >= amount) {
            this.stamina -= amount;
            return true;
        }
        return false;
    }

    restoreStamina() {
        this.stamina = this.maxStamina;
    }

    addExperience(amount) {
        this.experience += amount;
        while (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        this.experience -= this.experienceToNext;
        this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
        this.maxStamina += 10;
        this.stamina = this.maxStamina;
        this.inventoryCapacity += 5;
        
        const event = new CustomEvent('levelup', { detail: this.level });
        window.dispatchEvent(event);
    }

    addItem(itemId, quantity = 1) {
        if (!this.inventory[itemId]) {
            this.inventory[itemId] = 0;
        }
        this.inventory[itemId] += quantity;
    }

    removeItem(itemId, quantity = 1) {
        if (this.inventory[itemId] && this.inventory[itemId] >= quantity) {
            this.inventory[itemId] -= quantity;
            if (this.inventory[itemId] === 0) {
                delete this.inventory[itemId];
            }
            return true;
        }
        return false;
    }

    hasItem(itemId, quantity = 1) {
        return this.inventory[itemId] && this.inventory[itemId] >= quantity;
    }

    getStats() {
        return {
            money: this.money,
            stamina: this.stamina,
            maxStamina: this.maxStamina,
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext
        };
    }

    getSaveData() {
        return {
            money: this.money,
            stamina: this.stamina,
            maxStamina: this.maxStamina,
            level: this.level,
            experience: this.experience,
            experienceToNext: this.experienceToNext,
            inventory: this.inventory,
            inventoryCapacity: this.inventoryCapacity
        };
    }
}