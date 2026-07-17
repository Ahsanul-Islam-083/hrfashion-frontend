const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  rating: number;
  sizes: string[];
  colors: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Job {
  _id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  status: string;
  postedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobsResponse {
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Application {
  _id: string;
  jobId: string;
  userId: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter?: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  reviewedAt?: string;
  job?: Job; // Populated from backend
}

export interface WishlistItem {
  _id: string;
  userId: string;
  productId: string;
  addedAt: string;
  product?: Product; // Populated from backend
}

export const fetchProducts = async (params: URLSearchParams | string): Promise<ProductsResponse> => {
  const query = typeof params === "string" ? params : params.toString();
  const res = await fetch(`${API_URL}/api/products?${query}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export const fetchProductBySlug = async (slug: string): Promise<Product | null> => {
  const res = await fetch(`${API_URL}/api/products/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const fetchJobs = async (params: URLSearchParams | string): Promise<JobsResponse> => {
  const query = typeof params === "string" ? params : params.toString();
  const res = await fetch(`${API_URL}/api/careers?${query}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return res.json();
};

export const fetchJobById = async (id: string): Promise<Job | null> => {
  const res = await fetch(`${API_URL}/api/careers/${id}`, { next: { revalidate: 60 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch job");
  return res.json();
};

export const fetchMyApplications = async (token: string): Promise<Application[]> => {
  const res = await fetch(`${API_URL}/api/applications/mine`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
};

export const fetchWishlist = async (token: string): Promise<{ items: WishlistItem[] }> => {
  const res = await fetch(`${API_URL}/api/wishlist`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch wishlist");
  return res.json();
};

export const removeFromWishlist = async (productId: string, token: string): Promise<void> => {
  const res = await fetch(`${API_URL}/api/wishlist/${productId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to remove from wishlist");
};

export const addToWishlist = async (productId: string, token: string): Promise<WishlistItem> => {
  const res = await fetch(`${API_URL}/api/wishlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ productId })
  });
  if (!res.ok) throw new Error("Failed to add to wishlist");
  return res.json();
};

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string;
  createdAt: string;
}

export interface UsersResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApplicationsResponse {
  applications: Application[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AnalyticsOverview {
  totalProducts: number;
  totalJobs: number;
  openJobs: number;
  totalApplications: number;
  pendingApplications: number;
  totalUsers: number;
  applicationsByStatus: { pending: number; accepted: number; rejected: number };
  recentApplications: (Application & { jobTitle?: string })[];
}

const authFetch = (url: string, token: string, init?: RequestInit) =>
  fetch(url, { ...init, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...(init?.headers ?? {}) } });

export const fetchAnalyticsOverview = async (token: string): Promise<AnalyticsOverview> => {
  const res = await authFetch(`${API_URL}/api/analytics/overview`, token);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
};

export const createProduct = async (data: Partial<Product>, token: string): Promise<Product> => {
  const res = await authFetch(`${API_URL}/api/products`, token, { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
};

export const updateProduct = async (id: string, data: Partial<Product>, token: string): Promise<Product> => {
  const res = await authFetch(`${API_URL}/api/products/${id}`, token, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};

export const deleteProduct = async (id: string, token: string): Promise<void> => {
  const res = await authFetch(`${API_URL}/api/products/${id}`, token, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete product");
};

export const fetchCareersAdmin = async (token: string, params?: string): Promise<JobsResponse> => {
  const res = await authFetch(`${API_URL}/api/careers?status=all&limit=100${params ? `&${params}` : ""}`, token);
  if (!res.ok) throw new Error("Failed to fetch careers");
  return res.json();
};

export const createJob = async (data: Partial<Job>, token: string): Promise<Job> => {
  const res = await authFetch(`${API_URL}/api/careers`, token, { method: "POST", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to create job");
  return res.json();
};

export const updateJob = async (id: string, data: Partial<Job>, token: string): Promise<Job> => {
  const res = await authFetch(`${API_URL}/api/careers/${id}`, token, { method: "PUT", body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed to update job");
  return res.json();
};

export const deleteJob = async (id: string, token: string): Promise<void> => {
  const res = await authFetch(`${API_URL}/api/careers/${id}`, token, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete job");
};

export const fetchApplicationsAdmin = async (token: string, params?: string): Promise<ApplicationsResponse> => {
  const res = await authFetch(`${API_URL}/api/applications?limit=50${params ? `&${params}` : ""}`, token);
  if (!res.ok) throw new Error("Failed to fetch applications");
  return res.json();
};

export const updateApplicationStatus = async (id: string, status: string, token: string): Promise<Application> => {
  const res = await authFetch(`${API_URL}/api/applications/${id}/status`, token, { method: "PUT", body: JSON.stringify({ status }) });
  if (!res.ok) throw new Error("Failed to update application status");
  return res.json();
};

export const fetchUsers = async (token: string, params?: string): Promise<UsersResponse> => {
  const res = await authFetch(`${API_URL}/api/users?${params ?? ""}`, token);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const updateUserRole = async (id: string, role: string, token: string): Promise<AdminUser> => {
  const res = await authFetch(`${API_URL}/api/users/${id}/role`, token, { method: "PUT", body: JSON.stringify({ role }) });
  if (!res.ok) throw new Error("Failed to update user role");
  return res.json();
};

export const deleteUser = async (id: string, token: string): Promise<void> => {
  const res = await authFetch(`${API_URL}/api/users/${id}`, token, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
};
