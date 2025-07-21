import { users, articles, testimonials, programs, activities, admissionForms, contactForms, chatMessages, notifications, admissionSteps, mediaCovers, socialMediaLinks, serviceRegistrations, affiliateMembers, affiliateTransactions, affiliateRewards, dexTrades, customerConversions, commissionSettings, commissionTransactions, type User, type InsertUser, type Article, type InsertArticle, type Testimonial, type InsertTestimonial, type Program, type InsertProgram, type Activity, type InsertActivity, type AdmissionForm, type InsertAdmissionForm, type ContactForm, type InsertContactForm, type ChatMessage, type InsertChatMessage, type Notification, type InsertNotification, type AdmissionStep, type InsertAdmissionStep, type MediaCover, type InsertMediaCover, type SocialMediaLink, type InsertSocialMediaLink, type ServiceRegistration, type InsertServiceRegistration, type AffiliateMember, type InsertAffiliateMember, type AffiliateTransaction, type InsertAffiliateTransaction, type AffiliateReward, type InsertAffiliateReward, type DexTrade, type InsertDexTrade, type CustomerConversion, type InsertCustomerConversion, type CommissionSetting, type InsertCommissionSetting, type CommissionTransaction, type InsertCommissionTransaction } from "@shared/schema";
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
  
  // Social media methods
  getSocialMediaLinks(): Promise<SocialMediaLink[]>;
  getSocialMediaLink(id: number): Promise<SocialMediaLink | undefined>;
  createSocialMediaLink(link: InsertSocialMediaLink): Promise<SocialMediaLink>;
  updateSocialMediaLink(id: number, link: Partial<InsertSocialMediaLink>): Promise<SocialMediaLink>;
  deleteSocialMediaLink(id: number): Promise<void>;
  
  // Service registration methods
  getServiceRegistrations(): Promise<ServiceRegistration[]>;
  getServiceRegistration(id: number): Promise<ServiceRegistration | undefined>;
  createServiceRegistration(registration: InsertServiceRegistration): Promise<ServiceRegistration>;
  updateServiceRegistration(id: number, registration: Partial<InsertServiceRegistration>): Promise<ServiceRegistration>;
  deleteServiceRegistration(id: number): Promise<void>;
  
  // Affiliate methods
  getAffiliateMembers(): Promise<AffiliateMember[]>;
  getAffiliateMember(id: number): Promise<AffiliateMember | undefined>;
  getAffiliateMemberByMemberId(memberId: string): Promise<AffiliateMember | undefined>;
  getAffiliateMemberByEmail(email: string): Promise<AffiliateMember | undefined>;
  createAffiliateMember(member: InsertAffiliateMember): Promise<AffiliateMember>;
  updateAffiliateMember(id: number, member: Partial<InsertAffiliateMember>): Promise<AffiliateMember>;
  deleteAffiliateMember(id: number): Promise<void>;
  getAffiliateMembersByType(memberType: string): Promise<AffiliateMember[]>;
  getAffiliateMembersBySponsor(sponsorId: string): Promise<AffiliateMember[]>;
  
  // Affiliate transaction methods
  getAffiliateTransactions(): Promise<AffiliateTransaction[]>;
  getAffiliateTransaction(id: number): Promise<AffiliateTransaction | undefined>;
  getAffiliateTransactionsByMember(memberId: string): Promise<AffiliateTransaction[]>;
  createAffiliateTransaction(transaction: InsertAffiliateTransaction): Promise<AffiliateTransaction>;
  updateAffiliateTransaction(id: number, transaction: Partial<InsertAffiliateTransaction>): Promise<AffiliateTransaction>;
  
  // Affiliate reward methods
  getAffiliateRewards(): Promise<AffiliateReward[]>;
  getAffiliateReward(id: number): Promise<AffiliateReward | undefined>;
  getAffiliateRewardsByMember(memberId: string): Promise<AffiliateReward[]>;
  createAffiliateReward(reward: InsertAffiliateReward): Promise<AffiliateReward>;
  updateAffiliateReward(id: number, reward: Partial<InsertAffiliateReward>): Promise<AffiliateReward>;
  
  // DEX trade methods
  getDexTrades(): Promise<DexTrade[]>;
  getDexTrade(id: number): Promise<DexTrade | undefined>;
  getDexTradesByMember(memberId: string): Promise<DexTrade[]>;
  createDexTrade(trade: InsertDexTrade): Promise<DexTrade>;
  updateDexTrade(id: number, trade: Partial<InsertDexTrade>): Promise<DexTrade>;
  
  // Customer conversion methods
  getCustomerConversions(): Promise<CustomerConversion[]>;
  getCustomerConversion(id: number): Promise<CustomerConversion | undefined>;
  getCustomerConversionsByF1Agent(f1AgentId: string): Promise<CustomerConversion[]>;
  createCustomerConversion(conversion: InsertCustomerConversion): Promise<CustomerConversion>;
  updateCustomerConversion(id: number, conversion: Partial<InsertCustomerConversion>): Promise<CustomerConversion>;
  deleteCustomerConversion(id: number): Promise<void>;
  
  // Commission setting methods
  getCommissionSettings(): Promise<CommissionSetting[]>;
  getActiveCommissionSetting(): Promise<CommissionSetting | undefined>;
  createCommissionSetting(setting: InsertCommissionSetting): Promise<CommissionSetting>;
  updateCommissionSetting(id: number, setting: Partial<InsertCommissionSetting>): Promise<CommissionSetting>;
  
  // Commission transaction methods
  getCommissionTransactions(): Promise<CommissionTransaction[]>;
  getCommissionTransaction(id: number): Promise<CommissionTransaction | undefined>;
  getCommissionTransactionsByRecipient(recipientId: string): Promise<CommissionTransaction[]>;
  createCommissionTransaction(transaction: InsertCommissionTransaction): Promise<CommissionTransaction>;
  updateCommissionTransaction(id: number, transaction: Partial<InsertCommissionTransaction>): Promise<CommissionTransaction>;
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

  async getSocialMediaLinks(): Promise<SocialMediaLink[]> {
    return await db.select().from(socialMediaLinks).where(eq(socialMediaLinks.isActive, true));
  }

  async getSocialMediaLink(id: number): Promise<SocialMediaLink | undefined> {
    const [link] = await db.select().from(socialMediaLinks).where(eq(socialMediaLinks.id, id));
    return link || undefined;
  }

  async createSocialMediaLink(insertLink: InsertSocialMediaLink): Promise<SocialMediaLink> {
    const [link] = await db
      .insert(socialMediaLinks)
      .values(insertLink)
      .returning();
    return link;
  }

  async updateSocialMediaLink(id: number, linkData: Partial<InsertSocialMediaLink>): Promise<SocialMediaLink> {
    const [link] = await db
      .update(socialMediaLinks)
      .set({ ...linkData, updatedAt: new Date() })
      .where(eq(socialMediaLinks.id, id))
      .returning();
    return link;
  }

  async deleteSocialMediaLink(id: number): Promise<void> {
    await db.delete(socialMediaLinks).where(eq(socialMediaLinks.id, id));
  }

  // Service registration methods
  async getServiceRegistrations(): Promise<ServiceRegistration[]> {
    return await db.select().from(serviceRegistrations).orderBy(serviceRegistrations.createdAt);
  }

  async getServiceRegistration(id: number): Promise<ServiceRegistration | undefined> {
    const [registration] = await db.select().from(serviceRegistrations).where(eq(serviceRegistrations.id, id));
    return registration || undefined;
  }

  async createServiceRegistration(insertRegistration: InsertServiceRegistration): Promise<ServiceRegistration> {
    const [registration] = await db
      .insert(serviceRegistrations)
      .values(insertRegistration)
      .returning();
    return registration;
  }

  async updateServiceRegistration(id: number, registrationData: Partial<InsertServiceRegistration>): Promise<ServiceRegistration> {
    const [registration] = await db
      .update(serviceRegistrations)
      .set({ ...registrationData, updatedAt: new Date() })
      .where(eq(serviceRegistrations.id, id))
      .returning();
    return registration;
  }

  async deleteServiceRegistration(id: number): Promise<void> {
    await db.delete(serviceRegistrations).where(eq(serviceRegistrations.id, id));
  }

  // Affiliate methods
  async getAffiliateMembers(): Promise<AffiliateMember[]> {
    return await db.select().from(affiliateMembers).where(eq(affiliateMembers.isActive, true));
  }

  async getAffiliateMember(id: number): Promise<AffiliateMember | undefined> {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.id, id));
    return member || undefined;
  }

  async getAffiliateMemberByMemberId(memberId: string): Promise<AffiliateMember | undefined> {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.memberId, memberId));
    return member || undefined;
  }

  async getAffiliateMemberByEmail(email: string): Promise<AffiliateMember | undefined> {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.email, email));
    return member || undefined;
  }

  async createAffiliateMember(insertMember: InsertAffiliateMember): Promise<AffiliateMember> {
    const [member] = await db
      .insert(affiliateMembers)
      .values(insertMember)
      .returning();
    return member;
  }

  async updateAffiliateMember(id: number, memberData: Partial<InsertAffiliateMember>): Promise<AffiliateMember> {
    const [member] = await db
      .update(affiliateMembers)
      .set({ ...memberData, updatedAt: new Date() })
      .where(eq(affiliateMembers.id, id))
      .returning();
    return member;
  }

  async deleteAffiliateMember(id: number): Promise<void> {
    await db
      .update(affiliateMembers)
      .set({ isActive: false })
      .where(eq(affiliateMembers.id, id));
  }

  async getAffiliateMembersByType(memberType: string): Promise<AffiliateMember[]> {
    return await db.select().from(affiliateMembers).where(eq(affiliateMembers.memberType, memberType));
  }

  async getAffiliateMembersBySponsor(sponsorId: string): Promise<AffiliateMember[]> {
    return await db.select().from(affiliateMembers).where(eq(affiliateMembers.sponsorId, sponsorId));
  }

  // Affiliate transaction methods
  async getAffiliateTransactions(): Promise<AffiliateTransaction[]> {
    return await db.select().from(affiliateTransactions).orderBy(affiliateTransactions.createdAt);
  }

  async getAffiliateTransaction(id: number): Promise<AffiliateTransaction | undefined> {
    const [transaction] = await db.select().from(affiliateTransactions).where(eq(affiliateTransactions.id, id));
    return transaction || undefined;
  }

  async getAffiliateTransactionsByMember(memberId: string): Promise<AffiliateTransaction[]> {
    return await db.select().from(affiliateTransactions).where(eq(affiliateTransactions.fromMemberId, memberId));
  }

  async createAffiliateTransaction(insertTransaction: InsertAffiliateTransaction): Promise<AffiliateTransaction> {
    const [transaction] = await db
      .insert(affiliateTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async updateAffiliateTransaction(id: number, transactionData: Partial<InsertAffiliateTransaction>): Promise<AffiliateTransaction> {
    const [transaction] = await db
      .update(affiliateTransactions)
      .set({ ...transactionData, updatedAt: new Date() })
      .where(eq(affiliateTransactions.id, id))
      .returning();
    return transaction;
  }

  // Affiliate reward methods
  async getAffiliateRewards(): Promise<AffiliateReward[]> {
    return await db.select().from(affiliateRewards).orderBy(affiliateRewards.createdAt);
  }

  async getAffiliateReward(id: number): Promise<AffiliateReward | undefined> {
    const [reward] = await db.select().from(affiliateRewards).where(eq(affiliateRewards.id, id));
    return reward || undefined;
  }

  async getAffiliateRewardsByMember(memberId: string): Promise<AffiliateReward[]> {
    return await db.select().from(affiliateRewards).where(eq(affiliateRewards.memberId, memberId));
  }

  async createAffiliateReward(insertReward: InsertAffiliateReward): Promise<AffiliateReward> {
    const [reward] = await db
      .insert(affiliateRewards)
      .values(insertReward)
      .returning();
    return reward;
  }

  async updateAffiliateReward(id: number, rewardData: Partial<InsertAffiliateReward>): Promise<AffiliateReward> {
    const [reward] = await db
      .update(affiliateRewards)
      .set({ ...rewardData, updatedAt: new Date() })
      .where(eq(affiliateRewards.id, id))
      .returning();
    return reward;
  }

  // DEX trade methods
  async getDexTrades(): Promise<DexTrade[]> {
    return await db.select().from(dexTrades).orderBy(dexTrades.createdAt);
  }

  async getDexTrade(id: number): Promise<DexTrade | undefined> {
    const [trade] = await db.select().from(dexTrades).where(eq(dexTrades.id, id));
    return trade || undefined;
  }

  async getDexTradesByMember(memberId: string): Promise<DexTrade[]> {
    return await db.select().from(dexTrades).where(eq(dexTrades.memberId, memberId));
  }

  async createDexTrade(insertTrade: InsertDexTrade): Promise<DexTrade> {
    const [trade] = await db
      .insert(dexTrades)
      .values(insertTrade)
      .returning();
    return trade;
  }

  async updateDexTrade(id: number, tradeData: Partial<InsertDexTrade>): Promise<DexTrade> {
    const [trade] = await db
      .update(dexTrades)
      .set({ ...tradeData, updatedAt: new Date() })
      .where(eq(dexTrades.id, id))
      .returning();
    return trade;
  }

  // Customer conversion methods
  async getCustomerConversions(): Promise<CustomerConversion[]> {
    return await db.select().from(customerConversions).orderBy(customerConversions.createdAt);
  }

  async getCustomerConversion(id: number): Promise<CustomerConversion | undefined> {
    const [conversion] = await db.select().from(customerConversions).where(eq(customerConversions.id, id));
    return conversion || undefined;
  }

  async getCustomerConversionsByF1Agent(f1AgentId: string): Promise<CustomerConversion[]> {
    return await db.select().from(customerConversions).where(eq(customerConversions.f1AgentId, f1AgentId));
  }

  async createCustomerConversion(insertConversion: InsertCustomerConversion): Promise<CustomerConversion> {
    const [conversion] = await db
      .insert(customerConversions)
      .values(insertConversion)
      .returning();
    return conversion;
  }

  async updateCustomerConversion(id: number, conversionData: Partial<InsertCustomerConversion>): Promise<CustomerConversion> {
    const [conversion] = await db
      .update(customerConversions)
      .set({ ...conversionData, updatedAt: new Date() })
      .where(eq(customerConversions.id, id))
      .returning();
    return conversion;
  }

  async deleteCustomerConversion(id: number): Promise<void> {
    await db.delete(customerConversions).where(eq(customerConversions.id, id));
  }

  // Commission setting methods
  async getCommissionSettings(): Promise<CommissionSetting[]> {
    return await db.select().from(commissionSettings).orderBy(commissionSettings.updatedAt);
  }

  async getActiveCommissionSetting(): Promise<CommissionSetting | undefined> {
    const [setting] = await db.select().from(commissionSettings).where(eq(commissionSettings.isActive, true));
    return setting || undefined;
  }

  async createCommissionSetting(insertSetting: InsertCommissionSetting): Promise<CommissionSetting> {
    const [setting] = await db
      .insert(commissionSettings)
      .values(insertSetting)
      .returning();
    return setting;
  }

  async updateCommissionSetting(id: number, settingData: Partial<InsertCommissionSetting>): Promise<CommissionSetting> {
    const [setting] = await db
      .update(commissionSettings)
      .set({ ...settingData, updatedAt: new Date() })
      .where(eq(commissionSettings.id, id))
      .returning();
    return setting;
  }

  // Commission transaction methods
  async getCommissionTransactions(): Promise<CommissionTransaction[]> {
    return await db.select().from(commissionTransactions).orderBy(commissionTransactions.createdAt);
  }

  async getCommissionTransaction(id: number): Promise<CommissionTransaction | undefined> {
    const [transaction] = await db.select().from(commissionTransactions).where(eq(commissionTransactions.id, id));
    return transaction || undefined;
  }

  async getCommissionTransactionsByRecipient(recipientId: string): Promise<CommissionTransaction[]> {
    return await db.select().from(commissionTransactions).where(eq(commissionTransactions.recipientId, recipientId));
  }

  async createCommissionTransaction(insertTransaction: InsertCommissionTransaction): Promise<CommissionTransaction> {
    const [transaction] = await db
      .insert(commissionTransactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async updateCommissionTransaction(id: number, transactionData: Partial<InsertCommissionTransaction>): Promise<CommissionTransaction> {
    const [transaction] = await db
      .update(commissionTransactions)
      .set({ ...transactionData })
      .where(eq(commissionTransactions.id, id))
      .returning();
    return transaction;
  }
}

export const storage = new DatabaseStorage();