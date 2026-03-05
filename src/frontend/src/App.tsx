import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { Suspense, lazy } from "react";
import { AdminLayout } from "./components/layout/AdminLayout";
import { PublicLayout } from "./components/layout/PublicLayout";

// Lazy-loaded public pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Skills = lazy(() => import("./pages/Skills"));
const Services = lazy(() => import("./pages/Services"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Experience = lazy(() => import("./pages/Experience"));
const Contact = lazy(() => import("./pages/Contact"));

// Lazy-loaded admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminSkills = lazy(() => import("./pages/admin/AdminSkills"));
const AdminExperience = lazy(() => import("./pages/admin/AdminExperience"));
const AdminServices = lazy(() => import("./pages/admin/AdminServices"));
const AdminTestimonials = lazy(() => import("./pages/admin/AdminTestimonials"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminSocialLinks = lazy(() => import("./pages/admin/AdminSocialLinks"));
const AdminLeads = lazy(() => import("./pages/admin/AdminLeads"));
const AdminSEO = lazy(() => import("./pages/admin/AdminSEO"));
const AdminHelp = lazy(() => import("./pages/admin/AdminHelp"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-8 h-8 animate-spin text-cyan" />
  </div>
);

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "public-layout",
  component: PublicLayout,
});

// Admin layout route
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "admin-layout",
  component: AdminLayout,
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Home />
    </Suspense>
  ),
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/about",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <About />
    </Suspense>
  ),
});

const projectsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/projects",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Projects />
    </Suspense>
  ),
});

const skillsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/skills",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Skills />
    </Suspense>
  ),
});

const servicesRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/services",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Services />
    </Suspense>
  ),
});

const testimonialsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/testimonials",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Testimonials />
    </Suspense>
  ),
});

const blogRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/blog",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Blog />
    </Suspense>
  ),
});

const blogPostRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/blog/$slug",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <BlogPost />
    </Suspense>
  ),
});

const experienceRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/experience",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Experience />
    </Suspense>
  ),
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: "/contact",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <Contact />
    </Suspense>
  ),
});

// Admin redirect
const adminIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  beforeLoad: () => {
    throw redirect({ to: "/admin/dashboard" });
  },
});

// Admin login
const adminLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin/login",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminLogin />
    </Suspense>
  ),
});

// Admin panel routes (under AdminLayout)
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/dashboard",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminDashboard />
    </Suspense>
  ),
});

const adminProjectsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/projects",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminProjects />
    </Suspense>
  ),
});

const adminCategoriesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/categories",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminCategories />
    </Suspense>
  ),
});

const adminSkillsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/skills",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminSkills />
    </Suspense>
  ),
});

const adminExperienceRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/experience",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminExperience />
    </Suspense>
  ),
});

const adminServicesRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/services",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminServices />
    </Suspense>
  ),
});

const adminTestimonialsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/testimonials",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminTestimonials />
    </Suspense>
  ),
});

const adminBlogRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/blog",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminBlog />
    </Suspense>
  ),
});

const adminSocialLinksRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/social-links",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminSocialLinks />
    </Suspense>
  ),
});

const adminLeadsRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/leads",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminLeads />
    </Suspense>
  ),
});

const adminSeoRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/seo",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminSEO />
    </Suspense>
  ),
});

const adminHelpRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: "/admin/help",
  component: () => (
    <Suspense fallback={<PageLoader />}>
      <AdminHelp />
    </Suspense>
  ),
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    projectsRoute,
    skillsRoute,
    servicesRoute,
    testimonialsRoute,
    blogRoute,
    blogPostRoute,
    experienceRoute,
    contactRoute,
  ]),
  adminIndexRoute,
  adminLoginRoute,
  adminLayoutRoute.addChildren([
    adminDashboardRoute,
    adminProjectsRoute,
    adminCategoriesRoute,
    adminSkillsRoute,
    adminExperienceRoute,
    adminServicesRoute,
    adminTestimonialsRoute,
    adminBlogRoute,
    adminSocialLinksRoute,
    adminLeadsRoute,
    adminSeoRoute,
    adminHelpRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast: "bg-card border border-border text-foreground",
            success: "border-cyan/30",
            error: "border-destructive/30",
          },
        }}
      />
    </>
  );
}
