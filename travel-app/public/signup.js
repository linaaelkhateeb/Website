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