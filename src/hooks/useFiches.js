// useFiches.js
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useFiches() {
  const [fiches, setFiches] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    async function charger() {
      setChargement(true);
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;
      if (!user) return;

      const { data, error } = await supabase
        .from("fiches")
        .select("*")
        .eq("user_id", user.id);

      if (!error) setFiches(data);
      else console.error("Erreur chargement fiches :", error);

      setChargement(false);
    }

    charger();
  }, []);

  async function ajouterFiche(fiche) {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return;

    const { data, error } = await supabase
      .from("fiches")
      .insert([{ ...fiche, user_id: user.id }])
      .select();

    if (error) {
      console.error("Erreur ajout fiche :", error);
      return;
    }

    if (data?.length > 0) {
      setFiches([...fiches, data[0]]);
    }
  }

  return {
    fiches,
    chargement,
    ajouterFiche,
  };
}
