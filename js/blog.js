// blog.js

// Import the createBlogPost function from api.js
import { createBlogPost } from './api.js';

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
  
    // Get form values
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const tags = document.getElementById('tags').value;
    const mediaUrl = document.getElementById('media-url').value;
    const mediaAlt = document.getElementById('media-alt').value;
  
    // Call createBlogPost function with form values
    createBlogPost(title, body, tags, mediaUrl, mediaAlt);
  }

  console.log('blog script running1');

// Event listener for form submission
document.getElementById('blog-post-form').addEventListener('submit', handleFormSubmit);
