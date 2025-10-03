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
import { useThemeHelpers } from "@/features/theme/ThemeProvider";
import { X } from "lucide-react";

interface ListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (list: ReadingList) => void;
  initialData?: ReadingList;
}

export function ListDialog({ open, onOpenChange, onSuccess, initialData }: ListDialogProps) {
  const { isCyberCopy, isOctaneCopy, isTerminalCopy, isJournalCopy } = useThemeHelpers()
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
        <DialogContent className="sm:max-w-[600px] gap-0 p-0 border border-accent bg-black shadow-[0_0_50px_rgba(34,197,94,0.1)] font-mono overflow-hidden">
          <div className="bg-accent text-black font-bold px-4 py-2 flex justify-between items-center">
            <span className="text-xs tracking-[0.2em]">{isEdit ? "MKDIR_EDIT" : "MKDIR_NEW"}</span>
            <button onClick={() => onOpenChange(false)} className="hover:bg-white/20 transition-colors p-1">
              <X size={14} />
            </button>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-accent/50 text-xs tracking-widest shrink-0">NAME:</span>
                <input
                  autoFocus
                  placeholder="collection_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border-b border-accent/30 text-accent focus:border-accent outline-none py-1 text-sm tracking-widest placeholder:text-accent/20"
                  maxLength={60}
                />
              </div>
              <div className="flex justify-end text-[10px] text-accent/30">
                {name.length}/60
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="text-accent/50 text-xs tracking-widest shrink-0 pt-1">DESC:</span>
                <textarea
                  placeholder="optional_description_metadata"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black border border-accent/20 text-accent/80 focus:border-accent outline-none p-3 text-xs tracking-wider min-h-[80px] placeholder:text-accent/10 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsPrivate(!isPrivate)}
                className={cn(
                  "flex items-center justify-between border p-3 transition-colors text-[10px] tracking-[0.22em] font-bold uppercase",
                  isPrivate ? "border-accent bg-accent/10 text-accent" : "border-accent/20 text-accent/40"
                )}
              >
                [ {isPrivate ? "X" : " "} ] PRIVATE
              </button>
              <button 
                onClick={() => setIsSystem(!isSystem)}
                className={cn(
                  "flex items-center justify-between border p-3 transition-colors text-[10px] tracking-[0.22em] font-bold uppercase",
                  isSystem ? "border-accent bg-accent/10 text-accent" : "border-accent/20 text-accent/40"
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
                  !name.trim() ? "bg-accent/20 text-black cursor-not-allowed" : "bg-accent text-black hover:bg-white shadow-[0_0_20px_rgba(34,197,94,0.3)]"
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
          "sm:max-w-[500px] gap-6 p-8",
          isCyberCopy
            ? "rounded-none border-accent bg-black shadow-[0_0_30px_rgba(0,255,153,0.1)]"
            : isOctaneCopy
              ? "rounded-none border-accent bg-[#0a0a0a]"
              : isJournalCopy
                ? "rounded-xl border-double border-4 border-accent/20 bg-[#fdfcf8] text-[#3e2723] shadow-xl"
                : "rounded-3xl border-noir-border bg-noir-panel",
        )}
      >
        {isJournalCopy && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')] mix-blend-multiply -z-10" />
        )}

        <DialogHeader>
          <DialogTitle
            className={cn(
              "text-3xl font-bold tracking-tight text-center",
              isCyberCopy || isOctaneCopy
                ? "font-mono uppercase tracking-[0.2em] text-accent"
                : isJournalCopy
                  ? "font-normal font-serif italic text-4xl text-[#3e2723]"
                  : "text-foreground",
            )}
          >
            {isEdit ? (isCyberCopy ? "UPDATE_INDEX" : "Edit list") : isCyberCopy ? "NEW_COLLECTION" : "Create new list"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Input
              placeholder="Give it a name"
              value={name}
              onChange={e => setName(e.target.value)}
              className={cn(
                "h-12 text-lg border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 transition-colors",
                isCyberCopy || isOctaneCopy
                  ? "border-accent/30 bg-transparent text-accent focus-visible:border-accent font-mono placeholder:text-accent/20"
                  : isJournalCopy
                    ? "border-accent/30 bg-transparent text-[#3e2723] placeholder:text-[#3e2723]/30 font-serif normal-case italic px-2 focus:border-accent/60"
                    : "border-input focus-visible:border-black",
              )}
              maxLength={60}
            />
            <div
              className={cn(
                "flex justify-end text-xs",
                isCyberCopy || isOctaneCopy
                  ? "text-accent/30 font-mono"
                  : isJournalCopy
                    ? "text-[#3e2723]/40 font-serif italic"
                    : "text-muted-foreground",
              )}
            >
              {name.length}/60
            </div>
          </div>

          <div className="space-y-2">
            <Textarea
              placeholder="Add a description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className={cn(
                "resize-none border-x-0 border-t-0 border-b rounded-none px-0 focus-visible:ring-0 min-h-[50px] text-base transition-colors",
                isCyberCopy || isOctaneCopy
                  ? "border-accent/30 bg-transparent text-accent focus-visible:border-accent font-mono placeholder:text-accent/20 text-sm"
                  : isJournalCopy
                    ? "border-accent/30 bg-transparent text-[#3e2723] placeholder:text-[#3e2723]/30 font-serif normal-case px-2 focus:border-accent/60"
                    : "border-input focus-visible:border-black",
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="private"
                checked={isPrivate}
                onCheckedChange={checked => setIsPrivate(checked as boolean)}
                className={cn(
                  "rounded-sm",
                  isCyberCopy || isOctaneCopy
                    ? "border-accent text-black data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    : isJournalCopy
                      ? "border-accent/40 data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513] text-[#fdfcf8]"
                      : "border-muted-foreground/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
                )}
              />
              <Label
                htmlFor="private"
                className={cn(
                  "font-normal text-base cursor-pointer select-none",
                  isCyberCopy || isOctaneCopy
                    ? "font-mono text-accent uppercase text-xs tracking-widest"
                    : isJournalCopy
                      ? "font-serif text-[#3e2723] italic"
                      : "",
                )}
              >
                Make it private
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="default"
                checked={isSystem}
                onCheckedChange={checked => setIsSystem(checked as boolean)}
                className={cn(
                  "rounded-sm",
                  isCyberCopy || isOctaneCopy
                    ? "border-accent text-black data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    : isJournalCopy
                      ? "border-accent/40 data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513] text-[#fdfcf8]"
                      : "border-muted-foreground/50 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600",
                )}
              />
              <Label
                htmlFor="default"
                className={cn(
                  "font-normal text-base cursor-pointer select-none",
                  isCyberCopy || isOctaneCopy
                    ? "font-mono text-accent uppercase text-xs tracking-widest"
                    : isJournalCopy
                      ? "font-serif text-[#3e2723] italic"
                      : "",
                )}
              >
                Make it default
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-center sm:justify-center gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={cn(
              "px-8 h-12",
              isCyberCopy || isOctaneCopy
                ? "rounded-none border-accent text-accent font-mono uppercase text-xs tracking-widest hover:bg-accent/5 bg-transparent"
                : isJournalCopy
                  ? "rounded-lg border-accent/20 text-[#3e2723] hover:bg-[#f5e6d3] font-serif hover:border-accent/40 bg-transparent"
                  : "rounded-full border-black text-black hover:bg-transparent",
            )}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || loading}
            className={cn(
              "px-8 h-12 transition-all",
              isCyberCopy || isOctaneCopy
                ? "rounded-none font-mono uppercase text-xs tracking-[0.2em] bg-accent text-black hover:bg-white " +
                    (!name.trim() ? "opacity-50" : "")
                : isJournalCopy
                  ? "rounded-lg bg-[#8B4513] text-[#fdf5e6] hover:bg-[#A0522D] font-serif shadow-md hover:shadow-lg border border-transparent"
                  : !name.trim()
                    ? "rounded-full bg-green-200 text-white hover:bg-green-200"
                    : "rounded-full bg-green-600 hover:bg-green-700 text-white",
            )}
          >
            {loading ? (isEdit ? "Saving..." : "Creating...") : isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
