(function( $ ) {

$.fn.pullSlider = function( options ) {
	var settings = $.extend({
		display: false,
		animationSlideTime: 500,
		inmode: true,
		//doesn't matter if you change these when you load in the options...
		element: this,
		accel: 0,
		last: 0,
		height:0,
		windowHeight:0,
		toggelbutton: false,
		tbheight: 0,
		selected:false
	}, options );

	settings.toggelbutton = $(this.children()[this.children().length-1]);
	if(settings.inmode){
		if(!this.hasClass("pull-slider")){
			this.addClass('pull-slider');
		}
		resetHeight();
		putToPosistion(true);
	}

	this.disable = function(){
		if(settings.inmode){
			settings.element.removeClass('pull-slider');
			settings.element.height("auto");
			settings.inmode = false;
		}
	}

	this.enable = function(){
		if(!settings.inmode){
			settings.element.addClass('pull-slider');
			resetHeight();
			putToPosistion(true);
			settings.inmode = true;
		}
	}

	this.refindHeight = function(){
		resetHeight();
		putToPosistion(true);
	}

	$(window).resize(function(){
		if(settings.inmode){
			resetHeight();
			putToPosistion(true);
		}
	});
	//toggle for the desktop and other devices which do not support the touch movements
	settings.toggelbutton.on("click",function(){
		if(settings.inmode){
			if(settings.display){
				settings.display = false;
			} else {
				settings.display = true;
			}
			putToPosistion();
		}
	});
	//enable the rest of the touch inputs to work by enabling settings.selected
	settings.toggelbutton.on("touchstart",function(){
		if(settings.inmode){
			settings.toggelbutton.addClass('selected');
			settings.selected = true;
			settings.last = settings.element.offset().top;
		}
	})
	//as the user moves over the screen the element follows their touch, by preventing default we do not allow click to be triggered, we also do the math for the acceleration of the menu
	window.addEventListener("touchmove",function(event){
		if(settings.selected){
			event.preventDefault();
			var touched = event["targetTouches"]["0"];
			var thispos = settings.element.offset().top;
			settings.accel = settings.last - thispos;
			settings.last = thispos;
			if(touched["clientY"]-settings.height < 0 && touched["clientY"]-settings.height > -settings.height){
				settings.element.css("top",touched["clientY"]-settings.height);
			}
		}
	});
	//from the acceleration calced in the touchmove we send the navigation bar to where it needs to end up
	$(window).on("touchend",function(){
		if(settings.selected){
			toggleAnimation(true);
			if(settings.accel <= 0){
				settings.display = true;
			} else {
				settings.display = false;
			}
			putToPosistion();
			settings.toggelbutton.removeClass('selected');
			settings.selected = false;
		}
	})

	//set the height of the slider to either the window height if it's greater than it, or to it self, adding the full height style if needed
	function resetHeight(){
		settings.windowHeight = $(window).height();
		settings.element.height("auto");
		settings.height = settings.element.height();
		if(settings.height >= settings.windowHeight){
			settings.element.height(settings.windowHeight);
			if(!settings.element.hasClass('slider-window-height')){
				settings.element.addClass('slider-window-height');
			}
		} else {
			settings.element.height(settings.height);
			if(settings.element.hasClass('slider-window-height')){
				settings.element.removeClass('slider-window-height');
			}
		}
		settings.tbheight = settings.toggelbutton.outerHeight(true);
	}
	//slide either up or down the element based on the animation
	function putToPosistion(noscroll){
		if(settings.display){
			if(noscroll == undefined || !noscroll){toggleAnimation(true);}
			settings.element.css("top","0");
		} else {
			if(noscroll == undefined || !noscroll){toggleAnimation(true)};
			if(settings.windowHeight <= settings.height){
				settings.element.css("top",-settings.windowHeight+settings.tbheight);
			} else {
				settings.element.css("top",-settings.height+settings.tbheight);
			}
		}
		scrollToBottom();
	}
	//toggle the animation class, but if set to true, add it and then remove it after the sliding animation time, if false remove it
	function toggleAnimation(toggleTo){
		if(!settings.element.hasClass('slider-animation')||toggleTo){
			settings.element.addClass('slider-animation');
			setTimeout(function(){
				toggleAnimation(false);
			},settings.animationSlideTime);
		} else if(settings.element.hasClass('slider-animation')||!toggleTo){
			settings.element.removeClass('slider-animation');
		}
	}
	//scroll the element to the bottom of the page
	function scrollToBottom(){
		settings.element.scrollTop(settings.element[0].scrollHeight);
	}

	return this
};
	}( jQuery ));