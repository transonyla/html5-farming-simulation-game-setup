
// Crop definitions and growth logic
export class CropManager {
    constructor() {
        this.crops = this.loadCrops();
    }

    loadCrops() {
        // Load from localStorage (admin can modify) or use defaults
        const saved = localStorage.getItem('game_crops');
        if (saved) {
            return JSON.parse(saved);
        }
        return this.getDefaultCrops();
    }

    getDefaultCrops() {
        return {
            'wheat': {
                id: 'wheat',
                name: 'Lúa mì',
                growthTime: 4,
                seedCost: 50,
                sellPrice: 150,
                waterFrequency: 1,
                seasons: ['spring', 'autumn'],
                icon: '🌾'
            },
            'corn': {
                id: 'corn',
                name: 'Ngô',
                growthTime: 6,
                seedCost: 80,
                sellPrice: 250,
                waterFrequency: 1,
                seasons: ['summer'],
                icon: '🌽'
            },
            'tomato': {
                id: 'tomato',
                name: 'Cà chua',
                growthTime: 5,
                seedCost: 60,
                sellPrice: 200,
                waterFrequency: 1,
                seasons: ['spring', 'summer'],
                icon: '🍅'
            },
            'potato': {
                id: 'potato',
                name: 'Khoai tây',
                growthTime: 7,
                seedCost: 70,
                sellPrice: 220,
                waterFrequency: 2,
                seasons: ['spring', 'autumn', 'winter'],
                icon: '🥔'
            },
            'carrot': {
                id: 'carrot',
                name: 'Cà rốt',
                growthTime: 5,
                seedCost: 55,
                sellPrice: 180,
                waterFrequency: 1,
                seasons: ['spring', 'autumn', 'winter'],
                icon: '🥕'
            },
            'strawberry': {
                id: 'strawberry',
                name: 'Dâu tây',
                growthTime: 8,
                seedCost: 120,
                sellPrice: 400,
                waterFrequency: 1,
                seasons: ['spring'],
                icon: '🍓'
            }
        };
    }

    getCrop(cropId) {
        return this.crops[cropId];
    }

    getAllCrops() {
        return Object.values(this.crops);
    }

    addOrUpdateCrop(cropData) {
        this.crops[cropData.id] = cropData;
        this.saveCrops();
    }

    saveCrops() {
        localStorage.setItem('game_crops', JSON.stringify(this.crops));
    }
}