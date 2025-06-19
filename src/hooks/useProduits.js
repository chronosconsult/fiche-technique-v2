import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useProduits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    async function chargerProduits() {
      setChargement(true);
      setErreur(null);
      const { data, error } = await supabase
        .from('produits')
        .select('*')
        .order('nom', { ascending: true });

      if (error) {
        setErreur('Erreur lors du chargement des produits');
        setProduits([]);
      } else {
        setProduits(data);
      }
      setChargement(false);
    }

    chargerProduits();
  }, []);

  return { produits, chargement, erreur };
}
