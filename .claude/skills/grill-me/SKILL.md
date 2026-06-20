---
name: grill-me
description: Use when the user asks to build a new feature, refactor code, or asks you to "grill me". Forces the AI to interview the user about edge cases, state, and architecture BEFORE writing any code.
---

# The "Grill Me" Workflow

When invoked, you are strictly forbidden from writing application code immediately. Your goal is to eliminate ambiguity and build a shared understanding with the user.

## Phase 1: The Interrogation
Do not write code. Ask the user 3 piercing, highly technical questions about their request. Focus strictly on:
1. **State Management & Data Flow:** How does this affect the global state or Zustand store?
2. **Edge Cases & Failure Modes:** What happens when data is missing, offline, or user interactions overlap (e.g., drag and drop freezing)?
3. **UI/UX Constraints:** How does this fit into the existing layout and component boundaries?

*Wait for the user to answer these questions.*

## Phase 2: The Alignment
Once the user answers, summarize the agreed-upon technical approach into a bulleted architectural plan. Include which files will be created or modified.

## Phase 3: Execution
Only after the user explicitly approves the Phase 2 plan may you begin generating the actual code files. Make surgical changes, prioritizing small, deliberate steps.