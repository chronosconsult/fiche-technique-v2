import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useProduits() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function chargerProduits() {
      try {
        const { data, error } = await supabase.from("produits").select("*");
        if (error) {
          setErreur(error.message);
          setProduits([]);
        } else {
          setProduits(data || []);
        }
      } catch (err) {
        setErreur("Erreur chargement produits : " + err.message);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    }

    chargerProduits();
  }, []);

  return { produits, loading, erreur };
}
