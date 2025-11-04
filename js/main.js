
// Main entry point for the game
import { GameEngine } from './engine.js';
import { UI } from './ui.js';
import { SaveManager } from './save.js';

class Game {
    constructor() {
        this.engine = null;
        this.ui = null;
        this.saveManager = new SaveManager();
        this.init();
    }

    init() {
        // Check for existing save
        const hasSave = this.saveManager.hasSave();
        
        if (hasSave) {
            this.showWelcomeModal(true);
        } else {
            this.showWelcomeModal(false);
        }

        // Setup event listeners
        this.setupEventListeners();
    }

    showWelcomeModal(hasSave) {
        const modal = document.getElementById('welcome-modal');
        const continueBtn = document.getElementById('btn-continue');
        const newGameBtn = document.getElementById('btn-start-new');

        if (!hasSave) {
            continueBtn.style.display = 'none';
        }

        modal.classList.add('active');

        continueBtn.addEventListener('click', () => {
            this.loadGame();
            modal.classList.remove('active');
        });

        newGameBtn.addEventListener('click', () => {
            this.newGame();
            modal.classList.remove('active');
        });
    }

    newGame() {
        this.engine = new GameEngine();
        this.ui = new UI(this.engine);
        this.engine.start();
        this.ui.log('🌱 Chào mừng đến nông trại mới của bạn!');
        this.ui.log('💡 Hãy bắt đầu bằng cách trồng một số cây trồng.');
    }

    loadGame() {
        const saveData = this.saveManager.load();
        if (saveData) {
            this.engine = new GameEngine(saveData);
            this.ui = new UI(this.engine);
            this.engine.start();
            this.ui.log('📂 Đã tải game thành công!');
        } else {
            this.newGame();
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Footer buttons
        document.getElementById('btn-save').addEventListener('click', () => {
            if (this.engine) {
                this.saveManager.save(this.engine.getGameState());
                this.ui.log('💾 Đã lưu game!');
            }
        });

        document.getElementById('btn-load').addEventListener('click', () => {
            this.loadGame();
        });

        document.getElementById('btn-new-game').addEventListener('click', () => {
            if (confirm('Bạn có chắc muốn bắt đầu game mới? Dữ liệu hiện tại sẽ bị mất.')) {
                this.saveManager.clear();
                location.reload();
            }
        });
    }

    switchTab(tabName) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        document.getElementById(`tab-${tabName}`).classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});