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

      const user = data?.user || data?.session?.user;
      if (!user || !user.id) {
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

      const produitsParDefaut = Array.from({ length: 100 }).map((_, i) => {
        const baseProduits = [
          ["Lait entier", "L", 0.95],
          ["Beurre doux", "kg", 6.5],
          ["Farine T55", "kg", 1.2],
          ["Sucre semoule", "kg", 1.1],
          ["Oeufs calibre moyen", "unite", 0.22],
          ["Crème liquide 30%", "L", 3.4],
          ["Sel fin", "kg", 0.6],
          ["Poivre noir moulu", "kg", 8.2],
          ["Tomate grappe", "kg", 2.8],
          ["Courgette", "kg", 2.6],
          ["Carotte", "kg", 1.3],
          ["Pomme de terre", "kg", 1.0],
          ["Oignon jaune", "kg", 1.2],
          ["Ail", "kg", 5.5],
          ["Riz basmati", "kg", 2.4],
          ["Pâtes penne", "kg", 1.5],
          ["Saumon fumé", "kg", 22.5],
          ["Blanc de poulet", "kg", 9.8],
          ["Boeuf haché 15%", "kg", 11.2],
          ["Filet de cabillaud", "kg", 16.0],
          ["Épinards frais", "kg", 3.1],
          ["Brocoli", "kg", 2.9],
          ["Haricots verts", "kg", 3.2],
          ["Champignons de Paris", "kg", 4.1],
          ["Huile d'olive", "L", 5.9],
          ["Vinaigre balsamique", "L", 3.1],
          ["Pain de mie", "kg", 2.2],
          ["Baguette tradition", "unite", 1.1],
          ["Levure boulangère", "kg", 9.0],
          ["Chocolat noir pâtissier", "kg", 6.8],
          ["Yaourt nature", "unite", 0.45],
          ["Fromage râpé", "kg", 7.2],
          ["Mozzarella", "kg", 6.3],
          ["Thon en conserve", "kg", 5.8],
          ["Maïs doux", "kg", 2.4],
          ["Pois chiches", "kg", 2.6],
          ["Lentilles vertes", "kg", 2.3],
          ["Haricots rouges", "kg", 2.5],
          ["Tofu nature", "kg", 3.7],
          ["Steak végétal", "unite", 2.1],
          ["Pâte feuilletée", "kg", 4.1],
          ["Pâte brisée", "kg", 3.8],
          ["Crème dessert vanille", "unite", 0.55],
          ["Glace chocolat", "L", 3.9],
          ["Café moulu", "kg", 12.5],
          ["Thé vert", "kg", 18.4],
          ["Jus d'orange", "L", 1.8],
          ["Eau minérale", "L", 0.5],
          ["Soda cola", "L", 1.2],
          ["Bière blonde", "L", 2.4],
          ["Vin rouge", "L", 4.5],
          ["Cidre brut", "L", 3.1]
        ];
        const [nom, unite, prixHT] = baseProduits[i % baseProduits.length];
        return { nom: `${nom} ${Math.floor(i / baseProduits.length) + 1}`, unite, prixHT };
      });

      const produitsAvecUser = produitsParDefaut.map((p) => ({ ...p, user_id: user.id }));
      const { error: produitsErr } = await supabase.from("produits").insert(produitsAvecUser);

      if (produitsErr) {
        setErreur("Produits initiaux non chargés : " + produitsErr.message);
        return;
      }

      navigate("/");
    } catch (err) {
      setErreur("Erreur inattendue : " + err.message);
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "3rem auto", padding: 30, border: "1px solid #ddd", borderRadius: 8, fontFamily: "Arial", backgroundColor: "#fff" }}>
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
            minLength={6}
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{ width: "100%", padding: 8, marginTop: 4 }}
          />
        </div>
        {erreur && <p style={{ color: "red", fontSize: 14 }}>{erreur}</p>}
        <button type="submit" style={{ backgroundColor: "#2ecc71", color: "white", padding: "10px 0", fontWeight: "bold", border: "none", borderRadius: 4, cursor: "pointer" }}>
          Créer mon compte gratuit
        </button>
      </form>
    </div>
  );
}
