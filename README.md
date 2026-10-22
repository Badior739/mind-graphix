# Mind Graphix Solution — site V3

Next.js 15 + Tailwind CSS + Motion + Lenis. Deux versions : français (`/`) et anglais (`/en`).

    npm install
    npm run dev      # http://localhost:3000
    npm run build

## Où modifier quoi

- Textes (FR et EN) : `lib/content.js`, rien d'autre à toucher pour changer un texte.
- Téléphones, adresse, URL : `lib/site.js`.
- Couleurs : `tailwind.config.js`. Visuels : `public/images/`.
- Image de partage (WhatsApp, Facebook) : `app/(fr)/opengraph-image.png` et `app/(en)/en/opengraph-image.png`.

## Espace de gestion (adresse secrète)

Ordinateur uniquement. Il n'existe à aucun lien visible : sur le site, **Ctrl + Alt + B** ouvre une petite fenêtre
où l'on tape le code d'accès (c'est le nom secret `ADMIN_PATH`). Si le code est bon, on arrive sur la page de
connexion : adresse e-mail autorisée + code à 6 chiffres reçu par e-mail.

Sans cette « porte », l'adresse secrète répond 404 comme n'importe quelle page inconnue. `/admin`, `/dashboard`,
`/gestion-mgs` et tous les noms devinables répondent 404 aussi. Sans `ADMIN_PATH` en production, l'espace est désactivé.

Contenu : tableau de bord (visites, pages vues, briefs, clics WhatsApp), demandes de devis (statut, recherche,
export CSV), services et prix (modifier, ajouter, supprimer, réordonner, FR/EN), images de la galerie, journal de sécurité.

Raccourcis dans l'espace : `g` puis `d` (tableau), `r` (demandes), `s` (services), `i` (images), `j` (journal),
`q` (déconnexion) ; `/` chercher, `n` ajouter, `Ctrl+S` enregistrer, `?` aide.

### Mise en route (une seule fois)

1. **Base de données Supabase** : créer un projet, puis *Connect > Transaction pooler* et copier l'adresse
   (port 6543). Remplacer `[YOUR-PASSWORD]` par le mot de passe de la base (sans caractères spéciaux, ou encodés).
2. **Envoi du code par e-mail**, au choix :
   - *Gmail (recommandé : aucun quota gênant, aucun domaine nécessaire)* : activer la validation en deux étapes du compte Google,
     créer un « mot de passe d'application », puis renseigner `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=465`,
     `SMTP_USER` (votre Gmail) et `SMTP_PASS` (le mot de passe d'application).
   - *Resend* : `RESEND_API_KEY` (100 e-mails par jour en gratuit). Sans domaine vérifié, n'envoie qu'à l'adresse du compte Resend.
3. Dans Vercel, **Settings > Environment Variables** : `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAILS`, `ADMIN_PATH`,
   et les variables d'e-mail (voir `.env.example`). Redéployer. Les tables se créent seules.

Pour essayer en local : `npm run dev` crée une base locale dans `.data/` et affiche le code de connexion dans le
terminal ; l'espace est alors à `/gestion-mgs-dev` (ouvrir par Ctrl + Alt + B avec ce nom comme code).

### Sécurité

- **Quatre verrous** : raccourci clavier + nom secret, adresse e-mail autorisée, code à usage unique, session limitée.
- Toute la logique (connexion, base, e-mails, modifications) tourne côté serveur (`lib/server/`, protégé par `server-only`).
  Le nom secret n'est jamais dans le code envoyé au navigateur : il n'est vérifié que par le serveur.
- Code d'accès : 6 essais par 15 minutes et par adresse IP, réponse toujours identique. Cookie « porte » : 15 minutes.
- Code à 6 chiffres : valable 10 min, usage unique, 5 essais, limites par adresse et par IP, stocké haché.
- Session : cookie `HttpOnly`, `Secure`, `SameSite=Strict`, 8 h, révocable (page Journal), revérifiée en base à chaque page et action.
- Tables Supabase fermées à l'API publique (sécurité au niveau des lignes activée sur toutes les tables).
- En-têtes de sécurité sur tout le site, politique stricte à jeton unique pour l'espace de gestion, jamais indexé ni dans le sitemap.
- Statistiques sans cookie ni IP : identifiant de visiteur haché qui change chaque jour.
- Images envoyées : re-encodées en WebP, SVG refusé.
- Rappel : le nom secret est une couche de protection, pas un mur. Le vrai verrou reste l'e-mail + le code.
  Changer `ADMIN_PATH` dans Vercel change l'adresse et le code d'accès aussitôt.

## Transmettre aussi les briefs à une autre API (facultatif)

Dans Vercel : `MGS_ADMIN_API_URL` (API qui accepte un POST en JSON) et `MGS_ADMIN_API_KEY` (envoyé en
« Authorization: Bearer »). Format : `{ source, receivedAt, lang, name, phone, projects[], needs[], delay, message }`
(voir `app/api/brief/route.js`).

## Déploiement

Pousser sur GitHub, puis importer le dépôt dans Vercel.
