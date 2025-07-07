import { 
  users, articles, testimonials, programs, activities, admissionForms, contactForms,
  type User, type InsertUser, type Article, type InsertArticle, 
  type Testimonial, type InsertTestimonial, type Program, type InsertProgram,
  type Activity, type InsertActivity, type AdmissionForm, type InsertAdmissionForm,
  type ContactForm, type InsertContactForm
} from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private articles: Map<number, Article>;
  private testimonials: Map<number, Testimonial>;
  private programs: Map<number, Program>;
  private activities: Map<number, Activity>;
  private admissionForms: Map<number, AdmissionForm>;
  private contactForms: Map<number, ContactForm>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.articles = new Map();
    this.testimonials = new Map();
    this.programs = new Map();
    this.activities = new Map();
    this.admissionForms = new Map();
    this.contactForms = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Seed articles
    const sampleArticles: Article[] = [
      {
        id: 1,
        title: "Lễ hội Trung thu 2024 - Những khoảnh khắc đáng nhớ",
        excerpt: "Lễ hội Trung thu năm nay đã diễn ra thành công với nhiều hoạt động thú vị dành cho các em nhỏ.",
        content: "Lễ hội Trung thu 2024 tại trường mầm non Thảo Nguyên Xanh đã diễn ra thành công tốt đẹp với sự tham gia của hơn 200 em học sinh cùng phụ huynh. Chương trình bao gồm nhiều hoạt động thú vị như múa lân, thi diễn thuyết, và làm bánh trung thu cùng các bạn nhỏ.",
        imageUrl: "https://images.unsplash.com/photo-1497486751825-1233686d5d80",
        category: "events",
        publishedAt: new Date("2024-11-15"),
        isPublished: true
      },
      {
        id: 2,
        title: "Hội nghị phụ huynh: Cùng đồng hành với con em",
        excerpt: "Buổi hội nghị với sự tham gia của 150 phụ huynh để trao đổi về phương pháp giáo dục hiện đại.",
        content: "Hội nghị phụ huynh đã thu hút sự quan tâm của đông đảo phụ huynh với nhiều chủ đề hấp dẫn về giáo dục trẻ em mầm non.",
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
        category: "education",
        publishedAt: new Date("2024-11-10"),
        isPublished: true
      },
      {
        id: 3,
        title: "Triển khai chương trình STEAM: Khám phá khoa học",
        excerpt: "Chương trình STEAM đã được triển khai thành công, giúp trẻ phát triển tư duy khoa học từ sớm.",
        content: "Chương trình STEAM tại trường đã mang lại hiệu quả tích cực trong việc phát triển tư duy logic và sáng tạo cho trẻ em.",
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
        category: "education",
        publishedAt: new Date("2024-11-05"),
        isPublished: true
      }
    ];

    sampleArticles.forEach(article => {
      this.articles.set(article.id, article);
    });

    // Seed testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: 1,
        name: "Chị Nguyễn Hà",
        role: "Phụ huynh lớp Mẫu giáo",
        content: "Con tôi rất thích đến trường. Cô giáo tận tâm, chương trình học bổ ích. Bé đã tiến bộ rất nhiều về mặt giao tiếp và kỹ năng sống.",
        avatar: "NH",
        rating: 5,
        isPublished: true
      },
      {
        id: 2,
        name: "Anh Lê Minh",
        role: "Phụ huynh lớp Lớn",
        content: "Môi trường học tập rất tốt, cơ sở vật chất hiện đại. Đội ngũ giáo viên chuyên nghiệp, luôn quan tâm đến sự phát triển của từng em.",
        avatar: "LM",
        rating: 5,
        isPublished: true
      },
      {
        id: 3,
        name: "Chị Trần Hương",
        role: "Phụ huynh lớp Nhà trẻ",
        content: "Tôi rất an tâm khi gửi con ở đây. Các cô luôn chăm sóc con chu đáo, thực đơn đa dạng, bổ dưỡng. Con tôi rất vui vẻ mỗi ngày đến trường.",
        avatar: "TH",
        rating: 5,
        isPublished: true
      }
    ];

    sampleTestimonials.forEach(testimonial => {
      this.testimonials.set(testimonial.id, testimonial);
    });

    // Seed programs
    const samplePrograms: Program[] = [
      {
        id: 1,
        name: "Nhà trẻ (6-24 tháng)",
        description: "Chăm sóc và phát triển các kỹ năng cơ bản: ngôn ngữ, vận động, cảm xúc xã hội",
        ageRange: "6-24 tháng",
        features: ["Phát triển vận động tinh và thô", "Kích thích các giác quan", "Xây dựng thói quen sinh hoạt"],
        tuition: 2500000,
        capacity: 20,
        icon: "fas fa-baby",
        isActive: true
      },
      {
        id: 2,
        name: "Mẫu giáo (2-4 tuổi)",
        description: "Phát triển tư duy, sáng tạo và kỹ năng tự lập thông qua các hoạt động vui chơi",
        ageRange: "2-4 tuổi",
        features: ["Học tập qua trò chơi", "Phát triển ngôn ngữ", "Kỹ năng xã hội cơ bản"],
        tuition: 3000000,
        capacity: 25,
        icon: "fas fa-child",
        isActive: true
      },
      {
        id: 3,
        name: "Lớp lớn (4-6 tuổi)",
        description: "Chuẩn bị cho bậc tiểu học với nền tảng kiến thức và kỹ năng học tập",
        ageRange: "4-6 tuổi",
        features: ["Chuẩn bị cho cấp 1", "Toán học cơ bản", "Phát triển tư duy logic"],
        tuition: 3500000,
        capacity: 30,
        icon: "fas fa-graduation-cap",
        isActive: true
      }
    ];

    samplePrograms.forEach(program => {
      this.programs.set(program.id, program);
    });

    // Seed activities
    const sampleActivities: Activity[] = [
      {
        id: 1,
        name: "Hoạt động ngoài trời",
        description: "Dã ngoại, picnic, khám phá thiên nhiên",
        imageUrl: "https://images.unsplash.com/photo-1560785496-3c9d27877182",
        frequency: "Hàng tuần",
        category: "outdoor",
        isActive: true
      },
      {
        id: 2,
        name: "Hoạt động nghệ thuật",
        description: "Vẽ, làm thủ công, âm nhạc, múa",
        imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
        frequency: "Hàng ngày",
        category: "art",
        isActive: true
      },
      {
        id: 3,
        name: "Lễ hội & Sự kiện",
        description: "Trung thu, Tết, Ngày hội, Lễ khai giảng",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96",
        frequency: "Hàng tháng",
        category: "festival",
        isActive: true
      }
    ];

    sampleActivities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });

    this.currentId = 10;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Article methods
  async getArticles(): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(article => article.isPublished);
  }

  async getArticle(id: number): Promise<Article | undefined> {
    return this.articles.get(id);
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    return Array.from(this.articles.values()).filter(
      article => article.category === category && article.isPublished
    );
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const id = this.currentId++;
    const article: Article = { 
      ...insertArticle, 
      id, 
      publishedAt: new Date(),
      isPublished: true,
      imageUrl: insertArticle.imageUrl || null
    };
    this.articles.set(id, article);
    return article;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => testimonial.isPublished);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.currentId++;
    const testimonial: Testimonial = { 
      ...insertTestimonial, 
      id,
      isPublished: insertTestimonial.isPublished ?? true,
      avatar: insertTestimonial.avatar || null,
      rating: insertTestimonial.rating ?? 5
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Program methods
  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values()).filter(program => program.isActive);
  }

  async getProgram(id: number): Promise<Program | undefined> {
    return this.programs.get(id);
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = this.currentId++;
    const program: Program = { 
      ...insertProgram, 
      id,
      isActive: insertProgram.isActive ?? true
    };
    this.programs.set(id, program);
    return program;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(activity => activity.isActive);
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    return this.activities.get(id);
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.currentId++;
    const activity: Activity = { 
      ...insertActivity, 
      id,
      imageUrl: insertActivity.imageUrl || null,
      isActive: insertActivity.isActive ?? true
    };
    this.activities.set(id, activity);
    return activity;
  }

  // Admission form methods
  async getAdmissionForms(): Promise<AdmissionForm[]> {
    return Array.from(this.admissionForms.values());
  }

  async createAdmissionForm(insertForm: InsertAdmissionForm): Promise<AdmissionForm> {
    const id = this.currentId++;
    const form: AdmissionForm = { 
      ...insertForm, 
      id, 
      submittedAt: new Date(),
      status: "pending",
      notes: insertForm.notes || null
    };
    this.admissionForms.set(id, form);
    return form;
  }

  // Contact form methods
  async getContactForms(): Promise<ContactForm[]> {
    return Array.from(this.contactForms.values());
  }

  async createContactForm(insertForm: InsertContactForm): Promise<ContactForm> {
    const id = this.currentId++;
    const form: ContactForm = { 
      ...insertForm, 
      id, 
      submittedAt: new Date(),
      status: "pending"
    };
    this.contactForms.set(id, form);
    return form;
  }
}

export const storage = new MemStorage();
