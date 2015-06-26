var postButtonDisabled = false;
var postActivationEmail;
var postActivationLink;

$( window ).load(function() {

	showWarning("#get-warning");
  $(".ms-drop input").hide();

  $("#main-section").show();

});

$(function(){

    try{
      initializeGoogleMapApi();
    }
    catch(err){
    }
    
    $('#language').change(function() {
        $(".ms-parent").removeClass("warning-input");
    });

    $('#login_category').change(function() {
      var cat_id = $(this).val(), str = '';

      for(key in subcategories_for_categories[cat_id]) {
        str += '<option value="' + subcategories_for_categories[cat_id][key]['id'] + '">' + subcategories_for_categories[cat_id][key]['name'] + '</option>';
      }

      $('#login_subcategory').html(str);
      $("#login_subcategory").prop('disabled', false);
      $('#m_login_category > button[type="button"]').removeClass('disabled');
      $('#login_subcategory').multipleSelect({
        single: true,
        placeholder: "Select subcategory",
      });
      $("#m_login_category").removeClass("warning-input");
      $(".ms-drop input").hide();
    });

    $('#login_subcategory').change(function() {
    	$('input[name="subcategory"]').val($(this).val());
      $(".subcategory").removeClass("warning-input");
  	});

    $('#country').change(function() {
      $("input[name='country']").val($(this).val());
      $(".country").removeClass("warning-input");
    });

    try {

      $('#language').multipleSelect({
        single: true,
        placeholder: strSelectLanguage,
      });

      $('#login_category').multipleSelect({
        single: true,
        placeholder: strSelectCategory,
      });	

      $('#login_subcategory').multipleSelect({
        single: true,
        placeholder: strSelectSubCategory,
      });

      $('#country').multipleSelect({
        single: true,
        placeholder: strSelectCountry,
      });
    }
    catch(err){
      
    }
    
	$(document).click(function (event)  {
    
		// Need for onblur hide!
    ele=$('#m_language').find('.ms-drop');
    ele_flag=$('#m_language').find('.ms-choice');
    dv=ele.css("display");
    if (dv=='block') {
      ele.css("display","none");
      ele_flag.trigger('click');
    }      

		// ele=$('#m_login_category').find('.ms-drop');
		// ele_flag=$('#m_login_category').find('.ms-choice');
		// dv=ele.css("display");
		// if (dv=='block') {
		// 	ele.css("display","none");
		// 	ele_flag.trigger('click');
		// }
		
		ele=$('.subcategory').find('.ms-drop');
		ele_flag=$('#m_login_subcategory').find('.ms-choice');
		dv=ele.css("display");
		if (dv=='block') {
			ele.css("display","none");
			ele_flag.trigger('click');
		}

    ele=$('.country').find('.ms-drop');
    ele_flag=$('.country').find('.ms-choice');
    dv=ele.css("display");
    if (dv=='block') {
      ele.css("display","none");
      ele_flag.trigger('click');
    }		

	});

	$('#m_language, #m_login_subcategory, #m_login_category, .country').unbind('click').click(function(event){
		var dv=$(this).find('.ms-drop').css("display");
		if (dv=='block') {
			event.stopPropagation();
		}								
	});

  $("#seller-agreement").click(function(e){
      if ($("input[name='seller_agreement']").val() == 0){
        $("input[name='seller_agreement']").val(1);
      } 
      else{
        $("input[name='seller_agreement']").val(0);
      }    
  });

});

function showWarning (id) {
	$(id).animate({
      top: 0,
      }, 300, function() {
      // Animation complete.
  });
}

function hideWarning (id) {
	$(id).animate({
      top: -80 + 'px',
        }, 300, function() {
      // Animation complete.
  });
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function checkForgotPasswordData() {

	var email = $("#email").val();

    var allowToSignup = 1;

    if (email.length == 0){
      $("#email").addClass("warning-input");
      allowToSignup = 0;
    }
    else{
      isValidEamil = validateEmail(email);
      if (isValidEamil == false) {
        allowToSignup = 0;
        $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strInvalidEmail+"</div><div class='align-center text-16 text-regular'>"+strCorrectEmail+"</div>")>
        $( ".warning" ).show();
        showWarning(".warning");
      }
      else{
      	$( "#email" ).removeClass("warning-input");
      }
    }

    if (allowToSignup == 1){
      return true;
    }
    else{
      return false;
    }

}

function checkLoginData() {

    var email = $("#email").val();
    var password = $("#password").val();

    var allowToSignup = 1;
    var canHideWarning = true;

    if (email.length == 0){
      allowToSignup = 0;
      $("#email").addClass("warning-input");
    }
    else{
      isValidEamil = validateEmail(email);
      if (isValidEamil == false) {
        allowToSignup = 0;
        $("#email").addClass("warning-input");
        $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strInvalidEmail+"</div><div class='align-center text-16 text-regular'>"+strCorrectEmail+"</div>")>
        $( ".warning" ).show();
        showWarning(".warning");
      }
      else{
        $("#email").removeClass("warning-input");
        canHideWarning = false;
      }
    }

    if (password.length == 0){
      allowToSignup = 0;
      $("#password").addClass("warning-input");
    }
    else{
      $("#password").removeClass("warning-input");
    }

    if (allowToSignup == 1){
      if (canHideWarning){
        hideWarning(".warning");
      }
      return true;
    }
    else{
      return false;
    }
}

function checkSignup2Data() {

	  var company_name = $("#company_name").val();
    var reg_nr = $("#registration_nr").val();
    var category = $("#login_category").val();
    var subcategory = $("#login_subcategory").val();
    var address = $("#legal_address").val();
    var phone = $("#phone").val();
    var legal_name = $("#legal_name").val();
    var country = $("#country").val();

    var allowToSignup = 1;
    var warningIsActive = false;
    var canHideWarning = true;

    if (company_name.length == 0){
      allowToSignup = 0;
      $( "#company_name" ).addClass("warning-input");
    }

    if (reg_nr.length == 0){
      allowToSignup = 0;
      $( "#registration_nr" ).addClass("warning-input");
    }
    else{
      if (reg_nr.length != 11){
        if (!warningIsActive){
          $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strRegNrIncorrect+"</div><div class='align-center text-16 text-regular'>"+strRegNrLength+"</div>")>
          $( ".warning" ).show();
          showWarning(".warning");
          warningIsActive = true;
          canHideWarning = false;
          allowToSignup = 0;
        }
      }
      else{
        $( "#registration_nr" ).removeClass("warning-input");
      }
    }

    if (!category){
      allowToSignup = 0;
      $("#m_login_category").addClass("warning-input");
    }
    else{
      if (!subcategory){
        allowToSignup = 0;
        $(".subcategory").addClass("warning-input");
      }
    }

    if (address.length == 0){
      allowToSignup = 0;
      $( "#legal_address" ).addClass("warning-input");
    }

    if (phone.length == 0){
      allowToSignup = 0;
      $( "#phone" ).addClass("warning-input");
    }

    if (legal_name.length == 0){
      allowToSignup = 0;
      $( "#legal_name" ).addClass("warning-input");
    }

    if (!country){
      allowToSignup = 0;
      $( "#m_country" ).addClass("warning-input");
    }

    if ($("input[name='seller_agreement']").val() == 0){
      canHideWarning = false;
    } 

    if (canHideWarning){
      hideWarning(".warning");
    }

    if (allowToSignup == 1){
      if ($("input[name='seller_agreement']").val() == 0){
          $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strAgreementNotAccepted+"</div><div class='align-center text-16 text-regular'>"+strNeedAgreementAccept+"</div>")>
          $( ".warning" ).show();
          showWarning(".warning");
          return false;
      }
      else{
          return true;
      }
    }
    else{
        return false;
    }
}

function checkSignupData() {

    var email = $("#email").val();
    var password = $("#password").val();
    var language = $("#language").val();

    var allowToSignup = 1;
    var warningIsActive = false;
    var canHideWarning = true;

    if (email.length == 0){
      allowToSignup = 0;
      $( "#email" ).addClass("warning-input");
    }
    else{
      isValidEamil = validateEmail(email);
      if (isValidEamil == false) {
        allowToSignup = 0;
        $( "#email" ).addClass("warning-input");
        if (!warningIsActive){
          $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strInvalidEmail+"</div><div class='align-center text-16 text-regular'>"+strCorrectEmail+"</div>")>
          $( ".warning" ).show();
          showWarning(".warning");
          warningIsActive = true;
          canHideWarning = false;
        }
      }
      else{
        $( "#email" ).removeClass("warning-input");
      }
    }

    if (password.length == 0){
      allowToSignup = 0;
      $( "#password" ).addClass("warning-input");
    }
    else{
      if (password.length < 6){
        $("#password").val('');
        if (!warningIsActive){
          $( "#password" ).addClass("warning-input");
          $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strShortPassword+"</div><div class='align-center text-16 text-regular'>"+strPasswordLength+"</div>")>
          $( ".warning" ).show();
          showWarning(".warning");
          warningIsActive = true;
          canHideWarning = false;
        }
      }
      else{
        $( "#password" ).removeClass("warning-input");
      }
    	
    }

    if (!language){
      allowToSignup = 0;
      $(".ms-parent").addClass("warning-input");
    }
    else{
      $(".ms-parent").removeClass("warning-input");
    }

    if (canHideWarning){
      hideWarning(".warning");
    }

    if (allowToSignup == 1){
      return true;
    }
    else{
      return false;
    }
}

function postSignup2Data() {

    status = checkSignup2Data();

    if (status === "false" || status === false){
      return false;
    }

    if (!postButtonDisabled){
        var buttonStartHTML = $("#button-start").html();
        $("#button-start").html("<span class='icon-spin5 animate-spin' style='line-height:18px'></span>");
        postButtonDisabled = true;
    }
    else{
        return false;
    }
    
    $.ajax({
      url: ".",
      type: "POST",
      data: $('#signup2Form').serialize(),
      dataType: "JSON",
      success: function (msg) {
        //console.log(JSON.stringify(msg));

        if (msg.status == "1"){
          window.location.href = nextLink;
        }
	      else{
	    	  try {
	            if (msg.errors.registration_nr){

	              	$( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+ msg.errors.registration_nr[0].split("<br>")[0] +"</div><div class='align-center text-16 text-regular'>&nbsp;&nbsp;&nbsp;"+ msg.errors.registration_nr[0].split("<br>")[1] +"</div>")>
	              	$( ".warning" ).show();
	              	showWarning(".warning");
	              	$( "#registration_nr" ).addClass("warning-input");
	            }
	            else{
	            	$( "#registration_nr" ).removeClass("warning-input");
	            }
	          }
	        catch(err) {
	        }
	      }

        $("#button-start").html(buttonStartHTML);
        postButtonDisabled = false;
      },
      error: function(xhr, ajaxOptions, thrownError) {
        $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strConnectionProblem+"</div><div class='align-center text-16 text-regular'>"+strCheckInternet+"</div>")>
        $( ".warning" ).show();
        showWarning(".warning");

        $("#button-start").html(buttonStartHTML);
        postButtonDisabled = false;
      },
    });

    return false;
}

function postSignupData() {

    status = checkSignupData();

    if (status === "false" || status === false){
      return false;
    }

    if (!postButtonDisabled){
        $("#button-sign-icon").addClass("icon-spin5 animate-spin");
        postButtonDisabled = true;
    }
    else{
        return false;
    }

    $.ajax({
		url: ".",
		type: "POST",
		data: $('#signupForm').serialize(),
		dataType: "JSON",
		success: function (msg) {
			console.log(JSON.stringify(msg));

			if (msg.status == "1"){
			  window.location.href = msg.url;
			}
			else{

			  try {
			    if (msg.errors.email){
			      $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strEmailTaken+"</div><div class='align-center text-16 text-regular'>&nbsp;&nbsp;&nbsp;<a href='" + loginLink + "'>"+strSignInWithAccount+"<span class='icon-arrow-small-east'></span></a></div>")>
			      $( ".warning" ).show();
			      $( "#email" ).addClass("warning-input");
			      showWarning(".warning");
			    }
			    else{
			    	$( "#email" ).removeClass("warning-input");
			    }

			    if (msg.errors.password){
			      	$( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strShortPassword+"</div><div class='align-center text-16 text-regular'>"+strPasswordLength+"</div>")>
			      	$( ".warning" ).show();
			      	showWarning(".warning");
			      	$( "#password" ).addClass("warning-input");
			    }
			    else{
			    	$( "#password" ).removeClass("warning-input");
			    }
			  }
			  catch(err) {
			  }

			}

      $("#button-sign-icon").removeClass("icon-spin5 animate-spin");
      postButtonDisabled = false;
		},

		error: function(xhr, ajaxOptions, thrownError) {
			$( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strConnectionProblem+"</div><div class='align-center text-16 text-regular'>"+strCheckInternet+"</div>")>
			$( ".warning" ).show();
			showWarning(".warning");

			$("#button-sign-icon").removeClass("icon-spin5 animate-spin");
      postButtonDisabled = false;
		},

    });

    return false;
}

function postLoginData() {

    status = checkLoginData();

    if (status === "false" || status === false){
      return false;
    }

    if (!postButtonDisabled){
        $("#button-sign-icon").addClass("icon-spin5 animate-spin");
        postButtonDisabled = true;
    }
    else{
        return false;
    }
    
    $.ajax({
      url: ".",
      type: "POST",
      data: $('#loginForm').serialize(),
      dataType: "JSON",
      success: function (msg) {
        console.log(JSON.stringify(msg));
        if (msg.status == "1"){
        	window.location.href = msg.url;
        }
        else{

        	try {
              if (msg.errors.__all__){
                if (msg.errors.__all__[0].split("<br>")[2]){

                  postActivationEmail = $("#email").val();
                  postActivationLink = msg.errors.__all__[0].split("<br>")[2]

                  $( "#warning-body" ).html("<div id='error-top-line-text' class='align-center text-16 text-regular'>"+msg.errors.__all__[0].split("<br>")[0]+"</div><div id='error-bottom-line-text' class='align-center text-16 text-regular'>&nbsp;&nbsp;&nbsp;<a href='javascript:void(0)' onclick='postEmailActivation()'>"+msg.errors.__all__[0].split("<br>")[1]+"<span id='email-activation-icon' class='icon-arrow-small-east'></span></a></div>");
                }
                else{
                  $( "#warning-body" ).html("<div class='align-center text-16 text-regular'>"+ msg.errors.__all__[0].split("<br>")[0] +"</div><div class='align-center text-16 text-regular'>"+ msg.errors.__all__[0].split("<br>")[1] +"</div>");
                }

                if (msg.errors.email){
                  $( ".warning-body" ).html("<div class='align-center text-16 text-regular'>"+strEmailNotExist+"</div><div class='align-center text-16 text-regular'>&nbsp;&nbsp;&nbsp;<a href='" + signupLink + "'>"+strSignUpWithAccount+"<span class='icon-arrow-small-east'></span></a></div>")>
                  $( ".warning" ).show();
                  $( "#email" ).addClass("warning-input");
                  showWarning(".warning");
                }
                else{
                  $( "#email" ).removeClass("warning-input");
                }
                      
                $( "#post-warning" ).show();
                hideWarning("#get-warning");
                showWarning("#post-warning");
                $("#password").val('');
              }
          }
          catch(err) {
          }
        }

        $("#button-sign-icon").removeClass("icon-spin5 animate-spin");
        postButtonDisabled = false;
      },
      error: function(xhr, ajaxOptions, thrownError) {
        $( "#warning-body" ).html("<div class='align-center text-16 text-regular'>"+strConnectionProblem+"</div><div class='align-center text-16 text-regular'>"+strCheckInternet+"</div>")>
        $( "#post-warning" ).show();
        hideWarning("#get-warning");
        showWarning("#post-warning");

        $("#button-sign-icon").removeClass("icon-spin5 animate-spin");
        postButtonDisabled = false;
      },

    });

    return false;
}

function postEmailActivation(){

    if (!postButtonDisabled){
        $("#email-activation-icon").replaceWith("&nbsp;<span id='email-activation-icon' class='icon-spin5 animate-spin' style='line-height:14px'></span>");
        postButtonDisabled = true;
    }
    else{
        return false;
    }

    formdata = new FormData();

    if (formdata) {
      formdata.append("email", postActivationEmail);
      formdata.append("csrfmiddlewaretoken", $("input[name='csrfmiddlewaretoken']").val());
    }

    $.ajax({
      url: postActivationLink,
      type: "POST",
      data: formdata,
      dataType: "JSON",
      processData: false,
      contentType: false,
      success: function (msg) {
        if(msg.status == "1"){
          $("#error-top-line-text").html(strEmailSend);
          $("#error-bottom-line-text").html(postActivationEmail);
        }
        else{
          hideWarning("#post-warning");
        }
        postButtonDisabled = false;
      },
      error: function(xhr, ajaxOptions, thrownError) {
        hideWarning("#post-warning");
        postButtonDisabled = false;
      },

    });

    return false;
}

function postPasswordRecoverData() {

    status = checkForgotPasswordData();

    if (status === "false" || status === false){
      return false;
    }

    if (!postButtonDisabled){
        $("#button-restore-icon").addClass("icon-spin5 animate-spin");
        postButtonDisabled = true;
    }
    else{
        return false;
    }
    
    $.ajax({
      url: ".",
      type: "POST",
      data: $('#passwordResetForm').serialize(),
      dataType: "JSON",
      success: function (msg) {
        //console.log(JSON.stringify(msg));

        if (msg.status == "1"){
          window.location.href = loginLink;
        }
        else{

          try {
            if (msg.errors.email){
              $( "#warning-body" ).html("<div class='align-center text-16 text-regular'>"+strEmailNotExist+"</div><div class='align-center text-16 text-regular'>"+strEnterCorrectEmail+"</div>")>
              $( "#post-warning" ).show();
              showWarning("#post-warning");
              $( "#email" ).addClass("warning-input");
            }
          }
          catch(err) {
          }
        }
        $("#button-restore-icon").removeClass("icon-spin5 animate-spin");
        postButtonDisabled = false;
      },
      error: function(xhr, ajaxOptions, thrownError) {
        $( "#warning-body" ).html("<div class='align-center text-16 text-regular'>"+strConnectionProblem+"</div><div class='align-center text-16 text-regular'>"+strCheckInternet+"</div>")>
        $( "#post-warning" ).show();
        showWarning("#post-warning");

        $("#button-restore-icon").removeClass("icon-spin5 animate-spin");
        postButtonDisabled = false;
      },

    });

    return false;
}

function showPassword(){
    var pass = document.getElementById('password');
    if(pass.type == "password"){
      pass.type = 'text';
      var psw_btn = document.getElementById('pswButton');
      $("#pswButton").html(strHide);
    }
    else{
      pass.type = 'password';
      var psw_btn = document.getElementById('pswButton');
      $("#pswButton").html(strShow);
    }
}


