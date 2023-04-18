import { IMarker } from "../models/Imarker.model";

export default class MapUtil {

  static RED_MARKER = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
  static YELLOW_MARKER = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
  static GREEN_MARKER = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";

  // styles to hide pins (points of interest) and declutter the map
  static STYLES: Record<string, google.maps.MapTypeStyle[]> = {
    hide: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      }
    ],
  };

  getBoundsByMarkers(markers: IMarker[]){
    let north = 0;
    let south = 0;
    let east = 0;
    let west = 0;


    for (const marker of markers){
      // set the coordinates to marker's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.

      const lat: number = marker.position.lat;
      const lon: number = marker.position.lng;

      north = north !== 0 ? Math.max(north, lat) : lat;
      south = south !== 0 ? Math.min(south, lat) : lat;
      east = east !== 0 ? Math.max(east, lon) : lon;
      west = west !== 0 ? Math.min(west, lon) : lon;
    }

    north += 0.005;
    south -= 0.002;
    //east += 0.005;
    //west += 0.01;

    const bounds: google.maps.LatLngBoundsLiteral = { north: north, south: south, east: east, west: west };
    return bounds;
  }

  getBoundsByPosition(positions: google.maps.LatLngLiteral[]){
    let north = 0;
    let south = 0;
    let east = 0;
    let west = 0;

    for (const position of positions){
      // set the coordinates to position's lat and lng on the first run.
      // if the coordinates exist, get max or min depends on the coordinates.

      const lat: number = position.lat;
      const lon: number = position.lng;

      north = north !== 0 ? Math.max(north, lat) : lat;
      south = south !== 0 ? Math.min(south, lat) : lat;
      east = east !== 0 ? Math.max(east, lon) : lon;
      west = west !== 0 ? Math.min(west, lon) : lon;
    }

    north += 0.005;
    south -= 0.002;
    //east += 0.005;
    //west += 0.01;

    const bounds: google.maps.LatLngBoundsLiteral = { north: north, south: south, east: east, west: west };
    return bounds;
  }
}
