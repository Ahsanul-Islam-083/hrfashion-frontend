# HR Fashion — Frontend

A full-stack agentic AI web application for **HR Fashion**, a garment manufacturing brand offering both a retail fashion line and B2B manufacturing services. Built as a course project demonstrating full-stack development, AI integration, agent workflows, and professional UI/UX.

[**Live Site**](https://hrfashion.vercel.app)

[**Backend Repo**](https://github.com/Ahsanul-Islam-083/hrfashion-backend)

---

## What You Can Do

### As a Visitor (no account needed)
- Browse the home page, learn about HR Fashion's story on the About page, and explore manufacturing/B2B services
- Search, filter (by category and price), and sort the product catalog on Collections
- View full product details, images, specs, and existing customer reviews
- Browse and search open job listings on Careers
- Submit a message via Contact

### As a Registered User (sign up / log in, or use the Demo Login button)
- Add products to your Wishlist and get AI-powered "Recommended For You" suggestions based on what you've saved
- Leave star ratings and threaded comment-style reviews on products, like/reply to others' reviews
- Apply to open jobs — upload your resume (PDF/DOC), and after applying, choose to take an **AI-conducted mock interview** immediately or later from your dashboard
  - The AI generates 8 personalized questions (3 behavioral, 5 role-specific) based on your actual resume and the job's requirements
  - After you answer, the AI scores your responses (0–100) and gives written feedback
- Chat with the **AI Style Assistant** — ask about products, sizing, open jobs, or services; it searches real live data to answer (not made-up answers) and remembers your conversation
- Track your applications and interview results from your Dashboard
- Manage your profile, avatar, and password in Settings

### As an Admin (role-based access)
- Full CRUD management of Products, Job Postings, Services, and Team Members
- Review job applications: view resumes, see AI interview scores/feedback, Accept or Reject candidates
- Manage user accounts and roles
- View site-wide analytics (products, applications, users) with charts on the Admin Overview

---

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4
- **State/Data Fetching:** TanStack Query
- **Charts:** Recharts
- **Auth:** Better Auth (email/password + Google OAuth + JWT plugin)
- **Animation:** Framer Motion
- **Forms & UI:** Radix UI primitives, Sonner (toasts)
- **File Uploads:** ImgBB (images), Cloudinary (resume PDF/DOC)

## AI Features 

1. **AI Chat Assistant** — Conversational assistant with real tool-calling (searches live product/job/service data instead of hallucinating), persistent conversation memory, suggested follow-up prompts
2. **AI Smart Recommendation Engine** — Reasons over a user's actual wishlist behavior (category, price range, style patterns) to generate personalized product recommendations with a written justification per item, refreshing as the wishlist changes
3. **AI-conducted mock job interviews:** — generates role-specific questions from a parsed resume + job requirements, scores candidate answers, and gives structured feedback.

## Getting Started

```bash
npm install
cp .env.local.example .env.local   # fill in real values
npm run dev
```

Runs on `http://localhost:3000`.

## Environment Variables

See `.env.local.example` for the full list, including MongoDB, Better Auth, Google OAuth, backend API URL, and file upload service keys.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── admin/        # Admin dashboard
│   ├── dashboard/    # User dashboard
│   ├── collections/  # Product listing + details
│   ├── careers/      # Job listing + details
│   └── ...
├── components/       # Reusable UI components
├── lib/              # API client, auth client, query keys
└── proxy.ts          # Route protection (auth/role middleware)
```
