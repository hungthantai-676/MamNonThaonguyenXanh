import { users, articles, testimonials, programs, activities, admissionForms, contactForms, chatMessages, notifications, admissionSteps, mediaCovers, type User, type InsertUser, type Article, type InsertArticle, type Testimonial, type InsertTestimonial, type Program, type InsertProgram, type Activity, type InsertActivity, type AdmissionForm, type InsertAdmissionForm, type ContactForm, type InsertContactForm, type ChatMessage, type InsertChatMessage, type Notification, type InsertNotification, type AdmissionStep, type InsertAdmissionStep, type MediaCover, type InsertMediaCover } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Article methods
  getArticles(): Promise<Article[]>;
  getArticle(id: number): Promise<Article | undefined>;
  getArticlesByCategory(category: string): Promise<Article[]>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: number, article: Partial<InsertArticle>): Promise<Article>;
  deleteArticle(id: number): Promise<void>;
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgram(id: number, program: Partial<InsertProgram>): Promise<Program>;
  
  // Activity methods
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity>;
  
  // Admission form methods
  getAdmissionForms(): Promise<AdmissionForm[]>;
  createAdmissionForm(form: InsertAdmissionForm): Promise<AdmissionForm>;
  
  // Contact form methods
  getContactForms(): Promise<ContactForm[]>;
  createContactForm(form: InsertContactForm): Promise<ContactForm>;
  
  // Authentication methods
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, userData: Partial<InsertUser>): Promise<User>;
  
  // Chat methods
  getChatMessages(userId?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Notification methods
  getNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<void>;
  
  // Admission step methods
  getAdmissionSteps(): Promise<AdmissionStep[]>;
  getAdmissionStep(id: number): Promise<AdmissionStep | undefined>;
  createAdmissionStep(step: InsertAdmissionStep): Promise<AdmissionStep>;
  updateAdmissionStep(id: number, step: Partial<InsertAdmissionStep>): Promise<AdmissionStep>;
  deleteAdmissionStep(id: number): Promise<void>;
  
  // Media cover methods
  getMediaCovers(): Promise<MediaCover[]>;
  getMediaCover(id: number): Promise<MediaCover | undefined>;
  createMediaCover(cover: InsertMediaCover): Promise<MediaCover>;
  updateMediaCover(id: number, cover: Partial<InsertMediaCover>): Promise<MediaCover>;
  deleteMediaCover(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getArticles(): Promise<Article[]> {
    return await db.select().from(articles).orderBy(articles.publishedAt).limit(50);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || undefined;
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return await db.select().from(articles).where(eq(articles.category, category));
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values({ ...insertArticle, publishedAt: new Date() })
      .returning();
    return article;
  }

  async updateArticle(id: number, articleData: Partial<InsertArticle>): Promise<Article> {
    const [article] = await db
      .update(articles)
      .set(articleData)
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async deleteArticle(id: number): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async getPrograms(): Promise<Program[]> {
    return await db.select().from(programs);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || undefined;
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const [program] = await db
      .insert(programs)
      .values({ ...insertProgram, isActive: insertProgram.isActive ?? true })
      .returning();
    return program;
  }

  async updateProgram(id: number, programData: Partial<InsertProgram>): Promise<Program> {
    const [program] = await db
      .update(programs)
      .set(programData)
      .where(eq(programs.id, id))
      .returning();
    return program;
  }

  async getActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values({ 
        ...insertActivity, 
        imageUrl: insertActivity.imageUrl || null,
        isActive: insertActivity.isActive ?? true
      })
      .returning();
    return activity;
  }

  async updateActivity(id: number, activityData: Partial<InsertActivity>): Promise<Activity> {
    const [activity] = await db
      .update(activities)
      .set(activityData)
      .where(eq(activities.id, id))
      .returning();
    return activity;
  }

  async getAdmissionForms(): Promise<AdmissionForm[]> {
    return await db.select().from(admissionForms);
  }

  async createAdmissionForm(insertForm: InsertAdmissionForm): Promise<AdmissionForm> {
    const [form] = await db
      .insert(admissionForms)
      .values({ 
        ...insertForm, 
        submittedAt: new Date(),
        status: "pending",
        notes: insertForm.notes || null
      })
      .returning();
    return form;
  }

  async getContactForms(): Promise<ContactForm[]> {
    return await db.select().from(contactForms);
  }

  async createContactForm(insertForm: InsertContactForm): Promise<ContactForm> {
    const [form] = await db
      .insert(contactForms)
      .values({ 
        ...insertForm, 
        submittedAt: new Date(),
        status: "pending"
      })
      .returning();
    return form;
  }

  // Authentication methods
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUser(id: number, userData: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Chat methods
  async getChatMessages(userId?: number): Promise<ChatMessage[]> {
    if (userId) {
      return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
    }
    return await db.select().from(chatMessages);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values({ ...message, createdAt: new Date() })
      .returning();
    return chatMessage;
  }

  // Notification methods
  async getNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [notif] = await db
      .insert(notifications)
      .values({ ...notification, createdAt: new Date() })
      .returning();
    return notif;
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // Admission step methods
  async getAdmissionSteps(): Promise<AdmissionStep[]> {
    return await db.select().from(admissionSteps).where(eq(admissionSteps.isActive, true));
  }

  async getAdmissionStep(id: number): Promise<AdmissionStep | undefined> {
    const [step] = await db.select().from(admissionSteps).where(eq(admissionSteps.id, id));
    return step || undefined;
  }

  async createAdmissionStep(insertStep: InsertAdmissionStep): Promise<AdmissionStep> {
    const [step] = await db
      .insert(admissionSteps)
      .values({ ...insertStep, updatedAt: new Date() })
      .returning();
    return step;
  }

  async updateAdmissionStep(id: number, stepData: Partial<InsertAdmissionStep>): Promise<AdmissionStep> {
    const [step] = await db
      .update(admissionSteps)
      .set({ ...stepData, updatedAt: new Date() })
      .where(eq(admissionSteps.id, id))
      .returning();
    return step;
  }

  async deleteAdmissionStep(id: number): Promise<void> {
    await db
      .update(admissionSteps)
      .set({ isActive: false })
      .where(eq(admissionSteps.id, id));
  }

  // Media cover methods
  async getMediaCovers(): Promise<MediaCover[]> {
    return await db.select().from(mediaCovers).where(eq(mediaCovers.isActive, true));
  }

  async getMediaCover(id: number): Promise<MediaCover | undefined> {
    const [cover] = await db.select().from(mediaCovers).where(eq(mediaCovers.id, id));
    return cover || undefined;
  }

  async createMediaCover(insertCover: InsertMediaCover): Promise<MediaCover> {
    const [cover] = await db
      .insert(mediaCovers)
      .values({ ...insertCover, createdAt: new Date() })
      .returning();
    return cover;
  }

  async updateMediaCover(id: number, coverData: Partial<InsertMediaCover>): Promise<MediaCover> {
    const [cover] = await db
      .update(mediaCovers)
      .set(coverData)
      .where(eq(mediaCovers.id, id))
      .returning();
    return cover;
  }

  async deleteMediaCover(id: number): Promise<void> {
    await db
      .update(mediaCovers)
      .set({ isActive: false })
      .where(eq(mediaCovers.id, id));
  }
}

export const storage = new DatabaseStorage();