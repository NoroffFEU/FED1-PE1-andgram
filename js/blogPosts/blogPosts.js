 import { getAuthorizationHeaders } from "../auth/auth.js";
 
 // Function to display all blog posts in grid
 async function displayAllBlogPosts() {
    try {
        // Fetch all blog posts from API
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/andgram', {
            headers: {'Content-Type': 'application/json'}
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
            // Create anchor element for the post
            const postLink = document.createElement('a');
            postLink.href = `post/index.html?id=${post.id}`;
            postLink.classList.add('post-link');

            // Create post element
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

            // Create title element
            const titleElement = document.createElement('h3');
            titleElement.textContent = post.title;

            // Append title and image to post element
            postElement.appendChild(titleElement);
            postElement.appendChild(imageElement);
            
            // Append post element to post link
            postLink.appendChild(postElement);

            // Append post link to post container
            postContainer.appendChild(postLink);
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

// Function to display blog post details
async function displayBlogPostDetails() {
    try {
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
            throw new Error('Failed to fetch blog post details');
        }

        const { data } = await response.json();

        // Display blog post details on the page
        const postContainer = document.getElementById('post-container');

        // Check if postContainer exists before proceeding
        if (!postContainer) {
            console.error('Post container not found');
            return; // Exit the function if postContainer doesn't exist
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
            imageElement.src = 'images/fallback-img.jpg';
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

        const contentElement = document.createElement('p');
        contentElement.textContent = data.body;

        postContainer.appendChild(titleElement);
        postContainer.appendChild(authorAndDateElement);
        postContainer.appendChild(imageElement);
        postContainer.appendChild(contentElement);

        updateUI();

        // Check if form exist and populate form with fetched post
        if (document.getElementById('edit-post-form')) {
            populateEditForm(data);
        }
    } catch (error) {
        console.error('Error fetching and displaying blog post details:', error);
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
        // Redirect to index.html after successful deletion
        window.location.href = '../index.html';
        
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    } 
}

// function to create blog post
async function createBlogPost(title, body, tags, mediaUrl, mediaAlt) {
    try {
        // Get headers
        const headers = getAuthorizationHeaders();

        // Construct request body for creating blog post
        const requestBody = {
            title: title,
            body: body,
            tags: tags.split(','), // Convert comma-separated string to array of strings
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

// Function for editing blog post
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

        updateUI();
    } catch (error) {
        console.error('Error fetching and displaying blog post details:', error);
    }
}

async function handleEditFormAndDisplay() {
    try {
        const postId = getPostIdFromUrl();
        const formData = new FormData(this);

        let tags = formData.get('tags');
        if (tags) {
            tags = tags.split(',').map(tag => tag.trim());
        } else {
            tags = [];
        }

        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        jsonData['tags'] = tags;

        const jsonPayload = JSON.stringify(jsonData);

        const headers = getAuthorizationHeaders();
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            method: 'PUT',
            headers: headers,
            body: jsonPayload
        });

        if (!response.ok) {
            throw new Error('Failed to update blog post');
        }

        localStorage.setItem('updateSuccess', 'true');

        const currentUrl = window.location.href;
        const editUrl = currentUrl.replace('edit.html', 'index.html');
        window.location.href = editUrl;

        // Display blog post details
        const postResponse = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!postResponse.ok) {
            throw new Error('Failed to fetch blog post details');
        }

        const { data } = await postResponse.json();

        const postContainer = document.getElementById('post-container');
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
            imageElement.src = 'images/fallback-img.jpg';
            imageElement.alt = 'Fallback Image';
        }

        const date = new Date(data.created);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        const authorAndDateElement = document.createElement('p');
        authorAndDateElement.textContent = `Published ${formattedDate} by ${data.author.name}`;
        authorAndDateElement.classList.add('post-author-date');

        const contentElement = document.createElement('p');
        contentElement.textContent = data.body;

        postContainer.appendChild(titleElement);
        postContainer.appendChild(authorAndDateElement);
        postContainer.appendChild(imageElement);
        postContainer.appendChild(contentElement);

        updateUI();

        if (document.getElementById('edit-post-form')) {
            populateEditForm(data);
        }
    } catch (error) {
        console.error('Error handling edit form and displaying blog post details:', error);
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
    handleEditFormAndDisplay,
    getPostIdFromUrl,
    displayBlogPostDetails
};