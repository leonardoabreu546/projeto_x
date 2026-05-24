import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center mt-2">
      
      {/* Símbolo 𝕏 gigante em vez de imagens pesadas */}
      <div className="display-1 fw-bold mb-3">𝕏</div>
      
      <h1 className="display-4 fw-bold text-body mb-4">
        Bem-vindo ao Projeto X
      </h1>
      
      {/* Substituímos a medida fixa por uma Grelha Responsiva */}
      <div className="row justify-content-center w-100 mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <p className="lead text-muted mb-0 fs-4">
            Este é um projeto desenvolvido no âmbito da unidade curricular de Desenvolvimento Web Front-End. 
            Uma plataforma completa onde podes partilhar os teus pensamentos, seguir outros utilizadores, 
            dar "gostos" e gerir o teu próprio perfil.
          </p>
        </div>
      </div>
      
      {/* O botão adapta-se ao ecrã: no telemóvel fica largo (d-grid), no PC fica contido (col-lg-4) */}
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 d-grid">
          {/* Usamos btn-dark para simular o botão principal do X */}
          <Link to="/login" className="btn btn-dark btn-lg py-3 rounded-pill fw-bold shadow-sm fs-5">
            Começar Agora 🚀
          </Link>
        </div>
      </div>

      <div className="mt-5 pt-5 text-muted">
        <small className="fw-medium">Projeto Desenvolvido com React, TypeScript e Bootstrap.</small>
      </div>
    </div>
  );
}