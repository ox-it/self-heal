$(function(){
		$( document ).ready(function() {
		    $('#contacts').hide();
		    $('#tasks').hide();
		    $('#web').hide();
	    	$('#info').hide();
		    $('#loader-holder').hide();
		});


	    $('#info-contact').click(function(){
	        $('#home').hide();
	        $('#tasks').show();
	    })
	    $('#icon-bottom-right').click(function(){
	        $('#home').hide();
	        $('#info').show();
	    })
	    $('#info').click(function(){
	        $('#home').show();
	        $('#info').hide();
	    })
	    $('#phone-contact').click(function(){
	        $('#home').hide();
	        $('#contacts').show();
					if (navigator && navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(
							function (position) {
								//on Success	
								console.log('Latitude:',position.coords.latitude);
								console.log('Longitude:',position.coords.longitude);
								
								var $contacts = $('#contacts .content-holder');
								var $contactItems = $contacts.children('.acc-item');

								$contactItems.sort(function(a,b){
									var lat0 = position.coords.latitude;
									var lon0 = position.coords.longitude;
									var lat1 = $(a).data('lat');
									var lon1 = $(a).data('lon');
									var lat2 = $(b).data('lat');
									var lon2 = $(b).data('lon');
									var aDistance = mapDistance(lat1, lon1, lat0, lon0)
									var bDistance = mapDistance(lat2, lon2, lat0, lon0)
									if(aDistance > bDistance) return 1;
									if(aDistance < bDistance) return -1;
									return 0;
								});

								$contactItems.detach().appendTo($contacts);
							},
							function (error) {
								//on Error
								console.log('error trying to get lat-lon');
							}
						);
					}
	    })
	    $('#web-contact').click(function(){
	        $('#home').hide();
	        $('#web').show();
	    })
	    $('.home-button').click(function(){
            hideIcons();
	        $(this).parent().parent().hide();
	        $('#home').show();
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

	$("#icon-bottom-left").click(function(){

        if ($("#icon-bottom-left").hasClass("moved")){
            hideIcons();
		} else {
			showIcons();
	    }

    });

	function hideIcons(){
		$("#web-contact").animate({
		    left: '-=100px'
		});
		$("#info-contact").animate({
		    left: '-=100px',
		    top: '+=100px',
		});
		$("#phone-contact").animate({
		    top: '+=100px'
		});
        $("#icon-bottom-left").toggleClass("moved");
	}

	function showIcons(){
        $("#web-contact").animate({
            left: '+=100px'
        });
        $("#info-contact").animate({
            left: '+=100px',
            top: '-=100px',
        });
        $("#phone-contact").animate({
            top: '-=100px'
        });
        $("#icon-bottom-left").toggleClass("moved");
	}

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
