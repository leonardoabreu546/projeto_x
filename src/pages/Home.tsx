import { useTheme } from "../context/useTheme";

export default function Home() {
  // Destruturamos 'theme' em vez de 'darkMode'
  const { theme, toggleTheme } = useTheme();

  // Criamos uma constante auxiliar para facilitar a leitura no HTML
  const isDark = theme === "dark";

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="text-center p-5 rounded shadow bg-body-tertiary">
        <h1>Bem-vindo à nossa Aplicação!</h1>
        <p className="lead text-muted">
          O tema atual é: <strong>{isDark ? "Escuro 🌙" : "Claro ☀️"}</strong>
        </p>

        <button className="btn btn-primary m-2" onClick={toggleTheme}>
          Trocar para Modo {isDark ? "Claro ☀️" : "Escuro 🌙"}
        </button>
      </div>
    </div>
  );
}