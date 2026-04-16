/**
 * Retrieves and displays current weather data for a given city.
 *
 * This function is the main workflow of the component and coordinates:
 * 1. Fetching geographic coordinates via the Geocoding API
 * 2. Fetching current weather data via the Open-Meteo API
 * 3. Mapping and formatting the data for UI display
 * 4. Caching results to improve performance
 * 5. Handling errors
 *
 * Execution flow:
 * - Normalizes the city name (trim + lowercase)
 * - Checks if data is already available in cache
 *   → If valid and not expired: returns cached data
 *   → Otherwise: performs API calls
 * - Calls fetchCoordinates() to get latitude and longitude
 * - Calls fetchWeather() to get current weather data
 * - Transforms data using mapWeatherData()
 * - Stores result in cache with timestamp
 * - Updates Aura component attributes (v.weather, v.error)
 *
 * Optimization:
 * - Uses in-memory cache (Map) with TTL (Time-To-Live)
 * - Prevents unnecessary repeated API calls for the same city
 *
 * Error handling:
 * - CITY_NOT_FOUND → city not found
 * - GEOCODING_API_ERROR → error retrieving coordinates
 * - WEATHER_API_ERROR → error retrieving weather data
 * - INVALID_WEATHER_DATA → invalid or missing data
 * - Network errors → generic error message
 *
 * @function getWeather
 *
 * @param {Aura.Component} component
 * The current Aura component instance. Used to:
 * - read/write attributes (v.weather, v.error)
 * - access internal cache
 *
 * @param {string} city
 * City name entered by the user (e.g., "Milan")
 *
 * @returns {void}
 * This function does not return a value directly.
 * Instead, it updates the component state:
 *
 * @property {Object} v.weather
 * Object containing formatted weather data:
 * {
 *   name: string,          // City name
 *   temperature: string,   // Temperature in °C (formatted)
 *   description: string,   // Weather description
 *   humidity: string,      // Humidity (%)
 *   windSpeed: string,     // Wind speed (km/h)
 *   precipitation: string  // Precipitation (mm)
 * }
 *
 * @property {string|null} v.error
 * Error message displayed to the user in case of failure
 *
 * @example
 * // Example usage from Aura controller
 * helper.getWeather(component, 'Rome');
 *
 * // Expected result (v.weather):
 * {
 *   name: 'Rome',
 *   temperature: '25.0',
 *   description: 'Clear sky',
 *   humidity: '60.0',
 *   windSpeed: '10.0',
 *   precipitation: '0.0'
 * }
 *
 * @see https://open-meteo.com/
 * API documentation used in this component
 */
({
    doInit: function(component, event, helper) {
        helper.initCache(component);
    },

    handleSearch: function(component, event, helper) {
        component.set("v.hasSearched", true);
    
        const city = component.get("v.cityName");
    
        if (!city || !city.trim()) {
            helper.resetState(component);
            return;
        }
    
        helper.getWeather(component, city);
    },

    //supporto ENTER
    handleKeyUp: function(component, event, helper) {
        if (event.key === 'Enter') {
            this.handleSearch(component, event, helper);
        }
    }
})
