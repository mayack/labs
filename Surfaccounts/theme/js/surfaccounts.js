$(function(){
  $( '.scrollable' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
      var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;

      this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
      e.preventDefault();
  });

  $('#nav-main>ul>li>ul>li.active').parents('li').addClass('has-active');
  $('#nav-main>ul>li').click(function(e){
    if($(this).children('ul').length) {
      if ($(this).is('.expanded')) {
        $(this).removeClass('expanded').find('ul').slideUp();
      } else {
        $('#nav-main li.expanded').removeClass('expanded').find('ul').slideUp();
        $(this).addClass('expanded').find('ul').slideDown();
      }
      e.preventDefault();
    }
  });

});