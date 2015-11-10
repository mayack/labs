$(function(){

  resizeUpdate();


  // General

  $('select').select2({
    minimumResultsForSearch: -1
  });
  $('.tooltip').tooltip({
    hide: { duration: 300 },
    show: { duration: 300 }
  });


  // Sidebar

  $( '.scrollable' ).bind( 'mousewheel DOMMouseScroll', function ( e ) {
      var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;

      this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
      e.preventDefault();
  });
  $('.nav-sidebar>ul>li>ul>li.active').parents('li').addClass('has-active');
  $('.nav-sidebar>ul>li').click(function(e){
    if($(this).children('ul').length) {
      if ($(this).is('.expanded')) {
        removeExpanded();
      } else {
        showSidebar();
        $('.nav-sidebar li.expanded').removeClass('expanded').find('ul').slideUp();
        $(this).addClass('expanded').find('ul').slideDown('fast');
      }
      e.preventDefault();
    }
  });
  $('.sidebar-trigger').click(function(){
    if ( $('.sidebar-indicator').is(':hidden') ) {
      showSidebar();
    } else {
      hideSidebar();
    }
  });

});

$(window).resize(function() {
    resizeUpdate();
});

function resizeUpdate() {
  windowHeight = $(window).height();
  navHeight = $('.nav-main').outerHeight();
  logoHeight = $('.sidebar .logo').outerHeight();
  companySwitchHeightExpanded = $('.sidebar .company-switch .company-switch-expanded').outerHeight();
  companySwitchHeightCollapsed = $('.sidebar .company-switch .company-switch-collapsed').outerHeight();
  contentHeight = windowHeight - navHeight;

  if ( $('.sidebar-indicator').is(':hidden') ) {
    $('.sidebar .company-switch').height(companySwitchHeightCollapsed);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightCollapsed - 2;
    console.log(navSidebarHeight);
  } else {
    $('.sidebar .company-switch').height(companySwitchHeightExpanded);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightExpanded - 2;
    console.log(navSidebarHeight);
  }

  $('.content').outerHeight(contentHeight);
  $('.sidebar .nav-sidebar').outerHeight(navSidebarHeight);

}

function hideSidebar() {
  $('.sidebar, .sidebar-trigger').addClass('collapsed').removeClass('expanded');
  $('.sidebar ul li.expanded').removeClass('expanded').find('ul').slideUp('fast');
  removeExpanded();
  resizeUpdate();
}

function showSidebar() {
  $('.sidebar, .sidebar-trigger').addClass('expanded').removeClass('collapsed');
  resizeUpdate();
}

function removeExpanded() {
  $('.sidebar ul li.expanded').removeClass('expanded').find('ul').slideUp('fast');
}

