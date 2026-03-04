import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type ServiceId = bigint;
export interface SeoSettings {
    metaDescription: string;
    ogImage: string;
    metaTitle: string;
}
export type Time = bigint;
export interface Contact {
    id: Id;
    name: string;
    createdAt: Time;
    email: string;
    message: string;
}
export type SkillId = bigint;
export interface SocialLink {
    id: Id;
    url: string;
    sortOrder: bigint;
    platform: string;
    isActive: boolean;
}
export interface Service {
    id: Id;
    title: string;
    sortOrder: bigint;
    icon: string;
    description: string;
}
export interface BlogPost {
    id: Id;
    title: string;
    content: string;
    isPublished: boolean;
    slug: string;
    tags: Array<string>;
    publishedAt: bigint;
    coverImage: string;
    excerpt: string;
}
export type ExperienceId = bigint;
export interface Category__2 {
    id: Id;
    sortOrder: bigint;
    name: string;
}
export type BlogPostId = bigint;
export interface Skill {
    id: Id;
    sortOrder: bigint;
    icon: string;
    name: string;
    level: bigint;
    category: Category;
}
export interface Experience {
    id: Id;
    title: string;
    duration: string;
    sortOrder: bigint;
    description: string;
    company: string;
}
export type Id = bigint;
export type ProjectId = bigint;
export type SocialLinkId = bigint;
export type ContactId = bigint;
export type CategoryId = bigint;
export interface Project {
    id: Id;
    title: string;
    sortOrder: bigint;
    tags: Array<string>;
    description: string;
    isActive: boolean;
    imageUrl: string;
    repoUrl: string;
    category: Category__1;
    liveUrl: string;
}
export type TestimonialId = bigint;
export interface UserProfile {
    name: string;
}
export interface Testimonial {
    id: Id;
    content: string;
    sortOrder: bigint;
    name: string;
    role: string;
    company: string;
    avatarUrl: string;
    rating: bigint;
}
export enum Category {
    security = "security",
    secondary = "secondary",
    primary = "primary",
    additional = "additional"
}
export enum Category__1 {
    web = "web",
    mobile = "mobile",
    backend = "backend"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBlogPost(blogPost: BlogPost): Promise<BlogPostId>;
    createCategory(category: Category__2): Promise<CategoryId>;
    createContact(contact: Contact): Promise<ContactId>;
    createExperience(experience: Experience): Promise<ExperienceId>;
    createProject(project: Project): Promise<ProjectId>;
    createService(service: Service): Promise<ServiceId>;
    createSkill(skill: Skill): Promise<SkillId>;
    createSocialLink(socialLink: SocialLink): Promise<SocialLinkId>;
    createTestimonial(testimonial: Testimonial): Promise<TestimonialId>;
    deleteBlogPost(id: BlogPostId): Promise<void>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteContact(id: ContactId): Promise<void>;
    deleteExperience(id: ExperienceId): Promise<void>;
    deleteProject(id: ProjectId): Promise<void>;
    deleteService(id: ServiceId): Promise<void>;
    deleteSkill(id: SkillId): Promise<void>;
    deleteSocialLink(id: SocialLinkId): Promise<void>;
    deleteTestimonial(id: TestimonialId): Promise<void>;
    getActiveProjects(): Promise<Array<Project>>;
    getActiveSocialLinks(): Promise<Array<SocialLink>>;
    getAllBlogPostsAdmin(): Promise<Array<BlogPost>>;
    getAllCategories(): Promise<Array<Category__2>>;
    getAllContacts(): Promise<Array<Contact>>;
    getAllExperiences(): Promise<Array<Experience>>;
    getAllProjectsAdmin(): Promise<Array<Project>>;
    getAllServices(): Promise<Array<Service>>;
    getAllSkills(): Promise<Array<Skill>>;
    getAllTestimonials(): Promise<Array<Testimonial>>;
    getBlogPost(id: BlogPostId): Promise<BlogPost>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategory(id: CategoryId): Promise<Category__2>;
    getContact(id: ContactId): Promise<Contact>;
    getDashboardStats(): Promise<{
        leadsCount: bigint;
        servicesCount: bigint;
        skillsCount: bigint;
        projectsCount: bigint;
        testimonialsCount: bigint;
        blogsCount: bigint;
    }>;
    getExperience(id: ExperienceId): Promise<Experience>;
    getProject(id: ProjectId): Promise<Project>;
    getPublishedBlogPosts(): Promise<Array<BlogPost>>;
    getSeoSettings(): Promise<SeoSettings>;
    getService(id: ServiceId): Promise<Service>;
    getSkill(id: SkillId): Promise<Skill>;
    getSocialLink(id: SocialLinkId): Promise<SocialLink>;
    getTestimonial(id: TestimonialId): Promise<Testimonial>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBlogPost(id: BlogPostId, blogPost: BlogPost): Promise<void>;
    updateCategory(id: CategoryId, category: Category__2): Promise<void>;
    updateExperience(id: ExperienceId, experience: Experience): Promise<void>;
    updateProject(id: ProjectId, project: Project): Promise<void>;
    updateSeoSettings(newSettings: SeoSettings): Promise<void>;
    updateService(id: ServiceId, service: Service): Promise<void>;
    updateSkill(id: SkillId, skill: Skill): Promise<void>;
    updateSocialLink(id: SocialLinkId, socialLink: SocialLink): Promise<void>;
    updateTestimonial(id: TestimonialId, testimonial: Testimonial): Promise<void>;
}
