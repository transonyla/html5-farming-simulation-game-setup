
// Weather system and random events
export class Weather {
    constructor(saveData = null) {
        this.current = saveData?.current || 'sunny';
        this.forecast = saveData?.forecast || [];
        this.forcedWeather = null; // Admin can force weather
        this.probabilities = this.loadProbabilities();
    }

    loadProbabilities() {
        const saved = localStorage.getItem('game_weather_prob');
        if (saved) {
            return JSON.parse(saved);
        }
        return {
            sunny: 40,
            rain: 30,
            cloudy: 20,
            storm: 5,
            drought: 5
        };
    }

    generateDailyWeather(season) {
        if (this.forcedWeather) {
            this.current = this.forcedWeather;
            this.forcedWeather = null;
            return;
        }

        // Adjust probabilities by season
        let probs = { ...this.probabilities };
        
        if (season === 'summer') {
            probs.sunny += 20;
            probs.drought += 5;
            probs.rain -= 15;
        } else if (season === 'winter') {
            probs.rain += 15;
            probs.sunny -= 10;
        } else if (season === 'spring') {
            probs.rain += 10;
        }

        // Random selection based on probabilities
        const total = Object.values(probs).reduce((a, b) => a + b, 0);
        let random = Math.random() * total;
        
        for (const [weather, prob] of Object.entries(probs)) {
            random -= prob;
            if (random <= 0) {
                this.current = weather;
                break;
            }
        }

        // Random events (10% chance)
        if (Math.random() < 0.1) {
            this.triggerRandomEvent();
        }
    }

    triggerRandomEvent() {
        const events = ['festival', 'pest', 'lucky', 'market_crash'];
        const event = events[Math.floor(Math.random() * events.length)];
        
        const customEvent = new CustomEvent('randomevent', { detail: event });
        window.dispatchEvent(customEvent);
    }

    getWeatherIcon() {
        const icons = {
            sunny: '☀️',
            rain: '🌧️',
            cloudy: '☁️',
            storm: '⛈️',
            drought: '🌵'
        };
        return icons[this.current] || '☀️';
    }

    getWeatherName() {
        const names = {
            sunny: 'Nắng',
            rain: 'Mưa',
            cloudy: 'Nhiều mây',
            storm: 'Bão',
            drought: 'Hạn hán'
        };
        return names[this.current] || 'Nắng';
    }

    getSaveData() {
        return {
            current: this.current,
            forecast: this.forecast
        };
    }
}