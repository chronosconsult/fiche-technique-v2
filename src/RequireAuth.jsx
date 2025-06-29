// RequireAuth.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function RequireAuth({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trialExpired, setTrialExpired] = useState(false);
  const [joursRestants, setJoursRestants] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Vérification de confirmation de l'adresse e-mail
      if (!session.user.confirmed_at) {
        alert("Veuillez confirmer votre adresse e-mail pour accéder à l'application.");
        setUser(null);
        setLoading(false);
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email;
      setUser(session.user);

      let { data: profil, error } = await supabase
        .from("profils")
        .select("trial_start")
        .eq("user_id", userId)
        .single();

      if (!profil || error) {
        const { error: insertError } = await supabase.from("profils").insert([
          {
            id: userId,
            nom: userEmail || "Utilisateur",
            trial_start: new Date().toISOString(),
          },
        ]);

        if (insertError) {
          setTrialExpired(true);
          setLoading(false);
          return;
        }

        profil = { trial_start: new Date().toISOString() };
      }

      const startDate = new Date(profil.trial_start);
      const now = new Date();
      const diff = now.getTime() - startDate.getTime();
      const jours = Math.floor(diff / (1000 * 60 * 60 * 24));

      setJoursRestants(30 - jours);
      setTrialExpired(jours >= 30);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return null;
  if (!user) return <Navigate to="/connexion" replace />;
  if (trialExpired)
    return (
      <div style={{ maxWidth: 400, margin: "5rem auto", fontFamily: "Arial", textAlign: "center" }}>
        <h2 style={{ color: "#c0392b" }}>Période d’essai terminée</h2>
        <p>Votre période de test de 30 jours est expirée.</p>
        <p>Contactez-nous pour débloquer l’accès ou souscrire à un abonnement.</p>
      </div>
    );

  return (
    <div>
      {joursRestants !== null && (
        <div style={{ background: "#f1c40f", padding: 10, textAlign: "center", fontWeight: "bold" }}>
          Il vous reste {joursRestants} jour{joursRestants === 1 ? "" : "s"} d’essai gratuit
        </div>
      )}
      {children}
    </div>
  );
}