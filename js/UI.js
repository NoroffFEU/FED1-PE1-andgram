import { checkAuth } from './auth.js';

// Function to update UI based on authentication
function updateUI() {
    const header = document.getElementById('header');
    const menu = document.getElementById('menu');

    if(checkAuth()) {
        // If user is authenticated, update header and menu
        header.style.backgroundColor = '#DC1F18'; 

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
        const extraMenuItem = '<li><a href="/account/create-post.html">Create post</a></li>' +
                              '<li><button id="logoutButton">Logout</button></li>';

        // Append new menu items to the rigth <ul> element
        const rigthUlElement = document.getElementById('rigthUl');
        rigthUlElement.innerHTML += extraMenuItem;

        // Add "edit mode" under header logo
        const editModeLabel = '<p>(edit mode)</p>';

        const logoContainer = document.getElementById('logoContainer');
        logoContainer.innerHTML += editModeLabel; 
    } else {
        // If user is not authenticated, revert to default header and menu
        header.style.backgroundColor = '#000'; // Reset header color
      
    }
}

// Call updateUI() when page laods
window.onload = function() {
    updateUI();
};