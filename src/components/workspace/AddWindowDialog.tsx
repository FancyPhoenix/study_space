"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspaceStore, WindowCategory } from "@/store/useWorkspaceStore";
import { normalizeUrl, deriveTitleFromUrl } from "@/lib/utils";

interface AddWindowDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddWindowDialog({ open, onClose }: AddWindowDialogProps) {
  const { addWindow } = useWorkspaceStore();
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<WindowCategory>("study");
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!url.trim()) {
      setError("Please enter a URL.");
      return;
    }
    let fullUrl = url.trim();
    if (!/^https?:\/\//i.test(fullUrl)) {
      fullUrl = "https://" + fullUrl;
    }
    const normalized = normalizeUrl(fullUrl);
    addWindow({
      url: normalized,
      title: deriveTitleFromUrl(normalized),
      category,
      x: 80 + Math.random() * 120,
      y: 80 + Math.random() * 60,
      width: 760,
      height: 520,
    });
    setUrl("");
    setCategory("study");
    setError("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="settings-dialog">
        <DialogHeader>
          <DialogTitle className="settings-title">Add New Window</DialogTitle>
        </DialogHeader>

        <div className="settings-body">
          <div className="settings-field">
            <label htmlFor="window-url" className="settings-label">
              URL
            </label>
            <Input
              id="window-url"
              type="url"
              placeholder="https://example.com or youtube.com/watch?v=..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              className="settings-input"
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          <div className="settings-field">
            <label htmlFor="window-category" className="settings-label">
              Category
            </label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as WindowCategory)}
            >
              <SelectTrigger id="window-category" className="settings-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="select-content">
                <SelectItem value="study">🎯 Study — visible during focus</SelectItem>
                <SelectItem value="entertainment">
                  🎬 Entertainment — visible during break
                </SelectItem>
                <SelectItem value="both">👁 Both — always visible</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="btn-ghost">
            Cancel
          </Button>
          <Button onClick={handleAdd} className="btn-primary" id="add-window-btn">
            Open Window
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
