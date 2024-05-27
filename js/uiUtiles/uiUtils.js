import { getPostIdFromUrl, deleteBlogPost } from '../blogPosts/index.js';
import { checkAuth } from '../auth/index.js';

// Function to update UI based on authentication
function updateUI() {
  const header = document.getElementById('header');
  const editModeBanner = document.getElementById('editModeBanner');
  const menu = document.querySelector('#primary-navigation ul');

  // If user is authenticated, update UI elements
  if (checkAuth()) {
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

    // Add styling to footer when menu links are removed
    const footerMenu = document.getElementById('footerMenu');
    if (footerMenu) {
      footerMenu.style.justifyContent = 'space-around';
    }
    // Add extra menu options
    const extraMenuItem = '<li><a href="https://norofffeu.github.io/FED1-PE1-andgram/post/create-post.html">Create post</a></li>' +
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

      deleteButton.addEventListener('click', function () {
        deleteBlogPost(postId, function () {
          window.location.href = 'https://norofffeu.github.io/FED1-PE1-andgram/index.html';
        });
      });
      editButton.addEventListener('click', function () {
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
    localStorage.removeItem('newPostSuccess');
    showPopup('New post created successfully!');
  }
}
// Function to check new post creation status
function checkDeleteStatus() {
  if (localStorage.getItem('deletePostSuccess') === 'true') {
    localStorage.removeItem('deletePostSuccess');
    showPopup('Post was deleted successfully!');
  }
}
// Function to check new registration status
function checkRegisterStatus() {
  if (localStorage.getItem('registerSuccess') === 'true') {
    localStorage.removeItem('registerSuccess');
    showPopup('User successfully registered!');
  }
}
// fucntion to display popup when submiting newsletter form
const newsLetterForm = document.getElementById('newsLetterForm');
if (newsLetterForm) {
  newsLetterForm.addEventListener('submit', function (event) {
    event.preventDefault();

    showPopup('Thank you for subscribing!');
    this.reset();
  })
};
// Construct function that checks all statuses
function checkAllStatuses() {
  checkUpdateStatus();
  checkLoginStatus();
  checkLogoutStatus();
  checkNewPostStatus();
  checkDeleteStatus();
  checkRegisterStatus();
}

// Function to display error messages to the user
function displayErrorMessage(message) {
  const errorContainer = document.getElementById('errorContainer');
  if (errorContainer) {
    errorContainer.textContent = message;
    errorContainer.style.display = 'block';
    setTimeout(() => {
      errorContainer.style.display = 'none';
    }, 3000);
  } else {
    alert(message);  // Fallback in case there is no error container
  }
}

// Add specific hover effect to grid images for logged in users
function addHoverEffectToImageContainers() {
  const imageContainers = document.querySelectorAll('.grid-image-container');
  imageContainers.forEach(container => {
    const hoverInfo = container.querySelector('.hover-info');
    const image = container.querySelector('img');

    container.addEventListener('mouseenter', () => {
      if (hoverInfo) {
        hoverInfo.classList.add('visible');
        image.classList.add('hovered');
      }
    });

    container.addEventListener('mouseleave', () => {
      if (hoverInfo) {
        hoverInfo.classList.remove('visible');
        image.classList.remove('hovered');
      }
    });

  });
}

// Function to handle hover effect for not-logged-in users
function addRegularHoverEffect() {
  const imageContainers = document.querySelectorAll('.grid-image-container');
  imageContainers.forEach(container => {
    container.addEventListener('mouseenter', () => {
      const img = container.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1.07)';
        img.style.filter = 'brightness(1.1)';
      }
    });

    container.addEventListener('mouseleave', () => {
      const img = container.querySelector('img');
      if (img) {
        img.style.transform = 'scale(1)';
        img.style.filter = 'brightness(1)';
      }
    });
  });
}

// Function to add search logic to blog post grid
function addSearchLogic() {
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

export { 
  checkAllStatuses, 
  updateUI, 
  addHoverEffectToImageContainers, 
  addRegularHoverEffect, 
  displayErrorMessage,
  addSearchLogic
 };





