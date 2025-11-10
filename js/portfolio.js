// Portfolio Page JavaScript

// Import API functions
import { fetchEodData } from './api.js';

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Load portfolio from localStorage
    loadPortfolio();
    
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Add stock form submission
    const addStockForm = document.getElementById('add-stock-form');
    if (addStockForm) {
        addStockForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const symbol = document.getElementById('stock-symbol').value.toUpperCase().trim();
            const shares = parseInt(document.getElementById('stock-shares').value);
            
            if (symbol && shares > 0) {
                await addStockToPortfolio(symbol, shares);
                addStockForm.reset();
            } else {
                alert('Please enter a valid stock symbol and number of shares');
            }
        });
    }
    
    // Remove stock buttons
    document.addEventListener('click', (e) => {
        if (e.target.closest('.remove-stock')) {
            const button = e.target.closest('.remove-stock');
            const symbol = button.getAttribute('data-symbol');
            removeStockFromPortfolio(symbol);
        }
    });
}

// Load portfolio from localStorage
function loadPortfolio() {
    try {
        const portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
        updatePortfolioTable(portfolio);
        updatePortfolioSummary(portfolio);
        console.log('Portfolio loaded from localStorage:', portfolio);
    } catch (error) {
        console.error('Error loading portfolio:', error);
        // Initialize with empty portfolio if there's an error
        updatePortfolioTable([]);
        updatePortfolioSummary([]);
    }
}

// Add stock to portfolio
async function addStockToPortfolio(symbol, shares) {
    try {
        // First, check if stock exists by fetching its data
        const stockData = await fetchEodData(symbol, 1);
        
        if (!stockData || !stockData.data || stockData.data.length === 0) {
            alert(`Could not find stock data for symbol: ${symbol}. Please check the symbol and try again.`);
            return;
        }
        
        const currentPrice = stockData.data[0].close;
        
        // Get existing portfolio
        let portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
        
        // Check if stock already exists in portfolio
        const existingIndex = portfolio.findIndex(item => item.symbol === symbol);
        
        if (existingIndex >= 0) {
            // Update existing stock
            const existing = portfolio[existingIndex];
            const totalShares = existing.shares + shares;
            const totalCost = (existing.avgPrice * existing.shares) + (currentPrice * shares);
            const newAvgPrice = totalCost / totalShares;
            
            portfolio[existingIndex] = {
                ...existing,
                shares: totalShares,
                avgPrice: newAvgPrice
            };
        } else {
            // Add new stock
            const companyName = getCompanyName(symbol);
            portfolio.push({
                symbol,
                name: companyName,
                shares,
                avgPrice: currentPrice,
                currentPrice
            });
        }
        
        // Save to localStorage
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        
        // Update UI
        updatePortfolioTable(portfolio);
        updatePortfolioSummary(portfolio);
        
        // Show success message
        alert(`Successfully added ${shares} shares of ${symbol} to your portfolio!`);
        
    } catch (error) {
        console.error('Error adding stock to portfolio:', error);
        alert(`Error adding stock to portfolio: ${error.message}`);
    }
}

// Remove stock from portfolio
function removeStockFromPortfolio(symbol) {
    // Confirm removal
    if (confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
        try {
            // Get existing portfolio
            let portfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
            
            // Remove stock
            portfolio = portfolio.filter(item => item.symbol !== symbol);
            
            // Save to localStorage
            localStorage.setItem('portfolio', JSON.stringify(portfolio));
            
            // Update UI
            updatePortfolioTable(portfolio);
            updatePortfolioSummary(portfolio);
            
            // Show success message
            alert(`${symbol} removed from your portfolio!`);
        } catch (error) {
            console.error('Error removing stock from portfolio:', error);
            alert(`Error removing stock from portfolio: ${error.message}`);
        }
    }
}

// Update portfolio table
function updatePortfolioTable(portfolio) {
    const tableBody = document.getElementById('portfolio-holdings');
    if (!tableBody) return;
    
    if (portfolio.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted py-5">
                    <i class="fas fa-wallet fa-2x mb-3"></i>
                    <h5>Your portfolio is empty</h5>
                    <p>Add stocks using the form above to get started</p>
                </td>
            </tr>
        `;
        return;
    }
    
    // Build table rows
    let html = '';
    portfolio.forEach(item => {
        const changePercent = ((item.currentPrice - item.avgPrice) / item.avgPrice * 100);
        const isPositive = changePercent >= 0;
        const value = item.shares * item.currentPrice;
        
        html += `
            <tr>
                <td><strong class="${isPositive ? 'text-success' : 'text-danger'}">${item.symbol}</strong></td>
                <td>${item.name}</td>
                <td>${item.shares}</td>
                <td>$${item.avgPrice.toFixed(2)}</td>
                <td class="${isPositive ? 'text-success' : 'text-danger'}">$${item.currentPrice.toFixed(2)}</td>
                <td class="${isPositive ? 'text-success' : 'text-danger'}">
                    <i class="fas fa-arrow-${isPositive ? 'up' : 'down'}"></i> 
                    ${isPositive ? '+' : ''}${changePercent.toFixed(2)}%
                </td>
                <td class="${isPositive ? 'text-success' : 'text-danger'}">$${value.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-danger remove-stock" data-symbol="${item.symbol}" title="Remove ${item.symbol} from portfolio">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Update portfolio summary
function updatePortfolioSummary(portfolio) {
    // Calculate totals
    let totalValue = 0;
    let totalChange = 0;
    let todayChange = 0;
    
    portfolio.forEach(item => {
        const value = item.shares * item.currentPrice;
        const cost = item.shares * item.avgPrice;
        const change = value - cost;
        
        totalValue += value;
        totalChange += change;
        
        // Today's change (simplified - in a real app you'd get previous close)
        const todayChangePercent = (item.currentPrice - item.avgPrice) / item.avgPrice;
        todayChange += value * todayChangePercent;
    });
    
    // Update summary values
    const totalValueElement = document.querySelector('.summary-item:nth-child(1) h3');
    const todayChangeElement = document.querySelector('.summary-item:nth-child(2) h3');
    const holdingsElement = document.querySelector('.summary-item:nth-child(3) h3');
    
    if (totalValueElement) totalValueElement.textContent = `$${totalValue.toFixed(2)}`;
    if (todayChangeElement) todayChangeElement.textContent = `$${todayChange.toFixed(2)}`;
    if (holdingsElement) holdingsElement.textContent = portfolio.length;
    
    // Update change percentages
    const totalChangePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;
    const todayChangePercent = totalValue > 0 ? (todayChange / (totalValue - todayChange)) * 100 : 0;
    
    const totalChangePercentElement = document.querySelector('.summary-item:nth-child(1) p');
    const todayChangePercentElement = document.querySelector('.summary-item:nth-child(2) p');
    
    if (totalChangePercentElement) {
        totalChangePercentElement.innerHTML = `
            <i class="fas fa-arrow-${totalChangePercent >= 0 ? 'up' : 'down'}"></i> 
            ${totalChangePercent >= 0 ? '+' : ''}${totalChangePercent.toFixed(2)}%
        `;
        totalChangePercentElement.className = `small mb-0 ${totalChangePercent >= 0 ? 'text-success' : 'text-danger'}`;
    }
    
    if (todayChangePercentElement) {
        todayChangePercentElement.innerHTML = `
            <i class="fas fa-arrow-${todayChangePercent >= 0 ? 'up' : 'down'}"></i> 
            ${todayChangePercent >= 0 ? '+' : ''}${todayChangePercent.toFixed(2)}%
        `;
        todayChangePercentElement.className = `small mb-0 ${todayChangePercent >= 0 ? 'text-success' : 'text-danger'}`;
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
        'NVDA': 'NVIDIA Corp.',
        'META': 'Meta Platforms Inc.',
        'NFLX': 'Netflix Inc.',
        'DIS': 'The Walt Disney Co.',
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