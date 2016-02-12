$(function(){
	var header = $('#header header').outerHeight();
	$('#hero-slider .atk-wrapper').css("padding-top", header);

	$('#hero-slider').royalSlider({
		addActiveClass: true,
		arrowsNavAutoHide: false,
		autoHeight: true,
		controlsInside: false,
		controlNavigation: 'thumbnails',
    	deeplinking: {
    		enabled: true
    	},
		loop: true,
		navigateByClick: false,
		slidesSpacing: 0,
		sliderDrag: false
	});

    var slider = $('#hero-slider');
    slider.prepend(slider.find('.rsNav').addClass('atk-wrapper'));

});