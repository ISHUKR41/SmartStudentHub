import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientTextProps extends Omit<HTMLMotionProps<"span">, "children"> {
  children: ReactNode;
  gradient?: "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "custom";
  customGradient?: string;
  animate?: boolean;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p";
}

const gradientPresets = {
  primary: "bg-gradient-to-r from-primary via-primary-500 to-primary-700",
  secondary: "bg-gradient-to-r from-secondary-600 via-secondary-500 to-secondary-400",
  accent: "bg-gradient-to-r from-accent via-muted to-accent",
  success: "bg-gradient-to-r from-success via-success/90 to-success/80",
  warning: "bg-gradient-to-r from-warning via-warning/90 to-warning/80",
  info: "bg-gradient-to-r from-info via-info/90 to-info/80",
  custom: "",
};

export function GradientText({
  children,
  gradient = "primary",
  customGradient,
  animate = false,
  className,
  as = "span",
  ...props
}: GradientTextProps) {
  const Component = as;
  const MotionComponent = motion[Component];

  const gradientClass = gradient === "custom" && customGradient
    ? ""
    : gradientPresets[gradient];

  const baseClasses = cn(
    "bg-clip-text text-transparent font-semibold",
    gradientClass,
    className
  );

  const style = gradient === "custom" && customGradient
    ? {
        background: customGradient,
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }
    : {};

  if (animate) {
    return (
      <MotionComponent
        className={baseClasses}
        style={style}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  }

  return (
    <Component className={baseClasses} style={style}>
      {children}
    </Component>
  );
}

export function AnimatedGradientText({
  children,
  className,
  ...props
}: Omit<GradientTextProps, "animate">) {
  return (
    <GradientText animate className={className} {...props}>
      {children}
    </GradientText>
  );
}

export function ShimmeringGradientText({
  children,
  className,
  gradient = "primary",
}: Pick<GradientTextProps, "children" | "className" | "gradient">) {
  const gradientClass = gradientPresets[gradient];

  return (
    <motion.span
      className={cn(
        "relative inline-block bg-clip-text text-transparent font-semibold",
        gradientClass,
        className
      )}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundSize: "200% 200%",
      }}
    >
      {children}
    </motion.span>
  );
}

export function PulsingGradientText({
  children,
  className,
  gradient = "primary",
}: Pick<GradientTextProps, "children" | "className" | "gradient">) {
  const gradientClass = gradientPresets[gradient];

  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent font-semibold",
        gradientClass,
        className
      )}
      animate={{
        opacity: [1, 0.7, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.span>
  );
}

export function RotatingGradientText({
  children,
  className,
}: Pick<GradientTextProps, "children" | "className">) {
  return (
    <motion.span
      className={cn("bg-clip-text text-transparent font-semibold", className)}
      animate={{
        background: [
          "linear-gradient(45deg, hsl(222, 84%, 48%), hsl(30, 88%, 50%))",
          "linear-gradient(90deg, hsl(30, 88%, 50%), hsl(139, 69%, 42%))",
          "linear-gradient(135deg, hsl(139, 69%, 42%), hsl(280, 70%, 55%))",
          "linear-gradient(180deg, hsl(280, 70%, 55%), hsl(222, 84%, 48%))",
          "linear-gradient(45deg, hsl(222, 84%, 48%), hsl(30, 88%, 50%))",
        ],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      }}
      style={{
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </motion.span>
  );
}
