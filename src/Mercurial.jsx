import React, { useState } from "react";
import useProduits from "./hooks/useProduits";

export default function Mercurial() {
  const {
    produits,
    ajouterProduit,
    modifierProduit,
    supprimerProduit,
    chargement,
  } = useProduits();

  const [nouveau, setNouveau] = useState({ nom: "", unite: "", prixHT: "" });

  const handleAjouter = () => {
  console.log("Ajout demandé :", nouveau);
  if (!nouveau.nom || !nouveau.unite || !nouveau.prixHT) return;
  const produit = {
    nom: nouveau.nom,
    unite: nouveau.unite,
    prixHT: parseFloat(nouveau.prixHT),
  };
  ajouterProduit(produit);
  setNouveau({ nom: "", unite: "", prixHT: "" });
};


  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2 style={{ borderBottom: "2px solid #444" }}>Mercurial</h2>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Nom"
          value={nouveau.nom}
          onChange={(e) => setNouveau({ ...nouveau, nom: e.target.value })}
        />
        <input
          placeholder="Unité"
          value={nouveau.unite}
          onChange={(e) => setNouveau({ ...nouveau, unite: e.target.value })}
        />
        <input
          type="number"
          placeholder="Prix HT"
          value={nouveau.prixHT}
          onChange={(e) => setNouveau({ ...nouveau, prixHT: e.target.value })}
        />
        <button onClick={handleAjouter} style={{ backgroundColor: "#2ecc71", color: "white" }}>
          Ajouter
        </button>
      </div>

      {chargement ? (
        <p>Chargement...</p>
      ) : (
        <table border="1" cellPadding="5" style={{ width: "100%", backgroundColor: "#fff" }}>
          <thead style={{ backgroundColor: "#ecf0f1" }}>
            <tr>
              <th>Nom</th>
              <th>Unité</th>
              <th>Prix HT</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {produits.map((p) => (
              <tr key={p.id}>
                <td>
                  <input
                    value={p.nom}
                    onChange={(e) => modifierProduit(p.id, "nom", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={p.unite}
                    onChange={(e) => modifierProduit(p.id, "unite", e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={p.prixHT}
                    onChange={(e) => modifierProduit(p.id, "prixHT", e.target.value)}
                  />
                </td>
                <td>
                  <button
                    onClick={() => supprimerProduit(p.id)}
                    style={{ backgroundColor: "#e74c3c", color: "white" }}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={() => (window.location.href = "/")}
        style={{
          marginTop: 20,
          backgroundColor: "#3498db",
          color: "white",
          padding: "6px 12px",
        }}
      >
        Retour à la Fiche Technique
      </button>
    </div>
  );
}
