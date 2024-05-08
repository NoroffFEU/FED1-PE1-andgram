import { getAuthorizationHeaders } from './api.js';

// Function for registering user

document.getElementById('registerForm').addEventListener('submit', function (event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('username').value;

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
  .then (response => {
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

      // Create API key
      return fetch('https://v2.api.noroff.dev/auth/create-api-key', {
          method: 'POST',
          headers: {
              'Authorization': `Bearer ${data.accessToken}`,
              'Content-Type': 'application/json'
          }
      });
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('API key creation failed.');
      }
      return response.json();
  })
  .then(apiKeyData => {
      // API key created successfully
      console.log('API Key created successfully!');
      // Store the API key in localStorage
      localStorage.setItem('apiKey', apiKeyData.data.key);

      // Redirect user to login page
      window.location.href = 'login.html';
  })
  .catch(error => {
      console.error('Error:', error);
  });
});


// Function for user login

function handleLoginFormSubmit(event) {
    event.preventDefault();

    // Get the values entered in the form fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Prepare request body
    const requestBody = {
        email: email,
        password: password
    };

    // Send post request using Fetch
    const headers = getAuthorizationHeaders();

    fetch('https://v2.api.noroff.dev/auth/login', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
    })
    .then(response => {
        if (response.ok) {
            console.log('Login successful!');
            // Redirect user
            window.location.href = '../index.html';
        } else {
            console.error('Login failed');
            // Handle failed login (display error msg)
        }
    }) .catch(error => {
        console.error('Error:', error);
    }); 
}

document.getElementById('loginForm').addEventListener('submit', handleLoginFormSubmit);


// Function to check if tokens are present in localStorage
function checkAuth() {
  const accessToken = localStorage.getItem('accessToken');
  const apiKey = localStorage.getItem('apiKey');

  // If both tokens are present, return true (user is authenticated)
  return accessToken && apiKey;
}
