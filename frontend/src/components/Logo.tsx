import { useTheme } from "./ThemeProvider";
import logoLight from "@/assets/logo-dark.png"; // black "trivia" + red "UP" — for light backgrounds
import logoDark from "@/assets/logo-white.png"; // white "trivia" + red "UP" — for dark backgrounds

export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const { theme } = useTheme();
  const src = theme === "dark" ? logoDark : logoLight;
  return <img src={src} alt="TriviaUP" className={className} />;
}
