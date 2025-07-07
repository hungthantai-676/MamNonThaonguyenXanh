import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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
