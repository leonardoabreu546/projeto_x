import { useTheme } from "../context/useTheme"; 
import { LandingHero } from "../components/landing/LandingHero";

export default function Landing() {
  const { theme } = useTheme(); 

  return <LandingHero theme={theme} />;
}