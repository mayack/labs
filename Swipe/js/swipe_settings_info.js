var imageData = false;
var postButtonDisabled = false;
var isAnyDropDownOpened = false;

var defaultCompanyName,
	defaultCategory,
	defaultSubCategory,
	defaultStreet,
	defaultPhone,
	defaultLanguage,
	defaultCountry;


$( window ).load(function() {
	defaultCompanyName = $("input[name='company_name']").val();
	defaultCategory = $("#category").val();
	defaultSubCategory = $("#subcategory").val();
	defaultStreet = $("input[name='legal_address']").val();
	defaultPhone = $("input[name='phone']").val();
	defaultLanguage = $("#language").val();
	defaultCountry = $("#country").val();
});

function checkChanges(){

	var allowToEnableButton = false, i = 1;

	if (defaultCompanyName != $("input[name='company_name']").val()){
		allowToEnableButton = true;
	}

	if (defaultCategory != $("#category").val()){
		allowToEnableButton = true;
	}

	if (defaultSubCategory != $("#subcategory").val()){
		allowToEnableButton = true;
	}

	if (defaultStreet != $("input[name='legal_address']").val()){
		allowToEnableButton = true;
	}

	if (defaultPhone != $("input[name='phone']").val()){
		allowToEnableButton = true;
	}

	if (defaultLanguage != $("#language").val()){
		allowToEnableButton = true;
	}

	if (defaultCountry != $("#country").val()){
		allowToEnableButton = true;
	}

	if (allowToEnableButton){
		$("#submit-button").prop('disabled', false);
	}
	else{
		$("#submit-button").prop('disabled', true);
	}
	
}

$(function(){

	$(document).click(function (event)  {
    
		// Need for onblur hide!
	    ele=$('#m_category').find('.ms-drop');
	    ele_flag=$('#m_category').find('.ms-choice');
	    dv=ele.css("display");
	    if (dv=='block') {
	      ele.css("display","none");
	      ele_flag.trigger('click');
	    } 

	    ele=$('#m_subcategory').find('.ms-drop');
	    ele_flag=$('#m_subcategory').find('.ms-choice');
	    dv=ele.css("display");
	    if (dv=='block') {
	      ele.css("display","none");
	      ele_flag.trigger('click');
	    }

	    ele=$('#m_language').find('.ms-drop');
	    ele_flag=$('#m_language').find('.ms-choice');
	    dv=ele.css("display");
	    if (dv=='block') {
	      ele.css("display","none");
	      isAnyDropDownOpened = false;
	      ele_flag.trigger('click');
	    }

	    ele=$('#m_country').find('.ms-drop');
	    ele_flag=$('#m_country').find('.ms-choice');
	    dv=ele.css("display");
	    if (dv=='block') {
	      	ele.css("display","none");
	      	ele_flag.trigger('click');
	    }                 
	});

	$('#m_category, #m_subcategory, #m_language, #m_country').unbind('click').click(function(event){
		var dv=$(this).find('.ms-drop').css("display");
		if (dv=='block') {
			event.stopPropagation();
			isAnyDropDownOpened = true;	
		}
									
	});

	$('#upload-button, #change-img').click(function(e) {
    	e.preventDefault();
    	$('#input-logo').trigger('click');   
	});

	$('#delete-img').unbind('click').click(function(e) {
    	
        $("#upload-button").html("<span class='icon-upload'></span>&nbsp;"+strUploadLogo);  
        updateFileChange();

        formdata = new FormData();

        if (formdata) {
            formdata.append("custom_action", 'logo_delete');
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
            	imageData = false;
    			$("#img-logo").val('');
    			$("#upload-button").show();
        		$(".upload-image-container").hide();
            },
            error: function(xhr, ajaxOptions, thrownError) {

            }
	    });
	});

	$('#input-logo').unbind('change').on('change', function(evt){
                  
       	var file = evt.target.files[0];

       	if (!file){
       		return false;
       	}

       	if (file.size > maxFileSize){
       		$("#modal-file-size-error").bPopup()
       		return false;
       	}

		$("#img-logo").hide();
		$("#change-image-spinner").show();

		console.log(file)
    
       	if(file.type.match('image.*')){

        imageData = file;
       
        var reader = new FileReader();
        reader.onload = (function(file){
                        
            return function(e){
            
                var image = new Image();
                image.src = e.target.result;
                image.onload = function() {
                    // Access image size here
                    var imageWidth = this.width;
                    var imageHeight = this.height;

                    $("#upload-button").html("<span id='test' class='icon-spin5 animate-spin' style='line-height:12px'></span>&nbsp;" + strLoading + "&#8230;");

                    formdata = new FormData();

                    if (formdata) {
                        formdata.append("logo", imageData);
                        formdata.append("custom_action", 'logo');
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
			            	document.getElementById('img-logo').src= e.target.result;
                    		$("#upload-button").hide();
                    		$(".upload-image-container").show();
                    		$("#change-image-spinner").hide();
                    		$("#img-logo").show()
			            },
			            error: function(xhr, ajaxOptions, thrownError) {

			            }
				    });                       
                };
            }
            })(file);
       }
       reader.readAsDataURL(file);
    });

	updateFileChange();
});

function postEmailChange(){

	if (postButtonDisabled){
		return false
	}

	var allowToPost = 1;

	if ($("#change-email-new-email").val().length == 0){
		$("#change-email-new-email").addClass("warning-input");
		$("#modal-change-email-error-email").html(strFillEmail);
		allowToPost = 0;
	}
	else{
		isValidEamil = validateEmail($("#change-email-new-email").val());
      	if (isValidEamil == false) {
      		$("#change-email-new-email").addClass("warning-input");
      		$("#modal-change-email-error-email").html(strInvalidEmail);
      	}
  		else{
  			$("#change-email-new-email").removeClass("warning-input");
  		}
	}

	if ($("#change-email-password").val().length == 0){
		$("#change-email-password").addClass("warning-input");
		$("#modal-change-email-error-password").html(strFillPassword);
		allowToPost = 0;
	}
	else{
		$("#change-email-password").removeClass("warning-input");
		$("#modal-change-email-error-password").html("")
	}

	if (allowToPost == 0){
      return false;
    }
    else{
    	var buttonHTML = $("#modal-change-email-button").html();
        $("#modal-change-email-button").html("<span class='icon-spin5 animate-spin' style='line-height:14px'></span>");
        postButtonDisabled = true;
    }

	$.post(
        '', 
        $('#modal-change-email-form').serializeArray()
    ).done(function(data) {
    	console.log(data)
        data = JSON.parse(data);
        
        try{
        	if (data.errors.email){
        		$("#change-email-new-email").addClass("warning-input");
        		$("#modal-change-email-error-email").html(data.errors.email[0]);
        	}
        }
        catch(err){

        }

        try{
        	if (data.errors.password){
        		$("#change-email-password").addClass("warning-input");
        		$("#modal-change-email-error-password").html(data.errors.password[0]);
        	}
        }
        catch(err){

        }

        try{
        	if (data.status == 1){
        		$('#modal-change-email').bPopup().close();
        		$(".fixed-success-message-text").html(strInstructionsSent + " " + $("#merchant-email").val());
        		$(".fixed-success-message").show();
        	}
        }
        catch(err){

        }
        $("#modal-change-email-button").html(buttonHTML);
        postButtonDisabled = false;
        
    }).fail(function() {
    	console.log("fail")
    	$("#modal-change-email-button").html(buttonHTML);
        postButtonDisabled = false;
        // $input.parent().addClass('error')
    });

    return false;
}

function postPasswordChange(){

	if (postButtonDisabled){
		return false
	}

	var allowToPost = 1;

	if ($("#change-password-new-password").val().length == 0){
		$("#change-password-new-password").addClass("warning-input");
		$("#modal-change-password-error-new-password-1").html(strFillNewPassword);
		allowToPost = 0;
	}
	else{
		if ($("#change-password-new-password").val().length < 6){
			$("#change-password-new-password").addClass("warning-input");
			$("#modal-change-password-error-new-password-1").html(strNewPasswordLength);
			allowToPost = 0;
		}
		else{
			$("#change-password-new-password").removeClass("warning-input");
			$("#modal-change-password-error-new-password-1").html("");
		}
	}

	if ($("#change-password-verify-password").val().length == 0){
		$("#change-password-verify-password").addClass("warning-input");
		$("#modal-change-password-error-new-password-2").html(strRepeatNewPassword);
		allowToPost = 0;
	}
	else{
		if ($("#change-password-verify-password").val().length < 6){
			$("#change-password-verify-password").addClass("warning-input");
			$("#modal-change-password-error-new-password-2").html(strNewPasswordLength);
			allowToPost = 0;
		}
		else{
			if ($("#change-password-verify-password").val() != $("#change-password-new-password").val()){
				$("#change-password-verify-password").addClass("warning-input");
				$("#modal-change-password-error-new-password-2").html(strPasswordsNotMatch);
				allowToPost = 0;
			}
			else{
				$("#modal-change-password-error-new-password-2").html("");
				$("#change-password-verify-password").removeClass("warning-input");
			}
		}
	}

	if ($("#change-password-current-password").val().length == 0){
		$("#change-password-current-password").addClass("warning-input");
		$("#modal-change-password-error-current-password").html(strFillCurrentPassword);
		allowToPost = 0;
	}
	else{
		if ($("#change-password-current-password").val().length < 6){
			$("#change-password-current-password").addClass("warning-input");
			$("#modal-change-password-error-current-password").html(strCurrentPasswordLength);
			allowToPost = 0;
		}
		else{
			$("#modal-change-password-error-current-password").html("");
			$("#change-password-current-password").removeClass("warning-input");
		}
	}

	if (allowToPost == 0){
      return false;
    }
    else{
    	var buttonHTML = $("#modal-change-password-button").html();
        $("#modal-change-password-button").html("<span class='icon-spin5 animate-spin' style='line-height:14px'></span>");
        postButtonDisabled = true;
    }

	$.post(
        '', 
        $('#modal-change-password-form').serializeArray()
    ).done(function(data) {
        console.log(data);
        data = JSON.parse(data);
        try{
        	if (data.errors.password){
        		$("#change-password-current-password").addClass("warning-input");
        		$("#modal-change-password-error-current-password").html(data.errors.password[0]);
        	}
        }
        catch(err){
        }

        try{
        	if (data.status == 1){
        		$('#modal-change-password').bPopup().close();
        		$(".fixed-success-message-text").html(strPasswordChanged);
        		$(".fixed-success-message").show();
        	}
        }
        catch(err){
        }

        $("#modal-change-password-button").html(buttonHTML);
        postButtonDisabled = false;
        
    }).fail(function() {
        // $input.parent().addClass('error')
        $("#modal-change-password-button").html(buttonHTML);
        postButtonDisabled = false;
    });

    return false;
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function updateFileChange(){

	$('#input-logo').unbind('change').on('change', function(evt){
                   
       	var file = evt.target.files[0];

       	if (!file){
       		return false;
       	}

       	if (file.size > maxFileSize){
       		$("#modal-file-size-error").bPopup()
       		return false;
       	}

		$("#img-logo").hide();
		$("#change-image-spinner").show();
    
       	if(file.type.match('image.*')){

        imageData = file;
       
        var reader = new FileReader();
        reader.onload = (function(file){
                        
            return function(e){
            
                var image = new Image();
                image.src = e.target.result;
                image.onload = function() {
                    // Access image size here
                    var imageWidth = this.width;
                    var imageHeight = this.height;

                    $("#upload-button").html("<span id='test' class='icon-spin5 animate-spin' style='line-height:12px'></span>&nbsp;" + strUploading + "&#8230;");

                    formdata = new FormData();

                    if (formdata) {
                        formdata.append("logo", imageData);
                        formdata.append("custom_action", 'logo');
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
			            	document.getElementById('img-logo').src= e.target.result;
                    		$("#upload-button").hide();
                    		$(".upload-image-container").show();
                    		$("#change-image-spinner").hide();
                    		$("#img-logo").show();
			            },
			            error: function(xhr, ajaxOptions, thrownError) {

			            }
				    });                       
                };
            }
            })(file);
       }
       reader.readAsDataURL(file);
    });
}