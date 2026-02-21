"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none select-none font-medium",
  {
    variants: {
      variant: {
        default:
          "bg-white text-black hover:bg-white/90 rounded-full h-9 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        secondary:
          "bg-black/80 backdrop-blur-xl shadow-xl ring-2 ring-white/10 text-white/60 hover:text-white hover:bg-white/10 rounded-full h-9 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        outline:
          "border border-white/20 bg-transparent text-white/60 hover:bg-white/10 hover:text-white rounded-full h-9 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        ghost:
          "text-white/60 hover:text-white hover:bg-white/10 rounded-full h-9 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        destructive:
          "bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-full h-9 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        link: "text-white/60 hover:text-white underline-offset-4 hover:underline text-sm",
      },
      size: {
        default: "h-9 px-4 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        sm: "h-8 px-3 text-sm gap-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 px-5 text-sm gap-2 [&_svg:not([class*='size-'])]:size-4",
        icon: "size-9 [&_svg:not([class*='size-'])]:size-4",
        "icon-sm": "size-8 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 [&_svg:not([class*='size-'])]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
