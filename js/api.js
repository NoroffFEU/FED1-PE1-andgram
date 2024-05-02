
async function createBlogPost(title, body, tags, mediaUrl, mediaAlt) {
    try {
      // Get access token and API key from storage
      const accessToken = localStorage.getItem('accessToken');
      const apiKey = localStorage.getItem('apiKey');
  
      // Check if both access token and API key are available
      if (!accessToken || !apiKey) {
        throw new Error('Access token or API key not found');
      }
  
      // Construct headers with access token and API key
      const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'X-Noroff-API-Key': apiKey,
        'Content-Type': 'application/json'
      };
  
      // Construct request body for creating blog post
    const requestBody = {
        title: title,
        body: body, // Optional
        tags: tags.split(','), // Convert comma-separated string to array of strings
        media: {
         url: mediaUrl, // Optional
         alt: mediaAlt // Optional
    }
  };
  
  
      // Make a POST request to create blog post
      const response = await fetch('https://v2.api.noroff.dev/social/posts', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });
  
      if (!response.ok) {
        throw new Error('Failed to create blog post');
      }
  
      // Handle successful response
      const responseData = await response.json();
      console.log('Blog post created:', responseData);
      // Optionally return or handle the response data
      return responseData;
    } catch (error) {
      console.error('Error:', error.message);
      // Handle errors appropriately
    }
  }

console.log('API script running');
  
  // Export the function
  export { createBlogPost };



  