import React, { useState, useEffect } from "react";
import useProduits from "./hooks/useProduits";
import useFiches from "./hooks/useFiches";

export default function FicheTechnique() {
  const [titre, setTitre] = useState("");
  const [nbPortions, setNbPortions] = useState(1);
  const [prixVente, setPrixVente] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const { produits } = useProduits();
  const { fiches, ajouterFiche } = useFiches();
  const [ajout, setAjout] = useState({ filtre: "", produitId: "", quantite: "" });

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const titreFiche = params.get("fiche");
  if (titreFiche && fiches.length > 0) {
    const fiche = fiches.find(f => f.titre === titreFiche);
    if (fiche) {
      setTitre(fiche.titre);
      setNbPortions(fiche.nbPortions);
      setPrixVente(fiche.prixVente);
      setIngredients(fiche.ingredients || []);
    }
  }
}, [fiches]);


  const ajouterIngredient = () => {
    const produit = produits.find(p => p.id.toString() === ajout.produitId);
    if (!produit || !ajout.quantite) return;
    setIngredients([
      ...ingredients,
      { id: produit.id, quantite: parseFloat(ajout.quantite) }
    ]);
    setAjout({ filtre: "", produitId: "", quantite: "" });
  };

  const enregistrerFiche = () => {
    if (!titre) return alert("Titre obligatoire");
    const fiche = { titre, nbPortions, prixVente, ingredients };
    ajouterFiche(fiche);
    alert("Fiche enregistrée.");
  };

  const ingredientsComplet = ingredients.map(ing => {
    const produit = produits.find(p => p.id === ing.id);
    return produit ? { ...produit, quantite: ing.quantite } : null;
  }).filter(Boolean);

const totalHT = ingredientsComplet.reduce(
  (sum, ing) => sum + (ing.prixHT * ing.quantite * (ing.unite === "g" || ing.unite === "cl" ? 0.001 : 1)),
  0
);
const totalTTC = totalHT * 1.1;
const coutParPortionTTC = nbPortions > 0 ? totalTTC / nbPortions : 0;
const margeTTC = prixVente > 0 ? ((prixVente - coutParPortionTTC) / prixVente) * 100 : 0;


  const produitsFiltres = produits.filter(p =>
    p.nom.toLowerCase().includes(ajout.filtre.toLowerCase())
  ).sort((a, b) => a.nom.localeCompare(b.nom));

  return (
    <div style={{ padding: 20, maxWidth: 1000, fontFamily: "Arial", backgroundColor: "#fdfdfc" }}>
      <h2 style={{ borderBottom: "2px solid #444", color: "#2c3e50" }}>FICHE TECHNIQUE</h2>

      <div style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <label style={{ flex: 1 }}>Titre :<br />
          <input style={{ width: '100%' }} value={titre} onChange={e => setTitre(e.target.value)} />
        </label>
        <label>Portions :<br />
          <input type="number" value={nbPortions} onChange={e => setNbPortions(Number(e.target.value))} />
        </label>
        <label>Prix vente TTC :<br />
          <input type="number" value={prixVente} onChange={e => setPrixVente(Number(e.target.value))} />
        </label>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => window.location.href = '/mercurial'} style={{ backgroundColor: "#27ae60", color: "white", padding: "6px 12px", marginRight: 10 }}>
          Gérer le Mercurial
        </button>
        <button onClick={() => window.location.href = '/fiches'} style={{ backgroundColor: "#8e44ad", color: "white", padding: "6px 12px", marginRight: 10 }}>
          Consulter les fiches techniques
        </button>
        <button onClick={enregistrerFiche} style={{ backgroundColor: "#2980b9", color: "white", padding: "6px 12px" }}>
          Enregistrer la fiche
        </button>
      </div>

      <h3 style={{ color: "#2c3e50" }}>Ajouter un ingrédient à la fiche</h3>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        <input
          placeholder="Filtrer..."
          value={ajout.filtre}
          onChange={e => {
            const lettre = e.target.value;
            const premiersProduits = produits
              .filter(p => p.nom.toLowerCase().startsWith(lettre.toLowerCase()))
              .sort((a, b) => a.nom.localeCompare(b.nom));
            setAjout({ ...ajout, filtre: lettre, produitId: premiersProduits[0]?.id?.toString() || "" });
          }}
        />
        <select
          value={ajout.produitId}
          onChange={e => setAjout({ ...ajout, produitId: e.target.value })}
        >
          <option value="">Choisir produit</option>
          {produitsFiltres.map(p => (
            <option key={p.id} value={p.id}>{p.nom} ({p.unite}) - {p.prixHT} €</option>
          ))}
        </select>
        <input type="number" placeholder="Quantité" value={ajout.quantite} onChange={e => setAjout({ ...ajout, quantite: e.target.value })} />
        <button onClick={ajouterIngredient} style={{ backgroundColor: "#2980b9", color: "white" }}>Ajouter</button>
      </div>

      <table border="1" cellPadding="5" style={{ width: "100%", marginBottom: 20, backgroundColor: "#fff" }}>
        <thead style={{ backgroundColor: "#ecf0f1" }}>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Unité</th>
            <th>PU HT</th>
            <th>Total ligne</th>
          </tr>
        </thead>
        <tbody>
          {ingredientsComplet.map((ing, idx) => (
            <tr key={idx}>
              <td>{ing.nom}</td>
              <td>{ing.quantite}</td>
              <td>{ing.unite}</td>
              <td>{ing.prixHT.toFixed(2)} €</td>
              <td>{(ing.quantite * ing.prixHT * (ing.unite === "g" || ing.unite === "cl" ? 0.001 : 1)).toFixed(2)} €</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ fontSize: 16, lineHeight: 1.8, backgroundColor: "#f8f9fa", padding: 10 }}>
        <strong>Coût total HT :</strong> {totalHT.toFixed(2)} €<br />
        <strong>Coût total TTC :</strong> {totalTTC.toFixed(2)} €<br />
        <strong>Coût unitaire TTC / portion :</strong> {coutParPortionTTC.toFixed(2)} €<br />
        <strong>Marge TTC :</strong> {margeTTC.toFixed(1)} %

      </div>
    </div>
  );
}
