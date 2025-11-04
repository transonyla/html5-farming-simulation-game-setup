
// Save/load system using localStorage
export class SaveManager {
    constructor() {
        this.saveKey = 'farming_game_save';
        this.autoSaveInterval = null;
        this.setupAutoSave();
    }

    setupAutoSave() {
        window.addEventListener('autosave', (e) => {
            this.save(e.detail);
        });
    }

    save(gameState) {
        try {
            const saveData = {
                version: '1.0',
                timestamp: Date.now(),
                data: gameState
            };
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            return true;
        } catch (e) {
            console.error('Lỗi khi lưu game:', e);
            return false;
        }
    }

    load() {
        try {
            const saved = localStorage.getItem(this.saveKey);
            if (saved) {
                const saveData = JSON.parse(saved);
                return saveData.data;
            }
        } catch (e) {
            console.error('Lỗi khi tải game:', e);
        }
        return null;
    }

    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    clear() {
        localStorage.removeItem(this.saveKey);
    }
}