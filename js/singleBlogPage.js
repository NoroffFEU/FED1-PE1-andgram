import { getAuthorizationHeaders } from './api.js';

// Function to extract ID from URL parameters
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log('Getting ID from URL')
    return urlParams.get('id');
    
}

// Function to display blog post details
async function displayBlogPostDetails() {
    try {
        // Get post ID from URL
        const postId = getPostIdFromUrl();

        if(!postId) {
            throw new Error('Post ID not found in URL');
        }

        // Get authentication headers
        const headers = getAuthorizationHeaders();

         // Fetch blog post details from API using post ID
         const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blog post details');
        }

        const { data } = await response.json();

        // Display blog post details on the page
        const postContainer = document.getElementById('post-container');
        postContainer.innerHTML = '';

        const titleElement = document.createElement('h1');
        titleElement.textContent = data.title;

        const imageElement = document.createElement('img');
        if (data.media && data.media.url) {
            imageElement.src = data.media.url;
            imageElement.alt = data.media.alt || 'Image';
        } else {
            console.warn('Image URL is missing or invalid:', data.media);
            imageElement.src = 'images/fallback-img.jpg';
            imageElement.alt = 'Fallback Image';
        }

        const contentElement = document.createElement('p');
        contentElement.textContent = data.body;

        postContainer.appendChild(titleElement);
        postContainer.appendChild(imageElement);
        postContainer.appendChild(contentElement);

    
        populateEditFrom(data); // Populate form with fetched post
    } catch (error) {
        console.error('Error fetching and displaying blog post details');
    }
}

function populateEditFrom(postData) {
    document.getElementById('title').value = postData.title;
    document.getElementById('content').value = postData.body; // Assuming `body` corresponds to `content`
    document.getElementById('tags').value = postData.tags.join(', '); // Convert tags array to string
    document.getElementById('imageUrl').value = postData.media ? postData.media.url : ''; // Set media URL if available
}

// Call function to display blog post details when the page loads
window.onload = displayBlogPostDetails;

export { getPostIdFromUrl }