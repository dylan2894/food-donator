export interface IMarker {
  id?: string,
  phoneNum?: string,
  address?: string,
  position: {
    lat: number,
    lng: number
  },
  label?: {
    color: string,
    text: string
  },
  title?: string,
  info?: string,
  options?: {
    animation: google.maps.Animation,
    icon?: {
      url: string
    }
  }
}
