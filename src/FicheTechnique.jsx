import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFiches } from "../hooks/useFiches";
import { useProduits } from "../hooks/useProduits";
import { supabase } from "../supabaseClient";

export default function FicheTechnique() {
  const navigate = useNavigate();
  const { fiches, ajouterFiche } = useFiches();
  const { produits } = useProduits();

  const [ficheId, setFicheId] = useState(null);
  const [titre, setTitre] = useState("");
  const [nbPortions, setNbPortions] = useState(1);
  const [prixVente, setPrixVente] = useState(0);
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const titreFiche = params.get("fiche");
    if (titreFiche && fiches.length > 0) {
      const fiche = fiches.find(f => f.titre === titreFiche);
      if (fiche) {
        setFicheId(fiche.id);
        setTitre(fiche.titre);
        setNbPortions(fiche.nbPortions);
        setPrixVente(fiche.prixVente);
        setIngredients(fiche.ingredients || []);
      }
    }
  }, [fiches]);

  const ajouterIngredient = (produit) => {
    if (ingredients.find(i => i.nom === produit.nom)) return;
    setIngredients([...ingredients, { ...produit, quantite: 1 }]);
  };

  const modifierQuantite = (index, valeur) => {
    const copie = [...ingredients];
    copie[index].quantite = valeur;
    setIngredients(copie);
  };

  const supprimerIngredient = (index) => {
    const copie = [...ingredients];
    copie.splice(index, 1);
    setIngredients(copie);
  };

  const enregistrerFiche = async () => {
    if (!titre) return alert("Titre obligatoire");
    const fiche = { titre, nbPortions, prixVente, ingredients };

    if (ficheId) {
      const { error } = await supabase
        .from('fiches')
        .update(fiche)
        .eq('id', ficheId);

      if (error) {
        console.error(error);
        return alert("Erreur lors de la mise à jour.");
      }

      alert("Fiche mise à jour.");
    } else {
      await ajouterFiche(fiche);
      alert("Fiche enregistrée.");
    }
    navigate("/liste-fiches");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fiche Technique</h2>
      <div className="mb-4">
        <input
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre de la fiche"
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label>Nombre de portions :</label>
        <input
          type="number"
          value={nbPortions}
          onChange={(e) => setNbPortions(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label>Prix de vente :</label>
        <input
          type="number"
          value={prixVente}
          onChange={(e) => setPrixVente(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Produits disponibles</h3>
        <div className="flex flex-wrap gap-2">
          {produits.map((p) => (
            <button
              key={p.nom}
              onClick={() => ajouterIngredient(p)}
              className="bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded"
            >
              {p.nom}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <h3 className="font-semibold">Ingrédients de la fiche</h3>
        <ul className="space-y-2">
          {ingredients.map((ing, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="flex-1">{ing.nom}</span>
              <input
                type="number"
                value={ing.quantite}
                onChange={(e) => modifierQuantite(index, Number(e.target.value))}
                className="border p-1 rounded w-20"
              />
              <span>{ing.unite}</span>
              <button
                onClick={() => supprimerIngredient(index)}
                className="text-red-500 hover:text-red-700"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={enregistrerFiche}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Enregistrer la fiche
      </button>
    </div>
  );
}
