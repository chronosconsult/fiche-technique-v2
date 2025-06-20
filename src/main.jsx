import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FicheTechnique from "./FicheTechnique";
import Mercurial from "./Mercurial";
import ListeFiches from "./ListeFiches";
import Connexion from "./Connexion";
import Inscription from "./Inscription";
import RequireAuth from "./RequireAuth";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
  <Route path="/inscription" element={<Inscription />} />
  <Route path="/connexion" element={<Connexion />} />

  <Route
    path="/"
    element={
      <RequireAuth>
        <FicheTechnique />
      </RequireAuth>
    }
  />
  <Route
    path="/fiche-technique"
    element={
      <RequireAuth>
        <FicheTechnique />
      </RequireAuth>
    }
  />
  <Route
    path="/mercurial"
    element={
      <RequireAuth>
        <Mercurial />
      </RequireAuth>
    }
  />
  <Route
    path="/fiches"
    element={
      <RequireAuth>
        <ListeFiches />
      </RequireAuth>
    }
  />
    </Routes>

  </BrowserRouter>
);
