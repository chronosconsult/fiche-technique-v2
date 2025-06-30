import { supabase } from '../supabaseClient';

export async function initProduits(userId, langue = 'fr') {
  try {
    const fichiers = {
      fr: '/data/ProduitsFR.json',
      en: '/data/ProduitsEN.json',
      es: '/data/ProduitsES.json',
    };

    const urlFichier = fichiers[langue] || fichiers.fr;
    const reponse = await fetch(urlFichier);

    if (!reponse.ok) {
      console.error(`Échec du chargement du fichier produit : ${urlFichier}`);
      return;
    }

    const produits = await reponse.json();

    const produitsAvecUser = produits.map(produit => ({
      ...produit,
      user_id: userId,
    }));

    const { error } = await supabase.from('produits').insert(produitsAvecUser);

    if (error) {
      console.error('Erreur lors de l’insertion dans Supabase :', error.message);
    } else {
      console.log('Produits insérés avec succès pour l’utilisateur', userId);
    }
  } catch (err) {
    console.error('Erreur dans initProduits :', err.message);
  }
}
