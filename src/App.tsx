import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";
import { AuthProvider } from "./context/AuthProvider"; // Adicionado
import Home from "./pages/Home";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Backoffice from "./pages/Backoffice";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider> {/* Adicionado */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/backoffice" element={<Backoffice />} />
          </Routes>
        </Router>
      </AuthProvider> {/* Adicionado */}
    </ThemeProvider>
  );
}