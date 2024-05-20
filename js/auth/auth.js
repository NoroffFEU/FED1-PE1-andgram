// Function to get authorization headers
function getAuthorizationHeaders() {
    // Get access token and API key from storage
    const accessToken = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');
  
    // Check if both access token and API key are available
    if (!accessToken || !apiKey) {
      throw new Error('Access token or API key not found');
    }
  
    // Construct headers with access token and API key
    const headers = {
      'Content-Type': 'application/json',  
      'Authorization': `Bearer ${accessToken}`,
      'X-Noroff-API-Key': apiKey
    };
    return headers;
  }

// Function for registering user
function registerUser() {
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
                localStorage.setItem('logoutSuccess', 'true');
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
}

// Function to check if tokens are present in localStorage
function checkAuth() {
    const accessToken = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');

    // If both tokens are present, return true (user is authenticated)
    return accessToken && apiKey;
}

// Function to handle login
async function handleLogin(email, password) {
    try {
      // Make a POST request to login endpoint
      const response = await fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
  
      if (!response.ok) {
        throw new Error('Failed to login');
      }
      // Extract access token from response
      const { data } = await response.json();
      const accessToken = data.accessToken;
  
      // Create API key using access token
      const apiKeyResponse = await fetch('https://v2.api.noroff.dev/auth/create-api-key', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: 'My API Key name'
        })
      });
  
      if (!apiKeyResponse.ok) {
        throw new Error('Failed to create API key');
      }
      // Extract API key from response
      const apiKeyData = await apiKeyResponse.json();
      const apiKey = apiKeyData.data.key;
  
      // Store access token and API key in local storage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('apiKey', apiKey);
      localStorage.setItem('loginSuccess', 'true');
  
      window.location.href = '../index.html';
  
    } catch (error) {
      console.error('Error:', error.message);
    }
  }
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      // Add event listener to the form
    loginForm.addEventListener('submit', async function(event) {
      event.preventDefault();
    
      // Retrieve form field values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
    
      // Call handleLogin function with the form data
      await handleLogin(email, password);
    });
  }
  

// function to logout 
function handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');
    localStorage.setItem('logoutSuccess', 'true');

    window.location.href = '../index.html';
}

// Add event listener to the logout button
document.addEventListener('DOMContentLoaded', function () {
    const menu = document.getElementById('primary-navigation');
    if (menu) {
        menu.addEventListener('click', function (event) {
            if (event.target.matches('#logoutButton')) {
                handleLogout();
            }
        });
    }
});

export {
    getAuthorizationHeaders,
    checkAuth,
    handleLogin,
    handleLogout,
    registerUser
};