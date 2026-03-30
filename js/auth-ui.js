// ============================================
// AUTHENTICATION UI - COMPLETE FIXED VERSION
// ============================================

function initAuthUI() {
    initLoginForm();
    initRegisterForm();
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', handleLogin);
}

function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', handleRegister);
}

async function handleLogin(evt) {
    evt.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showErrorMessage('Please enter both email and password');
        return;
    }
    
    const submitBtn = evt.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    const result = await loginUser(email, password);
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    if (result.success) {
        showSuccessMessage(result.message || 'Login successful!');
        setTimeout(() => navigateTo('home'), 800);
    } else {
        showErrorMessage(result.error || 'Login failed');
    }
}

async function handleRegister(evt) {
    evt.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password')?.value;
    
    if (!name || !email || !password) {
        showErrorMessage('Please fill in all fields');
        return;
    }
    
    if (password.length < 6) {
        showErrorMessage('Password must be at least 6 characters');
        return;
    }
    
    if (confirmPassword && password !== confirmPassword) {
        showErrorMessage('Passwords do not match');
        return;
    }
    
    const submitBtn = evt.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    const result = await registerUser(name, email, password);
    
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    if (result.success) {
        showSuccessMessage(result.message || 'Registration successful!');
        setTimeout(() => navigateTo('home'), 800);
    } else {
        showErrorMessage(result.error || 'Registration failed');
    }
}

function showErrorMessage(message) {
    // Use alert for now (can be replaced with toast)
    alert('❌ ' + message);
}

function showSuccessMessage(message) {
    // Use alert for now (can be replaced with toast)
    alert('✅ ' + message);
}

console.log('✅ Auth UI module loaded');
