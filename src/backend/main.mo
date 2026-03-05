import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Blog "Blog";
import Project "Project";
import Category "Category";
import Service "Service";
import Skill "Skill";
import SocialLink "SocialLink";
import Experience "Experience";
import Contact "Contact";
import Testimonial "Testimonial";

import Prim "mo:⛔";

// Migrate data on upgrade

actor {
  // Seed actor with one admin user
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type ProjectId = Nat;
  type SkillId = Nat;
  type ServiceId = Nat;
  type TestimonialId = Nat;
  type BlogPostId = Nat;
  type ExperienceId = Nat;
  type CategoryId = Nat;
  type ContactId = Nat;
  type SocialLinkId = Nat;
  type UserProfile = {
    name : Text;
  };
  type SeoSettings = {
    metaTitle : Text;
    metaDescription : Text;
    ogImage : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent storage
  let projects = Map.empty<ProjectId, Project.Project>();
  let skills = Map.empty<SkillId, Skill.Skill>();
  let services = Map.empty<ServiceId, Service.Service>();
  let testimonials = Map.empty<TestimonialId, Testimonial.Testimonial>();
  let blogPosts = Map.empty<BlogPostId, Blog.BlogPost>();
  let experiences = Map.empty<ExperienceId, Experience.Experience>();
  let categories = Map.empty<CategoryId, Category.Category>();
  let contacts = Map.empty<ContactId, Contact.Contact>();
  let socialLinks = Map.empty<SocialLinkId, SocialLink.SocialLink>();

  var seoSettings : SeoSettings = {
    metaTitle = "Boby Dhorajiya - Mobile App Developer";
    metaDescription = "Portfolio website showcasing the skills, projects, and services of Boby Dhorajiya, a professional mobile app developer specializing in Flutter and React Native.";
    ogImage = "";
  };

  // ID counters
  var nextProjectId = 0;
  var nextSkillId = 0;
  var nextServiceId = 0;
  var nextTestimonialId = 0;
  var nextBlogPostId = 0;
  var nextExperienceId = 0;
  var nextCategoryId = 0;
  var nextContactId = 0;
  var nextSocialLinkId = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Projects
  public shared ({ caller }) func createProject(project : Project.Project) : async ProjectId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };

    let newProject = {
      project with
      id = nextProjectId;
    };
    projects.add(nextProjectId, newProject);
    nextProjectId += 1;
    newProject.id;
  };

  public shared ({ caller }) func updateProject(id : ProjectId, project : Project.Project) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };

    if (not projects.containsKey(id)) {
      Runtime.trap("Project not found");
    };

    let updatedProject = {
      project with
      id;
    };
    projects.add(id, updatedProject);
  };

  public shared ({ caller }) func deleteProject(id : ProjectId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete projects");
    };

    if (not projects.containsKey(id)) {
      Runtime.trap("Project not found");
    };

    projects.remove(id);
  };

  public query func getProject(id : ProjectId) : async Project.Project {
    switch (projects.get(id)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) { project };
    };
  };

  public query func getActiveProjects() : async [Project.Project] {
    projects.values().toArray().filter(func(p) { p.isActive }).sort();
  };

  public query ({ caller }) func getAllProjectsAdmin() : async [Project.Project] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    projects.values().toArray().sort();
  };

  // Skills
  public shared ({ caller }) func createSkill(skill : Skill.Skill) : async SkillId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create skills");
    };

    let newSkill = {
      skill with
      id = nextSkillId;
    };
    skills.add(nextSkillId, newSkill);
    nextSkillId += 1;
    newSkill.id;
  };

  public shared ({ caller }) func updateSkill(id : SkillId, skill : Skill.Skill) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update skills");
    };

    if (not skills.containsKey(id)) {
      Runtime.trap("Skill not found");
    };

    let updatedSkill = {
      skill with
      id;
    };
    skills.add(id, updatedSkill);
  };

  public shared ({ caller }) func deleteSkill(id : SkillId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete skills");
    };

    if (not skills.containsKey(id)) {
      Runtime.trap("Skill not found");
    };

    skills.remove(id);
  };

  public query func getSkill(id : SkillId) : async Skill.Skill {
    switch (skills.get(id)) {
      case (null) { Runtime.trap("Skill not found") };
      case (?skill) { skill };
    };
  };

  public query func getAllSkills() : async [Skill.Skill] {
    skills.values().toArray().sort();
  };

  // Services
  public shared ({ caller }) func createService(service : Service.Service) : async ServiceId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };

    let newService = {
      service with
      id = nextServiceId;
    };
    services.add(nextServiceId, newService);
    nextServiceId += 1;
    newService.id;
  };

  public shared ({ caller }) func updateService(id : ServiceId, service : Service.Service) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };

    if (not services.containsKey(id)) {
      Runtime.trap("Service not found");
    };

    let updatedService = {
      service with
      id;
    };
    services.add(id, updatedService);
  };

  public shared ({ caller }) func deleteService(id : ServiceId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };

    if (not services.containsKey(id)) {
      Runtime.trap("Service not found");
    };

    services.remove(id);
  };

  public query func getService(id : ServiceId) : async Service.Service {
    switch (services.get(id)) {
      case (null) { Runtime.trap("Service not found") };
      case (?service) { service };
    };
  };

  public query func getAllServices() : async [Service.Service] {
    services.values().toArray().sort();
  };

  // Testimonials
  public shared ({ caller }) func createTestimonial(testimonial : Testimonial.Testimonial) : async TestimonialId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create testimonials");
    };

    let newTestimonial = {
      testimonial with
      id = nextTestimonialId;
    };
    testimonials.add(nextTestimonialId, newTestimonial);
    nextTestimonialId += 1;
    newTestimonial.id;
  };

  public shared ({ caller }) func updateTestimonial(id : TestimonialId, testimonial : Testimonial.Testimonial) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update testimonials");
    };

    if (not testimonials.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };

    let updatedTestimonial = {
      testimonial with
      id;
    };
    testimonials.add(id, updatedTestimonial);
  };

  public shared ({ caller }) func deleteTestimonial(id : TestimonialId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete testimonials");
    };

    if (not testimonials.containsKey(id)) {
      Runtime.trap("Testimonial not found");
    };

    testimonials.remove(id);
  };

  public query func getTestimonial(id : TestimonialId) : async Testimonial.Testimonial {
    switch (testimonials.get(id)) {
      case (null) { Runtime.trap("Testimonial not found") };
      case (?testimonial) { testimonial };
    };
  };

  public query func getAllTestimonials() : async [Testimonial.Testimonial] {
    testimonials.values().toArray().sort();
  };

  // BlogPosts
  public shared ({ caller }) func createBlogPost(blogPost : Blog.BlogPost) : async BlogPostId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create blog posts");
    };

    // Check for slug uniqueness
    let existingSlug = blogPosts.values().find(func(bp) { return bp.slug == blogPost.slug });
    if (existingSlug != null) {
      Runtime.trap("Slug already exists");
    };

    let newBlogPost = {
      blogPost with
      id = nextBlogPostId;
    };
    blogPosts.add(nextBlogPostId, newBlogPost);
    nextBlogPostId += 1;
    newBlogPost.id;
  };

  public shared ({ caller }) func updateBlogPost(id : BlogPostId, blogPost : Blog.BlogPost) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update blog posts");
    };

    if (not blogPosts.containsKey(id)) {
      Runtime.trap("Blog post not found");
    };

    // Check for slug uniqueness (exclude current post)
    let existingSlug = blogPosts.values().find(
      func(bp) {
        return bp.slug == blogPost.slug and bp.id != id;
      }
    );
    if (existingSlug != null) {
      Runtime.trap("Slug already exists");
    };

    let updatedBlogPost = {
      blogPost with
      id;
    };
    blogPosts.add(id, updatedBlogPost);
  };

  public shared ({ caller }) func deleteBlogPost(id : BlogPostId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete blog posts");
    };

    if (not blogPosts.containsKey(id)) {
      Runtime.trap("Blog post not found");
    };

    blogPosts.remove(id);
  };

  public query func getBlogPost(id : BlogPostId) : async Blog.BlogPost {
    switch (blogPosts.get(id)) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?blogPost) { blogPost };
    };
  };

  public query func getBlogPostBySlug(slug : Text) : async Blog.BlogPost {
    switch (blogPosts.values().find(func(bp) { bp.slug == slug })) {
      case (null) { Runtime.trap("Blog post not found") };
      case (?blogPost) { blogPost };
    };
  };

  public query func getPublishedBlogPosts() : async [Blog.BlogPost] {
    blogPosts.values().toArray().filter(func(bp) { bp.isPublished }).sort(Blog.compareByPublishedAt);
  };

  public query ({ caller }) func getAllBlogPostsAdmin() : async [Blog.BlogPost] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    blogPosts.values().toArray().sort(Blog.compareByPublishedAt);
  };

  // Experiences
  public shared ({ caller }) func createExperience(experience : Experience.Experience) : async ExperienceId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create experiences");
    };

    let newExperience = {
      experience with
      id = nextExperienceId;
    };
    experiences.add(nextExperienceId, newExperience);
    nextExperienceId += 1;
    newExperience.id;
  };

  public shared ({ caller }) func updateExperience(id : ExperienceId, experience : Experience.Experience) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update experiences");
    };

    if (not experiences.containsKey(id)) {
      Runtime.trap("Experience not found");
    };

    let updatedExperience = {
      experience with
      id;
    };
    experiences.add(id, updatedExperience);
  };

  public shared ({ caller }) func deleteExperience(id : ExperienceId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete experiences");
    };

    if (not experiences.containsKey(id)) {
      Runtime.trap("Experience not found");
    };

    experiences.remove(id);
  };

  public query func getExperience(id : ExperienceId) : async Experience.Experience {
    switch (experiences.get(id)) {
      case (null) { Runtime.trap("Experience not found") };
      case (?experience) { experience };
    };
  };

  public query func getAllExperiences() : async [Experience.Experience] {
    experiences.values().toArray().sort();
  };

  // Categories
  public shared ({ caller }) func createCategory(category : Category.Category) : async CategoryId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create categories");
    };

    let newCategory = {
      category with
      id = nextCategoryId;
    };
    categories.add(nextCategoryId, newCategory);
    nextCategoryId += 1;
    newCategory.id;
  };

  public shared ({ caller }) func updateCategory(id : CategoryId, category : Category.Category) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update categories");
    };

    if (not categories.containsKey(id)) {
      Runtime.trap("Category not found");
    };

    let updatedCategory = {
      category with
      id;
    };
    categories.add(id, updatedCategory);
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete categories");
    };

    if (not categories.containsKey(id)) {
      Runtime.trap("Category not found");
    };

    categories.remove(id);
  };

  public query func getCategory(id : CategoryId) : async Category.Category {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?category) { category };
    };
  };

  public query func getAllCategories() : async [Category.Category] {
    categories.values().toArray().sort();
  };

  // Contacts (leads)
  public shared func createContact(contact : Contact.Contact) : async ContactId {
    let newContact = {
      contact with
      id = nextContactId;
      createdAt = Time.now();
    };
    contacts.add(nextContactId, newContact);
    nextContactId += 1;
    newContact.id;
  };

  public shared ({ caller }) func deleteContact(id : ContactId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete contacts");
    };

    if (not contacts.containsKey(id)) {
      Runtime.trap("Contact not found");
    };

    contacts.remove(id);
  };

  public query ({ caller }) func getContact(id : ContactId) : async Contact.Contact {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can read contacts");
    };

    switch (contacts.get(id)) {
      case (null) { Runtime.trap("Contact not found") };
      case (?contact) { contact };
    };
  };

  public query ({ caller }) func getAllContacts() : async [Contact.Contact] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    contacts.values().toArray().sort(Contact.compareByCreatedAt);
  };

  // SocialLinks
  public shared ({ caller }) func createSocialLink(socialLink : SocialLink.SocialLink) : async SocialLinkId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create social links");
    };

    let newSocialLink = {
      socialLink with
      id = nextSocialLinkId;
    };
    socialLinks.add(nextSocialLinkId, newSocialLink);
    nextSocialLinkId += 1;
    newSocialLink.id;
  };

  public shared ({ caller }) func updateSocialLink(id : SocialLinkId, socialLink : SocialLink.SocialLink) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update social links");
    };

    if (not socialLinks.containsKey(id)) {
      Runtime.trap("Social link not found");
    };

    let updatedSocialLink = {
      socialLink with
      id;
    };
    socialLinks.add(id, updatedSocialLink);
  };

  public shared ({ caller }) func deleteSocialLink(id : SocialLinkId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete social links");
    };

    if (not socialLinks.containsKey(id)) {
      Runtime.trap("Social link not found");
    };

    socialLinks.remove(id);
  };

  public query func getSocialLink(id : SocialLinkId) : async SocialLink.SocialLink {
    switch (socialLinks.get(id)) {
      case (null) { Runtime.trap("Social link not found") };
      case (?socialLink) { socialLink };
    };
  };

  public query func getActiveSocialLinks() : async [SocialLink.SocialLink] {
    socialLinks.values().toArray().filter(func(sl) { sl.isActive }).sort();
  };

  public query ({ caller }) func getAllSocialLinksAdmin() : async [SocialLink.SocialLink] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Admins only");
    };
    socialLinks.values().toArray().sort();
  };

  // SEO Settings
  public shared ({ caller }) func updateSeoSettings(newSettings : SeoSettings) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update SEO settings");
    };

    seoSettings := newSettings;
  };

  public query func getSeoSettings() : async SeoSettings {
    seoSettings;
  };

  // Dashboard stats (admin only)
  public query ({ caller }) func getDashboardStats() : async {
    projectsCount : Nat;
    blogsCount : Nat;
    skillsCount : Nat;
    leadsCount : Nat;
    servicesCount : Nat;
    testimonialsCount : Nat;
  } {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view dashboard stats");
    };

    {
      projectsCount = projects.size();
      blogsCount = blogPosts.size();
      skillsCount = skills.size();
      leadsCount = contacts.size();
      servicesCount = services.size();
      testimonialsCount = testimonials.size();
    };
  };

  // --- New admin reset function ---
  public shared ({ caller }) func resetAllData(adminToken : Text) : async () {
    // Validate authorization: caller must be admin OR token must match environment variable
    let isCallerAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    let tokenValid = switch (Prim.envVar("CAFFEINE_ADMIN_TOKEN")) {
      case null { false };
      case (?envToken) { adminToken == envToken };
    };

    if (not isCallerAdmin and not tokenValid) {
      Runtime.trap("Unauthorized");
    };

    // Clear all data maps
    projects.clear();
    skills.clear();
    services.clear();
    testimonials.clear();
    blogPosts.clear();
    experiences.clear();
    categories.clear();
    contacts.clear();
    socialLinks.clear();
    userProfiles.clear();

    // Reset all ID counters
    nextProjectId := 0;
    nextSkillId := 0;
    nextServiceId := 0;
    nextTestimonialId := 0;
    nextBlogPostId := 0;
    nextExperienceId := 0;
    nextCategoryId := 0;
    nextContactId := 0;
    nextSocialLinkId := 0;

    // Reset SEO settings to defaults
    seoSettings := {
      metaTitle = "Boby Dhorajiya - Mobile App Developer";
      metaDescription = "Portfolio website showcasing the skills, projects, and services of Boby Dhorajiya, a professional mobile app developer specializing in Flutter and React Native.";
      ogImage = "";
    };

    // Note: We cannot directly clear the accessControlState.userRoles map or reset adminAssigned
    // because AccessControlState is an opaque type from the access-control module.
    // The access control state will need to be reinitialized through the normal
    // _initializeAccessControlWithSecret flow after this reset.
    // This is acceptable as the function's purpose is to allow re-registration without redeployment.
  };
};
