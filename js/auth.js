

// Function for registering user

// Check if the register form exists on the page
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    // Add event listener to the register form
    registerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        // Get form field values
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Create request body
        const requestBody = {
            username: username,
            email: email,
            password: password
        };

        // Register user
        fetch('https://v2.api.noroff.dev/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Registration failed.');
                }
                return response.json();
            })
            .then(data => {
                // Registration successful
                console.log('Registration successful!');
                // Store the access token in localStorage
                localStorage.setItem('accessToken', data.accessToken);

                // Redirect user to login page
                window.location.href = 'login.html';
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
}


// Function to check if tokens are present in localStorage
function checkAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');

    // If both tokens are present, return true (user is authenticated)
    return accessToken && apiKey;
}

// function to logout 
function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');

    window.location.href = '../index.html';
    alert('You have been logged out!')
}

// Add event listener to the logout button

document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('primary-navigation'); // Assuming menu is a parent element containing the logout button
    if (menu) {
        menu.addEventListener('click', function (event) {
            if (event.target.matches('#logoutButton')) {
                handleLogout();
            }
        });
    }
});

export { checkAuth }