var cacheName = 'SelfHeal-1';
var filesToCache = [
	'/',
	'www/index.html',
	'www/css/font-awesome.min.css',
	'www/css/index.css',
	'www/css/jquery.mobile-1.4.5.min.css',
	'www/touchTouch/touchTouch.css',
	'www/touchTouch/taskSlider.css',
	'www/touchTouch/preloader.gif',
	'www/img/logo.png',
	'www/img/click16.png',
	'www/img/click32.png',
	'www/img/click64.png',
	'www/js/jquery-3.1.0.min.js',
	'www/js/jquery.mobile-1.4.5.min.js',
	'www/js/script.js',
	'www/touchTouch/touchTouch.jquery.js',
	'www/touchTouch/tasksSlider.js',
	'www/fonts/fontawesome-webfont.woff2?v=4.7.0',
	'www/img/pictures/001.jpg',
	'www/img/pictures/002.jpg',
	'www/img/pictures/003.jpg',
	'www/img/pictures/004.jpg',
	'www/img/pictures/005.jpg',
	'www/img/pictures/006.jpg',
	'www/img/pictures/007.jpg',
	'www/img/pictures/008.jpg',
	'www/img/pictures/009.jpg',
	'www/img/pictures/010.jpg'
];

self.addEventListener('install', function (e) {
	console.log('Service worker installing');
	e.waitUntil(
		caches.open(cacheName).then(function (cache) {
			return cache.addAll(filesToCache);
		})
		.then(function () {
			console.log('all added to cache');
		})
	);
});

self.addEventListener('fetch', function (e) {
	console.log('Service worker fetch ', e);
	e.respondWith(
		caches.match(e.request).then(function (response) {
			return response || fetch(e.request);
		})
	);
});
