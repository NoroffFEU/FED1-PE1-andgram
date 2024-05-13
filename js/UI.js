import { checkAuth } from './auth.js';
import { getPostIdFromUrl } from './singleBlogPage.js';
import { deleteBlogPost } from './blog.js';

// Function to update UI based on authentication
function updateUI() {
    const header = document.getElementById('header');
    const editModeBanner = document.getElementById('editModeBanner');
    const menu = document.querySelector('#primary-navigation ul');

    if(checkAuth()) {
        // If user is authenticated, update header and menu
        header.style.backgroundColor = 'var(--clr-primary-600)'; 
        editModeBanner.style.display = 'block';

        // Remove 'login' and 'register' menu items if they exist
        const loginItem = menu.querySelector('a[href="/account/register.html"]');
        if (loginItem) {
            loginItem.parentElement.remove();
        }
        const registerItem = menu.querySelector('a[href="/account/login.html"]');
        if (registerItem) {
            registerItem.parentElement.remove();
        }

        // Add extra menu options
        const extraMenuItem = '<li><a href="/account/create-index.html">Create post</a></li>' +
                              '<li><button id="logoutButton">Logout</button></li>';

        // Append new menu items to nav
        menu.innerHTML += extraMenuItem;

        // add edit button and delete button, if button containers exist
        const editButtonContainer = document.getElementById('editButtonContainer');
        const deleteButtonContainer = document.getElementById('deleteButtonContainer');
        const postId = getPostIdFromUrl();

        if (editButtonContainer && deleteButtonContainer !== null) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit post';
            editButtonContainer.appendChild(editButton);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete post';
            deleteButtonContainer.appendChild(deleteButton);

            deleteButton.addEventListener('click', function() {
                deleteBlogPost(postId, function() {
                    window.location.href = '../index.html';
                });
            });
            
            editButton.addEventListener('click', function() {
                // Replace index.html with edit.html in the URL
                const currentUrl = window.location.href;
                const editUrl = currentUrl.replace('index.html', 'edit.html');
                window.location.href = editUrl;
            });
        }
        

    } else {
        // If user is not authenticated, revert to default header and menu
        header.style.backgroundColor = '#000'; // Reset header color
      
    }
}

// Call updateUI() when page laods
window.onload = function() {
    updateUI();
};


export { updateUI }
