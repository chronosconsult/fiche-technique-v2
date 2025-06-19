import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FicheTechnique from "./FicheTechnique";
import Mercurial from "./Mercurial";
import ListeFiches from "./ListeFiches";
import Connexion from "./Connexion";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
       <Route path="/" element={<FicheTechnique />} />
       <Route path="/fiche-technique" element={<FicheTechnique />} />
       <Route path="/mercurial" element={<Mercurial />} />
       <Route path="/fiches" element={<ListeFiches />} />
       <Route path="/connexion" element={<Connexion />} />
    </Routes>
  </BrowserRouter>
);
