// App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connexion from "./Connexion";
import Inscription from "./Inscription";
import ListeFiches from "./ListeFiches";
import FicheTechnique from "./FicheTechnique";
import Mercurial from "./Mercurial";
import RequireAuth from "./RequireAuth";
import Layout from "./Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout>
                <ListeFiches />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/fiche"
          element={
            <RequireAuth>
              <Layout>
                <FicheTechnique />
              </Layout>
            </RequireAuth>
          }
        />
        <Route
          path="/mercurial"
          element={
            <RequireAuth>
              <Layout>
                <Mercurial />
              </Layout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
} 

// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Layout.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Layout({ children }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Fiches Techniques</h1>
        <div className="space-x-2">
          <button
            className="bg-blue-600 text-white px-3 py-1 rounded"
            onClick={() => navigate("/")}
          >
            Accueil
          </button>
          <button
            className="bg-green-600 text-white px-3 py-1 rounded"
            onClick={() => navigate("/mercurial")}
          >
            Mercurial
          </button>
          <button
            className="bg-gray-600 text-white px-3 py-1 rounded"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/connexion");
            }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
}
