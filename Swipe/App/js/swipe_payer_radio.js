// nb 2015-04-07
// add radio button event

$(function(){
    /* for radio button */
    $('.input_item').click(function(event){
        $("#radio_describe").removeClass("warning-input");
        $(".radio-is-active").removeClass("radio-is-active"); // reset radio                
        $("#rejectForm input[type='radio']").prop('checked', false); // reset radio                
        $(this).find('.radio').addClass("radio-is-active");
        // if ($(this).prop('id')=='radio_2') {
        //     $('#radio_2_describe').prop('disabled', false);
        // } else {
        //     $('#radio_2_describe').prop('disabled', true);
        // }
        $('#radio_describe').show().prop('disabled', false).insertAfter($(this));
        $('input[type="radio"]', this).prop('checked', true);
        if(!!$(this).data('other')) {
            $('#radio_describe').attr('placeholder', placeholderRequired);
        } else {
            $('#radio_describe').attr('placeholder', placeholderOptional);            
        }
    }); 

});
