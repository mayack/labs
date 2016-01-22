function removeExpanded() {
  $('.sidebar ul li.expanded').removeClass('expanded').find('ul').slideUp(200, 'linear');
}

function resizeUpdate() {
  var windowHeight = $(window).height();
  var navHeight = $('.nav-main').outerHeight();
  var navSidebarHeight;
  var logoHeight = $('.sidebar .logo').outerHeight();
  var companySwitchHeightExpanded = $('.sidebar .company-switcher .company-switcher-expanded').outerHeight();
  var companySwitchHeightCollapsed = $('.sidebar .company-switcher .company-switcher-collapsed').outerHeight();
  var contentHeight = windowHeight - navHeight;

  if ( $('.sidebar-indicator').is(':hidden') ) {
    $('.sidebar .company-switcher').height(companySwitchHeightCollapsed);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightCollapsed - 2;
    $('.sidebar .nav-sidebar').outerHeight(navSidebarHeight);
  } else {
    $('.sidebar .company-switcher').height(companySwitchHeightExpanded);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightExpanded - 2;
    $('.sidebar .nav-sidebar').outerHeight(navSidebarHeight);
  }

  $('.content').outerHeight(contentHeight);

}

function showSidebar() {
  $('.sidebar, .sidebar-trigger').addClass('expanded').removeClass('collapsed');
  resizeUpdate();
}

function hideSidebar() {
  $('.sidebar, .sidebar-trigger').addClass('collapsed').removeClass('expanded');
  $('.sidebar ul li.expanded').removeClass('expanded').find('ul').slideUp(200, 'linear');
  removeExpanded();
  resizeUpdate();
}

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
  $('#tabs').tabs();

  $('[class*=table][class*=hover] tbody').each(function(){
    $(this).find('tr:first-child td:first-child').addClass('shape-rounded--top--left');
    $(this).find('tr:last-child td:first-child').addClass('shape-rounded--bottom--left');
    if ($(this).find('tr:last-child td.table-row-icon').length > 0) {      
      $(this).find('tr:first-child td:last-child').prev().addClass('shape-rounded--top--right');
      $(this).find('tr:last-child td:last-child').prev().addClass('shape-rounded--bottom--right');
    } else {
      $(this).find('tr:first-child td:last-child').addClass('shape-rounded--top--right');
      $(this).find('tr:last-child td:last-child').addClass('shape-rounded--top--right');
    }

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
  $('#dialog-company-trigger').click(function(){
    $('#dialog-company').dialog({
      modal: true,
      width: 400
    });
  });
  $('#dialog-user-trigger').click(function(){
    $('#dialog-user').dialog({
      modal: true,
      width: 300
    });
  });


  // Actions Dropdown

  $(document).click(function(e) {

      var $target = $(e.target);
      var dropdown = (e.target.id === 'actions-dropdown');
      
      if (!dropdown) {
        $('#actions-dropdown').addClass('hide');
        $('.table-row-icon.visible').removeClass('visible');
      }

  });

  $('.actions-trigger').click(function(e) {
      e.stopPropagation();

      var trigger = $(this);
      var dropdown = $('#actions-dropdown');

      $('.table-row-icon.visible').removeClass('visible');
      $(this).parent().addClass('visible');


      $(dropdown).removeClass('hide').position({
        my: "center-1 top+10",
        at: "center bottom",
        of: trigger,
        collision: "flip",
        using: function(obj, info){
          var item_top = (info.vertical!== "top"? "bottom" : "top");
          $(this).addClass("popover--" + item_top + "-center");
          $(this).removeClass("popover--" + (item_top === "top"? "bottom" : "top") + "-center");
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