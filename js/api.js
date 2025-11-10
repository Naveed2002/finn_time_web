// API Utility for Finn Time - Centralized MarketStack API handling
//c5bf59d21f1b87564b98cbe0cbef6c45
const API_KEY = 'c5bf59d21f1b87564b98cbe0cbef6c45'; // MarketStack API key
const BASE_URL = 'http://api.marketstack.com/v1'; // website (marketstack)

// Rate limiting constants
const RATE_LIMIT_DELAY = 1000; // 1 second between requests to avoid rate limiting
let lastRequestTime = 0;

/**
 * Delay function to respect API rate limits
 */
async function respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
        const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
        console.log(`Rate limiting: waiting ${delay}ms before next request`);
        await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    lastRequestTime = Date.now();
}

/**
 * Fetch data from MarketStack API with rate limiting
 * @param {string} endpoint - API endpoint
 * @param {Object} params - Additional parameters for the API call
 * @returns {Promise<Object>} - API response data
 */
async function fetchFromMarketStack(endpoint, params = {}) {
    try {
        // Respect rate limiting
        await respectRateLimit();
        
        // Build query parameters
        const queryParams = new URLSearchParams({
            access_key: API_KEY,
            ...params
        });
        
        // MarketStack uses HTTP, so we need to be careful about mixed content
        const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;
        console.log(`Fetching from MarketStack: ${url}`);
        
        const response = await fetch(url);
        
        console.log(`MarketStack response status: ${response.status}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API request failed with status ${response.status}: ${errorText}`);
            throw new Error(`API request failed with status ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log(`MarketStack response data:`, data);
        
        // Check for API errors
        if (data.error) {
            console.error(`MarketStack API error:`, data.error);
            throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        console.error('Error fetching from MarketStack:', error);
        throw error;
    }
}

/**
 * Fetch end-of-day data for stock symbols
 * @param {string|array} symbols - Stock symbol(s)
 * @param {number} limit - Number of data points to return
 * @returns {Promise<Object>} - EOD data
 */
async function fetchEodData(symbols, limit = 1) {
    // Convert single symbol to array
    const symbolArray = Array.isArray(symbols) ? symbols : [symbols];
    const symbolString = symbolArray.join(',');
    
    return await fetchFromMarketStack('/eod', { 
        symbols: symbolString, 
        limit 
    });
}

/**
 * Fetch intraday data for a stock symbol
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval (1min, 5min, 15min, 30min, 1hour, 3hour, 6hour, 12hour, 24hour)
 * @param {number} limit - Number of data points to return
 * @returns {Promise<Object>} - Intraday data
 */
async function fetchIntradayData(symbol, interval = '1hour', limit = 10) {
    return await fetchFromMarketStack('/intraday', { 
        symbols: symbol, 
        interval,
        limit
    });
}

/**
 * Fetch stock tickers
 * @param {string} exchange - Exchange code
 * @param {number} limit - Number of tickers to return
 * @returns {Promise<Object>} - Tickers data
 */
async function fetchTickers(exchange = 'XNAS', limit = 10) {
    return await fetchFromMarketStack('/tickers', { 
        exchange,
        limit
    });
}

/**
 * Fetch stock exchanges
 * @param {number} limit - Number of exchanges to return
 * @returns {Promise<Object>} - Exchanges data
 */
async function fetchExchanges(limit = 10) {
    return await fetchFromMarketStack('/exchanges', { limit });
}

// Export functions for use in other modules
export {
    fetchEodData,
    fetchIntradayData,
    fetchTickers,
    fetchExchanges
};