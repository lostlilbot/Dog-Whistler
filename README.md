# 🐕 Dog Whistle

> An adjustable ultrasonic dog whistle built with **Next.js 16** and the **Web Audio API**. No sound files required — everything is synthesized in real-time in the browser.

![Dog Whistle](https://img.shields.io/badge/Dog%20Whistle-1.0.0-green?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8?style=flat-square&logo=tailwindcss)

---

## 📋 Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Build](#build)
- [Usage](#usage)
  - [Quick Start](#quick-start)
  - [Frequency Guide](#frequency-guide)
  - [Patterns Explained](#patterns-explained)
  - [Tips for Training](#tips-for-training)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Known Limitations](#known-limitations)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

- 🎵 **Adjustable Frequency** — Smooth slider from 400 Hz to 25,000 Hz covering the full range of canine hearing
- 🔊 **Volume Control** — Fine-grained 0–100% volume with real-time audio updates
- ⚡ **6 Preset Frequencies** — Quick-select common training frequencies (Low, Mid, High, Very High, Training Basic, Training Advanced)
- 🔄 **4 Whistle Patterns** — Continuous tone, Pulse, Sweep (frequency scan), and Double Pulse
- 🧠 **Web Audio API** — Pure client-side audio synthesis; no audio files, no server, no external dependencies for sound
- 🌙 **Dark UI** — Beautiful dark-themed interface with gradient sliders and responsive Tailwind CSS design
- ✅ **Type-Safe** — Full TypeScript with strict mode, passing `tsc --noEmit` with zero errors
- 📱 **Responsive** — Works on desktop and mobile browsers

---

## Demo

> **Note**: Live audio requires a real browser with Web Audio API support. The demo cannot be rendered in sandboxed environments.

To run locally:

```bash
bun install
bun dev
# Open http://localhost:3000
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 16.1.3 | React framework with App Router |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.9.3 | Static type checking |
| **Tailwind CSS** | 4.1.17 | Utility-first styling |
| **PostCSS** | — | CSS processing pipeline |
| **Web Audio API** | Native | Audio synthesis in the browser |
| **ESLint** | 9.39.1 | Code linting |

---

## Getting Started

### Prerequisites

- **Node.js** 18.0 or higher
- **Bun** package manager (recommended) or npm
- A modern browser with Web Audio API support:
  - ✅ Google Chrome 60+
  - ✅ Microsoft Edge 79+
  - ✅ Mozilla Firefox 53+
  - ✅ Safari 14.1+

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/dog-whistle.git
cd dog-whistle

# Install dependencies (Bun recommended)
bun install

# Or with npm
npm install
```

### Development Server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

The page supports **Fast Refresh** — edits to `src/app/page.tsx` and other components will update instantly.

### Build for Production

```bash
bun run build
# or
npm run build
```

This creates an optimized build in `.next/`.

### Type Checking

```bash
bun typecheck
# or
npm run typecheck
```

Runs TypeScript compiler in check-only mode. Expected result: **0 errors**.

### Linting

```bash
bun lint
# or
npm run lint
```

Runs ESLint across all source files. Expected result: **0 errors**.

---

## Usage

### Quick Start

1. **Open the app** in Chrome, Edge, or Firefox
2. **Click "🎵 Start Whistle"** — your browser will request permission to play audio. **Allow it.**
3. **Adjust the frequency slider** to find the frequency your dog responds to
4. **Select a preset** from the dropdown for quick access to common frequencies
5. **Choose a pattern** — Continuous keeps a steady tone; Pulse and Double Pulse create intermittent bursts; Sweep cycles through frequencies
6. **Adjust volume** as needed
7. **Click "⏹ Stop Whistle"** when finished

### Frequency Guide

Dogs can hear approximately **40 Hz to 60,000 Hz**, with peak sensitivity between **8,000 Hz and 16,000 Hz**. Use this table as a starting point:

| Preset | Frequency | Use Case |
|---|---|---|
| 🔉 Low | 8,000 Hz | Long-range recall; penetrates background noise |
| 🔊 Mid | 12,000 Hz | General training; attention-getting |
| 🔊🔊 High | 18,000 Hz | Close-range commands; higher urgency |
| 🔊🔊🔊 Very High | 22,000 Hz | Noisy/distracting environments |
| 🐾 Training Basic | 5,000 Hz | Puppies; dogs with sensitive hearing |
| 🐾 Training Advanced | 15,000 Hz | Advanced obedience and agility training |
| ⚙️ Custom | 400–25,000 Hz | Full manual control for experimentation |

> **⚠️ Important**: Every dog is different. Start at the **Mid** preset (12,000 Hz) with **low volume** (10–20%) and adjust based on your dog's response. Never blow the whistle directly into any living being's ears.

### Patterns Explained

- **Continuous** — A steady, unbroken tone. Best for sustained commands like "come" or "stay."
- **Pulse** — Short bursts of sound (~300ms on, ~400ms off). Useful for attention-getting and recall commands.
- **Sweep** — Frequency rises from 400 Hz to 25 kHz and back in a continuous cycle. Can grab attention across different hearing ranges.
- **Double Pulse** — Two quick bursts with a short pause between them. Effective for more urgent commands.

### Tips for Training

1. **Start indoors** in a quiet environment to test your dog's response
2. **Pair the whistle with treats** — blow the whistle, then immediately reward your dog for looking at you
3. **Be consistent** — always use the same frequency and pattern for the same command
4. **Keep sessions short** — 5–10 minutes maximum to avoid habituation
5. **Increase distance gradually** — start close, then increase range as your dog learns

---

## Project Structure

```
dog-whistle/
├── src/
│   └── app/
│       ├── page.tsx             # Main application component
│       │                        #   - Web Audio API oscillator & gain nodes
│       │                        #   - Frequency slider with live updates
│       │                        #   - Volume control
│       │                        #   - Preset frequency selector
│       │                        #   - Pattern engine (continuous, pulse, sweep, double-pulse)
│       │                        #   - ARIA accessibility attributes
│       ├── layout.tsx           # Root layout with metadata and fonts
│       ├── globals.css          # Global styles (Tailwind + custom CSS)
│       └── favicon.ico          # Site favicon
├── vercel.json                  # Vercel deployment configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript compiler options
├── postcss.config.mjs           # PostCSS configuration (Tailwind)
├── eslint.config.mjs            # ESLint rules
├── package.json                 # Dependencies and scripts
├── README.md                    # This file
├── bun.lock                     # Bun lock file (deterministic installs)
├── .gitignore                   # Ignored files and directories
├── AGENTS.md                    # Agent development rules
└── .kilocode/                   # Kilo IDE configuration
```

### Key Implementation Details

**`src/app/page.tsx`** is the heart of the application. Here's a breakdown of its architecture:

- **Audio Engine**: Uses the Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`) for real-time sound synthesis. No audio files are loaded — the sound is generated entirely in the browser.

- **Reactive Controls**: All slider and selector changes immediately update the audio parameters using `setValueAtTime` and `setTargetAtTime` for smooth transitions without audio glitches.

- **Pattern Engine**: Uses `setInterval` and `setTimeout` to create rhythmic patterns (pulse, sweep, double-pulse). Each pattern modifies the `GainNode` amplitude envelope or the `OscillatorNode` frequency.

- **Memory Management**: The `stopAudio` function properly stops oscillators, disconnects nodes, cancels scheduled values, and sets gain to zero to prevent audio artifacts or memory leaks.

- **Type Safety**: All Web Audio API types are explicitly typed (`AudioContext`, `OscillatorNode`, `GainNode`), and custom types enforce valid pattern values.

---

## Configuration

### Vercel Deployment (`vercel.json`)

```json
{
  "buildCommand": "bun run build",
  "outputDirectory": ".next",
  "installCommand": "bun install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

This configuration tells Vercel to:
1. Install dependencies with Bun
2. Build the project using `next build`
3. Serve from the `.next` output directory
4. Deploy to the US East (Virginia) region

### Tailwind CSS (`src/app/globals.css`)

```css
@import "tailwindcss";
```

Tailwind CSS 4 is imported directly. Custom range input styles are applied inline via Tailwind's `appearance-none` utility class to ensure cross-browser consistency.

---

## Browser Support

| Browser | Minimum Version | Status |
|---|---|---|
| Google Chrome | 60 | ✅ Supported |
| Microsoft Edge | 79 | ✅ Supported |
| Mozilla Firefox | 53 | ✅ Supported |
| Apple Safari | 14.1 | ✅ Supported |
| Opera | 47 | ✅ Supported (uses Chrome engine) |
| Internet Explorer | — | ❌ Not supported |
| Samsung Internet | 8.0 | ✅ Supported |

The app uses standard Web Audio API features that are well-supported across modern browsers. The `AudioContext` constructor is the only API that may require a browser prefix in older versions.

---

## Known Limitations

- **Mobile Autoplay**: Some mobile browsers restrict autoplay of audio. The user must interact with the page (tap the "Start Whistle" button) first.
- **Hardware Limitations**: Some speakers and headphones cannot reproduce the highest frequencies (above ~16 kHz). Use external speakers or high-quality headphones for best results.
- **Browser Variance**: Audio quality and latency may vary between browsers. Chrome generally provides the best Web Audio API performance.
- **No Settings Persistence**: Current settings are not saved between sessions. Refreshing the page resets to defaults. This is by design for privacy.
- **Single Oscillator**: Only one oscillator plays at a time. Closing the tab or navigating away stops the sound.

---

## Deployment

### Vercel (Recommended)

Connect this repository to [Vercel](https://vercel.com) for automatic deployments:

1. Push this repo to GitHub
2. Sign in to [Vercel](https://vercel.com) and click "Import Project"
3. Select the `dog-whistle` repository
4. Vercel will detect the Next.js framework and deploy automatically
5. Each push to `main` triggers a new deployment

The `vercel.json` file configures Vercel to use Bun for dependency installation and Next.js build.

### Manual Deployment

```bash
# Build the project
bun run build

# Preview locally before deploying
bun run start
```

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- **Netlify**: Supports Next.js out of the box
- **Cloudflare Pages**: Use `wrangler` CLI for deployment
- **Railway**: Import from GitHub for automatic deployment
- **Docker**: Build with `bun run build` and serve with a Node.js server

---

## Contributing

Contributions are welcome! Here's how to help:

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. Create a **feature branch**: `git checkout -b feature/your-feature-name`
4. **Make your changes** and ensure `bun typecheck` and `bun lint` pass
5. **Commit** with a descriptive message following [Conventional Commits](https://www.conventionalcommits.org/)
6. **Push** to your fork and **open a Pull Request**

### Code Style

- Use **TypeScript strict mode** — no `any` unless absolutely necessary
- Follow **Tailwind CSS** utility classes; avoid custom CSS when possible
- Use **callback refs** and `useCallback` for stable references
- Handle **edge cases** — e.g., audio context may be suspended or already closed
- Add **JSDoc comments** for complex functions

### Reporting Issues

Open an [Issue](https://github.com/<your-username>/dog-whistle/issues) with:
- Description of the bug or feature request
- Steps to reproduce (if applicable)
- Screenshots or logs (if applicable)

---

## License

This project is open source and available under the **[MIT License](LICENSE)**. Feel free to use, modify, and distribute it.

---

## Acknowledgments

- [Next.js](https://nextjs.org/) — React framework
- [Tailwind CSS](https://tailwindcss.com/) — CSS utility framework
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) — Browser audio synthesis
- [Twemoji](https://twemoji.twitter.com/) — Open-source emoji artwork used in the header

---

## Author

**Dog Whistle** — Built for dog training enthusiasts who want a precise, tunable, and free digital dog whistle. 🐕

---

*Last updated: May 2026*