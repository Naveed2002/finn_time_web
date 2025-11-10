// Dashboard JavaScript for Finn Time
import { fetchEodData } from './api.js';

// Global variables
let trendChart, assetChart;
let simulationInterval;

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initTrendChart();
    initAssetChart();
    setupTimeRangeButtons();
    // Add a delay before fetching data to avoid immediate rate limiting
    setTimeout(() => {
        fetchRealMarketData();
        fetchStockData(); // Fetch stock data for the table
    }, 2000);
});

// Fetch real market data from MarketStack API
async function fetchRealMarketData() {
    try {
        // Show loading state
        console.log('Fetching real market data from MarketStack...');
        
        // Get location-based symbols or default to US indices
        const symbols = getLocationBasedSymbols();
        
        // Try to fetch all data in a single request first
        try {
            const response = await fetchEodData(symbols, 30); // Get 30 days of data for all symbols
            console.log('API Response data:', response);
            
            // Process the data for our charts
            processMarketData(response);
        } catch (error) {
            console.error('Error fetching data for market indices:', error);
            // Try with default US indices as fallback
            try {
                const defaultSymbols = ['SPY', 'QQQ', 'DIA'];
                const defaultResponse = await fetchEodData(defaultSymbols, 30);
                processMarketData(defaultResponse);
            } catch (fallbackError) {
                console.error('Error with fallback market data request:', fallbackError);
                // Fallback to simulation if API fails
                startRealTimeSimulation();
            }
        }
        
    } catch (error) {
        console.error('Error fetching market data:', error);
        // Fallback to simulation if API fails
        startRealTimeSimulation();
    }
}

// Get location-based market symbols
function getLocationBasedSymbols() {
    // Check if we have user location data
    if (window.userLocation && (window.userLocation.country || window.userLocation.country_name)) {
        const country = window.userLocation.country || window.userLocation.country_name;
        
        // Map countries to their major indices/ETFs
        const countrySymbols = {
            'United States': ['SPY', 'QQQ', 'DIA'], // S&P 500, Nasdaq, Dow Jones
            'United Kingdom': ['EZU', 'EWU', 'VPL'], // FTSE 100 proxies
            'Germany': ['EWG', 'DAX'], // DAX proxies
            'France': ['EWQ', 'CAC'], // CAC 40 proxies
            'Japan': ['EWJ', 'DXJ'], // Nikkei 225 proxies
            'Canada': ['EWC', 'XIC'], // TSX proxies
            'Australia': ['EWA', 'AXJ'], // ASX proxies
            'China': ['FXI', 'ASHR'], // SSE proxies
            'India': ['EPI', 'INDA'], // Sensex/Nifty proxies
            'Brazil': ['EWZ', 'IBB'], // Bovespa proxies
            'South Korea': ['EWY', 'KORU'], // KOSPI proxies
            'Italy': ['EWI', 'IEIL'], // FTSE MIB proxies
            'Netherlands': ['EWN', 'NL'], // AEX proxies
            'Spain': ['EWP', 'SPAIN'], // IBEX proxies
            'Sweden': ['EWD', 'SWEDEN'], // OMX proxies
            'Switzerland': ['EWL', 'SWISS'], // Swiss Market proxies
            'Russia': ['RSX', 'RUSL'], // MOEX proxies
            'Mexico': ['EWW', 'MEXICO'], // IPC proxies
            'Turkey': ['TUR', 'TURKEY'] // BIST proxies
        };
        
        // Return location-specific symbols or default to US
        return countrySymbols[country] || ['SPY', 'QQQ', 'DIA'];
    }
    
    // Default to US indices if no location data
    return ['SPY', 'QQQ', 'DIA'];
}

// Get location-based stock symbols
function getLocationBasedStocks() {
    // Check if we have user location data
    console.log('Checking user location data:', window.userLocation);
    if (window.userLocation && (window.userLocation.country || window.userLocation.country_name)) {
        const country = window.userLocation.country || window.userLocation.country_name;
        console.log('Using country:', country);
        
        // Map countries to their major companies - only local/regional stocks
        const countryStocks = {
            'United States': ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'],
            'United Kingdom': ['BP.L', 'VOD.L', 'RIO.L', 'AZN.L', 'HSBA.L'],
            'Germany': ['SAP.DE', 'BMW.DE', 'DTE.DE', 'BAS.DE', 'SIE.DE'],
            'France': ['MC.PA', 'OR.PA', 'SAN.PA', 'AIR.PA', 'BNP.PA'],
            'Japan': ['7203.T', '9984.T', '8306.T', '8035.T', '6758.T'],
            'Canada': ['ENB.TO', 'SU.TO', 'TD.TO', 'BCE.TO', 'RY.TO'],
            'Australia': ['CBA.AX', 'BHP.AX', 'WBC.AX', 'CSL.AX', 'TLS.AX'],
            'China': ['BABA', 'TCEHY', 'JD', 'BIDU', 'NTES'],
            'India': ['RELIANCE.BSE', 'TCS.BSE', 'HDFC.BSE', 'INFY.BSE', 'ICICI.BSE'],
            'Brazil': ['PETR4.SA', 'VALE3.SA', 'ITUB4.SA', 'BBDC4.SA', 'ABEV3.SA'],
            'South Korea': ['005930.KS', '000660.KS', '035420.KS', '035720.KS', '005380.KS'],
            'Sri Lanka': ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'] // Using US stocks for Sri Lanka as well
        };
        
        // Return location-specific stocks or default to US
        const stocks = countryStocks[country] || ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];
        console.log('Returning stocks for', country, ':', stocks);
        return stocks;
    }
    
    // Default to US stocks if no location data
    console.log('No location data found, returning default US stocks');
    return ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];
}

// Test function to simulate German client and verify stock data
function testGermanClient() {
    console.log('=== Testing German Client Stock Data ===');
    
    // Simulate German user location data
    const germanLocation = {
        country: 'Germany',
        city: 'Berlin',
        countryCode: 'DE'
    };
    
    // Set the window.userLocation to simulate a German client
    window.userLocation = germanLocation;
    
    // Get location-based market symbols for Germany
    const marketSymbols = getLocationBasedSymbols();
    console.log('German market indices:', marketSymbols);
    
    // Get location-based stock symbols for Germany
    const stockSymbols = getLocationBasedStocks();
    console.log('German stock symbols:', stockSymbols);
    
    // Update market trend title to show it would display correctly
    if (typeof updateMarketTrendTitle === 'function') {
        updateMarketTrendTitle('Germany');
    }
    
    console.log('\nExpected Display for German Client:');
    console.log('- Location: 🇩🇪 Germany');
    console.log('- Market Trend Analysis for Germany');
    console.log('- Market indices: DAX (using EWG proxy)');
    console.log('- Stock table will show:');
    console.log('  1. SAP.DE (SAP SE)');
    console.log('  2. BMW.DE (Bayerische Motoren Werke)');
    console.log('  3. DTE.DE (Deutsche Telekom)');
    console.log('  4. BAS.DE (BASF SE)');
    console.log('  5. SIE.DE (Siemens AG)');
    
    // Restore original location (if any)
    // window.userLocation = originalLocation;
    
    return {
        marketSymbols,
        stockSymbols,
        location: germanLocation
    };
}

// Update stock table with mock data when API fails
function updateStockTableWithMockData() {
    try {
        console.log('Updating stock table with mock data');
        
        // Mock data for stocks
        const mockData = {
            data: [
                { symbol: 'AAPL', open: 178.20, close: 182.52, high: 183.20, low: 180.12 },
                { symbol: 'TSLA', open: 250.50, close: 248.50, high: 252.30, low: 247.80 },
                { symbol: 'GOOGL', open: 138.85, close: 139.54, high: 140.20, low: 138.50 },
                { symbol: 'AMZN', open: 144.40, close: 145.86, high: 146.50, low: 144.10 },
                { symbol: 'MSFT', open: 341.47, close: 342.50, high: 343.80, low: 341.20 }
            ]
        };
        
        // Update the table with mock data
        updateStockTable(mockData);
    } catch (error) {
        console.error('Error updating stock table with mock data:', error);
    }
}

// Enhanced fetch stock data with better error handling
async function fetchStockData() {
    try {
        console.log("Fetching stock data for table from MarketStack API...");
        
        // Get location-based stock symbols
        console.log('Current userLocation:', window.userLocation);
        const symbols = getLocationBasedStocks();
        console.log('Requesting stock data for symbols:', symbols);
        
        // Try batch request first
        try {
            const response = await fetchEodData(symbols, 1); // Get latest data for all symbols
            console.log('Stock data response:', response);
            
            // Check if we have data for all requested symbols
            if (response && response.data && response.data.length > 0) {
                const receivedSymbols = response.data.map(item => item.symbol);
                console.log('Received data for symbols:', receivedSymbols);
                
                // If we didn't get data for all symbols, try individual requests
                if (receivedSymbols.length < symbols.length) {
                    console.log('Did not receive data for all symbols, trying individual requests');
                    const individualResponses = [];
                    
                    for (const symbol of symbols) {
                        if (!receivedSymbols.includes(symbol)) {
                            try {
                                console.log(`Requesting individual data for symbol: ${symbol}`);
                                const individualResponse = await fetchEodData(symbol, 1);
                                if (individualResponse && individualResponse.data && individualResponse.data.length > 0) {
                                    individualResponses.push(...individualResponse.data);
                                }
                            } catch (individualError) {
                                console.error(`Error fetching individual data for ${symbol}:`, individualError);
                            }
                        }
                    }
                    
                    // Combine batch and individual responses
                    const combinedData = [...response.data, ...individualResponses];
                    const combinedResponse = { data: combinedData };
                    console.log('Combined response:', combinedResponse);
                    updateStockTable(combinedResponse);
                    return;
                }
                
                // Process and update the stock table
                updateStockTable(response);
                return;
            }
        } catch (batchError) {
            console.error('Batch request failed:', batchError);
        }
        
        // If batch request failed or didn't return data, try individual requests
        console.log('Trying individual requests for each symbol');
        const individualResponses = [];
        
        for (const symbol of symbols) {
            try {
                console.log(`Requesting individual data for symbol: ${symbol}`);
                const individualResponse = await fetchEodData(symbol, 1);
                if (individualResponse && individualResponse.data && individualResponse.data.length > 0) {
                    individualResponses.push(...individualResponse.data);
                }
            } catch (individualError) {
                console.error(`Error fetching individual data for ${symbol}:`, individualError);
            }
        }
        
        if (individualResponses.length > 0) {
            const combinedResponse = { data: individualResponses };
            console.log('Individual requests response:', combinedResponse);
            updateStockTable(combinedResponse);
        } else {
            // If still no data, try with default US stocks
            console.log('No location-specific data received, trying with default US stocks');
            const defaultSymbols = ['AAPL', 'TSLA', 'GOOGL', 'AMZN', 'MSFT'];
            console.log('Requesting fallback stock data for symbols:', defaultSymbols);
            
            // Try individual requests for default symbols
            const defaultResponses = [];
            for (const symbol of defaultSymbols) {
                try {
                    console.log(`Requesting individual data for default symbol: ${symbol}`);
                    const individualResponse = await fetchEodData(symbol, 1);
                    if (individualResponse && individualResponse.data && individualResponse.data.length > 0) {
                        defaultResponses.push(...individualResponse.data);
                    }
                } catch (individualError) {
                    console.error(`Error fetching individual data for default ${symbol}:`, individualError);
                }
            }
            
            if (defaultResponses.length > 0) {
                const combinedResponse = { data: defaultResponses };
                console.log('Default symbols response:', combinedResponse);
                updateStockTable(combinedResponse);
            } else {
                // If still no data, use mock data
                console.log('No data received from API, using mock data');
                updateStockTableWithMockData();
            }
        }
        
    } catch (error) {
        console.error('Error fetching stock data:', error);
        // Even if API fails, we still want to show the table with mock data
        updateStockTableWithMockData();
    }
}

// Update the stock table with real data
function updateStockTable(apiResponse) {
    try {
        console.log('Updating stock table with data:', apiResponse);
        
        // Check if we have data
        if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
            console.log('No stock data to display, using mock data');
            updateStockTableWithMockData();
            return;
        }
        
        // Group data by symbol
        const stockMap = {};
        apiResponse.data.forEach(item => {
            stockMap[item.symbol] = item;
        });
        
        console.log('Stock map:', stockMap);
        
        // Update table rows
        const tableBody = document.querySelector('.table-dark tbody');
        if (tableBody) {
            const rows = tableBody.querySelectorAll('tr');
            let hasData = false; // Track if we have any real data
            
            rows.forEach(row => {
                const symbolCell = row.querySelector('td:first-child strong');
                if (symbolCell) {
                    const symbol = symbolCell.textContent;
                    const stockData = stockMap[symbol];
                    
                    // Add click event to redirect to stock page
                    row.style.cursor = 'pointer';
                    row.addEventListener('click', () => {
                        window.location.href = `stock.html?symbol=${symbol}`;
                    });
                    
                    // Add hover effect
                    row.addEventListener('mouseenter', () => {
                        row.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                    });
                    
                    row.addEventListener('mouseleave', () => {
                        row.style.backgroundColor = '';
                    });
                    
                    if (stockData) {
                        console.log(`Updating data for ${symbol}:`, stockData);
                        hasData = true; // We have real data
                        
                        // Update price (use close price)
                        const priceCell = row.querySelector('td:nth-child(3)');
                        if (priceCell) {
                            priceCell.textContent = `$${stockData.close.toFixed(2)}`;
                            priceCell.classList.remove('text-muted');
                        }
                        
                        // Update change and change percent
                        const changeCell = row.querySelector('td:nth-child(4)');
                        const changePercentCell = row.querySelector('td:nth-child(5)');
                        
                        if (changeCell && changePercentCell) {
                            const change = stockData.close - stockData.open;
                            const changePercent = (change / stockData.open) * 100;
                            
                            // Remove existing classes
                            changeCell.className = '';
                            changePercentCell.className = '';
                            
                            // Add appropriate classes based on positive/negative change
                            if (change >= 0) {
                                changeCell.classList.add('text-success');
                                changePercentCell.classList.add('text-success');
                                changeCell.textContent = `+${change.toFixed(2)}`;
                                changePercentCell.textContent = `+${changePercent.toFixed(1)}%`;
                            } else {
                                changeCell.classList.add('text-danger');
                                changePercentCell.classList.add('text-danger');
                                changeCell.textContent = `${change.toFixed(2)}`;
                                changePercentCell.textContent = `${changePercent.toFixed(1)}%`;
                            }
                        }
                    } else {
                        console.log(`No data found for symbol ${symbol}`);
                    }
                }
            });
            
            // If we don't have data for any symbols, use mock data
            if (!hasData) {
                console.log('No valid stock data received, using mock data');
                updateStockTableWithMockData();
            }
        }
    } catch (error) {
        console.error('Error updating stock table:', error);
        // Fallback to mock data on error
        updateStockTableWithMockData();
    }
}

// Process market data for charts
function processMarketData(apiResponse) {
    try {
        console.log('Processing market data:', apiResponse);
        
        // Check if we have data
        if (!apiResponse || !apiResponse.data || apiResponse.data.length === 0) {
            console.log('No market data received from API, using simulation');
            startRealTimeSimulation();
            return;
        }
        
        // Stop simulation if it's running
        stopRealTimeSimulation();
        
        // Group data by symbol
        const symbolData = {};
        apiResponse.data.forEach(item => {
            if (!symbolData[item.symbol]) {
                symbolData[item.symbol] = [];
            }
            symbolData[item.symbol].push(item);
        });
        
        // Sort data by date for each symbol
        Object.keys(symbolData).forEach(symbol => {
            symbolData[symbol].sort((a, b) => new Date(a.date) - new Date(b.date));
        });
        
        // Get location-based symbols for chart title
        const symbols = getLocationBasedSymbols();
        const location = (window.userLocation && window.userLocation.country) ? window.userLocation.country : 'United States';
        
        // Update chart title to show location
        const chartTitle = document.querySelector('.card-header h5');
        if (chartTitle) {
            chartTitle.innerHTML = `<i class="fas fa-chart-line me-2"></i>Market Trend Analysis for ${location}`;
        }
        
        // Prepare chart data for the first symbol
        const firstSymbol = symbols[0];
        if (symbolData[firstSymbol] && symbolData[firstSymbol].length > 0) {
            const symbolDataArray = symbolData[firstSymbol];
            const labels = symbolDataArray.map(item => {
                const date = new Date(item.date);
                return `${date.getMonth()+1}/${date.getDate()}`;
            });
            
            const prices = symbolDataArray.map(item => item.close);
            
            // Update chart with real data
            if (trendChart) {
                trendChart.data.labels = labels;
                trendChart.data.datasets[0].data = prices;
                trendChart.update();
            }
        }
        
    } catch (error) {
        console.error('Error processing market data:', error);
        startRealTimeSimulation();
    }
}

// Initialize the trend line chart
function initTrendChart() {
    const ctx = document.getElementById('trendChart').getContext('2d');
    
    // Generate sample data for the trend chart (fallback)
    const labels = [];
    const marketData = [];
    const techData = [];
    const financeData = [];
    
    for (let i = 0; i < 30; i++) {
        labels.push(`Day ${i+1}`);
        // Generate fluctuating data with some growth trend
        marketData.push(100 + Math.sin(i/5) * 10 + i * 0.5 + Math.random() * 5);
        techData.push(95 + Math.sin(i/4) * 12 + i * 0.7 + Math.random() * 6);
        financeData.push(105 + Math.sin(i/6) * 8 + i * 0.3 + Math.random() * 4);
    }
    
    trendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'S&P 500 (SPY)',
                data: marketData,
                borderColor: '#00ff9d',
                backgroundColor: 'rgba(0, 255, 157, 0.1)',
                borderWidth: 3,
                pointRadius: 3,
                pointBackgroundColor: '#00ff9d',
                pointBorderColor: '#000',
                pointHoverRadius: 6,
                tension: 0.3,
                fill: true
            }, {
                label: 'Technology Sector',
                data: techData,
                borderColor: '#00c6ff',
                backgroundColor: 'rgba(0, 198, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 2,
                pointBackgroundColor: '#00c6ff',
                pointBorderColor: '#000',
                pointHoverRadius: 5,
                borderDash: [5, 5],
                tension: 0.3,
                fill: true
            }, {
                label: 'Financial Sector',
                data: financeData,
                borderColor: '#a259ff',
                backgroundColor: 'rgba(162, 89, 255, 0.1)',
                borderWidth: 2,
                pointRadius: 2,
                pointBackgroundColor: '#a259ff',
                pointBorderColor: '#000',
                pointHoverRadius: 5,
                borderDash: [10, 5],
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#b0b0b0',
                        font: {
                            size: 12
                        },
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(21, 21, 21, 0.9)',
                    titleColor: '#00ff9d',
                    bodyColor: '#f0f0f0',
                    borderColor: '#2a2a2a',
                    borderWidth: 1,
                    padding: 12,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#b0b0b0'
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

// Initialize the asset category chart
function initAssetChart() {
    const ctx = document.getElementById('assetChart').getContext('2d');
    
    assetChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Stocks', 'Bonds', 'Crypto', 'Real Estate', 'Commodities'],
            datasets: [{
                label: 'Asset Allocation',
                data: [45, 25, 15, 10, 5],
                backgroundColor: [
                    'rgba(0, 255, 157, 0.8)',
                    'rgba(0, 198, 255, 0.8)',
                    'rgba(162, 89, 255, 0.8)',
                    'rgba(255, 193, 7, 0.8)',
                    'rgba(255, 46, 99, 0.8)'
                ],
                borderColor: [
                    'rgba(0, 255, 157, 1)',
                    'rgba(0, 198, 255, 1)',
                    'rgba(162, 89, 255, 1)',
                    'rgba(255, 193, 7, 1)',
                    'rgba(255, 46, 99, 1)'
                ],
                borderWidth: 1,
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: '#b0b0b0',
                        font: {
                            size: 11
                        },
                        padding: 15,
                        usePointStyle: true,
                        // Add click handler for legend items
                        onClick: function(e, legendItem, legend) {
                            const index = legendItem.datasetIndex;
                            const ci = legend.chart;
                            const meta = ci.getDatasetMeta(index);
                            
                            // Toggle visibility
                            meta.hidden = meta.hidden === null ? !ci.data.datasets[index].hidden : null;
                            
                            // Update chart
                            ci.update();
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(21, 21, 21, 0.9)',
                    titleColor: '#00ff9d',
                    bodyColor: '#f0f0f0',
                    borderColor: '#2a2a2a',
                    borderWidth: 1,
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: 1000
            },
            // Add click handler for chart segments
            onClick: function(evt, activeElements) {
                if (activeElements.length > 0) {
                    const element = activeElements[0];
                    const datasetIndex = element.datasetIndex;
                    const index = element.index;
                    const label = assetChart.data.labels[index];
                    const value = assetChart.data.datasets[datasetIndex].data[index];
                    
                    // Show alert with clicked segment info
                    console.log(`Clicked on ${label}: ${value}%`);
                }
            }
        }
    });
}

// Set up time range buttons
function setupTimeRangeButtons() {
    const buttons = document.querySelectorAll('.btn-group .btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            buttons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // In a real implementation, this would update the chart data
            console.log(`Time range changed to: ${this.textContent}`);
            
            // For demonstration, we'll just show an alert
            // In a real app, you would fetch new data and update the chart
        });
    });
}

// Start real-time simulation (fallback)
function startRealTimeSimulation() {
    console.log('Starting simulation mode');
    
    // Clear any existing interval
    if (simulationInterval) {
        clearInterval(simulationInterval);
    }
    
    // Start new simulation
    simulationInterval = setInterval(() => {
        // Only update if chart exists
        if (trendChart) {
            // Get current data
            const marketData = trendChart.data.datasets[0].data;
            const techData = trendChart.data.datasets[1].data;
            const financeData = trendChart.data.datasets[2].data;
            
            // Remove first element and add new random value
            marketData.shift();
            techData.shift();
            financeData.shift();
            
            // Add new data points with slight random variation
            const lastMarket = marketData[marketData.length - 1];
            const lastTech = techData[techData.length - 1];
            const lastFinance = financeData[financeData.length - 1];
            
            marketData.push(lastMarket + (Math.random() - 0.5) * 2);
            techData.push(lastTech + (Math.random() - 0.5) * 2.5);
            financeData.push(lastFinance + (Math.random() - 0.5) * 1.5);
            
            // Update chart
            trendChart.update();
        }
    }, 3000); // Update every 3 seconds
}

// Stop real-time simulation
function stopRealTimeSimulation() {
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
}

// Clean up when page is unloaded
window.addEventListener('beforeunload', function() {
    stopRealTimeSimulation();
});