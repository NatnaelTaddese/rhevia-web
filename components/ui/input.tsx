import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 rounded-full px-4 py-2 text-sm w-full min-w-0 outline-none",
        "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10",
        "text-white placeholder:text-white/40",
        "focus:ring-white/20 transition-all",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
