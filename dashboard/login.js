document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const passwordToggle = document.querySelector('.password-toggle');
    const loginButton = document.querySelector('.login-button');

    // Common email providers for typo detection
    const commonEmailProviders = [
        'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
        'aol.com', 'icloud.com', 'protonmail.com'
    ];

    // Email validation pattern - more strict RFC 5322 standard
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    // Password validation requirements - enhanced security
    const passwordRequirements = {
        minLength: 8,
        maxLength: 128,
        hasUpperCase: /[A-Z]/,
        hasLowerCase: /[a-z]/,
        hasNumber: /[0-9]/,
        hasSpecial: /[!@#$%^&*(),.?":{}|<>]/,
        noConsecutiveChars: /(.)\1{2,}/,  // No more than 2 identical consecutive characters
        noCommonPatterns: /(password|123456|qwerty)/i  // Common patterns to avoid
    };

    // Real-time email validation
    emailInput.addEventListener('input', function() {
        validateEmail();
    });

    // Real-time password validation
    passwordInput.addEventListener('input', function() {
        validatePassword();
    });

    // Password visibility toggle
    passwordToggle.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type');
        const newType = type === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', newType);
        
        // Update icon
        const icon = this.querySelector('i');
        icon.className = newType === 'password' ? 'far fa-eye' : 'far fa-eye-slash';
        
        // Update aria-label
        this.setAttribute('aria-label', 
            newType === 'password' ? 'Show password' : 'Hide password'
        );
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate both fields
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (isEmailValid && isPasswordValid) {
            // Add loading state
            loginButton.classList.add('loading');
            loginButton.disabled = true;

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Mark user as logged in so dashboard doesn't redirect back to login
                try {
                    localStorage.setItem('isLoggedIn', 'true');
                } catch (err) {
                    // If localStorage is unavailable, still attempt redirect
                    console.warn('Could not access localStorage:', err);
                }

                // Redirect to dashboard on success
                window.location.href = 'index.html';
            } catch (error) {
                showError('login-error', 'An error occurred. Please try again.');
            } finally {
                loginButton.classList.remove('loading');
                loginButton.disabled = false;
            }
        }
    });

    // Email validation function
    function validateEmail() {
        const email = emailInput.value.trim().toLowerCase();
        const errorElement = document.getElementById('email-error');
        
        if (email === '') {
            showError(errorElement, 'Email is required');
            return false;
        }
        
        if (!emailPattern.test(email)) {
            showError(errorElement, 'Please enter a valid email address');
            return false;
        }

        // Check for common email typos
        const [localPart, domain] = email.split('@');
        
        // Check domain typos against common providers
        const similarDomain = commonEmailProviders.find(provider => {
            const distance = levenshteinDistance(domain, provider);
            return distance > 0 && distance <= 2;  // Allow up to 2 character differences
        });

        if (similarDomain && domain !== similarDomain) {
            showError(errorElement, `Did you mean ${localPart}@${similarDomain}?`);
            return false;
        }

        // Validate local part
        if (localPart.length < 3) {
            showError(errorElement, 'Username part of email is too short');
            return false;
        }

        if (localPart.length > 64) {
            showError(errorElement, 'Username part of email is too long');
            return false;
        }

        clearError(errorElement);
        return true;
    }

    // Levenshtein distance calculation for typo detection
    function levenshteinDistance(str1, str2) {
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

        for (let i = 0; i <= m; i++) dp[i][0] = i;
        for (let j = 0; j <= n; j++) dp[0][j] = j;

        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(
                        dp[i - 1][j],     // deletion
                        dp[i][j - 1],     // insertion
                        dp[i - 1][j - 1]  // substitution
                    );
                }
            }
        }
        return dp[m][n];
    }

    // Password validation function with strength meter
    function validatePassword() {
        const password = passwordInput.value;
        const errorElement = document.getElementById('password-error');
        let errors = [];
        let strengthScore = 0;

        // Basic requirements
        if (password.length < passwordRequirements.minLength) {
            errors.push('at least 8 characters');
        } else {
            strengthScore += 20;
        }

        if (password.length > passwordRequirements.maxLength) {
            errors.push('less than 128 characters');
        }

        if (!passwordRequirements.hasUpperCase.test(password)) {
            errors.push('an uppercase letter');
        } else {
            strengthScore += 20;
        }

        if (!passwordRequirements.hasLowerCase.test(password)) {
            errors.push('a lowercase letter');
        } else {
            strengthScore += 20;
        }

        if (!passwordRequirements.hasNumber.test(password)) {
            errors.push('a number');
        } else {
            strengthScore += 20;
        }

        if (!passwordRequirements.hasSpecial.test(password)) {
            errors.push('a special character');
        } else {
            strengthScore += 20;
        }

        // Additional security checks
        if (passwordRequirements.noConsecutiveChars.test(password)) {
            errors.push('no more than two identical consecutive characters');
            strengthScore -= 10;
        }

        if (passwordRequirements.noCommonPatterns.test(password)) {
            errors.push('no common patterns (e.g., "password", "123456", "qwerty")');
            strengthScore -= 20;
        }

        // Update password strength indicator
        updatePasswordStrength(strengthScore);

        if (errors.length > 0) {
            showError(errorElement, 'Password must contain ' + errors.join(', '));
            return false;
        }

        clearError(errorElement);
        return true;
    }

    // Update password strength indicator
    function updatePasswordStrength(score) {
        const strengthElement = document.createElement('div');
        strengthElement.className = 'password-strength';
        let strengthText = '';
        let strengthClass = '';

        if (score < 40) {
            strengthText = 'Weak';
            strengthClass = 'weak';
        } else if (score < 70) {
            strengthText = 'Moderate';
            strengthClass = 'moderate';
        } else {
            strengthText = 'Strong';
            strengthClass = 'strong';
        }

        strengthElement.textContent = `Password Strength: ${strengthText}`;
        strengthElement.classList.add(strengthClass);

        const errorElement = document.getElementById('password-error');
        const existingStrength = document.querySelector('.password-strength');
        
        if (existingStrength) {
            existingStrength.replaceWith(strengthElement);
        } else {
            // Insert after the error message element
            errorElement.insertAdjacentElement('afterend', strengthElement);
        }
    }

    // Helper functions for error handling
    function showError(element, message) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        element.textContent = message;
        element.closest('.form-group').querySelector('input').classList.add('error');
    }

    function clearError(element) {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }
        element.textContent = '';
        element.closest('.form-group').querySelector('input').classList.remove('error');
    }

    // Handle focus and blur events for better UX
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.closest('.form-group').classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.closest('.form-group').classList.remove('focused');
            // Validate on blur for better user experience
            if (this.type === 'email') {
                validateEmail();
            } else if (this.type === 'password') {
                validatePassword();
            }
        });
    });
});