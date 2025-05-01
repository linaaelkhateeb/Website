document.addEventListener("DOMContentLoaded", function () {
  
    const checkboxes = document.querySelectorAll('.filter-buttons input[type="checkbox"]');
    const restaurantCards = document.querySelectorAll('.hotel-card');
  
    function filterhotels() {
      const selected = Array.from(checkboxes)
        .filter(cb => cb.checked)
        .map(cb => cb.value.toLowerCase());
  
      restaurantCards.forEach(card => {
        const cuisine = card.getAttribute('data-rate').toLowerCase();
        if (selected.length === 0 || selected.includes(cuisine)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    }
  
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', filterhotels);
    });
  
    filterhotels(); 
  
    
   
  
  
  
  }
  )
  function toggleReadMore(button) {
    const card = button.closest('.attraction-card');
    const content = card.querySelector('.read-more-content');

    button.classList.toggle('active');
    content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
}

function performSearch() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();

    if (!input) {
        alert("Please enter a search term.");
        return;
    }

    const filename = `${input}.html`;

    // Redirect directly — works for local files
    window.location.href = filename;
}
