export interface GoogleMapsMarker {
  latitude: number;
  longitude: number;
  title: string;
  icon: string;
  info: {
    content: string;
    open: boolean;
  };
}
