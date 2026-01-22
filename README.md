# Aruform - Existential Journaling App

A Next.js web application for existential journaling, designed to help you explore fundamental questions about meaning, purpose, and existence.

## Features

- **Reflective Writing Interface**: Clean, distraction-free space for deep contemplation
- **Journal Entry Management**: Save, view, and organize your existential reflections
- **Responsive Design**: Beautiful interface that works on all devices
- **Dark Mode Support**: Comfortable writing in any lighting condition
- **Local Storage**: Your entries are stored privately in your browser

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn

### Installation

1. Clone this repository (or the directory is already set up)
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
aruform/
├── src/
│   └── app/
│       ├── page.tsx          # Landing page
│       ├── write/
│       │   └── page.tsx      # Writing interface
│       ├── entries/
│       │   └── page.tsx      # View past entries
│       ├── layout.tsx         # Root layout
│       └── globals.css        # Global styles
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Browser LocalStorage (client-side only)

## Usage

1. **Home Page**: Introduction to existential journaling
2. **Write**: Create new journal entries with optional titles
3. **Entries**: View and manage all your past reflections

## Future Enhancements

- Database integration for persistent storage
- User authentication
- Entry search and filtering
- Tags and categories
- Export functionality
- Prompts for existential reflection
- Mood tracking

## Contributing

This is a personal project, but suggestions and feedback are welcome.

## License

MIT

---

Built with reflection, for reflection.
