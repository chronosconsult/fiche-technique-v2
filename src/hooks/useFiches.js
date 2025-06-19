import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Configuration Supabase
const supabaseUrl = "https://jpemckbycegeloepluwe.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZW1ja2J5Y2VnZWxvZXBsdXdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMzI2NjksImV4cCI6MjA2NTkwODY2OX0.Jx_hQ5aQa3ru8o3S7OQeCULjjbgtclN2AdE5QdJ437c";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function useFiches() {
  const [fiches, setFiches] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetchFiches();
  }, []);

  async function fetchFiches() {
    setChargement(true);
    const { data, error } = await supabase
      .from("fiches")
      .select("*")
      .order("titre", { ascending: true });
    if (!error) setFiches(data);
    setChargement(false);
  }

  async function ajouterFiche(fiche) {
    const { data, error } = await supabase.from("fiches").insert([fiche]).select();
    if (error) {
      console.error("Erreur insertion fiche :", error.message);
    } else {
      setFiches([...fiches, data[0]]);
    }
  }

  return {
    fiches,
    ajouterFiche,
    chargement,
  };
}
