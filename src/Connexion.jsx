import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  async function handleConnexion(e) {
    e.preventDefault();
    setErreur("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      setErreur("Email ou mot de passe incorrect");
      return;
    }

    navigate("/");
  }

  return (
    <div style={{ maxWidth: 400, margin: "3rem auto", padding: 30, border: "1px solid #ddd", borderRadius: 8, fontFamily: "Arial", backgroundColor: "#fff" }}>
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 20 }}>Connexion</h2>

      <form onSubmit={handleConnexion} style={{ display: "flex", flexDirection: "column", gap: 15 }}>
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
        <button type="submit" style={{ backgroundColor: "#3498db", color: "white", padding: "10px 0", fontWeight: "bold", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Se connecter
        </button>
      </form>
    </div>
  );
}
