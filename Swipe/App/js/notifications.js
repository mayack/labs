var postButtonDisabled = false;

$( window ).load(function() {

});

$(function(){

	if (!$.cookie('notificationType') || ($.cookie('notificationType') != $(".notification").attr("id"))){
		$(".notification").show();
	}

});

function setNotificationCookie(days){
	$(".notification").hide();
	$.cookie('notificationType', $(".notification").attr("id"), { expires: parseInt(days), path: '/' });
}

function postEmailActivation(){

	var slideUpTime = 500;
	var slideUpDelayTime = 2000;

    if (!postButtonDisabled){
    	var resendTextWidth = $("#email-activation-icon").width();
    	$("#email-activation-icon").width($("#email-activation-icon").width());
        $("#email-activation-icon").html("<div class='icon-spin5 animate-spin' style='display:inline-block;line-height:14px;height:auto;width="+resendTextWidth+"px'></div>");
        postButtonDisabled = true;
    }
    else{
        return false;
    }

    formdata = new FormData();

    if (formdata) {
      formdata.append("email", postActivationEmail);
      formdata.append("csrfmiddlewaretoken", csrftoken);
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
          	$("#email-activation-icon").removeClass("fill-peach");
    		    $("#email-activation-icon").addClass("fill-mint");
    		    $("#email-activation-icon").html("Email sent");
    		    $(".notification").delay(slideUpDelayTime).slideUp(slideUpTime);
        }
        else{
          	$(".notification").slideUp(slideUpTime);
        }
        postButtonDisabled = false;
      },
      error: function(xhr, ajaxOptions, thrownError) {
        $(".notification").slideUp(slideUpTime);
        postButtonDisabled = false;
      },

    });

    return false;
}