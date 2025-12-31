# Fantasy Track & Field Web App

Production-ready fantasy track & field web app with two scoring modes: Unofficial (estimated) and Official (final).

## Stack
- Next.js (TypeScript, App Router)
- Postgres (Prisma ORM)
- NextAuth (authentication)
- Tailwind CSS

## Features
- User submissions for weekly events
- Predicted marks/times, estimated and official scores
- Unofficial and official standings
- Admin CSV upload for official results (with audit log)
- Head-to-head weekly matchups
- League and draft system (snake draft, real-time draft room)
- Role-based access (admin/user)
- Secure input validation, auth guards, rate limits
- ESPN-style UI

## Setup
1. Provision hosted Postgres (Neon, Railway, or equivalent)
2. Set Vercel Environment Variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
3. Run migrations locally or via CI using your `DATABASE_URL`:
	- `npx prisma migrate deploy`
4. Deploy on Vercel by importing the GitHub repo (HTTPS/SSL enabled by default)
5. Configure `Environment Variables` in Vercel dashboard for Production & Preview

## CSV Format (Official Upload)
- Columns: userId,eventId,officialMark
- Validation: All userId/eventId must exist, officialMark must be a number, no duplicates

## Security
- All mutations are server-validated
- Prisma ORM prevents SQL injection
- Auth guards and rate limits enforced

## Deployment (Vercel-only)
- Push to GitHub, import into Vercel
- No Docker required; Next.js App Router with serverless functions
- Ensure `DATABASE_URL` is set and reachable from Vercel

---

See `/prisma/schema.prisma` for database schema and `/app/utils/` for core logic.
