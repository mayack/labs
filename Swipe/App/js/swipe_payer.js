$(function(){

	try{
      initializeGoogleMapApi();
    }
    catch(err){
    }
	
});

$.fn.exists = function(){return this.length>0;}

function postAddInfo() {

	allowPost = true;

	if ($("input[name='first_name']").exists()){
		if ($("input[name='first_name']").val().length == 0){
			$("input[name='first_name']").addClass("warning-input");
			allowPost = false;
		}
	}

	if ($("input[name='last_name']").exists()){
		if ($("input[name='last_name']").val().length == 0){
			$("input[name='last_name']").addClass("warning-input");
			allowPost = false;
		}
	}

	if ($("input[name='personal_code']").exists()){
		if ($("input[name='personal_code']").val().length == 0){
			$("input[name='personal_code']").addClass("warning-input");
			allowPost = false;
		}
	}

	if ($("input[name='company_name']").exists()){
		if ($("input[name='company_name']").val().length == 0){
			$("input[name='company_name']").addClass("warning-input");
			allowPost = false;
		}
	}

	if ($("input[name='registration_nr']").exists()){
		if ($("input[name='registration_nr']").val().length == 0){
			$("input[name='registration_nr']").addClass("warning-input");
			allowPost = false;
		}
	}

	if ($("input[name='legal_address']").exists()){
		if ($("input[name='legal_address']").val().length == 0){
			$("input[name='legal_address']").addClass("warning-input");
			allowPost = false;
		}
	}

	if (!allowPost){
		return false;
	}

	$.ajax({
		url: "",
		type: "POST",
		data: $('#additional_info_form').serialize(),
		dataType: "JSON",
		success: function (msg) {
			if (msg.status == 1){
				window.location.reload(true);
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {

		},
	});

	return false;
}

function previewInvoice() {

	$.ajax({
		url: previewInvoiceLink,
		type: 'GET',
		data: '',
		dataType: 'html',
		success: function (data) {
			$('#modal-container').html(data);
			$('#modal-container > div').bPopup();            
		},
		error: function(xhr, ajaxOptions, thrownError) {
			window.location.reload();
		}
	});

    return false;
}

