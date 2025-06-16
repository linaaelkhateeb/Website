function toggleReadMore(element) {
    // Stop the event from bubbling up to the parent anchor tag
    if (event) {
        event.stopPropagation();
    }

    const readMoreContent = element.nextElementSibling;
    element.classList.toggle('show'); // Toggle 'show' class on the clicked button
    readMoreContent.classList.toggle('show'); // Toggle 'show' class on the content
    if (readMoreContent.classList.contains('show')) {
        element.innerHTML = `Read less <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>`;
    } else {
        element.innerHTML = `Read more <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
    }
} 