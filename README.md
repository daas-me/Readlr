
# Readlr - Interactive Reading Learning Platform

Readlr is an interactive web-based learning platform designed to help young learners develop reading skills through engaging games, interactive components, and personalized learning paths. Built with modern web technologies, it provides a gamified learning experience with visual progress tracking, achievements, and character companions.

## Features

- **Profile Setup** - Learners create personalized profiles with custom avatars and names
- **Level Progression** - Structured learning levels with visual level maps and progress dashboards
- **Phoneme Bank** - Comprehensive phoneme learning and practice system
- **Story Scenes** - Interactive story-based learning content
- **Games & Challenges** - Gamified learning activities with difficulty levels
- **Achievements & Stickers** - Reward system with achievements and sticker collections
- **Character Companions** - Personalized learning buddies to guide the learning journey
- **Teacher Dashboard** - Tools for educators to track and manage learner progress
- **Fluency Tracking** - Visual heatmaps showing fluency progression
- **Session Summaries** - Detailed feedback after each learning session
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme Support** - Customizable theme options via next-themes

## Technology Stack

**Frontend:**
- React 18.3.1 with TypeScript
- Vite 6.3.5 (build tool)
- Tailwind CSS 4.1.12 (styling)
- shadcn/ui (accessible component library based on Radix UI)

**UI & Components:**
- Material UI icons and components
- Lucide React (icon library)
- Motion (animations)
- React Hook Form (form handling)

**Data Visualization:**
- Recharts (charts and graphs)
- Mermaid (diagrams)
- Canvas Confetti (effects)

**Interactions:**
- React Router 7.13.0 (routing)
- React DnD (drag and drop)
- Embla Carousel (carousels)
- react-resizable-panels (layout panels)

**Utilities:**
- date-fns (date manipulation)
- Sonner (toast notifications)
- class-variance-authority (component variants)

**Package Manager:**
- pnpm (monorepo support via pnpm-workspace.yaml)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
npm install
```

Or with pnpm:
```bash
pnpm install
```

### Development

Start the development server:

```bash
npm run dev
```

Or with pnpm:
```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

Or with pnpm:
```bash
pnpm build
```

## Project Structure

```
src/
├── main.tsx              # Entry point
├── app/
│   ├── App.tsx          # Main application component
│   └── components/      # All React components
│       ├── LearnerProfile.tsx
│       ├── LevelMap.tsx
│       ├── PhonemeBank.tsx
│       ├── ProgressDashboard.tsx
│       ├── TeacherDashboard.tsx
│       ├── Achievements.tsx
│       ├── StoryScene.tsx
│       ├── GameLevel.tsx
│       ├── SessionSummary.tsx
│       ├── WelcomeScreen.tsx
│       └── ui/          # shadcn/ui components
├── styles/              # Global styles and theme
└── imports/             # Project assets and documentation

```

## Key Components

- **LearnerProfile** - Initial setup screen for learner customization
- **WelcomeScreen** - Landing page for new users
- **LevelMap** - Visual representation of learning levels and progress
- **PhonemeBank** - Phoneme learning and practice interface
- **ProgressDashboard** - Dashboard showing learner progress and analytics
- **TeacherDashboard** - Administrative dashboard for educators
- **GameLevel** - Interactive game components for learning
- **StoryScene** - Story-based learning content
- **SessionSummary** - Post-session feedback and statistics
- **Achievements** - Achievement and reward system
- **Settings** - User and application settings

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Guidelines for contributing are available in `guidelines/Guidelines.md`

## License

See LICENSE file for details.

## Prototype & Design

The prototype and design specifications are available in:
- `PROTOTYPE_GUIDE.md` - Prototype documentation
- `UI_IMPROVEMENTS.md` - UI enhancement guidelines
- Original Figma design: https://www.figma.com/design/UzOHZ5B43uJwJXRwHTRAK2/Visualize-Capstone-Project

## Acknowledgments

See `ATTRIBUTIONS.md` for third-party libraries and attributions.
  