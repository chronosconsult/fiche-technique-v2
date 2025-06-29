// Connexion.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import { useTranslation } from "react-i18next";

export default function Connexion() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const navigate = useNavigate();

  useEffect(() => {}, [i18n.language]);

  async function handleConnexion(e) {
    e.preventDefault();
    setErreur("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error || !data.session) {
      setErreur(t("errors.login_failed"));
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      navigate("/fiches");
    } else {
      setErreur(t("errors.login_failed"));
    }
  }

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "3rem auto",
        padding: 30,
        border: "1px solid #ddd",
        borderRadius: 8,
        fontFamily: "Arial",
        backgroundColor: "#fff",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#2c3e50", marginBottom: 20 }}>
        {t("login.title")}
      </h2>

      <form
        onSubmit={handleConnexion}
        style={{ display: "flex", flexDirection: "column", gap: 15 }}
      >
        <div>
          <label>{t("login.email")}</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              border: "2px solid #3498db",
              borderRadius: 6,
            }}
          />
        </div>
        <div>
          <label>{t("login.password")}</label>
          <input
            type="password"
            required
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              marginTop: 4,
              border: "2px solid #3498db",
              borderRadius: 6,
            }}
          />
        </div>
        {erreur && <p style={{ color: "red", fontSize: 14 }}>{erreur}</p>}
        <button
          type="submit"
          style={{
            backgroundColor: "#3498db",
            color: "white",
            padding: "10px 0",
            fontWeight: "bold",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          {t("login.submit")}
        </button>
      </form>

      <p style={{ textAlign: "center", marginTop: 20, fontSize: 14 }}>
        {t("login.no_account")}{" "}
        <Link to="/inscription">{t("login.create_account")}</Link>
      </p>
    </div>
  );
}
