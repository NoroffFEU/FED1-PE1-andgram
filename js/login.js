
// Function to handle login
async function handleLogin(email, password) {
  try {
    // Make a POST request to login endpoint
    const response = await fetch('https://v2.api.noroff.dev/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }) // Pass email and password in the request body
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
        name: 'My API Key name' // Optional: Provide a name for your API key
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

    // Redirect user to index page
    window.location.href = '../index.html';

    // Optionally return or handle the obtained API key
    return apiKey;
  } catch (error) {
    console.error('Error:', error.message);
    // Handle errors appropriately
  }
}

// Add event listener to the form
document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent form submission

  // Retrieve form field values
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Call the handleLogin function with the form data
  await handleLogin(email, password);
});
