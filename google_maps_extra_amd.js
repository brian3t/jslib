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
export default function init_auto_complete(elid = 'center_loc'){
  if (typeof google !== 'object') return
  // Create the autocomplete object, restricting the search predictions to
  // geographical location types.
  const ele = document.getElementById(elid)
  autocomplete = new google.maps.places.Autocomplete(
    ele, {
      componentRestrictions: { country: ["us", "ca"] },
      fields: ["address_components", "geometry"],
      types: ["address"],
    });

  ele.focus()
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
  const place = autocomplete.getPlace()
  let address1 = "";
  let postcode = "";


  for (const component of place.address_components) {
    const componentType = component.types[0];

    switch (componentType) {
      case "street_number": {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case "route": {
        address1 += component.short_name;
        break;
      }

      case "postal_code": {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case "postal_code_suffix": {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case "locality":
        document.querySelector("#locality").value = component.long_name;
        break;

      case "administrative_area_level_1": {
        document.querySelector("#state").value = component.short_name;
        break;
      }
      case "country":
        document.querySelector("#country").value = component.long_name;
        break;
      default:
        break;
    }
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  if (! place.hasOwnProperty('geometry') || ! place.geometry.hasOwnProperty('location')) return
  const geo = place.geometry.location
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

