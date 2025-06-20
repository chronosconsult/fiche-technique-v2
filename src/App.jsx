import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Connexion from "./Connexion";
import Inscription from "./Inscription";
import ListeFiches from "./ListeFiches";
import RequireAuth from "./RequireAuth";

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
              <ListeFiches />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
