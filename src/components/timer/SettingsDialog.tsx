"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore } from "@/store/useWorkspaceStore";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog({ open, onClose }: SettingsDialogProps) {
  const { studyDuration, restDuration, setStudyDuration, setRestDuration, resetTimer } =
    useWorkspaceStore();

  const [studyMins, setStudyMins] = useState(
    String(Math.round(studyDuration / 60))
  );
  const [restMins, setRestMins] = useState(
    String(Math.round(restDuration / 60))
  );

  const handleSave = () => {
    const studySecs = Math.max(1, parseInt(studyMins, 10) || 25) * 60;
    const restSecs = Math.max(1, parseInt(restMins, 10) || 5) * 60;
    setStudyDuration(studySecs);
    setRestDuration(restSecs);
    resetTimer();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="settings-dialog">
        <DialogHeader>
          <DialogTitle className="settings-title">Timer Settings</DialogTitle>
        </DialogHeader>

        <div className="settings-body">
          <div className="settings-field">
            <label htmlFor="study-mins" className="settings-label">
              Focus Duration (minutes)
            </label>
            <Input
              id="study-mins"
              type="number"
              min={1}
              max={120}
              value={studyMins}
              onChange={(e) => setStudyMins(e.target.value)}
              className="settings-input"
            />
          </div>

          <div className="settings-field">
            <label htmlFor="rest-mins" className="settings-label">
              Break Duration (minutes)
            </label>
            <Input
              id="rest-mins"
              type="number"
              min={1}
              max={60}
              value={restMins}
              onChange={(e) => setRestMins(e.target.value)}
              className="settings-input"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="btn-ghost">
            Cancel
          </Button>
          <Button onClick={handleSave} className="btn-primary" id="settings-save-btn">
            Save &amp; Reset
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
