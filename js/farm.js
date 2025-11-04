
// Farm management - tiles, planting, watering, harvesting
import { CropManager } from './crops.js';

export class Farm {
    constructor(saveData = null) {
        this.width = saveData?.width || 10;
        this.height = saveData?.height || 8;
        this.tiles = saveData?.tiles || this.initializeTiles();
        this.cropManager = new CropManager();
        this.selectedTile = null;
    }

    initializeTiles() {
        const tiles = [];
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                tiles.push({
                    x,
                    y,
                    crop: null,
                    watered: false,
                    lastWatered: 0,
                    plantedDay: 0,
                    growth: 0,
                    fertilized: false
                });
            }
        }
        return tiles;
    }

    getTile(x, y) {
        return this.tiles.find(t => t.x === x && t.y === y);
    }

    plantCrop(x, y, cropId, currentDay) {
        const tile = this.getTile(x, y);
        if (tile && !tile.crop) {
            tile.crop = cropId;
            tile.plantedDay = currentDay;
            tile.growth = 0;
            tile.watered = false;
            return true;
        }
        return false;
    }

    waterTile(x, y, currentDay) {
        const tile = this.getTile(x, y);
        if (tile && tile.crop) {
            tile.watered = true;
            tile.lastWatered = currentDay;
            return true;
        }
        return false;
    }

    harvestCrop(x, y) {
        const tile = this.getTile(x, y);
        if (tile && tile.crop) {
            const crop = this.cropManager.getCrop(tile.crop);
            if (crop && tile.growth >= crop.growthTime) {
                const harvested = tile.crop;
                tile.crop = null;
                tile.growth = 0;
                tile.watered = false;
                tile.plantedDay = 0;
                return { cropId: harvested, quantity: 1 };
            }
        }
        return null;
    }

    update(deltaTime, season, weather) {
        // Update crop growth (called daily)
        this.tiles.forEach(tile => {
            if (tile.crop) {
                const crop = this.cropManager.getCrop(tile.crop);
                if (crop) {
                    // Check if crop can grow in current season
                    if (!crop.seasons.includes(season)) {
                        tile.growth = Math.max(0, tile.growth - 0.5); // Wither in wrong season
                        return;
                    }

                    // Growth based on watering
                    if (tile.watered) {
                        let growthRate = 1;
                        
                        // Weather modifiers
                        if (weather === 'rain') growthRate *= 1.2;
                        if (weather === 'drought') growthRate *= 0.5;
                        if (weather === 'storm') growthRate *= 0.3;
                        
                        if (tile.fertilized) growthRate *= 1.5;
                        
                        tile.growth += growthRate;
                        tile.watered = false; // Reset watering
                    } else {
                        // Crops can wither without water
                        if (weather !== 'rain') {
                            tile.growth = Math.max(0, tile.growth - 0.2);
                        }
                    }
                }
            }
        });
    }

    getSaveData() {
        return {
            width: this.width,
            height: this.height,
            tiles: this.tiles
        };
    }
}