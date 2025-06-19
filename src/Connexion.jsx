import { useState } from "react";
import { supabase } from "./hooks/useProduits";
import { useNavigate } from "react-router-dom";

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
      setErreur("Identifiants incorrects.");
    } else {
      navigate("/"); // redirige vers la page d'accueil si connexion réussie
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleConnexion}>
        <div>
          <label>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
          />
        </div>
        {erreur && <p style={{ color: "red" }}>{erreur}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
}
