var defaultFeeResponsibility;
var defaultVatSwitch;
var defaultEmailNotificationArray = [];
var defaultVatRate;

$( window ).load(function() {

	defaultFeeResponsibility = $("#fee-responsibility").val();
	defaultVatSwitch = $("#vat_enabled").val();
	defaultVatRate = $("#vat-rate").val();

	var i = 1;

	while($("input[name=email-notification-"+i+"]").val()){

		defaultEmailNotificationArray[i] = $("input[name=email-notification-"+i+"]").val();
		i++;
	}

});

$(function(){

	$("#vat-rate").keypress(function(e) {
  		$(this).removeClass("warning-input");

        var code = e.charCode || e.which;
        if (!checkIntegerInput(e)){
            return false;
        }
	});

	$("#vat-rate").keyup(function(e) {
		var vatRateValLength = $("#vat-rate").val().length;
		var vatRateVal = $("#vat-rate").val();
		if (vatRateValLength > 2){
  			$("#vat-rate").val(vatRateVal.substring(0, vatRateValLength - (vatRateValLength-2)));
  		}
  		checkChanges();
	});

	$("#fee-responsibility").change(function() {
 		checkChanges();
	});

	$('.check-swipe-checkbox').click(function(event){

		var isChecked = 0;

		if ($(this).is(':checked')){
			isChecked = 1;
		}

		$("input[name=email-notification-"+ $(this).data("id") +"]").val(isChecked);
		checkChanges();
	});

	$('.onoffswitch-checkbox').click(function(event){

		var isChecked = 0;

		if ($(this).is(':checked')){
			isChecked = 1;
		}

		$("#vat_enabled").val(isChecked);
		checkChanges();
	});

	$(document).click(function (event)  {
    
		// Need for onblur hide!
	    ele=$('#m_fee-responsibility').find('.ms-drop');
	    ele_flag=$('#m_fee-responsibility').find('.ms-choice');
	    dv=ele.css("display");
	    if (dv=='block') {
	      ele.css("display","none");
	      ele_flag.trigger('click');
	    }      
	});

	$('#m_fee-responsibility').unbind('click').click(function(event){
		var dv=$(this).find('.ms-drop').css("display");
		if (dv=='block') {
			event.stopPropagation();
		}								
	});

});

function checkChanges(){

	var allowToEnableButton = false, i = 1;

	while($("input[name=email-notification-"+i+"]").val()){

		if (defaultEmailNotificationArray[i] != $("input[name=email-notification-"+i+"]").val()){
			allowToEnableButton = true;
		};
		i++;
	}

	if (defaultFeeResponsibility != $("#fee-responsibility").val()){
		allowToEnableButton = true;
	}

	if (defaultVatSwitch != $("#vat_enabled").val()){
		allowToEnableButton = true;
	}

	if (defaultVatRate != $("#vat-rate").val()){
		allowToEnableButton = true;
	}

	if (allowToEnableButton){
		$("#submit-button").prop('disabled', false);
	}
	else{
		$("#submit-button").prop('disabled', true);
	}
	
}

function checkIntegerInput(evt){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.charCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}