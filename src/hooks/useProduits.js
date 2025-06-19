import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase config
const supabaseUrl = "https://jpemckbycegeloepluwe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZW1ja2J5Y2VnZWxvZXBsdXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzI2NjksImV4cCI6MjA2NTkwODY2OX0.Jx_hQ5aQa3ru8o3S7OQeCULjjbgtclN2AdE5QdJ437c";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useProduits() {
  const [produits, setProduits] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetchProduits();
  }, []);

  async function fetchProduits() {
    setChargement(true);
    const { data, error } = await supabase
      .from("produits")
      .select("*")
      .order("nom", { ascending: true });
    if (!error) setProduits(data);
    setChargement(false);
  }

async function ajouterProduit(prod) {
  console.log("Produit à insérer :", prod);
  const { data, error } = await supabase.from("produits").insert([prod]).select();
  if (error) {
    console.error("Erreur d'insertion :", error.message);
  } else {
    setProduits([...produits, data[0]]);
  }
}


  async function modifierProduit(id, champ, valeur) {
    const updated = champ === "prixHT" ? parseFloat(valeur) : valeur;
    const { error } = await supabase.from("produits").update({ [champ]: updated }).eq("id", id);
    if (!error) {
      setProduits(
        produits.map(p => (p.id === id ? { ...p, [champ]: updated } : p))
      );
    }
  }

  async function supprimerProduit(id) {
    const { error } = await supabase.from("produits").delete().eq("id", id);
    if (!error) {
      setProduits(produits.filter(p => p.id !== id));
    }
  }

  return {
    produits,
    ajouterProduit,
    modifierProduit,
    supprimerProduit,
    chargement,
  };
}
