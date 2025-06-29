import { supabase } from '../supabaseClient';

export async function initProduits(userId, langue = 'fr') {
  const { data: existing, error: existingError } = await supabase
    .from('produits')
    .select('id')
    .eq('user_id', userId);

  if (existingError) {
    console.error('Erreur vérification produits utilisateur :', existingError);
    return;
  }

  if (existing.length > 0) {
    console.log('Produits déjà initialisés pour cet utilisateur.');
    return;
  }

  let produitsSource;
  try {
    switch (langue) {
      case 'en':
        produitsSource = await import('../data/produitsEn.js');
        break;
      case 'es':
        produitsSource = await import('../data/produitsEs.js');
        break;
      default:
        produitsSource = await import('../data/produitsFr.js');
    }
  } catch (e) {
    console.error('Erreur chargement fichier produits :', e);
    return;
  }

  const { data: profil, error: profilError } = await supabase
    .from('profils')
    .select('devise')
    .eq('user_id', userId)
    .single();

  if (profilError) {
    console.error('Erreur récupération profil utilisateur :', profilError);
    return;
  }

  const deviseParDefaut = profil?.devise || 'EUR';

  const produits = produitsSource.default.map((prod) => ({
    user_id: userId,
    produit_standard_id: null,
    nom: prod.nom,
    prix: prod.prix,
    devise: prod.devise || deviseParDefaut,
    unite: prod.unite
  }));

  const { error: insertError } = await supabase
    .from('produits')
    .insert(produits);

  if (insertError) {
    console.error('Erreur insertion produits utilisateur :', insertError);
  } else {
    console.log('Produits utilisateur initialisés.');
  }
}

export { initProduits as initialiserProduitsSiNecessaire };
