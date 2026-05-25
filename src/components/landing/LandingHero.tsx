import { Link } from "react-router-dom";

interface LandingHeroProps {
  theme: string;
}

export function LandingHero({ theme }: LandingHeroProps) {
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center text-center mt-2">
      
      {/* Logótipo */}
      <div className={`display-1 fw-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>𝕏</div>
      
      {/* Título */}
      <h1 className={`display-4 fw-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
        Bem-vindo ao Projeto X
      </h1>
      
      {/* Descrição */}
      <div className="row justify-content-center w-100 mb-5">
        <div className="col-12 col-md-10 col-lg-8">
          <p className="lead text-secondary mb-0 fs-4">
            Este é um projeto desenvolvido no âmbito da unidade curricular de Desenvolvimento Web Front-End. 
            Uma plataforma completa onde podes partilhar os teus pensamentos, seguir outros utilizadores, 
            dar "gostos" e gerir o teu próprio perfil.
          </p>
        </div>
      </div>
      
      {/* Botão de Ação */}
      <div className="row justify-content-center w-100">
        <div className="col-12 col-sm-8 col-md-6 col-lg-4 d-grid">
          <Link 
            to="/login" 
            className={`btn btn-lg py-3 rounded-pill fw-bold shadow-sm fs-5 ${theme === 'dark' ? 'btn-light text-black' : 'btn-dark'}`}
          >
            Começar Agora 🚀
          </Link>
        </div>
      </div>

      {/* Rodapé da Landing */}
      <div className="mt-5 pt-5 text-secondary">
        <small className="fw-medium">Projeto Desenvolvido com React, TypeScript e Bootstrap.</small>
      </div>
      
    </div>
  );
}