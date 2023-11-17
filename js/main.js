const allSwipers = document.querySelectorAll('.product__swiper');

for (let swiper of allSwipers) {
	new Swiper(swiper, {
		slidesPerView: 3,
		loop: true,
		spaceBetween: 10,
		centeredSlides: true,
		noSwiping: true,

		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},

		navigation: {
			prevEl: '.swiper-button-prev',
			nextEl: '.swiper-button-next',
		},
	});
}
