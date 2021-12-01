export interface FlickrPhotoset {
  page: number;
  pages: number;
  photo: {
    description: {
      _content: string;
    };
    id: string;
    farm: number;
    secret: string;
    server: string;
    title: string;
  }[];
}
