export interface FlickrPhotosets {
  page: number;
  pages: number;
  photoset: {
    description: {
      _content: string;
    };
    id: string;
    farm: number;
    primary: string;
    secret: string;
    server: string;
    title: {
      _content: string;
    };
  }[];
}
