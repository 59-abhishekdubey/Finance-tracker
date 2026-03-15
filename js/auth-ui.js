// ========== LOGIN FORM HANDLER ==========

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    const registerPassword = document.getElementById('register-password');
    if (registerPassword) {
        registerPassword.addEventListener('input', updatePasswordStrength);
    }
});

// Handle Login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('login-message');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    messageDiv.className = 'auth-message';
    messageDiv.textContent = '';
    
    setTimeout(() => {
        const result = loginUser(email, password);
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (result.success) {
            showMessage(messageDiv, 'success', 'Login successful! Redirecting...');
            setTimeout(() => { navigateTo('home'); }, 1000);
        } else {
            showMessage(messageDiv, 'error', result.error || 'Login failed. Please try again.');
        }
    }, 500);
}

// Handle Register
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-password-confirm').value;
    const avatar = '👤'; // Default avatar for all users
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('register-message');
    
    messageDiv.className = 'auth-message';
    messageDiv.textContent = '';
    
    if (password !== confirmPassword) {
        showMessage(messageDiv, 'error', 'Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showMessage(messageDiv, 'error', 'Password must be at least 6 characters long!');
        return;
    }
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    setTimeout(() => {
        const result = registerUser({
            name: name,
            email: email,
            password: password,
            avatar: avatar
        });
        
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        
        if (result.success) {
            showMessage(messageDiv, 'success', 'Account created successfully! Redirecting to login...');
            setTimeout(() => { navigateTo('login'); }, 1500);
        } else {
            showMessage(messageDiv, 'error', result.error || 'Registration failed. Please try again.');
        }
    }, 500);
}

// Show Message Helper
function showMessage(element, type, message) {
    if (!element) return;
    element.className = 'auth-message ' + type + ' show';
    element.textContent = message;
}

// Update Password Strength
function updatePasswordStrength(e) {
    const password = e.target.value;
    const strengthBar = document.getElementById('password-strength-bar');
    
    if (!strengthBar) return;
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    strengthBar.className = 'password-strength-bar';
    
    if (strength <= 2) {
        strengthBar.classList.add('weak');
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
}
