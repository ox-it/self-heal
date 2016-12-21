/**
 * @name		jQuery touchTouch plugin
 * @author		Martin Angelov
 * @version 	1.0
 * @url			http://tutorialzine.com/2012/04/mobile-touch-gallery/
 * @license		MIT License
 */


(function(){
	var filterClassAll = '.single-image';
	var filterClass = '.single-image';
	$.fn.randomize = function(elements) {
	    return this.each(function() {
	      var $this = $(this);
	      var unsortedElems = $this.find(elements);
	      var elems = unsortedElems.clone();
	      
	      elems.sort(function() { return (Math.round(Math.random())-0.5); });  

	      for(var i=0; i < elems.length; i++)
	        unsortedElems.eq(i).replaceWith(elems[i]);
	    }); 
	};
	$.fn.addFavStatus = function(elements) {
		var favoriteImages = JSON.parse(localStorage.getItem("favoriteImagesArray")) || [];
		return this.each(function() {
				var $this = $(this);
				var imageElems = $this.find(elements);
				$.each(imageElems, function (index, imageElem) {
					var elemId = $(imageElem).attr('id');
					var classes = " image-fav ";
					
					if (favoriteImages.indexOf(elemId) >= 0) {
						$(imageElem).addClass("favorite");
					}
					$(imageElem).append( "<div class='"+ classes +"' data-image-fav='"+ elemId +"'>&#9829;</div");
					
				})
		}); 
	};

	$('.thumbs').randomize('a');
	$('.thumbs').addFavStatus(filterClassAll);
	/* Private variables */

	var overlay = $('<div id="galleryOverlay">'),
		filters = $('<div id="imageFilters" class="filterButtons">' + 
						'<span id="imageFavoritesFilter" data-targetclassname="favorite" class="imageFilterButton">&#9829;</span>' +
		'</div>'),
		slider = $('<div id="gallerySlider">'),
		prevArrow = $('<a id="prevArrow"></a>'),
		nextArrow = $('<a id="nextArrow"></a>'),
		overlayVisible = false;


	/* Creating the plugin */

	$.fn.touchTouch = function(){

		var placeholders = $([]),
			index = 0,
			allitems = this,
			items = allitems;

			function resetGallery() {
				//re-initialise the slider
				items = $(".thumbs").find(filterClass);
				index = items.index($(".thumbs").find(filterClass).first());
				slider.empty();
				placeholders = $( ('<div class="placeholder"></div>').repeat(items.length) );
				slider.append(placeholders);
				
				showOverlay(index);
				offsetSlider(index);
				showImage(index);
				preload(index+1);
				preload(index-1);
			}

		// Appending the markup to the page
		overlay.hide().appendTo('body');
		filters.appendTo(overlay);
		slider.appendTo(overlay);

		// Creating a placeholder for each image
		placeholders = $( ('<div class="placeholder"></div>').repeat(items.length) );

		// Hide the gallery if the background is touched / clicked
		slider.append(placeholders).on('click',function(e){

			if(!($(e.target).is('img') || $(e.target).hasClass('image-fav'))){
				hideOverlay();
			}
		});

		$('.imageFilterButton').click(function (ev) {
			if ( $('#imageFilters .imageFilterButton').hasClass('filterButton-active') ) {
				$('#imageFilters .imageFilterButton').removeClass('filterButton-active');
				var classToShow = "";
			} else {
				$('#imageFilters .imageFilterButton').addClass('filterButton-active');
				var classToShow = ".favorite";
			}
			filterClass = '.single-image' + classToShow;
			resetGallery();
		});

		// Listen for touch events on the body and check if they
		// originated in #gallerySlider img - the images in the slider.
		$('body').on('touchstart', '#gallerySlider img', function(e){
			var touch = e.originalEvent,
				startX = touch.changedTouches[0].pageX;

			slider.on('touchmove',function(e){

				e.preventDefault();

				touch = e.originalEvent.touches[0] ||
						e.originalEvent.changedTouches[0];

				if(touch.pageX - startX > 10){

					slider.off('touchmove');
					showPrevious();
				}

				else if (touch.pageX - startX < -10){

					slider.off('touchmove');
					showNext();
				}
			});

			// Return false to prevent image
			// highlighting on Android
			return false;

		}).on('touchend',function(){

			slider.off('touchmove');

		});

		// Listening for clicks on the thumbnails
		$("#icon-top-left").on('click', function(e){

			$('.thumbs').randomize('a');

			var $this = $(".thumbs").find(filterClass).first(),
				galleryName,
				selectorType,
				$closestGallery = $this.parent().closest('[data-gallery]');

			// Find gallery name and change items object to only have
			// that gallery

			//If gallery name given to each item
			if ($this.attr('data-gallery')) {

				galleryName = $this.attr('data-gallery');
				selectorType = 'item';

			//If gallery name given to some ancestor
			} else if ($closestGallery.length) {

				galleryName = $closestGallery.attr('data-gallery');
				selectorType = 'ancestor';

			}

			//These statements kept seperate in case elements have data-gallery on both
			//items and ancestor. Ancestor will always win because of above statments.
			items = $(".thumbs").find(filterClass);

			// Find the position of this image
			// in the collection
			index = items.index($(".thumbs").find(filterClass).first());
			showOverlay(index);
			showImage(index);

			// Preload the next image
			preload(index+1);

			// Preload the previous
			preload(index-1);

		});

		// If the browser does not have support
		// for touch, display the arrows
		if ( !("ontouchstart" in window) ){
			overlay.append(prevArrow).append(nextArrow);

			prevArrow.click(function(e){
				e.preventDefault();
				showPrevious();
			});

			nextArrow.click(function(e){
				e.preventDefault();
				showNext();
			});
		}

		// Listen for arrow keys
		$(window).bind('keydown', function(e){

			if (e.keyCode == 37) {
				showPrevious();
			}

			else if (e.keyCode==39) {
				showNext();
			}

			else if (e.keyCode==27) { //esc
				hideOverlay();
			}

		});


		/* Private functions */


		function showOverlay(index){
			// If the overlay is already shown, exit
			if (overlayVisible){
				return false;
			}

			// Show the overlay
			overlay.show();

			setTimeout(function(){
				// Trigger the opacity CSS transition
				overlay.addClass('visible');
			}, 100);

			// Move the slider to the correct image
			offsetSlider(index);

			// Raise the visible flag
			overlayVisible = true;
		}

		function hideOverlay(){

			// If the overlay is not shown, exit
			if(!overlayVisible){
				return false;
			}

			// Hide the overlay
			overlay.hide().removeClass('visible');
			overlayVisible = false;

			//Clear preloaded items
			$('.placeholder').empty();

			//Reset possibly filtered items
			items = allitems;
		}

		function offsetSlider(index){

			// This will trigger a smooth css transition
			slider.css('left',(-index*100)+'%');
		}

		// Preload an image by its index in the items array
		function preload(index){

			setTimeout(function(){
				showImage(index);
			}, 1000);
		}

		// Show image in the slider
		function showImage(index){

			// If the index is outside the bonds of the array
			if(index < 0 || index >= $(".thumbs").find(filterClass).length){
				
				return false;
			}

			var imageTitle = $(".thumbs").find(filterClass).eq(index).attr('title');

			// Call the load function with the href attribute of the item
			loadImage($(".thumbs").find(filterClass).eq(index).attr('href'), function(){
				var holder = document.createElement('div');
				$(holder).addClass('placeholder-image');
				var caption = document.createElement('div');
				var blio = imageTitle;
				$(caption).text(imageTitle);
				$(caption).addClass("img-caption");
				$(holder).append(caption);
				$(holder).append(this);
				var favElement = $(".thumbs").find(filterClass).eq(index).find(".image-fav");
				var favClone = favElement.clone()
				var favoriteImages = JSON.parse(localStorage.getItem("favoriteImagesArray")) || [];
				var indexOfFav = favoriteImages.indexOf( $(".thumbs").find(filterClass).eq(index).attr("id") );
				if (indexOfFav >= 0) {
					favClone.addClass("favorite");
				}
				$(holder).append(favClone);
				favClone.off("click");
				favClone.on("click", function (ev) {
					toggleImageFavStatus($(ev.target));
				});

				placeholders.eq(index).html(holder);
			});
		}

		// Load the image and execute a callback function.
		// Returns a jQuery object

		function loadImage(src, callback){

			var img = $('<img>').on('load', function(){
				callback.call(img);
			});

			img.attr('src',src);
		}

		function showNext(){

			// If this is not the last image
			if(index+1 < items.length){
				index++;
				offsetSlider(index);
				preload(index+1);
			}

			else{
				// Trigger the spring animation
				slider.addClass('rightSpring');
				setTimeout(function(){
					slider.removeClass('rightSpring');
				},500);
			}
		}

		function showPrevious(){

			// If this is not the first image
			if(index>0){
				index--;
				offsetSlider(index);
				preload(index-1);
			}

			else{
				// Trigger the spring animation
				slider.addClass('leftSpring');
				setTimeout(function(){
					slider.removeClass('leftSpring');
				},500);
			}
		}
	};

	var toggleImageFavStatus = function (target) {
		console.log(target);
		var imageFavId = target.data("image-fav");
		var favoriteImages = JSON.parse(localStorage.getItem("favoriteImagesArray")) || [];
		var indexOfFav = favoriteImages.indexOf(imageFavId);
		if (indexOfFav >= 0) {
			target.removeClass("favorite");
			$("#"+ imageFavId).removeClass("favorite");
			favoriteImages.splice(indexOfFav, 1);
		} else {
			target.addClass("favorite");
			$("#"+ imageFavId).addClass("favorite");
			favoriteImages.push(imageFavId);
		}
		localStorage.setItem("favoriteImagesArray", JSON.stringify(favoriteImages));
	};

})(jQuery);
