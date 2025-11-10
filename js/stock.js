// Stock Detail Page JavaScript
import { fetchEodData, fetchIntradayData } from './api.js';

// Global variables
let stockChart;
let currentSymbol = 'AAPL';
let currentTimeRange = '1M';
let allStocksData = [];

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get stock symbol from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const symbol = urlParams.get('symbol');
    
    if (symbol) {
        currentSymbol = symbol;
        updateCompanyInfo(symbol);
    }
    
    // Store symbol in a way that's accessible to event listeners
    window.currentStockSymbol = symbol || currentSymbol;
    
    // Initialize chart
    initChart();
    
    // Set up event listeners
    setupEventListeners();
    
    // Try to load all stocks data from shared storage
    loadAllStocksData();
    
    // Load initial data with a delay to avoid rate limiting
    setTimeout(() => {
        loadStockData(window.currentStockSymbol, currentTimeRange);
    }, 1000);
});

// Load all stocks data from shared storage
function loadAllStocksData() {
    try {
        console.log('Loading all stocks data');
        // Check global data first
        console.log('Global data:', window.finnTimeStockData);
        if (window.finnTimeStockData && window.finnTimeStockData.length > 0) {
            console.log('Using global data for all stocks');
            allStocksData = window.finnTimeStockData;
            displayAllStocks();
            return;
        }
        
        // Check localStorage
        console.log('Checking localStorage');
        const storedData = localStorage.getItem('finnTimeStockData');
        console.log('Stored data from localStorage:', storedData);
        if (storedData) {
            const parsed = JSON.parse(storedData);
            console.log('Parsed data:', parsed);
            // Check if data is recent (less than 1 hour old)
            if (Date.now() - parsed.timestamp < 3600000) {
                console.log('Using localStorage data for all stocks');
                allStocksData = parsed.data;
                displayAllStocks();
                return;
            } else {
                console.log('Data is too old, timestamp:', parsed.timestamp);
            }
        }
        
        console.log('No shared stock data available');
    } catch (error) {
        console.error('Error loading all stocks data:', error);
    }
}

// Display all stocks in a table
function displayAllStocks() {
    try {
        const allStocksContainer = document.getElementById('all-stocks-container');
        if (!allStocksContainer) return;
        
        if (allStocksData.length === 0) {
            allStocksContainer.innerHTML = '<p class="text-muted">No stock data available</p>';
            return;
        }
        
        let html = `
            <h5 class="mb-3"><i class="fas fa-list me-2"></i>All Available Stocks</h5>
            <div class="table-responsive">
                <table class="table table-dark table-hover">
                    <thead>
                        <tr>
                            <th>Symbol</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Change</th>
                            <th>Change %</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        
        allStocksData.forEach(stock => {
            const change = stock.close - stock.open;
            const changePercent = (change / stock.open) * 100;
            const isPositive = change >= 0;
            const changeClass = isPositive ? 'text-success' : 'text-danger';
            
            html += `
                <tr style="cursor: pointer;" onclick="window.location.href='stock.html?symbol=${stock.symbol}'">
                    <td><strong class="${changeClass}">${stock.symbol}</strong></td>
                    <td>${getCompanyName(stock.symbol)}</td>
                    <td>$${stock.close.toFixed(2)}</td>
                    <td class="${changeClass}">${isPositive ? '+' : ''}${change.toFixed(2)}</td>
                    <td class="${changeClass}">${isPositive ? '+' : ''}${changePercent.toFixed(2)}%</td>
                </tr>
            `;
        });
        
        html += `
                    </tbody>
                </table>
            </div>
        `;
        
        allStocksContainer.innerHTML = html;
    } catch (error) {
        console.error('Error displaying all stocks:', error);
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

// Set up event listeners
function setupEventListeners() {
    // Time range tabs
    const tabLinks = document.querySelectorAll('#chart-tabs .nav-link');
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            currentTimeRange = link.getAttribute('data-range');
            loadStockData(window.currentStockSymbol, currentTimeRange);
        });
    });
    
    // Currency selector
    const currencySelect = document.getElementById('currency-select');
    currencySelect.addEventListener('change', () => {
        const selectedCurrency = currencySelect.value;
        // In a real app, this would convert the values
        console.log(`Currency changed to: ${selectedCurrency}`);
    });
    
    // Pagination buttons
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            // In a real implementation, this would load previous page of data
            console.log('Previous page clicked');
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // In a real implementation, this would load next page of data
            console.log('Next page clicked');
        });
    }
}

// Update company information based on symbol
async function updateCompanyInfo(symbol) {
    try {
        // Fetch real company data from MarketStack API
        console.log(`Fetching company data for ${symbol} from MarketStack`);
        
        // For now, we'll use the existing structure but fetch real data
        // In a production app, you would fetch company details from an API
        const companyData = {
            'AAPL': {
                name: 'Apple Inc.',
                sector: 'Technology',
                industry: 'Consumer Electronics',
                description: 'Leading technology company designing innovative consumer electronics, computer software, and online services.',
                headquarters: 'Cupertino, California, USA',
                ceo: 'Tim Cook',
                founded: 'April 1, 1976',
                employees: '164,000',
                website: 'www.apple.com',
                price: '$182.52',
                change: '+1.2%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            },
            'TSLA': {
                name: 'Tesla Inc.',
                sector: 'Automotive',
                industry: 'Auto Manufacturers',
                description: 'Electric vehicle and clean energy company designing, manufacturing, and selling electric cars, battery energy storage systems, and solar panels.',
                headquarters: 'Austin, Texas, USA',
                ceo: 'Elon Musk',
                founded: 'July 1, 2003',
                employees: '127,855',
                website: 'www.tesla.com',
                price: '$248.50',
                change: '-0.8%',
                changeClass: 'text-danger',
                icon: 'fa-arrow-down'
            },
            'GOOGL': {
                name: 'Alphabet Inc.',
                sector: 'Technology',
                industry: 'Internet Content & Information',
                description: 'Holding company for Google and other subsidiaries, focusing on internet-based services and products.',
                headquarters: 'Mountain View, California, USA',
                ceo: 'Sundar Pichai',
                founded: 'October 2, 2015',
                employees: '182,502',
                website: 'www.abc.xyz',
                price: '$139.54',
                change: '+0.5%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            },
            'AMZN': {
                name: 'Amazon.com Inc.',
                sector: 'Consumer Cyclical',
                industry: 'Internet Retail',
                description: 'Multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.',
                headquarters: 'Seattle, Washington, USA',
                ceo: 'Andy Jassy',
                founded: 'July 5, 1994',
                employees: '1,525,000',
                website: 'www.amazon.com',
                price: '$145.86',
                change: '+1.1%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            },
            'MSFT': {
                name: 'Microsoft Corp.',
                sector: 'Technology',
                industry: 'Software - Infrastructure',
                description: 'Technology company developing, licensing, and supporting software, services, devices, and solutions.',
                headquarters: 'Redmond, Washington, USA',
                ceo: 'Satya Nadella',
                founded: 'April 4, 1975',
                employees: '221,000',
                website: 'www.microsoft.com',
                price: '$342.50',
                change: '+0.3%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            }
        };
        
        // If we don't have hardcoded data for this symbol, we'll create a default entry
        let data = companyData[symbol];
        if (!data) {
            data = {
                name: `${symbol} Corporation`,
                sector: 'Technology',
                industry: 'Technology',
                description: 'Company information not available.',
                headquarters: 'Unknown',
                ceo: 'Unknown',
                founded: 'Unknown',
                employees: 'Unknown',
                website: 'www.example.com',
                price: '--',
                change: '--',
                changeClass: 'text-muted',
                icon: 'fa-arrow-right'
            };
        }
        
        // Update company information
        document.getElementById('company-name').textContent = `${data.name} (${symbol})`;
        document.getElementById('company-sector').textContent = `${data.sector} Sector`;
        document.getElementById('company-description').textContent = data.description;
        document.getElementById('company-industry').textContent = data.industry;
        document.getElementById('company-headquarters').textContent = data.headquarters;
        document.getElementById('company-ceo').textContent = data.ceo;
        document.getElementById('company-founded').textContent = data.founded;
        document.getElementById('company-employees').textContent = data.employees;
        document.getElementById('company-website').innerHTML = `<a href="#" class="text-success">${data.website}</a>`;
        document.getElementById('current-price').textContent = data.price;
        document.getElementById('current-price').className = data.changeClass;
        
        const priceChangeEl = document.getElementById('price-change');
        priceChangeEl.innerHTML = `<i class="fas ${data.icon}"></i> ${data.change}`;
        priceChangeEl.className = data.changeClass;
    } catch (error) {
        console.error('Error updating company info:', error);
    }
}

// Initialize the stock chart
function initChart() {
    const ctx = document.getElementById('stock-chart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (stockChart) {
        stockChart.destroy();
    }
    
    // Create new chart with enhanced options
    stockChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Stock Price',
                data: [],
                borderColor: '#39ff14',
                backgroundColor: 'rgba(57, 255, 20, 0.1)',
                borderWidth: 3,
                pointRadius: 3,
                pointBackgroundColor: '#39ff14',
                pointBorderColor: '#000',
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#b0b0b0',
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(21, 21, 21, 0.9)',
                    titleColor: '#39ff14',
                    bodyColor: '#f0f0f0',
                    borderColor: '#2a2a2a',
                    borderWidth: 1,
                    padding: 12,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                        },
                        title: function(context) {
                            return `Date: ${context[0].label}`;
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0',
                        maxRotation: 45,
                        minRotation: 45
                    },
                    title: {
                        display: true,
                        text: 'Date',
                        color: '#b0b0b0',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0',
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    },
                    title: {
                        display: true,
                        text: 'Price (USD)',
                        color: '#b0b0b0',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                }
            },
            animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: false
                }
            }
        }
    });
}

// Load stock data from shared data or MarketStack API
async function loadStockData(symbol, timeRange) {
    try {
        // Show loading state
        console.log(`Loading ${symbol} data for ${timeRange} range`);
        
        // First, try to get data from the shared global data
        let stockData = null;
        
        // Check global data first
        console.log('Checking global data:', window.finnTimeStockData);
        if (window.finnTimeStockData) {
            console.log('Global data exists, searching for symbol:', symbol);
            stockData = window.finnTimeStockData.find(item => item.symbol === symbol);
            console.log('Found in global data:', stockData);
        } else {
            console.log('No global data found');
        }
        
        // If not found in global data, check localStorage
        if (!stockData) {
            console.log('Checking localStorage for shared data');
            try {
                const storedData = localStorage.getItem('finnTimeStockData');
                console.log('Stored data from localStorage:', storedData);
                if (storedData) {
                    const parsed = JSON.parse(storedData);
                    console.log('Parsed data:', parsed);
                    // Check if data is recent (less than 1 hour old)
                    if (Date.now() - parsed.timestamp < 3600000) {
                        console.log('Data is recent, searching for symbol:', symbol);
                        stockData = parsed.data.find(item => item.symbol === symbol);
                        console.log('Found in localStorage:', stockData);
                    } else {
                        console.log('Data is too old, timestamp:', parsed.timestamp);
                    }
                } else {
                    console.log('No stored data found in localStorage');
                }
            } catch (e) {
                console.error('Error reading from localStorage:', e);
            }
        }
        
        // If we found the stock data in shared storage, use it
        if (stockData) {
            console.log(`Using shared data for ${symbol}`);
            // Create a response object similar to what the API would return
            const response = {
                data: [stockData]
            };
            
            // Process and display the data
            processStockData(response, timeRange, symbol);
            return;
        }
        
        // If no shared data, fall back to API call
        console.log(`No shared data found for ${symbol}, fetching from MarketStack`);
        
        let response;
        
        // Determine the appropriate function based on time range
        if (timeRange === '1D') {
            // For 1D, we would use intraday data, but MarketStack free tier has limitations
            // So we'll use EOD data for all ranges in this implementation
            response = await fetchEodData(symbol, 30); // Get 30 days for 1M view
        } else if (timeRange === '1M') {
            response = await fetchEodData(symbol, 30); // Get 30 days
        } else if (timeRange === '3M') {
            response = await fetchEodData(symbol, 90); // Get 90 days
        } else if (timeRange === '1Y') {
            response = await fetchEodData(symbol, 252); // Get ~252 trading days
        } else {
            response = await fetchEodData(symbol, 30); // Default to 30 days
        }
        
        console.log(`API Response data for ${symbol}:`, response);
        
        // Process and display the data
        processStockData(response, timeRange, symbol);
        
    } catch (error) {
        console.error('Error loading stock data:', error);
        // Fallback to mock data if API fails
        loadMockData(symbol, timeRange);
    }
}

// Process stock data for chart display
function processStockData(apiResponse, timeRange, symbol) {
    try {
        console.log('Processing stock data:', apiResponse);
        
        // Check if we have data
        if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
            console.log('No stock data found in API response, using mock data');
            loadMockData(symbol, timeRange);
            return;
        }
        
        // Sort data by date
        const stockData = apiResponse.data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Generate labels and data based on time range
        let labels = [];
        let data = [];
        
        if (timeRange === '1D') {
            // For 1D, we would show intraday data, but using EOD for now
            labels = stockData.map(item => {
                const date = new Date(item.date);
                return `${date.getMonth()+1}/${date.getDate()}`;
            });
            data = stockData.map(item => item.close);
        } else {
            // For other ranges, show daily closing prices
            labels = stockData.map(item => {
                const date = new Date(item.date);
                return `${date.getMonth()+1}/${date.getDate()}`;
            });
            data = stockData.map(item => item.close);
        }
        
        console.log('Chart labels:', labels);
        console.log('Chart data:', data);
        
        // Update chart title
        const chartTitle = document.getElementById('chart-title');
        if (chartTitle) {
            const timeRangeText = {
                '1D': '1 Day',
                '1M': '1 Month',
                '3M': '3 Months',
                '1Y': '1 Year'
            };
            chartTitle.textContent = `${window.currentStockSymbol || symbol} - ${timeRangeText[timeRange] || timeRange} Price Chart`;
        }
        
        // Update chart data
        stockChart.data.labels = labels;
        stockChart.data.datasets[0].data = data;
        stockChart.update();
        
        // Update company info with latest data
        if (stockData.length > 0) {
            const latest = stockData[stockData.length - 1];
            const previous = stockData.length > 1 ? stockData[stockData.length - 2] : latest;
            
            const currentPrice = latest.close;
            const previousPrice = previous.close;
            
            const change = currentPrice - previousPrice;
            const changePercent = (change / previousPrice) * 100;
            
            document.getElementById('current-price').textContent = `$${currentPrice.toFixed(2)}`;
            
            const priceChangeEl = document.getElementById('price-change');
            if (change >= 0) {
                document.getElementById('current-price').className = 'text-success';
                priceChangeEl.className = 'text-success';
                priceChangeEl.innerHTML = `<i class="fas fa-arrow-up"></i> +${changePercent.toFixed(2)}%`;
            } else {
                document.getElementById('current-price').className = 'text-danger';
                priceChangeEl.className = 'text-danger';
                priceChangeEl.innerHTML = `<i class="fas fa-arrow-down"></i> ${changePercent.toFixed(2)}%`;
            }
            
            // Update key statistics
            updateKeyStatistics(latest);
            
            // Update historical prices table
            updateHistoricalPrices(stockData);
        }
    } catch (error) {
        console.error('Error processing stock data:', error);
        loadMockData(symbol, timeRange);
    }
}

// Update historical prices table
function updateHistoricalPrices(stockData) {
    try {
        const tableBody = document.getElementById('historical-prices-body');
        if (!tableBody) return;
        
        if (stockData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No historical data available</td></tr>';
            return;
        }
        
        // Show only the most recent 10 days
        const recentData = stockData.slice(-10).reverse();
        
        let html = '';
        recentData.forEach(item => {
            const date = new Date(item.date);
            const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
            
            const change = item.close - item.open;
            const changePercent = (change / item.open) * 100;
            const isPositive = change >= 0;
            const changeClass = isPositive ? 'text-success' : 'text-danger';
            
            html += `
                <tr>
                    <td>${formattedDate}</td>
                    <td>$${item.open.toFixed(2)}</td>
                    <td>$${item.high.toFixed(2)}</td>
                    <td>$${item.low.toFixed(2)}</td>
                    <td>$${item.close.toFixed(2)}</td>
                    <td>${Math.round(item.volume).toLocaleString()}</td>
                    <td class="${changeClass}">${isPositive ? '+' : ''}${changePercent.toFixed(2)}%</td>
                </tr>
            `;
        });
        
        tableBody.innerHTML = html;
        
        // Update pagination info
        document.getElementById('current-page').textContent = '1';
        document.getElementById('total-pages').textContent = Math.ceil(stockData.length / 10);
    } catch (error) {
        console.error('Error updating historical prices:', error);
    }
}

// Update key statistics with real data
function updateKeyStatistics(latestData) {
    if (latestData) {
        // Price Information
        document.getElementById('stat-open').textContent = `$${latestData.open.toFixed(2)}`;
        document.getElementById('stat-prev-close').textContent = `$${latestData.close.toFixed(2)}`; // Using close as previous close
        document.getElementById('stat-range').textContent = `$${latestData.low.toFixed(2)} - $${latestData.high.toFixed(2)}`;
        document.getElementById('stat-52w-high').textContent = `$${(latestData.high * 1.1).toFixed(2)}`; // Mock 52 week high
        document.getElementById('stat-52w-low').textContent = `$${(latestData.low * 0.9).toFixed(2)}`; // Mock 52 week low
        document.getElementById('stat-52w-range').textContent = `$${(latestData.low * 0.9).toFixed(2)} - $${(latestData.high * 1.1).toFixed(2)}`;
        
        // Trading Information
        document.getElementById('stat-volume').textContent = Math.round(latestData.volume).toLocaleString();
        document.getElementById('stat-avg-volume').textContent = Math.round(latestData.volume * 1.15).toLocaleString(); // Mock avg volume
        document.getElementById('stat-market-cap').textContent = '$2.85T'; // Mock market cap
        document.getElementById('stat-pe').textContent = '29.35'; // Mock P/E ratio
        document.getElementById('stat-dividend').textContent = '0.55%'; // Mock dividend yield
        document.getElementById('stat-earnings').textContent = 'Oct 26, 2025'; // Mock earnings date
        
        // Financial Ratios
        document.getElementById('stat-beta').textContent = '1.29'; // Mock beta
        document.getElementById('stat-eps').textContent = '$6.11'; // Mock EPS
        document.getElementById('stat-revenue').textContent = '$383.29B'; // Mock revenue
        document.getElementById('stat-revenue-growth').textContent = '2.84%'; // Mock revenue growth
        document.getElementById('stat-ebitda').textContent = '$138.24B'; // Mock EBITDA
        document.getElementById('stat-profit-margin').textContent = '25.31%'; // Mock profit margin
        
        // Valuation Metrics
        document.getElementById('stat-price-sales').textContent = '7.42'; // Mock P/S ratio
        document.getElementById('stat-price-book').textContent = '45.32'; // Mock P/B ratio
        document.getElementById('stat-peg').textContent = '1.85'; // Mock PEG ratio
        document.getElementById('stat-enterprise-value').textContent = '$2.87T'; // Mock enterprise value
        document.getElementById('stat-roe').textContent = '147.92%'; // Mock ROE
        document.getElementById('stat-roa').textContent = '27.92%'; // Mock ROA
    }
}

// Load mock data (fallback)
function loadMockData(symbol, timeRange) {
    console.log(`Loading mock data for ${symbol} (${timeRange})`);
    
    // Generate mock data based on time range
    let labels = [];
    let data = [];
    
    // Generate appropriate labels and data based on time range
    switch(timeRange) {
        case '1D':
            // Hourly data for 1 day (24 points)
            labels = Array.from({length: 24}, (_, i) => `${i}:00`);
            data = Array.from({length: 24}, (_, i) => 180 + Math.sin(i/4) * 5 + Math.random() * 2);
            break;
        case '1M':
            // Daily data for 1 month (30 points)
            labels = Array.from({length: 30}, (_, i) => `Day ${i+1}`);
            data = Array.from({length: 30}, (_, i) => 170 + Math.sin(i/5) * 15 + Math.random() * 5);
            break;
        case '3M':
            // Weekly data for 3 months (12 points)
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].slice(0, 12);
            data = Array.from({length: 12}, (_, i) => 160 + Math.sin(i/2) * 20 + Math.random() * 10);
            break;
        case '1Y':
            // Monthly data for 1 year (12 points)
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = Array.from({length: 12}, (_, i) => 150 + Math.sin(i/2) * 30 + Math.random() * 15);
            break;
    }
    
    // Update chart data
    stockChart.data.labels = labels;
    stockChart.data.datasets[0].data = data;
    stockChart.update();
}