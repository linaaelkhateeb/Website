function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.getElementById('profileToggle');
    if (profileLink) {
      profileLink.addEventListener('click', (e) => {
        e.preventDefault();
        toggleSidebar();
      });
    }
  });
