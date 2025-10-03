import { useState, useEffect, useCallback } from "react";
import { Check, Lock, Plus } from "lucide-react";
import { toast } from "sonner";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { ListDialog } from "./ListDialog";
import { getMyLists, checkPostLists, addItemToList, removeItemFromList } from "../api";
import { ReadingList } from "../types";
import { cn } from "@/lib/utils";
import { useLibrary } from "@/features/library/context/LibraryContext";
import { useThemeHelpers } from "@/features/theme/ThemeProvider";

interface SaveToListMenuProps {
  postId: string;
  trigger: React.ReactNode;
}

export function SaveToListMenu({ postId, trigger }: SaveToListMenuProps) {
  const [lists, setLists] = useState<ReadingList[]>([]);
  const [selectedListIds, setSelectedListIds] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { refreshLibrary } = useLibrary();
  const { isCyberCopy, isOctaneCopy, isTerminalCopy } = useThemeHelpers();

  const loadData = useCallback(async () => {
    try {
      const [listsRes, checkRes] = await Promise.all([
        getMyLists(),
        checkPostLists(postId)
      ]);
      setLists(listsRes);
      setSelectedListIds(new Set(checkRes));
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lists");
    }
  }, [postId]);

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadData();
    }
  }, [isOpen, loadData]);

  const toggleList = async (e: React.MouseEvent, listId: string) => {
    e.preventDefault();
    e.stopPropagation();

    const isSelected = selectedListIds.has(listId);
    

    const newSelected = new Set(selectedListIds);
    if (isSelected) {
      newSelected.delete(listId);
      setSelectedListIds(newSelected);
      try {
        await removeItemFromList(listId, postId);
        await refreshLibrary();
        toast.success("Removed from list");
        setIsOpen(false)
      } catch {
        setSelectedListIds(selectedListIds);
        toast.error("Failed to remove from list");
      }
    } else {
      newSelected.add(listId);
      setSelectedListIds(newSelected);
      try {
        await addItemToList(listId, postId);
        await refreshLibrary();
        toast.success("Added to list");
        setIsOpen(false)
      } catch {
        setSelectedListIds(selectedListIds);
        toast.error("Failed to add to list");
      }
    }
  };

  const handleCreateSuccess = (newList: ReadingList) => {
    setLists(prev => [newList, ...prev]);
    // Automatically add post to new list
    addItemToList(newList._id, postId).then(async () => {
      await refreshLibrary();
      setSelectedListIds(prev => new Set(prev).add(newList._id));
      toast.success("Saved to " + newList.name);
    });
  };


  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className={cn(
            "w-[240px] p-2 shadow-xl",
            isTerminalCopy
              ? "bg-black border-accent/40 text-accent font-mono"
              : isCyberCopy
                ? "bg-noir-bg border-accent/30 text-foreground rounded-none"
                : isOctaneCopy
                  ? "bg-noir-panel border-accent/40 text-foreground rounded-none"
                  : "bg-noir-panel border-noir-border text-foreground rounded-xl",
          )}
        >
          {lists.length > 0 ? (
            lists.map(list => (
              <DropdownMenuItem
                key={list._id}
                onClick={e => toggleList(e, list._id)}
                className={cn("flex items-center justify-between px-3 py-2.5 cursor-pointer rounded-sm mb-1", isTerminalCopy ? "focus:bg-accent/10 focus:text-accent" : "focus:bg-noir-hover")}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 border flex items-center justify-center transition-colors",
                      selectedListIds.has(list._id)
                        ? isTerminalCopy
                          ? "bg-accent border-accent text-black"
                          : "bg-accent border-accent text-black"
                        : isTerminalCopy
                          ? "border-accent/40"
                          : "border-noir-border",
                      isCyberCopy || isOctaneCopy || isTerminalCopy ? "rounded-none" : "rounded-sm",
                    )}
                  >
                    {selectedListIds.has(list._id) && <Check size={14} />}
                  </div>
                  <span className={cn("text-sm font-medium", isTerminalCopy && "uppercase")}>{list.name}</span>
                </div>
                {list.isPrivate && <Lock size={14} className="opacity-40" />}
              </DropdownMenuItem>
            ))
          ) : (
            <div className="text-xs text-center py-4 text-muted-foreground uppercase font-mono tracking-wider">No lists yet</div>
          )}

          <DropdownMenuSeparator className={isTerminalCopy ? "bg-accent/20" : "bg-noir-border/50"} />

          <DropdownMenuItem
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              setShowCreateDialog(true);
            }}
            className={cn(
              "flex items-center gap-2 px-3 py-2.5 cursor-pointer rounded-sm font-medium mt-1",
              isTerminalCopy ? "text-accent focus:bg-accent/10" : "text-accent hover:text-accent-hover focus:bg-noir-hover",
            )}
          >
            <Plus size={16} />
            <span className={cn("text-sm", isTerminalCopy && "uppercase")}>Create new list</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ListDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={handleCreateSuccess} />
    </>
  );
}
