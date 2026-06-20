# CLAUDE.md

## Project: FocusOS

### Overview

FocusOS is a single-tab web application that combines a dynamic Pomodoro timer with a desktop-style multitasking workspace.

Users can add websites as draggable and resizable windows (iframes) and automatically control their visibility based on the current Pomodoro phase.

The goal is to create an all-in-one productivity environment that keeps study resources visible during focus sessions and entertainment resources visible during breaks.

---

## Technology Stack

### Core

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand
* react-rnd
* lucide-react

### Deployment

* Vercel

### Version Control

* Git
* GitHub

---

## Core Features

### 1. Dynamic Pomodoro Timer

Requirements:

* Automatic transitions between Study and Rest phases
* No user interaction required when a phase ends
* User-configurable Study duration
* User-configurable Rest duration
* Persist timer settings
* Clearly display:

  * Current phase
  * Remaining time
  * Running/paused state

### Timer Accuracy Requirements

Do NOT rely solely on `setInterval()` countdowns.

Browsers throttle timers in background tabs.

Instead:

* Store timestamps
* Calculate elapsed time using `Date.now()`
* Derive remaining time from timestamp differences
* Ensure timer remains accurate even when the tab is inactive

---

### 2. Desktop Workspace

Users can create floating windows by entering a URL.

Each window contains an iframe.

Requirements:

* Draggable
* Resizable
* Desktop-style behavior
* Multiple windows open simultaneously
* Preserve iframe state whenever possible

Recommended library:

* react-rnd

---

### 3. Window Categories

Every window must belong to one of three categories:

#### Study

Visible only during Study phase.

Behavior:

* Visible during Study
* Hidden during Rest

#### Entertainment

Visible only during Rest phase.

Behavior:

* Visible during Rest
* Hidden during Study

#### Both

Always visible.

Behavior:

* Visible during Study
* Visible during Rest

---

### 4. Automatic Visibility System

Window visibility should be computed from:

```ts
window.category
globalTimer.currentPhase
```

Do NOT unmount windows when hidden.

Instead use CSS-based visibility:

```css
opacity: 0;
pointer-events: none;
```

Benefits:

* Smooth transitions
* Prevent iframe reloads
* Preserve user state

Example:

```tsx
const isVisible =
  window.category === "both" ||
  (window.category === "study" &&
    currentPhase === "study") ||
  (window.category === "entertainment" &&
    currentPhase === "rest");
```

Use transitions:

```css
transition: opacity 300ms ease;
```

---

### 5. Tab Manager / Dock

A dock button should exist near timer controls.

Purpose:

* View all windows
* Open hidden windows
* Close windows
* Temporarily override visibility rules

Example:

A user can briefly check a hidden entertainment tab during study time without permanently changing its category.

---

## State Management

### Preferred Solution

Use Zustand.

Global state should contain:

```ts
interface WorkspaceStore {
  currentPhase: "study" | "rest";

  studyDuration: number;
  restDuration: number;

  isRunning: boolean;

  windows: WindowData[];

  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;

  addWindow: () => void;
  removeWindow: () => void;
  updateWindow: () => void;
}
```

---

## Data Models

### WindowData

```ts
type WindowCategory =
  | "study"
  | "entertainment"
  | "both";

interface WindowData {
  id: string;

  title: string;

  url: string;

  category: WindowCategory;

  x: number;
  y: number;

  width: number;
  height: number;

  manuallyVisible?: boolean;
}
```

---

## Recommended Project Structure

```text
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   │
│   ├── timer/
│   │   ├── PomodoroDisplay.tsx
│   │   ├── TimerControls.tsx
│   │   └── SettingsDialog.tsx
│   │
│   └── workspace/
│       ├── DesktopArea.tsx
│       ├── IframeWindow.tsx
│       └── TabDock.tsx
│
├── store/
│   └── useWorkspaceStore.ts
│
├── lib/
│   └── utils.ts
```

---

## UI Guidelines

### Use shadcn/ui Components

Use shadcn/ui equivalents whenever possible:

* Button
* Dialog
* Input
* Select
* Dropdown Menu
* Sheet
* Tooltip
* Card

Avoid building custom replacements unless necessary.

---

### UX Expectations

Provide:

* Smooth animations
* Clean workspace layout
* Minimal distractions
* Fast interactions

Use Tailwind transitions throughout the interface.

---

## Iframe Constraints

Many websites block iframe embedding through:

* X-Frame-Options
* CSP frame-ancestors restrictions

Examples:

* Google
* Most Google services
* Standard YouTube URLs

### Required Handling

Detect failures and show a friendly fallback UI.

Example message:

> This website cannot be embedded because it blocks iframe access through browser security policies.

---

## YouTube URL Handling

Automatically convert standard YouTube links into embed links.

Example:

Input:

```text
https://www.youtube.com/watch?v=abc123
```

Convert to:

```text
https://www.youtube.com/embed/abc123
```

This should occur automatically before saving the URL.

---

## Client Components

Because the application depends heavily on:

* Intervals
* Window events
* Dragging
* Local UI interactions

Most files inside:

```text
components/timer/
components/workspace/
```

should include:

```tsx
"use client";
```

---

## Performance Goals

* Prevent unnecessary rerenders
* Preserve iframe state
* Avoid iframe remounting
* Keep timer accurate in background tabs
* Support multiple simultaneous windows smoothly

---

## Setup Commands

```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir

cd my-app

npx shadcn-ui@latest init

npm install react-rnd zustand lucide-react
```

Assume these dependencies are already installed when generating code.

---

## Coding Rules for AI Assistants

When generating code for this repository:

1. Use TypeScript strictly.
2. Prefer Zustand over Context for global state.
3. Use App Router conventions.
4. Use shadcn/ui components for UI.
5. Use react-rnd for draggable/resizable windows.
6. Do not unmount hidden iframe windows.
7. Use CSS transitions for visibility changes.
8. Keep timer calculations timestamp-based.
9. Include `"use client"` where required.
10. Prioritize maintainability and component separation.
11. Follow the project structure defined above.
12. Produce production-quality code rather than prototypes.
13. Take inspiration for ui from "https://pomofocus.io/" pomodoro