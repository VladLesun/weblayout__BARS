import { transferLinks } from './functions/transitionLinks';
import { setBurger } from './functions/burger';
import { swiper } from './functions/swiper';
import { sendForm } from './functions/sendForm';
import 'lazysizes';
import { resize } from './functions/video';

function init() {
	const links = document.querySelectorAll('.transfer-link');
	const allSwipers = document.querySelectorAll('.product__swiper');
	const form = document.querySelector('.form');

	transferLinks(links);
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
	sendForm(form);
}

init();
