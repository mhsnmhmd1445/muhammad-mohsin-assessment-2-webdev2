// In auth.js
async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (data.success) {
            // Handle successful logout (e.g., redirect to login page)
            window.location.href = data.redirectUrl;
        } else {
            console.error('Logout failed:', data.error);
        }
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Function to check if user is logged in
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        return data.isAuthenticated;
    } catch (error) {
        console.error('Auth status check failed:', error);
        return false;
    }
}

// Function to update UI based on auth status
async function updateAuthUI() {
    const isAuthenticated = await checkAuthStatus();
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');
    const signupButton = document.getElementById('signup-button');

    if (isAuthenticated) {
        if (logoutButton) logoutButton.style.display = 'block';
        if (loginButton) loginButton.style.display = 'none';
        if (signupButton) signupButton.style.display = 'none';
    } else {
        if (logoutButton) logoutButton.style.display = 'none';
        if (loginButton) loginButton.style.display = 'block';
        if (signupButton) signupButton.style.display = 'block';
    }
}

// Call updateAuthUI when page loads
document.addEventListener('DOMContentLoaded', updateAuthUI);