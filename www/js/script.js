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
			$('#header-icon-info').click(function(){
				if ($("#info").is(":visible")) {
	        $('#info').hide();
				} else {
	        $('#info').show();
				}
	    })
			$('#icon-bottom-right').click(function(){
	        $('#info').show();
	    })
	    $('#info').click(function(){
	        $('#home').show();
	        $('#info').hide();
	    })
	    $('#phone-contact').click(function(){
	        $('#home').hide();
	        $('#contacts').show();
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

	$('.thumbs').randomize('a');
	// Initialize the gallery
	$('.thumbs a').touchTouch();
});	