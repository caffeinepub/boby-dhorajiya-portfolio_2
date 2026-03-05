import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BlogPost,
  Category__2,
  Contact,
  Experience,
  Project,
  SeoSettings,
  Service,
  Skill,
  SocialLink,
  Testimonial,
} from "../backend.d";
import { Category, Category__1 } from "../backend.d";
import { useActor } from "./useActor";

// Re-export enums for convenience
export { Category, Category__1 };

// ─── PUBLIC QUERIES ───────────────────────────────────────

export function useGetActiveProjects() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["activeProjects"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getActiveProjects();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllSkills() {
  const { actor, isFetching } = useActor();
  return useQuery<Skill[]>({
    queryKey: ["allSkills"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllSkills();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllServices() {
  const { actor, isFetching } = useActor();
  return useQuery<Service[]>({
    queryKey: ["allServices"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllServices();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllTestimonials() {
  const { actor, isFetching } = useActor();
  return useQuery<Testimonial[]>({
    queryKey: ["allTestimonials"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllTestimonials();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetPublishedBlogPosts() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["publishedBlogPosts"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getPublishedBlogPosts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllExperiences() {
  const { actor, isFetching } = useActor();
  return useQuery<Experience[]>({
    queryKey: ["allExperiences"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllExperiences();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category__2[]>({
    queryKey: ["allCategories"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllCategories();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetActiveSocialLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialLink[]>({
    queryKey: ["activeSocialLinks"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getActiveSocialLinks();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetSeoSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SeoSettings | null>({
    queryKey: ["seoSettings"],
    queryFn: async () => {
      try {
        if (!actor) return null;
        return await actor.getSeoSettings();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// ─── ADMIN QUERIES ────────────────────────────────────────

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      try {
        if (!actor) return false;
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetDashboardStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getDashboardStats();
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllProjectsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["allProjectsAdmin"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllProjectsAdmin();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllBlogPostsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<BlogPost[]>({
    queryKey: ["allBlogPostsAdmin"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllBlogPostsAdmin();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllContacts() {
  const { actor, isFetching } = useActor();
  return useQuery<Contact[]>({
    queryKey: ["allContacts"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllContacts();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGetAllSocialLinks() {
  const { actor, isFetching } = useActor();
  return useQuery<SocialLink[]>({
    queryKey: ["allSocialLinks"],
    queryFn: async () => {
      try {
        if (!actor) return [];
        return await actor.getAllSocialLinksAdmin();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

// Alias for admin social links panel
export const useGetAllSocialLinksAdmin = useGetAllSocialLinks;

// ─── MUTATIONS ────────────────────────────────────────────

export function useCreateContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (contact: Contact) => {
      if (!actor) throw new Error("Not connected");
      return actor.createContact(contact);
    },
  });
}

// Projects
export function useCreateProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (project: Project) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProject(project);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProjectsAdmin"] });
      qc.invalidateQueries({ queryKey: ["activeProjects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, project }: { id: bigint; project: Project }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProject(id, project);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProjectsAdmin"] });
      qc.invalidateQueries({ queryKey: ["activeProjects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProject(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allProjectsAdmin"] });
      qc.invalidateQueries({ queryKey: ["activeProjects"] });
    },
  });
}

// Skills
export function useCreateSkill() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (skill: Skill) => {
      if (!actor) throw new Error("Not connected");
      return actor.createSkill(skill);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allSkills"] }),
  });
}

export function useUpdateSkill() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, skill }: { id: bigint; skill: Skill }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSkill(id, skill);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allSkills"] }),
  });
}

export function useDeleteSkill() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSkill(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allSkills"] }),
  });
}

// Services
export function useCreateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error("Not connected");
      return actor.createService(service);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allServices"] }),
  });
}

export function useUpdateService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, service }: { id: bigint; service: Service }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateService(id, service);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allServices"] }),
  });
}

export function useDeleteService() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteService(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allServices"] }),
  });
}

// Testimonials
export function useCreateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (testimonial: Testimonial) => {
      if (!actor) throw new Error("Not connected");
      return actor.createTestimonial(testimonial);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTestimonials"] }),
  });
}

export function useUpdateTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      testimonial,
    }: { id: bigint; testimonial: Testimonial }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTestimonial(id, testimonial);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTestimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteTestimonial(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allTestimonials"] }),
  });
}

// Blog
export function useCreateBlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (post: BlogPost) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBlogPost(post);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allBlogPostsAdmin"] });
      qc.invalidateQueries({ queryKey: ["publishedBlogPosts"] });
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, post }: { id: bigint; post: BlogPost }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateBlogPost(id, post);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allBlogPostsAdmin"] });
      qc.invalidateQueries({ queryKey: ["publishedBlogPosts"] });
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteBlogPost(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allBlogPostsAdmin"] });
      qc.invalidateQueries({ queryKey: ["publishedBlogPosts"] });
    },
  });
}

// Experience
export function useCreateExperience() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (exp: Experience) => {
      if (!actor) throw new Error("Not connected");
      return actor.createExperience(exp);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allExperiences"] }),
  });
}

export function useUpdateExperience() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, exp }: { id: bigint; exp: Experience }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateExperience(id, exp);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allExperiences"] }),
  });
}

export function useDeleteExperience() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteExperience(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allExperiences"] }),
  });
}

// Categories
export function useCreateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (category: Category__2) => {
      if (!actor) throw new Error("Not connected");
      return actor.createCategory(category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allCategories"] }),
  });
}

export function useUpdateCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      category,
    }: { id: bigint; category: Category__2 }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateCategory(id, category);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allCategories"] }),
  });
}

export function useDeleteCategory() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteCategory(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allCategories"] }),
  });
}

// Social Links
export function useCreateSocialLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (link: SocialLink) => {
      if (!actor) throw new Error("Not connected");
      return actor.createSocialLink(link);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allSocialLinks"] });
      qc.invalidateQueries({ queryKey: ["activeSocialLinks"] });
    },
  });
}

export function useUpdateSocialLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, link }: { id: bigint; link: SocialLink }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSocialLink(id, link);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allSocialLinks"] });
      qc.invalidateQueries({ queryKey: ["activeSocialLinks"] });
    },
  });
}

export function useDeleteSocialLink() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteSocialLink(id);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allSocialLinks"] });
      qc.invalidateQueries({ queryKey: ["activeSocialLinks"] });
    },
  });
}

export function useDeleteContact() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteContact(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allContacts"] }),
  });
}

// SEO
export function useUpdateSeoSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SeoSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSeoSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["seoSettings"] }),
  });
}
