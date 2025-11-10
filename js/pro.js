// Pro Version Page JavaScript

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Buy Pro buttons
    const buyButtons = document.querySelectorAll('.pro-buy-btn');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const plan = button.getAttribute('data-plan');
            purchasePlan(plan);
        });
    });
}

// Purchase plan function
function purchasePlan(plan) {
    // In a real app, this would redirect to a payment processor
    console.log(`Purchasing ${plan} plan`);
    
    // Show confirmation message
    let planName = '';
    let price = '';
    
    switch(plan) {
        case 'pro':
            planName = 'Pro';
            price = '$9.99';
            break;
        case 'enterprise':
            planName = 'Enterprise';
            price = '$29.99';
            break;
        default:
            planName = 'Unknown';
            price = 'Unknown';
    }
    
    alert(`Thank you for your interest in the Finn Time ${planName} plan (${price}/month)! In a real application, this would redirect to our secure payment processor.`);
    
    // In a real implementation, you would:
    // 1. Redirect to payment processor
    // 2. Handle payment confirmation
    // 3. Update user's account status
    // 4. Provide access to premium features
}