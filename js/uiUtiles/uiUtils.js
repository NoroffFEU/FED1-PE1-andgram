import { getPostIdFromUrl, deleteBlogPost } from '../blogPosts/index.js';
import { checkAuth } from '../auth/index.js';

// Function to update UI based on authentication
function updateUI() {
    const header = document.getElementById('header');
    const editModeBanner = document.getElementById('editModeBanner');
    const menu = document.querySelector('#primary-navigation ul');
    const footerMenu = document.querySelector('#footerMenu');

    if(checkAuth()) {
        // If user is authenticated, update header and menu
        header.style.backgroundColor = 'var(--clr-primary-600)'; 
        editModeBanner.style.display = 'block';

        // Remove 'login' and 'register' menu items if they exist
        const loginItems = document.querySelectorAll('.login');
        loginItems.forEach(loginItem => {
          if (loginItem.parentElement) {
              loginItem.parentElement.remove();
          }
      });
        const registerItems = document.querySelectorAll('.register')
        registerItems.forEach(registerItem => {
          if (registerItem.parentElement) {
            registerItem.parentElement.remove();
          }
      });

      const footerMenu = document.getElementById('footerMenu');
      if (footerMenu) {
        footerMenu.style.justifyContent = 'flex-end';
      }

      function applyNonMediaQueryStyles() {
        const mediaQuery = window.matchMedia('(max-width: 50em)');
        const footerMenu = document.getElementById('footerMenu');
      
        if (footerMenu) {
          if (!mediaQuery.matches) {
            // Apply styles when the media query is NOT matched
            footerMenu.style.justifyContent = 'flex-end';
            footerMenu.style.marginTop = '1em';
          } else {
            // Reset styles when the media query is matched
            footerMenu.style.justifyContent = '';
            footerMenu.style.marginTop = '';
          }
        }
      }
  
      // Initial check
      applyNonMediaQueryStyles();
  
      // Add event listener for changes
      window.matchMedia('(max-width: 50em)').addListener(applyNonMediaQueryStyles);

        // Add extra menu options
        const extraMenuItem = '<li><a href="https://norofffeu.github.io/FED1-PE1-andgram/account/create-post.html">Create post</a></li>' +
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
                    window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/index.html';
                });
            });
            editButton.addEventListener('click', function() {
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
  
    // General function to show a popup with a custom message
    function showPopup(message) {
      const popup = document.getElementById('successPopup');
      if (popup) {
        popup.innerText = message;
        popup.style.display = 'block';
        setTimeout(() => {
          popup.style.display = 'none';
        }, 3000);
      } 
    }
  
    // Function to check the update status
    function checkUpdateStatus() {
      if (localStorage.getItem('updateSuccess') === 'true') {
        localStorage.removeItem('updateSuccess');
        showPopup('Blog post updated successfully!');
      }
    }
  
    // Function to check login status
    function checkLoginStatus() {
      if (localStorage.getItem('loginSuccess') === 'true') {
        localStorage.removeItem('loginSuccess');
        showPopup('Login successful!');
      }
    }
  
    // Function to check logout status
    function checkLogoutStatus() {
      if (localStorage.getItem('logoutSuccess') === 'true') {
        localStorage.removeItem('logoutSuccess');
        showPopup('Logout successful!');
      }
    }
     // Function to check new post creation status
     function checkNewPostStatus() {
      if (localStorage.getItem('newPostSuccess') === 'true') {
        console.log("New post creation was successful");
        localStorage.removeItem('newPostSuccess');
        showPopup('New post created successfully!');
      }
    }
    // Function to check new post creation status
    function checkDeleteStatus() {
      if (localStorage.getItem('deletePostSuccess') === 'true') {
        console.log("Post was deleted successfully");
        localStorage.removeItem('deletePostSuccess');
        showPopup('Post was deleted successfully!');
      }
    }

    // Function to check new registration status
    function checkRegisterStatus() {
      if (localStorage.getItem('registerSuccess') === 'true') {
        console.log("User successfully registered");
        localStorage.removeItem('registerSuccess');
        showPopup('User successfully registered!');
      }
    }

    // fucntion to display popup when submiting newsletter form
    const newsLetterForm = document.getElementById('newsLetterForm');
    if (newsLetterForm) {
      newsLetterForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        showPopup('Thank you for subscribing!');
        this.reset();
    })
  };
    

    // Ensure popup logic runs when page loads
  function checkAllStatuses() {
    checkUpdateStatus();
    checkLoginStatus();
    checkLogoutStatus();
    checkNewPostStatus();
    checkDeleteStatus();
    checkRegisterStatus();
  }

  export { checkAllStatuses, updateUI };