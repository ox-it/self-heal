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
				if (typeof(Storage) !== "undefined") {
					if (localStorage.getItem("firstTimeUse") == "false") {
						$('#info').hide();
					} else {
						localStorage.setItem("firstTimeUse", "false");
					}
				}
		});


	    $('#info-contact').click(function(){
	        $('#tasks').show();
	    })
			$('#header-icon-home').click(function(){
				console.log("tst home");
				$('#info').hide();
				$('#info').hide();
				$('#tasks').hide();
				$('#web').hide();
				$('#contacts').hide();
				$('#taskOverlay').hide();
				$('#galleryOverlay').hide();
				
	    })
			$('#header-icon-info').click(function(){
				if ($("#info").is(":visible")) {
	        $('#info').hide();
				} else {
	        $('#info').show();
				}
	    })
	    $('#info').click(function(){
	        $('#info').hide();
	    })
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
					},
					function (error) {
						//on Error
						console.log('error trying to get lat-lon');
					}
				);
			}
	    });
	    $('#web-contact').click(function(){
	        $('#web').show();
	    })
	    
		$( "#menu-icon" ).click(function() {
	  		var x = document.getElementById("myTopnav");
		    if (x.className === "topnav") {
		        x.className += " responsive";
		    } else {
		        x.className = "topnav";
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
	
	$('.thumbs').randomize('a');
	// Initialize the gallery
	$('.thumbs a').touchTouch();
});	
