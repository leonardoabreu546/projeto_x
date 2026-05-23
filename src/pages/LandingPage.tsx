import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center mt-5 pt-5">
      <h1 className="display-4 fw-bold text-primary mb-3">
        Bem-vindo ao Projeto X
      </h1>
      
      <p className="lead text-muted mb-5" style={{ maxWidth: "700px" }}>
        Este é um projeto desenvolvido no âmbito da unidade curricular de Desenvolvimento Web Front-End. 
        Uma plataforma completa onde podes partilhar os teus pensamentos, seguir outros utilizadores, 
        dar "gostos" e gerir o teu próprio perfil.
      </p>
      
      <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
        {/* Este botão redireciona para a nossa página de Login/Registo */}
        <Link to="/login" className="btn btn-primary btn-lg px-5 py-3 rounded-pill fw-bold shadow-sm">
          Começar Agora 🚀
        </Link>
      </div>

      <div className="mt-5 pt-5 text-muted">
        <small>Projeto Desenvolvido com React, TypeScript e Bootstrap.</small>
      </div>
    </div>
  );
}