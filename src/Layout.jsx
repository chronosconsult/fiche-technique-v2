// Layout.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { supabase } from "./supabaseClient";
import LanguageSelector from "./LanguageSelector";
import { useDevise } from "./contexts/DeviseContext";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { t, i18n } = useTranslation();
  const { setDevise } = useDevise();

  useEffect(() => {}, [i18n.language]);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const currentUser = data?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: profil, error } = await supabase
          .from("profils")
          .select("devise")
          .eq("user_id", currentUser.id)
          .single();

        if (!error && profil?.devise) {
          setDevise(profil.devise);
        }
      }
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <header className="bg-white shadow-sm p-4 mb-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">{t("menu.accueil")}</h1>
          <div className="space-x-2 flex items-center">
            <LanguageSelector />
            <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-4 py-2 rounded">
              {t("menu.accueil")}
            </button>
            <button onClick={() => navigate("/mercurial")} className="bg-green-600 text-white px-4 py-2 rounded">
              {t("menu.mercurial")}
            </button>

            {user ? (
              <button
                className="bg-gray-700 text-white px-4 py-2 rounded"
                onClick={async () => {
                  await supabase.auth.signOut();
                  setUser(null);
                  navigate("/connexion");
                }}
              >
                {t("menu.deconnexion")}
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/connexion")} className="bg-yellow-600 text-white px-4 py-2 rounded">
                  {t("menu.connexion")}
                </button>
                <button onClick={() => navigate("/inscription")} className="bg-indigo-600 text-white px-4 py-2 rounded">
                  {t("menu.inscription")}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4">{children}</main>
    </div>
  );
}
