import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { initProduits } from './utils/initProduits';

function Inscription() {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');

  const handleInscription = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: motDePasse,
    });

    if (error) {
      setMessage(`Erreur lors de l'inscription : ${error.message}`);
      return;
    }

    const user = data.user;

    if (user && user.id) {
      console.log('Utilisateur inscrit avec succès :', user.email);

      // Détection de la langue navigateur
      const langueNavigateur = navigator.language || 'fr';

      // Initialisation des produits pour ce user
      await initProduits(user.id, langueNavigateur);

      setMessage("Inscription réussie. Produits chargés.");
    } else {
      setMessage("Inscription réussie, mais l'utilisateur n'est pas disponible.");
    }
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleInscription}>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          required
        />
        <button type="submit">S'inscrire</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Inscription;
