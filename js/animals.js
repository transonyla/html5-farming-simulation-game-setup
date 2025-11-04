
// Animal definitions and behavior
export class AnimalManager {
    constructor(saveData = null) {
        this.animalTypes = this.loadAnimalTypes();
        this.animals = saveData?.animals || [];
        this.nextId = saveData?.nextId || 1;
    }

    loadAnimalTypes() {
        const saved = localStorage.getItem('game_animals');
        if (saved) {
            return JSON.parse(saved);
        }
        return this.getDefaultAnimalTypes();
    }

    getDefaultAnimalTypes() {
        return {
            'chicken': {
                id: 'chicken',
                name: 'Gà',
                price: 500,
                product: 'egg',
                productName: 'Trứng',
                productValue: 50,
                productionRate: 1, // days
                foodNeed: 1,
                icon: '🐔'
            },
            'cow': {
                id: 'cow',
                name: 'Bò',
                price: 2000,
                product: 'milk',
                productName: 'Sữa',
                productValue: 150,
                productionRate: 2,
                foodNeed: 3,
                icon: '🐄'
            },
            'pig': {
                id: 'pig',
                name: 'Lợn',
                price: 1500,
                product: 'meat',
                productName: 'Thịt',
                productValue: 300,
                productionRate: 5,
                foodNeed: 2,
                icon: '🐷'
            },
            'sheep': {
                id: 'sheep',
                name: 'Cừu',
                price: 1800,
                product: 'wool',
                productName: 'Len',
                productValue: 200,
                productionRate: 3,
                foodNeed: 2,
                icon: '양'
            }
        };
    }

    buyAnimal(typeId) {
        const type = this.animalTypes[typeId];
        if (type) {
            const animal = {
                id: this.nextId++,
                type: typeId,
                hunger: 100,
                happiness: 100,
                health: 100,
                daysSinceProduction: 0,
                age: 0
            };
            this.animals.push(animal);
            return animal;
        }
        return null;
    }

    feedAnimal(animalId) {
        const animal = this.animals.find(a => a.id === animalId);
        if (animal) {
            animal.hunger = Math.min(100, animal.hunger + 30);
            animal.happiness = Math.min(100, animal.happiness + 10);
            return true;
        }
        return false;
    }

    collectProduct(animalId) {
        const animal = this.animals.find(a => a.id === animalId);
        if (animal) {
            const type = this.animalTypes[animal.type];
            if (animal.daysSinceProduction >= type.productionRate && animal.health > 50) {
                animal.daysSinceProduction = 0;
                return {
                    product: type.product,
                    name: type.productName,
                    value: type.productValue
                };
            }
        }
        return null;
    }

    updateDaily(weather) {
        this.animals.forEach(animal => {
            const type = this.animalTypes[animal.type];
            
            // Age
            animal.age++;
            
            // Hunger decreases
            animal.hunger = Math.max(0, animal.hunger - type.foodNeed * 10);
            
            // Happiness affected by hunger and weather
            if (animal.hunger < 30) {
                animal.happiness = Math.max(0, animal.happiness - 20);
            }
            if (weather === 'storm') {
                animal.happiness = Math.max(0, animal.happiness - 10);
            }
            
            // Health affected by hunger and happiness
            if (animal.hunger < 20 || animal.happiness < 20) {
                animal.health = Math.max(0, animal.health - 15);
            } else if (animal.hunger > 70 && animal.happiness > 70) {
                animal.health = Math.min(100, animal.health + 5);
            }
            
            // Production counter
            if (animal.health > 30) {
                animal.daysSinceProduction++;
            }
        });
    }

    getSaveData() {
        return {
            animals: this.animals,
            nextId: this.nextId
        };
    }
}