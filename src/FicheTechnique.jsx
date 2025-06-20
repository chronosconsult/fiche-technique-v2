import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function FicheTechnique() {
  const [titre, setTitre] = useState("");
  const [nbPortions, setNbPortions] = useState(1);
  const [ingredients, setIngredients] = useState([]);
  const [produits, setProduits] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProduits();
    if (id) fetchFiche();
  }, [id]);

  async function fetchProduits() {
    const { data, error } = await supabase.from("produits").select();
    if (!error) setProduits(data);
  }

  async function fetchFiche() {
    const { data, error } = await supabase.from("fiches").select().eq("id", id).single();
    if (!error && data) {
      setTitre(data.titre);
      setNbPortions(data.nbPortions);
      setIngredients(data.ingredients || []);
    }
  }

  function ajouterIngredient(produit) {
    if (!produit || ingredients.find((i) => i.nom === produit.nom)) return;
    setIngredients([...ingredients, { ...produit, quantite: 1 }]);
  }

  function modifierQuantite(index, valeur) {
    const copie = [...ingredients];
    copie[index].quantite = valeur;
    setIngredients(copie);
  }

  function supprimerIngredient(index) {
    const copie = [...ingredients];
    copie.splice(index, 1);
    setIngredients(copie);
  }

  async function enregistrerFiche() {
    if (!titre) return alert("Titre obligatoire !");
    const fiche = { titre, nbPortions, ingredients };

    let result;
    if (id) {
      result = await supabase.from("fiches").update(fiche).eq("id", id);
    } else {
      result = await supabase.from("fiches").insert(fiche);
    }

    if (result.error) {
      console.error(result.error);
      alert("Erreur lors de l'enregistrement.");
    } else {
      alert("Fiche enregistrée.");
      navigate("/liste-fiches");
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fiche Technique</h2>

      <div className="mb-4">
        <label className="block mb-1">Titre :</label>
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre de la fiche"
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Portions :</label>
        <input
          type="number"
          value={nbPortions}
          onChange={(e) => setNbPortions(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Ajouter un ingrédient :</label>
        <select
          onChange={(e) => {
            const produit = produits.find((p) => p.id === Number(e.target.value));
            if (produit) ajouterIngredient(produit);
          }}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Choisir un produit --</option>
          {produits.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nom}
            </option>
          ))}
        </select>
      </div>

      <table className="w-full border mt-4">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Unité</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ing, index) => (
            <tr key={index}>
              <td>{ing.nom}</td>
              <td>
                <input
                  type="number"
                  value={ing.quantite}
                  onChange={(e) => modifierQuantite(index, Number(e.target.value))}
                  className="border p-1 w-20"
                />
              </td>
              <td>{ing.unite}</td>
              <td>
                <button
                  onClick={() => supprimerIngredient(index)}
                  className="text-red-600"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={enregistrerFiche}
        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Enregistrer la fiche
      </button>
    </div>
  );
}
