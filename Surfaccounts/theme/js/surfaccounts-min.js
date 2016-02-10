function removeExpanded() {
  $('#sidebar ul li.opened').removeClass('opened').find('ul').slideUp(200, 'linear');
}

function resizeUpdate() {
  var windowHeight = $(window).height();
  var navHeight = $('#nav-main').outerHeight();
  var navSidebarHeight;
  var logoHeight = $('#sidebar #logo').outerHeight();
  var companySwitchHeightExpanded = $('#sidebar footer .footer-expanded').outerHeight();
  var companySwitchHeightCollapsed = $('#sidebar footer .footer-collapsed').outerHeight();
  var contentHeight;
  var actionsHeight;

  if ( $('.page-actions').length > 0 ) {
    actionsHeight = companySwitchHeightExpanded - 1;
    contentHeight = windowHeight - navHeight - actionsHeight;
    $('.page-actions>.atk-cells').height(actionsHeight);
  } else {
    contentHeight = windowHeight - navHeight;
  }

  if ( $('#sidebar-indicator').is(':hidden') ) {
    $('#sidebar .footer').height(companySwitchHeightCollapsed);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightCollapsed - 2;
    $('#sidebar #nav-sidebar').outerHeight(navSidebarHeight);
  } else {
    $('#sidebar .footer').height(companySwitchHeightExpanded);
    navSidebarHeight = windowHeight - logoHeight - companySwitchHeightExpanded - 2;
    $('#sidebar #nav-sidebar').outerHeight(navSidebarHeight);
  }

  $('.content').outerHeight(contentHeight);

}

function showSidebar() {
  $('#sidebar, #sidebar-trigger').addClass('expanded').removeClass('collapsed');
  resizeUpdate();
}

function hideSidebar() {
  $('#sidebar, #sidebar-trigger').addClass('collapsed').removeClass('expanded');
  $('#sidebar ul li.opened').removeClass('opened').find('ul').slideUp(200, 'linear');
  removeExpanded();
  resizeUpdate();
}

$(function(){


  // -------------------------------------------------
  // General
  // -------------------------------------------------

  resizeUpdate();

  $('select').select2({
    minimumResultsForSearch: -1
  });
  $('.tooltip').tooltip({
    hide: { duration: 300 },
    show: {
      delay: 500,
      duration: 300,
    },
    position: {
      my: "center top+10",
      at: "center bottom"
    }
  });
  $(".file-browser a").click(function(){
    $(this).siblings("input").click();
  });


  // -------------------------------------------------
  // Sidebar
  // -------------------------------------------------

  $('.scrollable').bind('mousewheel DOMMouseScroll', function (e) {
      var e0 = e.originalEvent,
          delta = e0.wheelDelta || -e0.detail;

      this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
      e.preventDefault();
  });
  $('#nav-sidebar>ul>li>ul>li.active').parents('li').addClass('has-active');
  $('#nav-sidebar>ul>li').click(function(e){
    if($(this).children('ul').length) {
      if ($(this).is('.opened')) {
        removeExpanded();
      } else {
        showSidebar();
        $('#nav-sidebar li.opened').removeClass('opened').find('ul').slideUp();
        $(this).addClass('opened').find('ul').slideDown(200, 'linear');
      }
      e.preventDefault();
    }
  });
  $('#sidebar-trigger').click(function(){
    if ( $('#sidebar-indicator').is(':hidden') ) {
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


  // -------------------------------------------------
  // Clients
  // -------------------------------------------------

  // Actions Dropdown
  $(document).click(function(e) {

      var $target = $(e.target);
      var dropdown = (e.target.id === 'actions-dropdown');
      var templates = (e.target.id === 'templates');
      
      if (!dropdown) {
        $('#actions-dropdown').addClass('atk-hide');
        $('.atk-tableAction.visible').removeClass('visible');
      }
      if (!templates) {
        $('#templates').addClass('atk-hide');
      }

  });
  $('.actions-trigger').click(function(e) {
      e.stopPropagation();

      var trigger = $(this);
      var dropdown = $('#actions-dropdown');

      $('.atk-tableAction.visible').removeClass('visible');
      $(this).parent().addClass('visible');

      $(dropdown).removeClass('atk-hide').position({
        my: "center-1 top+10",
        at: "center bottom",
        of: trigger,
        collision: "flip",
        using: function(obj, info){
          var item_top = (info.vertical!== "top"? "bottom" : "top");
          $(this).addClass("atk-popover-" + item_top + "-center");
          $(this).removeClass("atk-popover-" + (item_top === "top"? "bottom" : "top") + "-center");
          $(this).css({
            left: obj.left + 'px',
            top: obj.top + 'px'
          });
        }
      });

  });


  // -------------------------------------------------
  // Invoice Add
  // -------------------------------------------------

  // Invoice Details
  $('.invoice-issued input').datepicker().datepicker('setDate', new Date());
  $('.invoice-issued>a').click(function(){
    $(this).siblings('input').datepicker("show");
  });
  $('.invoice-due input').datepicker();
  $('.invoice-due>a').click(function(){
    $(this).siblings('input').datepicker("show");
  });

  // Invoice Table
  $('.invoice-row-delete').click(function(){
    $(this).parents('tr').remove();
  });
  $('.invoice-row-advanced').click(function(){
    $('#row-advanced').dialog({
      modal: true,
      width: 600
    });
  });
  $('select.invoice-select').select2({
    dropdownCssClass: "invoice-dropdown",
    minimumResultsForSearch: -1
  });

  // Invoice Addresses
  $('#tabs-address').tabs();

  // Vat Analysis
  $('#vat-analysis-trigger').hover(
    function(){
      var trigger = $(this);
      $('#vat-analysis').removeClass('atk-hide').position({
        my: "center bottom-10",
        at: "center top",
        of: trigger
      });
    }, function() {
      $('#vat-analysis').addClass('atk-hide');
    }
  );

  // Template Set
  $('#templates-trigger').click(function(e){
    e.stopPropagation();
    var trigger = $(this);
    $('#templates').removeClass('atk-hide').position({
        my: "right+10 top+12",
        at: "right bottom",
        of: trigger
    });
  });

}); // document ready ends

$(window).resize(function() {
    resizeUpdate();
});

