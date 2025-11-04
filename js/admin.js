
// Admin panel logic
const ADMIN_PASSWORD = 'admin123';

class AdminPanel {
    constructor() {
        this.authenticated = false;
        this.init();
    }

    init() {
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        document.getElementById('btn-logout')?.addEventListener('click', () => {
            this.logout();
        });

        // Forms
        document.getElementById('crop-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCrop();
        });

        document.getElementById('animal-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAnimal();
        });

        document.getElementById('market-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateMarket();
        });

        document.getElementById('weather-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateWeather();
        });

        document.getElementById('player-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updatePlayer();
        });

        this.loadExistingData();
    }

    login() {
        const password = document.getElementById('admin-password').value;
        if (password === ADMIN_PASSWORD) {
            this.authenticated = true;
            document.getElementById('admin-login').style.display = 'none';
            document.getElementById('admin-panel').style.display = 'block';
        } else {
            document.getElementById('login-error').style.display = 'block';
        }
    }

    logout() {
        this.authenticated = false;
        document.getElementById('admin-login').style.display = 'block';
        document.getElementById('admin-panel').style.display = 'none';
        document.getElementById('admin-password').value = '';
    }

    saveCrop() {
        const cropData = {
            id: document.getElementById('crop-name').value.toLowerCase().replace(/\s+/g, '_'),
            name: document.getElementById('crop-name').value,
            growthTime: parseInt(document.getElementById('crop-growth-time').value),
            seedCost: parseInt(document.getElementById('crop-seed-cost').value),
            sellPrice: parseInt(document.getElementById('crop-sell-price').value),
            waterFrequency: parseInt(document.getElementById('crop-water-freq').value),
            seasons: Array.from(document.getElementById('crop-season').selectedOptions).map(o => o.value),
            icon: '🌾'
        };

        const crops = JSON.parse(localStorage.getItem('game_crops') || '{}');
        crops[cropData.id] = cropData;
        localStorage.setItem('game_crops', JSON.stringify(crops));

        alert(`✅ Đã lưu cây trồng: ${cropData.name}`);
        this.loadExistingData();
    }

    saveAnimal() {
        const animalData = {
            id: document.getElementById('animal-name').value.toLowerCase().replace(/\s+/g, '_'),
            name: document.getElementById('animal-name').value,
            price: parseInt(document.getElementById('animal-price').value),
            product: document.getElementById('animal-product').value,
            productName: document.getElementById('animal-product').value,
            productValue: 100,
            productionRate: parseInt(document.getElementById('animal-production-rate').value),
            foodNeed: parseInt(document.getElementById('animal-food-need').value),
            icon: '🐾'
        };

        const animals = JSON.parse(localStorage.getItem('game_animals') || '{}');
        animals[animalData.id] = animalData;
        localStorage.setItem('game_animals', JSON.stringify(animals));

        alert(`✅ Đã lưu vật nuôi: ${animalData.name}`);
        this.loadExistingData();
    }

    updateMarket() {
        const fluctuation = parseFloat(document.getElementById('price-fluctuation').value) / 100;
        const event = document.getElementById('trigger-event').value;

        localStorage.setItem('market_fluctuation', fluctuation.toString());
        if (event) {
            localStorage.setItem('market_event', event);
        }

        alert('✅ Đã cập nhật cài đặt thị trường!');
    }

    updateWeather() {
        const forcedWeather = document.getElementById('force-weather').value;
        const rainProb = document.getElementById('rain-probability').value;

        if (forcedWeather) {
            localStorage.setItem('forced_weather', forcedWeather);
        }
        localStorage.setItem('rain_probability', rainProb);

        alert('✅ Đã cập nhật cài đặt thời tiết!');
    }

    updatePlayer() {
        const addMoney = parseInt(document.getElementById('add-money').value);
        const setLevel = parseInt(document.getElementById('set-level').value);

        const saveData = JSON.parse(localStorage.getItem('farming_game_save') || '{}');
        if (saveData.data) {
            if (addMoney) {
                saveData.data.player.money += addMoney;
            }
            if (setLevel) {
                saveData.data.player.level = setLevel;
            }
            localStorage.setItem('farming_game_save', JSON.stringify(saveData));
            alert('✅ Đã cập nhật tài nguyên người chơi!');
        } else {
            alert('⚠️ Không tìm thấy dữ liệu game!');
        }
    }

    loadExistingData() {
        // Load and display existing crops
        const crops = JSON.parse(localStorage.getItem('game_crops') || '{}');
        const cropsList = document.getElementById('crops-list');
        if (cropsList) {
            cropsList.innerHTML = '<h4>Cây trồng hiện có:</h4>';
            Object.values(crops).forEach(crop => {
                const div = document.createElement('div');
                div.style.padding = '10px';
                div.style.margin = '5px 0';
                div.style.background = '#f0f0f0';
                div.style.borderRadius = '5px';
                div.innerHTML = `<strong>${crop.name}</strong> - ${crop.growthTime} ngày - ${crop.seedCost}đ`;
                cropsList.appendChild(div);
            });
        }

        // Load and display existing animals
        const animals = JSON.parse(localStorage.getItem('game_animals') || '{}');
        const animalsList = document.getElementById('animals-admin-list');
        if (animalsList) {
            animalsList.innerHTML = '<h4>Vật nuôi hiện có:</h4>';
            Object.values(animals).forEach(animal => {
                const div = document.createElement('div');
                div.style.padding = '10px';
                div.style.margin = '5px 0';
                div.style.background = '#f0f0f0';
                div.style.borderRadius = '5px';
                div.innerHTML = `<strong>${animal.name}</strong> - ${animal.price}đ - Sản phẩm: ${animal.productName}`;
                animalsList.appendChild(div);
            });
        }
    }
}

// Initialize admin panel
document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});