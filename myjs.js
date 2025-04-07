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
