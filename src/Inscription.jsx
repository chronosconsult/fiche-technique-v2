// Inscription.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";
import { initProduits } from "./utils/initProduits.js";

export default function Inscription() {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [devise, setDevise] = useState("EUR");
  const navigate = useNavigate();

  useEffect(() => {}, [i18n.language]);

  async function inscrire() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    });

    if (error) {
      alert(t("errors.signup_failed") + " : " + error.message);
      return;
    }

    const user = data?.user;
    if (!user) {
      alert(t("errors.signup_failed"));
      return;
    }

    await supabase.from("profils").insert({
      user_id: user.id,
      nom: email,
      trial_start: new Date().toISOString(),
      devise: devise
    });

    await initProduits(user.id, i18n.language);

    alert(t("signup.success"));
    navigate("/connexion");
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">{t("signup.title")}</h2>
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder={t("login.email")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="w-full mb-2 p-2 border rounded"
        placeholder={t("login.password")}
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />
      <select
        className="w-full mb-4 p-2 border rounded"
        value={devise}
        onChange={(e) => setDevise(e.target.value)}
      >
        <option value="EUR">Euro (€)</option>
        <option value="USD">Dollar US ($)</option>
        <option value="GBP">Livre (£)</option>
        <option value="XOF">Franc CFA (Ouest)</option>
        <option value="XAF">Franc CFA (Centre)</option>
        <option value="MXN">Peso Mexicain</option>
        <option value="COP">Peso Colombien</option>
        <option value="NGN">Naira (Nigéria)</option>
        <option value="GHS">Cedi (Ghana)</option>
      </select>
      <button
        onClick={inscrire}
        className="w-full bg-green-600 text-white p-2 rounded"
      >
        {t("signup.submit")}
      </button>
    </div>
  );
}
