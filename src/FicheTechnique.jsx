// src/FicheTechnique.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "./supabaseClient";

export default function FicheTechnique() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [titre, setTitre] = useState("");
  const [nbPortions, setNbPortions] = useState(1);
  const [prixVente, setPrixVente] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [produitSelectionne, setProduitSelectionne] = useState(null);
  const [quantite, setQuantite] = useState("");

  useEffect(() => {
    async function chargerProduits() {
      const { data, error } = await supabase.from("produits").select();
      if (!error) setProduits(data);
    }

    async function chargerFiche() {
      if (!id) return;
      const { data, error } = await supabase.from("fiches").select().eq("id", id).single();
      if (!error && data) {
        setTitre(data.titre);
        setNbPortions(data.nb_portions);
        setPrixVente(data.prix_vente);
        setIngredients(data.ingredients);
      }
    }

    chargerProduits();
    chargerFiche();
  }, [id]);

  const ajouterIngredient = () => {
    if (!produitSelectionne || !quantite) return;
    const produit = produits.find(p => p.id === produitSelectionne);
    const existant = ingredients.find(i => i.nom === produit.nom);
    if (existant) return;
    setIngredients([...ingredients, {
      nom: produit.nom,
      unite: produit.unite,
      prix: produit.prix,
      quantite: parseFloat(quantite)
    }]);
    setQuantite("");
  };

  const modifierQuantite = (index, valeur) => {
    const copie = [...ingredients];
    copie[index].quantite = parseFloat(valeur);
    setIngredients(copie);
  };

  const supprimerIngredient = (index) => {
    const copie = [...ingredients];
    copie.splice(index, 1);
    setIngredients(copie);
  };

  const enregistrer = async () => {
    if (!titre) return alert("Titre obligatoire");

    const fiche = {
      titre,
      nb_portions: nbPortions,
      prix_vente: prixVente,
      ingredients
    };

    let result;
    if (id) {
      result = await supabase.from("fiches").update(fiche).eq("id", id);
    } else {
      result = await supabase.from("fiches").insert(fiche);
    }

    if (result.error) return alert("Erreur d'enregistrement");

    alert("Fiche enregistrée");
    navigate("/fiches");
  };

  const totalHT = ingredients.reduce((acc, i) => acc + i.prix * i.quantite, 0);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fiche Technique</h2>

      <div className="mb-4">
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre"
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={nbPortions}
          onChange={(e) => setNbPortions(e.target.value)}
          className="border px-2 py-1"
        />
        <input
          type="number"
          value={prixVente}
          onChange={(e) => setPrixVente(e.target.value)}
          className="border px-2 py-1"
        />
        <button onClick={enregistrer} className="bg-blue-500 text-white px-4 py-1 rounded">
          Enregistrer
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <select
          className="border px-2 py-1"
          onChange={(e) => setProduitSelectionne(e.target.value)}
        >
          <option value="">-- Choisir un produit --</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>{p.nom}</option>
          ))}
        </select>
        <input
          type="number"
          value={quantite}
          onChange={(e) => setQuantite(e.target.value)}
          className="border px-2 py-1 w-24"
        />
        <button onClick={ajouterIngredient} className="bg-green-500 text-white px-4 py-1 rounded">
          Ajouter
        </button>
      </div>

      <table className="w-full border mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">Produit</th>
            <th className="border px-2 py-1">Quantité</th>
            <th className="border px-2 py-1">Unité</th>
            <th className="border px-2 py-1">PU</th>
            <th className="border px-2 py-1">Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing, i) => (
            <tr key={i}>
              <td className="border px-2 py-1">{ing.nom}</td>
              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={ing.quantite}
                  onChange={(e) => modifierQuantite(i, e.target.value)}
                  className="w-20 border px-1"
                />
              </td>
              <td className="border px-2 py-1">{ing.unite}</td>
              <td className="border px-2 py-1">{ing.prix.toFixed(2)} €</td>
              <td className="border px-2 py-1">{(ing.prix * ing.quantite).toFixed(2)} €</td>
              <td className="border px-2 py-1 text-center">
                <button onClick={() => supprimerIngredient(i)} className="text-red-600">🗑</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 font-bold">Coût total HT : {totalHT.toFixed(2)} €</div>
    </div>
  );
}
