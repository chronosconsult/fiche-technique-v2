import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import initProduits from '../data/initProduits';

const Inscription = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [devise, setDevise] = useState('€');
  const navigate = useNavigate();

  const handleInscription = async () => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password: motDePasse
    });

    if (signUpError) {
      console.error('Erreur à l\'inscription :', signUpError.message);
      alert(`Erreur à l'inscription : ${signUpError.message}`);
      return;
    }

    const user = signUpData.user;
    if (!user) {
      alert('Inscription réussie, mais utilisateur introuvable.');
      return;
    }

    // Insertion dans la table "profils"
    const { error: profileError } = await supabase.from('profils').insert([
      {
        user_id: user.id,
        email,
        devise
      }
    ]);

    if (profileError) {
      console.error('Erreur lors de la création du profil :', profileError.message);
      alert(`Erreur création profil : ${profileError.message}`);
      return;
    }

    // Initialisation des produits une fois que le profil est bien en base
    await initProduits(user.id, devise);

    alert('Compte créé avec succès');
    navigate('/connexion');
  };

  return (
    <div className="container">
      <h2>Créer un compte</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={motDePasse}
        onChange={(e) => setMotDePasse(e.target.value)}
      />
      <select value={devise} onChange={(e) => setDevise(e.target.value)}>
        <option value="€">Euro (€)</option>
        <option value="$">Dollar ($)</option>
        <option value="£">Livre (£)</option>
      </select>
      <button onClick={handleInscription}>S'inscrire</button>
    </div>
  );
};

export default Inscription;
