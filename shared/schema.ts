import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("parent").notNull(), // parent, admin
  parentName: text("parent_name"),
  childName: text("child_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  isPublished: boolean("is_published").default(true),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").default(5),
  isPublished: boolean("is_published").default(true),
});

export const programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ageRange: text("age_range").notNull(),
  features: text("features").array().notNull(),
  tuition: integer("tuition").notNull(),
  capacity: integer("capacity").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  frequency: text("frequency").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true),
});

export const admissionForms = pgTable("admission_forms", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email").notNull(),
  childName: text("child_name").notNull(),
  childAge: text("child_age").notNull(),
  desiredClass: text("desired_class").notNull(),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").default("pending"),
});

export const contactForms = pgTable("contact_forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").default("pending"),
});

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  isFromAdmin: boolean("is_from_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"), // info, warning, success, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const admissionSteps = pgTable("admission_steps", {
  id: serial("id").primaryKey(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  iconType: text("icon_type").default("image"), // image, icon
  iconClass: text("icon_class"), // fallback icon class
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mediaCovers = pgTable("media_covers", {
  id: serial("id").primaryKey(),
  outlet: text("outlet").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(), // TV, Báo, Online, Radio
  url: text("url"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const socialMediaLinks = pgTable("social_media_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  displayName: text("display_name"),
  followers: integer("followers").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const serviceRegistrations = pgTable("service_registrations", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email"),
  serviceName: text("service_name").notNull(),
  preferredTime: text("preferred_time"),
  notes: text("notes"),
  status: text("status").default("pending"), // pending, contacted, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Affiliate system tables
export const affiliateMembers = pgTable("affiliate_members", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).unique().notNull(), // UUID
  username: varchar("username", { length: 50 }).unique().notNull(), // User-friendly login name
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  memberType: varchar("member_type", { length: 50 }).notNull(), // "teacher" or "parent"
  categoryName: varchar("category_name", { length: 100 }).notNull(), // "Chăm sóc phụ huynh" or "Đại sứ thương hiệu"
  sponsorId: varchar("sponsor_id", { length: 50 }), // Reference to sponsor's memberId
  qrCode: text("qr_code"), // Base64 encoded QR code
  referralLink: varchar("referral_link", { length: 500 }).unique(),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  privateKey: text("private_key"), // Encrypted
  tokenBalance: decimal("token_balance", { precision: 18, scale: 8 }).default("0"),
  totalReferrals: integer("total_referrals").default(0),
  level: integer("level").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const affiliateTransactions = pgTable("affiliate_transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 100 }).unique().notNull(),
  fromMemberId: varchar("from_member_id", { length: 50 }).notNull(),
  toMemberId: varchar("to_member_id", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // "referral_bonus", "transfer", "dex_trade"
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "completed", "failed"
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const affiliateRewards = pgTable("affiliate_rewards", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  referredMemberId: varchar("referred_member_id", { length: 50 }).notNull(),
  rewardAmount: decimal("reward_amount", { precision: 18, scale: 8 }).notNull(),
  rewardType: varchar("reward_type", { length: 50 }).notNull(), // "direct_referral", "indirect_referral"
  level: integer("level").notNull(), // Level in the tree
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Customer tracking for F1 agents
export const customerConversions = pgTable("customer_conversions", {
  id: serial("id").primaryKey(),
  customerId: varchar("customer_id", { length: 50 }).unique().notNull(), // UUID
  f1AgentId: varchar("f1_agent_id", { length: 50 }).notNull(), // Reference to affiliate member
  f0ReferrerId: varchar("f0_referrer_id", { length: 50 }), // Reference to F0 who referred the F1
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  conversionStatus: varchar("conversion_status", { length: 20 }).default("potential"), // "potential" (red), "high_conversion" (yellow), "payment_completed" (green)
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commission settings for automatic distribution
export const commissionSettings = pgTable("commission_settings", {
  id: serial("id").primaryKey(),
  f1CommissionPercent: decimal("f1_commission_percent", { precision: 5, scale: 2 }).default("30.00"), // 30% for F1
  f0CommissionPercent: decimal("f0_commission_percent", { precision: 5, scale: 2 }).default("15.00"), // 15% for F0
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Commission transactions
export const commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 100 }).unique().notNull(),
  customerId: varchar("customer_id", { length: 50 }).notNull(),
  recipientId: varchar("recipient_id", { length: 50 }).notNull(), // F1 or F0 member ID
  recipientType: varchar("recipient_type", { length: 10 }).notNull(), // "F1" or "F0"
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  baseAmount: decimal("base_amount", { precision: 10, scale: 2 }).notNull(), // Original payment amount
  commissionPercent: decimal("commission_percent", { precision: 5, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "completed", "failed"
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Withdrawal Requests Table
export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  bankInfo: text("bank_info"), // JSON string for bank details
  requestNote: text("request_note"),
  adminNote: text("admin_note"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected, paid
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  paidAt: timestamp("paid_at"),
  processedBy: varchar("processed_by", { length: 50 }), // admin username
});

export const dexTrades = pgTable("dex_trades", {
  id: serial("id").primaryKey(),
  tradeId: varchar("trade_id", { length: 100 }).unique().notNull(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  tradeType: varchar("trade_type", { length: 20 }).notNull(), // "buy", "sell"
  tokenAmount: decimal("token_amount", { precision: 18, scale: 8 }).notNull(),
  ethAmount: decimal("eth_amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"), // "pending", "completed", "failed"
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction history for wallet statements
export const transactionHistory = pgTable("transaction_history", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // "payment_received", "commission_earned", "bonus_received", "withdrawal"
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  balanceBefore: decimal("balance_before", { precision: 15, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("completed"), // "completed", "pending", "failed"
  referenceId: varchar("reference_id", { length: 100 }), // Reference to commission transaction or other source
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedAt: true,
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
});

export const insertProgramSchema = createInsertSchema(programs).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertAdmissionFormSchema = createInsertSchema(admissionForms).omit({
  id: true,
  submittedAt: true,
  status: true,
});

export const insertContactFormSchema = createInsertSchema(contactForms).omit({
  id: true,
  submittedAt: true,
  status: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertAdmissionStepSchema = createInsertSchema(admissionSteps).omit({
  id: true,
  updatedAt: true,
});

export const insertMediaCoverSchema = createInsertSchema(mediaCovers).omit({
  id: true,
  createdAt: true,
});

export const insertSocialMediaLinkSchema = createInsertSchema(socialMediaLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceRegistrationSchema = createInsertSchema(serviceRegistrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCustomerConversionSchema = createInsertSchema(customerConversions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommissionSettingSchema = createInsertSchema(commissionSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertCommissionTransactionSchema = createInsertSchema(commissionTransactions).omit({
  id: true,
  createdAt: true,
});

export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests).omit({
  id: true,
  requestedAt: true,
  processedAt: true,
  paidAt: true,
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;

// Type exports for customer conversion tracking
export type CustomerConversion = typeof customerConversions.$inferSelect;
export type InsertCustomerConversion = z.infer<typeof insertCustomerConversionSchema>;
export type CommissionSetting = typeof commissionSettings.$inferSelect;
export type InsertCommissionSetting = z.infer<typeof insertCommissionSettingSchema>;
export type CommissionTransaction = typeof commissionTransactions.$inferSelect;
export type InsertCommissionTransaction = z.infer<typeof insertCommissionTransactionSchema>;

export const insertAffiliateMemberSchema = createInsertSchema(affiliateMembers).omit({
  id: true,
  memberId: true,
  qrCode: true,
  referralLink: true,
  walletAddress: true,
  privateKey: true,
  tokenBalance: true,
  totalReferrals: true,
  level: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
});

export const updateAffiliateMemberSchema = createInsertSchema(affiliateMembers).omit({
  id: true,
  memberId: true,
  createdAt: true,
}).partial();

export const insertAffiliateTransactionSchema = createInsertSchema(affiliateTransactions).omit({
  id: true,
  transactionId: true,
  status: true,
  blockchainTxHash: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAffiliateRewardSchema = createInsertSchema(affiliateRewards).omit({
  id: true,
  isProcessed: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDexTradeSchema = createInsertSchema(dexTrades).omit({
  id: true,
  tradeId: true,
  status: true,
  blockchainTxHash: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTransactionHistorySchema = createInsertSchema(transactionHistory).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Article = typeof articles.$inferSelect;
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Program = typeof programs.$inferSelect;
export type InsertProgram = z.infer<typeof insertProgramSchema>;
export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type AdmissionForm = typeof admissionForms.$inferSelect;
export type InsertAdmissionForm = z.infer<typeof insertAdmissionFormSchema>;
export type ContactForm = typeof contactForms.$inferSelect;
export type InsertContactForm = z.infer<typeof insertContactFormSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type AdmissionStep = typeof admissionSteps.$inferSelect;
export type InsertAdmissionStep = z.infer<typeof insertAdmissionStepSchema>;
export type MediaCover = typeof mediaCovers.$inferSelect;
export type InsertMediaCover = z.infer<typeof insertMediaCoverSchema>;
export type SocialMediaLink = typeof socialMediaLinks.$inferSelect;
export type InsertSocialMediaLink = z.infer<typeof insertSocialMediaLinkSchema>;
export type ServiceRegistration = typeof serviceRegistrations.$inferSelect;
export type InsertServiceRegistration = z.infer<typeof insertServiceRegistrationSchema>;

export type AffiliateMember = typeof affiliateMembers.$inferSelect;
export type InsertAffiliateMember = z.infer<typeof insertAffiliateMemberSchema>;

export type AffiliateTransaction = typeof affiliateTransactions.$inferSelect;
export type InsertAffiliateTransaction = z.infer<typeof insertAffiliateTransactionSchema>;

export type AffiliateReward = typeof affiliateRewards.$inferSelect;
export type InsertAffiliateReward = z.infer<typeof insertAffiliateRewardSchema>;

export type DexTrade = typeof dexTrades.$inferSelect;
export type InsertDexTrade = z.infer<typeof insertDexTradeSchema>;

export type TransactionHistory = typeof transactionHistory.$inferSelect;
export type InsertTransactionHistory = z.infer<typeof insertTransactionHistorySchema>;

// Homepage content table
export const homepageContent = pgTable("homepage_content", {
  id: serial("id").primaryKey(),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  highlight1Title: text("highlight1_title").notNull(),
  highlight1Desc: text("highlight1_desc").notNull(),
  highlight2Title: text("highlight2_title").notNull(),
  highlight2Desc: text("highlight2_desc").notNull(),
  highlight3Title: text("highlight3_title").notNull(),
  highlight3Desc: text("highlight3_desc").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHomepageContentSchema = createInsertSchema(homepageContent).omit({
  id: true,
  updatedAt: true,
});

export type HomepageContent = typeof homepageContent.$inferSelect;
export type InsertHomepageContent = z.infer<typeof insertHomepageContentSchema>;
