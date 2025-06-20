// src/ListeFiches.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabaseClient";


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
            className="bg-white border rounded p-2 cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/fiche?id=${fiche.id}`)}
          >
            {fiche.titre}
          </li>
        ))}
      </ul>
    </div>
  );
}
