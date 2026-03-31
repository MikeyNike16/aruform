# Aruform - Existential Journaling App

## Project Overview
A Next.js TypeScript web application for existential journaling with AI-powered sentiment analysis.

## Quick Reference
- **Spec File:** See [SPEC.md](../SPEC.md) for complete technical documentation
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS (glassy iOS-style theme)
- **Storage:** LocalStorage (client-side)
- **AI:** OpenAI GPT-4o-mini for sentiment analysis
- **Dev Server:** `npm run dev` (currently port 3004)

## Key Features Implemented
✅ Landing page with hero, benefits, FAQ, waitlist  
✅ Write interface with AI sentiment analysis  
✅ Entry list with condensed state trackers  
✅ Entry detail view (clickable cards)  
✅ Dual sentiment analysis (AI + keyword fallback)  
✅ Mood/Energy/Stress tracking (1-10 scale)  
✅ Glassy button design with hover animations  
✅ State tracker visualizations  

## Current Status
**Version:** 0.1.0  
**Last Updated:** March 23, 2026  
**Port:** 3004 (3000-3003 in use)

## Important Files
- `/src/app/page.tsx` - Landing page
- `/src/app/write/page.tsx` - Writing interface with AI
- `/src/app/entries/page.tsx` - Entries list
- `/src/app/entries/[id]/page.tsx` - Entry detail view
- `/src/app/api/analyze-sentiment/route.ts` - AI sentiment API
- `/.env.local` - Environment variables (OPENAI_API_KEY)
- `/SPEC.md` - Complete technical specification

## Development Notes
- Clear Next.js cache if errors occur: `rm -rf .next`
- AI analysis triggers at 100+ characters
- Cost: ~$0.0002 per entry analyzed
- Params in dynamic routes are now Promises in Next.js 15 (use `React.use()`)

## Next Steps / TODO
- [ ] Export functionality (JSON/CSV)
- [ ] Search and filter entries
- [ ] Timeline visualization
- [ ] Compare snapshots
- [ ] User authentication and cloud sync
- [ ] Mobile responsiveness improvements

## Documentation
For full technical details, architecture, API specs, and roadmap, see [SPEC.md](../SPEC.md)
