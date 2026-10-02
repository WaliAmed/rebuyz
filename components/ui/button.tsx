import { Slot } from "@radix-ui/react-slot";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Button({
  asChild = false,
  className,
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "primary" | "outline" | "ghost" | "danger";
}) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn("btn", variant, className)} {...props} />;
}
