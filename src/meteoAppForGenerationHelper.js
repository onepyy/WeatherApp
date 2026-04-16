({
    // =========================
    // CACHE INIT
    // =========================
    initCache: function(component) {
        component._cache = new Map();
        component._cacheTTL = 10 * 60 * 1000;
    },

    // =========================
    // MAIN LOGIC
    // =========================
    getWeather: function(component, city) {
        const normalizedCity = this.normalizeCity(city);
        const cache = component._cache;

        const cached = cache.get(normalizedCity);

        if (cached && !this.isCacheExpired(component, cached.timestamp)) {
            component.set("v.weather", cached.data);
            component.set("v.error", null);
            return;
        }

        component.set("v.error", null);

        this.fetchCoordinates(city)
            .then(location => {
                return this.fetchWeather(location)
                    .then(weatherData => {
                        return { location, weatherData };
                    });
            })
            .then(result => {
                const mapped = this.mapWeatherData(result.location.name, result.weatherData);

                cache.set(normalizedCity, {
                    data: mapped,
                    timestamp: Date.now()
                });

                component.set("v.weather", mapped);
            })
            .catch(error => {
                console.error('Weather error:', error);

                component.set("v.weather", null);
                component.set("v.error", this.normalizeError(error));
            });
    },

    // =========================
    // API CALLS
    // =========================
    fetchCoordinates: function(city) {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('GEOCODING_API_ERROR');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.results || data.results.length === 0) {
                    throw new Error('CITY_NOT_FOUND');
                }

                const { latitude, longitude, name } = data.results[0];
                return { latitude, longitude, name };
            });
    },

    fetchWeather: function(location) {
        const url = `https://api.open-meteo.com/v1/forecast
            ?latitude=${location.latitude}
            &longitude=${location.longitude}
            &current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,precipitation`
            .replace(/\s+/g, '');

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('WEATHER_API_ERROR');
                }
                return response.json();
            })
            .then(data => {
                if (!data || !data.current) {
                    throw new Error('INVALID_WEATHER_DATA');
                }
                return data.current;
            });
    },

    // =========================
    // DATA MAPPING
    // =========================
    mapWeatherData: function(cityName, data) {
        return {
            name: cityName,
            temperature: this.formatNumber(data.temperature_2m),
            description: this.getWeatherDescription(data.weather_code),
            humidity: this.formatNumber(data.relative_humidity_2m),
            windSpeed: this.formatNumber(data.wind_speed_10m),
            precipitation: this.formatNumber(data.precipitation)
        };
    },

    formatNumber: function(value) {
        return (value !== undefined && value !== null)
            ? Number(value).toFixed(1)
            : 'N/A';
    },

    // =========================
    // HELPERS
    // =========================
    normalizeCity: function(city) {
        return city.trim().toLowerCase();
    },

    isCacheExpired: function(component, timestamp) {
        return (Date.now() - timestamp) > component._cacheTTL;
    },

    resetState: function(component) {
        component.set("v.weather", null);
        component.set("v.error", null);
    },

    normalizeError: function(error) {
        const msg = error.message || '';

        if (msg.includes('CITY_NOT_FOUND')) return 'Città non trovata';
        if (msg.includes('GEOCODING_API_ERROR')) return 'Errore nel recupero coordinate';
        if (msg.includes('WEATHER_API_ERROR')) return 'Errore nel recupero meteo';
        if (msg.includes('INVALID_WEATHER_DATA')) return 'Dati meteo non validi';

        return 'Errore di rete o sistema';
    },

    getWeatherDescription: function(code) {
        const map = {
            0: 'Cielo sereno',
            1: 'Prevalentemente sereno',
            2: 'Parzialmente nuvoloso',
            3: 'Nuvoloso',
            45: 'Nebbia',
            48: 'Nebbia con brina',
            51: 'Pioggerella',
            61: 'Pioggia',
            71: 'Neve',
            80: 'Rovesci'
        };

        return map[code] || 'Condizioni sconosciute';
    }
});
