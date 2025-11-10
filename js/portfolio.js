// Portfolio Page JavaScript

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
        addStockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const symbol = document.getElementById('stock-symbol').value.toUpperCase();
            const shares = parseInt(document.getElementById('stock-shares').value);
            
            if (symbol && shares > 0) {
                addStockToPortfolio(symbol, shares);
                addStockForm.reset();
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
    // In a real app, this would load from localStorage
    console.log('Loading portfolio from localStorage');
    
    // For demo purposes, we're using the hardcoded data in the HTML
    // In a real implementation, you would populate the table dynamically
}

// Add stock to portfolio
function addStockToPortfolio(symbol, shares) {
    // In a real app, this would add to localStorage and update the UI
    console.log(`Adding ${shares} shares of ${symbol} to portfolio`);
    
    // Show success message
    alert(`Added ${shares} shares of ${symbol} to your portfolio!`);
    
    // In a real implementation, you would:
    // 1. Fetch current stock data from API
    // 2. Add to localStorage
    // 3. Update the portfolio table
    // 4. Recalculate portfolio totals
}

// Remove stock from portfolio
function removeStockFromPortfolio(symbol) {
    // Confirm removal
    if (confirm(`Are you sure you want to remove ${symbol} from your portfolio?`)) {
        // In a real app, this would remove from localStorage and update the UI
        console.log(`Removing ${symbol} from portfolio`);
        
        // Show success message
        alert(`${symbol} removed from your portfolio!`);
        
        // In a real implementation, you would:
        // 1. Remove from localStorage
        // 2. Update the portfolio table
        // 3. Recalculate portfolio totals
    }
}