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
    checkAllStatuses, updateUI, setupNavToggle, addSearchLogic
} from './uiUtiles/index.js';

// Trigger the essential functions on page load
document.addEventListener('DOMContentLoaded', () => {

    const pageId = document.body.id;
    // Redirect to login if user not logged in and tries to access edit/create post page
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
        addSearchLogic();
    }
    // Display all blog post details if user is on blog post page
    else if (pageId === 'PostPage') {
        displayBlogPostDetails();
    }
    // Display blog post details in edit form if user is on edit post page
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











