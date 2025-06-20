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

    const { error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { nom },
      },
    });

    if (error) {
      setErreur(error.message || "Erreur lors de l’inscription");
    } else {
      navigate("/");
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial" }}>
      <h2>Créer un compte</h2>
      <form onSubmit={handleInscription}>
        <div>
          <label>Nom d’utilisateur</label>
          <input
            required
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </div>
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
        <button type="submit">Créer un compte</button>
      </form>
    </div>
  );
}
