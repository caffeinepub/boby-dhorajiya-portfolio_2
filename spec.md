# Boby Dhorajiya Portfolio

## Current State
A full-stack portfolio app built on Motoko (backend) + React/TypeScript (frontend). The backend has 9 modules: Project, Skill, Service, Testimonial, BlogPost, Experience, Category, Contact, SocialLink, plus SEO settings and authorization. The frontend has public pages (Home, About, Projects, Skills, Services, Testimonials, Blog, Experience, Contact) and a full admin panel with dashboard, CRUD for all entities, leads view, SEO, social links, and help page. Previous production deployments have had bugs including: `.sort()` without comparators causing runtime traps, BigInt parsing crashes, and admin access issues.

## Requested Changes (Diff)

### Add
- Nothing new -- full clean rebuild with data reset

### Modify
- Full production rebuild: regenerate backend from scratch (destroys all existing stored data -- fresh state)
- Fix all known backend bugs definitively: all `.sort()` calls use explicit comparators; no raw `.sort()` without arguments on any collection
- Fix all known frontend bugs: safe BigInt parsing everywhere, no double sidebar, single QueryClient only
- Admin access: first Internet Identity login via admin link grants admin role automatically
- Clean, stable admin CRUD for all 9 entities with no "Failed to save" errors
- Contact form stores leads with createdAt timestamp
- Blog auto-generates unique slugs and prevents duplicates
- Projects support active/inactive toggle visible in admin, hidden on public frontend
- Social links support active/inactive toggle
- Dashboard shows correct counts for all entities

### Remove
- All stale/buggy code from previous versions
- Admin token field (already removed in v3)

## Implementation Plan
1. Regenerate Motoko backend fresh -- all comparator functions explicitly passed to `.sort()`, all modules intact, all CRUD operations clean
2. Rebuild frontend with single QueryClient in main.tsx, AdminLayout wraps sidebar only once, all admin pages use `<div className="p-8">`, all BigInt parsing uses safe helper
3. All public React Query hooks: retry: false, try/catch returning [] on failure, empty state UI
4. Admin guard redirects unauthenticated/non-admin to /admin/login
5. /admin redirects to /admin/dashboard
6. Active nav tab = cyan highlight, hover = neutral gray
7. Availability badge (9 AM - 8 PM) visible in Hero, Footer, Contact
8. All pages: Home, About, Projects (category filter + skeleton + empty state), Skills (grouped), Services, Testimonials, Blog (SEO slugs), Experience, Contact (rate-limited form + lead storage)
9. Admin pages: Dashboard stats, Projects CRUD + active toggle, Categories CRUD, Skills CRUD grouped, Experience CRUD, Services CRUD, Testimonials CRUD, Blog CRUD + slug, Social Links CRUD + active toggle, Leads (view only + pagination), SEO settings, Help guide
