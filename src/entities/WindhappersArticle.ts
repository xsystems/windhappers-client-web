import { WindhappersSection } from './WindhappersSection';

export interface WindhappersArticle {
  abstract: string;
  created_by: {
    firstname: string;
    lastname: string;
  };
  id: number;
  poster: {
    alternativeText: string;
    caption: string;
    formats: {
      medium: {
        url: string;
      };
    };
  };
  sections: WindhappersSection[];
  title: string;
  updated_at: string;
}
