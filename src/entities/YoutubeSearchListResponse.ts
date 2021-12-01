import { YoutubeSearchResult } from "./YoutubeSearchResult.js";

export interface YoutubeSearchListResponse {
  nextPageToken: string;
  items: YoutubeSearchResult[];
}
