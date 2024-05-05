

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


// Function to display all blog posts
async function displayAllBlogPosts() {
    try {
        // Get authorization headers
        const headers = getAuthorizationHeaders();

        // Fetch all blog posts from API with authorization headers
        const response = await fetch('https://v2.api.noroff.dev/social/profiles/andgram/posts', {
            headers: headers
        });

        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }

        const { data } = await response.json();

        // Get the container to display blog posts inside
        const postContainer = document.getElementById('posts-container');

        // Clear previous content in the container
        postContainer.innerHTML = '';

        // Loop through each blog post and create HTML elements to display them
        data.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            const imageElement = document.createElement('img');
            if (post.media && post.media.url) {
                imageElement.src = post.media.url;
                imageElement.alt = post.media.alt || 'Image';
            } else {
                console.warn('Image URL is missing or invalid:', post.media);
                
                imageElement.src = 'images/fallback-img.jpg';
                imageElement.alt = 'Fallback Image';
            }

            const titleElement = document.createElement('h3');
            titleElement.textContent = post.title;

            const bodyElement = document.createElement('p');
            bodyElement.textContent = post.body;

            // Append title and body to post element
            postElement.appendChild(titleElement);
            postElement.appendChild(bodyElement);
            postElement.appendChild(imageElement);

            postContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching and displaying blog posts:', error);
    }
}

async function editBlogPost(postId, updatedData) {
    try {
        const headers = getAuthorizationHeaders();
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
            method: 'PUT',
            headers: headers,
            body: JSON.stringify(updatedData)
        });
        if (!response.ok) {
            throw new Error('Failed to edit blog post');
        }
        const responseData = await response.json();
        console.log('Blog post edited successfully:', responseData);
        return responseData;
    } catch (error) {
        console.error('Error editing blog post:', error);
        throw error;
    }
}

async function deleteBlogPost(postId) {
    try {
        // Get headers
        const headers = getAuthorizationHeaders();

        // Make a delete request to delete blog post
        const response = await fetch(`https://v2.api.noroff.dev/social/posts/${postId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            throw new Error8('Failed to delete blog post');
        }

        // Handle successful response 
        console.log('Blog post deleted successfully');
        return true;
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
}


export { displayAllBlogPosts, createBlogPost, deleteBlogPost, editBlogPost };



