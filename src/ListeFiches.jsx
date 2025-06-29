// ListeFiches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";
import { Trash2 } from "lucide-react";

export default function ListeFiches() {
  const { t, i18n } = useTranslation();
  const [fiches, setFiches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {}, [i18n.language]);

  useEffect(() => {
    const chargerFiches = async () => {
      const { data, error } = await supabase
        .from("fiches")
        .select("id, titre");

      if (error) {
        console.error("Erreur chargement fiches:", error);
      } else {
        setFiches(data);
      }
    };

    chargerFiches();
  }, []);

  const supprimerFiche = async (id, e) => {
    e.stopPropagation();
    const { error } = await supabase.from("fiches").delete().eq("id", id);
    if (!error) {
      setFiches(prev => prev.filter(f => f.id !== id));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{t("liste.title")}</h2>
        <button
          onClick={() => navigate("/fiche")}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          {t("liste.new")}
        </button>
      </div>

      {fiches.length === 0 ? (
        <p className="text-gray-600">{t("liste.aucune")}</p>
      ) : (
        <ul className="space-y-2">
          {fiches.map((fiche) => (
            <li
              key={fiche.id}
              className="bg-gray-50 border border-gray-200 rounded p-4 flex justify-between items-center hover:bg-gray-100 transition cursor-pointer"
              onClick={() => navigate(`/fiche/${fiche.id}`)}
            >
              <span className="font-medium text-gray-900">{fiche.titre}</span>
              <button
                onClick={(e) => supprimerFiche(fiche.id, e)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}