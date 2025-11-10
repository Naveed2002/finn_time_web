// Authentication JavaScript

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Set up event listeners
    setupEventListeners();
});

// Set up event listeners
function setupEventListeners() {
    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleRegister();
        });
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleLogin();
        });
    }
}

// Handle user registration
function handleRegister() {
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long.');
        return;
    }
    
    if (!terms) {
        alert('Please agree to the terms and conditions.');
        return;
    }
    
    // In a real app, this would send data to a server
    console.log('Registering user:', { email, password });
    
    // Show success message
    alert('Registration successful! You can now sign in.');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Handle user login
function handleLogin() {
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }
    
    // In a real app, this would authenticate with a server
    console.log('Logging in user:', { email, password });
    
    // Show success message
    alert('Login successful! Welcome back.');
    
    // Redirect to home page
    window.location.href = 'index.html';
}