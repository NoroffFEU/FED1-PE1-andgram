import { displayErrorMessage } from '../uiUtiles/index.js';

// Function to get authorization headers
function getAuthorizationHeaders() {
  const accessToken = localStorage.getItem('accessToken');
  const apiKey = localStorage.getItem('apiKey');

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

// Function to check if tokens are present in localStorage
function checkAuth() {
  return localStorage.getItem('accessToken') && localStorage.getItem('apiKey');
}

// Function for registering user
async function registerUser() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    // Add event listener to the register form
    registerForm.addEventListener('submit', async function (event) {
      event.preventDefault();

      // Get form field values
      const name = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      // Input validation
      if (!name || !email || !password) {
        displayErrorMessage('All fields are required.');
        return;
      }

      // Create request body
      const requestBody = {
        name: name,
        email: email,
        password: password
      };

      try {
        // Register user
        const response = await fetch('https://v2.api.noroff.dev/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Registration failed.');
        }

        const data = await response.json();

        // Registration successful
        localStorage.setItem('logoutSuccess', 'true');
        // Store the access token in localStorage
        localStorage.setItem('accessToken', data.accessToken);

        // Redirect user to login page
        window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/account/login.html';

      } catch (error) {
        console.error('Error:', error);
        displayErrorMessage(error.message || 'An unknown error occurred. Please try again.');
      }
    });
  }
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
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to login');
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

      const errorData = await apiKeyResponse.json();
      throw new Error(errorData.message || 'Failed to create API key');
    }
    // Extract API key from response
    const apiKeyData = await apiKeyResponse.json();
    const apiKey = apiKeyData.data.key;

    // Store access token and API key in local storage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('apiKey', apiKey);
    localStorage.setItem('loginSuccess', 'true');

    window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/index.html';

  } catch (error) {
    console.error('Error:', error.message);
    // Display error message to the user
    displayErrorMessage(error.message || 'An unknown error occurred. Please try again.');
  }
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  // Add event listener to the form
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
      // Retrieve form field values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Call handleLogin function with the form data
      await handleLogin(email, password);
    } catch (error) {
      console.error('Error during login:', error.message);
      // Display error message to the user
      displayErrorMessage(error.message || 'An unknown error occured. Please try again.')
    }
  });
}

// function to logout 
function handleLogout() {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiKey');
    localStorage.setItem('logoutSuccess', 'true');
    window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/index.html';
  } catch (error) {
    console.error('Error during logout:', error.message);
    // Display error message to the user
    displayErrorMessage(error.message || 'An unknown error occurred. Please try again.');
  }
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