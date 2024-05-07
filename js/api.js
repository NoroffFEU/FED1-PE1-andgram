
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

    

  export { getAuthorizationHeaders };
  