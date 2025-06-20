import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Mercurial() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        fetchProduits(user.id);
      } else {
        setProduits([]);
        setLoading(false);
      }
    });
  }, []);

  async function fetchProduits(uid) {
    setLoading(true);
    const { data, error } = await supabase
      .from("produits")
      .select("*")
      .eq("user_id", uid)
      .order("nom");
    if (error) console.error(error);
    else setProduits(data);
    setLoading(false);
  }

  async function handleChange(id, field, value) {
    setProduits((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    await supabase.from("produits").update({ [field]: value }).eq("id", id);
  }

  async function handleDelete(id) {
    await supabase.from("produits").delete().eq("id", id);
    setProduits((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p>Chargement…</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => navigate("/")}
          style={{ backgroundColor: "#3498db", color: "white", padding: "10px 20px", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}
        >
          Retour à la fiche technique
        </button>
      </div>

      <h2 style={{ marginBottom: 20 }}>Mercurial – vos produits</h2>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 30 }}>
        <thead>
          <tr>
            {"Nom,Unité,Prix HT,Actions".split(",").map((h) => (
              <th key={h} style={{ borderBottom: "1px solid #ccc", padding: 8 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 4 }}>
                <input
                  value={p.nom}
                  onChange={(e) => handleChange(p.id, "nom", e.target.value)}
                  style={{ width: "100%" }}
                />
              </td>
              <td style={{ padding: 4, textAlign: "center" }}>
                <input
                  value={p.unite || ""}
                  onChange={(e) => handleChange(p.id, "unite", e.target.value)}
                />
              </td>
              <td style={{ padding: 4, textAlign: "right" }}>
                <input
                  type="number"
                  step="0.01"
                  value={p.prix}
                  onChange={(e) => handleChange(p.id, "prix", parseFloat(e.target.value))}
                  style={{ width: "80px", textAlign: "right" }}
                />
              </td>
              <td style={{ padding: 4, textAlign: "center" }}>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{ backgroundColor: "#e74c3c", color: "#fff", border: "none", padding: "4px 8px", borderRadius: 4, cursor: "pointer" }}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
