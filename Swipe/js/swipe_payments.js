var pageNr = 0;
var category;
var resendSubmitHTML;
var resendInvoiceID, allowToResendInvoice = true;
var deleteInvoiceID, allowToDeleteInvoice = true;
var cancelInvoiceID, allowToCancelInvoice = true;
var duplicateInvoiceID, allowToDuplicateInvoice = true;

var footerHeight = 180;
var maxAllowedBottomSpaceBeforeNewPageLoad = 150 + footerHeight;
var blockPageLoading = false;

$(window).load(function() {
	$(".section-invoice").show()
  	if($.cookie('allowAnimatePayments') == "1"){
  		$(".section-invoice").find(".box:first-child").fadeTo(1700, 1, function() {
    		//$(".section-invoice").find(".box:first-child").removeClass("swatchAquaDarken-border", 1000);
  		});
  		$.cookie('allowAnimatePayments', "0", { expires: 1, path: '/' });
  	}
});

$(window).scroll(function() {
    scroolDetected();
});

$(window).resize(function() {
  	scroolDetected();
});

$(function(){

	if($.cookie('allowAnimatePayments') == "1"){
		$(".section-invoice").find(".box:first-child").fadeTo(0, 0);
		//$(".section-invoice").find(".box:first-child").addClass("swatchAquaDarken-border");
	}
	$(".pills a").click(function() {
		
  		$(".pills a").removeClass("active");
  		$(this).addClass("active");

  		category = $(this).data("name");
  		pageNr = 0;
  		blockPageLoading = false;
  		$(".last_page").remove();

  		if (category == "all"){
  			window.location.reload(true);
  			return false;
  		}
  		getNewInvoicePage();
	});

	$( "#modal-resend-payment-submit" ).click(function() {
  		resendInvoice(resendInvoiceID);
	});

	$( "#modal-cancel-payment-submit" ).click(function() {
  		cancelInvoice(cancelInvoiceID);
	});

	$( "#modal-delete-payment-submit" ).click(function() {
  		deleteInvoice(deleteInvoiceID);
	});

	$( "#modal-expired-payment-submit" ).click(function() {
  		duplicateInvoice(duplicateInvoiceID);
	});

	updateTooltipMouseEvents();
	updateInvoiceFunctions();
});

function getNewInvoicePage(){
	$.ajax({
        type: 'GET',
        url: getInvoicesLink + "?page=" + pageNr + "&search_category=" + category,
        data: '',
        dataType: 'html',
        error: function(xhr, ajaxOptions, thrownError) {
          alert(strServerError);
        },
        success: function(data) {
        	try{
      			if($.parseJSON(data).status == -1){
      				window.location = loginPageLink;
      			}
    		}
    		catch(err){
    		}

        	if (data.trim().length == 0){
        		$(".section-invoice").replaceWith("<section class='section-large wrapper section-invoice section-top-reset'></section>");
        	}
        	else{
        		if (pageNr > 0){
        			$(".spinner").before(data);
        			blockPageLoading = false;
        			$(".spinner").hide();
        		}
        		else{
        			$(".section-invoice").replaceWith(data);
        			scroolDetected();
        		}
				
        	}
      		
      		updateClientTooltip();
      		updateTooltipMouseEvents();
      		updateInvoiceFunctions();
        }
    });
}

function updateInvoiceFunctions(){

	$('*[data-invoice-search-term]').click(function(event) {
      window.location.href = clientsLink + "?search=" + $(this).html();
      event.stopPropagation();
    });

    $('*[data-invoice-id]').click(function(event) {
      console.log("ok");
      if($(this).data('editable') === true) {
        window.location.href = editInvoiceLink.replace('/0/', '/' + $(this).data('invoiceId') + '/');
      } else {
        previewInvoice($(this).data('invoiceId'));
      }
      event.stopPropagation();
    });

}

function updateTooltipMouseEvents(){
	$( ".payment-tooltip-link" ).mouseenter(function() {
		var paymentTooltopWidth = $('.payment-tooltip').width() + 40;
		$('.payment-tooltip').css("marginLeft", - paymentTooltopWidth/2 + $(this).width()/2 + "px")
  		$(this).parent().find('.payment-tooltip').show();
	});

	$( ".payment-tooltip-link" ).mouseleave(function(e) {
		$(this).parent().find('.payment-tooltip').hide();
	});
}

function openCancelModal(id){
	cancelInvoiceID = id;
	$("#modal-cancel-payment").bPopup();
}

function openDeleteModal(id){
	deleteInvoiceID = id;
	$("#modal-delete-payment").bPopup();	
}

function openResendModal(id){
	resendInvoiceID = id;
	$("#modal-resend-payment").bPopup();
}

function previewInvoice(id) {
	$.ajax({
	  	url: previewInvoiceLink.replace('/0/', '/' + id + '/'),
	  	type: 'GET',
	  	data: '',
	  	dataType: 'html',
	  	success: function (data) {
	    	$('#modal-container').html(data);
	    	$('#modal-container > div').bPopup();            
	  	}
	});

	return false;
}

function deleteInvoice(id) {

	if (!allowToDeleteInvoice){
		return false;
	}
	else{
		allowToDeleteInvoice = false;
		$("#modal-delete-payment-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
	}

	$.ajax({
	  	url: deleteInvoiceLink.replace('/0/', '/' + id + '/'),
	  	type: 'POST',
	  	data: '',
	  	headers: {'X-CSRFToken': csrftoken},
	  	dataType: 'json',
	  	success: function (msg) {
	    	if(msg.status == 1)
	      	window.location.reload();        
	  	},
	  	error: function(xhr, ajaxOptions, thrownError) {
	  		allowToDeleteInvoice = true;
		},
	});

	return false;
}

function cancelInvoice(id) {

	if (!allowToCancelInvoice){
		return false;
	}
	else{
		allowToCancelInvoice = false;
		$("#modal-cancel-payment-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
	}

	$.ajax({
	  	url: cancelInvoiceLink.replace('/0/', '/' + id + '/'),
	  	type: 'POST',
	  	data: '',
	  	headers: {'X-CSRFToken': csrftoken},
	  	dataType: 'json',
	  	success: function (msg) {
	    	if(msg.status == 1)
	      	window.location.reload();        
	  	},
	  	error: function(xhr, ajaxOptions, thrownError) {
	  		allowToCancelInvoice = true;
		},
	});

	return false;
}

function resendInvoice(id) {

	if (!allowToResendInvoice){
		return false;
	}
	else{
		allowToResendInvoice = false;
		resendSubmitHTML = $("#modal-resend-payment-submit").html();
		$("#modal-resend-payment-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
	}

	$.ajax({
		url: resendInvoiceLink.replace('/0/', '/' + id + '/'),
		type: 'POST',
		data: '',
		headers: {'X-CSRFToken': csrftoken},
		dataType: 'json',
		success: function (msg) {
			if(msg.status == 1) {
			  	window.location.reload();                      
			} else if(msg.status == 2) { // !!!
				$("#modal-resend-payment-submit").html(resendSubmitHTML);
				$("#modal-resend-payment").bPopup().close();
			  	$("#modal-expired-payment").bPopup();
			    duplicateInvoiceID = id;
			}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			allowToResendInvoice = true;
		},
	});

	return false;
}

function duplicateInvoice(id) {

	if (!allowToDuplicateInvoice){
		return false;
	}
	else{
		allowToDuplicateInvoice = false;
		$("#modal-expired-payment-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
	}
	
	window.location.href = editInvoiceLink.replace('/0/', '/' + id + '/') + '?duplicate=true';
}

function scroolDetected(){

    var window_height = $(window).height();
    var document_height = $(document).height();
    var scrollTop = $(window).scrollTop();

    if (category == "all" || !category){
  		return false;
  	}
   
    if ((document_height - scrollTop - window_height) < maxAllowedBottomSpaceBeforeNewPageLoad && blockPageLoading == false){
        blockPageLoading = true;
        if (document.body.innerHTML.indexOf("last_page") == -1){
            $(".spinner").show();
            pageNr += 1;
            getNewInvoicePage();
        }
    }
}