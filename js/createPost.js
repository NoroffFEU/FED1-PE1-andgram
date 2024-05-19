import { getAuthorizationHeaders } from './api.js';

async function createBlogPost(title, body, tags, mediaUrl, mediaAlt) {
    try {
        // Get headers
        const headers = getAuthorizationHeaders();

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
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/andgram', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to create blog post');
        }

        // Handle successful response
        const responseData = await response.json();
        console.log('Response data:', responseData);

        // Accessing the id from the data object
        const newPostId = responseData.data.id;

        // Constructing the URL with the id parameter
        const newPostUrl = `../post/index.html?id=${newPostId}`;

        // Redirecting to the new post's URL
        window.location.href = newPostUrl;

        localStorage.setItem('newPostSuccess', 'true');

    } catch (error) {
        console.error('Error:', error.message);
        // Handle errors appropriately
    }
}


// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    // Get form values
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const tags = document.getElementById('tags').value;
    const mediaUrl = document.getElementById('media-url').value;
    const mediaAlt = document.getElementById('media-alt').value;

    // Call createBlogPost function with form values
    createBlogPost(title, body, tags, mediaUrl, mediaAlt);
}

// Attach handleFormSubmit function to the form's submit event
const form = document.getElementById('blog-post-form'); // Replace 'your-form-id' with the actual ID of your form element
form.addEventListener('submit', handleFormSubmit);
