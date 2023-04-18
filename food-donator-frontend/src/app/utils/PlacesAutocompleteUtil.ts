import { GoogleMap } from "@angular/google-maps";

export default class {

  public currentSelectedAddress: string | undefined = undefined;
  public currentSelectedCoords: google.maps.LatLng | undefined = undefined;

  placeAutocomplete(map: GoogleMap) {
    const options = {
      fields: ["formatted_address", "geometry", "name"],
      strictBounds: true,
      componentRestrictions: { country: "za" }
    };

    const autocomplete =
    new google.maps.places.Autocomplete(
      $('#placesField')[0] as HTMLInputElement,
      options);

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;

    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
      map: map.googleMap,
      anchorPoint: new google.maps.Point(0, -29)
    });

    // Create a marker
    // const marker = {
    //   position: {
    //     lat: this.currentUser.lat!,
    //     lng: this.currentUser.lon!
    //   },
    //   label: {
    //     color: "black",
    //     text: this.currentUser.name!
    //   },
    //   options: {
    //     animation: google.maps.Animation.BOUNCE
    //   }
    // }

    // Push the user's saved location to the markers array for rendering
    // this.markers.push(this.userMarker);

    // prevent the user from bypassing the places Autocomplete
    const input = document.getElementById('placesField') as HTMLInputElement;
    input?.addEventListener("change", () => {
      input.value = "";
      this.currentSelectedCoords = undefined;
      this.currentSelectedAddress = undefined;
    });

    autocomplete.addListener("place_changed", () => {
      infowindow.close();
      marker.setVisible(false);

      const place = autocomplete.getPlace();

      if (!place.geometry || !place.geometry.location) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.center = place.geometry.location;
        map.zoom = 21;
      }

      // set current selected coordinates
      this.currentSelectedCoords = place.geometry.location;
      // set current selected address
      this.currentSelectedAddress = place.formatted_address?.toString();

      // console.log(this.currentSelectedCoords.lat() + ", " + this.currentSelectedCoords.lng())
      // console.log(this.currentSelectedAddress)

      marker.setPosition(place.geometry.location);
      marker.setVisible(true);

      // const placeName = document.getElementById('placeName') as HTMLSpanElement;
      // const placeAddress = document.getElementById('placeAddress') as HTMLSpanElement;
      // const addressInput = $('#placesField')[0] as HTMLInputElement;
      // placeAddress.textContent = addressInput.value;

      // if(place.name != null) {
      //   console.log("Place name: " + place.name)
      //   placeName.innerHTML = place.name;
      // }
      // if(place.formatted_address != null) {
      //   console.log("Place address: " + place.formatted_address)
      //   placeAddress.innerHTML = place.formatted_address;
      // }

      //infowindow.open(map.googleMap, marker); //pass anchor marker through here
    });
  }
}
