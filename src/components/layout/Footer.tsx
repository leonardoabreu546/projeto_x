import { useTheme } from "../../context/useTheme";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`text-center py-3 mt-auto border-top bg-transparent ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      <div className="container">
        <small className="fw-medium">
          &copy; {new Date().getFullYear()} 𝕏 Clone. Desenvolvido para DWFE.
        </small>
      </div>
    </footer>
  );
}