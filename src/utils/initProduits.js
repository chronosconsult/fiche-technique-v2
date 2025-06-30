import { supabase } from '../supabaseClient';

export async function initProduits(userId, langue = 'fr') {
  try {
    // On vérifie s’il y a déjà des produits pour cet utilisateur
    const { data: produitsExistants, error: erreurSelect } = await supabase
      .from('produits')
      .select('id')
      .eq('user_id', userId);

    if (erreurSelect) {
      console.error("Erreur lors de la vérification des produits existants :", erreurSelect.message);
      return;
    }

    // Si des produits existent déjà, on ne fait rien
    if (produitsExistants && produitsExistants.length > 0) {
      console.log("Produits déjà présents pour cet utilisateur. Aucune insertion.");
      return;
    }

    // Sinon, on charge le bon fichier de base
    const fichiers = {
      fr: '/data/produitsFr.json',
      en: '/data/produitsEn.json',
      es: '/data/produitsEs.json',
    };

    const urlFichier = fichiers[langue] || fichiers.fr;
    const reponse = await fetch(urlFichier);

    if (!reponse.ok) {
      console.error(`Échec du chargement du fichier produit : ${urlFichier}`);
      return;
    }

    const produits = await reponse.json();

    // On ajoute l'user_id à chaque produit
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
