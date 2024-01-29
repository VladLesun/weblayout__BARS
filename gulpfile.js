const { src, dest, series, watch } = require('gulp');
const gulpSass = require('gulp-sass');
const sass = require('sass');
const mainSass = gulpSass(sass);
const gulpIf = require('gulp-if');
const webp = require('gulp-webp');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const htmlMin = require('gulp-htmlmin');
const fileInclude = require('gulp-file-include');
const typograf = require('gulp-typograf');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const image = require('gulp-imagemin');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');
const revDel = require('gulp-rev-delete-original');
const zip = require('gulp-zip');
const path = require('path');
const rootFolder = path.basename(path.resolve());

//! Путь к файлам
const srcFolder = './src';
const distFolder = './dist';
const paths = {
	srcSvg: `${srcFolder}/img/svg/**.svg`,
	srcImgFolder: `${srcFolder}/img`,
	distImgFolder: `${distFolder}/img`,
	srcScss: `${srcFolder}/scss/**/*.scss`,
	distCssFolder: `${distFolder}/css`,
	srcFullJs: `${srcFolder}/js/**/*.js`,
	srcMainJs: `${srcFolder}/js/main.js`,
	distJsFolder: `${distFolder}/js`,
	srcPartialsFolder: `${srcFolder}/partials`,
	resourcesFolder: `${srcFolder}/resources`,
	distFontsFolder: `${distFolder}/fonts`,
	srcFontsFolder: `${srcFolder}/fonts/**.ttf`,
};

let isProd = false; //! По default сборка разработчика

//! Удалить папку со сборкой
const clean = () => {
	return del([distFolder]);
};

//! fonts
const fonts = () => {
	src(paths.srcFontsFolder).pipe(ttf2woff()).pipe(dest(paths.distFontsFolder));
	return src(paths.srcFontsFolder)
		.pipe(ttf2woff2())
		.pipe(dest(paths.distFontsFolder));
};
const cb = () => {};
let srcFonts = `${srcFolder}/scss/_fonts.scss`;
let appFonts = paths.distFontsFolder;
const fontStyle = (done) => {
	let file_content = fs.readFileSync(srcFonts);

	fs.writeFile(srcFonts, '', cb);
	fs.readdir(appFonts, function (err, items) {
		if (items) {
			let c_fontname;
			for (let i = 0; i < items.length; i++) {
				let fontname = items[i].split('.');
				fontname = fontname[0];
				if (c_fontname != fontname) {
					fs.appendFile(
						srcFonts,
						`@include font-face("${fontname}", "${fontname}", 400);\r\n`,
						cb
					);
				}
				c_fontname = fontname;
			}
		}
	});

	done();
};

//! Изображения
const svgSprites = () => {
	return src(paths.srcSvg)
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../sprite.svg',
					},
				},
			})
		)
		.pipe(dest(paths.distImgFolder));
};
const images = () => {
	return src([
		`${paths.srcImgFolder}/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Calipso/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Chester/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/LoftRelax/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Missoni/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Palermo/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Pool/*.{jpg,jpeg,png,svg}`,
	])
		.pipe(
			gulpIf(
				isProd,
				image([
					image.mozjpeg({
						quality: 80,
						progressive: true,
					}),
					image.optipng({
						optimizationLevel: 2,
					}),
				])
			)
		)
		.pipe(dest(paths.distImgFolder));
};
const webpImages = () => {
	return src([
		`${paths.srcImgFolder}/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Calipso/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Chester/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/LoftRelax/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Missoni/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Palermo/*.{jpg,jpeg,png,svg}`,
		`${paths.srcImgFolder}/Pool/*.{jpg,jpeg,png,svg}`,
	])
		.pipe(webp())
		.pipe(dest(paths.distImgFolder));
};

//! Стили
const styles = () => {
	return (
		src(paths.srcScss, { sourcemaps: !isProd })
			.pipe(
				plumber(
					notify.onError({
						title: 'SCSS',
						message: 'Error: <%= error.message %>',
					})
				)
			)
			.pipe(mainSass())
			// .pipe(
			//   rename({
			//     suffix: ".min",
			//   })
			// )
			.pipe(
				autoprefixer({
					cascade: false,
					grid: true,
					overrideBrowserslist: ['last 5 versions'],
				})
			)
			.pipe(
				gulpIf(
					isProd,
					cleanCSS({
						level: 2,
					})
				)
			)
			.pipe(dest(paths.distCssFolder, { sourcemaps: '.' }))
			.pipe(browserSync.stream())
	);
};

//! Скрипты
const scripts = () => {
	return src(paths.srcMainJs, { sourcemaps: !isProd })
		.pipe(
			plumber(
				notify.onError({
					title: 'JS',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(
			webpackStream({
				mode: isProd ? 'production' : 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [
						{
							test: /\.(?:js|mjs|cjs)$/,
							exclude: /node_modules/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: [['@babel/preset-env', { targets: 'defaults' }]],
								},
							},
						},
					],
				},
				devtool: !isProd ? 'source-map' : false,
			})
		)
		.on('error', function (err) {
			console.error('WEBPACK ERROR', err);
			this.emit('end');
		})
		.pipe(dest(paths.distJsFolder, { sourcemaps: '.' }))
		.pipe(browserSync.stream());
};

//! HTML
const htmlInclude = () => {
	return src([`${srcFolder}/*.html`])
		.pipe(
			fileInclude({
				prefix: '@',
				basepath: '@file',
			})
		)
		.pipe(
			typograf({
				locale: ['ru', 'en-US'],
			})
		)
		.pipe(dest(distFolder))
		.pipe(browserSync.stream());
};
const htmlMinify = () => {
	return src([`${distFolder}/**/*.html`])
		.pipe(
			htmlMin({
				collapseWhitespace: true,
			})
		)
		.pipe(dest(distFolder));
};

//! Watch
const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: `${distFolder}`,
		},
	});

	watch(paths.srcScss, styles);
	watch(paths.srcFullJs, scripts);
	watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
	watch(`${srcFolder}/*.html`, htmlInclude);
	watch(`${paths.resourcesFolder}/**`, resources);
	watch(`${paths.srcImgFolder}/*.{jpg,jpeg,png,svg}`, images);
	watch(`${paths.srcImgFolder}/*.{jpg,jpeg,png}`, webpImages);
	watch(paths.srcSvg, svgSprites);
	watch(paths.srcFontsFolder, fonts);
	watch(paths.srcFontsFolder, fontStyle);
};

const resources = () => {
	return src(`${paths.resourcesFolder}/**`).pipe(dest(`${distFolder}`));
};

const cache = () => {
	return src(`${distFolder}/**/*.{css,js,svg,png,jpg,jpeg,webp,woff2}`, {
		base: distFolder,
	})
		.pipe(rev())
		.pipe(revDel())
		.pipe(dest(distFolder))
		.pipe(rev.manifest('rev.json'))
		.pipe(dest(distFolder));
};

const rewrite = () => {
	const manifest = fs.readFileSync('dist/rev.json');
	src(`${paths.distCssFolder}/*.css`)
		.pipe(revRewrite({ manifest }))
		.pipe(dest(paths.distCssFolder));
	return src(`${distFolder}/**/*.html`)
		.pipe(revRewrite({ manifest }))
		.pipe(dest(distFolder));
};

const zipFiles = () => {
	del.sync([`${distFolder}/*.zip`]);
	return src(`${distFolder}/**/*.*`, {})
		.pipe(
			plumber(
				notify.onError({
					title: 'ZIP',
					message: 'Error: <%= error.message %>',
				})
			)
		)
		.pipe(zip(`${rootFolder}.zip`))
		.pipe(dest(distFolder));
};

const toProd = (done) => {
	isProd = true;
	done();
};

//! Сборка разработчика
exports.default = series(
	clean,
	htmlInclude,
	scripts,
	styles,
	fonts,
	resources,
	images,
	webpImages,
	svgSprites,
	fontStyle,
	watchFiles
);
//! Build сборка
exports.build = series(
	toProd,
	clean,
	htmlInclude,
	scripts,
	styles,
	fonts,
	resources,
	images,
	webpImages,
	svgSprites,
	fontStyle,
	htmlMinify
);

//! очистка кеша
exports.cache = series(cache, rewrite);

//! Упаковать файлы в .zip
exports.zip = zipFiles;
