import { getAuthorizationHeaders } from './api.js';
import { getPostIdFromUrl } from './singleBlogPage.js';

window.onload = async function() {
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
    }
};

document.getElementById('edit-post-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const postId = getPostIdFromUrl();
    const formData = new FormData(this);

    try {
        const headers = getAuthorizationHeaders();
        const response = await fetch(`https://v2.api.noroff.dev/blog/posts/andgram/${postId}`, {
            method: 'PUT',
            headers: headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to update blog post');
        }

        // Redirect to post.html 
        window.location.href = `post.html?id=${postId}`;

    } catch (error) {
        console.error('Error updating blog post:', error);
        throw error;
    }
});