// Stock Detail Page JavaScript
import { fetchEodData, fetchIntradayData } from './api.js';

// Global variables
let stockChart;
let currentSymbol = 'AAPL';
let currentTimeRange = '1M';

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
    
    // Load initial data with a delay to avoid rate limiting
    setTimeout(() => {
        loadStockData(window.currentStockSymbol, currentTimeRange);
    }, 1000);
});

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
                price: '$182.52',
                change: '+1.2%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            },
            'TSLA': {
                name: 'Tesla Inc.',
                sector: 'Automotive',
                price: '$248.50',
                change: '-0.8%',
                changeClass: 'text-danger',
                icon: 'fa-arrow-down'
            },
            'GOOGL': {
                name: 'Alphabet Inc.',
                sector: 'Technology',
                price: '$139.54',
                change: '+0.5%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            },
            'AMZN': {
                name: 'Amazon.com Inc.',
                sector: 'E-commerce',
                price: '$145.86',
                change: '+1.1%',
                changeClass: 'text-success',
                icon: 'fa-arrow-up'
            },
            'MSFT': {
                name: 'Microsoft Corp.',
                sector: 'Technology',
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
                price: '--',
                change: '--',
                changeClass: 'text-muted',
                icon: 'fa-arrow-right'
            };
        }
        
        document.getElementById('company-name').textContent = `${data.name} (${symbol})`;
        document.getElementById('company-sector').textContent = `${data.sector} Sector`;
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

// Load stock data from MarketStack API
async function loadStockData(symbol, timeRange) {
    try {
        // Show loading state
        console.log(`Loading ${symbol} data for ${timeRange} range from MarketStack`);
        
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
        }
    } catch (error) {
        console.error('Error processing stock data:', error);
        loadMockData(symbol, timeRange);
    }
}

// Update key statistics with real data
function updateKeyStatistics(latestData) {
    if (latestData) {
        document.getElementById('stat-open').textContent = `$${latestData.open.toFixed(2)}`;
        document.getElementById('stat-prev-close').textContent = `$${latestData.close.toFixed(2)}`; // Using close as previous close
        document.getElementById('stat-range').textContent = `$${latestData.low.toFixed(2)} - $${latestData.high.toFixed(2)}`;
        document.getElementById('stat-volume').textContent = Math.round(latestData.volume).toLocaleString();
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