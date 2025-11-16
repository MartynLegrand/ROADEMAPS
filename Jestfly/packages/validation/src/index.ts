import { z } from 'zod';

// User Validation Schemas
export const userSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(50),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/),
  displayName: z.string().min(1).max(50),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Content Validation Schemas
export const contentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
  type: z.enum(['video', 'audio', 'image', 'text', 'live']),
  url: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
});

export const createContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
  type: z.enum(['video', 'audio', 'image', 'text', 'live']),
});

// Community Validation Schemas
export const communitySchema = z.object({
  name: z.string().min(3).max(50),
  description: z.string().max(1000),
  isPrivate: z.boolean().default(false),
  avatarUrl: z.string().url().optional(),
  bannerUrl: z.string().url().optional(),
});

export const joinCommunitySchema = z.object({
  communityId: z.string().uuid(),
});

// Wallet & Transaction Validation Schemas
export const createWalletSchema = z.object({
  address: z.string().min(1),
  currency: z.string().length(3).default('USD'),
});

export const transactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['deposit', 'withdrawal', 'purchase', 'sale', 'tip']),
  metadata: z.record(z.any()).optional(),
});

// NFT Validation Schemas
export const nftSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  imageUrl: z.string().url(),
  metadata: z.record(z.any()),
  price: z.number().positive().optional(),
  forSale: z.boolean().default(false),
});

export const mintNFTSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000),
  imageUrl: z.string().url(),
  metadata: z.record(z.any()).optional().default({}),
});

// Notification Validation Schemas
export const notificationSchema = z.object({
  type: z.enum(['follow', 'like', 'comment', 'mention', 'system', 'transaction']),
  title: z.string().min(1).max(100),
  message: z.string().max(500),
  data: z.record(z.any()).optional(),
});

// Store Validation Schemas
export const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000),
  price: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).min(1),
  category: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

export const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().positive(),
  })).min(1),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    zipCode: z.string().min(1),
  }).optional(),
});

// Streaming Validation Schemas
export const streamSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
});

export const startStreamSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000),
});

// Job & Career Validation Schemas
export const jobSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(10000),
  location: z.string().min(1),
  type: z.enum(['full_time', 'part_time', 'contract', 'freelance']),
  salary: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  benefits: z.array(z.string()).default([]),
  expiresAt: z.string().datetime().optional(),
});

export const applicationSchema = z.object({
  jobId: z.string().uuid(),
  coverLetter: z.string().max(5000),
  resumeUrl: z.string().url(),
});

// Pagination Validation Schema
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  perPage: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Export all schemas
export const schemas = {
  user: userSchema,
  register: registerSchema,
  login: loginSchema,
  content: contentSchema,
  createContent: createContentSchema,
  community: communitySchema,
  joinCommunity: joinCommunitySchema,
  createWallet: createWalletSchema,
  transaction: transactionSchema,
  nft: nftSchema,
  mintNFT: mintNFTSchema,
  notification: notificationSchema,
  product: productSchema,
  createOrder: createOrderSchema,
  stream: streamSchema,
  startStream: startStreamSchema,
  job: jobSchema,
  application: applicationSchema,
  pagination: paginationSchema,
};

export type Schemas = typeof schemas;
