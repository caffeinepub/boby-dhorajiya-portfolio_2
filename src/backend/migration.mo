import Map "mo:core/Map";
import Project "Project";
import Skill "Skill";
import Service "Service";
import Testimonial "Testimonial";
import Blog "Blog";
import Experience "Experience";
import Category "Category";
import Contact "Contact";
import SocialLink "SocialLink";

module {
  type OldActor = {
    projects : Map.Map<Nat, Project.Project>;
    skills : Map.Map<Nat, Skill.Skill>;
    services : Map.Map<Nat, Service.Service>;
    testimonials : Map.Map<Nat, Testimonial.Testimonial>;
    blogPosts : Map.Map<Nat, Blog.BlogPost>;
    experiences : Map.Map<Nat, Experience.Experience>;
    categories : Map.Map<Nat, Category.Category>;
    contacts : Map.Map<Nat, Contact.Contact>;
    socialLinks : Map.Map<Nat, SocialLink.SocialLink>;
    nextProjectId : Nat;
    nextSkillId : Nat;
    nextServiceId : Nat;
    nextTestimonialId : Nat;
    nextBlogPostId : Nat;
    nextExperienceId : Nat;
    nextCategoryId : Nat;
    nextContactId : Nat;
    nextSocialLinkId : Nat;
  };

  type NewActor = {
    projects : Map.Map<Nat, Project.Project>;
    skills : Map.Map<Nat, Skill.Skill>;
    services : Map.Map<Nat, Service.Service>;
    testimonials : Map.Map<Nat, Testimonial.Testimonial>;
    blogPosts : Map.Map<Nat, Blog.BlogPost>;
    experiences : Map.Map<Nat, Experience.Experience>;
    categories : Map.Map<Nat, Category.Category>;
    contacts : Map.Map<Nat, Contact.Contact>;
    socialLinks : Map.Map<Nat, SocialLink.SocialLink>;
    nextProjectId : Nat;
    nextSkillId : Nat;
    nextServiceId : Nat;
    nextTestimonialId : Nat;
    nextBlogPostId : Nat;
    nextExperienceId : Nat;
    nextCategoryId : Nat;
    nextContactId : Nat;
    nextSocialLinkId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    {
      projects = old.projects;
      skills = old.skills;
      services = old.services;
      testimonials = old.testimonials;
      blogPosts = old.blogPosts;
      experiences = old.experiences;
      categories = old.categories;
      contacts = old.contacts;
      socialLinks = old.socialLinks;
      nextProjectId = old.nextProjectId;
      nextSkillId = old.nextSkillId;
      nextServiceId = old.nextServiceId;
      nextTestimonialId = old.nextTestimonialId;
      nextBlogPostId = old.nextBlogPostId;
      nextExperienceId = old.nextExperienceId;
      nextCategoryId = old.nextCategoryId;
      nextContactId = old.nextContactId;
      nextSocialLinkId = old.nextSocialLinkId;
    };
  };
};
