import { 
    checkAuth,
    registerUser
} from './auth/index.js';

import { 
    displayAllBlogPosts,
    handleCreatePostFormSubmit,
    fetchAndDisplayBlogPost,
    handleEditForm,
    displayBlogPostDetails
} from './blogPosts/index.js';

import { 
    checkAllStatuses, updateUI, setupNavToggle, addHoverEffectToImageContainers
} from './uiUtiles/index.js';


document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;
    if ((pageId === 'editPostPage' || pageId === 'createPostPage') && !checkAuth()) {
        window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/account/login.html';
        return;
    }
    // Run general functions
    checkAuth();
    updateUI();
    checkAllStatuses();
    setupNavToggle();
    registerUser();

    // Display blog posts in grid when on index page
    if (pageId === 'indexPage') {
        displayAllBlogPosts();

        // Add search logic to blog post grid
        const searchField = document.getElementById('searchField');
        searchField.addEventListener('input', debounce(filterBlogPosts, 300));

        function filterBlogPosts() {
            const searchQuery = searchField.value.toLowerCase();
            const blogPosts = document.querySelectorAll('.post');

            blogPosts.forEach(post => {
                const title = post.querySelector('h3').textContent.toLowerCase();
                if (title.includes(searchQuery)) {
                    post.style.display = '';
                } else {
                    post.style.display = 'none';
                }
            });
        }
        function debounce(func, delay) {
            let timeout;
            return function() {
                const context = this;
                const args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), delay);
            };
        }
    }
    // Display all blog post details if on post page
    else if (pageId === 'PostPage') {
        displayBlogPostDetails();
    }
    // Display blog post details in edit form if on edit post page
    else if (pageId === 'editPostPage') {
        fetchAndDisplayBlogPost();
    }
    // Handle edit form submission
    const editPostForm = document.getElementById('edit-post-form');
    if (editPostForm) {
        editPostForm.addEventListener('submit', handleEditForm);
    }
    // Handle create post form submission
    const blogPostForm = document.getElementById('blog-post-form');
    if (blogPostForm) {
        blogPostForm.addEventListener('submit', handleCreatePostFormSubmit);
    }
});











