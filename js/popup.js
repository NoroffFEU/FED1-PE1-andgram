document.addEventListener('DOMContentLoaded', (event) => {
  
  // General function to show a popup with a custom message
  function showPopup(message) {
    const popup = document.getElementById('successPopup');
    if (popup) {
      popup.innerText = message;
      popup.style.display = 'block';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 3000); // Hide after 3 seconds
    } else {
      console.error('Popup element not found');
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

  // Ensure popup logic runs when page loads
  function checkAllStatuses() {
    checkUpdateStatus();
    checkLoginStatus();
    checkLogoutStatus();
    checkNewPostStatus();
    checkDeleteStatus();
  }

  checkAllStatuses();
});
