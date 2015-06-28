var newFileData = false;
var postButtonDisabled = false;
var deleteBankAccountID = false;

var defaultTransferRateType,
	defaultTransferRateDays,
	defaultPersonFirstName,
	defaultPersonLastName;

$( window ).load(function() {

	defaultTransferRateType = $("input[name='radio-transfer-group']").val();
	defaultTransferRateDays = $("#transfer-days").val();
	defaultPersonFirstName = $("#responsible_person_first_name").val();
	defaultPersonLastName = $("#responsible_person_last_name").val();
	$("#file-name").html(truncString($("#file-name").html()));
		
});

$(function(){

	$("#responsible_person_first_name, #responsible_person_last_name").keypress(function() {
  		$(this).removeClass('warning-input');
  		checkChanges();
	});

	$("#responsible_person_first_name, #responsible_person_last_name").keyup(function() {
  		checkChanges();
	});

	$('#upload-button').click(function(e) {
    	e.preventDefault();
    	$('#input-document').trigger('click');   
	});

	$('#new-upload-button').click(function(e) {
    	e.preventDefault();
    	$('#input-new-document').trigger('click');   
	});

	$("input[name='radio-transfer-group']").on('click', function(evt){
		if ($(this).val()==1){
			$("#transfer-days").prop('disabled', false);
		}
		else{
			$("#transfer-days").prop('disabled', true);
			// $("#transfer-days").val("");
		}
	});

    $('#modal-delete-bank-account-submit').unbind('click').click(function(e) {
          deleteBankAccount();
    });

	$('#delete-document').unbind('click').click(function(e) {
    	fileData = false;
 
        formdata = new FormData();

        if (formdata) {
            formdata.append("custom_action", 'passport_scan_delete');
            formdata.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
        }

        $.ajax({
            url: "",
            type: "POST",
            data: formdata,
            processData: false,
            contentType: false,
            dataType: "JSON",
            success: function (msg) {
                try{
                    if(msg.status == -1){
                        window.location = loginPageLink;
                    }
                }
                catch(err){
                }
            	$("#upload-button").html("<span id='test' class='icon-upload'></span>&nbsp;" + "Upload Passport Scan");
            	$("#upload-button").show();
			    $("#upload-document-view").hide();    	
			    $("#upload-info-text").show();
			    $("#pending-document").hide();
			    $("#delete-document").hide();
            },
            error: function(xhr, ajaxOptions, thrownError) {

            }
	    });
	});
    
    $('#print-withdrawal-form').click(function(){

        $('body>.layout').addClass('print-hide');
        window.print();

    });

    $('body').click(function(){
        if( $('.print-hide').length ) {
            $('.print-hide').removeClass('print-hide');
        }
    });

	updateWithdrawalMethodRows();
	updateFileChange();
});

function updateWithdrawalMethodRows(){
	$(".bank-account-row").unbind('mouseleave').mouseleave(function() {
	  	$(this).find('.delete-bank-account').hide();
	});

	$(".bank-account-row").unbind('mouseover').mouseover(function() {
	  	$(this).find('.delete-bank-account').show();
	});


	$('.delete-bank-account').unbind('click').click(function(e) {
        deleteBankAccountID = $(this).parent().parent().data("id");
        $("#modal-delete-bank-account").bPopup();
    });
}

function deleteBankAccount(){
    formdata = new FormData();

    if (formdata) {
        formdata.append("custom_action", 'delete_bank_account');
        formdata.append("id", deleteBankAccountID);
        formdata.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
    }

    $.ajax({
        url: "",
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (msg) {
            try{
                if(msg.status == -1){
                    window.location = loginPageLink;
                }
            }
            catch(err){
            }
            $("#bank-account-placeholder").show();
            $(".bank-account-row").remove();
            $("#add-bank-account-button").show();
            $("#modal-delete-bank-account").bPopup().close();
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });
    
}

function truncString(string){

	var visibleLeftCharacterCount = 14;
    var visibleRightCharacterCount = 7;

    if (string.length > 21){
		string = string.substring(0,visibleLeftCharacterCount)+"&#8230;"+string.substring(string.length - visibleRightCharacterCount, string.length);
    }
    var string = string.replace(" ", "_");
    return string;
}

function checkChanges(){

	var allowToEnableButton = false, i = 1;

	if (defaultTransferRateType != $("input[name='radio-transfer-group']").val()){
		allowToEnableButton = true;
	}

	if ($("input[name='radio-transfer-group']").val() == 1 && defaultTransferRateDays != $("#transfer-days").val()){
		allowToEnableButton = true;
	}

	if ($("#responsible_person_first_name").val() != defaultPersonFirstName || $("#responsible_person_last_name").val() != defaultPersonLastName){
		allowToEnableButton = true;
	}

	if ($("input[name='radio-transfer-group']").val() == 1 && $("#transfer-days").val().length == 0){
		allowToEnableButton = false;
	}

	if (allowToEnableButton){
		$("#submit-button").prop('disabled', false);
	}
	else{
		$("#submit-button").prop('disabled', true);
	}
	
}

function updateFileChange(){

	$('#input-document').unbind('change').on('change', function(evt){

		console.log("change");
		                         
       	var file = evt.target.files[0];

       	if (!file){
       		return false;
       	}

        if (file.size > maxFileSize){
            $("#modal-file-size-error").bPopup()
            return false;
        }

       	if(file.type.match('image.*') || file.type==='application/pdf'){

	        fileData = file;

	        console.log(fileData);

	        fileName = truncString(fileData.name);
	       
	        var reader = new FileReader();
	        reader.onload = (function(file){
                        
            return function(e){

            	$("#upload-button").html("<span id='test' class='icon-spin5 animate-spin' style='line-height:12px'></span>&nbsp;" + "Uploading" + "&#8230;");

            	if (file.type==='application/pdf'){

            		formdata = new FormData();

                    if (formdata) {
                        formdata.append("data", fileData);
                        //formdata.append("custom_action", 'logo');
                    	formdata.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
                    }

                    $.ajax({
			            url: "",
			            type: "POST",
			            data: formdata,
			            processData: false,
			            contentType: false,
                        dataType: "JSON",
			            success: function (msg) {
                            try{
                                if(msg.status == -1){
                                    window.location = loginPageLink;
                                }
                            }
                            catch(err){
                            }
			            	$("#upload-button").hide();
			            	$("#upload-document-view").show();
			            	$("#file-name").html(fileName);
			            	$("#upload-info-text").hide();
			            	$("#delete-document").show();
			            	//$("#pending-document").show();
			            },
			            error: function(xhr, ajaxOptions, thrownError) {
			            	
			            }
				    });            
            	}
            	else{
	                var image = new Image();
	                image.src = e.target.result;
	                image.onload = function() {
	                    // Access image size here
	                    var imageWidth = this.width;
	                    var imageHeight = this.height;

	                    formdata = new FormData();

	                    if (formdata) {
	                        formdata.append("custom_action", 'passport_scan');
                            formdata.append("passport_scan", fileData);
                         //    formdata.append("responsible_person_first_name", $('#responsible_person_first_name').val());
	                        // formdata.append("responsible_person_last_name", $('#responsible_person_last_name').val());
	                    	formdata.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
	                    }

	                    $.ajax({
				            url: "",
				            type: "POST",
				            data: formdata,
				            processData: false,
				            contentType: false,
                            dataType: 'JSON',
				            success: function (msg) {
                                try{
                                    if(msg.status == -1){
                                        window.location = loginPageLink;
                                    }
                                }
                                catch(err){
                                }
                                if(msg.status == 1) {                                        
                                    $("#upload-button").hide();
                                    $("#upload-document-view").show();
                                    $("#file-name").html(fileName);
                                    $("#upload-info-text").hide();
                                    $("#delete-document").show();
                                    //$("#pending-document").show();
                                    // $('#responsible_person_first_name').prop('disabled', true);
                                    // $('#responsible_person_last_name').prop('disabled', true);
                                }
				            },
				            error: function(xhr, ajaxOptions, thrownError) {
				            	
				            }
					    });                       
	                };
	            }
            }
            })(file);
       	}
       	reader.readAsDataURL(file);
    });

	$('#input-new-document').unbind('change').on('change', function(evt){

		console.log("change2");
		                         
       	var file = evt.target.files[0];

       	if (!file){
       		return false;
       	}

        if (file.size > maxFileSize){
            $("#modal-file-size-error").bPopup()
            return false;
        }
    
       	if(file.type.match('image.*') || file.type==='application/pdf'){

	        newFileData = file;

	        console.log(newFileData);

	        fileName = truncString(newFileData.name);
	       
	        var reader = new FileReader();
	        reader.onload = (function(file){
                        
            return function(e){

            	//$("#new-upload-button").html("<span id='test' class='icon-spin5 animate-spin' style='line-height:12px'></span>&nbsp;" + "Uploading" + "&#8230;");

            	$("#new-upload-button").hide();
            	$("#new-upload-document-view").show();
            	$("#new-file-name").html(fileName);
            	// $("#upload-info-text").hide();
            	// $("#delete-document").show();
            }
            })(file);
       	}
       	reader.readAsDataURL(file);
    });
}

function postPersonChange(){

	var allowToPost = 1, data;

    if ($("#change-person-first-name").val().length == 0){
    	$("#change-person-first-name").addClass("warning-input");
    	allowToPost = 0;
    }
    else{
    	$("#change-person-first-name").removeClass("warning-input");
    }

    if ($("#change-person-last-name").val().length == 0){
    	$("#change-person-last-name").addClass("warning-input");
    	allowToPost = 0;
    }
    else{
    	$("#change-person-last-name").removeClass("warning-input");
    }

    if (!newFileData){
    	$("#new-upload-button").addClass("warning-input");
    	allowToPost = 0;
    }
    else{
    	$("#new-upload-button").removeClass("warning-input");
    }

    if (allowToPost == 0){
      return false;
    }

    formdata = new FormData();
    if (formdata) {
        formdata.append("custom_action", 'resubmit_personal_details');
        formdata.append("passport_scan", newFileData);
        formdata.append("responsible_person_first_name", $('#change-person-first-name').val());
        formdata.append("responsible_person_last_name", $('#change-person-last-name').val());
        formdata.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
    }

    $.ajax({
      	url: ".",
      	contentType: false,
     	processData: false,
        cache: false,
      	type: "POST",
      	// data: $('#modal-change-person-data-form').serializeArray(),
        data: formdata,
      	dataType: "JSON",
      	success: function (data) {
        	// data = JSON.parse(data);
        	// $('#modal-change-person-data').bPopup().close();
            try{
                if(data.status == -1){
                    window.location = loginPageLink;
                }
            }
            catch(err){
            }
            if(data.status == 1)
                window.location.reload(true);
      	},
      	error: function(xhr, ajaxOptions, thrownError) {
			
	  	},
    });

    return false;
}

function postMainFormData(){

	var allowToPost = true;

	if ($("#responsible_person_first_name").val().length == 0){
		$("#responsible_person_first_name").addClass("warning-input");
		allowToPost = false;
	}
	else{
		$("#responsible_person_first_name").removeClass("warning-input");
	}

	if ($("#responsible_person_last_name").val().length == 0){
		$("#responsible_person_last_name").addClass("warning-input");
		allowToPost = false;
	}
	else{
		$("#responsible_person_last_name").removeClass("warning-input");
	}
	
	if (!fileData){
		$("#upload-button").addClass("warning-input");
		allowToPost = false;
	}

	if (!allowToPost){
		return false;
	}

    formdata = new FormData();

    if (formdata) {
        formdata.append("responsible_person_first_name", $("#responsible_person_first_name").val());
        formdata.append("responsible_person_last_name", $("#responsible_person_last_name").val());
        formdata.append("automatic_transfers", $("#automatic_transfers").val());
        formdata.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
    }

    $.ajax({
        url: "",
        type: "POST",
        data: formdata,
        processData: false,
        contentType: false,
        dataType: "JSON",
        success: function (msg) {
            try{
                if(msg.status == -1){
                    window.location = loginPageLink;
                }
            }
            catch(err){
            }
        	window.location.reload(true);
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });

    return false;
}

function postBankAccount(){

    if (postButtonDisabled){
        return false
    }

	var allowToPost = 1;
	
	if($("input[name='iban']").val().length == 0){
		$("input[name='iban']").addClass("warning-input");
		$("#modal-add-bank-error-text").html("Please fill your bank iban");
		allowToPost = 0;
	}
	else{
		if (!IBAN.isValid($("input[name='iban']").val())){
			$("input[name='iban']").addClass("warning-input");
			$("#modal-add-bank-error-text").html("Specified bank account is not valid.");
			allowToPost = 0;
		}
		else{
			$("input[name='iban']").removeClass("warning-input");
			$("#modal-add-bank-error-text").html("");
		}
	}

	if (allowToPost == 0){
      return false;
    }
    else{
        var buttonHTML = $("#modal-add-bank-button").html();
        $("#modal-add-bank-button").html("<span class='icon-spin5 animate-spin' style='line-height:14px'></span>");
        postButtonDisabled = true;
    }

	$.post(
        '', 
        $('#modal-add-bank-form').serializeArray()
    ).done(function(data) {
        data = JSON.parse(data);

        $("#bank-account-placeholder").hide();
        $("#bank-account-view").show();
        $("#add-bank-account-button").hide();
        $('#modal-add-bank').bPopup().close();

        bankAccountTemplate = 
        "<div class='input-dummy-bg move-left margin-top-10 margin-bottom-10 bank-account-row' data-id='"+data.id+"'>"
            +"<input id='radio-1' class='radio-custom' name='radio-group' type='radio' checked>"
            +"<label for='radio-1' class='radio-custom-label'></label>"

              +"<span class='text-medium'>&nbsp;&nbsp;&nbsp;"+$("input[name='iban']").val()+"<!-- / --> </span> <!-- Swedbank -->" 

              +"<div class='delete-withdrawal-method'>"
                +"<div class='margin-reset icon-cross text-gray-60 align-center delete-bank-account' style='display:none'></div>"
              +"</div>"
       
              +"<span class='move-right bank-button align-center text-medium text-12 margin-bottom-5' onclick=\"$('#modal-verify-bank').bPopup()\">"+strVerify+"</span>"
        +"</div>";

        console.log(bankAccountTemplate);
        $("#bank-account-header").after(bankAccountTemplate);

        updateWithdrawalMethodRows();

        $("#modal-add-bank-button").html(buttonHTML);
        postButtonDisabled = false;

    }).fail(function() {
        
    });

    return false;
}


