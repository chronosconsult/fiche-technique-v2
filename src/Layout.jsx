import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

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
