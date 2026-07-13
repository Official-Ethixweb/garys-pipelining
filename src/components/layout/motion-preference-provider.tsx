"use client";

import { MotionConfig } from "framer-motion";
import { useA11ySettings } from "@/components/accessibility/accessibility-store";

export function MotionPreferenceProvider({ children }: { children: React.ReactNode }) {
  const settings = useA11ySettings();
  const reduce = settings.reduceMotion || settings.pauseAnimations;
  return <MotionConfig reducedMotion={reduce ? "always" : "user"}>{children}</MotionConfig>;
}
