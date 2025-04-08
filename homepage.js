function toggleReadMore(button) {
            const card = button.closest('.attraction-card');
            const content = card.querySelector('.read-more-content');
            
            button.classList.toggle('active');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }

        function toggleReadMore(element) {
            element.classList.toggle('active');
            const content = element.nextElementSibling;
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
