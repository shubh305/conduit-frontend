import Link from "next/link";
import { User } from "@/features/auth/types";
import { Post } from "@/features/blog/types";

interface TerminalProcessListProps {
  posts: Post[];
  loading: boolean;
  user: User | null;
}

export function TerminalProcessList({ posts, loading, user }: TerminalProcessListProps) {
  return (
    <div className="border border-accent/30 p-4 relative font-mono text-xs md:text-sm text-accent">
      <div className="absolute top-0 left-0 bg-black text-accent px-2 -mt-2 ml-4 text-xs border border-accent/30">Processes (Top Posts)</div>

      <div className="flex justify-between items-center mb-4">
        <span>PID USER PRI NI VIRT RES SHR S %CPU %MEM TIME+ COMMAND</span>
        <Link href={`/studio/editor${user?.tenantId ? `?tenantId=${user.tenantId}` : user?.tenants?.[0]?.id ? `?tenantId=${user.tenants[0].id}` : ""}`}>
          <button className="bg-accent text-black px-2 py-0.5 hover:bg-white font-bold uppercase text-xs">[F10] NEW_TASK</button>
        </Link>
      </div>

      <div className="space-y-1 text-accent/80">
        {loading && <div className="animate-pulse">Loading process table...</div>}

        {!loading &&
          posts.slice(0, 10).map((post, i) => {
            const pid = 1000 + i;
            const cpu = ((post.id.charCodeAt(0) + i) % 5 + 0.1).toFixed(1);
            const mem = ((post.id.charCodeAt(post.id.length - 1) + i) % 3 + 0.1).toFixed(1);
            
            return (
              <div key={post.id} className="grid grid-cols-[50px_minmax(60px,auto)_40px_40px_60px_60px_60px_40px_50px_50px_80px_1fr] gap-2 whitespace-nowrap overflow-hidden hover:bg-accent/20 cursor-default">
                <div className="text-green-400">{pid}</div>
                <div>{user?.username?.substring(0, 8) || "user"}</div>
                <div>20</div>
                <div>0</div>
                <div>128M</div>
                <div>32M</div>
                <div>14M</div>
                <div>S</div>
                <div>{cpu}</div>
                <div>{mem}</div>
                <div>0:0{i}.45</div>
                <div className="text-white truncate">./conduit --serve {post.slug}</div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
