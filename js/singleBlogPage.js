import { updateUI } from './UI.js';

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

function populateEditForm(postData) {
    document.getElementById('title').value = postData.title;
    document.getElementById('post-author-date').value = postData.authorAndDateElement;
    document.getElementById('content').value = postData.body;
    document.getElementById('tags').value = postData.tags.join(', ');
    document.getElementById('imageUrl').value = postData.media.url;
}

// Call function to display blog post details when the page loads
window.onload = displayBlogPostDetails;

export { getPostIdFromUrl }