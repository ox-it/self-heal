
(function(){
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
	$('.tasks').randomize('.single-task');
	/* Private variables */

	var overlay = $('<div id="taskOverlay">'),
		slider = $('<div id="taskSlider">'),
		backbtn = $('<div id="gallery-back">'),
		prevTask = $('<a id="prevTask"></a>'),
		nextTask = $('<a id="nextTask"></a>'),
		overlayVisible = false;


	/* Creating the plugin */

	$.fn.tasksSlider = function(){

		var placeholders = $([]),
			index = 0,
			allitems = this,
			items = allitems;

		// Appending the markup to the page
		overlay.hide().appendTo('body');
		slider.appendTo(overlay);
		backbtn.appendTo(overlay);

		// Creating a placeholder for each image
		items.each(function(){
			placeholders = placeholders.add($('<div class="placeholder">'));
		});

		// Hide the gallery if the background is touched / clicked
		slider.append(placeholders).on('click',function(e){

			if(!$(e.target).is('.single-task')){
				hideOverlay();
			}
		});

		var movevar = false;
		var linkHref = undefined;
		// Listen for touch events on the body and check if they
		// originated in #taskSlider img - the images in the slider.
		$('body').on('touchstart', '#taskSlider .single-task', function(e){

			var touch = e.originalEvent,
				startX = touch.changedTouches[0].pageX;


				linkHref = $(this).find('a').first().attr('href');
				
			slider.on('touchmove',function(e){

				e.preventDefault();

				movevar = true;
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

			if (movevar === false && linkHref !== undefined){
				window.open(linkHref, "_system");
			} 

			movevar = false;
			linkHref = undefined;
			//return true;
			slider.off('touchmove');
		});

		// Listening for clicks on the thumbnails
		$("#icon-top-right").on('click', function(e){

			$('.tasks').randomize('.single-task');

			var $this = $(".tasks").find('.single-task').first(),
				selectorType;
			//These statements kept seperate in case elements have data-gallery on both
			//items and ancestor. Ancestor will always win because of above statments.
			items = $(".tasks").find('.single-task');

			// Find the position of this image
			// in the collection
			index = items.index($(".tasks").find('.single-task').first());
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
			overlay.append(prevTask).append(nextTask);

			prevTask.click(function(e){
				e.preventDefault();
				showPrevious();
			});

			nextTask.click(function(e){
				e.preventDefault();
				showNext();
			});
		}

		$('#gallery-back').click(function(){
			console.log("Should go back")
			movevar = false;
			linkHref = undefined;
			slider.off('touchmove');
				hideOverlay();
		})


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
			if(index < 0 || index >= $(".tasks").find('.single-task').length){
				return false;
			}


			var aaa = $(".tasks").find('.single-task').eq(index).clone();
			placeholders.eq(index).html(aaa);
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


	// Initialize the gallery
	$('.tasks .single-task').tasksSlider();
})(jQuery);
