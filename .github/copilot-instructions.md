# Copilot Instructions for SIH Frontend (Next.js)

## Project Overview
- This is a Next.js 13+ app using the `/src/app` directory structure and TypeScript.
- The codebase is organized by user roles (`authority`, `user`) and feature domains (e.g., `analytics`, `compliance`, `dashboard`, etc.).
- UI components are in `src/components/` and `src/components/ui/` (atomic design pattern).
- API routes are colocated under `src/app/user/api/` for backend logic.

## Key Architectural Patterns
- **App Directory Routing:** Uses Next.js app directory for file-based routing. Each folder under `src/app` is a route; `page.tsx` is the entry point.
- **Role-Based Layouts:** `authority` and `user` have their own `layout.tsx` and `globals.css` for scoped styling and navigation.
- **Component Reuse:** Shared UI and feature components are in `src/components/`. Prefer importing from here for consistency.
- **API Integration:** Frontend API calls are abstracted in `src/lib/api.ts`. Use this for all network requests.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (default port: 3000)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (uses ESLint config in `eslint.config.mjs`)
- **Type Checking:** `tsc --noEmit` (uses `tsconfig.json`)
- **Styling:** Use CSS modules or global CSS in each route folder. Shared styles in `src/app/globals.css`.

## Project-Specific Conventions
- **File Naming:** Use kebab-case for files, PascalCase for React components.
- **Routing:** Dynamic routes use `[id]` folders (e.g., `src/app/user/community/[id]/page.tsx`).
- **Loading States:** Use `loading.tsx` for route-level loading UI.
- **API Routes:** Place Next.js API routes under `src/app/user/api/`.
- **Icons/Assets:** Store SVGs and images in `public/`.

## Integration Points
- **External APIs:** All API calls should go through `src/lib/api.ts` for consistency and error handling.
- **Charts/Maps:** Custom components like `chart-card.tsx`, `map-view.tsx`, and `vehicle-map.tsx` handle data visualization.
- **State Management:** No global state library detected; use React context or props drilling as needed.

## Examples
- To add a new dashboard page for `authority`, create `src/app/authority/dashboard/page.tsx` and update `src/components/sidebar.tsx` for navigation.
- To add a new API route, create a folder under `src/app/user/api/` and add `route.ts`.
- For a new UI element, add to `src/components/ui/` and import where needed.

## References
- See `README.md` for basic setup and deployment.
- See `src/lib/api.ts` for API usage patterns.
- See `src/components/` for reusable UI and feature components.

---

**Feedback:** If any conventions or workflows are unclear or missing, please specify so this guide can be improved.
