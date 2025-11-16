// Core User Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  followers: number;
  following: number;
  totalViews: number;
  totalLikes: number;
}

// Authentication Types
export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  username: string;
  displayName: string;
}

// Content Types
export interface Content {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: ContentType;
  url?: string;
  thumbnailUrl?: string;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export enum ContentType {
  VIDEO = 'video',
  AUDIO = 'audio',
  IMAGE = 'image',
  TEXT = 'text',
  LIVE = 'live',
}

// Community Types
export interface Community {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  memberCount: number;
  isPrivate: boolean;
  avatarUrl?: string;
  bannerUrl?: string;
  createdAt: Date;
}

export interface CommunityMember {
  userId: string;
  communityId: string;
  role: CommunityRole;
  joinedAt: Date;
}

export enum CommunityRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  MEMBER = 'member',
}

// Wallet & NFT Types
export interface Wallet {
  id: string;
  userId: string;
  address: string;
  balance: number;
  currency: string;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  walletId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  PURCHASE = 'purchase',
  SALE = 'sale',
  TIP = 'tip',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export interface NFT {
  id: string;
  tokenId: string;
  contractAddress: string;
  ownerId: string;
  creatorId: string;
  name: string;
  description: string;
  imageUrl: string;
  metadata: Record<string, any>;
  price?: number;
  forSale: boolean;
  createdAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  data?: Record<string, any>;
  createdAt: Date;
}

export enum NotificationType {
  FOLLOW = 'follow',
  LIKE = 'like',
  COMMENT = 'comment',
  MENTION = 'mention',
  SYSTEM = 'system',
  TRANSACTION = 'transaction',
}

// Store Types
export interface Product {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  images: string[];
  category: string;
  tags: string[];
  createdAt: Date;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  shippingAddress?: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

// Streaming Types
export interface Stream {
  id: string;
  userId: string;
  title: string;
  description: string;
  isLive: boolean;
  viewerCount: number;
  streamKey: string;
  streamUrl?: string;
  thumbnailUrl?: string;
  startedAt?: Date;
  endedAt?: Date;
}

// Analytics Types
export interface Analytics {
  userId: string;
  period: AnalyticsPeriod;
  views: number;
  uniqueVisitors: number;
  likes: number;
  comments: number;
  shares: number;
  revenue: number;
  topContent: string[];
}

export enum AnalyticsPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
}

// Career Types
export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  type: JobType;
  salary?: string;
  requirements: string[];
  benefits: string[];
  postedAt: Date;
  expiresAt?: Date;
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  coverLetter: string;
  resumeUrl: string;
  status: ApplicationStatus;
  appliedAt: Date;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface ResponseMeta {
  page?: number;
  perPage?: number;
  total?: number;
  totalPages?: number;
}

// Pagination Types
export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
