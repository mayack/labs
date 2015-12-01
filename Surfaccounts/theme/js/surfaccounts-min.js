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

  $('.scrollable').bind('mousewheel DOMMouseScroll', function (e) {
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
        $(this).addClass('expanded').find('ul').slideDown(200, 'linear');
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
  $('.company-switcher').click(function(){
    $('#company-switch').dialog({
      modal: true,
      width: 400
    });
  });


  // Actions Dropdown

  $(document).click(function(e) {

      var $target = $(e.target);
      var dropdown = (e.target.id == 'actions-dropdown');
      
      if (!dropdown) {
        $('#actions-dropdown').addClass('atk-hide');
        $('.atk-table-row-icon.visible').removeClass('visible');
      }

  });

  $('.actions-trigger').click(function(e) {
      e.stopPropagation();

      var trigger = $(this);
      var dropdown = $('#actions-dropdown');

      $('.atk-table-row-icon.visible').removeClass('visible');
      $(this).parent().addClass('visible');


      $(dropdown).removeClass('atk-hide').position({
        my: "center-1 top+10",
        at: "center bottom",
        of: trigger,
        collision: "flip",
        using: function(obj, info){
          var item_top = (info.vertical!= "top"? "bottom" : "top");
          $(this).addClass("atk-popover-" +  item_top + "-center");
          $(this).removeClass("atk-popover-" + (item_top == "top"? "bottom" : "top") + "-center");
          $(this).css({
            left: obj.left + 'px',
            top: obj.top + 'px'
          });
        }
      });

  });

}); // document ready ends

$(window).resize(function() {
    resizeUpdate();
});

function resizeUpdate() {
  windowHeight = $(window).height();
  navHeight = $('.nav-main').outerHeight();
  logoHeight = $('.sidebar .logo').outerHeight();
  companySwitchHeightExpanded = $('.sidebar .company-switcher .company-switcher-expanded').outerHeight();
  companySwitchHeightCollapsed = $('.sidebar .company-switcher .company-switcher-collapsed').outerHeight();
  contentHeight = windowHeight - navHeight;

  if ( $('.sidebar-indicator').is(':hidden') ) {
    $('.sidebar .company-switcher').height(companySwitchHeightCollapsed);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightCollapsed - 2;
  } else {
    $('.sidebar .company-switcher').height(companySwitchHeightExpanded);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightExpanded - 2;
  }

  $('.content').outerHeight(contentHeight);
  $('.sidebar .nav-sidebar').outerHeight(navSidebarHeight);

}

function hideSidebar() {
  $('.sidebar, .sidebar-trigger').addClass('collapsed').removeClass('expanded');
  $('.sidebar ul li.expanded').removeClass('expanded').find('ul').slideUp(200, 'linear');
  removeExpanded();
  resizeUpdate();
}

function showSidebar() {
  $('.sidebar, .sidebar-trigger').addClass('expanded').removeClass('collapsed');
  resizeUpdate();
}

function removeExpanded() {
  $('.sidebar ul li.expanded').removeClass('expanded').find('ul').slideUp(200, 'linear');
}

