var datepickerIsActive = false;
var postButtonDisabled = false;
var deleteInvoiceID, allowToDeleteInvoice = true;
var currentSearchRowSelectNr = 0;
var maxSearchRows;
var lastActionBeforeConflict;

$( window ).load(function() {
  $("#on-load-spinner").hide();
  $("#on-load-section").show();
});

$(function(){
    $("#notes-textarea").elastic();

    $('#fee').multipleSelect({
        single: true
    });
    $('#curr').multipleSelect({
        single: true
    });
    $("#add_info").multipleSelect({
        selectAll: false
    });

    updateDescriptionEvents();

    //Custom Select (% or discount)
    $("#m_curr button").css("min-height", 38 + 'px');
    $("#m_curr").css("width", 62 + 'px');
    $("#m_curr").css("top", -2 + 'px');

    $(document).click(function ()  {
        var ele=$('#m_add_info').find('.ms-drop');
        var ele_flag=$('#m_add_info').find('.ms-choice');
        var dv=ele.css("display");
        if (dv=='block') {
            ele.css("display","none");
            ele_flag.trigger('click');
        }
        
        var ele=$('#m_fee').find('.ms-drop');
        var ele_flag=$('#m_fee').find('.ms-choice');
        var dv=ele.css("display");
        if (dv=='block') {
            ele.css("display","none");
            ele_flag.trigger('click');          
        }
        
        var ele=$('#m_curr').find('.ms-drop');
        var ele_flag=$('#m_curr').find('.ms-choice');
        var dv=ele.css("display");
        if (dv=='block') {
            ele.css("display","none");
            ele_flag.trigger('click');          
        }

        //Remove Pointer from Datepicker Year Block and Disable
        $( ".datepicker-switch" ).css("cursor", 'default');
        $( ".datepicker-switch" ).mousedown(function() {
            return false;
        });
        $(".datepicker-switch").click(function(e) {
            return false;
        });

    }); 
    
    $('#m_add_info, #m_fee, #m_curr').click(function(event){
        var dv=$(this).find('.ms-drop').css("display");
        if (dv=='block') {
            event.stopPropagation();
        }                               
    });

    $('.icon-calendar').unbind('mousedown').mousedown(function(event){
        if (datepickerIsActive){
            $('#due_date').blur();
            $('.datepicker').hide();
            datepickerIsActive = false;
        }
        else{
            $('.datepicker').show();
            $('#due_date').focus();
            //CreatePicker();
        }
        return false;
    });

    $( "input[name='client_email'], input[name='client_phone']" ).unbind('keyup').keyup(function(e){
        var searchType;

        if (e.target.name == "client_email"){
            searchType = "email";
        }
        else if (e.target.name == "client_phone"){
            searchType = "phone";
        }

        e = (e) ? e : window.event;
        var charCode = (e.which) ? e.which : e.charCode;
        
        if (charCode == 27){
            $('.invoice-client-tooltip').hide();
            currentSearchRowSelectNr = 0;
            return false;
        }
        
        if (charCode == 13 && currentSearchRowSelectNr != 0){
            $(".search-row-" + currentSearchRowSelectNr).click();
        }
        else{
            searchClients($(this).val(), searchType, charCode);
        }
        
    });

    $( "input[name='client_email'], input[name='client_phone']" ).focus(function() {
        $('.invoice-client-tooltip').hide();
        currentSearchRowSelectNr = 0;
    });

    $( "input[name='client_email'], input[name='client_phone']" ).blur(function(e){
        setTimeout(function(){ 
            $('.invoice-client-tooltip').hide();
        }, 200);
        currentSearchRowSelectNr = 0;
    });

    $( "input[name='discount_percent']" ).keyup(function(e){
        calculateTotalPrice();
    });

    $( "input[name='discount_percent']" ).keypress(function(e){
        $(this).removeClass("warning-input");

        var code = e.charCode || e.which;
        if (!checkIntegerInput(e)){
            return false;
        }
        
        if (code === 13)
            e.preventDefault();
    });

    $( "input[name='discount_percent']" ).change(function(e){
        calculateTotalPrice();
    });

    $( "input[name='discount_amount']" ).keyup(function(e){
        calculateTotalPrice();
        checkDecimal(e);
    });

    $( "input[name='discount_amount']" ).keypress(function(e){
        $(this).removeClass("warning-input");
        return checkPriceInput(event);
    });

    $( "input[name='discount_amount']" ).change(function(e){
        calculateTotalPrice();
    });

    $("input[name='number']").keypress(function(e){
        $(this).removeClass("warning-input");
    });

    $( "#modal-delete-invoice-submit" ).click(function() {
        deleteInvoice(deleteInvoiceID);
    });

    // datepicker
    CreatePicker();

});

function updateDescriptionEvents(){

    $('input[type="text"]').keypress(function (e) {
        var code = e.charCode || e.which;
        if (code === 13)
            e.preventDefault();
    });

    $(".description-price-input").unbind('keyup').keyup(function(e){
        $(this).removeClass("warning-input");
        calculateTotalPrice();
        var rowID = $(this).attr("name").split("-")[1]
        if (($(this).val() * $("input[name=form-"+rowID+"-quantity]").val()) != 0){
            var totalRowValue = round(($(this).val().replace(",", ".") * $("input[name=form-"+rowID+"-quantity]").val()), 2).toFixed(2);
            if (isNaN(totalRowValue)){
                $("#description-row-total-" + rowID).html("");
            }
            else{
                $("#description-row-total-" + rowID).html(replaceDecimalSeparator(truncString(totalRowValue)));
            }
        }
        else{
            $("#description-row-total-" + rowID).html("");
        }
        checkDecimal(e);
    });

    $(".description-price-input").unbind('keypress').keypress(function(e){
    
        var code = e.charCode || e.which;
        if (!checkPriceInput(e)){
            return false;
        }
        
        if (code === 13)
            e.preventDefault();
    });

    $(".description-price-input").unbind('change').change(function(e) {
        $(this).removeClass("warning-input");
        calculateTotalPrice();
        var rowID = $(this).attr("name").split("-")[1]
        if (($(this).val() * $("input[name=form-"+rowID+"-quantity]").val()) != 0){
            $("#description-row-total-" + rowID).html(replaceDecimalSeparator(truncString(round(($(this).val().replace(",", ".") * $("input[name=form-"+rowID+"-quantity]").val()), 2).toFixed(2))));
        }
        else{
            $("#description-row-total-" + rowID).html("");
        }
        
    });

    $('.description-quantity-input').unbind('keypress').keypress(function(e) {
        if (!isNumber(e)){
            return false;
        }
    });

    $(".description-quantity-input").unbind('keyup').keyup(function(e){
        $(this).removeClass("warning-input");
        calculateTotalPrice();
        var rowID = $(this).attr("name").split("-")[1]
        if (($(this).val() * $("input[name=form-"+rowID+"-price]").val()) != 0){
            $("#description-row-total-" + rowID).html(replaceDecimalSeparator(round(($(this).val() * $("input[name=form-"+rowID+"-price]").val()), 2).toFixed(2)));
        }
        else{
            $("#description-row-total-" + rowID).html("");
        }
        
    });

    $(".description-quantity-input").unbind('change').change(function(e) {
        $(this).removeClass("warning-input");
        calculateTotalPrice();
        var rowID = $(this).attr("name").split("-")[1]
        if (($(this).val() * $("input[name=form-"+rowID+"-price]").val()) != 0){
            $("#description-row-total-" + rowID).html(replaceDecimalSeparator(round(($(this).val() * $("input[name=form-"+rowID+"-price]").val()), 2).toFixed(2)));
        }
        else{
            $("#description-row-total-" + rowID).html("");
        }
    });

    $(".icon-delete-description-row").unbind('click').click(function(e) {

        var nr = $(this).data("id");
        
        var i=0;

        if (nr == 0){
            $("input[name='form-0-description']").val("");
            $("input[name='form-0-quantity']").val("");
            $("input[name='form-0-price']").val("");
            calculateTotalPrice();
            return false;
        }

        $("input[name=form-"+nr+"-DELETE]").val(true);
        $(e.target).parent().parent().hide(); 

        calculateTotalPrice();
    });

    $(".product-name-description-row").unbind('focus').focus(function() {
        $('.invoice-description-tooltip').hide();
        currentSearchRowSelectNr = 0;
    });

    $(".product-name-description-row").unbind('blur').blur(function(e){
        setTimeout(function(){ 
            $('.invoice-description-tooltip').hide();
        }, 200);
        currentSearchRowSelectNr = 0;
    });

    $(".product-name-description-row").unbind('keyup').keyup(function(e){

        e = (e) ? e : window.event;
        var charCode = (e.which) ? e.which : e.charCode;
        
        if (charCode == 27){
            $('.invoice-description-tooltip').hide();
            currentSearchRowSelectNr = 0;
            return false;
        }
        
        if (charCode == 13 && currentSearchRowSelectNr != 0){
            $(".search-row-" + currentSearchRowSelectNr).click();
            return false;
        }

        var nr = $(this).data("id");
        $(this).removeClass("warning-input");

        $.ajax({
            url: searchProductsLink,
            type: "GET",
            data: 'search_query=' + $(this).val(),
            dataType: "JSON",
            success: function (msg) {
                try{
                    if(msg.status == -1){
                        window.location = loginPageLink;
                    }
                }
                catch(err){
                }
                //console.log(JSON.stringify(msg));
                $("#invoice-description-tooltip-" + nr).html("");
                maxSearchRows = msg.products.length;
                for(var i = 0; i < msg.products.length; i++) {
                    $("#invoice-description-tooltip-" + nr).append("<div class='found-search-row text-14 search-row-"+(i+1)+"' onclick='showProductsData(this,"+nr+")'><div class='found-text text-gray-25'>" + msg.products[i].description + "</div><div class='found-info text-gray-60'>"+ currencySign + msg.products[i].price + "</div><input class='description-id' type='hidden' value='" + msg.products[i].id + "'><input class='description-name' type='hidden' value='" + msg.products[i].description + "'><input class='description-price' type='hidden' value='" + msg.products[i].price + "'></div>");
                }
                if (msg.products.length != 0){
                    $("#invoice-description-tooltip-" + nr).show();

                    if (charCode == 40){
                        currentSearchRowSelectNr += 1;
                        if (!$(".search-row-"+currentSearchRowSelectNr).length){
                            currentSearchRowSelectNr = 1;
                        }
                        $(".search-row-"+currentSearchRowSelectNr).addClass("found-search-row-hover");
                    }
                    else if (charCode == 38 && !currentSearchRowSelectNr == 0){
                        currentSearchRowSelectNr -= 1;
                        if (currentSearchRowSelectNr == 0){
                            currentSearchRowSelectNr = maxSearchRows;
                        }
                        $(".search-row-"+currentSearchRowSelectNr).addClass("found-search-row-hover");
                    }

                }
                else{
                    $("#invoice-description-tooltip-" + nr).hide();
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {

            }
        });

        return false;
    });
    
}

function showDatepickerDays() {
    $('.datepicker').css({'width':495});
    $('.datepicker-swipe').css({'border-left':'1px solid #f2f4f5'});
    $('.datepicker-days').show();
}

function hideDatepickerDays() {
    $('.datepicker-swipe').css({'border-left':'1px solid rgba(0, 0, 0, 0.2);'});
    $('.datepicker').css({'width':262});
    $('.datepicker-days').hide();
}

function ShowCalendar(a) {
    
    $('.radio-is-active').removeClass('radio-is-active');
    $(a).find('.radio').addClass('radio-is-active');
    //console.log($(a).prop('id'))
    if ($(a).prop('id')=='opt_6'){
        showDatepickerDays();
        $('#due_type').val('6');
        $(".datepicker").click();
        $(".datepicker-swipe").click();
    } else if ($(a).prop('id')=='opt_1')     {
        $('#due_date').val(window.strUponReceipt);
        $('#due_type').val('1');
        hideDatepickerDays();  
        $(".datepicker").hide();
        datepickerIsActive = false;      
    } else {
        var d=$(a).find('.radio-row-date').html();
        try{
            d=d.replace('(', '').replace(')', '');
            $(".datepicker").hide();
            datepickerIsActive = false;
        }
        catch(err){
        }
        
        $('#due_date').val(d);
        $('#due_type').val($(a).find('input[type="radio"]').val());
        hideDatepickerDays();
    }
}

var callendarOptionIsActive = false;

var picker;
function CreatePicker(skipEvents){
    
    picker = $('#due_date').datepicker({
        changeMonth: true,
        changeYear: false,
        orientation: 'right',
        startView: 'swipe', // swipe
        autoclose: true,
        todayHighlight: true,
        weekStart: 1,
        daysOfWeekDisabled: "0,6",
        forceParse: false,        
        format: dateFormat       
    });

    if(!skipEvents) {

        picker.on('show', function(e){
            $(".datepicker").show();
            $("#due_date").removeClass("warning-input");
            
            $("#opt_1").css("border-top", 0+'px');
            $(".option-set").css("border-radius", 5+'px');
            $(".option-set").css("overflow", 'hidden');
            
            datepickerIsActive = true;
        
            if (!callendarOptionIsActive && $('#due_type').val() != 6){ 
                callendarOptionIsActive = true;
                ShowCalendar("#opt_"+ $('#due_type').val());
            }

        });

        picker.on('hide', function(e){
            if (datepickerIsActive){
                datepickerIsActive = false;
                $('#due_date').datepicker('remove');
                CreatePicker();
                callendarOptionIsActive = false;
            }
            
        });
    }
}

function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.charCode;

    if (charCode < 48 || charCode > 57) {
        return false;
    }
    return true;
}

function setClientEditingStrategy(strategy){
    
    if (strategy == "update"){
        $("#modal-update-invoice-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
        $("input[name='client_editing_strategy']").val("edit_existing");
    }
    else if (strategy == 'ignore'){
        $("#modal-continue-invoice-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
        $("input[name='client_editing_strategy']").val("ignore");
    }
   
    postInvoice(lastActionBeforeConflict);
}

function postInvoice(action) {

    // sendInvoice
    // saveAndPreview
    // saveDraft

    var additionalData = '', subtotal = 0;

    var allowToPostInvoice = true;

    if ($("input[name=client_email]").val().length == 0 && $("input[name=client_phone]").val().length == 0){
        $("input[name=client_email]").addClass("warning-input");
        $("input[name=client_phone]").addClass("warning-input");
        allowToPostInvoice = false;
    }

    if ($("input[name=client_email]").val().length != 0){
        isValidEamil = validateEmail($("input[name=client_email]").val());
        if (isValidEamil == false) {
            $("input[name=client_email]").addClass("warning-input");
            allowToPostInvoice = false;
        }
    }

    for (i = 0; i <= currentDescriptionRow; i++) { 
        
        isRowDeleted = $("input[name=form-"+i+"-DELETE]").val();
        if (!isRowDeleted){
            subtotal += $("input[name=form-"+i+"-quantity]").val() * $("input[name=form-"+i+"-price]").val();
            if ($("input[name=form-"+i+"-description]").val().length == 0){
                $("input[name=form-"+i+"-description]").addClass("warning-input");
                allowToPostInvoice = false;
            }
            if ($("input[name=form-"+i+"-quantity]").val().length == 0){
                $("input[name=form-"+i+"-quantity]").addClass("warning-input");
                allowToPostInvoice = false;
            }
            if ($("input[name=form-"+i+"-price]").val().length == 0){
                $("input[name=form-"+i+"-price]").addClass("warning-input");
                allowToPostInvoice = false;
            }
        }
    }

    if ($("#due_date").val().length == 0){
        $("#due_date").addClass("warning-input");
        allowToPostInvoice = false;
    }

    if (!allowToPostInvoice){
        return false;
    }

    if (!$(".discount-type-change").val()){
        $("input[name=discount_amount]").val("0");
        $("input[name=discount_percent]").val("0");
    }
    
    additionalData += (action == "sendInvoice") ? '&send_invoice=true' : '';

    if (!postButtonDisabled){
        $("#button-send-icon").addClass("icon-spin5 animate-spin");
        postButtonDisabled = true;
    }
    else{
        return false;
    }

    $.ajax({
        url: postInvoiceLink,
        type: "POST",
        data: $('#invoiceForm').serialize() + additionalData,
        dataType: "JSON",
        success: function (msg) {
            $("#button-send-icon").removeClass("icon-spin5 animate-spin");
            console.log(JSON.stringify(msg));
            try{
                if(msg.status == -1){
                    window.location = loginPageLink;
                }
            }
            catch(err){
            }

            try{
              if(msg.status == 2 && (msg.email_conflict || msg.phone_conflict)){
                $("#modal-update-invoice-text").html(msg.error);
                $("#modal-update-invoice").bPopup();
                postButtonDisabled = false;
                lastActionBeforeConflict = action;
                return false;
              }
            }
            catch(err){
            }

            try{
              if(msg.errors.number){
                    $("input[name='number']").addClass("warning-input");
              }
            }
            catch(err){
            }

            try{
                if (msg.errors.discount_amount){
                    $("input[name='discount_percent']").addClass("warning-input");
                    $("input[name='discount_amount']").addClass("warning-input");
                }
            }
            catch(err){
            }

            try{
                if (msg.errors.due_date){
                    $("#due_date").addClass("warning-input");
                }
            }
            catch(err){
            }

            try{
                if(msg.status == 1 && msg.sent == false && msg.modal_to_show){
                    $("#" + msg.modal_to_show).bPopup();
                    return false;
                }
            }
            catch(err){
            }
          
            // save and preview - triggered on Preview button click above - 
            // first we try to save the object and and if everything is fine we redirect user to preview this newly created invoice
            if (!$("input[name='invoice_id']").val()){
                $.cookie('allowAnimatePayments', "1", { expires: 1, path: '/' });
            }

            if(action == "saveAndPreview" && msg.status == 1) {
                //Preview
                window.location.href = invoicePreviewLink.replace('/0/', '/' + msg.id + '/');
            } else if(action == "saveDraft" && msg.status == 1) {
                //Draft
                window.location.href = paymentsLink;
            } else if(action == "sendInvoice" && msg.status == 1) {
                //Send Payment
                window.location.href = paymentsLink;
                //window.location.href = invoiceEditLink.replace('/0/', '/' + msg.id + '/');
            }
            postButtonDisabled = false;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            $("#button-send-icon").removeClass("icon-spin5 animate-spin");
            postButtonDisabled = false;
        }
    });

    return false;
};

function searchClients(string, type, charCode) {

    $("input[name=client_email]").removeClass("warning-input");
    $("input[name=client_phone]").removeClass("warning-input");

    $.ajax({
        url: searchClientsLink,
        type: "GET",
        data: 'search_query=' + string,
        dataType: "JSON",
        success: function (msg) {
            try{
                if(msg.status == -1){
                    window.location = loginPageLink;
                }
            }
            catch(err){
            }   
            //console.log(JSON.stringify(msg));
            $("#"+ type +"-search-tooltip").html("")
            maxSearchRows = msg.clients.length;
            for(var i = 0; i < msg.clients.length; i++) {
                $("#"+ type +"-search-tooltip").append("<div class='found-search-row text-14 search-row-"+(i+1)+"' onclick='showClientData(this)'><div class='found-text text-gray-25'>" + msg.clients[i].__unicode__ + "</div><input class='client-email' type='hidden' value='" + msg.clients[i].email + "'><input class='client-phone' type='hidden' value='" + msg.clients[i].phone + "'><input class='client-id' type='hidden' value='" + msg.clients[i].id + "'></div>");
            }

            if (msg.clients.length != 0){
                $("#"+ type +"-search-tooltip").show();

                if (charCode == 40){
                    currentSearchRowSelectNr += 1;
                    if (!$(".search-row-"+currentSearchRowSelectNr).length){
                        currentSearchRowSelectNr = 1;
                    }
                    $(".search-row-"+currentSearchRowSelectNr).addClass("found-search-row-hover");
                }
                else if (charCode == 38 && !currentSearchRowSelectNr == 0){
                    currentSearchRowSelectNr -= 1;
                    if (currentSearchRowSelectNr == 0){
                        currentSearchRowSelectNr = maxSearchRows;
                    }
                    $(".search-row-"+currentSearchRowSelectNr).addClass("found-search-row-hover");
                }
            }
            else{
                $("#"+ type +"-search-tooltip").hide();
            }
            updateDescriptionEvents();
        },
        error: function(xhr, ajaxOptions, thrownError) {

        }
    });

    return false;
}

function showClientData(evt){

    $("input[name='client_email']").val($(evt).children("input[class='client-email']").val());
    $("input[name='client_phone']").val($(evt).children("input[class='client-phone']").val());
    $(evt).parent().hide();
    currentSearchRowSelectNr = 0;
}

function showProductsData(evt, nr){

    $("input[name='form-"+nr+"-source']").val($(evt).children("input[class='description-id']").val());
    $("input[name='form-"+nr+"-description']").val($(evt).children("input[class='description-name']").val());
    $("input[name='form-"+nr+"-price']").val(round(parseFloat($(evt).children("input[class='description-price']").val()), 2).toFixed(2).replace(".", decimalSeparator).replace(",", decimalSeparator));
    $("input[name='form-"+nr+"-price']").removeClass("warning-input");

    $("#description-row-total-"+nr).html(replaceDecimalSeparator(round(parseFloat($("input[name=form-"+nr+"-price]").val().replace(",", ".") * parseInt($("input[name=form-"+nr+"-quantity]").val())), 2).toFixed(2)));
    $(evt).parent().hide();
    currentSearchRowSelectNr = 0;
    calculateTotalPrice();
}

function addNewDescriptionLine(){

    if (currentDescriptionRow == $("input[name=form-MAX_NUM_FORMS]").val()){
        return;
    }

    currentDescriptionRow += 1;
    $("input[name=form-TOTAL_FORMS]").val(currentDescriptionRow+1);
    
    var rowHTML = "<tr onmouseover=\"$(this).children().children('.icon-delete-description-row').show()\" onmouseout=\"$(this).children().children('.icon-delete-description-row').hide()\"><td class='tb_500'>"
        +"<span class='icon-delete-description-row-dummy'></span>"
        +"<span class='icon-cross text-12 text-gray-80 icon-delete-description-row' style='display:none' data-id='"+currentDescriptionRow+"'>"
        +"</span><input class='w-490 text-14 text-gray-43 product-name-description-row' type='text' data-id='"+currentDescriptionRow+"' placeholder='' name='form-"+currentDescriptionRow+"-description' value='' onfocus=\"$('.invoice-description-tooltip').hide()\">"
        +"<div style='position:absolute'>"
            +"<div id='invoice-description-tooltip-"+currentDescriptionRow+"' class='invoice-description-tooltip' style='width:490px;display:none'></div>"
        +"</div></td>"
        +"<td class='tb_70'>"
            +"<input class='w-60 margin-xxsmall text-14 align-center text-gray-43 description-quantity-input' type='text' placeholder='' name='form-"+currentDescriptionRow+"-quantity' value='1'>"
        +"</td>"
        +"<td class='tb_150'><input class='w-140 margin-xxsmall text-14 align-right text-gray-43 description-price-input' type='text' placeholder='0"+decimalSeparator+"00' name='form-"+currentDescriptionRow+"-price' value=''>"
        +"</td>"
        +"<td id='description-row-total-"+currentDescriptionRow+"' class='tb_140 text-16 align-right text-gray-43'>"
        +"</td>"
        +"</tr>"
        +"<tr class='additional-description-data' style='position:absolute'>"
            +"<td><input type='hidden' name='form-"+currentDescriptionRow+"-source' placeholder='id of a source product'></td>"
            +"<td><input type='hidden' name='form-"+currentDescriptionRow+"-DELETE'></td>"
        +"</tr>";

    $(".additional-description-data").last().after(rowHTML);

    updateDescriptionEvents();

    if (currentDescriptionRow == $("input[name=form-MAX_NUM_FORMS]").val()){
        $("#add-new-line-button").hide();
    }
}

function discountTypeChange(evt){
    if ($(evt).val() == "%"){
        $("input[name='discount_amount']").hide();
        if ( parseFloat($("input[name='discount_amount']").val()) > parseFloat(0)){
            $("input[name='discount_percent']").val(parseInt($("input[name='discount_amount']").val()));
        }
        $("input[name='discount_percent']").show();
        $("input[name='discount_amount']").val(0);
        calculateTotalPrice();
    }
    else{
        $("input[name='discount_percent']").hide();
        if($("input[name='discount_percent']").val() != 0){
            $("input[name='discount_amount']").val(replaceDecimalSeparator(parseInt($("input[name='discount_percent']").val()).toFixed(2)));
        }
        $("input[name='discount_amount']").show();
        $("input[name='discount_percent']").val(0);
        calculateTotalPrice();
    }
}

function truncString(string){

    string = string.toString();

    if (string.indexOf("e") != -1){
        string = "0.00";
    }

    var visibleLeftCharacterCount = 8;
    var visibleRightCharacterCount = 5;

    if (string.length > 13){
        string = string.substring(0,visibleLeftCharacterCount)+"&#8230;"+string.substring(string.length - visibleRightCharacterCount, string.length);
    }
    return string;
}

function calculateTotalPrice(){

    var subtotal = 0, discount = 0, swipeFeeClientValue = 0, swipeFeeMerchantValue = 0, swipeTotalFeeValue = 0, vatFeeValue = 0, rowExist;

    for (i = 0; i <= currentDescriptionRow; i++) { 
        
        isRowDeleted = $("input[name=form-"+i+"-DELETE]").val();
        if (!isRowDeleted){
            var rowValue = $("input[name=form-"+i+"-quantity]").val() * parseFloat($("input[name=form-"+i+"-price]").val().replace(",", "."));
            if (rowValue > 0){
                subtotal += rowValue;
            }
            else{
                $("#description-row-total-"+i).html("");
            }
        }
    }

    if (subtotal > 0){
        if ($("#curr").val() == "%"){
            if($("input[name='discount_percent']").val() != 0){
                $("#tr-discount").show();
                discount = ((subtotal/100) * $("input[name='discount_percent']").val());
                $("#discount-text").html(replaceDecimalSeparator(truncString(round(-Math.abs(discount), 2).toFixed(2))));
            }
            else{
                $("#tr-discount").hide();
            }
        }
        else if(!$("#curr").val()){
            $("#tr-discount").hide();
        }
        else{
            if ($("input[name='discount_amount']").val() != 0){
                $("#tr-discount").show();
                discount = ($("input[name='discount_amount']").val().replace(",", "."));
                $("#discount-text").html(replaceDecimalSeparator(truncString(round(-Math.abs(discount), 2).toFixed(2))));
            }
            else{
                $("#tr-discount").hide();
            }
        }
    }
    
    if (!isNaN(round(subtotal, 2))){
        if ((subtotal.toString()).indexOf("e") != -1){
            subtotal = 0;
            swipeFeeMerchantValue = 0;
            swipeFeeClientValue = 0;
            $("#merchant-fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeMerchantValue, 2).toFixed(2))));
            $("#fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeClientValue, 2).toFixed(2))));
        }
        $("#subtotal-text").html(replaceDecimalSeparator(truncString(round(subtotal, 2).toFixed(2))));
    }
    else{
        subtotal = 0;
        $("#subtotal-text").html(replaceDecimalSeparator(subtotal.toFixed(2)));
        swipeFeeMerchantValue = 0;
        swipeFeeClientValue = 0;
        $("#merchant-fee-text").html(replaceDecimalSeparator(swipeFeeMerchantValue.toFixed(2)));
        $("#fee-text").html(replaceDecimalSeparator(swipeFeeClientValue.toFixed(2)));
        vatFeeValue = 0;
        $("#vat-text").html(replaceDecimalSeparator(vatFeeValue.toFixed(2)));
    }
    
    if (subtotal > 0){
        
        //Pays Recipient
        if ($("#fee").val() == 1){
            swipeFeeMerchantValue = 0;
            swipeFeeClientValue = round((subtotal-discount) * (parseFloat(swipeFeeClient)/100) + parseFloat(swipeFeeBaseClient), 2);

            if ($("input[name=vat_enabled]").prop('checked')){
                vatFeeValue = round((subtotal - discount + swipeFeeClientValue) * (vat / 100), 2);
            }

            $("#merchant-fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeMerchantValue, 2).toFixed(2))));
            $("#fee-text").html(replaceDecimalSeparator(truncString(swipeFeeClientValue.toFixed(2))));
        }
        //Pays Merchant
        else if ($("#fee").val() == 2){ 
            swipeFeeMerchantValue = round((subtotal-discount) * (parseFloat(swipeFeeMerchant)/100) + parseFloat(swipeFeeBaseMerchant), 2);
            swipeFeeClientValue = 0;

            if ($("input[name=vat_enabled]").prop('checked')){
                vatFeeValue = round((subtotal - discount) * (vat / 100), 2);
            }

            $("#merchant-fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeMerchantValue, 2).toFixed(2))));
            $("#fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeClientValue, 2).toFixed(2))));
        }
        //Shared
        else if ($("#fee").val() == 3){
            swipeFeeClientValue = (subtotal-discount) * (parseFloat(swipeFeeSharedClient)/100) + parseFloat(swipeFeeBaseSharedClient);
            swipeFeeMerchantValue = (subtotal-discount) * (parseFloat(swipeFeeSharedMerchant)/100) + parseFloat(swipeFeeBaseSharedMerchant);
            
            if ((round(swipeFeeClientValue, 2) + round(swipeFeeMerchantValue, 2)) < (round((swipeFeeClientValue + swipeFeeMerchantValue), 2))){
                swipeFeeMerchantValue = parseFloat(round(swipeFeeMerchantValue, 2).toFixed(2)) + 0.01;
            }

            if ($("input[name=vat_enabled]").prop('checked')){
                vatFeeValue = round((subtotal - discount + round(swipeFeeClientValue, 2)) * (vat / 100), 2);
            }
            
            $("#merchant-fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeMerchantValue, 2).toFixed(2))));
            $("#fee-text").html(replaceDecimalSeparator(truncString(round(swipeFeeClientValue, 2).toFixed(2))));
        }
        //Free Swipe
        else if ($("#fee").val() == 0){
            if ($("input[name=vat_enabled]").prop('checked')){
                vatFeeValue = round((subtotal - discount) * (vat / 100), 2);
            }
        }
        
        $("#tr-vat").show();
        $("#vat-text").html(replaceDecimalSeparator(truncString(round(vatFeeValue, 2).toFixed(2))));
    }
    else{
        swipeFeeMerchantValue = 0;
        swipeFeeClientValue = 0;
        $("#merchant-fee-text").html(replaceDecimalSeparator(swipeFeeMerchantValue.toFixed(2)));
        $("#fee-text").html(replaceDecimalSeparator(swipeFeeClientValue.toFixed(2)));
        vatFeeValue = 0;
        $("#vat-text").html(replaceDecimalSeparator(vatFeeValue.toFixed(2)));
    }

    if (!$("input[name=vat_enabled]").prop('checked')){
        $("#tr-vat").hide();
    }

    var total = round((subtotal - discount + vatFeeValue + swipeFeeClientValue), 2).toFixed(2)
    $("#total-text").html(replaceDecimalSeparator(truncString(total)));
        
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function checkIntegerInput(evt){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.charCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function checkPriceInput(evt){

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.charCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44 && charCode != 46) { // 44 = ",", 46 = "."
        return false;
    }
    
    if ((evt.target.value.indexOf(",") != -1 || evt.target.value.indexOf(".") != -1) && (charCode == 44 || charCode == 46)){
        return false;
    }
    return true;
}

function replaceDecimalSeparator(str){

    str = str.toString();
    str = str.replace(".", decimalSeparator);
    str = str.replace(",", decimalSeparator);  
    return str;
}

function checkDecimal(evt){

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.charCode;

    if (evt.target.value.indexOf(",") != -1 || evt.target.value.indexOf(".") != -1){

        evt.target.value = replaceDecimalSeparator(evt.target.value);
    
        if (evt.target.value.indexOf(",") != -1){
            if (evt.target.value.split(",")[1].length > 2){
                evt.target.value = evt.target.value.substring(0, evt.target.value.length - (evt.target.value.split(",")[1].length - 2));
            }
        }
        else if (evt.target.value.indexOf(".") != -1){
            if (evt.target.value.split(".")[1].length > 2){
                evt.target.value = evt.target.value.substring(0, evt.target.value.length - (evt.target.value.split(".")[1].length - 2));
            }
        }
    }
}

function openDeleteModal(id){
    $("#modal-delete-invoice").bPopup();
    deleteInvoiceID = id;
}

function deleteInvoice(id) {

    if (!allowToDeleteInvoice){
        return false;
    }
    else{
        allowToDeleteInvoice = false;
        $("#modal-delete-invoice-submit").html("<span style='line-height:14px;' class='icon-spin5 animate-spin'></span>");
    }

    $.ajax({
        url: deleteInvoiceLink.replace('/0/', '/' + id + '/'),
        type: 'POST',
        data: '',
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        success: function (msg) {
          if(msg.status == 1)
            window.location.href = getInvoicesLink;        
        }
    });

    return false;
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}