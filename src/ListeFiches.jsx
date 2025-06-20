import React from "react";
import { useFiches } from "./hooks/useFiches";

export default function ListeFiches() {
  const { fiches, chargement } = useFiches();

  if (chargement) return <p>Chargement des fiches...</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2 style={{ color: "#2c3e50" }}>Fiches Techniques</h2>
      {fiches.length === 0 ? (
        <p>Aucune fiche enregistrée.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {fiches.map((fiche) => (
            <li key={fiche.id} style={{ marginBottom: 10 }}>
              <a
                href={`/fiche-technique?fiche=${encodeURIComponent(fiche.titre)}`}
                style={{ textDecoration: "none", color: "#2980b9" }}
              >
                {fiche.titre}
              </a>
            </li>
          ))}
        </ul>
      )}
      <button
        onClick={() => (window.location.href = "/fiche-technique")}
        style={{ marginTop: 20, backgroundColor: "#27ae60", color: "white", padding: "6px 12px" }}
      >
        Nouvelle fiche technique
      </button>
    </div>
  );
}
