var isAnyClientToolTipOpened = false;
var lastOpenedClientTooltipID;
var isAnyClientToolTipClosedAfterBlur = false;

var isAnyUserToolTipOpened = false;

$( window ).load(function() {
  $("#main-section").show();
});

$(function(){

	$('.select-single').multipleSelect({
		single: true,
		placeholder : $(this).data("placeholder")
	});

	updateClientTooltip();

// datepicker
/*
	$('#due_date').datepicker({
		orientation: 'right',
		startView: 'swipe',
		autoclose: true,
		todayHighlight: true,
 		weekStart: 1,
		daysOfWeekDisabled: "0,6"						  
	}).on('hide', function(e){
		$('.datepicker').removeAttr('style');
		//.css({'width':486});
    });
*/	
	CreatePicker();

	$("#add_info").multipleSelect({
       	selectAll: false
    });
	
	$(document).click(function ()  {
		$('#add_info').multipleSelect({filter: true}, 'blur');
	});	

	$('#due_date').click(function ()  {
//		$('.datepicker').css({'width':''});
//		$('.datepicker-days').hide();
	});	
});

function changeLanguage(lang){
	 window.location = window.location.href.replace(currentLanguage, lang);
}

function updateClientTooltip(){
	$('.open-settings-icon').unbind('click').click(function(event) {
      clientSettingsStatus(this);
      event.stopPropagation();
    });

	$( ".client-tooltip" ).unbind('blur').blur(function(e) {
       $('.client-tooltip').hide();
       isAnyClientToolTipClosedAfterBlur = true;
       isAnyClientToolTipOpened = false;
       setTimeout(function(){
            isAnyClientToolTipClosedAfterBlur = false;
            isAnyUserToolTipOpened = false;
       }, 200);
       $('.client-tooltip').parent().removeClass('icon-cog-size-pos-active');
    });
}

function showLoggedUserActions(e){
	if (!isAnyUserToolTipOpened){
		isAnyUserToolTipOpened = true;
	    $( ".logged-user-tooltip" ).toggle();
	    $( ".logged-user-tooltip" ).focus();
	}
}

function clientSettingsStatus(e) { 

  if (!isAnyClientToolTipClosedAfterBlur || (lastOpenedClientTooltipID != e)){
  	
    if (isAnyClientToolTipOpened){
    	
      if (lastOpenedClientTooltipID != e){
        $( "#" + lastOpenedClientTooltipID ).children().hide();
        $( "#" + lastOpenedClientTooltipID ).toggleClass( "icon-cog-size-pos-active" );
      }
    }

    var isActive = $(e).hasClass("icon-cog-size-pos-active");
    $(".client-tooltip").parent().removeClass("icon-cog-size-pos-active");
    $(e).toggleClass( "icon-cog-size-pos-active" );

    if (isActive == false){
      $(".client-tooltip").hide();

      $(e).children().show();
      $(e).children().focus();
      lastOpenedClientTooltipID = e;
      isAnyClientToolTipOpened = true;
    }
    else{
      $(".client-tooltip").parent().removeClass("icon-cog-size-pos-active");
      $(e).children().hide();
      isAnyClientToolTipOpened = false;
    }
  }
}

function ShowCalendar(a) {
	 $('.radio-is-active').removeClass('radio-is-active');
	 $(a).find('.radio').addClass('radio-is-active');
	 
	if ($(a).prop('id')=='opt_5')	 {
//		var p = $(".datepicker");
//		var position = p.position();	
//		var lft=position.left;
		$('.datepicker').css({'width':495});
		$('.datepicker-swipe').css({'border-left':'1px solid #f2f4f5'});
		
		$('.datepicker-days').show();
	}
}

function CreatePicker(){
	if(!$('#due_date').length)
		return false;
	$('#due_date').datepicker({
		orientation: 'right',
		startView: 'swipe', // swipe
		autoclose: true,
		todayHighlight: true,
		weekStart: 1,
		daysOfWeekDisabled: "0,6"						  
	}).on('hide', function(e){
		$('#due_date').datepicker('remove');
		CreatePicker();
	});
	
	$('.radio-row span').click(function ()  {
		return false;
	});	
	
}
