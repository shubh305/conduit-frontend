
import Link from "next/link";
import { ReactNode } from "react";

export interface TerminalListItem {
  id: string;
  permissions: string;
  user: string;
  size: string;
  date: string;
  name: string;
  link?: string;
  isDirectory?: boolean;
  onNavigate?: () => void; 
  actions?: ReactNode;
  extraInfo?: string;
}

interface TerminalDirectoryProps {
  path: string;
  command: string;
  items: TerminalListItem[];
  totalItems?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  username?: string;
  renderTabs?: () => ReactNode;
}

export function TerminalDirectory({
  path,
  command,
  items,
  totalItems,
  isLoading,
  emptyMessage = "[EMPTY_DIRECTORY]",
  username = "user",
  renderTabs,
}: TerminalDirectoryProps) {
  
  const currentDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="w-full font-mono text-sm text-foreground">
      {/* Command Line / Tabs */}
      <div className="mb-6 p-2 border border-accent bg-black text-xs md:text-sm">
        <div className="flex flex-wrap gap-4 items-center mb-2 text-accent/70 border-b border-accent/20 pb-2">
          <span>{command}</span>
          {renderTabs && <div className="flex gap-2">{renderTabs()}</div>}
        </div>

        <div className="text-foreground-muted/50 text-[10px]">
          Directory: {path}
          <br />
          Total: {totalItems ?? items.length} files
        </div>
      </div>

      {/* File List */}
      <div className="border border-accent/30 bg-black min-h-[400px] p-4 font-mono text-xs md:text-sm shadow-[0_0_15px_rgba(34,197,94,0.05)]">
        {/* Header */}
        <div className="grid grid-cols-[100px_minmax(80px,auto)_60px_140px_1fr_100px] gap-4 mb-4 text-accent/50 uppercase tracking-wider border-b border-accent/20 pb-2 hidden md:grid">
          <div>Perms</div>
          <div>User</div>
          <div>Size</div>
          <div>Date</div>
          <div>Name</div>
          <div className="text-right">Action</div>
        </div>

        <div className="space-y-1">
          {/* Default . and .. entries */}
          <div className="grid grid-cols-[100px_minmax(80px,auto)_60px_140px_1fr_100px] gap-4 text-accent/30 hidden md:grid">
            <div>drwxr-xr-x</div>
            <div>{username}</div>
            <div>4096</div>
            <div>{currentDate}</div>
            <div>.</div>
            <div className="text-right text-[10px]">DIR</div>
          </div>
          <div className="grid grid-cols-[100px_minmax(80px,auto)_60px_140px_1fr_100px] gap-4 text-accent/30 hidden md:grid mb-4">
            <div>drwxr-xr-x</div>
            <div>root</div>
            <div>4096</div>
            <div>Jan 01 00:00</div>
            <div>..</div>
            <div className="text-right text-[10px]">DIR</div>
          </div>

          {isLoading && (
            <div className="py-12 text-center text-accent/50 animate-pulse text-xs uppercase tracking-widest">
              SCANNING_SECTOR...
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="py-12 text-center text-accent/30 italic">{emptyMessage}</div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="group grid grid-cols-1 md:grid-cols-[100px_minmax(80px,auto)_60px_140px_1fr_100px] gap-2 md:gap-4 hover:bg-accent/10 p-1 transition-colors items-center"
            >
              <div className="text-foreground-muted hidden md:block">{item.permissions}</div>
              <div className="text-accent/60 hidden md:block truncate max-w-[120px]">{item.user}</div>
              <div className="text-foreground-muted hidden md:block">{item.size}</div>
              <div className="text-foreground-muted hidden md:block">{item.date}</div>
              <div className="min-w-0 flex items-center gap-2">
                {item.link ? (
                  <Link
                    href={item.link}
                    className="text-foreground group-hover:text-accent font-bold truncate block"
                  >
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-foreground group-hover:text-accent font-bold truncate block cursor-default">
                     {item.name}
                  </span>
                )}
                {item.extraInfo && (
                   <span className="hidden md:inline text-[10px] text-accent/40">--{item.extraInfo}</span>
                )}
              </div>
              <div className="text-right opacity-80 group-hover:opacity-100 transition-opacity flex justify-end">
                {item.actions}
              </div>

              {/* Mobile Mobile Row View */}
              <div className="md:hidden text-[10px] text-foreground-muted flex flex-wrap gap-2 w-full mt-1">
                <span>{item.permissions}</span>
                <span>{item.user}</span>
                <span>{item.size}</span>
                <span>{item.date}</span>
                {item.actions && <div className="ml-auto">{item.actions}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Prompt line at bottom */}
        <div className="mt-8 text-accent animate-pulse">
           {username}@conduit:{path}$ <span className="w-2 h-4 bg-accent inline-block align-middle ml-1" />
        </div>
      </div>
    </div>
  );
}
