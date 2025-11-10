// News Page JavaScript

// Add click event listeners to snapshot cards
document.addEventListener('DOMContentLoaded', () => {
    const snapshotCards = document.querySelectorAll('.snapshot-card');
    
    snapshotCards.forEach(card => {
        card.addEventListener('click', () => {
            const companySymbol = card.getAttribute('data-company');
            // Redirect to detailed stock page with company symbol
            window.location.href = `stock.html?symbol=${companySymbol}`;
        });
    });
    
    // Add hover effect to snapshot cards
    snapshotCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'none';
        });
    });
});