import { 
    getAuthorizationHeaders,
    checkAuth,
    handleLogin,
    handleLogout,
    registerUser
} from './auth/index.js';

import { 
    displayAllBlogPosts,
    deleteBlogPost,
    handleCreatePostFormSubmit,
    fetchAndDisplayBlogPost,
    handleEditForm,
    displayBlogPostDetails
} from './blogPosts/index.js';

import { 
    checkAllStatuses, updateUI, setupNavToggle
} from './uiUtiles/index.js';

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateUI();
    checkAllStatuses();
    setupNavToggle();
    registerUser();
    
    // Display blog posts in grid on home page
    const pageId = document.body.id;
    if (pageId === 'indexPage') {
        displayAllBlogPosts();
    // Display full blog post
    } else if (pageId === 'PostPage') {
        displayBlogPostDetails()
    // Display blog post data in edit form
    } else if (pageId === 'editPostPage') {
        fetchAndDisplayBlogPost()
    }
    // Handle edit form submit
    const editPostForm = document.getElementById('edit-post-form');
    if(editPostForm) {
        editPostForm.addEventListener('submit', handleEditForm);  
    }
    // Handle create post form submit
    const blogPostForm = document.getElementById('blog-post-form');
    if(blogPostForm) {
        blogPostForm.addEventListener('submit', handleCreatePostFormSubmit);  
    }

    
});










