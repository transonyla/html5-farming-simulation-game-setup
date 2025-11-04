
// Game engine - handles game loop, time system, and core mechanics
import { Player } from './player.js';
import { Farm } from './farm.js';
import { Weather } from './weather.js';
import { Economy } from './economy.js';

export class GameEngine {
    constructor(saveData = null) {
        this.running = false;
        this.lastUpdate = Date.now();
        this.gameSpeed = 1; // 1 = normal, 2 = fast, etc.
        
        // Time system
        this.currentDay = saveData?.currentDay || 1;
        this.currentSeason = saveData?.currentSeason || 'spring';
        this.currentHour = saveData?.currentHour || 6;
        this.currentMinute = saveData?.currentMinute || 0;
        
        // Game systems
        this.player = new Player(saveData?.player);
        this.farm = new Farm(saveData?.farm);
        this.weather = new Weather(saveData?.weather);
        this.economy = new Economy(saveData?.economy);
        
        this.seasons = ['spring', 'summer', 'autumn', 'winter'];
        this.seasonLength = 28; // days per season
    }

    start() {
        this.running = true;
        this.gameLoop();
    }

    stop() {
        this.running = false;
    }

    gameLoop() {
        if (!this.running) return;

        const now = Date.now();
        const deltaTime = (now - this.lastUpdate) / 1000; // seconds
        this.lastUpdate = now;

        this.update(deltaTime);
        
        requestAnimationFrame(() => this.gameLoop());
    }

    update(deltaTime) {
        // Update time (1 real second = 1 game minute by default)
        this.updateTime(deltaTime * this.gameSpeed);
        
        // Update game systems
        this.farm.update(deltaTime, this.currentSeason, this.weather.current);
        this.player.update(deltaTime);
        
        // Trigger UI updates
        this.notifyUIUpdate();
    }

    updateTime(deltaTime) {
        this.currentMinute += deltaTime;
        
        if (this.currentMinute >= 60) {
            this.currentHour += Math.floor(this.currentMinute / 60);
            this.currentMinute = this.currentMinute % 60;
        }
        
        if (this.currentHour >= 24) {
            this.advanceDay();
        }
    }

    advanceDay() {
        this.currentDay++;
        this.currentHour = 6;
        this.currentMinute = 0;
        
        // Check season change
        const dayInSeason = (this.currentDay - 1) % this.seasonLength;
        if (dayInSeason === 0 && this.currentDay > 1) {
            this.advanceSeason();
        }
        
        // Daily updates
        this.weather.generateDailyWeather(this.currentSeason);
        this.economy.updateDailyPrices(this.weather.current);
        this.player.restoreStamina();
        
        // Auto-save
        this.autoSave();
        
        this.notifyDayChange();
    }

    advanceSeason() {
        const currentIndex = this.seasons.indexOf(this.currentSeason);
        this.currentSeason = this.seasons[(currentIndex + 1) % 4];
        this.notifySeasonChange();
    }

    sleep() {
        // End current day
        this.currentDay++;
        this.currentHour = 6;
        this.currentMinute = 0;
        
        this.advanceDay();
    }

    autoSave() {
        // Auto-save will be handled by SaveManager
        const event = new CustomEvent('autosave', { detail: this.getGameState() });
        window.dispatchEvent(event);
    }

    notifyUIUpdate() {
        const event = new CustomEvent('gameupdate', { 
            detail: {
                day: this.currentDay,
                season: this.currentSeason,
                hour: Math.floor(this.currentHour),
                minute: Math.floor(this.currentMinute),
                weather: this.weather.current,
                player: this.player.getStats()
            }
        });
        window.dispatchEvent(event);
    }

    notifyDayChange() {
        const event = new CustomEvent('daychange', { detail: this.currentDay });
        window.dispatchEvent(event);
    }

    notifySeasonChange() {
        const event = new CustomEvent('seasonchange', { detail: this.currentSeason });
        window.dispatchEvent(event);
    }

    getGameState() {
        return {
            currentDay: this.currentDay,
            currentSeason: this.currentSeason,
            currentHour: this.currentHour,
            currentMinute: this.currentMinute,
            player: this.player.getSaveData(),
            farm: this.farm.getSaveData(),
            weather: this.weather.getSaveData(),
            economy: this.economy.getSaveData()
        };
    }
}