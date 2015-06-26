$(function(){
	$('.payer_button_div').click(function ()  {
		$('#popup').bPopup({
            onOpen: function() { $('.scr').addClass('noprint'); }, 
            onClose: function() { $('.scr').removeClass('noprint'); }
        });
	});	
});



