import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createList, updateList } from "../api";
import { toast } from "sonner";
import { ReadingList } from "../types";
import { cn } from "@/lib/utils";
import { useTheme, useThemeHelpers, useStudioLabels } from "@/features/theme/ThemeProvider";
import { ThemeVariant, getHeadingClasses } from "@/lib/theme-variants";
import { X } from "lucide-react";

interface ListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (list: ReadingList) => void;
  initialData?: ReadingList;
}

export function ListDialog({ open, onOpenChange, onSuccess, initialData }: ListDialogProps) {
  const { theme } = useTheme();
  const {
    isCyberCopy,
    isOctaneCopy,
    isTerminalCopy,
    isJournalCopy,
    isSakuraCopy,
    isTechieCopy,
    isRoninCopy,
    isMinimalCopy,
    isProfessionalCopy,
  } = useThemeHelpers();
  const { getLabel } = useStudioLabels();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isSystem, setIsSystem] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData && open) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setIsPrivate(initialData.isPrivate);
      setIsSystem(initialData.isSystem || false);
    } else if (open) {
      setName("");
      setDescription("");
      setIsPrivate(false);
      setIsSystem(false);
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    try {
      if (initialData) {
        const updated = await updateList(initialData._id, {
          name,
          description,
          isPrivate,
          isSystem,
        });
        toast.success("List updated successfully");
        onSuccess?.(updated);
      } else {
        const newList = await createList({
          name,
          description,
          isPrivate,
          isSystem,
        });
        toast.success("List created successfully");
        onSuccess?.(newList);
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error(initialData ? "Failed to update list" : "Failed to create list");
    } finally {
      setLoading(false);
    }
  };

  const isEdit = !!initialData;

  if (isTerminalCopy) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] gap-0 p-0 border border-accent bg-noir-bg shadow-[0_0_50px_rgba(var(--accent-rgb),0.2)] font-mono overflow-hidden">
          <div className="bg-accent text-noir-bg font-bold px-4 py-2 flex justify-between items-center">
            <span className="text-xs tracking-[0.2em]">{isEdit ? "MKDIR_EDIT" : "MKDIR_NEW"}</span>
            <button onClick={() => onOpenChange(false)} className="hover:bg-foreground/20 transition-colors p-1">
              <X size={14} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-accent/60 text-xs tracking-widest shrink-0 uppercase">
                  {getLabel("site_name_label")}
                </span>
                <input
                  autoFocus
                  placeholder={getLabel("list_name_placeholder")}
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-noir-bg border-b border-accent/40 text-accent focus:border-accent outline-none py-1 text-sm tracking-widest placeholder:text-accent/30"
                  maxLength={60}
                />
              </div>
              <div className="flex justify-end text-[10px] text-accent/20 font-mono">{name.length}/60</div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-accent/60 text-xs tracking-widest shrink-0 pt-1 uppercase">
                  {getLabel("site_description_label")}
                </span>
                <textarea
                  placeholder={getLabel("list_desc_placeholder")}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-noir-bg border border-accent/30 text-accent/80 focus:border-accent outline-none p-3 text-xs tracking-wider min-h-[80px] placeholder:text-accent/20 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setIsPrivate(!isPrivate)}
                className={cn(
                  "flex items-center justify-between border p-3 transition-colors text-[10px] tracking-[0.22em] font-bold uppercase",
                  isPrivate ? "border-accent bg-accent/10 text-accent" : "border-accent/20 text-accent/40",
                )}
              >
                [ {isPrivate ? "X" : " "} ] PRIVATE
              </button>
              <button
                onClick={() => setIsSystem(!isSystem)}
                className={cn(
                  "flex items-center justify-between border p-3 transition-colors text-[10px] tracking-[0.22em] font-bold uppercase",
                  isSystem ? "border-accent bg-accent/10 text-accent" : "border-accent/20 text-accent/40",
                )}
              >
                [ {isSystem ? "X" : " "} ] DEFAULT
              </button>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-accent/20">
              <button
                onClick={() => onOpenChange(false)}
                className="text-xs text-accent/50 hover:text-accent transition-colors tracking-widest"
              >
                [CANCEL]
              </button>
              <button
                onClick={handleSubmit}
                disabled={!name.trim() || loading}
                className={cn(
                  "px-8 py-2 font-bold text-xs tracking-[0.3em] transition-all",
                  !name.trim()
                    ? "bg-accent/20 text-noir-bg cursor-not-allowed"
                    : "bg-accent text-noir-bg hover:bg-foreground shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]",
                )}
              >
                {loading ? "EXECUTING..." : isEdit ? "UPDATE" : "CREATE"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "sm:max-w-[500px] gap-6 p-4 md:p-8 overflow-hidden",
          isSakuraCopy
            ? "rounded-3xl bg-noir-panel border-noir-border shadow-[0_20px_50px_rgba(var(--accent-rgb),0.2)]"
            : isTechieCopy
              ? "rounded-none border-accent bg-noir-bg shadow-[0_0_30px_rgba(var(--accent-rgb),0.1)]"
              : isRoninCopy
                ? "rounded-none border-accent/20 bg-noir-bg shadow-2xl"
                : isCyberCopy
                  ? "rounded-none border-accent bg-noir-bg shadow-[0_0_30px_rgba(var(--accent-rgb),0.2)]"
                  : isOctaneCopy
                    ? "rounded-none border-accent bg-noir-bg"
                    : isJournalCopy
                      ? "rounded-xl border-double border-4 border-accent/20 bg-noir-panel text-foreground shadow-xl"
                      : "rounded-3xl border-noir-border bg-noir-panel",
        )}
      >
        <button
          onClick={() => onOpenChange(false)}
          className={cn(
            "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none z-10",
            isTerminalCopy || isCyberCopy || isTechieCopy
              ? "text-accent"
              : "text-foreground-subtle hover:text-foreground",
          )}
        >
          <X size={24} />
          <span className="sr-only">Close</span>
        </button>
        {isJournalCopy && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply -z-10" />
        )}

        <DialogHeader>
          <DialogTitle
            className={cn(
              "font-black text-center",
              isRoninCopy ? "text-xl tracking-tight" : "text-3xl tracking-widest",
              isJournalCopy ? "capitalize" : "uppercase",
              getHeadingClasses(theme as ThemeVariant),
            )}
          >
            {isEdit ? getLabel("edit_list_title") : getLabel("create_list_title")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2 group">
            <label
              className={cn(
                "block font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
                isCyberCopy || isTechieCopy || isTerminalCopy
                  ? "text-accent/50 group-focus-within:text-accent"
                  : isRoninCopy
                    ? "tracking-widest text-foreground/40 font-bold group-focus-within:text-accent"
                    : isJournalCopy
                      ? "text-foreground-subtle group-focus-within:text-foreground font-serif italic tracking-wider bg-transparent"
                      : "text-foreground-subtle group-focus-within:text-foreground",
              )}
            >
              {getLabel("site_name_label")}
            </label>
            <Input
              placeholder={getLabel("list_name_placeholder")}
              value={name}
              onChange={e => setName(e.target.value)}
              className={cn(
                "h-12 text-lg transition-all bg-transparent px-4",
                "focus-visible:ring-0",
                isSakuraCopy || isTechieCopy || isRoninCopy || isCyberCopy || isOctaneCopy
                  ? "border border-noir-border focus:border-accent rounded-none shadow-inner"
                  : "border-x-0 border-t-0 border-b rounded-none border-foreground/20 focus-visible:border-foreground placeholder:text-foreground-subtle/50",
                isCyberCopy || isOctaneCopy || isTechieCopy
                  ? "text-accent font-mono placeholder:text-accent/40"
                  : isRoninCopy
                    ? "text-accent placeholder:text-accent/50 font-sans tracking-tight"
                    : isJournalCopy
                      ? "border-accent/30 text-foreground placeholder:text-foreground/40 font-serif normal-case italic px-2 focus:border-accent/60"
                      : "text-foreground",
              )}
              maxLength={60}
            />
            <div
              className={cn(
                "flex justify-end text-[10px] font-mono uppercase tracking-[0.2em]",
                isCyberCopy || isOctaneCopy || isTechieCopy
                  ? "text-accent/30"
                  : isJournalCopy
                    ? "text-foreground/40 font-serif italic"
                    : "text-foreground-subtle",
              )}
            >
              {name.length}/60
            </div>
          </div>

          <div className="space-y-2 group">
            <label
              className={cn(
                "block font-mono text-[10px] uppercase tracking-[0.3em] transition-colors",
                isCyberCopy || isTechieCopy || isTerminalCopy
                  ? "text-accent/50 group-focus-within:text-accent"
                  : isRoninCopy
                    ? "tracking-widest text-foreground/40 font-bold group-focus-within:text-accent"
                    : isJournalCopy
                      ? "text-foreground-subtle group-focus-within:text-foreground font-serif italic tracking-wider"
                      : "text-foreground-subtle group-focus-within:text-foreground",
              )}
            >
              {getLabel("site_description_label")}
            </label>
            <Textarea
              placeholder={getLabel("list_desc_placeholder")}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={cn(
                "resize-none transition-all bg-transparent px-4 min-h-[50px] text-base",
                "focus-visible:ring-0",
                isSakuraCopy || isTechieCopy || isRoninCopy || isCyberCopy || isOctaneCopy
                  ? "border border-noir-border focus:border-accent rounded-none shadow-inner"
                  : "border-x-0 border-t-0 border-b rounded-none border-foreground/20 focus-visible:border-foreground placeholder:text-foreground-subtle/50",
                isCyberCopy || isOctaneCopy || isTechieCopy
                  ? "text-accent font-mono placeholder:text-accent/40 text-sm"
                  : isRoninCopy
                    ? "text-accent placeholder:text-accent/50 font-sans tracking-tight"
                    : isJournalCopy
                      ? "border-accent/30 text-foreground placeholder:text-foreground/40 font-serif normal-case px-2 focus:border-accent/60"
                      : "text-foreground",
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="private"
                checked={isPrivate}
                onCheckedChange={checked => setIsPrivate(checked as boolean)}
                className={cn(
                  "rounded-sm",
                  isCyberCopy || isOctaneCopy || isTechieCopy
                    ? "border-accent text-noir-bg data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    : isJournalCopy
                      ? "border-accent/40 data-[state=checked]:bg-accent data-[state=checked]:border-accent text-noir-bg"
                      : isSakuraCopy
                        ? "border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        : "border-foreground/40 data-[state=checked]:bg-signal-green data-[state=checked]:border-signal-green",
                )}
              />
              <Label
                htmlFor="private"
                className={cn(
                  "font-normal text-sm cursor-pointer select-none uppercase tracking-widest",
                  isCyberCopy || isOctaneCopy || isTechieCopy
                    ? "font-mono text-accent text-xs"
                    : isJournalCopy
                      ? "font-serif text-foreground italic capitalize tracking-normal"
                      : "text-foreground-subtle hover:text-foreground transition-colors",
                )}
              >
                {getLabel("list_private_label")}
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Checkbox
                id="default"
                checked={isSystem}
                onCheckedChange={checked => setIsSystem(checked as boolean)}
                className={cn(
                  "rounded-sm",
                  isCyberCopy || isOctaneCopy || isTechieCopy
                    ? "border-accent text-noir-bg data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    : isJournalCopy
                      ? "border-accent/40 data-[state=checked]:bg-accent data-[state=checked]:border-accent text-noir-bg"
                      : isSakuraCopy
                        ? "border-accent data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        : "border-foreground/40 data-[state=checked]:bg-signal-green data-[state=checked]:border-signal-green",
                )}
              />
              <Label
                htmlFor="default"
                className={cn(
                  "font-normal text-sm cursor-pointer select-none uppercase tracking-widest",
                  isCyberCopy || isOctaneCopy || isTechieCopy
                    ? "font-mono text-accent text-xs"
                    : isJournalCopy
                      ? "font-serif text-foreground italic capitalize tracking-normal"
                      : "text-foreground-subtle hover:text-foreground transition-colors",
                )}
              >
                {getLabel("list_default_label")}
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center gap-4 pt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn(
              "px-8 h-12 font-mono text-[10px] uppercase tracking-[0.2em] transition-all",
              isCyberCopy || isOctaneCopy || isTechieCopy
                ? "rounded-none border-accent text-accent hover:bg-accent/5 bg-transparent"
                : isJournalCopy
                  ? "rounded-lg border-accent/20 text-foreground hover:bg-noir-panel font-serif hover:border-accent/40 bg-transparent tracking-normal capitalize italic text-base"
                  : isSakuraCopy || isMinimalCopy
                    ? "rounded-full border-noir-border text-foreground hover:bg-noir-panel"
                    : isProfessionalCopy
                      ? "rounded-md border-noir-border text-foreground hover:bg-foreground/5 bg-transparent"
                      : "rounded-full border-foreground/20 text-foreground hover:bg-foreground/5 bg-transparent",
            )}
          >
            {getLabel("retreat")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className={cn(
              "px-10 h-12 transition-all font-mono text-[10px] uppercase tracking-[0.2em] font-black",
              isCyberCopy || isOctaneCopy || isTechieCopy
                ? "rounded-none bg-accent text-noir-bg hover:bg-white " + (!name.trim() ? "opacity-50" : "")
                : isJournalCopy
                  ? "rounded-lg bg-accent text-noir-bg hover:bg-accent-secondary font-serif shadow-md hover:shadow-lg border border-transparent tracking-normal capitalize italic text-base"
                  : isSakuraCopy
                    ? "rounded-full bg-accent text-noir-bg hover:brightness-110 shadow-lg shadow-accent/20"
                    : isRoninCopy
                      ? "rounded-none bg-accent text-noir-bg border border-accent hover:bg-transparent hover:text-accent shadow-xl shadow-accent/10"
                      : isProfessionalCopy
                        ? "rounded-md " +
                          (!name.trim()
                            ? "bg-foreground/20 text-foreground/40 cursor-not-allowed"
                            : "bg-accent text-white hover:bg-accent-secondary")
                        : isMinimalCopy
                          ? "rounded-full " +
                            (!name.trim()
                              ? "bg-foreground/20 text-foreground/40 cursor-not-allowed"
                              : "bg-foreground text-noir-bg hover:bg-accent")
                          : !name.trim()
                            ? "rounded-full bg-foreground/10 text-foreground/40 cursor-not-allowed"
                            : "rounded-full bg-foreground text-noir-bg hover:bg-accent",
            )}
          >
            {loading ? getLabel("loading") : isEdit ? getLabel("save_changes") : getLabel("new_publication_btn")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
