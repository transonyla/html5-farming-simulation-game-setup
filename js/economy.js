
// Market and price fluctuation system
export class Economy {
    constructor(saveData = null) {
        this.basePrices = saveData?.basePrices || {};
        this.currentPrices = saveData?.currentPrices || {};
        this.priceHistory = saveData?.priceHistory || [];
        this.fluctuationRange = saveData?.fluctuationRange || 0.2;
        this.specialEvent = null;
    }

    updateDailyPrices(weather) {
        // Update prices with random fluctuation
        Object.keys(this.basePrices).forEach(item => {
            const base = this.basePrices[item];
            let fluctuation = 1 + (Math.random() - 0.5) * 2 * this.fluctuationRange;
            
            // Weather effects
            if (weather === 'drought') fluctuation *= 1.2;
            if (weather === 'rain') fluctuation *= 0.95;
            
            // Special events
            if (this.specialEvent === 'festival') fluctuation *= 1.5;
            if (this.specialEvent === 'market_crash') fluctuation *= 0.5;
            if (this.specialEvent === 'lucky') fluctuation *= 1.3;
            
            this.currentPrices[item] = Math.floor(base * fluctuation);
        });

        // Record history
        this.priceHistory.push({
            day: Date.now(),
            prices: { ...this.currentPrices }
        });

        // Keep only last 30 days
        if (this.priceHistory.length > 30) {
            this.priceHistory.shift();
        }

        // Clear special event
        this.specialEvent = null;
    }

    setSpecialEvent(event) {
        this.specialEvent = event;
    }

    getPrice(itemId) {
        return this.currentPrices[itemId] || this.basePrices[itemId] || 0;
    }

    getSaveData() {
        return {
            basePrices: this.basePrices,
            currentPrices: this.currentPrices,
            priceHistory: this.priceHistory,
            fluctuationRange: this.fluctuationRange
        };
    }
}