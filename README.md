# Finn Time - Dark Stock Market Web App

A responsive dark-themed stock market web application built with HTML5, CSS3, Bootstrap 5, and vanilla JavaScript.

## Features

- Dark UI theme (black/charcoal background with neon green/red highlights)
- Real-time stock market data display
- Geolocation detection
- Multiple pages:
  - Home Page: Global stock market overview
  - News & Snapshot Page: Latest business news and company snapshots
  - Detailed Stock Page: In-depth stock data with charts
  - Portfolio Page: Mock portfolio tracker with localStorage
  - Pro Version Page: Pricing plans
  - Register/Login Pages: User authentication forms

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- Vanilla JavaScript
- Chart.js for data visualization

## Project Structure

```
finn_time_web/
├── index.html          # Home page
├── news.html           # News & Snapshot page
├── stock.html          # Detailed stock page
├── portfolio.html      # Portfolio page
├── pro.html            # Pro Version page
├── register.html       # User registration page
├── login.html          # User login page
├── css/
│   └── style.css       # Custom dark theme styles
├── js/
│   ├── main.js         # Main JavaScript functionality
│   ├── news.js         # News page JavaScript
│   ├── stock.js        # Stock detail page JavaScript
│   ├── portfolio.js    # Portfolio page JavaScript
│   ├── pro.js          # Pro version page JavaScript
│   └── auth.js         # Authentication functionality
├── images/
│   ├── logo.png        # Application logo (placeholder)
│   └── logo.txt        # Logo placeholder information
└── README.md           # This file
```

## How to Run

1. Simply open `index.html` in a web browser to start using the application
2. No build process or server required
3. All data is currently simulated (no real API integration)

## API Integration

This application is designed to work with the MarketStack API for real stock data. To integrate with a real API:

1. Sign up for a free account at [MarketStack](https://marketstack.com/)
2. Obtain an API key
3. Replace the mock data functions in the JavaScript files with real API calls

Example API integration points:
- `js/main.js` - fetchStockData()
- `js/stock.js` - loadStockData()
- `js/news.js` - (would need to be created for real news)

## Customization

### Theme
The dark theme can be customized by modifying the CSS variables in `css/style.css`:

```css
:root {
  --dark-bg: #121212;
  --dark-card-bg: #1e1e1e;
  --dark-border: #333333;
  --neon-green: #39ff14;
  --neon-red: #ff0033;
  --text-primary: #e0e0e0;
  --text-secondary: #aaaaaa;
}
```

### Logo
Replace `images/logo.png` with your own logo file.

## Browser Support

This application works best in modern browsers that support:
- ES6 JavaScript
- Fetch API
- LocalStorage
- Geolocation API

