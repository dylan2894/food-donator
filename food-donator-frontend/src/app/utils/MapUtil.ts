import { IMarker } from "../models/Imarker.model";
import { UserSettings } from "../models/inputs/user-settings.model";

export default class MapUtil {

  static RED_MARKER = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";
  static YELLOW_MARKER = "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png";
  static GREEN_MARKER = "https://maps.google.com/mapfiles/ms/icons/green-dot.png";

  // styles to hide pins (points of interest) and declutter the map
  static STYLES: Record<string, google.maps.MapTypeStyle[]> = {
    hidePoi: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
      {
        stylers: [
          { "color": "#0f1114" }
        ]
      }
    ],
    darkMode: [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
    ],
    darkMode2: [
      {
        featureType: "all",
        stylers: [
          { color: "#C0C0C0" }
        ]
      },{
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
          { color: "#CCFFFF" }
        ]
      },{
        featureType: "landscape",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  };

  getGreenMarker() {
    return MapUtil.GREEN_MARKER;
  }

  getYellowMarker() {
    return MapUtil.YELLOW_MARKER;
  }

  getRedMarker() {
    return MapUtil.RED_MARKER;
  }

  static getUserMapStyles(userMapSettings: UserSettings) {
    let styles: google.maps.MapTypeStyle[] = [];

    if(!userMapSettings.poi) {
      styles.push({
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      });
    }

    if(!userMapSettings.transit) {
      styles.push({
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      });
    }

    if(!userMapSettings.administrative) {
      styles.push({
        featureType: "administrative",
        stylers: [{ visibility: "off" }],
      });
    }

    // TODO set dark mode if user settings contain dark mode == true
    if(userMapSettings.dark_map) {
      styles = [...styles, ...this.STYLES["darkMode"]];
    }

    return styles;
  }

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
