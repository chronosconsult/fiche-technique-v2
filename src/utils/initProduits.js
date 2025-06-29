import produitsFR from '../data/produitsFr';
import produitsEN from '../data/produitsEn';
import produitsES from '../data/produitsEs';
import { supabase } from '../supabaseClient';

export async function initProduits(userId, langue) {
  // 1. Vérifie s’il a déjà des produits
  const { data: existants, error: err1 } = await supabase
    .from('produits')
    .select('id')
    .eq('user_id', userId);

  if (err1) throw err1;
  if (existants && existants.length > 0) return;

  // 2. Choix du jeu de données
  let produitsSource;
  switch (langue?.slice(0, 2)) {
    case 'en':
      produitsSource = produitsEN;
      break;
    case 'es':
      produitsSource = produitsES;
      break;
    default:
      produitsSource = produitsFR;
  }

  // 3. Insertion dans la table `produits`
  const lignes = produitsSource.map((p) => ({
    user_id: userId,
    nom: p.nom,
    prixht: p.prix,
    unite: p.unite,
  }));

  const { error: err3 } = await supabase
    .from('produits')
    .insert(lignes);

  if (err3) throw err3;
}
