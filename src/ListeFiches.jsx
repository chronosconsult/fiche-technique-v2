import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ListeFiches() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fiches, setFiches] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchUserAndFiches = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/connexion");
      } else {
        setUser(user);
        const { data, error } = await supabase
          .from("fiches")
          .select("id, titre")
          .eq("user_id", user.id);
        if (!error) {
          setFiches(data);
        }
      }
    };

    fetchUserAndFiches();
  }, [navigate]);

  const handleNewFiche = () => {
    navigate("/fiche");
  };

  const handlePaiement = () => {
    navigate("/paiement");
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from("fiches").delete().eq("id", id);
    if (!error) {
      setFiches(fiches.filter((fiche) => fiche.id !== id));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t("liste.title")}</h1>
        <div className="flex gap-2">
          <button
            onClick={handleNewFiche}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("liste.new")}
          </button>
          <button
            onClick={handlePaiement}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {t("liste.paiement")}
          </button>
        </div>
      </div>
      <ul className="space-y-4">
        {fiches.map((fiche) => (
          <li
            key={fiche.id}
            className="flex justify-between items-center bg-white p-4 rounded shadow"
          >
            <span>{fiche.titre}</span>
            <button
              onClick={() => handleDelete(fiche.id)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
