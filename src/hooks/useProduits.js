// useProduits.js
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
      else console.error("Erreur chargement produits :", error);

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

    if (error) {
      console.error("Erreur ajout produit :", error);
      return;
    }

    if (data?.length > 0) {
      setProduits([...produits, data[0]]);
    }
  }

  async function modifierProduit(id, champ, valeur) {
    const { error } = await supabase
      .from("produits")
      .update({ [champ]: valeur })
      .eq("id", id);

    if (error) {
      console.error("Erreur modification produit :", error);
      return;
    }

    setProduits(
      produits.map((p) => (p.id === id ? { ...p, [champ]: valeur } : p))
    );
  }

  async function supprimerProduit(id) {
    const { error } = await supabase
      .from("produits")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erreur suppression produit :", error);
      return;
    }

    setProduits(produits.filter((p) => p.id !== id));
  }

  return {
    produits,
    chargement,
    ajouterProduit,
    modifierProduit,
    supprimerProduit,
  };
}
