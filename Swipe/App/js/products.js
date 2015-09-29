var nextPageNr = 1;
var blockPageLoading = false;
var blockSearchPageLoading = false;
var searchValue = "";
var newSearchValue = "";
var searchValueChanged = false;
var searchDelay = 200;
var footerHeight = 180;
var maxAllowedBottomSpaceBeforeNewPageLoad = 150 + footerHeight;
var allowToEdit = true;
var allowToPost = true;

$(function(){

	var window_height = $(window).height();
	var document_height = $(document).height();
	var scrollTop = $(window).scrollTop();

	if (document.body.innerHTML.indexOf("no-products") != -1){
      $(".products-placeholder").show();
    } 

	if ((document_height == window_height) || ((document_height - window_height) < maxAllowedBottomSpaceBeforeNewPageLoad && scrollTop == 0)){
		blockPageLoading = true;
		if (document.body.innerHTML.indexOf("last_page") == -1){
			$(".spinner").show();
	      	getNewProductPage(nextPageNr, searchValue);
	    }
	}

	$( "#modal-delete-product-submit" ).unbind('click').click(function(e) {
        postProducts(true);
    });

});

function removeWarning(element){
	$(element).removeClass("warning-input");
}

function scroolDetected(){
	
	var window_height = $(window).height();
	var document_height = $(document).height();
	var scrollTop = $(window).scrollTop();
	
	if ((document_height - scrollTop - window_height) < maxAllowedBottomSpaceBeforeNewPageLoad && blockPageLoading == false){
		blockPageLoading = true;
		if (document.body.innerHTML.indexOf("last_page") == -1){
			$(".spinner").show();
		    getNewProductPage(nextPageNr, searchValue);
		}
	}
}

$(window).scroll(function() {
	scroolDetected();
});

$(window).resize(function() {
  	scroolDetected();
});

$(window).load(function() {
    scroolDetected();
});

function showModal(id) {

	if (!allowToEdit){
		return;
	}

    $.ajax({
      type: 'GET',
      url: showModalPostLink + (!!id ? id + '/' : ''),
      data: '',
      dataType: 'html',
      error: function(xhr, ajaxOptions, thrownError) {
        alert(strServerError);
      },
      success: function(data) {
      	try{
          if($.parseJSON(data).status == -1){
          	window.location = loginPageLink;
          }
        }
        catch(err){
        }
        $('#modal-add-product').html(data);
        $('#modal-add-product').bPopup();
      }
    });
};

function postSearch() {

	searchValue = $("#search").val()

	if (searchValue != newSearchValue){
      searchValueChanged = true;
    }

	if (!blockSearchPageLoading){
		blockSearchPageLoading = true;
		$("span.search-button").show();
		setTimeout(function() {
			nextPageNr = 1;
			getNewProductPage(0, searchValue)
		}, searchDelay);	
	}
};

function getNewProductPage(pageNr, search) {

	//console.log("pageNr:" + pageNr + " search:" + search)

	newSearchValue = search;

	setTimeout(function() {
		$.ajax({
	      type: 'GET',
	      url: getProductsPageLink + "?page=" + pageNr + "&search_query=" + search,
	      data: '',
	      dataType: 'html',
	      error: function(xhr, ajaxOptions, thrownError) {
	        alert(strServerError);
	        allowToEdit = true;
	        allowToPost = true;
	      },
	      success: function(data) {
	      	try{
          		if($.parseJSON(data).status == -1){
          			window.location = loginPageLink;
          		}
        	}
        	catch(err){
        	}
	      	if (pageNr == 0){
	     
	      	 	$('tbody').html(data);
	      	 	allowToEdit = true;
	      	 	allowToPost = true;
	      	 	if (data.indexOf("last_page") != -1 || data.trim() == ""){
	      			blockPageLoading = true;
	      		}
	      		else{
	      			blockPageLoading = false;
	      		}
	      		if (searchValueChanged && (newSearchValue != searchValue)){
	      			blockSearchPageLoading = false;
	      			searchValueChanged = false;
	      			$("span.search-button").show();
	      			getNewProductPage(pageNr, searchValue)
	      		}
	      		else{
	      			blockSearchPageLoading = false;
	      			$("span.search-button").hide();
	      			scroolDetected();
	      		}
	      		
	      		if (data.trim().length > 0){
              		//scroolDetected();
              		$(".products-placeholder").hide();
              		$(".products-no-search-placeholder").hide();
              		$("#top-section").show();
              		$("#dummy-top").hide();
            	}
            	else{
            		if (search.length == ""){
		               	$(".products-placeholder").show();
		                $(".products-no-search-placeholder").hide();
		                $("#top-section").hide();
		                $("#dummy-top").show();
		            }
		            else{
		                $(".products-placeholder").hide();
		                $(".products-no-search-placeholder").show();
		                $("#top-section").show();
		                $("#dummy-top").hide();
		            }
            	}
	      		
	      	 	return true;
	      	}

	      	if (data.trim() == ""){
	      		blockPageLoading = true;
	      		$(".spinner").hide();
	      	}
	      	else{
	      		$('tbody').append(data);
	      		nextPageNr = nextPageNr + 1;
	      		if (data.indexOf("last_page") != -1){
	      			blockPageLoading = true;
	      		}
	      		else{
	      			blockPageLoading = false;
	      		}
	      		$(".spinner").hide();
	      	}
	        
	      }
	    });

	}, 100);
};

function deleteProductModal(){
  $("#modal-delete-product").bPopup();
  $('#modal-add-product').bPopup().close();
} 

function postProducts(deleteObject) {

	if (!allowToPost){
      return;
    }

	var product, price, allowToContinue;

	if (!deleteObject){

		product = $("input[name=description]").val();
		price = $("input[name=price]").val();

		allowToContinue = true;

		if (product.length == 0){
			$("input[name=description]").addClass("warning-input");
			allowToContinue = false;
		}

		if (price.length == 0){
			$("input[name=price]").addClass("warning-input");
			allowToContinue = false;
		}

		if (!allowToContinue){
			return;
		}

	}
	else{
		allowToEdit = false;
	}

	allowToPost = false;

    $.ajax({
		url: postProductsLink,
		type: "POST",
		data: $('#modal-add-product form').serialize() + (!!deleteObject ? '&delete=true' : ''),
		dataType: "JSON",
		success: function (msg) {
			try{
          		if(msg.status == -1){
          			window.location = loginPageLink;
          		}
        	}
        	catch(err){
        	}
			nextPageNr = 1;
			getNewProductPage(0, searchValue);

			if (deleteObject){
          		$("#modal-delete-product").bPopup().close();
        	}
        	else{
          		$('#modal-add-product').bPopup().close();
        	}
		},
		error: function(xhr, ajaxOptions, thrownError) {
			allowToEdit = true;
			allowToPost = true;
	  	},
    });

    return false;
};

function checkPriceInput(evt){

	evt = (evt) ? evt : window.event;
	var charCode = (evt.which) ? evt.which : evt.charCode;
	if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 44 && charCode != 46) { // 44 = ",", 46 = "."
		return false;
	}
	
	if ((evt.target.value.indexOf(",") != -1 || evt.target.value.indexOf(".") != -1) && (charCode == 44 || charCode == 46)){
		return false;
	}

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
