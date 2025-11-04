
// UI management and rendering
export class UI {
    constructor(engine) {
        this.engine = engine;
        this.canvas = document.getElementById('farm-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.tileSize = 60;
        this.offsetX = 0;
        this.offsetY = 0;
        this.selectedTile = null;
        
        this.setupEventListeners();
        this.startRendering();
    }

    setupEventListeners() {
        // Game update listener
        window.addEventListener('gameupdate', (e) => {
            this.updateDisplay(e.detail);
        });

        // Canvas click
        this.canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e);
        });

        // Action buttons
        document.getElementById('btn-plant').addEventListener('click', () => this.plantCrop());
        document.getElementById('btn-water').addEventListener('click', () => this.waterCrop());
        document.getElementById('btn-harvest').addEventListener('click', () => this.harvestCrop());
        document.getElementById('btn-sleep').addEventListener('click', () => this.sleep());
        document.getElementById('btn-feed-animals').addEventListener('click', () => this.feedAnimals());
        document.getElementById('btn-collect').addEventListener('click', () => this.collectProducts());

        // Shop
        this.setupShop();
        
        // Inventory
        this.updateInventory();
    }

    updateDisplay(data) {
        // Update header stats
        document.querySelector('#money-display strong').textContent = `${data.player.money}đ`;
        document.querySelector('#level-display strong').textContent = data.player.level;
        document.querySelector('#stamina-display strong').textContent = 
            `${Math.floor(data.player.stamina)}/${data.player.maxStamina}`;

        // Update time/weather
        document.getElementById('day-number').textContent = data.day;
        document.getElementById('season').textContent = this.getSeasonName(data.season);
        document.getElementById('time-display').textContent = 
            `${String(data.hour).padStart(2, '0')}:${String(data.minute).padStart(2, '0')}`;
        document.getElementById('weather-text').textContent = data.weather;
    }

    getSeasonName(season) {
        const names = {
            spring: 'Xuân',
            summer: 'Hạ',
            autumn: 'Thu',
            winter: 'Đông'
        };
        return names[season] || season;
    }

    startRendering() {
        this.render();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw farm tiles
        this.engine.farm.tiles.forEach(tile => {
            this.drawTile(tile);
        });

        requestAnimationFrame(() => this.render());
    }

    drawTile(tile) {
        const x = tile.x * this.tileSize + this.offsetX;
        const y = tile.y * this.tileSize + this.offsetY;

        // Tile background
        this.ctx.fillStyle = tile.watered ? '#7cb342' : '#9ccc65';
        this.ctx.fillRect(x, y, this.tileSize - 2, this.tileSize - 2);

        // Border
        this.ctx.strokeStyle = '#558b2f';
        this.ctx.strokeRect(x, y, this.tileSize - 2, this.tileSize - 2);

        // Crop
        if (tile.crop) {
            const crop = this.engine.farm.cropManager.getCrop(tile.crop);
            if (crop) {
                const progress = tile.growth / crop.growthTime;
                
                // Growth stages
                this.ctx.fillStyle = progress >= 1 ? '#ffd700' : '#8bc34a';
                this.ctx.font = '30px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                
                if (progress >= 1) {
                    this.ctx.fillText(crop.icon, x + this.tileSize / 2, y + this.tileSize / 2);
                } else if (progress >= 0.66) {
                    this.ctx.fillText('🌿', x + this.tileSize / 2, y + this.tileSize / 2);
                } else if (progress >= 0.33) {
                    this.ctx.fillText('🌱', x + this.tileSize / 2, y + this.tileSize / 2);
                } else {
                    this.ctx.fillText('🌾', x + this.tileSize / 2, y + this.tileSize / 2);
                }
            }
        }

        // Selection highlight
        if (this.selectedTile && this.selectedTile.x === tile.x && this.selectedTile.y === tile.y) {
            this.ctx.strokeStyle = '#ff9800';
            this.ctx.lineWidth = 3;
            this.ctx.strokeRect(x, y, this.tileSize - 2, this.tileSize - 2);
            this.ctx.lineWidth = 1;
        }
    }

    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const tileX = Math.floor((clickX - this.offsetX) / this.tileSize);
        const tileY = Math.floor((clickY - this.offsetY) / this.tileSize);

        this.selectedTile = this.engine.farm.getTile(tileX, tileY);
        this.log(`Đã chọn ô đất (${tileX}, ${tileY})`);
    }

    plantCrop() {
        if (!this.selectedTile) {
            this.log('⚠️ Vui lòng chọn một ô đất trước!');
            return;
        }

        // Show crop selection (simplified - use first available crop)
        const crops = this.engine.farm.cropManager.getAllCrops();
        const crop = crops[0];
        
        if (this.engine.player.spendMoney(crop.seedCost)) {
            if (this.engine.farm.plantCrop(this.selectedTile.x, this.selectedTile.y, crop.id, this.engine.currentDay)) {
                this.log(`🌱 Đã trồng ${crop.name}!`);
            }
        } else {
            this.log('⚠️ Không đủ tiền mua hạt giống!');
        }
    }

    waterCrop() {
        if (!this.selectedTile) {
            this.log('⚠️ Vui lòng chọn một ô đất trước!');
            return;
        }

        if (this.engine.player.useStamina(5)) {
            if (this.engine.farm.waterTile(this.selectedTile.x, this.selectedTile.y, this.engine.currentDay)) {
                this.log('💧 Đã tưới nước!');
            }
        } else {
            this.log('⚠️ Không đủ thể lực!');
        }
    }

    harvestCrop() {
        if (!this.selectedTile) {
            this.log('⚠️ Vui lòng chọn một ô đất trước!');
            return;
        }

        const result = this.engine.farm.harvestCrop(this.selectedTile.x, this.selectedTile.y);
        if (result) {
            this.engine.player.addItem(result.cropId, result.quantity);
            this.engine.player.addExperience(10);
            this.log(`🌾 Đã thu hoạch ${result.quantity} ${result.cropId}!`);
            this.updateInventory();
        } else {
            this.log('⚠️ Cây chưa chín hoặc không có cây!');
        }
    }

    sleep() {
        this.engine.sleep();
        this.log('😴 Ngủ ngon! Ngày mới bắt đầu.');
    }

    feedAnimals() {
        this.log('🥕 Đã cho tất cả vật nuôi ăn!');
    }

    collectProducts() {
        this.log('🥚 Đã thu thập sản phẩm từ vật nuôi!');
    }

    setupShop() {
        const categories = document.querySelectorAll('.shop-cat-btn');
        categories.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categories.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.updateShop(e.target.dataset.category);
            });
        });

        this.updateShop('seeds');
    }

    updateShop(category) {
        const container = document.getElementById('shop-items');
        container.innerHTML = '';

        if (category === 'seeds') {
            const crops = this.engine.farm.cropManager.getAllCrops();
            crops.forEach(crop => {
                const item = document.createElement('div');
                item.className = 'shop-item';
                item.innerHTML = `
                    <div>
                        <strong>${crop.icon} ${crop.name}</strong><br>
                        <small>Giá: ${crop.seedCost}đ | Thu: ${crop.sellPrice}đ</small>
                    </div>
                    <button data-crop="${crop.id}">Mua</button>
                `;
                item.querySelector('button').addEventListener('click', () => {
                    if (this.engine.player.spendMoney(crop.seedCost)) {
                        this.engine.player.addItem(`seed_${crop.id}`, 1);
                        this.log(`✅ Đã mua hạt giống ${crop.name}!`);
                        this.updateInventory();
                    } else {
                        this.log('⚠️ Không đủ tiền!');
                    }
                });
                container.appendChild(item);
            });
        }
    }

    updateInventory() {
        const container = document.getElementById('inventory-list');
        container.innerHTML = '';

        Object.entries(this.engine.player.inventory).forEach(([item, qty]) => {
            const div = document.createElement('div');
            div.className = 'inventory-item';
            div.innerHTML = `<strong>${item}</strong>: ${qty}`;
            container.appendChild(div);
        });
    }

    log(message) {
        const logContainer = document.getElementById('log-messages');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${new Date().toLocaleTimeString('vi-VN')}] ${message}`;
        logContainer.insertBefore(entry, logContainer.firstChild);

        // Keep only last 20 entries
        while (logContainer.children.length > 20) {
            logContainer.removeChild(logContainer.lastChild);
        }
    }
}