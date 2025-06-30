// FicheTechnique.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient.js";
import { useDevise } from "./contexts/DeviseContext";

export default function FicheTechnique() {
  const { t, i18n } = useTranslation();
  const { devise } = useDevise();
  const [titre, setTitre] = useState("");
  const [nbPortions, setNbPortions] = useState(1);
  const [prixVente, setPrixVente] = useState(0);
  const [ingredients, setIngredients] = useState([]);
  const [produits, setProduits] = useState([]);
  const [ajout, setAjout] = useState({ filtre: "", produitId: "", quantite: "" });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {}, [i18n.language]);

  useEffect(() => {
    async function chargerDonnees() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data: prodData, error: prodError } = await supabase
        .from("produits")
        .select()
        .eq("user_id", user.id);
      if (!prodError) setProduits(prodData);

      if (id) {
        const { data: ficheData, error: ficheError } = await supabase
          .from("fiches")
          .select()
          .eq("id", id)
          .single();
        if (!ficheError && ficheData) {
          setTitre(ficheData.titre);
          setNbPortions(ficheData.nbPortions);
          setPrixVente(ficheData.prixVente || 0);
          setIngredients(ficheData.ingredients || []);
        }
      }
    }
    chargerDonnees();
  }, [id]);

  const formater = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: devise || "EUR",
  });

  function ajouterIngredient() {
    const produit = produits.find(p => p.id.toString() === ajout.produitId);
    if (!produit || !ajout.quantite) return;
    setIngredients([
      ...ingredients,
      { id: produit.id, quantite: parseFloat(ajout.quantite) }
    ]);
    setAjout({ filtre: "", produitId: "", quantite: "" });
  }

  async function enregistrerFiche() {
    if (!titre) return alert(t("fiche.messages.titre_obligatoire"));

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return alert(t("fiche.messages.non_connecte"));

    const fiche = {
      titre,
      nbPortions,
      prixVente,
      ingredients,
      ...(id ? {} : { user_id: user.id })
    };

    let result;
    if (id) {
      result = await supabase.from("fiches").update(fiche).eq("id", id);
    } else {
      result = await supabase.from("fiches").insert(fiche);
    }

    if (result.error) {
      console.error(result.error);
      alert(t("fiche.messages.erreur_enregistrement"));
    } else {
      alert(t("fiche.messages.fiche_enregistree"));
      navigate("/");
    }
  }

  const ingredientsComplet = ingredients
    .map(ing => {
      const produit = produits.find(p => p.id === ing.id);
      return produit ? { ...produit, quantite: ing.quantite } : null;
    })
    .filter(Boolean);

  const convertirQuantite = (quantite, unite) => {
    return unite === "g" || unite === "cl" ? quantite / 1000 : quantite;
  };

  const totalHT = ingredientsComplet.reduce(
    (sum, ing) => sum + ing.prix * convertirQuantite(ing.quantite, ing.unite),
    0
  );

  const coutParPortion = nbPortions > 0 ? totalHT / nbPortions : 0;
  const marge = prixVente > 0 ? ((prixVente - coutParPortion) / prixVente) * 100 : 0;

  const produitsFiltres = produits
    .filter(p => p.nom.toLowerCase().includes(ajout.filtre.toLowerCase()))
    .sort((a, b) => a.nom.localeCompare(b.nom));

  return (
    <div className="p-8 max-w-5xl mx-auto font-sans bg-white shadow rounded">
      <h2 className="text-2xl font-bold text-gray-800 border-b border-gray-400 pb-2 mb-6">
        {t("fiche.title")}
      </h2>

      <div className="flex flex-wrap gap-4 mb-6">
        <label className="flex-1">
          <span className="block text-sm font-semibold">{t("fiche.fields.titre")} :</span>
          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mt-1"
            value={titre}
            onChange={e => setTitre(e.target.value)}
          />
        </label>
        <label>
          <span className="block text-sm font-semibold">{t("fiche.fields.portions")} :</span>
          <input
            type="number"
            className="border border-gray-300 rounded px-3 py-2 mt-1"
            value={nbPortions}
            onChange={e => setNbPortions(Number(e.target.value))}
          />
        </label>
        <label>
          <span className="block text-sm font-semibold">{t("fiche.fields.prix_vente")} :</span>
          <input
            type="number"
            className="border border-gray-300 rounded px-3 py-2 mt-1"
            value={prixVente}
            onChange={e => setPrixVente(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => navigate("/mercurial")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {t("fiche.buttons.gerer_mercurial")}
        </button>
        <button
          onClick={enregistrerFiche}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {t("fiche.buttons.enregistrer")}
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {t("fiche.ajout.title")}
      </h3>
      <div className="flex flex-wrap gap-2 items-end mb-4">
        <input
          type="text"
          placeholder={t("fiche.ajout.filtrer")}
          className="border border-gray-300 rounded px-3 py-2"
          value={ajout.filtre}
          onChange={e => {
            const lettre = e.target.value;
            const premiers = produits
              .filter(p => p.nom.toLowerCase().startsWith(lettre.toLowerCase()))
              .sort((a, b) => a.nom.localeCompare(b.nom));
            setAjout({ filtre: lettre, produitId: premiers[0]?.id?.toString() || "", quantite: "" });
          }}
        />
        <select
          className="border border-gray-300 rounded px-3 py-2"
          value={ajout.produitId}
          onChange={e => setAjout({ ...ajout, produitId: e.target.value })}
        >
          <option value="">{t("fiche.ajout.choisir")}</option>
          {produitsFiltres.map(p => (
            <option key={p.id} value={p.id}>
              {p.nom} ({p.unite}) - {formater.format(p.prix)}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder={t("fiche.ajout.quantite")}
          className="border border-gray-300 rounded px-3 py-2"
          value={ajout.quantite}
          onChange={e => setAjout({ ...ajout, quantite: e.target.value })}
        />
        <button onClick={ajouterIngredient} className="bg-blue-600 text-white px-4 py-2 rounded">
          {t("fiche.buttons.ajouter")}
        </button>
      </div>

      <table className="w-full table-auto border border-gray-300 mb-6">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">{t("fiche.table.produit")}</th>
            <th className="border px-4 py-2 text-left">{t("fiche.table.quantite")}</th>
            <th className="border px-4 py-2 text-left">{t("fiche.table.unite")}</th>
            <th className="border px-4 py-2 text-left">{t("fiche.table.pu")}</th>
            <th className="border px-4 py-2 text-left">{t("fiche.table.total")}</th>
          </tr>
        </thead>
        <tbody>
          {ingredientsComplet.map((ing, idx) => {
            const total = convertirQuantite(ing.quantite, ing.unite) * ing.prix;
            return (
              <tr key={idx}>
                <td className="border px-4 py-2">{ing.nom}</td>
                <td className="border px-4 py-2">{ing.quantite}</td>
                <td className="border px-4 py-2">{ing.unite}</td>
                <td className="border px-4 py-2">{formater.format(ing.prix)}</td>
                <td className="border px-4 py-2">{formater.format(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="bg-gray-50 border border-gray-200 p-4 rounded text-sm">
        <p><strong>{t("fiche.recap.total")} :</strong> {formater.format(totalHT)}</p>
        <p><strong>{t("fiche.recap.unitaire")} :</strong> {formater.format(coutParPortion)}</p>
        <p><strong>{t("fiche.recap.marge")} :</strong> {marge.toFixed(1)} %</p>
      </div>
    </div>
  );
}