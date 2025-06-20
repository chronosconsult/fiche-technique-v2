import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

export default function RequireAuth({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/inscription");
      } else {
        setLoading(false);
      }
    });
  }, [navigate]);

  if (loading) return <p>Chargement...</p>;

  return children;
}
