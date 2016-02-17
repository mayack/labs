function resizeUpdate() {
	var windowHeight = $(window).height();
	var inspectorHeaderHeight = $('#inspector header').outerHeight();
	var inspectorHeight = windowHeight-inspectorHeaderHeight;

	$('#inspector pre').height(inspectorHeight);
}

$(function(){
	resizeUpdate();
	hljs.initHighlightingOnLoad();
	$('#inspector-trigger').click(function(){
		$('#inspector').addClass('expanded');
		$(this).addClass('hidden');
	});
	$('#inspector-hide').click(function(){
		$(this).parents('#inspector').removeClass('expanded');
		$('#inspector-trigger').removeClass('hidden');
	});
});

$(window).resize(function() {
    resizeUpdate();
});

var myCodeMirror = CodeMirror(document.body, {
  value: "function myScript(){return 100;}\n",
  mode:  "html"
});