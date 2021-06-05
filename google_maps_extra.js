// This sample uses the Autocomplete widget to help the user select a
// place, then it retrieves the address components associated with that
// place, and then it populates the form fields with those details.
// This sample requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script
// src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;

const componentForm = {
    center_lat: 'LatLng.lat'
    // street_number: 'short_name',
    // route: 'long_name',
    // locality: 'long_name',
    // administrative_area_level_1: 'short_name',
    // country: 'long_name',
    // postal_code: 'short_name'
};

/**
 * init auto complete text field
 * Requires google library loaded
 * @param elid
 */
function init_auto_complete(elid = 'center_loc'){
    if (typeof google !== 'object') return
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        document.getElementById(elid), {types: ['geocode']});

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    // autocomplete.setFields(['address_component']);
    autocomplete.setFields(['geometry']);

    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress(){
    // Get the place details from the autocomplete object.
    let place = autocomplete.getPlace();
    for (let component in componentForm) {
        document.getElementById(component).value = '';
        document.getElementById(component).disabled = false;
    }

    // Get each component of the address from the place details,
    // and then fill-in the corresponding field on the form.
    if (! place.hasOwnProperty('geometry') || !place.geometry.hasOwnProperty('location')) return
    let geo = place.geometry.location
    document.getElementById('center_lat').value = geo.lat();
    document.getElementById('center_lng').value = geo.lng();
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position){
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle(
                {center: geolocation, radius: position.coords.accuracy});
            autocomplete.setBounds(circle.getBounds());
        });
    }
}

/**
 *
 */
// eslint-disable-next-line no-unused-vars
function geocode_full_addr(){
  /* eslint-disable no-undef */
  geocoder.geocode({address: app.cuser.home_address.full_address}, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        app.cuser.home_address.geometry = results[0].geometry;
      } else {
        console.log("Geocode was not successful for the following reason: " + status);
      }
    }
  );
  /* eslint-enable no-undef */
}
