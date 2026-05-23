export default function Footer() {
  return (
    <footer className="bg-body-tertiary text-center text-muted py-4 mt-auto border-top">
      <div className="container">
        <small>
          &copy; {new Date().getFullYear()} Projeto DWFE - Clone do X/Twitter. 
          Desenvolvido para a unidade curricular de Desenvolvimento Web Front-End.
        </small>
      </div>
    </footer>
  );
}