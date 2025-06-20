import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useFiches() {
  const [fiches, setFiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function chargerFiches() {
      try {
        const { data, error } = await supabase.from("fiches").select("*");
        if (error) {
          setErreur(error.message);
          setFiches([]);
        } else {
          setFiches(data || []);
        }
      } catch (err) {
        setErreur("Erreur chargement fiches : " + err.message);
        setFiches([]);
      } finally {
        setLoading(false);
      }
    }

    chargerFiches();
  }, []);

  return { fiches, loading, erreur };
}
