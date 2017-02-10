var cacheName = 'SelfHeal-1';
var filesToCache = [
	'/www/',
	'/self-heal/www',
	'index.html',
	'css/font-awesome.min.css',
	'css/index.css',
	'css/jquery.mobile-1.4.5.min.css',
	'touchTouch/touchTouch.css',
	'touchTouch/taskSlider.css',
	'touchTouch/preloader.gif',
	'img/logo.png',
	'img/click16.png',
	'img/click32.png',
	'img/click64.png',
	'js/jquery-3.1.0.min.js',
	'js/jquery.mobile-1.4.5.min.js',
	'js/script.js',
	'touchTouch/touchTouch.jquery.js',
	'touchTouch/tasksSlider.js',
	'fonts/fontawesome-webfont.woff2?v=4.7.0',
	'img/pictures/001.jpg',
	'img/pictures/002.jpg',
	'img/pictures/003.jpg',
	'img/pictures/004.jpg',
	'img/pictures/005.jpg',
	'img/pictures/006.jpg',
	'img/pictures/007.jpg',
	'img/pictures/008.jpg',
	'img/pictures/009.jpg',
	'img/pictures/010.jpg'
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
	
	var localUrl = "http://localhost:8087/";
	var githubioUrl = "https://ox-it.github.io/self-heal/www/";
	
	e.respondWith(
		caches.match(e.request).then(function (response) {
			if(response) {
				return response;
			} else {
				//nothing in the cache
				console.warn("couldn't find cache for request", e.request);
				return response || fetch(e.request);
			}
		})
	);
});
