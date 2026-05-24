export default function Footer() {
  return (
    <footer className="text-center text-muted py-3 mt-auto border-top bg-transparent">
      <div className="container">
        <small className="fw-medium">
          &copy; {new Date().getFullYear()} 𝕏 Clone. Desenvolvido para DWFE.
        </small>
      </div>
    </footer>
  );
}