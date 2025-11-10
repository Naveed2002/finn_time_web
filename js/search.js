// Search functionality for Finn Time
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    // Sample stock data for search results
    const sampleStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', country: 'United States', price: 182.52, change: 2.10, changePercent: 1.2 },
        { symbol: 'TSLA', name: 'Tesla Inc.', country: 'United States', price: 248.50, change: -1.80, changePercent: -0.8 },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', country: 'United States', price: 139.54, change: 0.72, changePercent: 0.5 },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', country: 'United States', price: 145.86, change: 1.52, changePercent: 1.1 },
        { symbol: 'MSFT', name: 'Microsoft Corp.', country: 'United States', price: 342.50, change: 1.25, changePercent: 0.3 },
        { symbol: 'META', name: 'Meta Platforms Inc.', country: 'United States', price: 325.75, change: -3.20, changePercent: -0.9 },
        { symbol: 'NFLX', name: 'Netflix Inc.', country: 'United States', price: 420.30, change: 5.40, changePercent: 1.3 },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', country: 'United States', price: 456.75, change: 11.25, changePercent: 2.4 },
        { symbol: 'JPM', name: 'JPMorgan Chase & Co.', country: 'United States', price: 165.40, change: -0.80, changePercent: -0.5 },
        { symbol: 'V', name: 'Visa Inc.', country: 'United States', price: 245.60, change: 2.30, changePercent: 0.9 }
    ];
    
    // Sample country data
    const sampleCountries = [
        { name: 'United States', code: 'US', market: 'NYSE', currency: 'USD' },
        { name: 'United Kingdom', code: 'GB', market: 'LSE', currency: 'GBP' },
        { name: 'Germany', code: 'DE', market: 'FWB', currency: 'EUR' },
        { name: 'Japan', code: 'JP', market: 'TSE', currency: 'JPY' },
        { name: 'Canada', code: 'CA', market: 'TSX', currency: 'CAD' },
        { name: 'Australia', code: 'AU', market: 'ASX', currency: 'AUD' },
        { name: 'France', code: 'FR', market: 'Euronext', currency: 'EUR' },
        { name: 'China', code: 'CN', market: 'SSE', currency: 'CNY' }
    ];
    
    // Handle search form submission
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = searchInput.value.trim().toLowerCase();
        const filter = document.getElementById('search-filter').value;
        
        if (searchTerm.length < 1) {
            return;
        }
        
        performSearch(searchTerm, filter);
    });
    
    // Perform search based on term and filter
    function performSearch(term, filter) {
        let results = [];
        
        if (filter === 'all' || filter === 'stocks' || filter === 'companies') {
            // Search stocks
            const stockResults = sampleStocks.filter(stock => 
                stock.symbol.toLowerCase().includes(term) || 
                stock.name.toLowerCase().includes(term)
            );
            results = results.concat(stockResults);
        }
        
        if (filter === 'all' || filter === 'countries') {
            // Search countries
            const countryResults = sampleCountries.filter(country => 
                country.name.toLowerCase().includes(term) || 
                country.code.toLowerCase().includes(term) || 
                country.market.toLowerCase().includes(term)
            );
            results = results.concat(countryResults.map(country => ({
                ...country,
                type: 'country'
            })));
        }
        
        displayResults(results, term);
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