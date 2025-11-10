// Main JavaScript File for Finn Time
// Note: Stock data fetching has been moved to dashboard.js

// DOM Elements
const locationInfo = document.getElementById('location-info');
const dateTimeInfo = document.getElementById('date-time-info');

// Add fade-in animation to elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Detect user location on page load
    ipLookUp();
    
    // Update date and time display
    updateDateTimeDisplay();
    // Update date and time every minute
    setInterval(updateDateTimeDisplay, 60000);
});

function ipLookUp () {
  $.ajax({
      url: 'https://ipapi.co/json/',
      method: 'GET',
      success: function(response) {
          console.log('User\'s Location Data is ', response);
          console.log('User\'s Country', response.country_name);
          
          // Get country flag emoji (simple approach using country code)
          const countryCode = response.country_code || 'GLOBAL';
          const flagEmoji = getFlagEmoji(countryCode);
          
          // Update location info with animation - only show country with flag in round container
          locationInfo.innerHTML = `
              <span class="flag-container">${flagEmoji}</span>${response.country_name || 'Global Markets'}
          `;
          locationInfo.className = 'mb-4 fade-in text-success';
          
          // Store location data for use in other parts of the app
          window.userLocation = {
              country: response.country_name,
              city: response.city,
              countryCode: response.country_code
          };
          
          // Update market trend title with location
          updateMarketTrendTitle(response.country_name || 'Global Markets');
      },
      error: function(xhr, status, error) {
          console.log('Request failed. Returned status of', status);
          locationInfo.innerHTML = `
              <span class="flag-container">🌍</span>Global Markets
          `;
          locationInfo.className = 'mb-4 fade-in text-warning';
          
          // Update market trend title for global markets
          updateMarketTrendTitle('Global Markets');
      }
  });
}

// Get country code from country name
function getCountryCode(countryName) {
    const countryCodes = {
        'United States': 'US',
        'United Kingdom': 'GB',
        'Sri Lanka': 'LK',
        'India': 'IN',
        'Canada': 'CA',
        'Australia': 'AU',
        'Germany': 'DE',
        'France': 'FR',
        'Japan': 'JP',
        'China': 'CN',
        'Brazil': 'BR',
        'Russia': 'RU',
        'South Africa': 'ZA',
        'Mexico': 'MX',
        'South Korea': 'KR',
        'Indonesia': 'ID',
        'Turkey': 'TR',
        'Saudi Arabia': 'SA',
        'Netherlands': 'NL',
        'Switzerland': 'CH',
        'Sweden': 'SE',
        'Norway': 'NO',
        'Denmark': 'DK',
        'Finland': 'FI',
        'Singapore': 'SG',
        'Malaysia': 'MY',
        'Thailand': 'TH',
        'Vietnam': 'VN',
        'Philippines': 'PH',
        'New Zealand': 'NZ',
        'Argentina': 'AR',
        'Chile': 'CL',
        'Colombia': 'CO',
        'Peru': 'PE',
        'Egypt': 'EG',
        'Nigeria': 'NG',
        'Kenya': 'KE',
        'Ghana': 'GH',
        'Morocco': 'MA',
        'Ukraine': 'UA',
        'Poland': 'PL',
        'Czech Republic': 'CZ',
        'Hungary': 'HU',
        'Romania': 'RO',
        'Portugal': 'PT',
        'Greece': 'GR',
        'Israel': 'IL',
        'United Arab Emirates': 'AE'
    };
    
    return countryCodes[countryName] || 'GLOBAL';
}

// Convert country code to flag emoji
function getFlagEmoji(countryCode) {
    if (countryCode === 'GLOBAL') return '🌍';
    
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt());
    
    return String.fromCodePoint(...codePoints);
}

// Update market trend title with location
function updateMarketTrendTitle(country) {
    const marketTrendTitle = document.getElementById('market-trend-title');
    if (marketTrendTitle) {
        marketTrendTitle.innerHTML = `<i class="fas fa-chart-line me-2"></i>Market Trend Analysis for ${country}`;
    }
}

// Update date and time display
function updateDateTimeDisplay() {
    const now = new Date();
    
    // Format date and time
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    };
    
    const dateString = now.toLocaleDateString('en-US', dateOptions);
    const timeString = now.toLocaleTimeString('en-US', timeOptions);
    
    // Update date/time display if element exists
    if (dateTimeInfo) {
        dateTimeInfo.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="fas fa-calendar-alt me-2"></i>
                <span>${dateString}</span>
                <i class="fas fa-clock ms-3 me-2"></i>
                <span>${timeString}</span>
            </div>
        `;
        dateTimeInfo.className = 'mb-2 fade-in text-info';
    }
}

// Export functions for use in other modules
window.finnTime = {
    ipLookUp
};