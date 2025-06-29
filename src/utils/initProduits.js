import { supabase } from '../supabaseClient';

const fichiersProduits = {
  fr: '/data/ProduitsFR.json',
  en: '/data/ProduitsEN.json',
  es: '/data/ProduitsES.json',
};

export async function initProduits(userId, langue = 'fr') {
  try {
    const langueCode = langue.toLowerCase().slice(0, 2); // Ex: 'fr', 'en', 'es'
    const chemin = fichiersProduits[langueCode] || fichiersProduits.fr;

    const response = await fetch(chemin);
    if (!response.ok) {
      console.error(`Erreur lors du chargement des produits (${chemin})`);
      return;
    }

    const produits = await response.json();
    const produitsAvecUser = produits.map((produit) => ({
      ...produit,
      user_id: userId,
    }));

    const { error } = await supabase.from('produits').insert(produitsAvecUser);

    if (error) {
      console.error('Erreur lors de l’insertion dans Supabase :', error.message);
    } else {
      console.log('Produits initiaux insérés pour l’utilisateur :', userId);
    }
  } catch (err) {
    console.error('Erreur générale dans initProduits :', err.message);
  }
}
