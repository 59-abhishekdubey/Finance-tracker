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
    
    // Remove any existing listeners by cloning
    const newForm = loginForm.cloneNode(true);
    loginForm.parentNode.replaceChild(newForm, loginForm);
    
    newForm.addEventListener('submit', handleLogin);
}

function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    // Remove any existing listeners by cloning
    const newForm = registerForm.cloneNode(true);
    registerForm.parentNode.replaceChild(newForm, registerForm);
    
    newForm.addEventListener('submit', handleRegister);
}

async function handleLogin(evt) {
    evt.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showAuthMessage('login', 'Please enter both email and password', 'error');
        return;
    }
    
    const submitBtn = evt.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    
    try {
        const result = await loginUser(email, password);
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (result.success) {
            showAuthMessage('login', result.message || 'Login successful!', 'success');
            setTimeout(() => navigateTo('home'), 800);
        } else {
            showAuthMessage('login', result.error || 'Login failed. Please check your credentials.', 'error');
        }
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.error('Login error:', error);
        showAuthMessage('login', 'Connection error. Is the backend server running on port 5000?', 'error');
    }
}

async function handleRegister(evt) {
    evt.preventDefault();
    
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    // Support both ID formats for confirm password
    const confirmPassword = (
        document.getElementById('register-confirm-password') ||
        document.getElementById('register-password-confirm')
    )?.value;
    
    if (!name || !email || !password) {
        showAuthMessage('register', 'Please fill in all fields', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAuthMessage('register', 'Password must be at least 6 characters', 'error');
        return;
    }
    
    if (confirmPassword && password !== confirmPassword) {
        showAuthMessage('register', 'Passwords do not match', 'error');
        return;
    }
    
    const submitBtn = evt.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    
    try {
        const result = await registerUser(name, email, password);
        
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        if (result.success) {
            showAuthMessage('register', result.message || 'Registration successful!', 'success');
            setTimeout(() => navigateTo('home'), 800);
        } else {
            showAuthMessage('register', result.error || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        console.error('Register error:', error);
        showAuthMessage('register', 'Connection error. Is the backend server running on port 5000?', 'error');
    }
}

// Show inline message instead of alert for better UX
function showAuthMessage(formType, message, type) {
    const messageEl = document.getElementById(`${formType}-message`);
    
    if (messageEl) {
        messageEl.textContent = message;
        messageEl.className = `auth-message ${type}`;
        messageEl.style.display = 'block';
        messageEl.style.padding = '12px 16px';
        messageEl.style.borderRadius = '8px';
        messageEl.style.marginBottom = '16px';
        messageEl.style.fontSize = '14px';
        messageEl.style.fontWeight = '500';
        messageEl.style.textAlign = 'center';
        
        if (type === 'error') {
            messageEl.style.background = '#FEF2F2';
            messageEl.style.color = '#DC2626';
            messageEl.style.border = '1px solid #FECACA';
        } else {
            messageEl.style.background = '#F0FDF4';
            messageEl.style.color = '#16A34A';
            messageEl.style.border = '1px solid #BBF7D0';
        }
        
        // Auto-hide after 5 seconds for errors
        if (type === 'error') {
            setTimeout(() => {
                messageEl.style.display = 'none';
            }, 5000);
        }
    } else {
        // Fallback to alert if message element not found
        const prefix = type === 'error' ? '❌ ' : '✅ ';
        alert(prefix + message);
    }
}

console.log('✅ Auth UI module loaded');
