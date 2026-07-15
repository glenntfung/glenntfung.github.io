export interface BlogPostMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPostMeta[] = [
  {
    slug: "vmf",
    title: "The von Mises–Fisher Distribution",
    summary: "A mathematical introduction to directional data, Bessel-function asymptotics, and stable normalization on the hypersphere.",
    date: "2026-07-14",
    tags: ["Statistics", "ML"],
  },
  {
    slug: "bayesian-nonparametric-clustering",
    title: "Introduction to Bayesian Nonparametric Clustering",
    summary: "How Dirichlet processes become clustering models through the CRP, stick-breaking, and mixture likelihoods.",
    date: "2026-07-14",
    tags: ["Statistics", "ML"],
  },
  {
    slug: "linear",
    title: "When Linear Models Outshine the Fancy Stuff",
    summary: "A reminder that simple ≠ weak.",
    date: "2025-08-07",
    tags: ["ML", "Statistics"],
  },
  {
    slug: "nn",
    title: "Neural Networks, CNNs, RNNs, Transformers, and Beyond",
    summary: "A (long) introduction to neural nets, and popular options of CNNs, RNNs, Transformers, and other modern machine learning models",
    date: "2025-05-21",
    tags: ["ML", "DL"],
  },
  {
    slug: "predoc",
    title: "Applying for Predoctoral Positions in Social Sciences and Business",
    summary: "A brief review of my predoc applications during AY 2024–2025",
    date: "2025-03-01",
    tags: ["Applications"],
  },
  {
    slug: "fonts",
    title: "Some fonts in LaTeX",
    summary: "Times New Roman, Palatino, Garamond, Erewhon, Georgia",
    date: "2024-05-16",
    tags: ["Typesetting", "LaTeX"],
  },
  {
    slug: "cj",
    title: "Comparative Judgment, Pairwise Comparison, and Bradley–Terry Model",
    summary: "Using pairwise comparison data to assess abilities",
    date: "2023-12-12",
    tags: ["Statistics", "ML"],
  },
  {
    slug: "tex",
    title: "Learn LaTeX Quickly",
    summary: "A quick guide to LaTeX",
    date: "2023-01-15",
    tags: ["LaTeX", "Typesetting"],
  },
];
