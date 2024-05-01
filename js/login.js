// login.js

import { handleLogin } from './auth.js';

// Add event listener to login button
document.getElementById('login-btn').addEventListener('click', async (event) => {
  event.preventDefault(); // Prevent form submission

  // Get form data
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Call handleLogin function with form data
  await handleLogin({ email, password });
});
