import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useSpring, animated } from "@react-spring/web";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { cardHover } from "@/lib/animations";

interface AnimatedCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  variant?: "default" | "hover" | "glass";
  enableHover?: boolean;
  enableSpring?: boolean;
  glassmorphism?: boolean;
  className?: string;
}

export function AnimatedCard({
  children,
  variant = "default",
  enableHover = true,
  enableSpring = false,
  glassmorphism = false,
  className,
  ...props
}: AnimatedCardProps) {
  const [springProps, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 300, friction: 25 },
  }));

  const handleMouseEnter = () => {
    if (enableSpring) {
      api.start({ scale: 1.02 });
    }
  };

  const handleMouseLeave = () => {
    if (enableSpring) {
      api.start({ scale: 1 });
    }
  };

  const MotionComponent = motion.div;
  const SpringComponent = animated.div;

  const baseClasses = cn(
    "transition-all duration-300",
    glassmorphism && "backdrop-blur-md bg-glass-background dark:bg-glass-background border-glass-border",
    className
  );

  if (enableSpring) {
    return (
      <SpringComponent
        style={springProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={baseClasses}
      >
        <Card className="h-full">{children}</Card>
      </SpringComponent>
    );
  }

  return (
    <MotionComponent
      variants={enableHover ? cardHover : undefined}
      initial="rest"
      whileHover={enableHover ? "hover" : undefined}
      whileTap={enableHover ? "tap" : undefined}
      className={baseClasses}
      {...props}
    >
      <Card className="h-full">{children}</Card>
    </MotionComponent>
  );
}

interface AnimatedCardWithContentProps {
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  variant?: "default" | "hover" | "glass";
  enableHover?: boolean;
  enableSpring?: boolean;
  glassmorphism?: boolean;
  className?: string;
  testId?: string;
}

export function AnimatedCardWithContent({
  title,
  description,
  children,
  footer,
  variant = "default",
  enableHover = true,
  enableSpring = false,
  glassmorphism = false,
  className,
  testId,
}: AnimatedCardWithContentProps) {
  const [springProps, api] = useSpring(() => ({
    scale: 1,
    y: 0,
    config: { tension: 300, friction: 25 },
  }));

  const handleMouseEnter = () => {
    if (enableSpring) {
      api.start({ scale: 1.02, y: -4 });
    }
  };

  const handleMouseLeave = () => {
    if (enableSpring) {
      api.start({ scale: 1, y: 0 });
    }
  };

  const cardClasses = cn(
    "overflow-hidden transition-all duration-300",
    glassmorphism && "backdrop-blur-md",
    className
  );

  const innerCardClasses = cn(
    glassmorphism && "bg-glass-background dark:bg-glass-background border-glass-border"
  );

  if (enableSpring) {
    const SpringCard = animated(Card);
    return (
      <SpringCard
        style={springProps}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cardClasses}
        data-testid={testId}
      >
        <div className={innerCardClasses}>
          {(title || description) && (
            <CardHeader>
              {title && <CardTitle>{title}</CardTitle>}
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </div>
      </SpringCard>
    );
  }

  return (
    <motion.div
      variants={enableHover ? cardHover : undefined}
      initial="rest"
      whileHover={enableHover ? "hover" : undefined}
      whileTap={enableHover ? "tap" : undefined}
      className={cardClasses}
    >
      <Card className={innerCardClasses} data-testid={testId}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{children}</CardContent>
        {footer && <CardFooter>{footer}</CardFooter>}
      </Card>
    </motion.div>
  );
}

export function GlassCard({ 
  children, 
  className,
  ...props 
}: AnimatedCardProps) {
  return (
    <AnimatedCard
      glassmorphism
      className={cn("shadow-lg", className)}
      {...props}
    >
      {children}
    </AnimatedCard>
  );
}
