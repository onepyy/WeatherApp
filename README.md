# 🌦️ Meteo App For Generation – Salesforce Aura Component

## 📌 Overview
**Meteo App For Generation** is a Salesforce Aura component designed to provide real-time weather information for any user-entered city.

It integrates with external APIs to:
- Convert a city name into geographic coordinates (latitude & longitude)
- Retrieve current weather data based on those coordinates

The component is optimized for performance, usability, and scalability within the Salesforce Lightning environment.

---

## ✨ Features
- 🌍 Real-time weather data retrieval
- 📍 Automatic geolocation from city name
- ⚡ Performance optimization with caching (TTL-based)
- 🛡️ Robust error handling
- ⌨️ Flexible input (button click or Enter key)
- 🧩 Modular and maintainable architecture

---

## 🏗️ Architecture
The component follows a clear and efficient data flow:

1. User inputs city name  
2. Geocoding API request  
3. Coordinate extraction  
4. Weather API request  
5. Data mapping & UI rendering  
6. Cache storage for optimization  

---

## 🔌 External APIs

| Service        | Endpoint |
|----------------|----------|
| Geocoding API  | https://geocoding-api.open-meteo.com/v1/search |
| Weather API    | https://api.open-meteo.com/v1/forecast |

---

## 🚀 Installation

### 1. Create Aura Component
Create the following files:
- `meteoAppForGeneration.cmp`
- `meteoAppForGenerationController.js`
- `meteoAppForGenerationHelper.js`
- `meteoAppForGeneration.css`

### 2. Deploy to Salesforce
Use one of the following:
- VS Code + Salesforce CLI (recommended)
- Developer Console

### 3. Add Component to Lightning Page
1. Go to **Setup**
2. Open **Lightning App Builder**
3. Select a page (Home / App / Record)
4. Drag **meteoAppForGeneration** component
5. Save and activate

---

## ⚙️ Configuration – CSP Trusted Sites

To enable external API callouts, configure Trusted Sites:

### ➤ Add Geocoding API
- **Name:** OpenMeteoGeocoding  
- **URL:** https://geocoding-api.open-meteo.com  
- ✅ Enable *Connect Source*

### ➤ Add Weather API
- **Name:** OpenMeteoWeather  
- **URL:** https://api.open-meteo.com  
- ✅ Enable *Connect Source*

### ⚠️ Important
After configuration:
- Perform a hard refresh (CTRL + F5)
- Or restart the session

---

## 🧑‍💻 Usage

### User Flow
1. Enter a city name
2. Press **Search**
3. View real-time weather data

### Behavior
- Empty input → resets data  
- Invalid city → displays error message  
- Network issues → handled gracefully  
- Repeated queries → served from cache (if valid)  

---

## 📊 Sample Output

**Input:**  
`Milan`

**Output:**
- City: Milan  
- Temperature: 22 °C  
- Conditions: Clear sky  
- Humidity: 60%  
- Wind Speed: 10 km/h  
- Precipitation: 0 mm  

---

## ⚠️ Error Handling

| Scenario            | Behavior                          |
|--------------------|----------------------------------|
| City not found     | Displays "City not found"        |
| API error          | Displays specific error message  |
| Network issues     | "Network or system error"        |
| CSP misconfiguration | Console error + failed request |

---

## ⚡ Performance Optimizations
- Minimal API payload (only required fields)
- Client-side caching with TTL
- Reduced API call frequency
- Input validation to prevent unnecessary requests
- Separation of concerns (Controller / Helper)

---

## 🤝 Contributing
This project is designed with extensibility in mind.

Contributions, improvements, and feature extensions are welcome while preserving the modular structure.

---

## 👩‍💻 Author
**Olga Nepyyvoda**

---

## 📄 License
This project is for educational purposes.
