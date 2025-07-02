"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }
>(({ className, onCheckedChange, ...props }, ref) => {
  const [checked, setChecked] = React.useState(props.checked || props.defaultChecked || false);

  React.useEffect(() => {
    if (props.checked !== undefined) {
      setChecked(props.checked as boolean);
    }
  }, [props.checked]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    if (props.checked === undefined) {
      setChecked(isChecked);
    }
    props.onChange?.(e);
    onCheckedChange?.(isChecked);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          className
        )}
        data-state={checked ? "checked" : "unchecked"}
        {...props}
        onChange={handleChange}
      />
      {checked && (
        <div className="absolute pointer-events-none flex items-center justify-center w-4 h-4 text-primary-foreground">
          <Check className="h-4 w-4" />
        </div>
      )}
    </div>
  )
})
Checkbox.displayName = "Checkbox"

export { Checkbox }
