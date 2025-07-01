// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Connexion from "./Connexion";
import Inscription from "./Inscription";
import ListeFiches from "./ListeFiches";
import FicheTechnique from "./FicheTechnique";
import Mercurial from "./Mercurial";
import RequireAuth from "./RequireAuth";
import Layout from "./Layout";
import Accueil from "./Accueil";
import { supabase } from "./supabaseClient";
import { initProduits } from "./utils/initProduits.js";
import { DeviseProvider } from "./contexts/DeviseContext";
import Paiement from "./pages/Paiement";


export default function App() {
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const user = session?.user;
      setIsConnected(!!user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user;
        setIsConnected(!!user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isConnected === null) return null;

  return (
    <DeviseProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil isConnected={isConnected} />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />

          <Route
            path="/fiches"
            element={
              <RequireAuth>
                <Layout>
                  <ListeFiches />
                </Layout>
              </RequireAuth>
            }
          />

          <Route
            path="/fiche/:id?"
            element={
              <RequireAuth>
                <Layout>
                  <FicheTechnique />
                </Layout>
              </RequireAuth>
            }
          />
	  <Route
  path="/paiement"
  element={
    <RequireAuth>
      <Layout>
        <Paiement />
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
    </DeviseProvider>
  );
}
