document.addEventListener('DOMContentLoaded', () => {
    new Swiper('.explainerSwiper', {
        loop: true,
        slidesPerView: 1,
        centeredSlides: false,
        spaceBetween: 0,
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
