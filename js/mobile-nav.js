// Mobile Navigation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Close offcanvas when clicking on a link
    const offcanvasLinks = document.querySelectorAll('.offcanvas-body .nav-link');
    const offcanvas = document.getElementById('mobileMenu');
    
    offcanvasLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Close the offcanvas
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        });
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        // Close offcanvas if window is resized to large screen
        if (window.innerWidth >= 992) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }
    });
});