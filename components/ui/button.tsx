import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-base font-bold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border-2 border-playful-foreground",
  {
    variants: {
      variant: {
        default: "bg-playful-primary text-white hover:bg-playful-primary/90 shadow-2d hover:shadow-none transform hover:-translate-y-1",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-2d hover:shadow-none",
        outline:
          "border-playful-foreground bg-transparent hover:bg-playful-accent/20 shadow-2d hover:shadow-none",
        secondary:
          "bg-playful-secondary text-playful-foreground hover:bg-playful-secondary/80 shadow-2d hover:shadow-none",
        ghost: "border-transparent hover:bg-playful-accent/20",
        link: "text-playful-primary underline-offset-4 hover:underline border-transparent shadow-none",
        playful: "bg-playful-primary text-white hover:bg-playful-primary/90 shadow-2d hover:shadow-none transform hover:-translate-y-1",
      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-10 rounded-lg px-4",
        lg: "h-12 rounded-xl px-8 text-lg",
        xl: "h-14 rounded-2xl px-10 text-xl",
        icon: "h-11 w-11 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
