// Search functionality for Finn Time
import { fetchEodData, fetchTickers, fetchExchanges } from './api.js';

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // Cache for search results to improve performance
    let searchCache = {};
    
    // Common stock symbols for quick search
    const commonStocks = [
        'AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT', 'META', 'NFLX', 'NVDA', 
        'JPM', 'V', 'MA', 'WMT', 'PG', 'JNJ', 'XOM', 'CVX', 'KO', 'PEP',
        'SAP.DE', 'BMW.DE', 'DTE.DE', 'BAS.DE', 'SIE.DE',
        'CBA.AX', 'BHP.AX', 'WBC.AX', 'CSL.AX', 'TLS.AX',
        'BP.L', 'VOD.L', 'ENB.TO', 'SU.TO', '7203.T', '9984.T'
    ];
    
    // Country data
    const countries = [
        { name: 'United States', code: 'US', market: 'NYSE', currency: 'USD' },
        { name: 'United Kingdom', code: 'GB', market: 'LSE', currency: 'GBP' },
        { name: 'Germany', code: 'DE', market: 'FWB', currency: 'EUR' },
        { name: 'Japan', code: 'JP', market: 'TSE', currency: 'JPY' },
        { name: 'Canada', code: 'CA', market: 'TSX', currency: 'CAD' },
        { name: 'Australia', code: 'AU', market: 'ASX', currency: 'AUD' },
        { name: 'France', code: 'FR', market: 'Euronext', currency: 'EUR' },
        { name: 'China', code: 'CN', market: 'SSE', currency: 'CNY' },
        { name: 'India', code: 'IN', market: 'BSE', currency: 'INR' },
        { name: 'Brazil', code: 'BR', market: 'B3', currency: 'BRL' }
    ];
    
    // Handle search form submission
    searchForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim();
        const filter = document.getElementById('search-filter').value;
        
        if (searchTerm.length < 1) {
            return;
        }
        
        // Show loading state
        searchResults.innerHTML = `
            <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">Searching for "${searchTerm}"...</p>
            </div>
        `;
        
        await performSearch(searchTerm, filter);
    });
    
    // Perform search based on term and filter
    async function performSearch(term, filter) {
        try {
            let results = [];
            
            // Check cache first
            const cacheKey = `${term}-${filter}`;
            if (searchCache[cacheKey]) {
                displayResults(searchCache[cacheKey], term);
                return;
            }
            
            if (filter === 'all' || filter === 'stocks' || filter === 'companies') {
                // Search stocks using API
                const stockResults = await searchStocks(term);
                results = results.concat(stockResults);
            }
            
            if (filter === 'all' || filter === 'countries') {
                // Search countries
                const countryResults = countries.filter(country => 
                    country.name.toLowerCase().includes(term.toLowerCase()) || 
                    country.code.toLowerCase().includes(term.toLowerCase()) || 
                    country.market.toLowerCase().includes(term.toLowerCase())
                );
                results = results.concat(countryResults.map(country => ({
                    ...country,
                    type: 'country'
                })));
            }
            
            // Cache results
            searchCache[cacheKey] = results;
            
            displayResults(results, term);
        } catch (error) {
            console.error('Search error:', error);
            searchResults.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h5>Error occurred during search</h5>
                    <p class="text-muted">Please try again later</p>
                </div>
            `;
        }
    }
    
    // Search stocks using MarketStack API
    async function searchStocks(term) {
        try {
            // First try exact symbol match
            if (commonStocks.includes(term.toUpperCase())) {
                const data = await fetchEodData(term.toUpperCase(), 1);
                if (data && data.data && data.data.length > 0) {
                    const stock = data.data[0];
                    return [{
                        symbol: stock.symbol,
                        name: getCompanyName(stock.symbol),
                        price: stock.close,
                        change: stock.close - stock.open,
                        changePercent: ((stock.close - stock.open) / stock.open) * 100
                    }];
                }
            }
            
            // For broader searches, we'll use common stocks as examples
            // In a production app, you would use a search endpoint
            const searchTerm = term.toLowerCase();
            const matchingStocks = commonStocks.filter(symbol => 
                symbol.toLowerCase().includes(searchTerm)
            ).slice(0, 5); // Limit to 5 results
            
            if (matchingStocks.length > 0) {
                // Fetch data for matching stocks
                const stockData = [];
                for (const symbol of matchingStocks) {
                    try {
                        const data = await fetchEodData(symbol, 1);
                        if (data && data.data && data.data.length > 0) {
                            const stock = data.data[0];
                            stockData.push({
                                symbol: stock.symbol,
                                name: getCompanyName(stock.symbol),
                                price: stock.close,
                                change: stock.close - stock.open,
                                changePercent: ((stock.close - stock.open) / stock.open) * 100
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching data for ${symbol}:`, error);
                    }
                }
                return stockData;
            }
            
            return [];
        } catch (error) {
            console.error('Stock search error:', error);
            return [];
        }
    }
    
    // Get company name for a stock symbol
    function getCompanyName(symbol) {
        const companyNames = {
            // US Stocks
            'AAPL': 'Apple Inc.',
            'TSLA': 'Tesla Inc.',
            'GOOGL': 'Alphabet Inc.',
            'AMZN': 'Amazon.com Inc.',
            'MSFT': 'Microsoft Corp.',
            'META': 'Meta Platforms Inc.',
            'NFLX': 'Netflix Inc.',
            'NVDA': 'NVIDIA Corp.',
            'JPM': 'JPMorgan Chase & Co.',
            'V': 'Visa Inc.',
            'MA': 'Mastercard Inc.',
            'WMT': 'Walmart Inc.',
            'PG': 'Procter & Gamble Co.',
            'JNJ': 'Johnson & Johnson',
            'XOM': 'Exxon Mobil Corp.',
            'CVX': 'Chevron Corp.',
            'KO': 'The Coca-Cola Co.',
            'PEP': 'PepsiCo Inc.',
            
            // German Stocks
            'SAP.DE': 'SAP SE',
            'BMW.DE': 'Bayerische Motoren Werke',
            'DTE.DE': 'Deutsche Telekom',
            'BAS.DE': 'BASF SE',
            'SIE.DE': 'Siemens AG',
            
            // Australian Stocks
            'CBA.AX': 'Commonwealth Bank',
            'BHP.AX': 'BHP Group',
            'WBC.AX': 'Westpac Banking',
            'CSL.AX': 'CSL Limited',
            'TLS.AX': 'Telstra',
            
            // Other countries
            'BP.L': 'BP plc',
            'VOD.L': 'Vodafone Group',
            'ENB.TO': 'Enbridge Inc.',
            'SU.TO': 'Suncor Energy',
            '7203.T': 'Toyota Motor',
            '9984.T': 'SoftBank Group'
        };
        
        return companyNames[symbol] || symbol;
    }
    
    // Display search results
    function displayResults(results, searchTerm) {
        if (results.length === 0) {
            searchResults.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5>No results found for "${searchTerm}"</h5>
                    <p class="text-muted">Try different keywords or check your spelling</p>
                </div>
            `;
            return;
        }
        
        let html = `
            <div class="table-responsive">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Symbol/Name</th>
                            <th>Name/Country</th>
                            <th>Price/Market</th>
                            <th>Change</th>
                            <th>Change %</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        results.forEach(item => {
            if (item.type === 'country') {
                // Display country result
                html += `
                    <tr>
                        <td><strong>${item.code}</strong></td>
                        <td>${item.name}</td>
                        <td>${item.market}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewCountry('${item.code}')" title="View Market">
                                <i class="fas fa-eye"></i>
                            </button>
                        </td>
                    </tr>
                `;
            } else {
                // Display stock result
                const isPositive = item.change >= 0;
                const changeClass = isPositive ? 'text-success' : 'text-danger';
                const changeIcon = isPositive ? 'fa-arrow-up' : 'fa-arrow-down';
                
                html += `
                    <tr>
                        <td><strong class="${changeClass}">${item.symbol}</strong></td>
                        <td>${item.name}</td>
                        <td>$${item.price.toFixed(2)}</td>
                        <td class="${changeClass}">${isPositive ? '+' : ''}${item.change.toFixed(2)}</td>
                        <td class="${changeClass}">${isPositive ? '+' : ''}${item.changePercent.toFixed(2)}%</td>
                        <td>
                            <button class="btn btn-sm btn-outline-primary" onclick="viewStock('${item.symbol}')" title="View Stock Details">
                                <i class="fas fa-chart-line"></i>
                            </button>
                        </td>
                    </tr>
                `;
            }
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        searchResults.innerHTML = html;
    }
    
    // Function to view stock details
    window.viewStock = function(symbol) {
        // Redirect to stock details page with symbol parameter
        window.location.href = `stock.html?symbol=${symbol}`;
    };
    
    // Function to view country market
    window.viewCountry = function(countryCode) {
        // Redirect to market page with country parameter
        window.location.href = `index.html?country=${countryCode}`;
    };
});

// Add search link to all pages
document.addEventListener('DOMContentLoaded', function() {
    // Add search to navbar
    const navLinks = document.querySelectorAll('.nav.flex-column');
    if (navLinks.length > 0) {
        const searchNavItem = document.createElement('li');
        searchNavItem.className = 'nav-item';
        searchNavItem.innerHTML = `
            <a class="nav-link" href="search.html">
                <i class="fas fa-search me-2"></i>Search
            </a>
        `;
        // Insert before the register/login section
        navLinks[0].insertBefore(searchNavItem, navLinks[0].lastElementChild);
    }
});