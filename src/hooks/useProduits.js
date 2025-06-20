import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useProduits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      setChargement(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setProduits(data);
      setChargement(false);
    }

    charger();
  }, []);

  async function ajouterProduit(produit) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("produits")
      .insert([{ ...produit, user_id: user.id }])
      .select();

    if (!error && data.length > 0) {
      setProduits([...produits, data[0]]);
    }
  }

  function modifierProduit(id, champ, valeur) {
    setProduits(
      produits.map((p) => (p.id === id ? { ...p, [champ]: valeur } : p))
    );

    supabase.from("produits").update({ [champ]: valeur }).eq("id", id);
  }

  function supprimerProduit(id) {
    setProduits(produits.filter((p) => p.id !== id));
    supabase.from("produits").delete().eq("id", id);
  }

  return {
    produits,
    chargement,
    ajouterProduit,
    modifierProduit,
    supprimerProduit,
  };
}
