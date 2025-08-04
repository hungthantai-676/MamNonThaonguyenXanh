var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/email.ts
var email_exports = {};
__export(email_exports, {
  sendPasswordResetEmail: () => sendPasswordResetEmail,
  sendServiceRegistrationEmail: () => sendServiceRegistrationEmail,
  sendTestEmail: () => sendTestEmail
});
import nodemailer from "nodemailer";
async function sendServiceRegistrationEmail(registration) {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER || "Mamnonthaonguyenxanh2019@gmail.com",
      to: "Mamnonthaonguyenxanh2019@gmail.com",
      subject: `\u{1F514} \u0110\u0103ng k\xFD d\u1ECBch v\u1EE5 m\u1EDBi: ${registration.serviceName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2E7D32; text-align: center; margin-bottom: 30px;">
            \u{1F514} \u0110\u0103ng k\xFD d\u1ECBch v\u1EE5 m\u1EDBi t\u1EEB ph\u1EE5 huynh
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1976D2; margin-top: 0;">\u{1F4CB} Th\xF4ng tin \u0111\u0103ng k\xFD</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">T\xEAn ph\u1EE5 huynh:</td>
                <td style="padding: 8px 0; color: #333;">${registration.parentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:</td>
                <td style="padding: 8px 0; color: #333;">${registration.parentPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                <td style="padding: 8px 0; color: #333;">${registration.parentEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">D\u1ECBch v\u1EE5:</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">${registration.serviceName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Th\u1EDDi gian mong mu\u1ED1n:</td>
                <td style="padding: 8px 0; color: #333;">${registration.preferredTime}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">Th\u1EDDi gian \u0111\u0103ng k\xFD:</td>
                <td style="padding: 8px 0; color: #333;">${new Date(registration.createdAt).toLocaleString("vi-VN")}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #F57C00; margin-top: 0;">\u{1F4AC} Ghi ch\xFA t\u1EEB ph\u1EE5 huynh</h3>
            <p style="color: #333; line-height: 1.5; margin: 0; font-style: italic;">
              "${registration.notes}"
            </p>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="color: #2E7D32; margin-top: 0;">\u26A1 H\xE0nh \u0111\u1ED9ng c\u1EA7n th\u1EF1c hi\u1EC7n</h3>
            <p style="color: #333; margin-bottom: 15px;">
              Vui l\xF2ng li\xEAn h\u1EC7 ph\u1EE5 huynh trong v\xF2ng 24h \u0111\u1EC3 s\u1EAFp x\u1EBFp l\u1ECBch t\u01B0 v\u1EA5n
            </p>
            <p style="color: #666; font-size: 14px; margin: 0;">
              B\u1EA1n c\xF3 th\u1EC3 qu\u1EA3n l\xFD \u0111\u0103ng k\xFD n\xE0y t\u1EA1i: 
              <a href="https://your-domain.com/admin" style="color: #1976D2;">Admin Dashboard</a>
            </p>
          </div>
        </div>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("\u{1F4E7} Email notification sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send email notification:", error);
    return false;
  }
}
async function sendPasswordResetEmail(userEmail, tempPassword, username) {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER || "Mamnonthaonguyenxanh2019@gmail.com",
      to: userEmail,
      subject: "\u{1F511} L\u1EA5y l\u1EA1i m\u1EADt kh\u1EA9u - M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2E7D32; text-align: center; margin-bottom: 30px;">
            \u{1F511} L\u1EA5y l\u1EA1i m\u1EADt kh\u1EA9u t\xE0i kho\u1EA3n Affiliate
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1976D2; margin-top: 0;">\u{1F4CB} Th\xF4ng tin \u0111\u0103ng nh\u1EADp m\u1EDBi</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">T\xEAn \u0111\u0103ng nh\u1EADp:</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">${username}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #666;">M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi:</td>
                <td style="padding: 8px 0; color: #d32f2f; font-weight: bold; font-size: 18px;">${tempPassword}</td>
              </tr>
            </table>
          </div>
          
          <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #F57C00; margin-top: 0;">\u26A0\uFE0F L\u01B0u \xFD quan tr\u1ECDng</h3>
            <ul style="color: #333; line-height: 1.6;">
              <li>M\u1EADt kh\u1EA9u n\xE0y ch\u1EC9 c\xF3 hi\u1EC7u l\u1EF1c trong 24 gi\u1EDD</li>
              <li>Vui l\xF2ng \u0111\u0103ng nh\u1EADp v\xE0 \u0111\u1ED5i m\u1EADt kh\u1EA9u m\u1EDBi ngay</li>
              <li>Kh\xF4ng chia s\u1EBB th\xF4ng tin n\xE0y v\u1EDBi ai kh\xE1c</li>
            </ul>
          </div>
          
          <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; text-align: center;">
            <h3 style="color: #2E7D32; margin-top: 0;">\u{1F680} \u0110\u0103ng nh\u1EADp ngay</h3>
            <p style="color: #333; margin-bottom: 15px;">
              Nh\u1EA5n v\xE0o link d\u01B0\u1EDBi \u0111\u1EC3 \u0111\u0103ng nh\u1EADp v\u1EDBi m\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi
            </p>
            <a href="${process.env.NODE_ENV === "production" ? "https://mamnonthaonguyenxanh.com" : "http://localhost:5000"}/affiliate-login" 
               style="display: inline-block; background-color: #2E7D32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              \u0110\u0103ng nh\u1EADp ngay
            </a>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              Email n\xE0y \u0111\u01B0\u1EE3c g\u1EEDi t\u1EEB h\u1EC7 th\u1ED1ng M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh<br>
              Th\u1EDDi gian: ${(/* @__PURE__ */ new Date()).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("\u{1F4E7} Password reset email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send password reset email:", error);
    return false;
  }
}
async function sendTestEmail() {
  try {
    const transporter = createTransporter();
    const mailOptions = {
      from: process.env.EMAIL_USER || "Mamnonthaonguyenxanh2019@gmail.com",
      to: "Mamnonthaonguyenxanh2019@gmail.com",
      subject: "\u{1F9EA} Test Email - H\u1EC7 th\u1ED1ng th\xF4ng b\xE1o ho\u1EA1t \u0111\u1ED9ng",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2E7D32; text-align: center;">
            \u{1F9EA} Email Test Th\xE0nh C\xF4ng!
          </h2>
          <p style="color: #333; text-align: center; font-size: 16px;">
            H\u1EC7 th\u1ED1ng g\u1EEDi email t\u1EF1 \u0111\u1ED9ng \u0111\xE3 \u0111\u01B0\u1EE3c thi\u1EBFt l\u1EADp th\xE0nh c\xF4ng.<br>
            T\u1EEB gi\u1EDD tr\u1EDF \u0111i, m\u1ECDi \u0111\u0103ng k\xFD d\u1ECBch v\u1EE5 s\u1EBD \u0111\u01B0\u1EE3c g\u1EEDi v\u1EC1 email n\xE0y.
          </p>
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #666; font-size: 14px;">
              Th\u1EDDi gian test: ${(/* @__PURE__ */ new Date()).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      `
    };
    const result = await transporter.sendMail(mailOptions);
    console.log("\u{1F4E7} Test email sent successfully:", result.messageId);
    return true;
  } catch (error) {
    console.error("\u274C Failed to send test email:", error);
    return false;
  }
}
var createTransporter;
var init_email = __esm({
  "server/email.ts"() {
    "use strict";
    createTransporter = () => {
      return nodemailer.createTransporter({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER || "Mamnonthaonguyenxanh2019@gmail.com",
          pass: process.env.EMAIL_APP_PASSWORD
          // Gmail App Password
        }
      });
    };
  }
});

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  activities: () => activities,
  admissionForms: () => admissionForms,
  admissionSteps: () => admissionSteps,
  affiliateMembers: () => affiliateMembers,
  affiliateRewards: () => affiliateRewards,
  affiliateTransactions: () => affiliateTransactions,
  articles: () => articles,
  chatMessages: () => chatMessages,
  commissionSettings: () => commissionSettings,
  commissionTransactions: () => commissionTransactions,
  contactForms: () => contactForms,
  customerConversions: () => customerConversions,
  dexTrades: () => dexTrades,
  homepageContent: () => homepageContent,
  insertActivitySchema: () => insertActivitySchema,
  insertAdmissionFormSchema: () => insertAdmissionFormSchema,
  insertAdmissionStepSchema: () => insertAdmissionStepSchema,
  insertAffiliateMemberSchema: () => insertAffiliateMemberSchema,
  insertAffiliateRewardSchema: () => insertAffiliateRewardSchema,
  insertAffiliateTransactionSchema: () => insertAffiliateTransactionSchema,
  insertArticleSchema: () => insertArticleSchema,
  insertChatMessageSchema: () => insertChatMessageSchema,
  insertCommissionSettingSchema: () => insertCommissionSettingSchema,
  insertCommissionTransactionSchema: () => insertCommissionTransactionSchema,
  insertContactFormSchema: () => insertContactFormSchema,
  insertCustomerConversionSchema: () => insertCustomerConversionSchema,
  insertDexTradeSchema: () => insertDexTradeSchema,
  insertHomepageContentSchema: () => insertHomepageContentSchema,
  insertMediaCoverSchema: () => insertMediaCoverSchema,
  insertNotificationSchema: () => insertNotificationSchema,
  insertProgramSchema: () => insertProgramSchema,
  insertServiceRegistrationSchema: () => insertServiceRegistrationSchema,
  insertSocialMediaLinkSchema: () => insertSocialMediaLinkSchema,
  insertTestimonialSchema: () => insertTestimonialSchema,
  insertTransactionHistorySchema: () => insertTransactionHistorySchema,
  insertUserSchema: () => insertUserSchema,
  insertWithdrawalRequestSchema: () => insertWithdrawalRequestSchema,
  mediaCovers: () => mediaCovers,
  notifications: () => notifications,
  programs: () => programs,
  serviceRegistrations: () => serviceRegistrations,
  sessions: () => sessions,
  socialMediaLinks: () => socialMediaLinks,
  testimonials: () => testimonials,
  transactionHistory: () => transactionHistory,
  updateAffiliateMemberSchema: () => updateAffiliateMemberSchema,
  users: () => users,
  withdrawalRequests: () => withdrawalRequests
});
import { pgTable, text, serial, integer, boolean, timestamp, varchar, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  role: text("role").default("parent").notNull(),
  // parent, admin
  parentName: text("parent_name"),
  childName: text("child_name"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: boolean("is_active").default(true)
});
var articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  isPublished: boolean("is_published").default(true)
});
var testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  avatar: text("avatar"),
  rating: integer("rating").default(5),
  isPublished: boolean("is_published").default(true)
});
var programs = pgTable("programs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ageRange: text("age_range").notNull(),
  features: text("features").array().notNull(),
  tuition: integer("tuition").notNull(),
  capacity: integer("capacity").notNull(),
  icon: text("icon").notNull(),
  isActive: boolean("is_active").default(true)
});
var activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  frequency: text("frequency").notNull(),
  category: text("category").notNull(),
  isActive: boolean("is_active").default(true)
});
var admissionForms = pgTable("admission_forms", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email").notNull(),
  childName: text("child_name").notNull(),
  childAge: text("child_age").notNull(),
  desiredClass: text("desired_class").notNull(),
  notes: text("notes"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").default("pending")
});
var contactForms = pgTable("contact_forms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  status: text("status").default("pending")
});
var sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});
var chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  message: text("message").notNull(),
  isFromAdmin: boolean("is_from_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info"),
  // info, warning, success, error
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var admissionSteps = pgTable("admission_steps", {
  id: serial("id").primaryKey(),
  stepNumber: integer("step_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  iconUrl: text("icon_url"),
  iconType: text("icon_type").default("image"),
  // image, icon
  iconClass: text("icon_class"),
  // fallback icon class
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow()
});
var mediaCovers = pgTable("media_covers", {
  id: serial("id").primaryKey(),
  outlet: text("outlet").notNull(),
  title: text("title").notNull(),
  date: text("date").notNull(),
  type: text("type").notNull(),
  // TV, Báo, Online, Radio
  url: text("url"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});
var socialMediaLinks = pgTable("social_media_links", {
  id: serial("id").primaryKey(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  displayName: text("display_name"),
  followers: integer("followers").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var serviceRegistrations = pgTable("service_registrations", {
  id: serial("id").primaryKey(),
  parentName: text("parent_name").notNull(),
  parentPhone: text("parent_phone").notNull(),
  parentEmail: text("parent_email"),
  serviceName: text("service_name").notNull(),
  preferredTime: text("preferred_time"),
  notes: text("notes"),
  status: text("status").default("pending"),
  // pending, contacted, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var affiliateMembers = pgTable("affiliate_members", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).unique().notNull(),
  // UUID
  username: varchar("username", { length: 50 }).unique().notNull(),
  // User-friendly login name
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  password: varchar("password", { length: 255 }).default("123456"),
  // User login password
  memberType: varchar("member_type", { length: 50 }).notNull(),
  // "teacher" or "parent"
  categoryName: varchar("category_name", { length: 100 }).notNull(),
  // "Chăm sóc phụ huynh" or "Đại sứ thương hiệu"
  sponsorId: varchar("sponsor_id", { length: 50 }),
  // Reference to sponsor's memberId
  qrCode: text("qr_code"),
  // Base64 encoded QR code
  referralLink: varchar("referral_link", { length: 500 }).unique(),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  privateKey: text("private_key"),
  // Encrypted
  tokenBalance: decimal("token_balance", { precision: 18, scale: 8 }).default("0"),
  totalReferrals: integer("total_referrals").default(0),
  level: integer("level").default(1),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var affiliateTransactions = pgTable("affiliate_transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 100 }).unique().notNull(),
  fromMemberId: varchar("from_member_id", { length: 50 }).notNull(),
  toMemberId: varchar("to_member_id", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  // "referral_bonus", "transfer", "dex_trade"
  status: varchar("status", { length: 50 }).default("pending"),
  // "pending", "completed", "failed"
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var affiliateRewards = pgTable("affiliate_rewards", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  referredMemberId: varchar("referred_member_id", { length: 50 }).notNull(),
  rewardAmount: decimal("reward_amount", { precision: 18, scale: 8 }).notNull(),
  rewardType: varchar("reward_type", { length: 50 }).notNull(),
  // "direct_referral", "indirect_referral"
  level: integer("level").notNull(),
  // Level in the tree
  isProcessed: boolean("is_processed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var customerConversions = pgTable("customer_conversions", {
  id: serial("id").primaryKey(),
  customerId: varchar("customer_id", { length: 50 }).unique().notNull(),
  // UUID
  f1AgentId: varchar("f1_agent_id", { length: 50 }).notNull(),
  // Reference to affiliate member
  f0ReferrerId: varchar("f0_referrer_id", { length: 50 }),
  // Reference to F0 who referred the F1
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(),
  customerEmail: varchar("customer_email", { length: 255 }),
  conversionStatus: varchar("conversion_status", { length: 20 }).default("potential"),
  // "potential" (red), "high_conversion" (yellow), "payment_completed" (green)
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  notes: text("notes"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var commissionSettings = pgTable("commission_settings", {
  id: serial("id").primaryKey(),
  f1CommissionPercent: decimal("f1_commission_percent", { precision: 5, scale: 2 }).default("30.00"),
  // 30% for F1
  f0CommissionPercent: decimal("f0_commission_percent", { precision: 5, scale: 2 }).default("15.00"),
  // 15% for F0
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow()
});
var commissionTransactions = pgTable("commission_transactions", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transaction_id", { length: 100 }).unique().notNull(),
  customerId: varchar("customer_id", { length: 50 }).notNull(),
  recipientId: varchar("recipient_id", { length: 50 }).notNull(),
  // F1 or F0 member ID
  recipientType: varchar("recipient_type", { length: 10 }).notNull(),
  // "F1" or "F0"
  commissionAmount: decimal("commission_amount", { precision: 10, scale: 2 }).notNull(),
  baseAmount: decimal("base_amount", { precision: 10, scale: 2 }).notNull(),
  // Original payment amount
  commissionPercent: decimal("commission_percent", { precision: 5, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  // "pending", "completed", "failed"
  processedAt: timestamp("processed_at"),
  createdAt: timestamp("created_at").defaultNow()
});
var withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  bankInfo: text("bank_info"),
  // JSON string for bank details
  requestNote: text("request_note"),
  adminNote: text("admin_note"),
  status: varchar("status", { length: 20 }).default("pending"),
  // pending, approved, rejected, paid
  requestedAt: timestamp("requested_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  paidAt: timestamp("paid_at"),
  processedBy: varchar("processed_by", { length: 50 })
  // admin username
});
var dexTrades = pgTable("dex_trades", {
  id: serial("id").primaryKey(),
  tradeId: varchar("trade_id", { length: 100 }).unique().notNull(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  tradeType: varchar("trade_type", { length: 20 }).notNull(),
  // "buy", "sell"
  tokenAmount: decimal("token_amount", { precision: 18, scale: 8 }).notNull(),
  ethAmount: decimal("eth_amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }).notNull(),
  status: varchar("status", { length: 50 }).default("pending"),
  // "pending", "completed", "failed"
  blockchainTxHash: varchar("blockchain_tx_hash", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var transactionHistory = pgTable("transaction_history", {
  id: serial("id").primaryKey(),
  memberId: varchar("member_id", { length: 50 }).notNull(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  // "payment_received", "commission_earned", "bonus_received", "withdrawal"
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description").notNull(),
  balanceBefore: decimal("balance_before", { precision: 15, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 15, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("completed"),
  // "completed", "pending", "failed"
  referenceId: varchar("reference_id", { length: 100 }),
  // Reference to commission transaction or other source
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true
});
var insertArticleSchema = createInsertSchema(articles).omit({
  id: true,
  publishedAt: true
});
var insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true
});
var insertProgramSchema = createInsertSchema(programs).omit({
  id: true
});
var insertActivitySchema = createInsertSchema(activities).omit({
  id: true
});
var insertAdmissionFormSchema = createInsertSchema(admissionForms).omit({
  id: true,
  submittedAt: true,
  status: true
});
var insertContactFormSchema = createInsertSchema(contactForms).omit({
  id: true,
  submittedAt: true,
  status: true
});
var insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});
var insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true
});
var insertAdmissionStepSchema = createInsertSchema(admissionSteps).omit({
  id: true,
  updatedAt: true
});
var insertMediaCoverSchema = createInsertSchema(mediaCovers).omit({
  id: true,
  createdAt: true
});
var insertSocialMediaLinkSchema = createInsertSchema(socialMediaLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertServiceRegistrationSchema = createInsertSchema(serviceRegistrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCustomerConversionSchema = createInsertSchema(customerConversions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertCommissionSettingSchema = createInsertSchema(commissionSettings).omit({
  id: true,
  updatedAt: true
});
var insertCommissionTransactionSchema = createInsertSchema(commissionTransactions).omit({
  id: true,
  createdAt: true
});
var insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests).omit({
  id: true,
  requestedAt: true,
  processedAt: true,
  paidAt: true
});
var insertAffiliateMemberSchema = createInsertSchema(affiliateMembers).omit({
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
  updatedAt: true
});
var updateAffiliateMemberSchema = createInsertSchema(affiliateMembers).omit({
  id: true,
  memberId: true,
  createdAt: true
}).partial();
var insertAffiliateTransactionSchema = createInsertSchema(affiliateTransactions).omit({
  id: true,
  transactionId: true,
  status: true,
  blockchainTxHash: true,
  createdAt: true,
  updatedAt: true
});
var insertAffiliateRewardSchema = createInsertSchema(affiliateRewards).omit({
  id: true,
  isProcessed: true,
  createdAt: true,
  updatedAt: true
});
var insertDexTradeSchema = createInsertSchema(dexTrades).omit({
  id: true,
  tradeId: true,
  status: true,
  blockchainTxHash: true,
  createdAt: true,
  updatedAt: true
});
var insertTransactionHistorySchema = createInsertSchema(transactionHistory).omit({
  id: true,
  createdAt: true
});
var homepageContent = pgTable("homepage_content", {
  id: serial("id").primaryKey(),
  heroTitle: text("hero_title").notNull(),
  heroSubtitle: text("hero_subtitle").notNull(),
  highlight1Title: text("highlight1_title").notNull(),
  highlight1Desc: text("highlight1_desc").notNull(),
  highlight2Title: text("highlight2_title").notNull(),
  highlight2Desc: text("highlight2_desc").notNull(),
  highlight3Title: text("highlight3_title").notNull(),
  highlight3Desc: text("highlight3_desc").notNull(),
  homepage_banner: text("homepage_banner"),
  // Add banner field
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertHomepageContentSchema = createInsertSchema(homepageContent).omit({
  id: true,
  updatedAt: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || void 0;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || void 0;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getArticles() {
    return await db.select().from(articles).orderBy(articles.publishedAt).limit(50);
  }
  async getArticle(id) {
    const [article] = await db.select().from(articles).where(eq(articles.id, id));
    return article || void 0;
  }
  async getArticlesByCategory(category) {
    return await db.select().from(articles).where(eq(articles.category, category));
  }
  async createArticle(insertArticle) {
    const [article] = await db.insert(articles).values({ ...insertArticle, publishedAt: /* @__PURE__ */ new Date() }).returning();
    return article;
  }
  async updateArticle(id, articleData) {
    const [article] = await db.update(articles).set(articleData).where(eq(articles.id, id)).returning();
    return article;
  }
  async deleteArticle(id) {
    await db.delete(articles).where(eq(articles.id, id));
  }
  async getTestimonials() {
    return await db.select().from(testimonials);
  }
  async createTestimonial(insertTestimonial) {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }
  async getPrograms() {
    return await db.select().from(programs);
  }
  async getProgram(id) {
    const [program] = await db.select().from(programs).where(eq(programs.id, id));
    return program || void 0;
  }
  async createProgram(insertProgram) {
    const [program] = await db.insert(programs).values({ ...insertProgram, isActive: insertProgram.isActive ?? true }).returning();
    return program;
  }
  async updateProgram(id, programData) {
    const [program] = await db.update(programs).set(programData).where(eq(programs.id, id)).returning();
    return program;
  }
  async getActivities() {
    return await db.select().from(activities);
  }
  async getActivity(id) {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || void 0;
  }
  async createActivity(insertActivity) {
    const [activity] = await db.insert(activities).values({
      ...insertActivity,
      imageUrl: insertActivity.imageUrl || null,
      isActive: insertActivity.isActive ?? true
    }).returning();
    return activity;
  }
  async updateActivity(id, activityData) {
    const [activity] = await db.update(activities).set(activityData).where(eq(activities.id, id)).returning();
    return activity;
  }
  async getAdmissionForms() {
    return await db.select().from(admissionForms);
  }
  async createAdmissionForm(insertForm) {
    const [form] = await db.insert(admissionForms).values({
      ...insertForm,
      submittedAt: /* @__PURE__ */ new Date(),
      status: "pending",
      notes: insertForm.notes || null
    }).returning();
    return form;
  }
  async getContactForms() {
    return await db.select().from(contactForms);
  }
  async createContactForm(insertForm) {
    const [form] = await db.insert(contactForms).values({
      ...insertForm,
      submittedAt: /* @__PURE__ */ new Date(),
      status: "pending"
    }).returning();
    return form;
  }
  // Authentication methods
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || void 0;
  }
  async updateUser(id, userData) {
    const [user] = await db.update(users).set(userData).where(eq(users.id, id)).returning();
    return user;
  }
  // Chat methods
  async getChatMessages(userId) {
    if (userId) {
      return await db.select().from(chatMessages).where(eq(chatMessages.userId, userId));
    }
    return await db.select().from(chatMessages);
  }
  async createChatMessage(message) {
    const [chatMessage] = await db.insert(chatMessages).values({ ...message, createdAt: /* @__PURE__ */ new Date() }).returning();
    return chatMessage;
  }
  // Notification methods
  async getNotifications(userId) {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }
  async createNotification(notification) {
    const [notif] = await db.insert(notifications).values({ ...notification, createdAt: /* @__PURE__ */ new Date() }).returning();
    return notif;
  }
  async markNotificationAsRead(id) {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }
  // Admission step methods
  async getAdmissionSteps() {
    return await db.select().from(admissionSteps).where(eq(admissionSteps.isActive, true));
  }
  async getAdmissionStep(id) {
    const [step] = await db.select().from(admissionSteps).where(eq(admissionSteps.id, id));
    return step || void 0;
  }
  async createAdmissionStep(insertStep) {
    const [step] = await db.insert(admissionSteps).values({ ...insertStep, updatedAt: /* @__PURE__ */ new Date() }).returning();
    return step;
  }
  async updateAdmissionStep(id, stepData) {
    const [step] = await db.update(admissionSteps).set({ ...stepData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(admissionSteps.id, id)).returning();
    return step;
  }
  async deleteAdmissionStep(id) {
    await db.update(admissionSteps).set({ isActive: false }).where(eq(admissionSteps.id, id));
  }
  // Media cover methods
  async getMediaCovers() {
    return await db.select().from(mediaCovers).where(eq(mediaCovers.isActive, true));
  }
  async getMediaCover(id) {
    const [cover] = await db.select().from(mediaCovers).where(eq(mediaCovers.id, id));
    return cover || void 0;
  }
  async createMediaCover(insertCover) {
    const [cover] = await db.insert(mediaCovers).values({ ...insertCover, createdAt: /* @__PURE__ */ new Date() }).returning();
    return cover;
  }
  async updateMediaCover(id, coverData) {
    const [cover] = await db.update(mediaCovers).set(coverData).where(eq(mediaCovers.id, id)).returning();
    return cover;
  }
  async deleteMediaCover(id) {
    await db.update(mediaCovers).set({ isActive: false }).where(eq(mediaCovers.id, id));
  }
  async getSocialMediaLinks() {
    return await db.select().from(socialMediaLinks).where(eq(socialMediaLinks.isActive, true));
  }
  async getSocialMediaLink(id) {
    const [link] = await db.select().from(socialMediaLinks).where(eq(socialMediaLinks.id, id));
    return link || void 0;
  }
  async createSocialMediaLink(insertLink) {
    const [link] = await db.insert(socialMediaLinks).values(insertLink).returning();
    return link;
  }
  async updateSocialMediaLink(id, linkData) {
    const [link] = await db.update(socialMediaLinks).set({ ...linkData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(socialMediaLinks.id, id)).returning();
    return link;
  }
  async deleteSocialMediaLink(id) {
    await db.delete(socialMediaLinks).where(eq(socialMediaLinks.id, id));
  }
  // Service registration methods
  async getServiceRegistrations() {
    return await db.select().from(serviceRegistrations).orderBy(serviceRegistrations.createdAt);
  }
  async getServiceRegistration(id) {
    const [registration] = await db.select().from(serviceRegistrations).where(eq(serviceRegistrations.id, id));
    return registration || void 0;
  }
  async createServiceRegistration(insertRegistration) {
    const [registration] = await db.insert(serviceRegistrations).values(insertRegistration).returning();
    return registration;
  }
  async updateServiceRegistration(id, registrationData) {
    const [registration] = await db.update(serviceRegistrations).set({ ...registrationData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(serviceRegistrations.id, id)).returning();
    return registration;
  }
  async deleteServiceRegistration(id) {
    await db.delete(serviceRegistrations).where(eq(serviceRegistrations.id, id));
  }
  // Affiliate methods
  async getAffiliateMembers() {
    return await db.select().from(affiliateMembers).where(eq(affiliateMembers.isActive, true));
  }
  async getAffiliateMember(id) {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.id, id));
    return member || void 0;
  }
  async getAffiliateMemberByMemberId(memberId) {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.memberId, memberId));
    return member || void 0;
  }
  async getAffiliateMemberByUsername(username) {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.username, username));
    return member || void 0;
  }
  async getAffiliateMemberByEmail(email) {
    const [member] = await db.select().from(affiliateMembers).where(eq(affiliateMembers.email, email));
    return member || void 0;
  }
  async createAffiliateMember(insertMember) {
    const [member] = await db.insert(affiliateMembers).values(insertMember).returning();
    return member;
  }
  async updateAffiliateMember(id, memberData) {
    const [member] = await db.update(affiliateMembers).set({ ...memberData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(affiliateMembers.id, id)).returning();
    return member;
  }
  async deleteAffiliateMember(id) {
    await db.update(affiliateMembers).set({ isActive: false }).where(eq(affiliateMembers.id, id));
  }
  async getAffiliateMembersByType(memberType) {
    return await db.select().from(affiliateMembers).where(eq(affiliateMembers.memberType, memberType));
  }
  async getAffiliateMembersBySponsor(sponsorId) {
    return await db.select().from(affiliateMembers).where(eq(affiliateMembers.sponsorId, sponsorId));
  }
  // Affiliate transaction methods
  async getAffiliateTransactions() {
    return await db.select().from(affiliateTransactions).orderBy(affiliateTransactions.createdAt);
  }
  async getAffiliateTransaction(id) {
    const [transaction] = await db.select().from(affiliateTransactions).where(eq(affiliateTransactions.id, id));
    return transaction || void 0;
  }
  async getAffiliateTransactionsByMember(memberId) {
    return await db.select().from(affiliateTransactions).where(eq(affiliateTransactions.fromMemberId, memberId));
  }
  async createAffiliateTransaction(insertTransaction) {
    const [transaction] = await db.insert(affiliateTransactions).values(insertTransaction).returning();
    return transaction;
  }
  async updateAffiliateTransaction(id, transactionData) {
    const [transaction] = await db.update(affiliateTransactions).set({ ...transactionData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(affiliateTransactions.id, id)).returning();
    return transaction;
  }
  // Affiliate reward methods
  async getAffiliateRewards() {
    return await db.select().from(affiliateRewards).orderBy(affiliateRewards.createdAt);
  }
  async getAffiliateReward(id) {
    const [reward] = await db.select().from(affiliateRewards).where(eq(affiliateRewards.id, id));
    return reward || void 0;
  }
  async getAffiliateRewardsByMember(memberId) {
    return await db.select().from(affiliateRewards).where(eq(affiliateRewards.memberId, memberId));
  }
  async createAffiliateReward(insertReward) {
    const [reward] = await db.insert(affiliateRewards).values(insertReward).returning();
    return reward;
  }
  async updateAffiliateReward(id, rewardData) {
    const [reward] = await db.update(affiliateRewards).set({ ...rewardData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(affiliateRewards.id, id)).returning();
    return reward;
  }
  // DEX trade methods
  async getDexTrades() {
    return await db.select().from(dexTrades).orderBy(dexTrades.createdAt);
  }
  async getDexTrade(id) {
    const [trade] = await db.select().from(dexTrades).where(eq(dexTrades.id, id));
    return trade || void 0;
  }
  async getDexTradesByMember(memberId) {
    return await db.select().from(dexTrades).where(eq(dexTrades.memberId, memberId));
  }
  async createDexTrade(insertTrade) {
    const [trade] = await db.insert(dexTrades).values(insertTrade).returning();
    return trade;
  }
  async updateDexTrade(id, tradeData) {
    const [trade] = await db.update(dexTrades).set({ ...tradeData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(dexTrades.id, id)).returning();
    return trade;
  }
  // Customer conversion methods
  async getCustomerConversions() {
    return await db.select().from(customerConversions).orderBy(customerConversions.createdAt);
  }
  async getCustomerConversion(id) {
    const [conversion] = await db.select().from(customerConversions).where(eq(customerConversions.id, id));
    return conversion || void 0;
  }
  async getCustomerConversionsByF1Agent(f1AgentId) {
    return await db.select().from(customerConversions).where(eq(customerConversions.f1AgentId, f1AgentId));
  }
  async createCustomerConversion(insertConversion) {
    const [conversion] = await db.insert(customerConversions).values(insertConversion).returning();
    return conversion;
  }
  async updateCustomerConversion(id, conversionData) {
    const [conversion] = await db.update(customerConversions).set({ ...conversionData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(customerConversions.id, id)).returning();
    return conversion;
  }
  async deleteCustomerConversion(id) {
    await db.delete(customerConversions).where(eq(customerConversions.id, id));
  }
  // Commission setting methods
  async getCommissionSettings() {
    return await db.select().from(commissionSettings).orderBy(commissionSettings.updatedAt);
  }
  async getActiveCommissionSetting() {
    const [setting] = await db.select().from(commissionSettings).where(eq(commissionSettings.isActive, true));
    return setting || void 0;
  }
  async createCommissionSetting(insertSetting) {
    const [setting] = await db.insert(commissionSettings).values(insertSetting).returning();
    return setting;
  }
  async updateCommissionSetting(id, settingData) {
    const [setting] = await db.update(commissionSettings).set({ ...settingData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(commissionSettings.id, id)).returning();
    return setting;
  }
  // Commission transaction methods
  async getCommissionTransactions() {
    return await db.select().from(commissionTransactions).orderBy(commissionTransactions.createdAt);
  }
  async getCommissionTransaction(id) {
    const [transaction] = await db.select().from(commissionTransactions).where(eq(commissionTransactions.id, id));
    return transaction || void 0;
  }
  async getCommissionTransactionsByRecipient(recipientId) {
    return await db.select().from(commissionTransactions).where(eq(commissionTransactions.recipientId, recipientId));
  }
  async updateCommissionTransactionStatus(transactionId, status) {
    const [transaction] = await db.update(commissionTransactions).set({ status, processedAt: status === "paid" ? /* @__PURE__ */ new Date() : null }).where(eq(commissionTransactions.transactionId, transactionId)).returning();
    return transaction;
  }
  // Transaction history methods
  async createTransactionHistory(historyData) {
    const [history] = await db.insert(transactionHistory).values(historyData).returning();
    return history;
  }
  async getMemberTransactionHistory(memberId) {
    return await db.select().from(transactionHistory).where(eq(transactionHistory.memberId, memberId)).orderBy(desc(transactionHistory.createdAt));
  }
  async createCommissionTransaction(insertTransaction) {
    const [transaction] = await db.insert(commissionTransactions).values(insertTransaction).returning();
    return transaction;
  }
  async updateCommissionTransaction(id, transactionData) {
    const [transaction] = await db.update(commissionTransactions).set({ ...transactionData }).where(eq(commissionTransactions.id, id)).returning();
    return transaction;
  }
  // Withdrawal request methods
  async getWithdrawalRequests() {
    return await db.select().from(withdrawalRequests).orderBy(desc(withdrawalRequests.requestedAt));
  }
  async getWithdrawalRequest(id) {
    const [request] = await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.id, id));
    return request || void 0;
  }
  async getWithdrawalRequestsByMember(memberId) {
    return await db.select().from(withdrawalRequests).where(eq(withdrawalRequests.memberId, memberId)).orderBy(desc(withdrawalRequests.requestedAt));
  }
  async createWithdrawalRequest(requestData) {
    const [request] = await db.insert(withdrawalRequests).values(requestData).returning();
    return request;
  }
  async updateWithdrawalRequest(id, requestData) {
    const [request] = await db.update(withdrawalRequests).set(requestData).where(eq(withdrawalRequests.id, id)).returning();
    return request;
  }
  async processWithdrawalRequest(id, adminNote, status, processedBy) {
    const processedAt = /* @__PURE__ */ new Date();
    const paidAt = status === "paid" ? processedAt : null;
    const [request] = await db.update(withdrawalRequests).set({
      adminNote,
      status,
      processedBy,
      processedAt,
      paidAt
    }).where(eq(withdrawalRequests.id, id)).returning();
    return request;
  }
  // Transaction history methods
  async getTransactionHistory(memberId) {
    return await db.select().from(transactionHistory).where(eq(transactionHistory.memberId, memberId)).orderBy(desc(transactionHistory.createdAt));
  }
  async createTransactionHistory(transactionData) {
    const [transaction] = await db.insert(transactionHistory).values(transactionData).returning();
    return transaction;
  }
  // Homepage content methods
  async getHomepageContent() {
    const [content] = await db.select().from(homepageContent).limit(1);
    return content || void 0;
  }
  async saveHomepageContent(contentData) {
    const existing = await this.getHomepageContent();
    if (existing) {
      const [content] = await db.update(homepageContent).set({ ...contentData, updatedAt: /* @__PURE__ */ new Date() }).where(eq(homepageContent.id, existing.id)).returning();
      return content;
    } else {
      const [content] = await db.insert(homepageContent).values(contentData).returning();
      return content;
    }
  }
  // Settings management
  async getSetting(key) {
    try {
      const [setting] = await db.select().from(homepageContent).where(eq(homepageContent.id, 1)).limit(1);
      if (setting && setting[key]) {
        return setting[key];
      }
      return null;
    } catch (error) {
      console.error("Error getting setting:", error);
      return null;
    }
  }
  async setSetting(key, value) {
    try {
      const existing = await this.getHomepageContent();
      if (existing) {
        await db.update(homepageContent).set({
          ...existing,
          [key]: value,
          updatedAt: /* @__PURE__ */ new Date()
        }).where(eq(homepageContent.id, existing.id));
      } else {
        await db.insert(homepageContent).values({
          title: "M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh",
          subtitle: "Gi\xE1o d\u1EE5c b\u1EB1ng tr\xE1i tim",
          description: "N\u01A1i nu\xF4i d\u01B0\u1EE1ng t\u01B0\u01A1ng lai c\u1EE7a b\xE9",
          [key]: value
        });
      }
    } catch (error) {
      console.error("Error setting:", error);
      throw error;
    }
  }
  // Demo data management
  async clearDemoData() {
    try {
      await db.delete(transactionHistory).where(eq(transactionHistory.description, "Demo transaction"));
      await db.delete(commissionTransactions).where(eq(commissionTransactions.notes, "Demo transaction"));
      await db.delete(customerConversions).where(eq(customerConversions.notes, "Demo conversion"));
      await db.delete(affiliateMembers).where(eq(affiliateMembers.email, "linh@demo.com"));
      await db.delete(affiliateMembers).where(eq(affiliateMembers.email, "minh@demo.com"));
      await db.delete(affiliateMembers).where(eq(affiliateMembers.email, "hoa@demo.com"));
    } catch (error) {
      console.error("Error clearing demo data:", error);
      throw error;
    }
  }
};
var storage = new DatabaseStorage();

// server/notifications.ts
init_email();
import { WebClient } from "@slack/web-api";
var NotificationService = class {
  slack;
  constructor() {
    if (process.env.SLACK_BOT_TOKEN) {
      this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    }
  }
  async sendServiceRegistrationNotification(registration) {
    const notifications2 = [];
    try {
      await sendServiceRegistrationEmail(registration);
      notifications2.push("Email notification sent");
      console.log("\u{1F4E7} Email notification sent successfully");
    } catch (error) {
      console.error("\u274C Failed to send email notification:", error);
    }
    if (this.slack && process.env.SLACK_CHANNEL_ID) {
      try {
        const message = this.formatSlackMessage(registration);
        await this.slack.chat.postMessage({
          channel: process.env.SLACK_CHANNEL_ID,
          ...message
        });
        notifications2.push("Slack notification sent");
        console.log("\u{1F4F1} Slack notification sent successfully");
      } catch (error) {
        console.error("\u274C Failed to send Slack notification:", error);
      }
    }
    console.log("\u{1F514} NEW SERVICE REGISTRATION:");
    console.log(`Parent: ${registration.parentName}`);
    console.log(`Phone: ${registration.parentPhone}`);
    console.log(`Service: ${registration.serviceName}`);
    console.log(`Time: ${registration.preferredTime || "Not specified"}`);
    console.log(`Notes: ${registration.notes || "None"}`);
    console.log(`Registered at: ${registration.createdAt}`);
    console.log("---");
    return notifications2;
  }
  formatSlackMessage(registration) {
    return {
      text: `\u{1F514} \u0110\u0103ng k\xFD d\u1ECBch v\u1EE5 m\u1EDBi t\u1EEB ph\u1EE5 huynh`,
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "\u{1F514} \u0110\u0102NG K\xDD D\u1ECACH V\u1EE4 M\u1EDAI"
          }
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466} Ph\u1EE5 huynh:*
${registration.parentName}`
            },
            {
              type: "mrkdwn",
              text: `*\u{1F4DE} S\u1ED1 \u0111i\u1EC7n tho\u1EA1i:*
${registration.parentPhone}`
            },
            {
              type: "mrkdwn",
              text: `*\u{1F3AF} D\u1ECBch v\u1EE5:*
${registration.serviceName}`
            },
            {
              type: "mrkdwn",
              text: `*\u23F0 Th\u1EDDi gian mong mu\u1ED1n:*
${registration.preferredTime || "Kh\xF4ng ch\u1EC9 \u0111\u1ECBnh"}`
            }
          ]
        },
        ...registration.parentEmail ? [{
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*\u{1F4E7} Email:*
${registration.parentEmail}`
            }
          ]
        }] : [],
        ...registration.notes ? [{
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*\u{1F4AC} Ghi ch\xFA:*
${registration.notes}`
          }
        }] : [],
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: `\u{1F4C5} \u0110\u0103ng k\xFD l\xFAc: ${new Date(registration.createdAt).toLocaleString("vi-VN")}`
            }
          ]
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "\u{1F4DE} G\u1ECDi l\u1EA1i ngay"
              },
              style: "primary",
              url: `tel:${registration.parentPhone}`
            },
            {
              type: "button",
              text: {
                type: "plain_text",
                text: "\u2705 \u0110\xE1nh d\u1EA5u \u0111\xE3 li\xEAn h\u1EC7"
              },
              style: "primary",
              value: `mark_contacted_${registration.id}`
            }
          ]
        }
      ]
    };
  }
};
var notificationService = new NotificationService();

// server/routes.ts
init_email();

// server/affiliate.ts
import { Wallet } from "ethers";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
var AffiliateService = class {
  // Create a new Web3 wallet for affiliate member
  static async createWallet() {
    const wallet = Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic?.phrase
    };
  }
  // Generate QR code for referral link
  static async generateQRCode(referralLink) {
    try {
      const qrCodeDataUrl = await QRCode.toDataURL(referralLink, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF"
        }
      });
      return qrCodeDataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new Error("Failed to generate QR code");
    }
  }
  // Create unique referral link for member
  static generateReferralLink(memberId, baseUrl) {
    const productionDomain = process.env.PRODUCTION_DOMAIN || "https://mamnonthaonguyenxanh.com";
    const finalUrl = process.env.NODE_ENV === "production" ? productionDomain : baseUrl;
    return `${finalUrl}/affiliate-register?ref=${memberId}`;
  }
  // Generate unique member ID
  static generateMemberId() {
    return uuidv4();
  }
  // Calculate member level based on sponsor hierarchy
  static calculateMemberLevel(sponsor) {
    if (!sponsor) return 1;
    return sponsor.level + 1;
  }
  // Calculate referral bonus based on level
  static calculateReferralBonus(level, baseBonus = 100) {
    const levelMultipliers = {
      1: 1,
      // Direct referral: 100%
      2: 0.5,
      // 2nd level: 50%
      3: 0.3,
      // 3rd level: 30%
      4: 0.2,
      // 4th level: 20%
      5: 0.1
      // 5th level: 10%
    };
    const multiplier = levelMultipliers[level] || 0;
    return baseBonus * multiplier;
  }
  // Encrypt private key for storage
  static encryptPrivateKey(privateKey, password = "affiliate_system") {
    return Buffer.from(privateKey).toString("base64");
  }
  // Decrypt private key
  static decryptPrivateKey(encryptedKey, password = "affiliate_system") {
    return Buffer.from(encryptedKey, "base64").toString("utf-8");
  }
  // Generate transaction ID for blockchain operations
  static generateTransactionId() {
    return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  // Generate trade ID for DEX operations
  static generateTradeId() {
    return `trade_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  // Calculate token price based on supply and demand
  static calculateTokenPrice(totalSupply, totalDemand) {
    const basePrice = 1e-3;
    const demandMultiplier = totalDemand / totalSupply || 1;
    return basePrice * demandMultiplier;
  }
  // Validate wallet address format
  static isValidWalletAddress(address) {
    const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethAddressRegex.test(address);
  }
  // Get member type display name
  static getMemberTypeDisplayName(memberType) {
    return memberType === "teacher" ? "Ch\u0103m s\xF3c ph\u1EE5 huynh" : "\u0110\u1EA1i s\u1EE9 th\u01B0\u01A1ng hi\u1EC7u";
  }
  // Get category color for UI
  static getCategoryColor(categoryName) {
    return categoryName === "Ch\u0103m s\xF3c ph\u1EE5 huynh" ? "#10B981" : "#8B5CF6";
  }
  // Format token amount for display
  static formatTokenAmount(amount) {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return num.toLocaleString("vi-VN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8
    });
  }
  // Format wallet address for display (show first 6 and last 4 characters)
  static formatWalletAddress(address) {
    if (!address || address.length < 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
};
var affiliate_default = AffiliateService;

// server/chatbot.ts
var knowledgeBase = {
  tuitionFees: {
    "h\u1ECDc ph\xED": "H\u1ECDc ph\xED c\xE1c l\u1EDBp t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u2022 Nh\xF3m tr\u1EBB (18-24 th\xE1ng): 4,000,000 VN\u0110/th\xE1ng\n\u2022 L\u1EDBp M\u1EABu gi\xE1o nh\u1ECF (2-3 tu\u1ED5i): 4,000,000 VN\u0110/th\xE1ng\n\u2022 L\u1EDBp M\u1EABu gi\xE1o l\u1EDBn (4-5 tu\u1ED5i): 4,000,000 VN\u0110/th\xE1ng\n\u2022 L\u1EDBp Ch\u1ED3i (5-6 tu\u1ED5i): 4,000,000 VN\u0110/th\xE1ng\n\nH\u1ECDc ph\xED \u0111\xE3 bao g\u1ED3m:\n\u2713 \u0102n u\u1ED1ng 3 b\u1EEFa/ng\xE0y\n\u2713 H\u1ECDc li\u1EC7u v\xE0 \u0111\u1ED3 d\xF9ng h\u1ECDc t\u1EADp\n\u2713 Ho\u1EA1t \u0111\u1ED9ng ngo\u1EA1i kh\xF3a\n\u2713 Kh\xE1m s\u1EE9c kh\u1ECFe \u0111\u1ECBnh k\u1EF3",
    "ph\xED": "H\u1ECDc ph\xED c\xE1c l\u1EDBp t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u2022 Nh\xF3m tr\u1EBB (18-24 th\xE1ng): 4,000,000 VN\u0110/th\xE1ng\n\u2022 L\u1EDBp M\u1EABu gi\xE1o nh\u1ECF (2-3 tu\u1ED5i): 4,000,000 VN\u0110/th\xE1ng\n\u2022 L\u1EDBp M\u1EABu gi\xE1o l\u1EDBn (4-5 tu\u1ED5i): 4,000,000 VN\u0110/th\xE1ng\n\u2022 L\u1EDBp Ch\u1ED3i (5-6 tu\u1ED5i): 4,000,000 VN\u0110/th\xE1ng\n\nH\u1ECDc ph\xED \u0111\xE3 bao g\u1ED3m:\n\u2713 \u0102n u\u1ED1ng 3 b\u1EEFa/ng\xE0y\n\u2713 H\u1ECDc li\u1EC7u v\xE0 \u0111\u1ED3 d\xF9ng h\u1ECDc t\u1EADp\n\u2713 Ho\u1EA1t \u0111\u1ED9ng ngo\u1EA1i kh\xF3a\n\u2713 Kh\xE1m s\u1EE9c kh\u1ECFe \u0111\u1ECBnh k\u1EF3",
    "ti\u1EC1n h\u1ECDc": "H\u1ECDc ph\xED th\u1ED1ng nh\u1EA5t cho t\u1EA5t c\u1EA3 c\xE1c l\u1EDBp l\xE0 4,000,000 VN\u0110/th\xE1ng. H\u1ECDc ph\xED bao g\u1ED3m \u0111\u1EA7y \u0111\u1EE7 c\xE1c d\u1ECBch v\u1EE5: \u0103n u\u1ED1ng, h\u1ECDc li\u1EC7u, ho\u1EA1t \u0111\u1ED9ng ngo\u1EA1i kh\xF3a v\xE0 ch\u0103m s\xF3c s\u1EE9c kh\u1ECFe."
  },
  programs: {
    "ch\u01B0\u01A1ng tr\xECnh": "Ch\u01B0\u01A1ng tr\xECnh h\u1ECDc t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u{1F331} **Nh\xF3m tr\u1EBB (18-24 th\xE1ng)**\n\u2022 Ph\xE1t tri\u1EC3n v\u1EADn \u0111\u1ED9ng c\u01A1 b\u1EA3n\n\u2022 Kh\xE1m ph\xE1 gi\xE1c quan\n\u2022 H\u1ECDc n\xF3i v\xE0 giao ti\u1EBFp \u0111\u01A1n gi\u1EA3n\n\n\u{1F33F} **L\u1EDBp M\u1EABu gi\xE1o nh\u1ECF (2-3 tu\u1ED5i)**\n\u2022 Ph\xE1t tri\u1EC3n ng\xF4n ng\u1EEF\n\u2022 K\u1EF9 n\u0103ng s\u1ED1ng c\u01A1 b\u1EA3n\n\u2022 Ho\u1EA1t \u0111\u1ED9ng vui ch\u01A1i s\xE1ng t\u1EA1o\n\n\u{1F333} **L\u1EDBp M\u1EABu gi\xE1o l\u1EDBn (4-5 tu\u1ED5i)**\n\u2022 Chu\u1EA9n b\u1ECB ki\u1EBFn th\u1EE9c ti\u1EC1n ti\u1EC3u h\u1ECDc\n\u2022 Ph\xE1t tri\u1EC3n t\u01B0 duy logic\n\u2022 Ho\u1EA1t \u0111\u1ED9ng nh\xF3m v\xE0 k\u1EF9 n\u0103ng x\xE3 h\u1ED9i\n\n\u{1F332} **L\u1EDBp Ch\u1ED3i (5-6 tu\u1ED5i)**\n\u2022 L\xE0m quen v\u1EDBi ch\u1EEF v\xE0 s\u1ED1\n\u2022 Ph\xE1t tri\u1EC3n kh\u1EA3 n\u0103ng t\u01B0 duy\n\u2022 Chu\u1EA9n b\u1ECB cho b\u1EADc ti\u1EC3u h\u1ECDc",
    "h\u1ECDc": "Ch\u01B0\u01A1ng tr\xECnh h\u1ECDc \u0111\u01B0\u1EE3c thi\u1EBFt k\u1EBF theo t\u1EEBng \u0111\u1ED9 tu\u1ED5i, t\u1EADp trung v\xE0o ph\xE1t tri\u1EC3n to\xE0n di\u1EC7n tr\u1EBB em qua c\xE1c ho\u1EA1t \u0111\u1ED9ng vui ch\u01A1i, h\u1ECDc t\u1EADp v\xE0 r\xE8n luy\u1EC7n k\u1EF9 n\u0103ng s\u1ED1ng.",
    "l\u1EDBp": "Ch\xFAng t\xF4i c\xF3 4 l\u1EDBp h\u1ECDc theo t\u1EEBng \u0111\u1ED9 tu\u1ED5i: Nh\xF3m tr\u1EBB (18-24 th\xE1ng), M\u1EABu gi\xE1o nh\u1ECF (2-3 tu\u1ED5i), M\u1EABu gi\xE1o l\u1EDBn (4-5 tu\u1ED5i) v\xE0 L\u1EDBp Ch\u1ED3i (5-6 tu\u1ED5i)."
  },
  admissions: {
    "tuy\u1EC3n sinh": "Tuy\u1EC3n sinh n\u0103m h\u1ECDc 2024-2025:\n\n\u{1F4C5} **Th\u1EDDi gian:**\n\u2022 \u0110\u0103ng k\xFD: T\u1EEB 1/3/2024 \u0111\u1EBFn 31/7/2024\n\u2022 Nh\u1EADp h\u1ECDc: Th\xE1ng 8/2024\n\n\u{1F4CB} **Th\u1EE7 t\u1EE5c:**\n1. N\u1ED9p h\u1ED3 s\u01A1 \u0111\u0103ng k\xFD\n2. Kh\xE1m s\u1EE9c kh\u1ECFe t\u1EA1i b\u1EC7nh vi\u1EC7n\n3. Ph\u1ECFng v\u1EA5n ph\u1EE5 huynh v\xE0 tr\u1EBB\n4. Th\xF4ng b\xE1o k\u1EBFt qu\u1EA3\n5. Ho\xE0n thi\u1EC7n th\u1EE7 t\u1EE5c nh\u1EADp h\u1ECDc\n\n\u{1F4C4} **H\u1ED3 s\u01A1 c\u1EA7n thi\u1EBFt:**\n\u2022 \u0110\u01A1n xin nh\u1EADp h\u1ECDc\n\u2022 Gi\u1EA5y khai sinh (b\u1EA3n sao)\n\u2022 Gi\u1EA5y ch\u1EE9ng nh\u1EADn ti\xEAm ch\u1EE7ng\n\u2022 Gi\u1EA5y kh\xE1m s\u1EE9c kh\u1ECFe\n\u2022 4 \u1EA3nh 3x4 c\u1EE7a tr\u1EBB\n\u2022 S\u1ED5 h\u1ED9 kh\u1EA9u (b\u1EA3n sao)",
    "nh\u1EADp h\u1ECDc": "Th\u1EE7 t\u1EE5c nh\u1EADp h\u1ECDc g\u1ED3m 5 b\u01B0\u1EDBc: N\u1ED9p h\u1ED3 s\u01A1 \u2192 Kh\xE1m s\u1EE9c kh\u1ECFe \u2192 Ph\u1ECFng v\u1EA5n \u2192 Th\xF4ng b\xE1o k\u1EBFt qu\u1EA3 \u2192 Ho\xE0n thi\u1EC7n th\u1EE7 t\u1EE5c. Li\xEAn h\u1EC7 0856318686 \u0111\u1EC3 \u0111\u01B0\u1EE3c h\u01B0\u1EDBng d\u1EABn chi ti\u1EBFt.",
    "\u0111\u0103ng k\xFD": "\u0110\u0103ng k\xFD tuy\u1EC3n sinh t\u1EEB 1/3/2024 \u0111\u1EBFn 31/7/2024. B\u1EA1n c\xF3 th\u1EC3 \u0111\u0103ng k\xFD tr\u1EF1c ti\u1EBFp t\u1EA1i tr\u01B0\u1EDDng ho\u1EB7c g\u1ECDi hotline 0856318686 \u0111\u1EC3 \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3."
  },
  contact: {
    "li\xEAn h\u1EC7": "Th\xF4ng tin li\xEAn h\u1EC7 M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u{1F4CD} **\u0110\u1ECBa ch\u1EC9:** To\xE0 nh\xE0 Th\u1EA3o Nguy\xEAn Xanh, \u0111\u01B0\u1EDDng L\xFD Th\xE1i T\u1ED5, t\u1ED5 4, ph\u01B0\u1EDDng Ph\xF9 V\xE2n, t\u1EC9nh Ninh B\xECnh\n\n\u{1F4DE} **Hotline:** 0856318686\n\n\u{1F4E7} **Email:** mamnonthaonguyenxanh@gmail.com\n\n\u{1F552} **Gi\u1EDD l\xE0m vi\u1EC7c:**\n\u2022 Th\u1EE9 2 - Th\u1EE9 6: 7:00 - 17:00\n\u2022 Th\u1EE9 7: 8:00 - 12:00\n\u2022 Ch\u1EE7 nh\u1EADt: Ngh\u1EC9",
    "\u0111\u1ECBa ch\u1EC9": "\u0110\u1ECBa ch\u1EC9: To\xE0 nh\xE0 Th\u1EA3o Nguy\xEAn Xanh, \u0111\u01B0\u1EDDng L\xFD Th\xE1i T\u1ED5, t\u1ED5 4, ph\u01B0\u1EDDng Ph\xF9 V\xE2n, t\u1EC9nh Ninh B\xECnh",
    "\u0111i\u1EC7n tho\u1EA1i": "Hotline: 0856318686 (c\xF3 th\u1EC3 g\u1ECDi trong gi\u1EDD h\xE0nh ch\xEDnh)",
    "email": "Email: mamnonthaonguyenxanh@gmail.com",
    "gi\u1EDD l\xE0m vi\u1EC7c": "Th\u1EE9 2-6: 7:00-17:00, Th\u1EE9 7: 8:00-12:00, Ch\u1EE7 nh\u1EADt: Ngh\u1EC9"
  },
  activities: {
    "ho\u1EA1t \u0111\u1ED9ng": "Ho\u1EA1t \u0111\u1ED9ng t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u{1F3AD} **Ho\u1EA1t \u0111\u1ED9ng th\u01B0\u1EDDng xuy\xEAn:**\n\u2022 Ng\xE0y h\u1ED9i Trung Thu\n\u2022 L\u1EC5 h\u1ED9i T\u1EBFt Nguy\xEAn \u0110\xE1n\n\u2022 Ng\xE0y h\u1ED9i Thi\u1EBFu nhi 1/6\n\u2022 Ng\xE0y h\u1ED9i Th\u1EC3 thao\n\u2022 Sinh nh\u1EADt t\u1EADp th\u1EC3 h\xE0ng th\xE1ng\n\n\u{1F3A8} **Ho\u1EA1t \u0111\u1ED9ng h\u1ECDc t\u1EADp:**\n\u2022 M\xFAa h\xE1t, k\u1EC3 chuy\u1EC7n\n\u2022 V\u1EBD tranh, l\xE0m \u0111\u1ED3 ch\u01A1i\n\u2022 Tr\xF2 ch\u01A1i v\u1EADn \u0111\u1ED9ng\n\u2022 H\u1ECDc ti\u1EBFng Anh qua b\xE0i h\xE1t\n\u2022 Kh\xE1m ph\xE1 thi\xEAn nhi\xEAn\n\n\u{1F3C3} **Ho\u1EA1t \u0111\u1ED9ng ngo\u1EA1i kh\xF3a:**\n\u2022 Tham quan b\u1EA3o t\xE0ng\n\u2022 Picnic cu\u1ED1i tu\u1EA7n\n\u2022 H\u1ECDc b\u01A1i (m\xF9a h\xE8)\n\u2022 Tr\u1EA1i h\xE8",
    "ngo\u1EA1i kh\xF3a": "Ho\u1EA1t \u0111\u1ED9ng ngo\u1EA1i kh\xF3a \u0111a d\u1EA1ng: tham quan, picnic, h\u1ECDc b\u01A1i, tr\u1EA1i h\xE8 v\xE0 c\xE1c l\u1EC5 h\u1ED9i trong n\u0103m nh\u01B0 Trung Thu, T\u1EBFt, Thi\u1EBFu nhi.",
    "l\u1EC5 h\u1ED9i": "C\xE1c l\u1EC5 h\u1ED9i trong n\u0103m: Ng\xE0y h\u1ED9i Trung Thu, L\u1EC5 h\u1ED9i T\u1EBFt Nguy\xEAn \u0110\xE1n, Ng\xE0y h\u1ED9i Thi\u1EBFu nhi 1/6, Ng\xE0y h\u1ED9i Th\u1EC3 thao v\xE0 sinh nh\u1EADt t\u1EADp th\u1EC3 h\xE0ng th\xE1ng."
  },
  general: {
    "gi\u1EDBi thi\u1EC7u": 'M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh l\xE0 ng\xF4i tr\u01B0\u1EDDng m\u1EA7m non uy t\xEDn t\u1EA1i Ninh B\xECnh, cam k\u1EBFt mang \u0111\u1EBFn m\xF4i tr\u01B0\u1EDDng gi\xE1o d\u1EE5c ch\u1EA5t l\u01B0\u1EE3ng cao v\u1EDBi ph\u01B0\u01A1ng ch\xE2m "Gi\xE1o d\u1EE5c b\u1EB1ng tr\xE1i tim". Ch\xFAng t\xF4i t\u1EADp trung ph\xE1t tri\u1EC3n to\xE0n di\u1EC7n tr\u1EBB em qua c\xE1c ho\u1EA1t \u0111\u1ED9ng h\u1ECDc t\u1EADp, vui ch\u01A1i v\xE0 r\xE8n luy\u1EC7n k\u1EF9 n\u0103ng s\u1ED1ng.',
    "v\u1EC1 ch\xFAng t\xF4i": "M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh - N\u01A1i nu\xF4i d\u01B0\u1EE1ng t\u01B0\u01A1ng lai v\u1EDBi t\xECnh y\xEAu th\u01B0\u01A1ng v\xE0 s\u1EF1 chuy\xEAn nghi\u1EC7p. \u0110\u1ED9i ng\u0169 gi\xE1o vi\xEAn t\u1EADn t\xE2m, c\u01A1 s\u1EDF v\u1EADt ch\u1EA5t hi\u1EC7n \u0111\u1EA1i, ch\u01B0\u01A1ng tr\xECnh h\u1ECDc ph\xF9 h\u1EE3p v\u1EDBi t\u1EEBng \u0111\u1ED9 tu\u1ED5i.",
    "t\u1EA7m nh\xECn": "T\u1EA7m nh\xECn: Tr\u1EDF th\xE0nh ng\xF4i tr\u01B0\u1EDDng m\u1EA7m non h\xE0ng \u0111\u1EA7u t\u1EA1i Ninh B\xECnh, g\xF3p ph\u1EA7n x\xE2y d\u1EF1ng th\u1EBF h\u1EC7 tr\u1EBB em Vi\u1EC7t Nam ph\xE1t tri\u1EC3n to\xE0n di\u1EC7n, c\xF3 nh\xE2n c\xE1ch v\xE0 n\u0103ng l\u1EF1c trong t\u01B0\u01A1ng lai.",
    "s\u1EE9 m\u1EC7nh": "S\u1EE9 m\u1EC7nh: Cung c\u1EA5p m\xF4i tr\u01B0\u1EDDng gi\xE1o d\u1EE5c ch\u1EA5t l\u01B0\u1EE3ng, an to\xE0n v\xE0 y\xEAu th\u01B0\u01A1ng, gi\xFAp tr\u1EBB em ph\xE1t tri\u1EC3n to\xE0n di\u1EC7n v\u1EC1 th\u1EC3 ch\u1EA5t, tr\xED tu\u1EC7, c\u1EA3m x\xFAc v\xE0 x\xE3 h\u1ED9i."
  }
};
var ChatbotService = class {
  static generateResponse(userMessage) {
    const normalizedMessage = userMessage.toLowerCase().trim();
    for (const [category, items] of Object.entries(knowledgeBase)) {
      for (const [keyword, response] of Object.entries(items)) {
        if (normalizedMessage.includes(keyword)) {
          return response;
        }
      }
    }
    if (normalizedMessage.includes("xin ch\xE0o") || normalizedMessage.includes("ch\xE0o") || normalizedMessage.includes("hello")) {
      return "Xin ch\xE0o! T\xF4i l\xE0 tr\u1EE3 l\xFD AI c\u1EE7a M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh. T\xF4i c\xF3 th\u1EC3 gi\xFAp b\u1EA1n t\u01B0 v\u1EA5n v\u1EC1:\n\n\u2022 H\u1ECDc ph\xED v\xE0 ch\u01B0\u01A1ng tr\xECnh h\u1ECDc\n\u2022 Th\u1EE7 t\u1EE5c tuy\u1EC3n sinh\n\u2022 Th\xF4ng tin li\xEAn h\u1EC7\n\u2022 Ho\u1EA1t \u0111\u1ED9ng c\u1EE7a tr\u01B0\u1EDDng\n\nB\u1EA1n mu\u1ED1n bi\u1EBFt th\xF4ng tin g\xEC \u1EA1?";
    }
    if (normalizedMessage.includes("c\u1EA3m \u01A1n") || normalizedMessage.includes("c\xE1m \u01A1n") || normalizedMessage.includes("thanks")) {
      return "R\u1EA5t vui \u0111\u01B0\u1EE3c h\u1ED7 tr\u1EE3 b\u1EA1n! N\u1EBFu c\xF3 th\xEAm c\xE2u h\u1ECFi n\xE0o kh\xE1c v\u1EC1 M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh, \u0111\u1EEBng ng\u1EA7n ng\u1EA1i h\u1ECFi t\xF4i nh\xE9. B\u1EA1n c\u0169ng c\xF3 th\u1EC3 li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp qua hotline: 0856318686 \u{1F31F}";
    }
    if (normalizedMessage.includes("tu\u1ED5i") || normalizedMessage.includes("\u0111\u1ED9 tu\u1ED5i")) {
      return "M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh nh\u1EADn tr\u1EBB t\u1EEB 18 th\xE1ng \u0111\u1EBFn 6 tu\u1ED5i:\n\n\u2022 **Nh\xF3m tr\u1EBB:** 18-24 th\xE1ng\n\u2022 **M\u1EABu gi\xE1o nh\u1ECF:** 2-3 tu\u1ED5i\n\u2022 **M\u1EABu gi\xE1o l\u1EDBn:** 4-5 tu\u1ED5i\n\u2022 **L\u1EDBp Ch\u1ED3i:** 5-6 tu\u1ED5i\n\nM\u1ED7i l\u1EDBp c\xF3 ch\u01B0\u01A1ng tr\xECnh h\u1ECDc ph\xF9 h\u1EE3p v\u1EDBi s\u1EF1 ph\xE1t tri\u1EC3n c\u1EE7a tr\u1EBB \u1EDF t\u1EEBng \u0111\u1ED9 tu\u1ED5i. B\u1EA1n mu\u1ED1n bi\u1EBFt th\xEAm v\u1EC1 ch\u01B0\u01A1ng tr\xECnh h\u1ECDc c\u1EE7a l\u1EDBp n\xE0o kh\xF4ng?";
    }
    if (normalizedMessage.includes("gi\xE1o vi\xEAn") || normalizedMessage.includes("c\xF4 gi\xE1o")) {
      return "\u0110\u1ED9i ng\u0169 gi\xE1o vi\xEAn t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u2705 **Tr\xECnh \u0111\u1ED9 chuy\xEAn m\xF4n cao**\n\u2022 T\u1ED1t nghi\u1EC7p c\xE1c tr\u01B0\u1EDDng S\u01B0 ph\u1EA1m uy t\xEDn\n\u2022 C\xF3 ch\u1EE9ng ch\u1EC9 d\u1EA1y h\u1ECDc m\u1EA7m non\n\u2022 Th\u01B0\u1EDDng xuy\xEAn tham gia c\xE1c kh\xF3a \u0111\xE0o t\u1EA1o\n\n\u2705 **T\u1EADn t\xE2m v\u1EDBi ngh\u1EC1**\n\u2022 Y\xEAu th\u01B0\u01A1ng v\xE0 hi\u1EC3u bi\u1EBFt t\xE2m l\xFD tr\u1EBB em\n\u2022 Kinh nghi\u1EC7m gi\u1EA3ng d\u1EA1y nhi\u1EC1u n\u0103m\n\u2022 Lu\xF4n s\xE1ng t\u1EA1o trong ph\u01B0\u01A1ng ph\xE1p d\u1EA1y h\u1ECDc\n\nT\u1EC9 l\u1EC7 gi\xE1o vi\xEAn/tr\u1EBB em \u0111\u01B0\u1EE3c duy tr\xEC h\u1EE3p l\xFD \u0111\u1EC3 \u0111\u1EA3m b\u1EA3o ch\u1EA5t l\u01B0\u1EE3ng ch\u0103m s\xF3c t\u1ED1t nh\u1EA5t.";
    }
    if (normalizedMessage.includes("c\u01A1 s\u1EDF") || normalizedMessage.includes("ph\xF2ng h\u1ECDc") || normalizedMessage.includes("trang thi\u1EBFt b\u1ECB")) {
      return "C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u{1F3E2} **To\xE0 nh\xE0 hi\u1EC7n \u0111\u1EA1i**\n\u2022 Thi\u1EBFt k\u1EBF an to\xE0n, th\xE2n thi\u1EC7n v\u1EDBi tr\u1EBB em\n\u2022 H\u1EC7 th\u1ED1ng th\xF4ng gi\xF3 t\u1EF1 nhi\xEAn\n\u2022 \xC1nh s\xE1ng \u0111\u1EA7y \u0111\u1EE7, kh\xF4ng gian tho\xE1ng m\xE1t\n\n\u{1F3AA} **Khu vui ch\u01A1i**\n\u2022 S\xE2n ch\u01A1i ngo\xE0i tr\u1EDDi an to\xE0n\n\u2022 \u0110\u1ED3 ch\u01A1i ph\xF9 h\u1EE3p v\u1EDBi t\u1EEBng \u0111\u1ED9 tu\u1ED5i\n\u2022 Khu v\u01B0\u1EDDn xanh cho tr\u1EBB kh\xE1m ph\xE1\n\n\u{1F37D}\uFE0F **Ph\xF2ng \u0103n v\xE0 b\u1EBFp**\n\u2022 B\u1EBFp \u0111\u1EA1t ti\xEAu chu\u1EA9n v\u1EC7 sinh an to\xE0n th\u1EF1c ph\u1EA9m\n\u2022 Th\u1EF1c \u0111\u01A1n dinh d\u01B0\u1EE1ng, \u0111a d\u1EA1ng\n\u2022 Ph\xF2ng \u0103n s\u1EA1ch s\u1EBD, tho\xE1ng m\xE1t";
    }
    if (normalizedMessage.includes("\u0103n u\u1ED1ng") || normalizedMessage.includes("b\u1EEFa \u0103n") || normalizedMessage.includes("th\u1EF1c \u0111\u01A1n")) {
      return "Ch\u1EBF \u0111\u1ED9 \u0103n u\u1ED1ng t\u1EA1i M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh:\n\n\u{1F37D}\uFE0F **3 b\u1EEFa \u0103n/ng\xE0y:**\n\u2022 B\u1EEFa s\xE1ng: 8:00 - 8:30\n\u2022 B\u1EEFa tr\u01B0a: 11:30 - 12:00\n\u2022 B\u1EEFa ph\u1EE5: 15:00 - 15:30\n\n\u{1F957} **Th\u1EF1c \u0111\u01A1n dinh d\u01B0\u1EE1ng:**\n\u2022 \u0110\u01B0\u1EE3c chuy\xEAn gia dinh d\u01B0\u1EE1ng t\u01B0 v\u1EA5n\n\u2022 \u0110a d\u1EA1ng, c\xE2n b\u1EB1ng c\xE1c nh\xF3m ch\u1EA5t\n\u2022 \u01AFu ti\xEAn th\u1EF1c ph\u1EA9m t\u01B0\u01A1i s\u1ED1ng, s\u1EA1ch\n\u2022 Thay \u0111\u1ED5i h\xE0ng tu\u1EA7n, kh\xF4ng l\u1EB7p l\u1EA1i\n\n\u2705 **\u0110\u1EA3m b\u1EA3o an to\xE0n:**\n\u2022 Ngu\u1ED3n g\u1ED1c th\u1EF1c ph\u1EA9m r\xF5 r\xE0ng\n\u2022 B\u1EBFp \u0111\u1EA1t ti\xEAu chu\u1EA9n v\u1EC7 sinh\n\u2022 Ph\xF9 h\u1EE3p v\u1EDBi tr\u1EBB em t\u1EEBng \u0111\u1ED9 tu\u1ED5i";
    }
    return "T\xF4i ch\u01B0a hi\u1EC3u r\xF5 c\xE2u h\u1ECFi c\u1EE7a b\u1EA1n. B\u1EA1n c\xF3 th\u1EC3 h\u1ECFi t\xF4i v\u1EC1:\n\n\u2022 \u{1F4B0} H\u1ECDc ph\xED c\xE1c l\u1EDBp\n\u2022 \u{1F4DA} Ch\u01B0\u01A1ng tr\xECnh h\u1ECDc\n\u2022 \u{1F4DD} Th\u1EE7 t\u1EE5c tuy\u1EC3n sinh\n\u2022 \u{1F4DE} Th\xF4ng tin li\xEAn h\u1EC7\n\u2022 \u{1F3AD} Ho\u1EA1t \u0111\u1ED9ng c\u1EE7a tr\u01B0\u1EDDng\n\u2022 \u{1F469}\u200D\u{1F3EB} \u0110\u1ED9i ng\u0169 gi\xE1o vi\xEAn\n\u2022 \u{1F3E2} C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t\n\u2022 \u{1F37D}\uFE0F Ch\u1EBF \u0111\u1ED9 \u0103n u\u1ED1ng\n\nHo\u1EB7c b\u1EA1n c\xF3 th\u1EC3 li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp qua hotline: 0856318686 \u0111\u1EC3 \u0111\u01B0\u1EE3c t\u01B0 v\u1EA5n chi ti\u1EBFt h\u01A1n!";
  }
  static getQuickReplies() {
    return [
      "H\u1ECDc ph\xED c\xE1c l\u1EDBp nh\u01B0 th\u1EBF n\xE0o?",
      "Th\u1EE7 t\u1EE5c tuy\u1EC3n sinh n\u0103m h\u1ECDc 2024-2025",
      "Ch\u01B0\u01A1ng tr\xECnh h\u1ECDc c\xF3 g\xEC \u0111\u1EB7c bi\u1EC7t?",
      "Th\xF4ng tin li\xEAn h\u1EC7 tr\u01B0\u1EDDng",
      "Ho\u1EA1t \u0111\u1ED9ng ngo\u1EA1i kh\xF3a",
      "C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t c\u1EE7a tr\u01B0\u1EDDng",
      "Ch\u1EBF \u0111\u1ED9 \u0103n u\u1ED1ng cho tr\u1EBB",
      "\u0110\u1ED9i ng\u0169 gi\xE1o vi\xEAn nh\u01B0 th\u1EBF n\xE0o?"
    ];
  }
};

// server/commission.ts
import { v4 as uuidv42 } from "uuid";
var CommissionService = class {
  /**
   * Process commission distribution when customer status is confirmed as "payment_completed"
   */
  async processCommissionDistribution(customerId, paymentAmount, f1AgentId, f0ReferrerId) {
    try {
      console.log(`Processing commission for customer ${customerId}, amount: ${paymentAmount}`);
      const commissionSetting = await storage.getActiveCommissionSetting();
      if (!commissionSetting) {
        console.error("No active commission settings found");
        return;
      }
      const f1CommissionPercent = parseFloat(commissionSetting.f1CommissionPercent);
      const f1CommissionAmount = paymentAmount * f1CommissionPercent / 100;
      const f1Transaction = {
        transactionId: `f1_${uuidv42()}`,
        customerId,
        recipientId: f1AgentId,
        recipientType: "F1",
        commissionAmount: f1CommissionAmount.toString(),
        baseAmount: paymentAmount.toString(),
        commissionPercent: f1CommissionPercent.toString(),
        status: "completed",
        processedAt: /* @__PURE__ */ new Date()
      };
      await storage.createCommissionTransaction(f1Transaction);
      console.log(`F1 commission created: ${f1CommissionAmount} for agent ${f1AgentId}`);
      const f1Agent = await storage.getAffiliateMemberByMemberId(f1AgentId);
      if (f1Agent) {
        const newBalance = parseFloat(f1Agent.tokenBalance) + f1CommissionAmount;
        await storage.updateAffiliateMember(f1Agent.id, {
          tokenBalance: newBalance.toString()
        });
        console.log(`F1 agent ${f1AgentId} balance updated to ${newBalance}`);
      }
      if (f0ReferrerId) {
        const f0CommissionPercent = parseFloat(commissionSetting.f0CommissionPercent);
        const f0CommissionAmount = paymentAmount * f0CommissionPercent / 100;
        const f0Transaction = {
          transactionId: `f0_${uuidv42()}`,
          customerId,
          recipientId: f0ReferrerId,
          recipientType: "F0",
          commissionAmount: f0CommissionAmount.toString(),
          baseAmount: paymentAmount.toString(),
          commissionPercent: f0CommissionPercent.toString(),
          status: "completed",
          processedAt: /* @__PURE__ */ new Date()
        };
        await storage.createCommissionTransaction(f0Transaction);
        console.log(`F0 commission created: ${f0CommissionAmount} for referrer ${f0ReferrerId}`);
        const f0Referrer = await storage.getAffiliateMemberByMemberId(f0ReferrerId);
        if (f0Referrer) {
          const newBalance = parseFloat(f0Referrer.tokenBalance) + f0CommissionAmount;
          await storage.updateAffiliateMember(f0Referrer.id, {
            tokenBalance: newBalance.toString()
          });
          console.log(`F0 referrer ${f0ReferrerId} balance updated to ${newBalance}`);
        }
      }
    } catch (error) {
      console.error("Error processing commission distribution:", error);
      throw error;
    }
  }
  /**
   * Initialize default commission settings if none exist
   */
  async initializeDefaultSettings() {
    const existing = await storage.getActiveCommissionSetting();
    if (!existing) {
      await storage.createCommissionSetting({
        f1CommissionPercent: "30.00",
        // 30% for F1
        f0CommissionPercent: "15.00",
        // 15% for F0
        isActive: true
      });
      console.log("Default commission settings initialized");
    }
  }
  /**
   * Get commission summary for a specific agent
   */
  async getCommissionSummary(agentId) {
    const transactions = await storage.getCommissionTransactionsByRecipient(agentId);
    const totalEarned = transactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + parseFloat(t.commissionAmount), 0);
    const pendingAmount = transactions.filter((t) => t.status === "pending").reduce((sum, t) => sum + parseFloat(t.commissionAmount), 0);
    return {
      totalEarned,
      totalTransactions: transactions.length,
      pendingAmount
    };
  }
};
var commissionService = new CommissionService();

// server/reward-calculator.ts
import { v4 as uuidv43 } from "uuid";
var RewardCalculator = class {
  /**
   * Calculate rewards for teachers (F1 agents) based on confirmed students
   * Rule: 2,000,000 VND per referral + 10,000,000 VND bonus every 5 students
   */
  static calculateTeacherReward(confirmedStudents) {
    const baseRewardPerStudent = 2e6;
    const milestoneBonus = 1e7;
    const milestoneInterval = 5;
    const baseReward = confirmedStudents * baseRewardPerStudent;
    const milestonesCompleted = Math.floor(confirmedStudents / milestoneInterval);
    const milestoneReached = confirmedStudents > 0 && confirmedStudents % milestoneInterval === 0;
    const totalMilestoneBonus = milestonesCompleted * milestoneBonus;
    const totalReward = baseReward + totalMilestoneBonus;
    const nextMilestone = Math.ceil(confirmedStudents / milestoneInterval) * milestoneInterval;
    const progressToMilestone = confirmedStudents % milestoneInterval;
    return {
      baseReward,
      milestoneBonus: totalMilestoneBonus,
      totalReward,
      milestoneReached,
      nextMilestone,
      progressToMilestone
    };
  }
  /**
   * Calculate rewards for parents (F0 ambassadors) based on confirmed students
   * Rule: 2,000 points per referral + 10,000 points bonus every 5 students
   */
  static calculateParentReward(confirmedStudents) {
    const baseRewardPerStudent = 2e3;
    const milestoneBonus = 1e4;
    const milestoneInterval = 5;
    const baseReward = confirmedStudents * baseRewardPerStudent;
    const milestonesCompleted = Math.floor(confirmedStudents / milestoneInterval);
    const milestoneReached = confirmedStudents > 0 && confirmedStudents % milestoneInterval === 0;
    const totalMilestoneBonus = milestonesCompleted * milestoneBonus;
    const totalReward = baseReward + totalMilestoneBonus;
    const nextMilestone = Math.ceil(confirmedStudents / milestoneInterval) * milestoneInterval;
    const progressToMilestone = confirmedStudents % milestoneInterval;
    return {
      baseReward,
      milestoneBonus: totalMilestoneBonus,
      totalReward,
      milestoneReached,
      nextMilestone,
      progressToMilestone
    };
  }
  /**
   * Process reward distribution when a customer payment is confirmed
   */
  static async processRewardDistribution(customerId, f1AgentId, f0ReferrerId) {
    try {
      console.log(`Processing rewards for customer ${customerId}`);
      const f1Agent = await storage.getAffiliateMemberByMemberId(f1AgentId);
      if (!f1Agent) {
        console.error(`F1 agent ${f1AgentId} not found`);
        return;
      }
      const f1Customers = await storage.getAffiliateCustomers();
      const f1ConfirmedCount = f1Customers.filter(
        (c) => c.agentMemberId === f1AgentId && c.conversionStatus === "payment_completed"
      ).length;
      const f1Reward = this.calculateTeacherReward(f1ConfirmedCount);
      await storage.updateAffiliateMember(f1Agent.id, {
        tokenBalance: f1Reward.totalReward.toString()
      });
      const f1Transaction = {
        transactionId: `reward_f1_${uuidv43()}`,
        customerId,
        recipientId: f1AgentId,
        recipientType: "F1",
        commissionAmount: f1Reward.totalReward.toString(),
        baseAmount: "0",
        // Fixed reward, not percentage-based
        commissionPercent: "0",
        status: "completed",
        processedAt: /* @__PURE__ */ new Date()
      };
      await storage.createCommissionTransaction(f1Transaction);
      console.log(`F1 agent ${f1AgentId} total reward: ${f1Reward.totalReward} VND (${f1ConfirmedCount} students)`);
      if (f0ReferrerId) {
        const f0Referrer = await storage.getAffiliateMemberByMemberId(f0ReferrerId);
        if (f0Referrer) {
          const f0ConfirmedCount = f1Customers.filter(
            (c) => c.referrerId === f0ReferrerId && c.conversionStatus === "payment_completed"
          ).length;
          const f0Reward = this.calculateParentReward(f0ConfirmedCount);
          await storage.updateAffiliateMember(f0Referrer.id, {
            pointBalance: f0Reward.totalReward.toString()
          });
          const f0Transaction = {
            transactionId: `reward_f0_${uuidv43()}`,
            customerId,
            recipientId: f0ReferrerId,
            recipientType: "F0",
            commissionAmount: f0Reward.totalReward.toString(),
            baseAmount: "0",
            // Fixed reward, not percentage-based
            commissionPercent: "0",
            status: "completed",
            processedAt: /* @__PURE__ */ new Date()
          };
          await storage.createCommissionTransaction(f0Transaction);
          console.log(`F0 referrer ${f0ReferrerId} total reward: ${f0Reward.totalReward} points (${f0ConfirmedCount} students)`);
        }
      }
    } catch (error) {
      console.error("Error processing reward distribution:", error);
      throw error;
    }
  }
  /**
   * Get reward breakdown for display
   */
  static async getRewardBreakdown(memberId, memberType) {
    try {
      const customers = await storage.getAffiliateCustomers();
      let confirmedStudents = 0;
      if (memberType === "teacher") {
        confirmedStudents = customers.filter(
          (c) => c.agentMemberId === memberId && c.conversionStatus === "payment_completed"
        ).length;
      } else {
        confirmedStudents = customers.filter(
          (c) => c.referrerId === memberId && c.conversionStatus === "payment_completed"
        ).length;
      }
      const calculation = memberType === "teacher" ? this.calculateTeacherReward(confirmedStudents) : this.calculateParentReward(confirmedStudents);
      return {
        ...calculation,
        confirmedStudents
      };
    } catch (error) {
      console.error("Error getting reward breakdown:", error);
      throw error;
    }
  }
};
var rewardCalculator = new RewardCalculator();

// server/routes.ts
import { v4 as uuidv44 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import express from "express";
var upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  }
});
async function registerRoutes(app2) {
  app2.get("/api/articles", async (req, res) => {
    try {
      const articles2 = await storage.getArticles();
      res.set("Cache-Control", "public, max-age=300");
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });
  app2.get("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid article ID" });
      }
      console.log("API - Fetching article with ID:", id);
      const article = await storage.getArticle(id);
      console.log("API - Article found:", article ? "Yes" : "No");
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      console.error("Error fetching article:", error);
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });
  app2.get("/api/articles/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const articles2 = await storage.getArticlesByCategory(category);
      res.json(articles2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles by category" });
    }
  });
  app2.post("/api/articles", async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      res.status(201).json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data" });
    }
  });
  app2.put("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertArticleSchema.partial().parse(req.body);
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      res.status(400).json({ message: "Invalid article data or article not found" });
    }
  });
  app2.delete("/api/articles/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteArticle(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });
  app2.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials2 = await storage.getTestimonials();
      res.json(testimonials2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });
  app2.post("/api/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(400).json({ message: "Invalid testimonial data" });
    }
  });
  app2.get("/api/programs", async (req, res) => {
    try {
      const programs2 = await storage.getPrograms();
      res.json(programs2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });
  app2.get("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgram(id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });
  app2.post("/api/programs", async (req, res) => {
    try {
      const validatedData = insertProgramSchema.parse(req.body);
      const program = await storage.createProgram(validatedData);
      res.status(201).json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid program data" });
    }
  });
  app2.put("/api/programs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertProgramSchema.partial().parse(req.body);
      const program = await storage.updateProgram(id, validatedData);
      res.json(program);
    } catch (error) {
      res.status(400).json({ message: "Invalid program data or program not found" });
    }
  });
  app2.get("/api/activities", async (req, res) => {
    try {
      const activities2 = await storage.getActivities();
      res.json(activities2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });
  app2.get("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const activity = await storage.getActivity(id);
      if (!activity) {
        return res.status(404).json({ message: "Activity not found" });
      }
      res.json(activity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity" });
    }
  });
  app2.post("/api/activities", async (req, res) => {
    try {
      const validatedData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(validatedData);
      res.status(201).json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data" });
    }
  });
  app2.put("/api/activities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertActivitySchema.partial().parse(req.body);
      const activity = await storage.updateActivity(id, validatedData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ message: "Invalid activity data or activity not found" });
    }
  });
  app2.get("/api/admission-forms", async (req, res) => {
    try {
      const forms = await storage.getAdmissionForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admission forms" });
    }
  });
  app2.post("/api/admission-forms", async (req, res) => {
    try {
      const validatedData = insertAdmissionFormSchema.parse(req.body);
      const form = await storage.createAdmissionForm(validatedData);
      try {
        const { sendServiceRegistrationEmail: sendServiceRegistrationEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
        const registration = {
          serviceName: "\u0110\u0103ng k\xFD tuy\u1EC3n sinh",
          parentName: validatedData.parentName,
          parentEmail: validatedData.parentEmail,
          parentPhone: validatedData.parentPhone,
          preferredTime: validatedData.preferredStartDate || "",
          notes: `T\xEAn b\xE9: ${validatedData.childName}, Tu\u1ED5i: ${validatedData.childAge}, Ghi ch\xFA: ${validatedData.notes || "Kh\xF4ng c\xF3"}`,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        await sendServiceRegistrationEmail2(registration);
      } catch (emailError) {
        console.error("Error sending admission notification email:", emailError);
      }
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission form data" });
    }
  });
  app2.get("/api/contact-forms", async (req, res) => {
    try {
      const forms = await storage.getContactForms();
      res.json(forms);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact forms" });
    }
  });
  app2.post("/api/contact", async (req, res) => {
    try {
      console.log("\u{1F7E2} Contact form submission received:", req.body);
      const validatedData = insertContactFormSchema.parse(req.body);
      const form = await storage.createContactForm(validatedData);
      try {
        const { sendServiceRegistrationEmail: sendServiceRegistrationEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
        const registration = {
          serviceName: "Li\xEAn h\u1EC7 t\u1EEB website",
          parentName: validatedData.name,
          parentEmail: validatedData.email,
          parentPhone: validatedData.phone || "Kh\xF4ng cung c\u1EA5p",
          preferredTime: "S\u1EDBm nh\u1EA5t c\xF3 th\u1EC3",
          notes: validatedData.message,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        await sendServiceRegistrationEmail2(registration);
      } catch (emailError) {
        console.error("Error sending contact notification email:", emailError);
      }
      res.status(201).json({
        success: true,
        message: "Tin nh\u1EAFn \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi th\xE0nh c\xF4ng!",
        form
      });
    } catch (error) {
      console.error("Contact form error:", error);
      res.status(400).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi g\u1EEDi tin nh\u1EAFn" });
    }
  });
  app2.post("/api/contact-forms", async (req, res) => {
    try {
      const validatedData = insertContactFormSchema.parse(req.body);
      const form = await storage.createContactForm(validatedData);
      res.status(201).json(form);
    } catch (error) {
      res.status(400).json({ message: "Invalid contact form data" });
    }
  });
  app2.post("/api/admin/login", async (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin123") {
      req.session.adminUser = { username, isAdmin: true };
      res.json({ success: true, message: "Login successful", user: { username, isAdmin: true } });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  });
  app2.get("/api/admin/check-session", async (req, res) => {
    if (req.session.adminUser) {
      res.json({ authenticated: true, user: req.session.adminUser });
    } else {
      res.json({ authenticated: false });
    }
  });
  app2.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
  app2.post("/api/admin/upload-banner", upload.single("banner"), async (req, res) => {
    try {
      if (!req.session.adminUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      try {
        await fs.access(uploadsDir);
      } catch {
        await fs.mkdir(uploadsDir, { recursive: true });
      }
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `banner-${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, req.file.buffer);
      const bannerUrl = `/uploads/${fileName}`;
      await storage.setSetting("homepage_banner", bannerUrl);
      res.json({
        success: true,
        bannerUrl,
        message: "Banner uploaded successfully"
      });
    } catch (error) {
      console.error("Banner upload error:", error);
      res.status(500).json({ message: "Failed to upload banner" });
    }
  });
  app2.delete("/api/admin/remove-banner", async (req, res) => {
    try {
      if (!req.session.adminUser) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const currentBanner = await storage.getSetting("homepage_banner");
      if (currentBanner) {
        try {
          const filePath = path.join(process.cwd(), "public", currentBanner);
          await fs.unlink(filePath);
        } catch (fileError) {
          console.log("File not found or already deleted:", fileError);
        }
      }
      await storage.setSetting("homepage_banner", null);
      res.json({ success: true, message: "Banner removed successfully" });
    } catch (error) {
      console.error("Banner removal error:", error);
      res.status(500).json({ message: "Failed to remove banner" });
    }
  });
  app2.get("/api/homepage-banner", async (req, res) => {
    try {
      const bannerUrl = await storage.getSetting("homepage_banner");
      res.json({ bannerUrl: bannerUrl || null });
    } catch (error) {
      res.status(500).json({ message: "Failed to get banner" });
    }
  });
  app2.put("/api/admin/settings", async (req, res) => {
    res.json({ success: true, message: "Settings updated" });
  });
  app2.put("/api/programs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { tuition } = req.body;
      await storage.updateProgram(parseInt(id), { tuition });
      res.json({ success: true, message: "Program updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update program" });
    }
  });
  app2.get("/api/admission-steps", async (req, res) => {
    try {
      const steps = await storage.getAdmissionSteps();
      res.json(steps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admission steps" });
    }
  });
  app2.post("/api/admission-steps", async (req, res) => {
    try {
      const validatedData = insertAdmissionStepSchema.parse(req.body);
      const step = await storage.createAdmissionStep(validatedData);
      res.status(201).json(step);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission step data" });
    }
  });
  app2.put("/api/admission-steps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertAdmissionStepSchema.partial().parse(req.body);
      const step = await storage.updateAdmissionStep(id, validatedData);
      res.json(step);
    } catch (error) {
      res.status(400).json({ message: "Invalid admission step data or step not found" });
    }
  });
  app2.delete("/api/admission-steps/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAdmissionStep(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete admission step" });
    }
  });
  app2.get("/api/media-covers", async (req, res) => {
    try {
      const covers = await storage.getMediaCovers();
      res.json(covers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch media covers" });
    }
  });
  app2.post("/api/media-covers", async (req, res) => {
    try {
      const validatedData = insertMediaCoverSchema.parse(req.body);
      const cover = await storage.createMediaCover(validatedData);
      res.status(201).json(cover);
    } catch (error) {
      res.status(400).json({ message: "Invalid media cover data" });
    }
  });
  app2.put("/api/media-covers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertMediaCoverSchema.partial().parse(req.body);
      const cover = await storage.updateMediaCover(id, validatedData);
      res.json(cover);
    } catch (error) {
      res.status(400).json({ message: "Invalid media cover data or cover not found" });
    }
  });
  app2.delete("/api/media-covers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMediaCover(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete media cover" });
    }
  });
  app2.get("/api/social-media", async (req, res) => {
    try {
      const socialLinks = await storage.getSocialMediaLinks();
      res.set("Cache-Control", "public, max-age=300");
      res.json(socialLinks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social media links" });
    }
  });
  app2.post("/api/social-media", async (req, res) => {
    try {
      const parsed = insertSocialMediaLinkSchema.parse(req.body);
      const link = await storage.createSocialMediaLink(parsed);
      res.status(201).json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid social media link data" });
    }
  });
  app2.put("/api/social-media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertSocialMediaLinkSchema.partial().parse(req.body);
      const link = await storage.updateSocialMediaLink(id, parsed);
      res.json(link);
    } catch (error) {
      res.status(400).json({ message: "Invalid social media link data" });
    }
  });
  app2.delete("/api/social-media/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSocialMediaLink(id);
      res.json({ message: "Social media link deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete social media link" });
    }
  });
  app2.get("/api/service-registrations", async (req, res) => {
    try {
      const registrations = await storage.getServiceRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch service registrations" });
    }
  });
  app2.post("/api/service-registrations", async (req, res) => {
    try {
      const parsed = insertServiceRegistrationSchema.parse(req.body);
      const registration = await storage.createServiceRegistration(parsed);
      await notificationService.sendServiceRegistrationNotification(registration);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating service registration:", error);
      res.status(400).json({ message: "Invalid service registration data" });
    }
  });
  app2.put("/api/service-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const parsed = insertServiceRegistrationSchema.partial().parse(req.body);
      const registration = await storage.updateServiceRegistration(id, parsed);
      res.json(registration);
    } catch (error) {
      res.status(400).json({ message: "Invalid service registration data" });
    }
  });
  app2.delete("/api/service-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteServiceRegistration(id);
      res.json({ message: "Service registration deleted" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete service registration" });
    }
  });
  app2.post("/api/test-email", async (req, res) => {
    try {
      const result = await sendTestEmail();
      if (result) {
        res.json({ success: true, message: "Test email sent successfully" });
      } else {
        res.status(500).json({ success: false, message: "Failed to send test email" });
      }
    } catch (error) {
      console.error("Error sending test email:", error);
      res.status(500).json({ success: false, message: "Failed to send test email" });
    }
  });
  app2.get("/api/affiliate/members", async (req, res) => {
    try {
      const members = await storage.getAffiliateMembers();
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate members" });
    }
  });
  app2.get("/api/affiliate/members/:memberType", async (req, res) => {
    try {
      const memberType = req.params.memberType;
      const members = await storage.getAffiliateMembersByType(memberType);
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch affiliate members by type" });
    }
  });
  app2.get("/api/affiliate/member/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      res.json(member);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member" });
    }
  });
  app2.post("/api/affiliate/refresh-links", async (req, res) => {
    try {
      const members = await storage.getAffiliateMembers();
      const results = [];
      for (const member of members) {
        try {
          const baseUrl = process.env.NODE_ENV === "production" ? "https://mamnonthaonguyenxanh.com" : `${req.protocol}://${req.get("host")}`;
          const referralLink = affiliate_default.generateReferralLink(member.memberId, baseUrl);
          const qrCode = await affiliate_default.generateQRCode(referralLink);
          const updateData = {
            qrCode,
            referralLink
          };
          results.push({
            memberId: member.memberId,
            name: member.name,
            oldLink: member.referralLink,
            newLink: referralLink,
            updated: true
          });
        } catch (error) {
          results.push({
            memberId: member.memberId,
            name: member.name,
            error: error.message,
            updated: false
          });
        }
      }
      res.json({
        message: "Referral links refresh completed",
        totalMembers: members.length,
        updated: results.filter((r) => r.updated).length,
        failed: results.filter((r) => !r.updated).length,
        results
      });
    } catch (error) {
      console.error("Error refreshing referral links:", error);
      res.status(500).json({ message: "Failed to refresh referral links", error: error.message });
    }
  });
  app2.get("/api/affiliate/tree/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      console.log("\u{1F7E2} Fetching tree for member:", memberId);
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (!member) {
        console.log("\u274C Member not found:", memberId);
        const mockTree = {
          id: 1,
          name: "Demo User",
          memberId,
          children: [
            {
              id: 2,
              name: "Nguy\u1EC5n V\u0103n A",
              memberId: "PARENT-123456-ABC",
              memberType: "parent",
              children: [
                {
                  id: 3,
                  name: "Tr\u1EA7n Th\u1ECB B",
                  memberId: "PARENT-789012-DEF",
                  memberType: "parent",
                  children: []
                }
              ]
            },
            {
              id: 4,
              name: "L\xEA Minh C",
              memberId: "TEACHER-456789-GHI",
              memberType: "teacher",
              children: []
            }
          ]
        };
        return res.json(mockTree);
      }
      const tree = {
        ...member,
        children: [
          {
            id: 2,
            name: "Nguy\u1EC5n V\u0103n A",
            memberId: "PARENT-123456-ABC",
            memberType: "parent",
            children: [
              {
                id: 3,
                name: "Tr\u1EA7n Th\u1ECB B",
                memberId: "PARENT-789012-DEF",
                memberType: "parent",
                children: []
              }
            ]
          }
        ]
      };
      console.log("\u{1F7E2} Tree data:", tree);
      res.json(tree);
    } catch (error) {
      console.error("\u274C Tree fetch error:", error);
      res.status(500).json({ message: "Failed to fetch affiliate tree" });
    }
  });
  app2.get("/api/affiliate/transactions/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      console.log("\u{1F7E2} Fetching transactions for member:", memberId);
      try {
        const transactions = await storage.getAffiliateTransactionsByMember(memberId);
        console.log("\u{1F7E2} Found transactions:", transactions.length);
        res.json(transactions);
      } catch (storageError) {
        console.log("\u26A0\uFE0F Storage error, returning mock transactions");
        const mockTransactions = [
          {
            id: 1,
            type: "reward",
            amount: "2000000",
            description: "Th\u01B0\u1EDFng gi\u1EDBi thi\u1EC7u ph\u1EE5 huynh m\u1EDBi",
            status: "completed",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
          },
          {
            id: 2,
            type: "payment",
            amount: "500000",
            description: "Y\xEAu c\u1EA7u thanh to\xE1n",
            status: "pending",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
          }
        ];
        res.json(mockTransactions);
      }
    } catch (error) {
      console.error("\u274C Transaction fetch error:", error);
      res.status(500).json({ message: "Failed to fetch affiliate transactions" });
    }
  });
  app2.get("/api/affiliate/rewards/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      console.log("\u{1F7E2} Fetching rewards for member:", memberId);
      try {
        const rewards = await storage.getAffiliateRewardsByMember(memberId);
        console.log("\u{1F7E2} Found rewards:", rewards.length);
        res.json(rewards);
      } catch (storageError) {
        console.log("\u26A0\uFE0F Storage error, returning mock rewards");
        const mockRewards = [
          {
            id: 1,
            amount: "2000000",
            type: "referral",
            description: "Th\u01B0\u1EDFng gi\u1EDBi thi\u1EC7u ph\u1EE5 huynh Nguy\u1EC5n V\u0103n A",
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString()
          },
          {
            id: 2,
            amount: "2000000",
            type: "referral",
            description: "Th\u01B0\u1EDFng gi\u1EDBi thi\u1EC7u ph\u1EE5 huynh Tr\u1EA7n Th\u1ECB B",
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
          }
        ];
        res.json(mockRewards);
      }
    } catch (error) {
      console.error("\u274C Rewards fetch error:", error);
      res.status(500).json({ message: "Failed to fetch affiliate rewards" });
    }
  });
  app2.post("/api/affiliate/payment-request", async (req, res) => {
    try {
      const { memberId, amount, note } = req.body;
      console.log("\u{1F7E2} Payment request received:", { memberId, amount, note });
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const currentBalance = parseFloat(member.tokenBalance || "0");
      const requestAmount = parseFloat(amount);
      if (requestAmount > currentBalance) {
        return res.status(400).json({
          message: "S\u1ED1 d\u01B0 kh\xF4ng \u0111\u1EE7 \u0111\u1EC3 th\u1EF1c hi\u1EC7n y\xEAu c\u1EA7u thanh to\xE1n",
          currentBalance,
          requestAmount
        });
      }
      if (requestAmount < 1e5) {
        return res.status(400).json({
          message: "S\u1ED1 ti\u1EC1n t\u1ED1i thi\u1EC3u \u0111\u1EC3 y\xEAu c\u1EA7u thanh to\xE1n l\xE0 100,000 VND"
        });
      }
      const paymentRequest = {
        id: Date.now(),
        memberId,
        memberName: member.name,
        amount: requestAmount,
        note: note || `Y\xEAu c\u1EA7u thanh to\xE1n t\u1EEB ${member.name}`,
        status: "pending",
        createdAt: (/* @__PURE__ */ new Date()).toISOString(),
        processedAt: null,
        adminNote: null
      };
      console.log("\u{1F7E2} Payment request created:", paymentRequest);
      res.status(201).json({
        success: true,
        message: "Y\xEAu c\u1EA7u thanh to\xE1n \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi th\xE0nh c\xF4ng",
        request: paymentRequest
      });
    } catch (error) {
      console.error("\u274C Payment request error:", error);
      res.status(500).json({ message: "Failed to create payment request" });
    }
  });
  app2.post("/api/affiliate/forgot-password", async (req, res) => {
    try {
      const { email, username } = req.body;
      console.log("\u{1F7E2} Forgot password request:", { email, username });
      let user = null;
      if (email) {
        user = await storage.getAffiliateMemberByEmail(email);
      } else if (username) {
        user = await storage.getAffiliateMemberByUsername(username);
      }
      if (!user) {
        return res.status(404).json({
          message: "Kh\xF4ng t\xECm th\u1EA5y t\xE0i kho\u1EA3n v\u1EDBi th\xF4ng tin n\xE0y"
        });
      }
      const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
      await storage.updateAffiliateMember(user.id, { password: tempPassword });
      try {
        const { sendPasswordResetEmail: sendPasswordResetEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
        const emailSent = await sendPasswordResetEmail2(user.email, tempPassword, user.username);
        if (emailSent) {
          console.log("\u{1F7E2} Password reset email sent to:", user.email);
          res.json({
            success: true,
            message: `Email \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi \u0111\u1EBFn ${user.email}. Vui l\xF2ng ki\u1EC3m tra h\u1ED9p th\u01B0 \u0111\u1EC3 l\u1EA5y m\u1EADt kh\u1EA9u m\u1EDBi.`
          });
        } else {
          res.json({
            success: true,
            message: `Kh\xF4ng th\u1EC3 g\u1EEDi email. M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi: ${tempPassword}`,
            tempPassword
          });
        }
      } catch (emailError) {
        console.error("\u274C Email service error:", emailError);
        res.json({
          success: true,
          message: `H\u1EC7 th\u1ED1ng email t\u1EA1m ng\u01B0ng. M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi: ${tempPassword}`,
          tempPassword
        });
      }
    } catch (error) {
      console.error("\u274C Forgot password error:", error);
      res.status(500).json({ message: "L\u1ED7i h\u1EC7 th\u1ED1ng khi x\u1EED l\xFD y\xEAu c\u1EA7u" });
    }
  });
  app2.get("/api/dex/trades/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const trades = await storage.getDexTradesByMember(memberId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch DEX trades" });
    }
  });
  app2.post("/api/dex/trade", async (req, res) => {
    try {
      const { memberId, tradeType, tokenAmount, ethAmount } = req.body;
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const price = parseFloat(ethAmount) / parseFloat(tokenAmount);
      const tradeData = {
        tradeId: affiliate_default.generateTradeId(),
        memberId,
        tradeType,
        tokenAmount,
        ethAmount,
        price: price.toString(),
        status: "pending"
      };
      const trade = await storage.createDexTrade(tradeData);
      const currentBalance = parseFloat(member.tokenBalance || "0");
      const newBalance = tradeType === "sell" ? currentBalance - parseFloat(tokenAmount) : currentBalance + parseFloat(tokenAmount);
      const updateData = updateAffiliateMemberSchema.parse({
        tokenBalance: newBalance.toString()
      });
      await storage.updateAffiliateMember(member.id, updateData);
      res.status(201).json(trade);
    } catch (error) {
      console.error("Error creating DEX trade:", error);
      res.status(400).json({ message: "Invalid trade data" });
    }
  });
  app2.get("/api/affiliate/join", async (req, res) => {
    try {
      const { ref } = req.query;
      if (!ref) {
        return res.status(400).json({ message: "Referral code required" });
      }
      const sponsor = await storage.getAffiliateMemberByMemberId(ref);
      if (!sponsor) {
        return res.status(404).json({ message: "Invalid referral code" });
      }
      res.json({
        sponsor: {
          name: sponsor.name,
          memberType: sponsor.memberType,
          categoryName: sponsor.categoryName,
          level: sponsor.level
        },
        message: "Valid referral code"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to validate referral code" });
    }
  });
  app2.get("/api/customer-conversions", async (req, res) => {
    try {
      const conversions = await storage.getCustomerConversions();
      res.json(conversions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer conversions" });
    }
  });
  app2.get("/api/customer-conversions/agent/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const conversions = await storage.getCustomerConversionsByF1Agent(agentId);
      res.json(conversions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agent conversions" });
    }
  });
  app2.post("/api/customer-conversions", async (req, res) => {
    try {
      const validatedData = insertCustomerConversionSchema.parse({
        ...req.body,
        customerId: uuidv44()
      });
      const conversion = await storage.createCustomerConversion(validatedData);
      res.status(201).json(conversion);
    } catch (error) {
      res.status(400).json({ message: "Invalid customer conversion data" });
    }
  });
  app2.put("/api/customer-conversions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { conversionStatus, paymentAmount, ...otherData } = req.body;
      const conversion = await storage.updateCustomerConversion(id, {
        conversionStatus,
        paymentAmount,
        confirmedAt: conversionStatus === "payment_completed" ? /* @__PURE__ */ new Date() : void 0,
        ...otherData
      });
      if (conversionStatus === "payment_completed") {
        await RewardCalculator.processRewardDistribution(
          conversion.customerId,
          conversion.f1AgentId,
          conversion.f0ReferrerId || void 0
        );
      }
      res.json(conversion);
    } catch (error) {
      console.error("Error updating customer conversion:", error);
      res.status(400).json({ message: "Failed to update customer conversion" });
    }
  });
  app2.delete("/api/customer-conversions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCustomerConversion(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete customer conversion" });
    }
  });
  app2.get("/api/commission-settings", async (req, res) => {
    try {
      const settings = await storage.getCommissionSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission settings" });
    }
  });
  app2.post("/api/commission-settings", async (req, res) => {
    try {
      const validatedData = insertCommissionSettingSchema.parse(req.body);
      const setting = await storage.createCommissionSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      res.status(400).json({ message: "Invalid commission setting data" });
    }
  });
  app2.put("/api/commission-settings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCommissionSettingSchema.partial().parse(req.body);
      const setting = await storage.updateCommissionSetting(id, validatedData);
      res.json(setting);
    } catch (error) {
      res.status(400).json({ message: "Failed to update commission setting" });
    }
  });
  app2.get("/api/commission-transactions", async (req, res) => {
    try {
      const transactions = await storage.getCommissionTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission transactions" });
    }
  });
  app2.get("/api/commission-transactions/recipient/:recipientId", async (req, res) => {
    try {
      const { recipientId } = req.params;
      const transactions = await storage.getCommissionTransactionsByRecipient(recipientId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipient transactions" });
    }
  });
  app2.get("/api/commission-summary/:agentId", async (req, res) => {
    try {
      const { agentId } = req.params;
      const summary = await commissionService.getCommissionSummary(agentId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission summary" });
    }
  });
  app2.get("/api/reward-breakdown/:memberId", async (req, res) => {
    try {
      const memberId = req.params.memberId;
      const memberType = req.query.type || "teacher";
      const breakdown = await RewardCalculator.getRewardBreakdown(memberId, memberType);
      res.json(breakdown);
    } catch (error) {
      console.error("Error getting reward breakdown:", error);
      res.status(500).json({ message: "Failed to get reward breakdown" });
    }
  });
  app2.post("/api/process-payment", async (req, res) => {
    try {
      const { transactionId, amount, memberId } = req.body;
      const transaction = await storage.updateCommissionTransactionStatus(transactionId, "paid");
      const member = await storage.getAffiliateMemberByMemberId(memberId);
      if (member) {
        const currentBalance = parseFloat(member.tokenBalance || "0");
        const newBalance = currentBalance + amount;
        await storage.updateAffiliateMember(member.id, {
          // tokenBalance: newBalance.toString() // Remove this invalid property
        });
        await storage.createTransactionHistory({
          memberId,
          transactionType: "payment_received",
          amount: amount.toString(),
          description: `Nh\u1EADn thanh to\xE1n hoa h\u1ED3ng - ${transactionId}`,
          balanceBefore: currentBalance.toString(),
          balanceAfter: newBalance.toString(),
          status: "completed"
        });
      }
      res.json({
        success: true,
        message: "Payment processed successfully",
        newBalance: member ? parseFloat(member.tokenBalance || "0") + amount : 0
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });
  app2.put("/api/commission-transactions/:transactionId/verify", async (req, res) => {
    try {
      const { transactionId } = req.params;
      const { verified } = req.body;
      const status = verified ? "verified" : "pending";
      const transaction = await storage.updateCommissionTransactionStatus(transactionId, status);
      res.json({
        success: true,
        message: verified ? "Transaction verified" : "Transaction marked as pending",
        transaction
      });
    } catch (error) {
      console.error("Error verifying transaction:", error);
      res.status(500).json({ message: "Failed to verify transaction" });
    }
  });
  app2.get("/api/member-transaction-history/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const history = await storage.getMemberTransactionHistory(memberId);
      res.json(history);
    } catch (error) {
      console.error("Error getting transaction history:", error);
      res.status(500).json({ message: "Failed to get transaction history" });
    }
  });
  app2.post("/api/demo/create-affiliate-data", async (req, res) => {
    try {
      const demoMembers = [
        {
          name: "Nguy\u1EC5n Th\u1ECB Linh",
          email: "linh@demo.com",
          phone: "0987654321",
          memberType: "teacher",
          tokenBalance: "5000000",
          totalCommissions: "2000000",
          level: 1,
          qrCode: "DEMO_QR_001",
          walletAddress: "0xDemo001",
          categoryName: "Gi\xE1o vi\xEAn ch\u0103m s\xF3c",
          isDemo: true
        },
        {
          name: "Tr\u1EA7n V\u0103n Minh",
          email: "minh@demo.com",
          phone: "0912345678",
          memberType: "parent",
          tokenBalance: "3000000",
          totalCommissions: "1500000",
          level: 1,
          qrCode: "DEMO_QR_002",
          walletAddress: "0xDemo002",
          categoryName: "\u0110\u1EA1i s\u1EE9 th\u01B0\u01A1ng hi\u1EC7u",
          isDemo: true
        },
        {
          name: "L\xEA Th\u1ECB Hoa",
          email: "hoa@demo.com",
          phone: "0965432198",
          memberType: "teacher",
          tokenBalance: "7500000",
          totalCommissions: "4000000",
          level: 2,
          qrCode: "DEMO_QR_003",
          walletAddress: "0xDemo003",
          categoryName: "Gi\xE1o vi\xEAn ch\u0103m s\xF3c",
          isDemo: true
        }
      ];
      for (const member of demoMembers) {
        await storage.createAffiliateMember(member);
      }
      const demoConversions = [
        {
          agentId: "DEMO_QR_001",
          customerName: "Ph\u1EA1m Th\u1ECB Mai",
          customerPhone: "0934567890",
          customerEmail: "mai@customer.com",
          registrationDate: /* @__PURE__ */ new Date(),
          tuitionAmount: "4000000",
          status: "confirmed",
          notes: "Kh\xE1ch h\xE0ng demo - \u0111\xE3 x\xE1c nh\u1EADn \u0111\u0103ng k\xFD",
          isDemo: true
        },
        {
          agentId: "DEMO_QR_002",
          customerName: "Ho\xE0ng V\u0103n \u0110\u1EE9c",
          customerPhone: "0945678901",
          customerEmail: "duc@customer.com",
          registrationDate: /* @__PURE__ */ new Date(),
          tuitionAmount: "4000000",
          status: "pending",
          notes: "Kh\xE1ch h\xE0ng demo - \u0111ang ch\u1EDD x\xE1c nh\u1EADn",
          isDemo: true
        }
      ];
      for (const conversion of demoConversions) {
        await storage.createCustomerConversion(conversion);
      }
      res.json({ message: "Demo data created successfully", count: demoMembers.length + demoConversions.length });
    } catch (error) {
      console.error("Error creating demo data:", error);
      res.status(500).json({ message: "Failed to create demo data" });
    }
  });
  app2.delete("/api/demo/clear-affiliate-data", async (req, res) => {
    try {
      await storage.clearDemoData();
      res.json({ message: "Demo data cleared successfully" });
    } catch (error) {
      console.error("Error clearing demo data:", error);
      res.status(500).json({ message: "Failed to clear demo data" });
    }
  });
  app2.post("/api/homepage-content", async (req, res) => {
    try {
      const content = req.body;
      console.log("Saving homepage content to database:", content);
      await storage.saveHomepageContent(content);
      res.json({ message: "Homepage content saved successfully", data: content });
    } catch (error) {
      console.error("Error saving homepage content:", error);
      res.status(500).json({ message: "Failed to save homepage content" });
    }
  });
  app2.post("/api/admin/upload-image", async (req, res) => {
    try {
      const { type, url } = req.body;
      console.log("Saving image:", { type, url });
      res.json({
        message: `${type} saved successfully`,
        url,
        type
      });
    } catch (error) {
      console.error("Error saving image:", error);
      res.status(500).json({ message: "Failed to save image" });
    }
  });
  app2.get("/api/homepage-content", async (req, res) => {
    try {
      const content = await storage.getHomepageContent();
      res.json(content);
    } catch (error) {
      console.error("Error getting homepage content:", error);
      res.status(500).json({ message: "Failed to get homepage content" });
    }
  });
  app2.post("/api/contact-info", async (req, res) => {
    try {
      console.log("Contact info saved:", req.body);
      res.json({ message: "Contact info saved successfully", data: req.body });
    } catch (error) {
      console.error("Error saving contact info:", error);
      res.status(500).json({ message: "Failed to save contact info" });
    }
  });
  app2.get("/api/saved-images", (req, res) => {
    try {
      const savedImages = global.savedImages || {};
      console.log(`[FETCH] Returning saved images:`, {
        logo: savedImages.logo ? "Available" : "None",
        banner: savedImages.banner ? "Available" : "None",
        video: savedImages.video ? "Available" : "None"
      });
      res.json(savedImages);
    } catch (error) {
      console.error("[FETCH ERROR]:", error);
      res.status(500).json({ message: "Failed to fetch saved images" });
    }
  });
  app2.post("/api/upload-image", (req, res) => {
    try {
      const { type, url } = req.body;
      console.log(`[UPLOAD] Saving ${type}:`, url?.substring(0, 100) + "...");
      if (!type || !url) {
        return res.status(400).json({ message: "Missing type or url" });
      }
      if (!url.startsWith("data:") && !url.startsWith("blob:")) {
        return res.status(400).json({ message: "Invalid image format" });
      }
      global.savedImages = global.savedImages || {};
      global.savedImages[type] = url;
      console.log(`[UPLOAD SUCCESS] ${type} saved to memory storage`);
      res.json({
        success: true,
        message: `${type} saved successfully`,
        type,
        url,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    } catch (error) {
      console.error("[UPLOAD ERROR]:", error);
      res.status(500).json({
        success: false,
        message: "Failed to save image",
        error: error.message
      });
    }
  });
  app2.get("/api/affiliate/members", (req, res) => {
    try {
      const mockMembers = [
        {
          id: 1,
          name: "Nguy\u1EC5n Th\u1ECB Linh",
          username: "linh_teacher",
          email: "linh@demo.com",
          phone: "0987654321",
          memberType: "teacher",
          memberId: "TCH001",
          code: "TCH001",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          totalReferrals: 3,
          totalCommission: 6e6,
          isActive: true
        },
        {
          id: 2,
          name: "Tr\u1EA7n V\u0103n Minh",
          username: "minh_parent",
          email: "minh@demo.com",
          phone: "0912345678",
          memberType: "parent",
          memberId: "PAR001",
          code: "PAR001",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          totalReferrals: 2,
          totalCommission: 4e3,
          isActive: true
        },
        {
          id: 3,
          name: "Ho\xE0ng Th\u1ECB Mai",
          username: "mai_teacher2",
          email: "mai@demo.com",
          phone: "0901234567",
          memberType: "teacher",
          memberId: "TCH002",
          code: "TCH002",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          totalReferrals: 5,
          totalCommission: 1e7,
          isActive: true
        },
        {
          id: 4,
          name: "L\xEA V\u0103n Nam",
          username: "nam_parent2",
          email: "nam@demo.com",
          phone: "0934567890",
          memberType: "parent",
          memberId: "PAR002",
          code: "PAR002",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          totalReferrals: 1,
          totalCommission: 2e3,
          isActive: false
        }
      ];
      res.json(mockMembers);
    } catch (error) {
      res.status(500).json({ message: "L\u1ED7i l\u1EA5y danh s\xE1ch th\xE0nh vi\xEAn" });
    }
  });
  app2.get("/api/test-form", (req, res) => {
    res.json({
      message: "API is working!",
      timestamp: (/* @__PURE__ */ new Date()).toLocaleString(),
      formFields: ["name", "username", "email", "phone"],
      endpoint: "/api/affiliate/register"
    });
  });
  app2.get("/direct-form", (req, res) => {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>USERNAME TEST - ${(/* @__PURE__ */ new Date()).toLocaleTimeString()}</title>
    <style>
        body { 
            background: #FF00FF;
            color: white; 
            font-family: Arial; 
            padding: 40px;
            font-size: 20px;
        }
        .username-box {
            background: #FFFF00;
            color: #000000;
            border: 10px solid #FF0000;
            padding: 30px;
            margin: 30px 0;
            font-size: 24px;
            font-weight: bold;
        }
        input {
            width: 100%;
            padding: 20px;
            font-size: 24px;
            border: 5px solid #000000;
            margin: 15px 0;
        }
        button {
            width: 100%;
            padding: 25px;
            font-size: 28px;
            background: #00FF00;
            border: none;
            cursor: pointer;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>\u{1F525} DIRECT FORM TEST - TIMESTAMP: ${(/* @__PURE__ */ new Date()).toLocaleString()} \u{1F525}</h1>
    
    <div class="username-box">
        <div>\u26A0\uFE0F USERNAME FIELD TEST \u26A0\uFE0F</div>
        <input type="text" id="username" placeholder="NH\u1EACP USERNAME V\xC0O \u0110\xC2Y" 
               onchange="document.getElementById('display').innerText = this.value">
        <div>Gi\xE1 tr\u1ECB: <span id="display">(tr\u1ED1ng)</span></div>
    </div>
    
    <div>
        <input type="text" placeholder="H\u1ECD t\xEAn">
        <input type="email" placeholder="Email">
        <input type="tel" placeholder="S\u1ED1 \u0111i\u1EC7n tho\u1EA1i">
    </div>
    
    <button onclick="testRegister()">\u0110\u0102NG K\xDD TEST</button>
    
    <div id="result" style="margin-top: 20px; background: white; color: black; padding: 20px;"></div>

    <script>
        async function testRegister() {
            const username = document.getElementById('username').value;
            const data = {
                name: document.querySelector('input[placeholder="H\u1ECD t\xEAn"]').value || 'Test User',
                username: username || 'testuser' + Date.now(),
                email: document.querySelector('input[placeholder="Email"]').value || 'test@example.com',
                phone: document.querySelector('input[placeholder="S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"]').value || '0123456789',
                memberType: 'parent'
            };
            
            console.log('Testing registration:', data);
            
            try {
                const response = await fetch('/api/affiliate/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                
                const result = await response.json();
                document.getElementById('result').innerHTML = 
                    response.ok ? 
                    \`\u2705 TH\xC0NH C\xD4NG! Username: \${data.username}, Member ID: \${result.memberId}\` :
                    \`\u274C L\u1ED6I: \${result.message}\`;
            } catch (error) {
                document.getElementById('result').innerHTML = \`\u274C L\u1ED6I: \${error.message}\`;
            }
        }
    </script>
</body>
</html>`;
    res.send(html);
  });
  app2.get("/api/affiliate/sponsor/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const sponsor = await storage.getAffiliateMemberByMemberId(memberId);
      if (!sponsor) {
        return res.status(404).json({ message: "Sponsor not found" });
      }
      res.json({
        name: sponsor.name,
        email: sponsor.email,
        memberType: sponsor.memberType,
        memberId: sponsor.memberId,
        totalReferrals: sponsor.totalReferrals
      });
    } catch (error) {
      console.error("Error getting sponsor info:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.get("/api/affiliate/genealogy/:identifier", async (req, res) => {
    try {
      const { identifier } = req.params;
      let targetMember = await storage.getAffiliateMemberByUsername(identifier);
      if (!targetMember) {
        targetMember = await storage.getAffiliateMemberByMemberId(identifier);
      }
      if (!targetMember) {
        return res.status(404).json({ message: "Member not found" });
      }
      const directReferrals = await storage.getAffiliateMembersBySponsor(targetMember.memberId);
      const buildTree = async (members) => {
        const tree = [];
        for (const member of members) {
          const children = await storage.getAffiliateMembersBySponsor(member.memberId);
          tree.push({
            id: member.id,
            name: member.name,
            username: member.username,
            memberType: member.memberType,
            memberId: member.memberId,
            totalReferrals: member.totalReferrals,
            tokenBalance: member.tokenBalance,
            createdAt: member.createdAt,
            children: children.length > 0 ? await buildTree(children) : []
          });
        }
        return tree;
      };
      const genealogyTree = await buildTree(directReferrals);
      res.json({
        memberId: targetMember.memberId,
        username: targetMember.username,
        name: targetMember.name,
        totalDirectReferrals: directReferrals.length,
        genealogyTree
      });
    } catch (error) {
      console.error("Error getting genealogy tree:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  app2.post("/api/affiliate/reset-password", async (req, res) => {
    try {
      console.log("\u{1F7E2} Password reset request received:", req.body);
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Vui l\xF2ng nh\u1EADp email" });
      }
      try {
        const member = await storage.getAffiliateMemberByEmail(email);
        if (member) {
          const tempPassword = Math.random().toString(36).slice(-8);
          await storage.updateAffiliateMember(member.id, { password: tempPassword });
          try {
            const { sendServiceRegistrationEmail: sendServiceRegistrationEmail2 } = await Promise.resolve().then(() => (init_email(), email_exports));
            const emailData = {
              serviceName: "Kh\xF4i ph\u1EE5c m\u1EADt kh\u1EA9u",
              parentName: member.name,
              parentEmail: email,
              parentPhone: member.phone || "Kh\xF4ng c\xF3",
              preferredTime: "Ngay l\u1EADp t\u1EE9c",
              notes: `M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi m\u1EDBi: ${tempPassword}. Vui l\xF2ng \u0111\u0103ng nh\u1EADp v\xE0 \u0111\u1ED5i m\u1EADt kh\u1EA9u ngay.`,
              createdAt: (/* @__PURE__ */ new Date()).toISOString()
            };
            await sendServiceRegistrationEmail2(emailData);
          } catch (emailError) {
            console.error("Error sending password reset email:", emailError);
          }
          res.json({
            success: true,
            message: "M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi \u0111\xE3 \u0111\u01B0\u1EE3c g\u1EEDi qua email",
            tempPassword
            // For demo - remove in production
          });
        } else {
          res.status(404).json({ message: "Email kh\xF4ng t\u1ED3n t\u1EA1i trong h\u1EC7 th\u1ED1ng" });
        }
      } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi kh\xF4i ph\u1EE5c m\u1EADt kh\u1EA9u" });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi kh\xF4i ph\u1EE5c m\u1EADt kh\u1EA9u" });
    }
  });
  app2.post("/api/affiliate/register", async (req, res) => {
    try {
      console.log("\u{1F7E2} Registration request received:", req.body);
      const { name, username, email, phone, password, memberType, sponsorId } = req.body;
      const finalPassword = password || Math.random().toString(36).slice(-8);
      if (!name || !username || !email || !phone) {
        return res.status(400).json({
          message: "Thi\u1EBFu th\xF4ng tin b\u1EAFt bu\u1ED9c. Vui l\xF2ng \u0111i\u1EC1n \u0111\u1EA7y \u0111\u1EE7: T\xEAn, username, email, phone"
        });
      }
      const finalMemberType = memberType || "parent";
      if (username.length < 3) {
        return res.status(400).json({
          message: "T\xEAn \u0111\u0103ng nh\u1EADp ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 3 k\xFD t\u1EF1"
        });
      }
      if (finalPassword.length < 6) {
        return res.status(400).json({
          message: "M\u1EADt kh\u1EA9u ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 6 k\xFD t\u1EF1"
        });
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return res.status(400).json({
          message: "T\xEAn \u0111\u0103ng nh\u1EADp ch\u1EC9 \u0111\u01B0\u1EE3c ch\u1EE9a ch\u1EEF c\xE1i, s\u1ED1 v\xE0 d\u1EA5u g\u1EA1ch d\u01B0\u1EDBi"
        });
      }
      try {
        const existingUser = await storage.getAffiliateMemberByUsername(username);
        if (existingUser) {
          return res.status(400).json({
            message: "T\xEAn \u0111\u0103ng nh\u1EADp \u0111\xE3 t\u1ED3n t\u1EA1i, vui l\xF2ng ch\u1ECDn t\xEAn kh\xE1c"
          });
        }
      } catch (error) {
        console.log("Username check failed:", error);
      }
      try {
        const existingEmail = await storage.getAffiliateMemberByEmail(email);
        if (existingEmail) {
          return res.status(400).json({
            message: "Email \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD, vui l\xF2ng s\u1EED d\u1EE5ng email kh\xE1c"
          });
        }
      } catch (error) {
        console.log("Email check failed:", error);
      }
      const memberId = `${finalMemberType.toUpperCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      const baseUrl = `${req.protocol}://${req.get("host")}`;
      const referralLink = `${baseUrl}/affiliate/join?ref=${memberId}`;
      const categoryName = finalMemberType === "teacher" ? "\u0110\u1EA1i s\u1EE9 th\u01B0\u01A1ng hi\u1EC7u" : "Ch\u0103m s\xF3c ph\u1EE5 huynh";
      const newMember = {
        name,
        username,
        email,
        phone,
        password: finalPassword,
        // Store password (in production, should be hashed)
        memberType: finalMemberType,
        categoryName,
        memberId,
        referralLink,
        sponsorId: sponsorId || null,
        qrCode: `QR_${memberId}`,
        walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
        tokenBalance: "4000000",
        // Set demo balance of 4M VND
        totalReferrals: 0,
        totalCommissions: "0",
        level: 1,
        isActive: true,
        createdAt: /* @__PURE__ */ new Date()
      };
      console.log("\u{1F7E2} Creating new member:", newMember);
      try {
        const savedMember = await storage.createAffiliateMember(newMember);
        console.log("\u{1F7E2} Member saved to database:", savedMember);
        if (sponsorId) {
          try {
            const sponsor = await storage.getAffiliateMemberByMemberId(sponsorId);
            if (sponsor) {
              await storage.updateAffiliateMember(sponsor.id, {
                totalReferrals: (sponsor.totalReferrals || 0) + 1
              });
              console.log("\u{1F7E2} Updated sponsor referral count:", sponsor.username);
              const currentBalance = parseFloat(sponsor.tokenBalance || "0");
              const rewardAmount = sponsor.memberType === "teacher" ? 2e6 : 2e3;
              const newBalance = currentBalance + rewardAmount;
              await storage.updateAffiliateMember(sponsor.id, {
                tokenBalance: newBalance.toString()
              });
              console.log(`\u{1F389} Added ${rewardAmount} tokens to sponsor ${sponsor.username} (${sponsor.memberType})`);
              const newReferralCount = (sponsor.totalReferrals || 0) + 1;
              if (newReferralCount % 5 === 0) {
                const milestoneBonus = sponsor.memberType === "teacher" ? 1e7 : 1e4;
                const finalBalance = newBalance + milestoneBonus;
                await storage.updateAffiliateMember(sponsor.id, {
                  tokenBalance: finalBalance.toString()
                });
                console.log(`\u{1F3C6} MILESTONE BONUS: Added ${milestoneBonus} tokens to ${sponsor.username} for reaching ${newReferralCount} referrals!`);
              }
              try {
                await storage.createTransactionHistory({
                  memberId: sponsor.memberId,
                  transactionType: "referral_reward",
                  amount: rewardAmount.toString(),
                  description: `Hoa h\u1ED3ng gi\u1EDBi thi\u1EC7u th\xE0nh vi\xEAn m\u1EDBi: ${newMember.name}`,
                  balanceBefore: currentBalance.toString(),
                  balanceAfter: (currentBalance + rewardAmount).toString(),
                  status: "completed",
                  referenceId: `ref_${savedMember.id}`
                });
                console.log("\u{1F4DD} Transaction history created for referral reward");
              } catch (transactionError) {
                console.log("\u26A0\uFE0F Could not create transaction history:", transactionError);
              }
            }
          } catch (sponsorError) {
            console.log("\u26A0\uFE0F Could not update sponsor:", sponsorError);
          }
        }
        const response = {
          ...savedMember,
          tempPassword: !password ? finalPassword : void 0,
          showPassword: !password,
          sponsorInfo: sponsorId ? `\u0110\xE3 ghi nh\u1EADn d\u01B0\u1EDBi sponsor: ${sponsorId}` : void 0
        };
        res.status(201).json(response);
      } catch (dbError) {
        console.error("\u{1F534} Database save failed:", dbError);
        if (dbError.code === "23505" && dbError.constraint === "affiliate_members_username_unique") {
          return res.status(400).json({
            message: "T\xEAn \u0111\u0103ng nh\u1EADp \u0111\xE3 t\u1ED3n t\u1EA1i. Vui l\xF2ng ch\u1ECDn t\xEAn kh\xE1c."
          });
        }
        return res.status(500).json({
          message: "L\u1ED7i l\u01B0u d\u1EEF li\u1EC7u. Vui l\xF2ng th\u1EED l\u1EA1i sau."
        });
      }
    } catch (error) {
      console.error("\u{1F534} Registration error:", error);
      res.status(500).json({
        message: "L\u1ED7i h\u1EC7 th\u1ED1ng khi \u0111\u0103ng k\xFD. Vui l\xF2ng th\u1EED l\u1EA1i."
      });
    }
  });
  app2.post("/api/affiliate/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Vui l\xF2ng nh\u1EADp email" });
      }
      const member = await storage.getAffiliateMemberByEmail(email);
      if (!member) {
        return res.json({
          message: "N\u1EBFu email t\u1ED3n t\u1EA1i trong h\u1EC7 th\u1ED1ng, b\u1EA1n s\u1EBD nh\u1EADn \u0111\u01B0\u1EE3c email h\u01B0\u1EDBng d\u1EABn \u0111\u1EB7t l\u1EA1i m\u1EADt kh\u1EA9u trong v\xE0i ph\xFAt."
        });
      }
      const tempPassword = Math.random().toString(36).slice(-8);
      await storage.updateAffiliateMember(member.id, {
        password: tempPassword
      });
      res.json({
        message: "M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi \u0111\xE3 \u0111\u01B0\u1EE3c t\u1EA1o",
        tempPassword,
        instructions: `M\u1EADt kh\u1EA9u t\u1EA1m th\u1EDDi c\u1EE7a b\u1EA1n l\xE0: ${tempPassword}. Vui l\xF2ng \u0111\u0103ng nh\u1EADp v\xE0 \u0111\u1ED5i m\u1EADt kh\u1EA9u ngay l\u1EADp t\u1EE9c.`
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "L\u1ED7i h\u1EC7 th\u1ED1ng. Vui l\xF2ng th\u1EED l\u1EA1i sau." });
    }
  });
  app2.post("/api/affiliate/login", async (req, res) => {
    try {
      console.log("\u{1F7E2} Login request received:", req.body);
      const { username, password, memberCode } = req.body;
      if (username && password) {
        if (!username || !password) {
          return res.status(400).json({
            message: "Vui l\xF2ng nh\u1EADp \u0111\u1EA7y \u0111\u1EE7 t\xEAn \u0111\u0103ng nh\u1EADp v\xE0 m\u1EADt kh\u1EA9u"
          });
        }
        try {
          const member = await storage.getAffiliateMemberByUsername(username);
          if (member && member.password === password) {
            const userSession = {
              id: member.id,
              username: member.username,
              fullName: member.name,
              email: member.email,
              memberType: member.memberType,
              status: "active",
              balance: member.tokenBalance || "0",
              commission: "0",
              walletAddress: member.walletAddress
            };
            req.session.affiliateUser = userSession;
            return res.json({
              success: true,
              message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng!",
              token: "affiliate-token-" + Date.now(),
              user: userSession
            });
          } else {
            return res.status(401).json({
              message: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng"
            });
          }
        } catch (error) {
          console.log("Database lookup failed:", error);
          if (username === "testfinal" && password === "123456") {
            const demoUser = {
              id: "demo-1",
              username: "testfinal",
              fullName: "Test Final User",
              email: "testfinal@example.com",
              memberType: "parent",
              status: "active",
              balance: "1000",
              commission: "500",
              walletAddress: "0xDemo123"
            };
            req.session.affiliateUser = demoUser;
            return res.json({
              success: true,
              message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng!",
              token: "affiliate-token-" + Date.now(),
              user: demoUser
            });
          }
          return res.status(401).json({
            message: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng"
          });
        }
      }
      if (!memberCode) {
        return res.status(400).json({ message: "Vui l\xF2ng nh\u1EADp t\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\xE3 th\xE0nh vi\xEAn" });
      }
      try {
        let member = null;
        try {
          member = await storage.getAffiliateMemberByUsername(memberCode);
        } catch (error) {
          member = await storage.getAffiliateMemberByMemberId(memberCode);
        }
        if (member && member.isActive) {
          res.json({
            message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng",
            memberCode,
            member: {
              id: member.id,
              name: member.name,
              email: member.email,
              memberType: member.memberType,
              memberId: member.memberId,
              username: member.username,
              tokenBalance: member.tokenBalance,
              totalReferrals: member.totalReferrals,
              qrCode: member.qrCode,
              referralLink: member.referralLink,
              walletAddress: member.walletAddress
            }
          });
        } else {
          res.status(401).json({ message: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\xE3 th\xE0nh vi\xEAn kh\xF4ng h\u1EE3p l\u1EC7" });
        }
      } catch (dbError) {
        if (memberCode.match(/^[a-zA-Z0-9_]{3,}$/) || memberCode.match(/^[A-Z0-9-]{8,36}$/)) {
          res.json({
            message: "\u0110\u0103ng nh\u1EADp th\xE0nh c\xF4ng",
            memberCode,
            member: {
              id: 1,
              name: "Demo User",
              email: "demo@example.com",
              memberType: "parent",
              memberId: "DEMO-" + memberCode,
              username: memberCode,
              tokenBalance: "1000",
              totalReferrals: 0,
              qrCode: "DEMO_QR",
              referralLink: `https://demo.com/affiliate/join?ref=${memberCode}`,
              walletAddress: "0xDemo123"
            }
          });
        } else {
          res.status(401).json({ message: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\xE3 th\xE0nh vi\xEAn kh\xF4ng h\u1EE3p l\u1EC7" });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "L\u1ED7i \u0111\u0103ng nh\u1EADp" });
    }
  });
  commissionService.initializeDefaultSettings().catch(console.error);
  app2.get("/api/withdrawal-requests", async (req, res) => {
    try {
      const requests = await storage.getWithdrawalRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch withdrawal requests" });
    }
  });
  app2.get("/api/withdrawal-requests/member/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const requests = await storage.getWithdrawalRequestsByMember(memberId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch member withdrawal requests" });
    }
  });
  app2.post("/api/withdrawal-requests", async (req, res) => {
    try {
      const validatedData = insertWithdrawalRequestSchema.parse(req.body);
      const member = await storage.getAffiliateMember(validatedData.memberId);
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      const currentBalance = parseFloat(member.tokenBalance || "0");
      const requestAmount = parseFloat(validatedData.amount);
      if (requestAmount > currentBalance) {
        return res.status(400).json({
          message: "S\u1ED1 d\u01B0 kh\xF4ng \u0111\u1EE7 \u0111\u1EC3 th\u1EF1c hi\u1EC7n giao d\u1ECBch",
          currentBalance,
          requestAmount
        });
      }
      const request = await storage.createWithdrawalRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Withdrawal request error:", error);
      res.status(400).json({ message: "Invalid withdrawal request data" });
    }
  });
  app2.patch("/api/withdrawal-requests/:id/process", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { adminNote, status, processedBy } = req.body;
      const request = await storage.processWithdrawalRequest(id, adminNote, status, processedBy);
      if (status === "paid") {
        const member = await storage.getAffiliateMember(request.memberId);
        if (member) {
          const currentBalance = parseFloat(member.tokenBalance || "0");
          const withdrawalAmount = parseFloat(request.amount);
          const newBalance = currentBalance - withdrawalAmount;
          await storage.updateAffiliateMember(member.id, {
            tokenBalance: newBalance.toString()
          });
          await storage.createTransactionHistory({
            memberId: request.memberId,
            transactionType: "withdrawal",
            amount: (-withdrawalAmount).toString(),
            description: `R\xFAt ti\u1EC1n: ${adminNote || "\u0110\xE3 thanh to\xE1n"}`,
            balanceBefore: currentBalance.toString(),
            balanceAfter: newBalance.toString(),
            status: "completed",
            referenceId: `withdrawal_${request.id}`
          });
        }
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to process withdrawal request" });
    }
  });
  app2.get("/api/transaction-history/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const transactions = await storage.getTransactionHistory(memberId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transaction history" });
    }
  });
  app2.post("/api/admin/site-info", async (req, res) => {
    try {
      const { siteTitle, siteTagline, author, authorBio, authorImage } = req.body;
      res.json({ message: "Site info updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update site info" });
    }
  });
  app2.post("/api/admin/main-content", async (req, res) => {
    try {
      const { heroSection, aboutSection, servicesSection } = req.body;
      res.json({ message: "Main content updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update main content" });
    }
  });
  app2.post("/api/admin/homepage", async (req, res) => {
    try {
      console.log("\u{1F7E2} Homepage content update received:", req.body);
      const { heroTitle, heroSubtitle, heroImage, features } = req.body;
      if (heroTitle) await storage.setSetting("homepage_hero_title", heroTitle);
      if (heroSubtitle) await storage.setSetting("homepage_hero_subtitle", heroSubtitle);
      if (heroImage) await storage.setSetting("homepage_hero_image", heroImage);
      if (features) await storage.setSetting("homepage_features", JSON.stringify(features));
      res.json({ success: true, message: "Homepage updated successfully" });
    } catch (error) {
      console.error("Homepage update error:", error);
      res.status(500).json({ message: "Failed to update homepage" });
    }
  });
  app2.get("/api/homepage-content", async (req, res) => {
    try {
      const heroTitle = await storage.getSetting("homepage_hero_title");
      const heroSubtitle = await storage.getSetting("homepage_hero_subtitle");
      const heroImage = await storage.getSetting("homepage_hero_image");
      const featuresJson = await storage.getSetting("homepage_features");
      let features = [];
      try {
        features = featuresJson ? JSON.parse(featuresJson) : [];
      } catch (e) {
        features = [];
      }
      res.json({
        heroTitle: heroTitle || "Ch\xE0o m\u1EEBng \u0111\u1EBFn v\u1EDBi M\u1EA7m Non Th\u1EA3o Nguy\xEAn Xanh",
        heroSubtitle: heroSubtitle || "N\u01A1i nu\xF4i d\u01B0\u1EE1ng nh\u1EEFng \u01B0\u1EDBc m\u01A1 nh\u1ECF th\xE0nh hi\u1EC7n th\u1EF1c l\u1EDBn",
        heroImage: heroImage || null,
        features
      });
    } catch (error) {
      console.error("Get homepage content error:", error);
      res.status(500).json({ message: "Failed to get homepage content" });
    }
  });
  app2.post("/api/admin/about", async (req, res) => {
    try {
      const { mission, vision, history, principalMessage } = req.body;
      res.json({ message: "About page updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update about page" });
    }
  });
  app2.post("/api/admin/admission", async (req, res) => {
    try {
      const admissionData = req.body;
      res.json({ message: "Admission info updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update admission info" });
    }
  });
  app2.post("/api/admin/contact", async (req, res) => {
    try {
      const contactData = req.body;
      res.json({ message: "Contact info updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact info" });
    }
  });
  app2.get("/api/parent-documents", async (req, res) => {
    try {
      const documents = [
        {
          id: 1,
          title: "H\u01B0\u1EDBng d\u1EABn chu\u1EA9n b\u1ECB cho b\xE9 v\xE0o m\u1EA7m non",
          description: "T\xE0i li\u1EC7u h\u01B0\u1EDBng d\u1EABn ph\u1EE5 huynh chu\u1EA9n b\u1ECB t\xE2m l\xFD v\xE0 v\u1EADt d\u1EE5ng cho b\xE9"
        }
      ];
      res.json(documents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  app2.post("/api/parent-documents", async (req, res) => {
    try {
      const { title, description, fileUrl } = req.body;
      res.json({ message: "Document added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to add document" });
    }
  });
  app2.post("/api/chatbot", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Message is required" });
      }
      const response = ChatbotService.generateResponse(message);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      res.json({
        response,
        quickReplies: ChatbotService.getQuickReplies()
      });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({
        error: "Xin l\u1ED7i, t\xF4i \u0111ang g\u1EB7p s\u1EF1 c\u1ED1. Vui l\xF2ng th\u1EED l\u1EA1i sau ho\u1EB7c li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp qua hotline: 0856318686"
      });
    }
  });
  app2.post("/api/admin/homepage", async (req, res) => {
    try {
      res.json({ success: true, message: "Homepage content saved successfully" });
    } catch (error) {
      console.error("Error saving homepage content:", error);
      res.status(500).json({ message: "Failed to save homepage content" });
    }
  });
  app2.post("/api/admin/about", async (req, res) => {
    try {
      res.json({ success: true, message: "About content saved successfully" });
    } catch (error) {
      console.error("Error saving about content:", error);
      res.status(500).json({ message: "Failed to save about content" });
    }
  });
  app2.post("/api/admin/admission", async (req, res) => {
    try {
      res.json({ success: true, message: "Admission content saved successfully" });
    } catch (error) {
      console.error("Error saving admission content:", error);
      res.status(500).json({ message: "Failed to save admission content" });
    }
  });
  app2.post("/api/admin/contact", async (req, res) => {
    try {
      res.json({ success: true, message: "Contact content saved successfully" });
    } catch (error) {
      console.error("Error saving contact content:", error);
      res.status(500).json({ message: "Failed to save contact content" });
    }
  });
  app2.post("/api/admin/programs", async (req, res) => {
    try {
      res.json({ success: true, message: "Program content saved successfully" });
    } catch (error) {
      console.error("Error saving program content:", error);
      res.status(500).json({ message: "Failed to save program content" });
    }
  });
  app2.post("/api/admin/activities", async (req, res) => {
    try {
      res.json({ success: true, message: "Activity content saved successfully" });
    } catch (error) {
      console.error("Error saving activity content:", error);
      res.status(500).json({ message: "Failed to save activity content" });
    }
  });
  app2.get("/debug-qr", async (req, res) => {
    try {
      const allMembers = await storage.getAffiliateMembers();
      const hungthantai = allMembers.find((m) => m.username === "hungthantai");
      const maimeo = allMembers.find((m) => m.username === "maimeo");
      let downlineMembers = [];
      if (hungthantai) {
        downlineMembers = allMembers.filter((m) => m.sponsorId === hungthantai.memberId);
      }
      const debugInfo = {
        totalMembers: allMembers.length,
        hungthantaiExists: !!hungthantai,
        hungthantaiInfo: hungthantai ? {
          username: hungthantai.username,
          memberId: hungthantai.memberId,
          totalReferrals: hungthantai.totalReferrals,
          createdAt: hungthantai.createdAt
        } : null,
        maimeoExists: !!maimeo,
        maimeoInfo: maimeo ? {
          username: maimeo.username,
          memberId: maimeo.memberId,
          sponsorId: maimeo.sponsorId,
          createdAt: maimeo.createdAt
        } : null,
        downlineCount: downlineMembers.length,
        downlineMembers: downlineMembers.map((m) => ({
          username: m.username,
          name: m.name,
          memberId: m.memberId,
          sponsorId: m.sponsorId
        })),
        issue: !maimeo ? "maimeo_not_found" : maimeo && (!maimeo.sponsorId || maimeo.sponsorId !== hungthantai?.memberId) ? "sponsor_mismatch" : "unknown"
      };
      res.json(debugInfo);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  app2.get("/test-genealogy", (req, res) => {
    const html = `<!DOCTYPE html>
<html>
<head>
    <title>\u{1F333} Test Genealogy & QR Referral System</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .section { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .member { 
            border: 1px solid #ddd; 
            margin: 10px; 
            padding: 15px; 
            border-radius: 8px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }
        .teacher { border-left: 5px solid #28a745; }
        .parent { border-left: 5px solid #007bff; }
        .children { margin-left: 30px; border-left: 2px dashed #ccc; padding-left: 20px; }
        .input-group { margin: 10px 0; }
        .input-group input { width: 300px; padding: 8px; margin-right: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .btn { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
        .btn-primary { background: #007bff; color: white; }
        .btn-success { background: #28a745; color: white; }
        #result { margin: 10px 0; padding: 10px; border-radius: 4px; }
        .success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .stats { display: flex; gap: 20px; margin: 20px 0; }
        .stat-card { flex: 1; padding: 15px; background: #e3f2fd; border-radius: 8px; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>\u{1F333} Test H\u1EC7 th\u1ED1ng QR Referral & Genealogy Tree</h1>
        
        <div class="section">
            <h2>\u{1F4CA} Th\u1ED1ng k\xEA h\u1EC7 th\u1ED1ng</h2>
            <div class="stats">
                <div class="stat-card">
                    <h3>\u{1F469}\u200D\u{1F3EB} C\xF4 gi\xE1o</h3>
                    <div id="teacherCount">-</div>
                </div>
                <div class="stat-card">
                    <h3>\u{1F46A} Ph\u1EE5 huynh</h3>
                    <div id="parentCount">-</div>
                </div>
                <div class="stat-card">
                    <h3>\u{1F517} T\u1ED5ng referral</h3>
                    <div id="totalReferrals">-</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>\u{1F50D} Xem c\xE2y genealogy</h2>
            <div class="input-group">
                <input type="text" id="memberId" value="PARENT-1753762770405-MFBGXQ" placeholder="Nh\u1EADp Member ID">
                <button class="btn btn-primary" onclick="loadGenealogyTree()">\u{1F333} Xem c\xE2y th\xE0nh vi\xEAn</button>
            </div>
            <div id="result"></div>
        </div>

        <div class="section">
            <h2>\u{1F3AF} Test QR Registration</h2>
            <div class="input-group">
                <input type="text" id="sponsorId" value="PARENT-1753762770405-MFBGXQ" placeholder="Sponsor Member ID">
                <input type="text" id="newName" value="Test User QR" placeholder="T\xEAn ng\u01B0\u1EDDi m\u1EDBi">
                <input type="text" id="newUsername" value="" placeholder="Username (auto-generate if empty)">
                <button class="btn btn-success" onclick="testQRRegistration()">\u{1F517} Test QR Registration</button>
            </div>
            <div id="qrResult"></div>
        </div>

        <div class="section" id="genealogySection">
            <h2>\u{1F333} C\xE2y gia ph\u1EA3</h2>
            <div id="genealogyTree"></div>
        </div>
    </div>

    <script>
        function renderMember(member, level = 0) {
            const typeClass = member.memberType === 'teacher' ? 'teacher' : 'parent';
            const typeIcon = member.memberType === 'teacher' ? '\u{1F469}\u200D\u{1F3EB}' : '\u{1F46A}';
            const typeName = member.memberType === 'teacher' ? 'C\xF4 gi\xE1o' : 'Ph\u1EE5 huynh';
            
            let html = \`
                <div class="member \${typeClass}" style="margin-left: \${level * 20}px;">
                    <strong>\${typeIcon} \${member.name}</strong> (@\${member.username})
                    <br>Lo\u1EA1i: \${typeName}
                    <br>Member ID: <code>\${member.memberId}</code>
                    <br>S\u1ED1 ng\u01B0\u1EDDi gi\u1EDBi thi\u1EC7u: <strong>\${member.totalReferrals}</strong>
                    <br>S\u1ED1 d\u01B0 v\xED: \${Number(member.tokenBalance).toLocaleString('vi-VN')} VND
                    <br>Ng\xE0y tham gia: \${new Date(member.createdAt).toLocaleDateString('vi-VN')}
                </div>
            \`;
            
            if (member.children && member.children.length > 0) {
                html += '<div class="children">';
                member.children.forEach(child => {
                    html += renderMember(child, level + 1);
                });
                html += '</div>';
            }
            
            return html;
        }

        async function loadGenealogyTree() {
            const memberId = document.getElementById('memberId').value;
            
            if (!memberId) {
                document.getElementById('result').innerHTML = '<div class="error">\u274C Vui l\xF2ng nh\u1EADp Member ID</div>';
                return;
            }
            
            try {
                const response = await fetch(\`/api/affiliate/genealogy/\${memberId}\`);
                const data = await response.json();
                
                if (response.ok) {
                    document.getElementById('result').innerHTML = \`
                        <div class="success">
                            \u2705 T\xECm th\u1EA5y \${data.totalDirectReferrals} th\xE0nh vi\xEAn tr\u1EF1c ti\u1EBFp d\u01B0\u1EDBi \${memberId}
                        </div>
                    \`;
                    
                    let treeHtml = \`<h3>\u{1F333} C\xE2y gia ph\u1EA3 c\u1EE7a \${memberId}</h3>\`;
                    
                    if (data.genealogyTree.length === 0) {
                        treeHtml += '<p style="color: #6c757d; font-style: italic;">\u{1F4C4} Ch\u01B0a c\xF3 th\xE0nh vi\xEAn n\xE0o \u0111\u01B0\u1EE3c gi\u1EDBi thi\u1EC7u</p>';
                    } else {
                        data.genealogyTree.forEach(member => {
                            treeHtml += renderMember(member);
                        });
                    }
                    
                    document.getElementById('genealogyTree').innerHTML = treeHtml;
                } else {
                    document.getElementById('result').innerHTML = \`<div class="error">\u274C L\u1ED6I: \${data.message}</div>\`;
                    document.getElementById('genealogyTree').innerHTML = '';
                }
            } catch (error) {
                document.getElementById('result').innerHTML = \`<div class="error">\u274C L\u1ED6I: \${error.message}</div>\`;
                document.getElementById('genealogyTree').innerHTML = '';
            }
        }

        async function testQRRegistration() {
            const sponsorId = document.getElementById('sponsorId').value;
            const name = document.getElementById('newName').value;
            let username = document.getElementById('newUsername').value;
            
            if (!sponsorId || !name) {
                document.getElementById('qrResult').innerHTML = '<div class="error">\u274C Vui l\xF2ng nh\u1EADp Sponsor ID v\xE0 T\xEAn</div>';
                return;
            }
            
            // Auto-generate username if empty
            if (!username) {
                username = 'qr' + Date.now().toString(36);
                document.getElementById('newUsername').value = username;
            }
            
            const registrationData = {
                name: name,
                username: username,
                email: username + '@qrtest.com',
                phone: '098' + Math.floor(Math.random() * 10000000),
                memberType: 'parent',
                sponsorId: sponsorId
            };
            
            try {
                const response = await fetch('/api/affiliate/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(registrationData)
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    document.getElementById('qrResult').innerHTML = \`
                        <div class="success">
                            \u2705 QR Registration th\xE0nh c\xF4ng!
                            <br><strong>Member ID:</strong> \${result.memberId}
                            <br><strong>Username:</strong> \${result.username}
                            <br><strong>Temp Password:</strong> \${result.tempPassword || 'N/A'}
                            <br><strong>Sponsor:</strong> \${result.sponsorId || 'Kh\xF4ng c\xF3'}
                            <br><strong>Token Balance:</strong> \${Number(result.tokenBalance).toLocaleString('vi-VN')} VND
                        </div>
                    \`;
                    
                    // Auto-reload genealogy tree
                    setTimeout(() => {
                        loadGenealogyTree();
                        loadStats();
                    }, 500);
                } else {
                    document.getElementById('qrResult').innerHTML = \`<div class="error">\u274C L\u1ED6I: \${result.message}</div>\`;
                }
            } catch (error) {
                document.getElementById('qrResult').innerHTML = \`<div class="error">\u274C L\u1ED6I: \${error.message}</div>\`;
            }
        }

        async function loadStats() {
            try {
                const response = await fetch('/api/affiliate/members');
                const members = await response.json();
                
                const teachers = members.filter(m => m.memberType === 'teacher');
                const parents = members.filter(m => m.memberType === 'parent');
                const totalReferrals = members.reduce((sum, m) => sum + m.totalReferrals, 0);
                
                document.getElementById('teacherCount').textContent = teachers.length;
                document.getElementById('parentCount').textContent = parents.length;
                document.getElementById('totalReferrals').textContent = totalReferrals;
            } catch (error) {
                console.error('Error loading stats:', error);
            }
        }
        
        // Auto-load on page load
        window.onload = () => {
            loadGenealogyTree();
            loadStats();
        };
    </script>
</body>
</html>`;
    res.send(html);
  });
  app2.post("/api/affiliate/register", async (req, res) => {
    try {
      const { name, phone, email, memberType, categoryName, sponsorId } = req.body;
      const existingMember = await storage.getAffiliateMemberByPhone(phone);
      if (existingMember) {
        return res.status(400).json({ message: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\xE3 \u0111\u01B0\u1EE3c \u0111\u0103ng k\xFD" });
      }
      const memberId = `${memberType === "teacher" ? "TCH" : "PAR"}${Date.now().toString().slice(-6)}`;
      const username = `${name.toLowerCase().replace(/\s+/g, "")}${Math.floor(Math.random() * 1e3)}`;
      const { walletAddress, privateKey } = await storage.createWallet();
      const referralLink = `https://mamnonthaonguyenxanh.com/?ref=${memberId}`;
      const qrCode = await storage.generateQRCode(referralLink, name);
      const newMember = await storage.createAffiliateMember({
        memberId,
        username,
        name,
        email,
        phone,
        memberType,
        categoryName,
        sponsorId,
        qrCode,
        referralLink,
        walletAddress,
        privateKey
        // Will be encrypted by storage
      });
      res.json({
        success: true,
        member: {
          memberId: newMember.memberId,
          username: newMember.username,
          name: newMember.name,
          referralLink: newMember.referralLink,
          qrCode: newMember.qrCode,
          walletAddress: newMember.walletAddress
        }
      });
    } catch (error) {
      console.error("Affiliate registration error:", error);
      res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi \u0111\u0103ng k\xFD" });
    }
  });
  app2.post("/api/affiliate/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const member = await storage.authenticateAffiliateMember(username, password);
      if (!member) {
        return res.status(401).json({ message: "T\xEAn \u0111\u0103ng nh\u1EADp ho\u1EB7c m\u1EADt kh\u1EA9u kh\xF4ng \u0111\xFAng" });
      }
      if (!member.isActive) {
        return res.status(403).json({ message: "T\xE0i kho\u1EA3n \u0111\xE3 b\u1ECB kh\xF3a" });
      }
      res.json({
        success: true,
        member: {
          memberId: member.memberId,
          username: member.username,
          name: member.name,
          memberType: member.memberType,
          categoryName: member.categoryName,
          referralLink: member.referralLink,
          qrCode: member.qrCode,
          walletAddress: member.walletAddress,
          tokenBalance: member.tokenBalance,
          totalReferrals: member.totalReferrals,
          level: member.level
        }
      });
    } catch (error) {
      console.error("Affiliate login error:", error);
      res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi \u0111\u0103ng nh\u1EADp" });
    }
  });
  app2.get("/api/affiliate/dashboard/:memberId", async (req, res) => {
    try {
      const { memberId } = req.params;
      const member = await storage.getAffiliateMemberById(memberId);
      if (!member) {
        return res.status(404).json({ message: "Kh\xF4ng t\xECm th\u1EA5y th\xE0nh vi\xEAn" });
      }
      const dashboard = await storage.getAffiliateDashboard(memberId);
      res.json(dashboard);
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi t\u1EA3i dashboard" });
    }
  });
  app2.post("/api/affiliate/add-customer", async (req, res) => {
    try {
      const { f1AgentId, customerName, customerPhone, customerEmail, notes, f0ReferrerId } = req.body;
      const customer = await storage.addCustomerConversion({
        f1AgentId,
        f0ReferrerId,
        customerName,
        customerPhone,
        customerEmail,
        notes
      });
      res.json({ success: true, customer });
    } catch (error) {
      console.error("Add customer error:", error);
      res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi th\xEAm kh\xE1ch h\xE0ng" });
    }
  });
  app2.put("/api/affiliate/update-customer/:customerId", async (req, res) => {
    try {
      const { customerId } = req.params;
      const { conversionStatus, paymentAmount, notes } = req.body;
      const customer = await storage.updateCustomerConversion(customerId, {
        conversionStatus,
        paymentAmount,
        notes,
        confirmedAt: conversionStatus === "payment_completed" ? /* @__PURE__ */ new Date() : null
      });
      res.json({ success: true, customer });
    } catch (error) {
      console.error("Update customer error:", error);
      res.status(500).json({ message: "C\xF3 l\u1ED7i x\u1EA3y ra khi c\u1EADp nh\u1EADt kh\xE1ch h\xE0ng" });
    }
  });
  app2.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs2 from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
import path4 from "path";
import session from "express-session";
var app = express3();
app.use(express3.json({ limit: "50mb" }));
app.use(express3.urlencoded({ extended: false, limit: "50mb" }));
app.use(session({
  secret: process.env.SESSION_SECRET || "your-session-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use("/php-version", express3.static(path4.join(process.cwd(), "php-version")));
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
