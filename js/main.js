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
    handleEditFormAndDisplay,
    displayBlogPostDetails
} from './blogPosts/index.js';

import { 
    checkAllStatuses, updateUI
} from './uiUtiles/index.js';



// Display blog posts in grid on home page
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateUI();
    checkAllStatuses();
    
    const pageId = document.body.id;
    if (pageId === 'indexPage') {
        displayAllBlogPosts();
    } else if (pageId === 'PostPage') {
        displayBlogPostDetails()
    }
});






