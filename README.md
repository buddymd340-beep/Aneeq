# BrightPath Teaching Website

A simple public teaching website built with Next.js. The design includes interactive pages for visitors to browse courses and contact the teacher without login.

## Pages

- `/` - Home page with hero, stats, featured courses, process, testimonials, FAQ, and CTA
- `/about` - Teacher introduction, teaching method, values, and CTA
- `/courses` - Interactive course search and category filters
- `/courses/[slug]` - Course detail page with tabs, syllabus, benefits, and contact card
- `/contact` - Contact form and contact information

## UI Components

- Sticky responsive navbar with mobile menu
- Hero visual card
- Course cards with hover effects
- Search and filter course browser
- Course detail tabs
- FAQ accordion
- Testimonial slider
- Contact form with success/error state
- CTA and footer sections

## Database Structure

The Prisma schema contains:

- `Course`
- `ContactInquiry`
- `Testimonial`
- `SiteSetting`
- `FAQ`

## Run Locally

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run prisma:seed
npm run dev
```
