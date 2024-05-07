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