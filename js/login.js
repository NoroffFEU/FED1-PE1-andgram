import { getAuthorizationHeaders } from './api.js';

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