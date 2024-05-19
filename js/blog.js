
import { getAuthorizationHeaders } from './api.js';

 // Function to display all blog posts in grid
async function displayAllBlogPosts() {
    try {

        // Fetch all blog posts from API with authorization headers
        const response = await fetch('https://v2.api.noroff.dev/blog/posts/andgram', {
            headers: {
                'Content-Type': 'application/json'
            }
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


async function deleteBlogPost(postId) {
    try {
        // Get headers
        const headers = getAuthorizationHeaders();

        // Make a delete request to delete blog post
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            method: 'DELETE',
            headers: headers
        });

        if (!response.ok) {
            throw new Error8('Failed to delete blog post');
        }

        // Handle successful response 
        console.log('Blog post deleted successfully');

        // Redirect to index.html after successful deletion
        window.location.href = '../index.html';
        
        localStorage.setItem('deletePostSuccess', 'true');
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }

    
}


export { displayAllBlogPosts, deleteBlogPost };



