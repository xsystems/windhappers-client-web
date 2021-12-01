import { TemplateResult } from "lit-html";

export interface Discipline {
  abstract: string;
  content: TemplateResult;
  id: number;
  image: string;
  role: string;
  title: string;
}
