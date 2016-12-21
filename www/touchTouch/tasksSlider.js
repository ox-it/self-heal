
(function(){
	var filterClassAll = '.single-task';
	var filterClass = '.single-task.immediate-task';
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
		var favoriteTasks = JSON.parse(localStorage.getItem("favoriteTasksArray")) || [];
		return this.each(function() {
				var $this = $(this);
				var taskElems = $this.find(elements);
				$.each(taskElems, function (index, taskElem) {
					var elemId = $(taskElem).attr('id');
					var classes = " task-fav ";
					if (favoriteTasks.indexOf(elemId) >= 0) {
						classes += "favorite ";
						$(taskElem).addClass("favorite");
					}
					$(taskElem).append( "<div class='"+ classes +"' data-task-fav='"+ elemId +"'>&#9829;</div");
					
				})
			}); 
	};
	$('.tasks').randomize(filterClass);
	$('.tasks').addFavStatus(filterClassAll);
	
	/* Private variables */

	var overlay = $('<div id="taskOverlay">'),
		filters = $('<div id="taskFilters" class="filterButtons">' + 
						'<span id="nowTasksFilter" data-targetclassname="immediate-task" class="filterButton filterButton-active">Now</span>' +
						'<span id="ongoingTasksFilter" data-targetclassname="ongoing-task" class="filterButton">Long term</span>' +
						'<span id="favoritesFilter" data-targetclassname="favorite" class="filterButton">&#9829;</span>' +
		'</div>')
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

		function resetGallery() {
			//re-initialise the slider
			items = $(".tasks").find(filterClass);
			index = items.index($(".tasks").find(filterClass).first());
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
		backbtn.appendTo(overlay);

		//filter the list of tasks to just those with the given classname in their dom element
		var filterTasks = function (className) {
			$('.tasks').randomize(filterClass);
		}
		
		//init filters
		$('.filterButton').click(function (ev) {
			//apply class
			$('.filterButton').removeClass('filterButton-active');
			$(ev.target).addClass('filterButton-active');
			var classToShow = ev.target.dataset['targetclassname'];
			filterClass = '.single-task.' + classToShow;
			
			resetGallery();
		});

		// Creating a placeholder for each image
		placeholders = $( ('<div class="placeholder"></div>').repeat(items.length) );

		// Hide the gallery if the background is touched / clicked
		slider.append(placeholders).on('click',function(e){

			if(!$(e.target).is(filterClass)){
				// hideOverlay();
				// Disabling this for now so that filter buttons etc can work.
				// Users can still use the back arrow to go back.
			}
		});

		var movevar = false;
		var linkHref = undefined;
		// Listen for touch events on the body and check if they
		// originated in #taskSlider img - the images in the slider.
		$('body').on('touchstart', '#taskSlider ' + filterClassAll, function(e){

			var touch = e.originalEvent,
				startX = touch.changedTouches[0].pageX;
				if ($(touch.target).hasClass("task-fav")) {
					e.preventDefault();
					toggleTaskFavStatus($(touch.target));
				}

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

		}).on('touchend',function(ev){

			if (movevar === false && linkHref !== undefined && !$(ev.target).hasClass("task-fav")){
				window.open(linkHref, "_system");
			} 

			movevar = false;
			linkHref = undefined;
			//return true;
			slider.off('touchmove');
		});

		// Listening for clicks on the thumbnails
		$("#icon-top-right").on('click', function(e){

			$('.tasks').randomize(filterClass);

			var $this = $(".tasks").find(filterClass).first();
			//These statements kept seperate in case elements have data-gallery on both
			//items and ancestor. Ancestor will always win because of above statments.
			items = $(".tasks").find(filterClass);

			// Find the position of this image
			// in the collection
			index = items.index($(".tasks").find(filterClass).first());

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
			if(index < 0 || index >= $(".tasks").find(filterClass).length){
				return false;
			}


			var aaa = $(".tasks").find(filterClass).eq(index).clone();
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

	var toggleTaskFavStatus = function (target) {
		var taskFavId = target.data("taskFav");
		var favoriteTasks = JSON.parse(localStorage.getItem("favoriteTasksArray")) || [];
		var indexOfFav = favoriteTasks.indexOf(taskFavId);
		if (indexOfFav >= 0) {
			target.removeClass("favorite");
			$("#"+ taskFavId).removeClass("favorite");
			$("#"+ taskFavId +" .task-fav").removeClass("favorite");
			favoriteTasks.splice(indexOfFav, 1);
		} else {
			target.addClass("favorite");
			$("#"+ taskFavId).addClass("favorite");
			$("#"+ taskFavId +" .task-fav").addClass("favorite");
			favoriteTasks.push(taskFavId);
		}
		localStorage.setItem("favoriteTasksArray", JSON.stringify(favoriteTasks));
	};
	

	// Initialize the gallery
	$('.tasks ' + filterClass).tasksSlider();
})(jQuery);
