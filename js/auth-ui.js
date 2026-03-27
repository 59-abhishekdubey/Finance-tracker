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

// Handle Login - Updated for API
async function handleLogin(evt) {
    evt.preventDefault();
    
    const email = document.getElementById('login-email')?.value?.trim() || '';
    const password = document.getElementById('login-password')?.value || '';
    const submitBtn = evt.target?.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('login-message');
    
    // Validation
    if (!email || !password) {
        if (messageDiv) {
            showMessage(messageDiv, 'error', 'Please enter email and password');
        }
        return;
    }
    
    // Show button loading
    if (submitBtn) {
        setButtonLoading(submitBtn, true);
    }
    
    // Clear previous messages
    if (messageDiv) {
        messageDiv.className = 'auth-message';
        messageDiv.textContent = '';
    }
    
    // Call API
    const result = await loginUser(email, password);
    
    // Remove loading
    if (submitBtn) {
        setButtonLoading(submitBtn, false);
    }
    
    if (result.success) {
        if (messageDiv) {
            showMessage(messageDiv, 'success', 'Login successful! Redirecting...');
        }
        
        // Show full screen loading while redirecting
        showLoading('Loading your dashboard...');
        
        setTimeout(() => {
            hideLoading();
            navigateTo('home');
        }, 800);
    } else {
        showMessage(messageDiv, 'error', result.error || 'Login failed. Please try again.');
    }
}

// Handle Register - Updated for API
async function handleRegister(evt) {
    evt.preventDefault();
    
    const name = document.getElementById('register-name')?.value?.trim() || '';
    const email = document.getElementById('register-email')?.value?.trim() || '';
    const password = document.getElementById('register-password')?.value || '';
    const confirmPassword = document.getElementById('register-password-confirm')?.value || '';
    const avatar = '👤'; // Default avatar for all users
    
    const submitBtn = evt.target?.querySelector('button[type="submit"]');
    const messageDiv = document.getElementById('register-message');
    
    // Clear previous messages
    if (messageDiv) {
        messageDiv.className = 'auth-message';
        messageDiv.textContent = '';
    }
    
    // Validation
    if (!name || name.length < 2) {
        if (messageDiv) {
            showMessage(messageDiv, 'error', 'Please enter a valid name!');
        }
        return;
    }
    
    if (!email) {
        if (messageDiv) {
            showMessage(messageDiv, 'error', 'Please enter an email!');
        }
        return;
    }
    
    if (password !== confirmPassword) {
        if (messageDiv) {
            showMessage(messageDiv, 'error', 'Passwords do not match!');
        }
        return;
    }
    
    if (password.length < 6) {
        if (messageDiv) {
            showMessage(messageDiv, 'error', 'Password must be at least 6 characters long!');
        }
        return;
    }
    
    // Show button loading
    if (submitBtn) {
        setButtonLoading(submitBtn, true);
    }
    
    // Call API
    const result = await registerUser({
        name: name,
        email: email,
        password: password,
        avatar: avatar
    });
    
    // Remove loading
    if (submitBtn) {
        setButtonLoading(submitBtn, false);
    }
    
    if (result.success) {
        if (messageDiv) {
            showMessage(messageDiv, 'success', 'Account created successfully! Logging you in...');
        }
        
        // Auto login after registration
        showLoading('Setting up your account...');
        
        setTimeout(() => {
            hideLoading();
            navigateTo('home');
        }, 800);
            }, 1500);
        } else if (messageDiv) {
            showMessage(messageDiv, 'error', result.error || 'Registration failed. Please try again.');
        }
    }, 800);
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
    if (/\d/.test(password)) strength++;
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
