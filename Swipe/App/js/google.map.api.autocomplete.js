function initializeGoogleMapApi(){
    try{
      var input = document.getElementById('legal_address');
      var autocomplete = new google.maps.places.Autocomplete(input);

      google.maps.event.addListener(autocomplete, 'place_changed', function() {
          var place = autocomplete.getPlace();

          var componentForm = {
            street_number: 'short_name',
            route: 'long_name',
            locality: 'long_name',
            //administrative_area_level_1: 'short_name',
            postal_code: 'short_name',
            country: 'long_name',
          };

          var addressString = ""
          for (var i = 0; i < place.address_components.length; i++) {
            var addressType = place.address_components[i].types[0];
            if (componentForm[addressType]) {
                val = place.address_components[i][componentForm[addressType]];
                if (addressType == 'route' || addressType == 'locality' || addressType == 'postal_code'){
                  addressString = addressString + val + ", ";
                }
                else{
                  if (addressType == 'country'){
                    var country = val;
                  }
                  else{
                    addressString = addressString + val + " ";
                  }
                }
            }
          }
          
          $("#legal_address").val(addressString + country);
      });
    }
    catch(err){
      
    }
}