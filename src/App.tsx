import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider";
import { ProtectedRoute } from "./components/ProtectedRoute"; 
import { Navbar } from "./components/Navbar"; 
import Footer from "./components/Footer"; 

import LandingPage from "./pages/LandingPage"; // <-- NOVO: Importação da página principal
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Backoffice from "./pages/Backoffice";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <Navbar /> 
            
            <main className="flex-grow-1 py-5">
              <Routes>
                {/* <-- ALTERADO: A Rota Pública principal agora é a Landing Page */}
                <Route path="/" element={<LandingPage />} />
                
                {/* <-- NOVO: O teu ecrã de Login/Registo passou para a rota /login */}
                <Route path="/login" element={<Home />} />
                
                {/* Rotas Protegidas: Precisa de Login */}
                <Route 
                  path="/feed" 
                  element={
                    <ProtectedRoute>
                      <Feed />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />

                {/* Rota de Admin: Precisa de Login + Cargo Admin */}
                <Route 
                  path="/backoffice" 
                  element={
                    <ProtectedRoute roleRequired="admin">
                      <Backoffice />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}