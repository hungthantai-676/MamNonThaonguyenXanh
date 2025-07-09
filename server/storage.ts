import { users, articles, testimonials, programs, activities, admissionForms, contactForms, chatMessages, notifications, type User, type InsertUser, type Article, type InsertArticle, type Testimonial, type InsertTestimonial, type Program, type InsertProgram, type Activity, type InsertActivity, type AdmissionForm, type InsertAdmissionForm, type ContactForm, type InsertContactForm, type ChatMessage, type InsertChatMessage, type Notification, type InsertNotification } from "@shared/schema";
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
  
  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Program methods
  getPrograms(): Promise<Program[]>;
  getProgram(id: number): Promise<Program | undefined>;
  createProgram(program: InsertProgram): Promise<Program>;
  
  // Activity methods
  getActivities(): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  
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
    return await db.select().from(articles);
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
}

export const storage = new DatabaseStorage();