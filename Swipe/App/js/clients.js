var nextPageNr = 1;
var blockPageLoading = false;
var blockSearchPageLoading = false;
var searchValue = "";
var newSearchValue = "";
var searchValueChanged = false;
var searchDelay = 200;
var footerHeight = 180;
var maxAllowedBottomSpaceBeforeNewPageLoad = 150 + footerHeight;
var allowToEdit = true;
var allowToPost = true;
var clientViewExpanding = false;

$(function(){

    csrftoken = $('#csrf_container > input[name="csrfmiddlewaretoken"]').val();

    $('*[data-invoice-id]').click(function(event) {
      previewInvoice($(this).data('invoiceId'));
      event.stopPropagation();
    });
    
    var window_height = $(window).height();
    var document_height = $(document).height();
    var scrollTop = $(window).scrollTop();

    if (document.body.innerHTML.indexOf("no-clients") != -1){
      $(".clients-placeholder").show();
    } 

    if ($("#search").val().length > 0){
       postSearch();
    } 

    if ((document_height == window_height) || ((document_height - window_height) < maxAllowedBottomSpaceBeforeNewPageLoad && scrollTop == 0)){
        blockPageLoading = true;
        if (document.body.innerHTML.indexOf("last_page") == -1){
            $(".spinner").show();
            getNewClientsPage(nextPageNr, searchValue);
        }
    }

    $( "#modal-delete-client-submit" ).unbind('click').click(function(e) {
        postClients(true);
    });

    updateClientRowExpandViewButtons();
});

function updateClientRowExpandViewButtons(){

    $( ".icon-arrow-east" ).unbind('click').click(function(e) {
        if (clientViewExpanding){
          return false;
        }
        clientViewExpanding = true;
        event.stopPropagation();
        
        if($(this).hasClass('icon-arrow-east') && !$(this).hasClass('icon-arrow-south')){
            $(this).closest('div.box.padding-reset').css("overflow", 'hidden');
        }
        else{
            $(this).closest('div.box.padding-reset').css('overflow', 'visible');
        }

        $(this).toggleClass('icon-arrow-south');
        $(this).toggleClass('icon-arrow-east');

        if(!$(this).hasClass('icon-arrow-south')){
            $(this).closest('div.box.padding-reset').css("overflow", 'hidden');
        }

        $(this).closest('div.box.padding-reset').children('hr, div.section-reset').slideToggle(500, function(){
            if(!$(this).hasClass('icon-arrow-east')){
              $(this).closest('div.box.padding-reset').css('overflow', 'visible');
            }
            clientViewExpanding = false;
        });

    });

    $( ".client-box-row" ).unbind('click').click(function(e) {
        event.stopPropagation();
        if($(this).find(".icon-arrow-east").length != 0){
          $(this).find(".icon-arrow-east").click();
        }
        else{
          $(this).find(".icon-arrow-south").click();
        }
    });

    $( ".status-tooltip" ).unbind('mouseenter').mouseenter(function(e) {

      e.stopPropagation();
      e.preventDefault();

      invoiceID = $(this).parent().parent().data("invoice-id");
      
      if ($("input[name='rolling-date-"+invoiceID+"']").val().length == 0){
        $(".rolling").hide();
      }
      else{
        $("#rolling-date").html($("input[name='rolling-date-"+invoiceID+"']").val());
        $("#rolling-days-left").html($("input[name='rolling-left-days-"+invoiceID+"']").val());
        $("#rolling-value").html($("input[name='rolling-value-"+invoiceID+"']").val());
        $(".rolling").show();
      }
      
      $("#main-date").html($("input[name='main-date-"+invoiceID+"']").val());
      $("#main-invoice").html($("input[name='main-invoice-"+invoiceID+"']").val());
      $("#main-value").html($("input[name='main-value-"+invoiceID+"']").val());

      if ($("input[name='swipe-fee-"+invoiceID+"']").val().length != 0){
        $("#swipe-fee").html($("input[name='swipe-fee-"+invoiceID+"']").val());
        $(".swipe-fee").show();
      }
      else{
        $(".swipe-fee").hide();
      }

      var tooltipWidth = $(".payment-tooltip").width();
      var tooltipPadding = $(".payment-tooltip").css('padding');
      var elementWidth = $(e.target).width();
      $(".payment-tooltip").css("left", ($(this).offset().left - tooltipWidth/2 - tooltipPadding.split('px')[0] + elementWidth/2) + 'px');
      $(".payment-tooltip").css("top", ($(this).offset().top + 30) + 'px');

      $(".payment-tooltip").show();
    });

    $( ".status-tooltip" ).unbind('mouseleave ').mouseleave(function(e) {
      $(".payment-tooltip").hide();
    });

    $('.icon-help').on('mouseover', function(e) { 
      $(this).parent().trigger('mouseenter');
      return false; 
    });

}

function scroolDetected(){

    var window_height = $(window).height();
    var document_height = $(document).height();
    var scrollTop = $(window).scrollTop();
   
    if ((document_height - scrollTop - window_height) < maxAllowedBottomSpaceBeforeNewPageLoad && blockPageLoading == false){
        blockPageLoading = true;
        if (document.body.innerHTML.indexOf("last_page") == -1){
            $(".spinner").show();
            getNewClientsPage(nextPageNr, searchValue);
        }
    }
}

$(window).scroll(function() {
    scroolDetected();
});

$(window).resize(function() {
    scroolDetected();
});

$(window).load(function() {
    scroolDetected();
});

function postSearch() {

    searchValue = $("#search").val();

    if (searchValue != newSearchValue){
      searchValueChanged = true;
    }
    
    if (!blockSearchPageLoading){
      blockSearchPageLoading = true;
      $("span.search-button").show();
      setTimeout(function() {
        nextPageNr = 1;
        getNewClientsPage(0, searchValue)
      }, searchDelay); 
    }
}

function showModal(id) {

    event.stopPropagation();

    if (!allowToEdit){
      return;
    }

    $.ajax({
      type: 'GET',
      url: showModalPostLink + (!!id ? id + '/' : ''),
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

        $('#modal-add-client').html(data);
        $('#modal-add-client').bPopup();
        initializeGoogleMapApi();
      }
    });
}

function getNewClientsPage(pageNr, search) {

  newSearchValue = search;

  setTimeout(function() {
    $.ajax({
        type: 'GET',
        url: getClientsPageLink + "?page=" + pageNr + "&search_query=" + search,
        data: '',
        dataType: 'html',
        error: function(xhr, ajaxOptions, thrownError) {
          alert(strServerError);
          allowToEdit = true;
          allowToPost = true;
        },
        success: function(data) {
          try{
            if($.parseJSON(data).status == -1){
              window.location = loginPageLink;
            }
          }
          catch(err){
          }
      
          if (pageNr == 0){
            $( ".clients-page" ).remove();
            $(".last_page").remove();
            $(".payment-tooltip").remove();
            $(data).insertAfter(".hr-client-top:last");
            updateClientRowExpandViewButtons();
            updateClientTooltip();
            allowToEdit = true;
            allowToPost = true;
            
            if (data.indexOf("last_page") != -1 || data.trim() == ""){
              blockPageLoading = true;
            }
            else{
              blockPageLoading = false;
            }
            if (searchValueChanged && (newSearchValue != searchValue)){
              blockSearchPageLoading = false;
              searchValueChanged = false;
              $("span.search-button").show();
              getNewClientsPage(pageNr, searchValue);
            }
            else{
              blockSearchPageLoading = false;
              $("span.search-button").hide();
              scroolDetected();
            }

            if (data.trim().length > 0){
              $(".clients-placeholder").hide();
              $(".clients-no-search-placeholder").hide();
              $("#top-section").show();
            }
            else{
              if (search.length == ""){
                $(".clients-placeholder").show();
                $("#top-section").hide();
                $(".clients-no-search-placeholder").hide();
              }
              else{
                $(".clients-placeholder").hide();
                $("#top-section").show();
                $(".clients-no-search-placeholder").show();
              }
              
            }
            
            return true;
          }

          if (data.trim() == ""){
            blockPageLoading = true;
            $(".spinner").hide();
          }
          else{
            // $(data).insertAfter(".hr-client:last");
            $(data).insertAfter("#page-end-for-content");
            updateClientRowExpandViewButtons();
            updateClientTooltip();
            nextPageNr = nextPageNr + 1;
            if (data.indexOf("last_page") != -1){
              blockPageLoading = true;
            }
            else{
              blockPageLoading = false;
            }
            $(".spinner").hide();
          }
        }
    });
  }, 100);
  
}

function removeWarning(element){
  $(element).removeClass("warning-input");
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function deleteClientModal(){
  $("#modal-delete-client").bPopup();
  $('#modal-add-client').bPopup().close();
} 

function postClients(deleteObject) {

    if (!allowToPost){
      return;
    }

    var email, phone, allowToContinue, isValidEamil;

    if (!deleteObject){
      email = $("input[name=email]").val();
      phone = $("input[name=phone]").val();

      allowToContinue = true;

      if (email.length == 0 && phone.length == 0){
        $("input[name=email]").addClass("warning-input");
        allowToContinue = false;
      }

      if (email.length > 0){
        isValidEamil = validateEmail(email);
        if (isValidEamil == false) {
          $("input[name=email]").addClass("warning-input");
          allowToContinue = false;
        }
      }
      
      if (!allowToContinue){
        return;
      }
    }
    else{
      allowToEdit = false;
    }

    allowToPost = false;
   
    $.ajax({
      url: postClientsLink,
      type: "POST",
      data: $('#modal-add-client form').serialize() + (!!deleteObject ? '&delete=true' : ''),
      dataType: "JSON",
      success: function (msg) {
        try{
          if(msg.status == -1){
            window.location = loginPageLink;
          }
        }
        catch(err){
        }
        nextPageNr = 1;
        getNewClientsPage(0, searchValue);
        if (deleteObject){
          $("#modal-delete-client").bPopup().close();
        }
        else{
          $('#modal-add-client').bPopup().close();
        }
        
        allowToPost = true;
      },
      error: function(xhr, ajaxOptions, thrownError) {
        allowToEdit = true;
        allowToPost = true;
      },
    });

    return false;
};

function previewInvoice(id) {
    $.ajax({
        url: previewInvoiceLink.replace('/0/', '/' + id + '/'),
        type: 'GET',
        data: '',
        dataType: 'html',
        success: function (data) {
          try{
            if($.parseJSON(data).status == -1){
              window.location = loginPageLink;
            }
          }
          catch(err){
          }
          $('#modal-container').html(data);
          $('#modal-container > div').bPopup();            
        }
    });

    return false;
}

function deleteInvoice(id) {
    if(!confirm(strDeleteInvoiceDraft))
      return false;

    $.ajax({
        url: saveInvoiceLink,
        type: 'POST',
        data: 'delete=true&invoice_id=' + id,
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        success: function (msg) {
          try{
            if(msg.status == -1){
              window.location = loginPageLink;
            }
          }
          catch(err){
          }
          if(msg.status == 1)
            window.location.reload();        
        }
    });

    return false;
}