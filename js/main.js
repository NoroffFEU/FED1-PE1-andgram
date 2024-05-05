import { fetchAllBlogPosts, getAuthorizationHeaders } from './api.js';
import { createBlogPost, displayAllBlogPosts, deleteBlogPost, editBlogPost } from './blog.js';

window.addEventListener('DOMContentLoaded', displayAllBlogPosts);

// use this document to call functions

async function updatePostLayout() {
    try {
        // Fetch all posts from the server
        const posts = await fetchAllBlogPosts();

        // Loop trough each post and update its layout
        posts.forEach(async post => {
            // Update layout to place image at top
            // Modify post object as needed

            // Send updated post back to server
            await updatePost(post);
        });

        console.log('All posts updated successfully');
    } catch (error) {
        console.error('Error updating post layout:', error);
    }
}

async function updatePost(post) {
    try {
        // Send the updated post back to the server
        // Implement the logic to update a single post to the server
    } catch (error) {
        console.error('Error updating post', error);
    }
}

// Call the function to update post layout

