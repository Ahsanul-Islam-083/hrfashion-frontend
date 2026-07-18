export const QUERY_KEYS = {
  wishlist: () => ["wishlist"] as const,
  applications: () => ["applications", "mine"] as const,
  products: (params?: string) => params ? ["products", params] as const : ["products"] as const,
  product: (id: string) => ["product", id] as const,
  careers: (params?: string) => params ? ["careers", params] as const : ["careers"] as const,
  job: (id: string) => ["job", id] as const,
  reviews: (productId: string) => ["reviews", productId] as const,
  services: () => ["services"] as const,
  team: () => ["team"] as const,
  interviews: () => ["interviews", "mine"] as const,
  interviewByApp: (applicationId: string) => ["interview", "application", applicationId] as const,
  recommendations: () => ["recommendations"] as const,
  admin: {
    overview: () => ["admin", "overview"] as const,
    products: (params?: string) => params ? ["admin", "products", params] as const : ["admin", "products"] as const,
    careers: (params?: string) => params ? ["admin", "careers", params] as const : ["admin", "careers"] as const,
    applications: (params?: string) => params ? ["admin", "applications", params] as const : ["admin", "applications"] as const,
    users: (params?: string) => params ? ["admin", "users", params] as const : ["admin", "users"] as const,
    interviews: (params?: string) => params ? ["admin", "interviews", params] as const : ["admin", "interviews"] as const,
  }
};

