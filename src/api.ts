const API_BASE = "https://dashboard-saas-back-end.onrender.com"; 
export interface CreatePaymentDTO {
  orderId: string;
  userId: string;
  amount: number;
  status:PaymentStatus;
  method?: String;
}

export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus =
  typeof PaymentStatus[keyof typeof PaymentStatus];
// Auth interfaces
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      email: string;
      name: string;
      role: string;
      status: string;
      phone?: string;
      avatar?: string;
    };
    token: string;
  };
}

export interface UserProfile {
  _id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  avatar?: string;
  phone?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}



export interface Order {
  _id?: string;
  userId: String;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  method?:string;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  _id?: string;
  userId: string;
  orderId: string;
  amount: number;
  method: string;
  status: string;
  createdAt: string | Date;  
  transactionId:string;
  updatedAt: string | Date; 
  metadata?: Record<string, any>;
  paymentMethod?: string; 
  provider?: string; 
}


export interface UserResponse {
  _id: string;
  avatar: string;
  email: string;
  name: string;
  role?: "admin" | "user" | "moderator";
  status: "active" | "suspended" | "pending";
  lastloggedin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}
export interface ProductResponse {
  data: Product[];
  success: boolean;
}
export interface UserType {
  _id?: string;
  email: string;
  password?: string;
  name: string;
  role:string;
  status:string;
  avatar?:string;
  phone?: string;
  address?: Address;
  createdAt?: Date;
  updatedAt?: Date;
}

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type OrderStatus =
  typeof OrderStatus[keyof typeof OrderStatus];

// Auth storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

// Enhanced HTTP client with auth headers
async function http<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  console.log(`${API_BASE}${url}`);
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>
  };

  // Add auth token if available
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${url}`, {
    headers,
    ...options
  });

  // Handle 401 Unauthorized (token expired)
  if (res.status === 401) {
    clearAuth();
    window.location.href = '/login.html';
    throw new Error('Session expired. Please login again.');
  }

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(`HTTP ${res.status}: ${msg}`);
  }

  return res.json() as Promise<T>;
}

// ***** Auth Functions *****//
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const options = {
    method: "POST",
    body: JSON.stringify(credentials)
  }
  return await http("/auth/login", options);
}

export async function register(userData: RegisterData): Promise<AuthResponse> {
  const options = {
    method: "POST",
    body: JSON.stringify(userData)
  }
  return await http("/auth/register", options);
}

export async function getProfile(): Promise<UserProfile> {
  const options = {
    method: "GET"
  }
  const response = await http<{ success: boolean; data: UserProfile }>("/auth/profile", options);
  return response.data;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const options = {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword })
  }
  return await http("/auth/change-password", options);
}

export async function refreshToken(): Promise<AuthResponse> {
  const options = {
    method: "POST"
  }
  return await http("/auth/refresh-token", options);
}

// ***** Auth Storage Functions *****//
export function saveAuth(token: string, user: any): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): any | null {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function isAdmin(): boolean {
  const user = getUser();
  return user?.role === 'admin';
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function logout(): void {
  clearAuth();
  window.location.href = '/login.html';
}

// **** User Functions *****//
export async function createUser(user: UserType): Promise<UserType> {
  const options = {
    method: "POST",
    body: JSON.stringify(user)
  }
  return await http("/users", options);
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const options = {
    method: "GET",    
  }
  const res: any = await http("/users", options);
  return res.data;
}

export async function Updateuse(data: UserType, id: string): Promise<UserType> {
  const options = {
    method: "PUT",  
    body: JSON.stringify(data)  
  }
  return await http(`/users/${id}`, options);
}

export async function deleteUser(id: string): Promise<UserType> {
  const options = {
    method: "DELETE",  
  }
  return await http(`/users/${id}`, options);
}

export async function getOneUser(id: string): Promise<UserType> {
  const options = {
    method: "GET",  
  }
  return await http(`/users/${id}`, options);
}

// ***** Order Functions *****//
export async function createOrer(order: Order): Promise<Order> {
  const options = {
    method: "POST",
    body: JSON.stringify(order)
  }
  return await http("/orders", options);
}

export async function getAllOrders(): Promise<Order[]> {
  const options = {
    method: "GET",    
  }
  return await http("/orders", options);
}

export async function UpdateOrder(data: Order, id: string): Promise<Order> {
  const options = {
    method: "PUT",
    body: JSON.stringify(data)
  }
  return await http(`/orders/${id}/status`, options);
}

export async function cancelOrders(id: string): Promise<Order> {
  const options = {
    method: "PUT",  
  }
  return await http(`/orders/${id}/cancel`, options);
}

export async function getOneorder(id: string): Promise<Order> {
  const options = {
    method: "GET",  
  }
  return await http(`/orders/${id}`, options);
}

export async function deleteOrder(id: string): Promise<Order> {
  const options = {
    method: "DELETE",  
  }
  return await http(`/orders/${id}/delete`, options);
}
// ***** Products function *****//
export async function createProduct(product: Product): Promise<Product> {
  const options = {
    method: "POST",
    body: JSON.stringify(product)
  }
  return await http("/products", options);
}

export async function getAllProducts(): Promise<ProductResponse> {
  const options = {
    method: "GET",    
  }
  return await http("/products", options);
}

export async function UpdateProduct(data: Product, id: string): Promise<Product> {
  const options = {
    method: "PUT",  
    body: JSON.stringify(data)  
  }
  return await http(`/products/${id}`, options);
}

export async function deleteProducts(id: string): Promise<Product> {
  const options = {
    method: "DELETE",  
  }
  return await http(`/products/${id}`, options);
}

export async function getOneProduct(id: string): Promise<Product> {
  const options = {
    method: "GET",  
  }
  return await http(`/products/${id}`, options);
}

// ***** Payment Functions *****//
export async function completePayments(data: CreatePaymentDTO): Promise<Payment> {
  const options = {
    method: "POST",
    body: JSON.stringify(data)
  }
  return await http("/payments", options);
}

export async function getAllPament(): Promise<Payment[]> {
  const options = {
    method: "GET",    
  }
  const p:any= await http("/payments", options);
  return p?.data;
}

export async function GetOnePayment(id: string): Promise<Payment> {
  const options = {
    method: "GET",  
  }
  return await http(`/payments/${id}`, options);
}

export async function GetPaymentByOrderId(id: string): Promise<Payment> {
  const options = {
    method: "GET",  
  }
  return await http(`/payments/order/${id}`, options);
}

export async function ProcessPayment(id: string): Promise<Payment> {
  const options = {
    method: "PUT",  
  }
  return await http(`/payments/${id}/process`, options);
}

export async function UpdatePaymentStatus(id: string): Promise<Payment> {
  const options = {
    method: "PUT",  
  }
  return await http(`/payments/${id}`, options);
}

export async function Refund(id: string): Promise<Payment> {
  const options = {
    method: "PUT",  
  }
  return await http(`/payments/${id}/refund`, options);
}

// Export auth utilities
export const auth = {
  login,
  register,
  getProfile,
  changePassword,
  refreshToken,
  saveAuth,
  getToken,
  getUser,
  isAuthenticated,
  isAdmin,
  clearAuth,
  logout
};