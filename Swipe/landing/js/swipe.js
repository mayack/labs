var blockSendButton = false;
var youtubePreviewIsActive = false;

$(function(){

    $('#country-list, #country-api').select2({
        // minimumResultsForSearch: Infinity
    });
    $('.languages').select2({
        tags: false,
        minimumResultsForSearch: Infinity,
        dropdownCssClass: "atk-size-nano"
        // placeholder: $(this).data("placeholder")
    });

    wow = new WOW(
    {
      boxClass:     'wow',      // default
      animateClass: 'animated', // default
      offset:       0,          // default
      mobile:       false,       // default
      live:         true        // default
    }
    )
    wow.init();

    $('#faq').accordion({
        animate: 300,
        heightStyle: "content"
    });

    $( window ).load(function() {
        loadGoogleAnalytics();
        setTimeout(function() {
            $("#nav-floating-wrap").css("opacity", 1);
        }, 500); 
    });

    if($('#nav-floating-anchor').length) {
        $(window).scroll(function(){
            var window_top = $(window).scrollTop(); // the "12" should equal the margin-top value for nav.stick
            var div_top = $('#nav-floating-anchor').offset().top;
                if (window_top > div_top) {
                    $('#nav-floating').removeClass('fadeOutUp');
                    $('#nav-floating').addClass('stick fadeInDown');
                } else {
                    $('#nav-floating').addClass('fadeOutUp');
                    $('#nav-floating').removeClass('stick fadeInDown');
                }
        });
    }

    /**
     * This part causes smooth scrolling using scrollto.js
     * We target all a tags inside the nav, and apply the scrollto.js to it.
     */
    $(".nav-main a").click(function(evn){
        
        if($(this).data('id')) {
            evn.preventDefault();
            $('html,body').scrollTo($(this).data('id'), '#hero', {offset: 10});
        }

    });

    /**
     * This part handles the highlighting functionality.
     * We use the scroll functionality again, some array creation and 
     * manipulation, class adding and class removing, and conditional testing
     */
    var aChildren = $("#nav-floating .nav-main").children(); // find the a children of the list items
    var aArray = []; // create the empty aArray
    for (var i=0; i < aChildren.length; i++) { 
        var aChild = aChildren[i];
        var ahref = $(aChild).attr('href');
        if(ahref.indexOf('#') == -1)
            continue;
        aArray.push(ahref);
    } // this for loop fills the aArray with attribute href values

    $(window).scroll(function(){
        var windowPos = $(window).scrollTop(); // get the offset of the window from the top of page
        var windowHeight = $(window).height(); // get the height of the window
        var docHeight = $(document).height();

        for (var i=0; i < aArray.length; i++) {
            var theID = aArray[i];
            var divPos = $(theID).offset().top;
            var divHeight = $(theID).height(); // get the height of the div in question
            if (windowPos >= divPos && windowPos < (divPos + divHeight)) {
                // $("a[href='" + theID + "']").addClass("active");
                $("a[data-id="+theID+"]").addClass("active");
                // if(theID == "#how-it-works"){
                //     previewYoutubeVideo(false);
                // }
            } else {
                // $("a[href='" + theID + "']").removeClass("active");
                $("a[data-id="+theID+"]").removeClass("active");
            }
        }

        if(windowPos + windowHeight == docHeight) {
            if (!$("#nav-floating .nav-main a").hasClass("active")) {
                var navActiveCurrent = $(".active").attr("href");
                if ($("#nav-floating a[href='" + navActiveCurrent + "']").data("except") != "1"){
                    $("#nav-floating a[href='" + navActiveCurrent + "']").removeClass("active");
                }
                $("#nav-floating .nav-main a").addClass("active");
            }
        }
    });

    $('.connection a').click(function(){

        $('html,body').scrollTo(this.hash, this.hash, {offset: 0});

    });

    $('#footer a.go-top, .logo').click(function(e){
        e.preventDefault();
        $('html,body').scrollTo(0, {duration: 700, easing: 'swing'});

    });

    $('#send-invoice').click(function(){

        if (blockSendButton){
            return false;
        }
        if ($("form#example-invoice-form input[name=phone]").val().length == 0 && $("form#example-invoice-form input[name=email]").val().length == 0){
            return false;
        }
        blockSendButton = true;
        $('#send-invoice').addClass("button-loading");
        $.ajax({
            url: $('#example-invoice-form').attr('action'),
            type: "POST",
            data: $('#example-invoice-form').serialize(),
            dataType: "JSON",
            success: function (msg) {
                if (msg.status == 1){
                    $('#send-invoice').addClass('fadeOut').next().addClass('fadeIn');
                    $("input[name='email']").val("");
                    $("input[name='phone']").val("");
                    // window.location.reload(true);
                }
                else if (msg.status == 0){
                    $("#send-invoice-error").show();
                    $('#send-invoice').removeClass("button-loading");
                }
                blockSendButton = true;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                blockSendButton = false;
            },
        });

        return false;

    });

    $('#faq > h3').click(function() {
        ga('send', 'Text info', 'Accordion', 'action', {'nonInteraction': 1});
    });
    $('a[href="#header"]').click(function() {
        ga('send', 'Scroll to top', 'Back to header', 'action', {'nonInteraction': 1});
    });
    $('#send-invoice').click(function() {
        ga('send', 'Send invoice', 'Beautiful invoices', 'action', {'nonInteraction': 1});
    });
    $('a#access-list-button-text').click(function() {
        ga('send', 'Join pressed', 'Back to header', 'action', {'nonInteraction': 1});
    });
    $('a#form-api-button-text').click(function() {
        ga('send', 'Request pressed', 'Request', 'action', {'nonInteraction': 1});
    });

});

function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}

function previewYoutubeVideo(force){
    if(fromLatvia && document.referrer.length == 0 && !youtubePreviewIsActive && $.cookie('blockYoutubeVideo') != "1" && viewport().width > 768 || force){
        $.cookie('blockYoutubeVideo', "1", { expires: 999, path: '/' });
        youtubePreviewIsActive = true;
        $(".youtube-container").bPopup({
            onClose: function(){ 
                $('#youtube-iframe').attr('src', "");
                youtubePreviewIsActive = false;
            }
        });
        $('#youtube-iframe').attr('src', "https://www.youtube.com/embed/B_HQxWH6d-A?autoplay=1");
    }
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function postHeaderForm(form, button_id){
    
    if (blockSendButton){
        return false;
    }

    var allowToContinue = true;
    
    if (form.find('input[name="email"]').val().length > 0){
        isValidEamil = validateEmail(form.find('input[name="email"]').val());
        if (isValidEamil == false) {
            form.find('input[name="email"]').addClass("red-border");
            allowToContinue = false;
        }
        else{
            form.find('input[name="email"]').removeClass("red-border");
        }
    }
    else{
        form.find('input[name="email"]').addClass("red-border");
        allowToContinue = false;
    }

    if(!form.find('select[name="country"]').val()){
        form.find('select[name="country"]').next().children().children().addClass("red-border");
        allowToContinue = false;
    }
    else{
        form.find('select[name="country"]').next().children().children().removeClass("red-border");
    }

    if (!allowToContinue){
        return false;
    }

    blockSendButton = true;
    $('#'+button_id).html($('#'+button_id).data("sending"));
    
    $.ajax({
        url: form.attr('action'),
        type: "POST",
        data: form.serialize() + '&saving_status=' + $('#'+button_id).data("choice"), 
        dataType: "JSON",
        success: function (msg) {
            if (msg.status == 1){
                // $('#send-invoice').addClass('fadeOut').next().addClass('fadeIn');
                // window.location.reload(true);
                $('#'+button_id).html($('#'+button_id).data("sent"));
                if(msg.hasOwnProperty('url'))
                    window.location.href = msg.url;
            }
            else if (msg.status == 0){
                // $("#send-invoice-error").show();
                // $('#send-invoice').removeClass("button-loading");
            }
            blockSendButton = false;
        },
        error: function(xhr, ajaxOptions, thrownError) {
            blockSendButton = false;
        },
    });

    return false;
}