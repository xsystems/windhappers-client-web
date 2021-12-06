import { TemplateResult } from 'lit';

export interface Discipline {
  abstract: string;
  content: TemplateResult;
  id: number;
  image: string;
  role: string;
  title: string;
}
