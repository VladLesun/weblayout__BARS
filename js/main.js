// Переход по ссылкам

function clickedLinks(allLinks) {
	for (let link of allLinks) {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			document
				.getElementById(link.getAttribute('data-link'))
				.scrollIntoView({ behavior: 'smooth' });
		});
	}
}

// Burger
function setBurger(params) {
	const btn = document.querySelector(`.${params.btnClass}`);
	const menu = document.querySelector(`.${params.menuClass}`);
	const menuLinks = document.querySelectorAll(`.${params.menuLinksClass}`);

	menu.addEventListener('animationend', function () {
		if (this.classList.contains(params.hiddenClass)) {
			this.classList.remove(params.activeClass);
			this.classList.remove(params.hiddenClass);
		}
	});

	btn.addEventListener('click', function () {
		this.classList.toggle(params.activeClass);

		if (
			!menu.classList.contains(params.activeClass) &&
			!menu.classList.contains(params.hiddenClass)
		) {
			menu.classList.add(params.activeClass);
			document.body.classList.add(params.hiddenBody);
		} else {
			menu.classList.add(params.hiddenClass);
			document.body.classList.remove(params.hiddenBody);
		}
	});

	for (let link of menuLinks) {
		link.addEventListener('click', function () {
			btn.classList.remove('is-opened');
			menu.classList.remove('is-opened');
			document.body.classList.remove('body-hidden');
		});
	}
}

// Swiper.js
function swiper(allSwipers) {
	for (let swiper of allSwipers) {
		new Swiper(swiper, {
			slidesPerView: 10,
			loop: true,
			spaceBetween: 10,
			noSwiping: true,
			keyboard: {
				enabled: true,
			},

			pagination: {
				el: '.swiper-pagination',
				clickable: true,
			},

			navigation: {
				prevEl: '.swiper-button-prev',
				nextEl: '.swiper-button-next',
			},

			breakpoints: {
				320: {
					slidesPerView: 1,
					spaceBetween: 30,
					noSwiping: false,
					centeredSlides: true,
				},
				581: {
					slidesPerView: 2,
					spaceBetween: 5,
					noSwiping: false,
				},
				1001: {
					slidesPerView: 3,
					spaceBetween: 10,
					centeredSlides: true,
					keyboard: {
						enabled: true,
					},
				},
			},
		});
	}
}

// Валидация формы
function validationForm(form) {
	const inputTel = document.querySelector("input[type='tel']");
	const im = new Inputmask('+375(99) 999-99-99');

	im.mask(inputTel);

	const validate = new JustValidate(form, {
		errorFieldStyle: {
			borderColor: '#f00',
		},
		errorLabelStyle: {
			color: '#f00',
		},
		errorsContainer: document.querySelector('.contacts__error'),
		focusInvalidField: true,
	});

	validate
		.addField('#name', [
			{
				rule: 'required',
				errorMessage: 'Введите Ваше имя',
			},
			{
				rule: 'minLength',
				value: 3,
				errorMessage: 'Минимальное кол-во символов 3',
			},
			{
				rule: 'maxLength',
				value: 20,
				errorMessage: 'Максимальное кол-во символов 20',
			},
		])
		.addField('#phone', [
			{
				rule: 'required',
				errorMessage: 'Введите Ваш моб. телефон',
			},
			{
				validator: () => {
					const phone = inputTel.inputmask.unmaskedvalue();
					return Number(phone) && phone.length === 9;
				},
				errorMessage: 'Здесь должно быть 9 символов без +375',
			},
		]);

	return validate;
}

// Отправка формы
function sendForm(form) {
	const validate = validationForm(form);

	form.addEventListener('submit', (e) => {
		e.preventDefault();

		if (!validate.isValid) {
			return;
		}
	});
}

function init() {
	const links = document.querySelectorAll('.menu__link_text');
	const allSwipers = document.querySelectorAll('.product__swiper');
	const form = document.querySelector('.form');

	clickedLinks(links);
	setBurger({
		// здесь мы вызываем функцию и передаем в нее классы наших элементов
		btnClass: 'header__burger', // класс бургера
		menuClass: 'header__menu', // класс меню
		menuLinksClass: 'menu__link', // класс ссылок
		activeClass: 'is-opened', // класс открытого состояния
		hiddenClass: 'is-closed', // класс закрывающегося состояния (удаляется сразу после закрытия)
		hiddenBody: 'body-hidden', // класс для остановки свайпа body
	});
	swiper(allSwipers);
	validationForm(form);
}

init();
