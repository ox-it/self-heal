$(function(){
	$( document ).ready(function() {
		if (window.cordova) {
			if (cordova.platformId == "ios") {
				$("body").addClass("ios") 
			} else {
				$("body").addClass("android") 
			}
		}
		$('#contacts').hide();
		$('#tasks').hide();
		$('#web').hide();
		$('#loader-holder').hide();
		$('#feedback').hide();
		if (typeof(Storage) !== "undefined") {
			var feedbackDate = localStorage.getItem("feedbackDate");
			if (!feedbackDate || localStorage.getItem("firstTimeUse") != "false") {
				localStorage.setItem("firstTimeUse", "false");
				feedbackDate = new Date();
				feedbackDate.setDate(feedbackDate.getDate() + 14);
				localStorage.setItem("feedbackDate", feedbackDate);
				localStorage.setItem("showFeedback", "true");
			} else {
				$('#info').hide();
				var now = new Date();
				if (now > new Date(feedbackDate) && localStorage.getItem("showFeedback") == "true") {
					$('#feedback').delay(500).slideDown();
				}
			}
		}
		document.addEventListener('deviceready', onDeviceReady, false);
	});

	$('#feedback-later, #close-feedback').click(function(ev){
		$('#feedback').slideUp();
		if (typeof(Storage) !== "undefined") {
			var feedbackDate = new Date();
			feedbackDate.setDate(feedbackDate.getDate() + 7);
			localStorage.setItem("feedbackDate", feedbackDate);
		}
	});

	$('#no-feedback').click(function(ev){
		$('#feedback').slideUp();
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("showFeedback", false);
		}
	});
	
	$('#feedback-button, #info-feedback-button').click(function(ev){
		$('#feedback').slideUp();
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("showFeedback", false);
		}
		window.open('https://docs.google.com/forms/d/e/1FAIpQLSdr5RUz9cceSEzJ7tbxP1Cmq599VDaiB5Y101AgkCq4a9BGjw/viewform?usp=sf_link', '_system');
	});
	
	$('#web .acc-text a').click(function(ev){
		window.open($(ev.target).attr('href'), '_system');
	});

	$('#header-icon-home').click(function(){
		$('#info').hide();
		$('#info').hide();
		$('#tasks').hide();
		$('#web').hide();
		$('#contacts').hide();
		$('#taskOverlay').hide();
		$('#galleryOverlay').hide();
		if(typeof(window.ga) !== 'undefined') {
			window.ga.trackView('Home screen');
		}
    });
			
	$('#header-icon-info').click(function(){
		if ($("#info").is(":visible")) {
    		$('#info').hide();
			$("#contacts, #web, #tasks").css({ "position": "initial" });
		} else {
    		$('#info').show();
			$("#contacts, #web, #tasks").css({ "position": "fixed" });
			if(typeof(window.ga) !== 'undefined') {
				window.ga.trackView('Info screen');
			}
		}
    });

    $('#info').click(function(){
        $('#info').hide();
				$("#contacts, #web, #tasks").css({ "position": "initial" });
    });

	$('#info-contact').click(function(){
		$('#tasks').show();
		if(typeof(window.ga) !== 'undefined') {
			window.ga.trackView('Info-ideas screen');
		}
	});

    $('#phone-contact').click(function(){
        $('#contacts').show();
		if (navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function (position) {
					//on Success	
					
					var $contacts = $('#contacts .numbers');
					var $contactItems = $contacts.children('.acc-item');

					// var position = {coords: {latitude: 51.45, longitude: -2.58}};	//bristol
					function getNum(el, key) {
						var val = $(el).data(key);
						if(typeof(val) === "string") {
							val = parseFloat(val);
						}
						return val;
					}
					$contactItems.detach().sort(function(a,b){
						var lat1 = getNum(a, 'lat');
						var lon1 = getNum(a, 'lon');
						var lat2 = getNum(b, 'lat');
						var lon2 = getNum(b, 'lon');
						//items with no lat/lng should appear first
						if(lat1 && !lat2) {
							return 1;
						} else if (!lat1 && lat2) {
							return -1;
						} else if(lat1 && lat2){
							var lat0 = position.coords.latitude;
							var lon0 = position.coords.longitude;
							var aDistance = mapDistance(lat1, lon1, lat0, lon0)
							var bDistance = mapDistance(lat2, lon2, lat0, lon0)
							if(aDistance > bDistance) return 1;
							if(aDistance < bDistance) return -1;
							return 0;
						} else {
							//else use input order
							return 0;
						}
					})
					.appendTo($contacts);
					if(typeof(window.ga) !== 'undefined') {
						window.ga.trackEvent('Geolocation', 'contacts: proximity sorting');
					}
				},
				function (error) {
					//on Error
					console.log('error trying to get lat-lon');
				}
			);
		}
		if(typeof(window.ga) !== 'undefined') {
			window.ga.trackView('Info-contacts screen');
		}
	});

	$('#web-contact').click(function(){
		$('#web').show();
		if(typeof(window.ga) !== 'undefined') {
			window.ga.trackView('Info-weblinks screen');
		}
	});
	    
	$(".acc-item").click(function() {
		$(this).find(".acc-hide").toggle("slow");
	});

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

	function mapDistance(lat1, lon1, lat2, lon2){
		var R = 6371e3; // metres
		var φ1 = lat1 * Math.PI / 180; //toRadians
		var φ2 = lat2 * Math.PI / 180; //toRadians
		var Δφ = (lat2-lat1) * Math.PI / 180; //toRadians
		var Δλ = (lon2-lon1) * Math.PI / 180; //toRadians
		var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
		Math.cos(φ1) * Math.cos(φ2) *
		Math.sin(Δλ/2) * Math.sin(Δλ/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		return d;
	}
	
	function onDeviceReady(){
		if(typeof(window.ga) !== 'undefined') {
			console.log("started GA Tracker");
			window.ga.startTrackerWithId('UA-89394041-1');
			window.ga.trackView('Home screen');
			window.ga.trackEvent('App', 'Start');
		}
	}

	$('.thumbs').randomize('a');
	// Initialize the gallery
	$('.thumbs a').touchTouch();
});	
