import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

export const metadata: Metadata = {
  title: "FocusOS — Study in One Tab",
  description:
    "A single-tab productivity workspace with Pomodoro timer, draggable iframe windows, and automatic focus/break switching.",
  keywords: ["pomodoro", "study", "focus", "productivity", "workspace"],
  openGraph: {
    title: "FocusOS — Study in One Tab",
    description: "Your all-in-one productivity workspace.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
