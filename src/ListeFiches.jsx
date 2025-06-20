import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function ListeFiches() {
  const [fiches, setFiches] = useState([]);
  const navigate = useNavigate();

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

  const supprimerFiche = async (id) => {
    if (!window.confirm("Supprimer cette fiche ?")) return;

    const { error } = await supabase.from("fiches").delete().eq("id", id);
    if (error) {
      console.error("Erreur suppression:", error);
      alert("Erreur lors de la suppression.");
    } else {
      setFiches(fiches.filter((fiche) => fiche.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Fiches Techniques</h2>
      <button
        onClick={() => navigate("/fiche")}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        Nouvelle fiche technique
      </button>
      <ul className="space-y-2">
        {fiches.map((fiche) => (
          <li
            key={fiche.id}
            className="flex justify-between items-center bg-white border rounded p-2"
          >
            <span
              className="cursor-pointer text-blue-600 hover:underline"
              onClick={() => navigate(`/fiche?id=${fiche.id}`)}
            >
              {fiche.titre}
            </span>
            <button
              onClick={() => supprimerFiche(fiche.id)}
              className="text-red-600 hover:text-red-800"
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
