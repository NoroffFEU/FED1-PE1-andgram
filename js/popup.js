document.addEventListener('DOMContentLoaded', (event) => {

  function showSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
      popup.style.display = 'block';
      setTimeout(() => {
        popup.style.display = 'none';
      }, 3000); // Hide after 3 seconds
    } else {
      console.error('Popup element not found');
    }
  }

  function checkUpdateStatus() {
    const updateStatus = localStorage.getItem('updateSuccess');
    if (updateStatus === 'true') {
      localStorage.removeItem('updateSuccess');
      showSuccessPopup();
    }
  }
  checkUpdateStatus();
});
