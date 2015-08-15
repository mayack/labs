$(function(){

	var headerHeight = $('#header .atk-layout-cell').outerHeight();
	var actionsHeight = $('#header .atk-actions-xxlarge').outerHeight();

	$('#hero-text .atk-wrapper').css('padding-top', (headerHeight-actionsHeight)/2 + actionsHeight);

	$('select').select2({
		minimumResultsForSearch: -1,
	    placeholder: function(){
	        $(this).data('placeholder');
	    }
	});
    function format(icon) {
        var originalOption = icon.element;
        return '+' + $(originalOption).data('code');
    }

    $('.input-dropdown select').each(function(){
        $(this).select2({
            dropdownCssClass: "mytest",
            dropdownParent: $(this).parents('.input-dropdown'),
            templateSelection: format
        }).on('select2:open', function (e) {
            $(this).parents('.input-dropdown').addClass("active");
        }).on('select2:close', function (e) {
            $(this).parents('.input-dropdown').removeClass("active");
        })


    });

	$('.hospital-description p').readmore({
		collapsedHeight: 130,
		heightMargin: 8,
		moreLink: '<a href="#" class="atk-push h-caps atk-text-bold atk-size-micro"><span class="icon-plus-1"></span>&nbsp;Show More</a>',
		lessLink: '<a href="#" class="atk-push h-caps atk-text-bold atk-size-micro"><span class="icon-minus-1"></span>&nbsp;Show Less</a>'
	});

	$('.stickem-container').stickem();

});

function verticalTabs() {
  event.preventDefault();
  $(this).parent().addClass("active");
  $(this).parent().siblings().removeClass("active");
  var tab = $(this).attr("href");
  $(".vertical-tab-content").not(tab).css("display", "none");
  $(tab).fadeIn();
}