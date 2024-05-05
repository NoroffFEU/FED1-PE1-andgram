
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

  // Function to fetch all blog posts
async function fetchAllBlogPosts() {
    try {
        // Get authorization headers
        const headers = getAuthorizationHeaders();
        
        // Make a GET request to fetch all blog posts with authorization headers
        const response = await fetch('https://v2.api.noroff.dev/social/profiles/andgram/posts', {
            headers: headers
        });
        
        // Check if the response is successful
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        
        // Parse the JSON response and extract the 'data' field
        const { data } = await response.json();
        
        // Return the array of blog posts
        return data;
    } catch (error) {
        // If an error occurs, log the error and throw it again for handling in the calling function
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}
    

  export { getAuthorizationHeaders, fetchAllBlogPosts };
  