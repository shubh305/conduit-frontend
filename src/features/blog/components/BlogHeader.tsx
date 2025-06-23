import { Tenant } from "../types";

export function BlogHeader({ tenant }: { tenant: Tenant }) {
  return (
    <header className="border-b border-noir-border py-12 md:py-20 bg-noir-panel">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-6xl font-sans font-black tracking-tighter uppercase mb-4 text-white">
          {tenant.name}
        </h1>
        {tenant.description && (
          <p className="text-lg md:text-xl font-mono text-gray-400 max-w-2xl">
            {`// ${tenant.description}`}
          </p>
        )}
      </div>
    </header>
  );
}
