export interface Marker {
  id: string;
  title: string;
  lat: number;
  lng: number;
}

export interface MarkerResponse {
  markers: Marker[];
}
