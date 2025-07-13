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
