// Accueil.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Accueil({ isConnected }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      navigate("/fiches", { replace: true });
    } else {
      navigate("/connexion", { replace: true });
    }
  }, [isConnected, navigate]);

  return null;
}
