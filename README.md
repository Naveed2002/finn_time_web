# Finn Time - Dark Stock Market Web App

A responsive dark-themed stock market web application built with HTML5, CSS3, Bootstrap 5, and vanilla JavaScript.

## Features

- Dark UI theme (black/charcoal background with neon green/red highlights)
- Real-time stock market data display from MarketStack API
- Geolocation detection for location-based market data
- Multiple pages:
  - Home Page: Global stock market overview with interactive charts
  - News & Snapshot Page: Latest business news and company snapshots
  - Detailed Stock Page: In-depth stock data with charts
  - Portfolio Page: Mock portfolio tracker with localStorage
  - Pro Version Page: Pricing plans
  - Register/Login Pages: User authentication forms
  - Search Page: Stock and company search functionality
- Comprehensive test suite for all functionality

## Technologies Used

- HTML5
- CSS3
- Bootstrap 5
- Vanilla JavaScript
- Chart.js for data visualization
- jQuery for AJAX requests
- MarketStack API for real-time stock data

## Project Structure

```
finn_time_web/
├── index.html          # Home page (Dashboard)
├── news.html           # News & Snapshot page
├── stock.html          # Detailed stock page
├── portfolio.html      # Portfolio page
├── pro.html            # Pro Version page
├── register.html       # User registration page
├── login.html          # User login page
├── search.html         # Stock search page
├── css/
│   └── style.css       # Custom dark theme styles
├── js/
│   ├── main.js         # Main JavaScript functionality
│   ├── dashboard.js    # Dashboard page JavaScript
│   ├── news.js         # News page JavaScript
│   ├── stock.js        # Stock detail page JavaScript
│   ├── portfolio.js    # Portfolio page JavaScript
│   ├── pro.js          # Pro version page JavaScript
│   ├── search.js       # Search page JavaScript
│   ├── auth.js         # Authentication functionality
│   ├── api.js          # MarketStack API integration
│   └── mobile-nav.js   # Mobile navigation functionality
├── images/
│   └── mainLogo_st.png # Application logo
└── README.md           # This file
```

## How to Run

1. Simply open `index.html` in a web browser to start using the application
2. No build process or server required
3. The application will automatically detect your location and display relevant market data

## API Integration

This application uses the MarketStack API for real stock data. The API key is configured in `js/api.js`.

To use your own API key:
1. Sign up for a free account at [MarketStack](https://marketstack.com/)
2. Obtain an API key
3. Replace the API key in `js/api.js`
------------------------>this line const API_KEY = '7adda5eeda45da0d7dfc7d6eeadb34ef'; // MarketStack API key


The application implements rate limiting to avoid exceeding API quotas and makes only optimized requests:
- 1 request for market data (3 indices)
- 1 request for stock data (5 stocks)
- Total: Only 2 API requests per page load


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
Replace `images/mainLogo_st.png` with your own logo file.

## Browser Support

This application works best in modern browsers that support:
- ES6 JavaScript
- Fetch API
- LocalStorage
- Geolocation API
- Chart.js

