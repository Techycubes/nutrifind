export type Nutriments = Record<string, number | undefined>;

export interface Product {
  code?: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  nutriments?: Nutriments;
  nutriscore_grade?: string;
  nova_group?: number | string;
  additives_tags?: string[];
  ingredients_text?: string;
  categories?: string;
  categories_tags?: string[];
}

export interface ScoredProduct {
  score: number;
  grade: string;
  color: string;
  positives: string[];
  warnings: string[];
  additives: Array<{ name: string; risk: "low" | "moderate" | "high" }>;
}
