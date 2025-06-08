document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember').checked;
    
    // Simple validation
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Here you would typically send data to a server
    console.log('Login attempt with:', {
        username,
        password,
        rememberMe
    });
    
    // Simulate successful login
    alert(`Welcome back, ${username}!`);
    
    // Reset form
    this.reset();
    
    // In a real app, you would redirect to another page
    // window.location.href = 'dashboard.html';
});

// Add some interactive effects
const inputs = document.querySelectorAll('.input-group input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentNode.querySelector('label').style.color = 'var(--organic)';
    });
    
    input.addEventListener('blur', () => {
        input.parentNode.querySelector('label').style.color = 'var(--cocoa)';
    });
});