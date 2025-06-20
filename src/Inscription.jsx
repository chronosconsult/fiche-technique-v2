import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Inscription() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  async function handleInscription(e) {
    e.preventDefault();
    setErreur("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: motDePasse,
      });

      if (error) {
        setErreur(error.message || "Erreur lors de l’inscription.");
        return;
      }

      const user = data.user || data.session?.user;
      if (!user) {
        setErreur("Utilisateur introuvable après l'inscription.");
        return;
      }

      const { error: insertError } = await supabase.from("profils").insert([
        {
          id: user.id,
          nom: nom,
          trial_start: new Date(),
        },
      ]);

      if (insertError) {
        setErreur("Profil non enregistré : " + insertError.message);
        return;
      }

      navigate("/");
    } catch (err) {
      setErreur("Erreur inattendue : " + err.message);
    }
  }

  return (
    <div style={{
      maxWidth: 420,
      margin: "3rem auto",
      padding: 30,
      border: "1px solid #ddd",
      borderRadius: 8,
      fontFamily: "Arial",
      backgroundColor: "#fff"
    }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 10 }}>Créer un compte</h2>
      <p style={{ textAlign: "center", fontSize: 14, color: "#555", marginBottom: 20 }}>
        Accédez gratuitement à l'application pendant 30 jours.
      </p>

      <form onSubmit={handleInscription} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <div>
          <label>Nom d’utilisateur</label>
          <input
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {erreur && <p style={{ color: "red", fontSize: 14 }}>{erreur}</p>}
        <button type="submit" style={{
          backgroundColor: "#2ecc71",
          color: "white",
          padding: "10px 0",
          fontWeight: "bold",
          border: "none",
          borderRadius: 4,
          cursor: "pointer"
        }}>
          Créer mon compte gratuit
        </button>
      </form>
    </div>
  );
}
