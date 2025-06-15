function toggleReadMore(button) {
    const card = button.closest('.attraction-card')
    const content = card.querySelector('.read-more-content')

    button.classList.toggle('active')
    content.style.maxHeight = content.style.maxHeight
        ? null
        : content.scrollHeight + 'px'
}
const Trip = require('../models/trips');

exports.renderHomePage = async (req, res) => {
  try {
    const trips = await Trip.find({ isApproved: true }).populate('country');
    res.render('home', { trips }); // pass trips to EJS
  } catch (err) {
    res.status(500).send('Error loading homepage');
  }
};


function performSearch() {
    const input = document
        .getElementById('searchInput')
        .value.trim()
        .toLowerCase()

    if (!input) {
        alert('Please enter a search term.')
        return
    }

    const filename = `${input}.html`

    // Redirect directly — works for local files
    window.location.href = filename
}

document.addEventListener('DOMContentLoaded', () => {
    new Swiper('.explainerSwiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })
})
