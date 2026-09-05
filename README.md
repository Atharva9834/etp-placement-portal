# E-T&P Placement Portal

A deployable MVP for an Education/Training & Placement portal.

## Included
- Student dashboard
- Ongoing placement drives
- Company, role, eligibility, package, deadlines, test/interview dates
- Search and filters
- Apply/Register flow
- Admin dashboard
- Create/delete drives
- Responsive UI

## Run locally

Requirements: Node.js 18+

```bash
npm install
npm run dev
```

Open http://localhost:5173

This MVP stores data in the browser using localStorage so it works immediately without configuring a database.

## Deployment

The easiest deployment is Vercel:

1. Upload this project to GitHub.
2. Import the repository into Vercel.
3. Framework: Vite.
4. Build command: `npm run build`
5. Output directory: `dist`

For a production college portal, replace localStorage with PostgreSQL/Supabase and add real authentication before going live.
