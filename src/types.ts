export enum ContentType {
  VIDEO = 'Video',
  PODCAST = 'Podcast',
  ARTICLE = 'Article',
  BOOK = 'Book'
}

export interface Review {
  id: string;
  title: string;
  author: string;
  rating: number;
  takeaways: string[];
  type: ContentType;
  tags: string[];
  url: string;
  coverImage: string;
}

export interface Experiment {
  id: string;
  title: string;
  problem: string;
  hypothesis: string;
  status: 'Running' | 'Success' | 'Failed' | 'Inconclusive';
  metric: string;
  resultSummary?: string;
  date: string;
}

export interface Reflection {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  imageUrl: string;
  categories: string[];
  url?: string;
}

export interface Term {
  id: string;
  term: string;
  definition: string;
  category: string;
  formula?: string;
  longDescription?: string;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  url: string;
  iconUrl: string;
  price: 'Free' | 'Freemium' | 'Paid';
}
