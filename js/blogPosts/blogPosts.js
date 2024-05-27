 import { checkAuth, getAuthorizationHeaders } from "../auth/index.js";
 import { addHoverEffectToImageContainers, addRegularHoverEffect, displayErrorMessage } from "../uiUtiles/index.js";

 async function fetchAllPosts() {
    try {
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/andgram', {
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts');
        }
        const { data } = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}

 // Function to display all blog posts in grid
 async function displayAllBlogPosts() {
    try {
        const postData = await fetchAllPosts();

        const postContainer = document.getElementById('posts-container');
        postContainer.innerHTML = '';

        // Loop through each blog post and create HTML elements to display them
        postData.forEach(post => {
            // Create anchor element for the post
            const postLink = document.createElement('a');
            postLink.href = `post/index.html?id=${post.id}`;
            postLink.classList.add('post-link');

            // Create post element
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            // Create image element
            const imageElement = document.createElement('img');
            if (post.media && post.media.url) {
                imageElement.src = post.media.url;
                imageElement.alt = post.media.alt || 'Image';
            } else {
                console.warn('Image URL is missing or invalid:', post.media);
                imageElement.src = 'images/fallback-img.jpg';
                imageElement.alt = 'Fallback Image';
            }

            // Create title element
            const titleElement = document.createElement('h3');
            titleElement.textContent = post.title;

            // Create element to display extra info to logged in user
            const hoverInfoElement = document.createElement('div');
            hoverInfoElement.className = 'hover-info';
            hoverInfoElement.textContent = 'View/edit blog post';

            // Create image container
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('grid-image-container');

            // Append elemets to image container
            imageContainer.appendChild(imageElement);
            imageContainer.appendChild(hoverInfoElement);

            // Append title and image to post element
            postElement.appendChild(imageContainer);
            postElement.appendChild(titleElement);
            
            // Append post element to post link
            postLink.appendChild(postElement);

            // Append post link to post container
            postContainer.appendChild(postLink);

            if (checkAuth()) {
                addHoverEffectToImageContainers();
            } else {
                addRegularHoverEffect();
            }
        });
    } catch (error) {
        console.error('Error fetching and displaying blog posts:', error);
    }
} 
// Function to extract ID from URL parameters
function getPostIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}
// Function to replace newline characters with <br> tags
function convertNewlinesToBreaks(text) {
    return text.replace(/\n/g, '<br>');
}

// Function to display blog post details
async function displayBlogPostDetails() {
    const loadingElement = document.getElementById('loading');
    const postContainer = document.getElementById('post-container');

    try {
        //Show loading spinner
        loadingElement.classList.remove('hidden');
        postContainer.classList.add('hidden');

        // Get post ID from URL
        const postId = getPostIdFromUrl();

        if (!postId) {
            throw new Error('Post ID not found in URL');
        }
        // Fetch blog post details from API using post ID
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch blog post details. Server responded with ' + response.status);
        }

        const { data } = await response.json();

        if (!data) {
            throw new Error('No data received from the server');
        }

        // Check if postContainer exists before proceeding
        if (!postContainer) {
            console.error('Post container not found');
            return;
        }

        postContainer.innerHTML = '';

        const titleElement = document.createElement('h1');
        titleElement.textContent = data.title;

        const imageElement = document.createElement('img');
        if (data.media && data.media.url) {
            imageElement.src = data.media.url;
            imageElement.alt = data.media.alt || 'Image';
        } else {
            console.warn('Image URL is missing or invalid:', data.media);
            imageElement.src = '../images/fallback-img.jpg';
            imageElement.alt = 'Fallback Image';
        }

        // Create author and date element
         const date = new Date(data.created);
         const formattedDate = date.toLocaleDateString('en-US', {
             year: 'numeric',
             month: 'long',
             day: 'numeric'
         });
        const authorAndDateElement = document.createElement('p');
        authorAndDateElement.textContent = `Published ${formattedDate} by ${data.author.name}`;
        authorAndDateElement.classList.add('post-author-date');

        // Convert newlines to <br> tags in the content
        const formattedContent = convertNewlinesToBreaks(data.body);

        // Create a div element to hold the content and set its innerHTML
        const contentElement = document.createElement('div');
        contentElement.innerHTML = formattedContent;

        postContainer.appendChild(titleElement);
        postContainer.appendChild(authorAndDateElement);
        postContainer.appendChild(imageElement);
        postContainer.appendChild(contentElement);

        // Check if form exist and populate form with fetched post
        if (document.getElementById('edit-post-form')) {
            populateEditForm(data);
        }
    } catch (error) {
        console.error('Error fetching and displaying blog post details:', error.message);
        // Display error message to the user
        displayErrorMessage(error.message || 'An unknown error occurred. Please try again.');
    } finally {
        // Hide loading spinner and show blog post content
        loadingElement.classList.add('hidden');
        postContainer.classList.remove('hidden');
    }
}

async function deleteBlogPost(postId) {
    try {
        // Get headers
        const headers = getAuthorizationHeaders();
        // Make a delete request
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            method: 'DELETE',
            headers: headers
        });
        if (!response.ok) {
            throw new Error('Failed to delete blog post');
        }
        // Handle successful response 
        localStorage.setItem('deletePostSuccess', 'true');
        window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/index.html';
        
    } catch (error) {
        console.error('Error:', error.message);
        displayErrorMessage(error.message || 'An unknown error occured. Please try again.');
        return false;
    } 
}
// function to create blog post
async function createBlogPost(title, body, tags = '', mediaUrl, mediaAlt = '') {
    try {
         // Validate input fields
         if (!title || !body || !mediaUrl) {
            throw new Error('Title, body and media URL are required.');
        }

        // Get headers
        const headers = getAuthorizationHeaders();

         // Construct request body for creating blog post
         const requestBody = {
            title: title,
            body: body,
            tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
            media: {
                url: mediaUrl,
                alt: mediaAlt
            }
        };

        // Make a POST request to create blog post
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/andgram', {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create blog post');
        }
        // Handle successful response
        const responseData = await response.json();

        // Accessing the id from the data object
        const newPostId = responseData.data.id;

        // Constructing the URL with the id parameter
        const newPostUrl = `https://norofffeu.github.io/FED1-PE1-andgram/post/index.html?id=${newPostId}`;

        // Redirecting to new post's URL
        window.location.href = newPostUrl;
        localStorage.setItem('newPostSuccess', 'true');

    } catch (error) {
        console.error('Error:', error.message);
        // Display error message to the user
        displayErrorMessage(error.message || 'An unknown error occured. Please try again.');
    }
}

// Function to handle form submission to create post
function handleCreatePostFormSubmit(event) {
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

// Function for populating edit form with blog post data 
async function fetchAndDisplayBlogPost() {
    try {
        const postId = getPostIdFromUrl();
        if (!postId) {
            throw new Error('Post ID not found in URL');
        }
        const headers = getAuthorizationHeaders();

        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            headers: headers
        });
        if (!response.ok) {
            throw new Error('Failed to fetch blog post details');
        }
        const { data } = await response.json();

        // Populate form fields with fetched post data
        document.getElementById('title').value = data.title;
        document.getElementById('content').value = data.body;
        document.getElementById('tags').value = data.tags.join(', '); 
        document.getElementById('imageUrl').value = data.media.url;
        document.getElementById('imageAlt').value = data.media.alt;
    } catch (error) {
        console.error('Error fetching and displaying blog post details:', error);

        // Display error message to user
        displayErrorMessage(error.message + '. Could not edit blog post.' || 'An unknown error occurred. Please try again.');
    }
}

// Send PUT request to update blog post 
async function handleEditForm(event) {
    event.preventDefault();
    try {
        const postId = getPostIdFromUrl();
        const formData = new FormData(this);

        let tags = formData.get('tags');
        if (tags) {
            tags = tags.split(',').map(tag => tag.trim());
        } else {
            tags = [];
        }
        const jsonData = {
            title: formData.get('title'),
            body: formData.get('content'),
            tags: tags,
            media: {
                url: formData.get('imageUrl'),
                alt: formData.get('imageAlt')
            }
        };
        const jsonPayload = JSON.stringify(jsonData);

        const headers = getAuthorizationHeaders();
        headers['Content-Type'] = 'application/json';
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            method: 'PUT',
            headers: headers,
            body: jsonPayload
        });
        if (!response.ok) {
            throw new Error('Failed to update blog post');
        }
        // Handle success response
        localStorage.setItem('updateSuccess', 'true');
        const currentUrl = window.location.href;
        const editUrl = currentUrl.replace('edit.html', 'index.html');
        window.location.href = editUrl;

    } catch (error) {
        console.error('Error handling edit form and displaying blog post details:', error);

        // Display error message to user
        displayErrorMessage(error.message || 'Could not update blog. Please try again.');
    }
}

function populateEditForm(postData) {
    document.getElementById('title').value = postData.title;
    document.getElementById('content').value = postData.body;
    document.getElementById('tags').value = postData.tags.join(', ');
    document.getElementById('imageUrl').value = postData.media.url;
}

export {
    displayAllBlogPosts,
    deleteBlogPost,
    handleCreatePostFormSubmit,
    fetchAndDisplayBlogPost,
    handleEditForm,
    getPostIdFromUrl,
    displayBlogPostDetails,
    fetchAllPosts
};