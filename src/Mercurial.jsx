// Mercurial.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient.js";
import { useDevise } from "./contexts/DeviseContext";
import { Trash2 } from "lucide-react";

export default function Mercurial() {
  const { t, i18n } = useTranslation();
  const [produits, setProduits] = useState([]);
  const [userId, setUserId] = useState(null);
  const { devise } = useDevise();

  const [nouveauProduit, setNouveauProduit] = useState({ nom: "", unite: "kg", prixht: "" });

  useEffect(() => {
    async function charger() {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;
      setUserId(user.id);

      const { data, error } = await supabase
        .from("produits")
        .select()
        .eq("user_id", user.id);

      if (!error && data) {
        const vus = new Set();
        const sansDoublons = data.filter(p => {
          if (vus.has(p.id)) return false;
          vus.add(p.id);
          return true;
        });
        sansDoublons.sort((a, b) => a.nom.localeCompare(b.nom));
        setProduits(sansDoublons);
      }
    }
    charger();
  }, [i18n.language]);

  const modifierProduit = async (id, champ, valeur) => {
    const { error } = await supabase
      .from("produits")
      .update({ [champ]: valeur })
      .eq("id", id);
    if (!error) {
      setProduits(prev => {
        const maj = prev.map(p => (p.id === id ? { ...p, [champ]: valeur } : p));
        return [...maj].sort((a, b) => a.nom.localeCompare(b.nom));
      });
    }
  };

  const supprimerProduit = async (id) => {
    const { error } = await supabase
      .from("produits")
      .delete()
      .eq("id", id);
    if (!error) {
      setProduits(prev => prev.filter(p => p.id !== id));
    }
  };

  const ajouterProduit = async () => {
    if (!userId || !nouveauProduit.nom || !nouveauProduit.unite) return;
    const produit = {
      nom: nouveauProduit.nom,
      unite: nouveauProduit.unite,
      prixht: parseFloat(nouveauProduit.prixht || 0),
      user_id: userId
    };
    const { data, error } = await supabase
      .from("produits")
      .insert([produit])
      .select()
      .single();

    if (!error && data) {
      setProduits(prev => [...prev, data].sort((a, b) => a.nom.localeCompare(b.nom)));
      setNouveauProduit({ nom: "", unite: "kg", prixht: "" });
    }
  };

  const formater = new Intl.NumberFormat(i18n.language, {
    style: "currency",
    currency: devise || "EUR",
  });

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        {t("mercurial.title")}
      </h2>

      <button
        onClick={ajouterProduit}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {t("mercurial.boutons.ajouter")}
      </button>

      <table className="w-full table-auto mb-4 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-left">{t("mercurial.table.nom")}</th>
            <th className="border px-4 py-2 text-left">{t("mercurial.table.unite")}</th>
            <th className="border px-4 py-2 text-left">{t("mercurial.table.prixht")}</th>
            <th className="border px-4 py-2 text-center">{t("mercurial.table.actions")}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border px-4 py-2">
              <input
                className="w-full border rounded px-2 py-1"
                value={nouveauProduit.nom}
                onChange={(e) => setNouveauProduit({ ...nouveauProduit, nom: e.target.value })}
              />
            </td>
            <td className="border px-4 py-2">
              <select
                className="w-full border rounded px-2 py-1"
                value={nouveauProduit.unite}
                onChange={(e) => setNouveauProduit({ ...nouveauProduit, unite: e.target.value })}
              >
                <option value="kg">kg</option>
                <option value="l">l</option>
                <option value="pièce">{t("mercurial.fields.piece")}</option>
                <option value="paquet">paquet</option>
              </select>
            </td>
            <td className="border px-4 py-2">
              <input
                type="number"
                step="0.01"
                className="w-full border rounded px-2 py-1"
                value={nouveauProduit.prixht}
                onChange={(e) => setNouveauProduit({ ...nouveauProduit, prixht: e.target.value })}
              />
              <div className="text-sm text-gray-500 italic">
                {formater.format(parseFloat(nouveauProduit.prixht || 0))}
              </div>
            </td>
            <td className="border px-4 py-2 text-center text-sm italic text-gray-400">
              —
            </td>
          </tr>

          {produits.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  value={p.nom || ""}
                  onChange={(e) => modifierProduit(p.id, "nom", e.target.value)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  className="w-full border rounded px-2 py-1"
                  value={p.unite || ""}
                  onChange={(e) => modifierProduit(p.id, "unite", e.target.value)}
                />
              </td>
              <td className="border px-4 py-2">
                <input
                  type="number"
                  className="w-full border rounded px-2 py-1 mb-1"
                  value={p.prixht ?? 0}
                  onChange={(e) => modifierProduit(p.id, "prixht", parseFloat(e.target.value))}
                />
                <div className="text-sm text-gray-500 italic">
                  {formater.format(p.prixht || 0)}
                </div>
              </td>
              <td className="border px-4 py-2 text-center">
                <button
                  onClick={() => supprimerProduit(p.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
