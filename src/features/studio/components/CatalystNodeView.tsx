import React, { useState, useEffect, useRef } from "react";
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react";
import { fetchApi } from "@/lib/api-client";
import { Loader2, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  display_label: string;
  model?: string;
  make?: string;
  title?: string;
}

export function CatalystNodeView({ node, editor, deleteNode, updateAttributes }: NodeViewProps) {
  const { category, data: storedData } = node.attrs;
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        deleteNode();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [deleteNode]);

  useEffect(() => {
    if (storedData) return;

    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await fetchApi<SearchResult[]>(`/editor/catalyst/${category}s/search?q=${encodeURIComponent(query)}`);
        setResults(data || []);
        setSelectedIndex(0);
      } catch (err: unknown) {
        if (err && typeof err === "object" && "status" in err && (err as { status: number }).status === 503) {
          toast.error("Catalog is temporarily unavailable");
          deleteNode();
        }
      } finally {
        setIsLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, category, deleteNode, storedData]);

  const formatPrice = (price: unknown) => {
    const num = Number(price);
    if (!price || isNaN(num) || num === 0) return "-";
    
    const threshold = (category === "car" || category === "bike") ? 50000 : 1000;
    
    if (num < threshold) return "-";
    return "₹" + num.toLocaleString("en-IN");
  };

  const getVal = (itemData: Record<string, unknown>, key: string): string[] => {
    const val = itemData[key];
    
    let result: string[] = [];
    if (val === undefined || val === null || val === "") result = [];
    else if (Array.isArray(val)) result = val.map(v => String(v));
    else if (typeof val === "string") {
      if (val.startsWith("['") && val.endsWith("']")) {
        result = val.slice(2, -2).split("', '").map(v => v.trim());
      } else if (val.startsWith("[") && val.endsWith("]")) {
        try {
          const cleaned = val.replace(/'/g, "\"");
          const parsed = JSON.parse(cleaned);
          if (Array.isArray(parsed)) result = parsed.map(v => String(v));
          else result = [val];
        } catch { result = [val]; }
      } else result = [val];
    } else result = [String(val)];

    if (key === "genre") return result.slice(0, 3);
    return result;
  };

  const renderTable = () => {
    if (!storedData) return null;
    const itemData: Record<string, unknown> = {
      ...(storedData as Record<string, unknown>),
      ...(storedData.specs as Record<string, unknown> || {}),
    };

    let fields: { label: string; value: string[] }[] = [];

    const getField = (label: string, keys: string | string[], transform?: (val: string[]) => string[]) => {
      const keyList = Array.isArray(keys) ? keys : [keys];
      let val: string[] = [];
      
      for (const k of keyList) {
        const found = getVal(itemData, k);
        if (found.length > 0 && found[0] !== "" && found[0] !== "-") {
          val = found;
          break;
        }
      }
      
      if (transform) val = transform(val);
      return { label, value: val };
    };

    if (category === "car") {
      fields = [
        getField("Model", "model"),
        getField("Make", ["make", "brand_or_author"]),
        getField("Variant", "variant"),
        getField("Body", ["body type", "body_type"]),
        getField("Fuel", ["fuel type", "fuel_type"]),
        getField("Trans.", "transmission"),
        getField("Engine", ["engine displacement", "engine_cc", "displacement"]),
        getField("Power", ["max power", "max_power_bhp"]),
        getField("Torque", ["max torque", "max_torque_nm"]),
        getField("0-100kmph", ["0-100kmph", "acceleration"]),
        getField("Top Speed", "top speed"),
        getField("Drive", "drive type"),
        getField("Cylinders", "no. of cylinders"),
        getField("Wheelbase", "wheel base"),
        getField("Turning Radius", "turning radius"),
        getField("Seats", "seating_capacity"),
        getField("Airbags", "no. of airbags"),
        getField("Ground Clear.", ["ground clearance unladen", "ground_clearance_mm"]),
        getField("Boot Space", "boot space"),
        getField("Fuel Tank", ["petrol fuel tank capacity", "fuel tank capacity"]),
        { label: "Price (₹)", value: [formatPrice(itemData.base_price_inr)] },
      ];
    } else if (category === "bike") {
      fields = [
        getField("Model", "model"),
        getField("Make", ["make", "brand_or_author"]),
        getField("Type", "segment"),
        getField("Fuel", ["fuel type", "fuel_type"]),
        getField("Engine", ["engine capacity", "engine_cc", "displacement"]),
        getField("Power", ["max power", "max_power_bhp"]),
        getField("Torque", ["max torque", "max_torque_nm"]),
        getField("Top Speed", "top speed"),
        getField("Clutch", "clutch"),
        getField("Gearbox", "transmission"),
        getField("Brakes", "braking system"),
        getField("Modes", "riding modes"),
        getField("Range", "riding range"),
        getField("Chassis", "chassis type"),
        getField("Mileage (Arai)", "mileage - arai"),
        getField("Weight", ["kerb weight", "weight_kg"]),
        getField("Seat Height", "seat height"),
        getField("Tank", "fuel tank capacity"),
        getField("Headlight", "headlight"),
        getField("Warranty", "vehicle warranty"),
        { label: "Price (₹)", value: [formatPrice(itemData.base_price_inr || itemData.on_road_price_inr)] },
      ];
    } else if (category === "book") {
      fields = [
        getField("Title", "title"),
        getField("Author", "author"),
        getField("Year", "publication_year"),
        getField("Genre", "genre"),
        getField("Rating", "average_rating"),
        getField("Publisher", "publisher"),
        getField("ISBN", "isbn10"),
        getField("Language", "language"),
        getField("Pages", "pages"),
      ];
    } else if (category === "mobile") {
      fields = [
        getField("Model", "model"),
        getField("Brand", ["brand", "brand_or_author"]),
        getField("OS", ["operating_system", "os_version", "os"]),
        getField("RAM", ["ram", "ram_gb"], (v) => v.length > 0 && !v[0].toLowerCase().includes("gb") && !isNaN(Number(v[0])) ? [`${v[0]}GB`] : v),
        getField("Storage", ["internal_storage", "storage_gb"], (v) => v.length > 0 && !v[0].toLowerCase().includes("gb") && !isNaN(Number(v[0])) ? [`${v[0]}GB`] : v),
        getField("Chipset", "chipset"),
        getField("CPU", ["cpu", "cpu_cores"]),
        getField("GPU", "gpu"),
        getField("Screen", ["screen_size", "screen_size_in"], (v) => v.length > 0 && !v[0].includes("''") && !v[0].includes("\"") && !isNaN(Number(v[0])) ? [`${v[0]}″`] : v),
        getField("Resolution", ["resolution_screen", "resolution"]),
        getField("Disp.", "display_type"),
        getField("Ref.", "refresh_rate_hz"),
        getField("Protection", "screen_protection"),
        getField("Battery", ["battery_capacity", "battery_mah"], (v) => v.length > 0 && !v[0].toLowerCase().includes("mah") && !isNaN(Number(v[0])) ? [`${v[0]}mAh`] : v),
        getField("Charge", ["quick_charging", "fast_charging_w"], (v) => v.length > 0 && !v[0].toLowerCase().includes("w") && !isNaN(Number(v[0])) ? [`${v[0]}W`] : v),
        getField("Resistance", ["water_resistance", "ip_rating", "waterproof"]),
        getField("Camera", ["primary_camera_resolution", "rear_camera_mp"]),
        getField("Selfie", "front_camera_mp"),
        { label: "5G", value: [itemData.has_5g ? "Yes" : "No"] },
        getField("Year", "launch_year"),
        { label: "Price (₹)", value: [formatPrice(itemData.base_price_inr)] },
      ];
    }

    const activeFields = fields.filter((f, i) => {
      const isImportant =
        i < 2 || f.label.includes("Price") || f.label === "Rating" || f.label === "Engine" || f.label === "Power";
      const hasValue = f.value.length > 0 && f.value[0] !== "" && f.value[0] !== "-";
      return isImportant || hasValue;
    });

    const badgeField =
      category === "book"
        ? activeFields.find(f => f.label === "Rating")
        : activeFields.find(f => f.label.includes("Price"));

    return (
      <div className="relative group/catalyst-table my-6 select-none">
        {/* Delete icon */}
        {editor.isEditable && (
          <button
            onClick={() => deleteNode()}
            className="absolute -top-3 -right-3 z-30 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg opacity-100 md:opacity-0 md:group-hover/catalyst-table:opacity-100 transition-all hover:scale-110"
            title="Remove component"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}

        <div className="rounded-2xl border border-[var(--editor-border,rgba(255,255,255,0.1))] bg-[var(--editor-bg,#000)] overflow-hidden transition-all duration-300 hover:shadow-md">
          {/* Header Area */}
          <div className="px-6 py-5 bg-accent/5 border-b border-[var(--editor-border,rgba(255,255,255,0.1))] flex justify-between items-center bg-gradient-to-r from-accent/10 to-transparent">
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {activeFields[0]?.value[0] || "Product Specifications"}
              </h3>
              <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-widest mt-1 opacity-80">
                {activeFields[1]?.value[0] || category} • Technical Details
              </p>
            </div>
            {badgeField && badgeField.value[0] !== "-" && (
              <div className="px-4 py-2 bg-accent/10 rounded-xl text-accent font-black text-base shadow-sm border border-accent/20 flex items-center gap-1.5">
                {category === "book" && <span className="text-[10px] opacity-70">★</span>}
                {badgeField.value[0]}
              </div>
            )}
          </div>

          {/* Specs Grid */}
          <div className={cn(
            "p-6 grid gap-x-8 gap-y-6",
            category === "book" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
          )}>
            {activeFields
              .filter(
                f =>
                  f !== badgeField &&
                  f.label !== "Model" &&
                  f.label !== "Make" &&
                  f.label !== "Brand" &&
                  f.label !== "Title",
              )
              .map((f, i) => (
                <div key={i} className="flex flex-col gap-1.5 min-w-0">
                  <span className="text-[11px] text-muted-foreground uppercase font-black tracking-[0.1em] truncate opacity-70">
                    {f.label}
                  </span>
                  <div className="text-sm font-semibold leading-snug">
                    {f.value.length > 0
                      ? f.value.map((text, j) => (
                          <p key={j} className="truncate text-foreground/90 font-medium" title={text}>
                            {text || "-"}
                          </p>
                        ))
                      : "-"}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const handleSelect = async (item: SearchResult) => {
    setIsFetchingDetail(true);
    try {
      const detail = await fetchApi<Record<string, unknown>>(`/editor/catalyst/products/${item.id}`);
      updateAttributes({ data: detail });
    } catch (err: unknown) {
      console.error("[Catalyst] Error fetching product detail:", err);
      if (err && typeof err === "object" && "status" in err) {
        const status = (err as { status: number }).status;
        if (status === 404) toast.error("Product not found");
        else if (status === 503) toast.error("Catalog is temporarily unavailable");
      }
      deleteNode();
    } finally {
      setIsFetchingDetail(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      deleteNode();
      editor.commands.focus();
      e.preventDefault();
    } else if (e.key === "ArrowDown") {
      setSelectedIndex((s) => Math.min(s + 1, results.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((s) => Math.max(s - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
      e.preventDefault();
    } else if (e.key === "Backspace" && query.length === 0) {
      deleteNode();
      editor.commands.focus();
      e.preventDefault();
    }
  };

  const placeholders: Record<string, string> = {
    car: "Search cars",
    bike: "Search bikes",
    book: "Search books",
    mobile: "Search mobiles",
  };

  if (storedData) {
    return (
      <NodeViewWrapper className="catalyst-table-wrapper">
        {renderTable()}
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper className="relative inline-block w-full max-w-md my-2" ref={containerRef}>
      <div className="flex items-center rounded-md border border-[var(--editor-border)] bg-[var(--editor-bg)] px-3 py-2 shadow-sm focus-within:ring-1 focus-within:ring-accent">
        {(isLoading || isFetchingDetail) && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground mr-2" />}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={e => {
            if (!isFetchingDetail && !containerRef.current?.contains(e.relatedTarget as Node)) {
              setTimeout(() => {
                if (document.activeElement !== inputRef.current) {
                  deleteNode();
                }
              }, 200);
            }
          }}
          placeholder={placeholders[category]}
          className="flex-1 nuclear-input-reset !bg-transparent !border-0 !shadow-none !ring-0 !outline-none text-sm placeholder:text-muted-foreground focus:!bg-transparent focus:!border-0 focus:!shadow-none focus:!ring-0 focus:!outline-none"
          disabled={isFetchingDetail}
        />
        <button
          onClick={() => {
            deleteNode();
            editor.commands.focus();
          }}
          className="ml-2 rounded-full p-1 cursor-pointer hover:bg-accent/10 text-muted-foreground hover:text-foreground transition-colors"
          title="Cancel Catalyst search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {query.length > 0 && (
        <div className="absolute top-full left-0 z-50 w-full mt-1 overflow-hidden rounded-md border border-[var(--editor-border)] bg-[var(--editor-bg)] shadow-md">
          {query.length < 2 ? (
            <div className="p-2 text-sm text-muted-foreground">Type at least 2 characters…</div>
          ) : results.length === 0 && !isLoading ? (
            <div className="p-2 text-sm text-muted-foreground">No matches found</div>
          ) : (
            <ul className="max-h-60 overflow-auto py-1">
              {results.slice(0, 10).map((r, i) => {
                const hasModelOrTitle = !!(r.model || r.title);
                let title = r.model || r.title || "";
                let subtitle = r.display_label;

                if (!hasModelOrTitle) {
                  const labelMatch = r.display_label.match(/^(.*?)(?:\s*\((.*)\))?$/);
                  title = labelMatch ? labelMatch[1] : r.display_label;
                  subtitle = labelMatch && labelMatch[2] ? labelMatch[2] : "";
                }

                return (
                  <li
                    key={r.id}
                    className={cn(
                      "group flex items-center gap-3 cursor-pointer px-4 py-2.5 text-sm transition-all",
                      selectedIndex === i ? "bg-accent/10 text-accent font-medium" : "hover:bg-accent/5",
                    )}
                    onMouseDown={e => {
                      e.preventDefault();
                      handleSelect(r);
                    }}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        selectedIndex === i ? "bg-accent" : "bg-muted-foreground/30 group-hover:bg-muted-foreground/50",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{title}</div>
                      {subtitle && (
                        <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{subtitle}</div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
}
