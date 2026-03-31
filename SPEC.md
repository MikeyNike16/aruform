# Aruform - Technical Specification

## Project Overview

**Aruform** is an existential journaling web application designed to help users track their emotional states, beliefs, and personal evolution over time. The app combines traditional journaling with AI-powered sentiment analysis and visual emotional tracking.

**Version:** 0.1.0  
**Framework:** Next.js 15 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS  
**Storage:** Browser LocalStorage (client-side)  
**AI Provider:** OpenAI GPT-4o-mini

---

## Tech Stack

### Core Technologies
- **Next.js 15.5.9** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 3.4** - Utility-first styling
- **OpenAI SDK** - AI-powered sentiment analysis

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **npm** - Package management

---

## Features

### 1. Journal Entry System
- **Write Interface** (`/write`)
  - Title and content input
  - Real-time AI sentiment analysis
  - Manual mood/energy/stress sliders (1-10 scale)
  - AI toggle (switch between AI and keyword-based analysis)
  - Auto-save functionality

- **Entries List** (`/entries`)
  - Display all journal entries
  - Condensed state tracker per entry
  - Click to view full entry
  - Delete functionality
  - Sorted by date (newest first)

- **Entry Detail** (`/entries/[id]`)
  - Full entry content display
  - Expanded state tracker visualization
  - Delete and navigation options

### 2. Sentiment Analysis (Dual System)

#### AI-Powered Analysis
- **Model:** GPT-4o-mini
- **Trigger:** Content >= 100 characters
- **Output:** Mood, Energy, Stress scores (1-10) + confidence level
- **Cost:** ~$0.0002 per entry
- **Privacy:** No data stored by OpenAI

#### Keyword-Based Fallback
- 100+ emotion keywords with intensity weights
- Negation detection ("not happy")
- Intensifier recognition ("very tired")
- Sentence-level context analysis
- Multi-word phrase detection

### 3. State Tracking

#### Emotional Metrics (1-10 scale)
- **Mood:** 1=very negative, 5=neutral, 10=very positive
- **Energy:** 1=exhausted, 5=moderate, 10=highly energized
- **Stress:** 1=very calm, 5=moderate, 10=extremely stressed

#### Existential Metrics (1-10 scale)
- **Meaning/Purpose:** 1=life feels meaningless, 5=moderate purpose, 10=profound meaning
- **Existential Dread:** 1=peaceful with existence, 5=moderate, 10=intense void/mortality anxiety
- **Connection:** 1=deeply isolated, 5=moderate, 10=deeply connected to others/universe
- **Authenticity:** 1=deeply inauthentic/false self, 5=moderate, 10=completely authentic/free

#### Visualization
- Color-coded gradient progress bars
  - **Emotional State:** Mood (Blue/Cyan), Energy (Green/Emerald), Stress (Red/Orange)
  - **Existential State:** Meaning (Purple/Violet), Dread (Yellow/Amber), Connection (Pink/Rose), Authenticity (Indigo/Blue)
- Condensed view on entry cards (separate sections)
- Expanded view on detail pages with descriptions

### 4. Landing Page (`/`)
- Hero section with CTAs
- Benefits showcase
- How it works section
- Social proof (testimonials)
- FAQ section
- Waitlist signup form
- State tracker dashboard
- Belief Stability Index

### 5. UI/UX Features
- Glassy iOS-style buttons with backdrop blur
- Hover scale animations (1.05x)
- Active press animations (0.95x)
- Cyan-themed accent colors (#67e8f9)
- Dark mode optimized
- Responsive design
- Floating quotes animation

---

## Project Structure

```
aruform/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Global styles
│   │   ├── write/
│   │   │   └── page.tsx                # Write interface
│   │   ├── entries/
│   │   │   ├── page.tsx                # Entries list
│   │   │   └── [id]/
│   │   │       └── page.tsx            # Entry detail view
│   │   ├── snapshot/
│   │   │   └── page.tsx                # Snapshot feature
│   │   ├── timeline/
│   │   │   └── page.tsx                # Timeline view
│   │   ├── compare/
│   │   │   └── page.tsx                # Compare feature
│   │   └── api/
│   │       ├── analyze-sentiment/
│   │       │   └── route.ts            # AI sentiment API
│   │       └── waitlist/
│   │           └── route.ts            # Waitlist signup API
│   └── components/
│       ├── Analytics.tsx               # Analytics component
│       └── FloatingQuotes.tsx          # Animated quotes
├── .env.local                          # Environment variables
├── .github/
│   └── copilot-instructions.md         # Development notes
├── SPEC.md                             # This file
├── README.md                           # Project readme
├── package.json                        # Dependencies
├── tsconfig.json                       # TypeScript config
├── tailwind.config.ts                  # Tailwind config
├── next.config.ts                      # Next.js config
└── postcss.config.mjs                  # PostCSS config
```

---

## Data Models

### Entry
```typescript
interface Entry {
  id: number;              // Timestamp-based unique ID
  title: string;           // Entry title
  content: string;         // Entry content/body
  date: string;            // ISO date string
  mood?: number;           // 1-10 scale
  energy?: number;         // 1-10 scale
  stress?: number;         // 1-10 scale
  meaning?: number;        // 1-10 scale
  existentialDread?: number; // 1-10 scale
  connection?: number;     // 1-10 scale
  authenticity?: number;   // 1-10 scale
}
```

### Sentiment Analysis Response
```typescript
interface SentimentAnalysis {
  mood: number;            // 1-10
  energy: number;          // 1-10
  stress: number;          // 1-10
  meaning?: number;        // 1-10
  existentialDread?: number; // 1-10
  connection?: number;     // 1-10
  authenticity?: number;   // 1-10
  confidence: number;      // 0-1
  fallback?: boolean;      // True if AI unavailable
}
```

---

## API Endpoints

### POST `/api/analyze-sentiment`
Analyzes journal entry content using AI.

**Request:**
```json
{
  "content": "string (min 30 chars)"
}
```

**Response (Success):**
```json
{
  "mood": 7,
  "energy": 5,
  "stress": 6,
  "meaning": 8,
  "existentialDread": 3,
  "connection": 7,
  "authenticity": 6,
  "confidence": 0.85
}
```

**Response (Fallback):**
```json
{
  "fallback": true
}
```

### POST `/api/waitlist`
Adds email to waitlist.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Environment Variables

### Required
```bash
# .env.local
OPENAI_API_KEY=sk-...    # OpenAI API key for sentiment analysis
```

### Optional
- Analytics keys (if Analytics.tsx is configured)
- Email provider keys (for waitlist functionality)

---

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Add environment variables
cp .env.local.example .env.local
# Edit .env.local with your OpenAI API key

# Start dev server
npm run dev
```

### Build
```bash
# Production build
npm run build

# Start production server
npm start
```

### Cleaning Cache
```bash
# If you encounter build errors
rm -rf .next
npm run dev
```

---

## Storage Strategy

### Current: LocalStorage
- **Pros:** Simple, no backend needed, instant setup
- **Cons:** Limited to single browser, no sync, no backup

### Storage Schema
```javascript
localStorage.setItem('entries', JSON.stringify([
  { id: 1234567890, title: "...", content: "...", ... }
]))
```

### Future: Database Migration
Consider migrating to:
- **Supabase** - PostgreSQL with real-time features
- **MongoDB** - Flexible document storage
- **Firebase** - Real-time sync capabilities

---

## AI System Details

### Prompt Engineering
The AI is instructed to:
1. Analyze emotional tone and language
2. Consider negations and intensifiers
3. Evaluate narrative arc and themes
4. Detect implicit emotions beyond explicit words
5. Assess coping mechanisms and resilience
6. Return structured JSON with scores and confidence

### Rate Limiting
- Debounced analysis (waits for typing pause)
- Only analyzes entries >= 100 characters
- Graceful fallback to keyword system

### Cost Optimization
- Uses GPT-4o-mini (cheapest model)
- Low temperature (0.3) for consistency
- Max tokens limited to 100
- ~$0.15 per 1M tokens (~5,000 entries per $1)

---

## Styling Guidelines

### Color Palette
- **Primary:** Cyan-300 (`#67e8f9`)
- **Backgrounds:** Gray-900, Gray-800
- **Text:** Gray-100, Gray-200, Gray-300
- **Mood:** Blue-500 → Cyan-400
- **Energy:** Green-500 → Emerald-400
- **Stress:** Red-500 → Orange-400

### Button Styles
- Glassy appearance: `bg-white/5 backdrop-blur-xl`
- Borders: `border border-cyan-300/30`
- Hover: `hover:bg-cyan-300/20 hover:border-cyan-300/50`
- Scale: `hover:scale-105 active:scale-95`
- Shadows: `shadow-lg shadow-cyan-500/10 hover:shadow-cyan-500/30`
- Rounded: `rounded-2xl`

---

## Future Features / Roadmap

### Short-term (v0.2)
- [ ] Export entries (JSON/CSV)
- [ ] Search and filter entries
- [ ] Tags/categories system
- [ ] Dark/light mode toggle
- [ ] Entry editing capability
- [ ] Rich text editor

### Medium-term (v0.3)
- [ ] User accounts and authentication
- [ ] Cloud sync and backup
- [ ] Timeline visualization
- [ ] Compare snapshots feature
- [ ] Email reminders for journaling
- [ ] Mobile app (React Native)

### Long-term (v1.0)
- [ ] AI-powered insights and patterns
- [ ] Belief evolution tracking
- [ ] Community features (optional)
- [ ] Therapist/coach sharing (with consent)
- [ ] Voice-to-text journaling
- [ ] Mood trends and predictions

---

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading:** Components loaded on demand
2. **Image Optimization:** Next.js Image component
3. **Code Splitting:** Automatic with Next.js App Router
4. **Caching:** Leverage Next.js caching strategies
5. **Debouncing:** AI analysis triggered after typing pause

### Monitoring
- Consider adding analytics (Plausible, Vercel Analytics)
- Error tracking (Sentry)
- Performance monitoring (Web Vitals)

---

## Security & Privacy

### Current Approach
- **Client-side storage:** Data never leaves user's browser (except AI analysis)
- **AI processing:** Content sent to OpenAI but not stored
- **No user accounts:** No password management concerns
- **HTTPS only:** Production deployment requirement

### Best Practices
- Sanitize user input before rendering
- Use environment variables for sensitive keys
- Implement rate limiting on API routes
- Add CSP headers in production
- Consider end-to-end encryption for future cloud sync

---

## Testing Strategy

### Unit Tests (To Implement)
- Sentiment analysis keyword detection
- Date formatting utilities
- Entry CRUD operations

### Integration Tests (To Implement)
- AI API endpoint
- LocalStorage operations
- Navigation flows

### E2E Tests (To Implement)
- Complete user journey (write → save → view → delete)
- AI toggle functionality
- Entry detail view

---

## Deployment

### Recommended Platforms
- **Vercel** (Primary) - Optimized for Next.js
- **Netlify** - Good alternative
- **AWS Amplify** - Enterprise option

### Environment Setup
1. Connect GitHub repository
2. Add `OPENAI_API_KEY` to environment variables
3. Configure build command: `npm run build`
4. Set output directory: `.next`

### Custom Domain
- Configure DNS records
- Enable HTTPS (automatic on Vercel)
- Consider www redirect

---

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Review and update AI prompt for better accuracy
- [ ] Monitor OpenAI API costs
- [ ] Backup user data strategy
- [ ] Review analytics and user feedback

### Version Control
- Use semantic versioning (MAJOR.MINOR.PATCH)
- Maintain CHANGELOG.md
- Tag releases in GitHub

---

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components with hooks
- Prefer async/await over promises
- Comment complex logic

### Git Workflow
1. Create feature branch from `main`
2. Make changes with descriptive commits
3. Test thoroughly
4. Submit pull request
5. Code review before merge

### Commit Messages
```
feat: Add export to CSV functionality
fix: Resolve AI analysis timeout issue
docs: Update SPEC.md with new features
style: Update button hover animations
refactor: Simplify sentiment analysis logic
test: Add tests for entry CRUD operations
```

---

## License & Credits

**License:** MIT (or specify your license)

**Credits:**
- Next.js by Vercel
- OpenAI for GPT models
- Tailwind CSS for styling
- React team for the framework

---

## Support & Contact

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** your-email@example.com (update)
- **Twitter:** @yourhandle (update)

---

**Last Updated:** March 23, 2026  
**Document Version:** 1.0
