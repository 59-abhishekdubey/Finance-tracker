// ============================================
// AUTHENTICATION UI HANDLERS
// ============================================

function initAuthUI() {
    initLoginForm();
    initRegisterForm();
}

function initLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    
    loginForm.addEventListener('submit', async function(evt) {
        evt.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }
        
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';
        
        try {
            const result = await loginUser(email, password);
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            if (result.success) {
                // FIX: Show proper message
                alert(result.message || 'Login successful!');
                setTimeout(() => navigateTo('home'), 500);
            } else {
                // FIX: Show proper error
                alert(result.error || 'Login failed. Please try again.');
            }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert('An error occurred. Please try again.');
        }
    });
}

function initRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;
    
    registerForm.addEventListener('submit', async function(evt) {
        evt.preventDefault();
        
        const name = document.getElementById('register-name').value.trim();
        const email = document.getElementById('register-email').value.trim();
        const password = document.getElementById('register-password').value;
        
        if (!name || !email || !password) {
            alert('Please fill in all fields');
            return;
        }
        
        if (password.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';
        
        try {
            const result = await registerUser(name, email, password);
            
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            if (result.success) {
                alert(result.message || 'Registration successful!');
                setTimeout(() => navigateTo('home'), 500);
            } else {
                alert(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            alert('An error occurred. Please try again.');
        }
    });
}

console.log('✅ Auth UI module loaded');
