function removeExpanded() {
  $('#sidebar ul li.opened').removeClass('opened').find('ul').slideUp(200, 'linear');
}

function resizeUpdate() {
  var windowHeight = $(window).height();
  var navHeight = $('#nav-main').outerHeight();
  var navSidebarHeight;
  var logoHeight = $('#sidebar #logo').outerHeight();
  var userSwitchHeightExpanded = $('#sidebar footer .footer-expanded').outerHeight();
  var userSwitchHeightCollapsed = $('#sidebar footer .footer-collapsed').outerHeight();
  var contentHeight;
  var actionsHeight;

  if ( $('.page-actions').length > 0 ) {
    actionsHeight = userSwitchHeightExpanded - 1;
    contentHeight = windowHeight - navHeight - actionsHeight;
    $('.page-actions>.atk-cells').height(actionsHeight);
  } else {
    contentHeight = windowHeight - navHeight;
  }

  if ( $('#sidebar-indicator').is(':hidden') ) {
    $('#sidebar .footer').height(userSwitchHeightCollapsed);
    navSidebarHeight = windowHeight - logoHeight - userSwitchHeightCollapsed - 2;
    $('#sidebar #nav-sidebar').outerHeight(navSidebarHeight);
    $('#sidebar footer').outerHeight(userSwitchHeightCollapsed);
  } else {
    $('#sidebar .footer').height(userSwitchHeightExpanded);
    navSidebarHeight = windowHeight - logoHeight - userSwitchHeightExpanded - 2;
    $('#sidebar #nav-sidebar').outerHeight(navSidebarHeight);
    $('#sidebar footer').outerHeight(userSwitchHeightExpanded);
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

var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
function tipSwitch() {
  var target = $(this).attr("data-tip-target");
  var tip = $(this).attr("data-tip");
  var posArray = $(this).attr("data-tip-position");
  var pos = new Array();
  pos = posArray.split(";");

  if($('.tip-visible').length > 0) {
    $(".tip-overlay").removeClass("fadeIn").addClass("fadeOut").one(animationEnd, function(){
      $(".tip-target").removeClass("tip-target");
      if($(target).parents("#sidebar").length > 0) {
        $(target).parents("#sidebar").addClass("tip-target");
      } else {
        $(target).addClass("tip-target");
      }
      $('.tip-overlay').removeClass("fadeOut").addClass("fadeIn");
    });
    $(".tip-visible").removeClass("tip-visible fadeIn").addClass("fadeOut").one(animationEnd, function(){
      $(tip).show().position({
        at: pos[0],
        my: pos[1],
        of: target
      }).addClass("tip-visible animated fadeIn");
    });
  } else {
    setTimeout(function(){
      $('.tip-overlay').show().addClass("animated fadeIn");
      $(tip).show().position({
        at: pos[0],
        my: pos[1],
        of: target
      }).addClass("tip-visible animated fadeIn");
    }, 400);
  }

}
function tourDestroy() {
  $(".tip-overlay").removeClass("fadeIn").addClass("fadeOut").one(animationEnd, function(){
    $(this).remove();
    $(".tip-target").removeClass("tip-target");
  });
  $(".tip-visible").removeClass("fadeIn").addClass("fadeOut").one(animationEnd, function(){$(this).remove();});
  $(".tip-popover").not(".tip-visible").remove();
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
  $(".help-box .icon-cancel").click(function(){
    $(this).parent().slideUp(200);
  });


  // -------------------------------------------------
  // Help Tour
  // -------------------------------------------------

  $('#tour-dialog').dialog({
    closeOnEscape: false,
    dialogClass: "no-title",
    draggable: false,
    modal: true,
    width: 350
  });
  $('#tour-dialog-close').click(function(){
    $('#tour-dialog').dialog("close").remove();
    tourDestroy();
  });
  $('#tour-start').click(function(){
    $('#tour-dialog').dialog("close").remove();
  });
  $('[data-tip]').click(tipSwitch);
  $('.tour-destroy').click(tourDestroy);
  // $('#tour-tip-3').position({
  //   at: "right+5 top",
  //   my: "left top",
  //   of: $("#nav-sidebar")
  // });
  //   $('#tour-tip-4').position({
  //   at: "right+5 center+20",
  //   my: "left bottom",
  //   of: $("#dialog-user-trigger")
  // });
  // $('#tour-start').click(function(){
  //   $('#tour-dialog').dialog("destroy");
  //   $('.tour-overlay').addClass("animated");
  //   $('.tour-popover').each(function(){
  //     $(this).addClass("animated");
  //   });
  //   $('#tour-tip-1').show().position({
  //     at: "right-5 top-3",
  //     my: "right bottom",
  //     of: $("#dialog-company-trigger")
  //   });
  //   $("#dialog-company-trigger").addClass("tour-target");
  //   $('.tour-overlay').show().addClass("fadeIn");
  //   $('#tour-tip-1').show().addClass("fadeIn");
  // });
  // $('#tour-next-tip-2').click(function(){
  //   $('.tour-target').removeClass("tour-target");
  //   $('#tour-tip-1').addClass("fadeOut");
  //   $("#quick-add").addClass("tour-target");
  //   $('#tour-tip-2').show().addClass("fadeIn");
  //   $('#tour-tip-2').position({
  //     at: "left top-3",
  //     my: "left bottom",
  //     of: $("#quick-add")
  //   });
  // });


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
      draggable: false,
      modal: true,
      width: 400
    });
  });
  $('#dialog-user-trigger').click(function(){
    $('#dialog-user').dialog({
      draggable: false,
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

    var projects = [
      {
        value: "jquery",
        label: "jQuery",
        desc: "the write less, do more, JavaScript library",
      },
      {
        value: "jquery-ui",
        label: "jQuery UI",
        desc: "the official user interface library for jQuery",
      },
      {
        value: "sizzlejs",
        label: "Sizzle JS",
        desc: "a pure-JavaScript CSS selector engine",
      }
    ];
 
    $( "#project" ).autocomplete({
      minLength: 0,
      source: projects,
      focus: function( event, ui ) {
        $( "#project" ).val( ui.item.label );
        return false;
      },
      select: function( event, ui ) {
        $( "#project" ).val( ui.item.label );
        $( "#project-id" ).val( ui.item.value );
        $( "#project-description" ).html( ui.item.desc );
 
        return false;
      }
    })
    .autocomplete( "instance" )._renderItem = function( ul, item ) {
      return $( "<li>" )
        .append( "<a>" + item.label + "<br>" + item.desc + "</a>" )
        .appendTo( ul );
    };


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
      draggable: false,
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