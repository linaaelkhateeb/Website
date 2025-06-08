document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Validation
    if (!fullname || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!agreeTerms) {
        alert('You must agree to the terms and conditions');
        return;
    }
    
    // Here you would typically send data to a server
    console.log('Signup data:', {
        fullname,
        email,
        password,
        agreeTerms
    });
    
    // Simulate successful signup
    alert(`Welcome ${fullname}! Your account has been created.`);
    
    // Reset form
    this.reset();
    
    // In a real app, you might redirect to login or dashboard
    // window.location.href = 'login.html';
});

// Password strength indicator (optional enhancement)
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const hint = this.parentNode.querySelector('.password-hint');
    
    if (password.length > 0 && password.length < 8) {
        hint.style.color = 'var(--palm-oil)';
    } else {
        hint.style.color = 'var(--natural)';
    }
});

// Input focus effects
const inputs = document.querySelectorAll('.input-group input');
inputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentNode.querySelector('label').style.color = 'var(--organic)';
    });
    
    input.addEventListener('blur', () => {
        input.parentNode.querySelector('label').style.color = 'var(--cocoa)';
    });
});