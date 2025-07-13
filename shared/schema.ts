import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
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
