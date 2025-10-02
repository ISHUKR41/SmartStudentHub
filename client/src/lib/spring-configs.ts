import { SpringConfig } from "@react-spring/web";

export const gentle: SpringConfig = {
  tension: 120,
  friction: 14,
};

export const wobbly: SpringConfig = {
  tension: 180,
  friction: 12,
};

export const stiff: SpringConfig = {
  tension: 210,
  friction: 20,
};

export const slow: SpringConfig = {
  tension: 280,
  friction: 60,
};

export const molasses: SpringConfig = {
  tension: 280,
  friction: 120,
};

export const cardSpring: SpringConfig = {
  tension: 300,
  friction: 25,
  mass: 0.8,
};

export const modalSpring: SpringConfig = {
  tension: 250,
  friction: 30,
  mass: 1,
};

export const tooltipSpring: SpringConfig = {
  tension: 400,
  friction: 30,
  mass: 0.5,
};

export const bouncy: SpringConfig = {
  tension: 300,
  friction: 10,
  mass: 1,
};

export const snappy: SpringConfig = {
  tension: 400,
  friction: 40,
  mass: 0.6,
};

export const smooth: SpringConfig = {
  tension: 170,
  friction: 26,
  mass: 1,
};

export const quickBounce: SpringConfig = {
  tension: 500,
  friction: 15,
  mass: 0.8,
};

export const gentleBounce: SpringConfig = {
  tension: 150,
  friction: 10,
  mass: 1,
};

export const defaultSpring: SpringConfig = {
  tension: 170,
  friction: 26,
};

export const SPRING_CONFIGS = {
  gentle,
  wobbly,
  stiff,
  slow,
  molasses,
  cardSpring,
  modalSpring,
  tooltipSpring,
  bouncy,
  snappy,
  smooth,
  quickBounce,
  gentleBounce,
  defaultSpring,
};

export const getSpringConfig = (configName: keyof typeof SPRING_CONFIGS): SpringConfig => {
  return SPRING_CONFIGS[configName] || defaultSpring;
};
