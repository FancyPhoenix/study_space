"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WindowCategory = "study" | "entertainment" | "both";
export type TimerPhase = "study" | "rest";

export interface WindowData {
  id: string;
  title: string;
  url: string;
  category: WindowCategory;
  x: number;
  y: number;
  width: number;
  height: number;
  manuallyVisible?: boolean;
  zIndex: number;
}

interface WorkspaceStore {
  // Timer state
  currentPhase: TimerPhase;
  studyDuration: number; // in seconds
  restDuration: number; // in seconds
  isRunning: boolean;
  phaseStartTimestamp: number | null; // Date.now() when phase started
  remainingOnPause: number | null; // seconds remaining when paused

  // Windows
  windows: WindowData[];
  maxZIndex: number;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  setStudyDuration: (seconds: number) => void;
  setRestDuration: (seconds: number) => void;
  advancePhase: () => void;
  getRemainingSeconds: () => number;

  // Window actions
  addWindow: (data: Omit<WindowData, "id" | "zIndex">) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<WindowData>) => void;
  bringToFront: (id: string) => void;
  setManuallyVisible: (id: string, visible: boolean) => void;
  clearWindows: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set, get) => ({
      currentPhase: "study",
      studyDuration: 25 * 60,
      restDuration: 5 * 60,
      isRunning: false,
      phaseStartTimestamp: null,
      remainingOnPause: null,
      windows: [],
      maxZIndex: 100,

      getRemainingSeconds: () => {
        const state = get();
        const phaseDuration =
          state.currentPhase === "study"
            ? state.studyDuration
            : state.restDuration;

        if (!state.isRunning) {
          return state.remainingOnPause ?? phaseDuration;
        }

        if (state.phaseStartTimestamp === null) {
          return phaseDuration;
        }

        const elapsed = (Date.now() - state.phaseStartTimestamp) / 1000;
        const remaining = (state.remainingOnPause ?? phaseDuration) - elapsed;
        return Math.max(0, remaining);
      },

      startTimer: () => {
        const state = get();
        if (state.isRunning) return;
        set({
          isRunning: true,
          phaseStartTimestamp: Date.now(),
        });
      },

      pauseTimer: () => {
        const state = get();
        if (!state.isRunning) return;
        const remaining = state.getRemainingSeconds();
        set({
          isRunning: false,
          phaseStartTimestamp: null,
          remainingOnPause: remaining,
        });
      },

      resetTimer: () => {
        const state = get();
        const phaseDuration =
          state.currentPhase === "study"
            ? state.studyDuration
            : state.restDuration;
        set({
          isRunning: false,
          phaseStartTimestamp: null,
          remainingOnPause: phaseDuration,
        });
      },

      advancePhase: () => {
        set((state) => {
          const nextPhase: TimerPhase =
            state.currentPhase === "study" ? "rest" : "study";
          const nextDuration =
            nextPhase === "study" ? state.studyDuration : state.restDuration;
          // Clear manuallyVisible overrides on phase change
          const updatedWindows = state.windows.map((w) => ({
            ...w,
            manuallyVisible: undefined,
          }));
          return {
            currentPhase: nextPhase,
            isRunning: true,
            phaseStartTimestamp: Date.now(),
            remainingOnPause: nextDuration,
            windows: updatedWindows,
          };
        });
      },

      setStudyDuration: (seconds: number) => {
        set({ studyDuration: seconds, remainingOnPause: null });
      },

      setRestDuration: (seconds: number) => {
        set({ restDuration: seconds });
      },

      addWindow: (data) => {
        const { maxZIndex } = get();
        const newZ = maxZIndex + 1;
        const newWindow: WindowData = {
          ...data,
          id: `win-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          zIndex: newZ,
        };
        set((state) => ({
          windows: [...state.windows, newWindow],
          maxZIndex: newZ,
        }));
      },

      removeWindow: (id) => {
        set((state) => ({
          windows: state.windows.filter((w) => w.id !== id),
        }));
      },

      updateWindow: (id, updates) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));
      },

      bringToFront: (id) => {
        const { maxZIndex } = get();
        const newZ = maxZIndex + 1;
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, zIndex: newZ } : w
          ),
          maxZIndex: newZ,
        }));
      },

      setManuallyVisible: (id, visible) => {
        set((state) => ({
          windows: state.windows.map((w) =>
            w.id === id ? { ...w, manuallyVisible: visible } : w
          ),
        }));
      },

      clearWindows: () => {
        set({ windows: [] });
      },
    }),
    {
      name: "focusos-workspace",
      partialize: (state) => ({
        studyDuration: state.studyDuration,
        restDuration: state.restDuration,
        windows: state.windows,
        currentPhase: state.currentPhase,
      }),
    }
  )
);
