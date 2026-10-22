// Réalisations et articles de blog (français). Modifiez les textes ici.

export const projects = [
  {
    slug: "generateur-de-devis",
    name: "Générateur de devis",
    kind: "Application de bureau",
    tags: ["Electron", "Stockage local", "Export PDF"],
    intro:
      "Un logiciel pour préparer des devis et des factures proforma aux couleurs de l'entreprise, sans dépendre d'une connexion internet.",
    problem:
      "Dans une petite entreprise, les devis se font souvent sur un traitement de texte : mise en page différente à chaque fois, calculs refaits à la main, anciens documents introuvables. Un devis mal présenté ou erroné fait mauvaise impression et peut faire perdre un client.",
    solution: [
      "Le Générateur de devis produit un document propre en quelques minutes : le client, les lignes de prestations, les totaux calculés automatiquement en FCFA, puis l'export en PDF.",
      "Les données restent sur l'ordinateur de l'utilisateur. L'application fonctionne donc sans connexion, ce qui compte quand le réseau est irrégulier. Une synchronisation en ligne est prévue dans une prochaine étape.",
    ],
    points: [
      "Devis et factures proforma complets, en FCFA",
      "Identité visuelle de l'entreprise sur chaque document",
      "Services pré-remplis pour gagner du temps",
      "Export PDF prêt à envoyer",
      "Stockage local, synchronisation en ligne prévue",
    ],
    status: "En cours d'amélioration",
  },
  {
    slug: "mgs-forge",
    name: "MGS Forge",
    kind: "Ordinateur et Android",
    tags: ["Python", "SQLite", "APK Android"],
    intro:
      "Un outil de suivi d'habitudes qui fonctionne hors connexion, avec synchronisation par WiFi entre l'ordinateur et le téléphone.",
    problem:
      "Les applications de suivi d'habitudes demandent souvent un compte, une connexion permanente et envoient vos données ailleurs. Pour tenir une discipline quotidienne, il faut un outil simple, rapide, qui ne dépend de rien.",
    solution: [
      "MGS Forge garde toutes les données sur l'appareil. L'ordinateur et le téléphone se synchronisent entre eux quand ils sont sur le même réseau WiFi, sans passer par un serveur extérieur.",
      "L'application suit les habitudes jour après jour avec un système de points et de séries pour garder la motivation, accepte des fréquences variables et demande la raison quand une habitude est sautée, pour comprendre ce qui bloque.",
    ],
    points: [
      "Fonctionne sans connexion internet",
      "Synchronisation WiFi entre ordinateur et téléphone",
      "Points d'expérience et séries pour rester régulier",
      "Fréquences d'habitudes variables, raisons des oublis",
      "Bilan hebdomadaire et export des données",
    ],
    status: "Utilisée au quotidien",
  },
  {
    slug: "revision-en-qcm",
    name: "Révision en QCM",
    kind: "Applications éducatives",
    tags: ["Web", "Banque de questions"],
    intro:
      "Des quiz pour réviser l'informatique et les mathématiques, avec une banque de questions qui s'agrandit par lots.",
    problem:
      "Pour préparer un examen ou un concours, relire un cours ne suffit pas : il faut se tester. Les bons QCM en français, au bon niveau, sont rares et souvent mal corrigés.",
    solution: [
      "Nous construisons des applications de quiz : l'utilisateur répond, voit tout de suite la correction et comprend son erreur. Les questions sont organisées par chapitre pour réviser un point précis.",
      "La banque de questions est enrichie par lots : informatique de niveau licence (matériel, logiciel, algorithmique) et mathématiques de Terminale. L'objectif fixé est de dépasser les 500 questions pour l'informatique.",
    ],
    points: [
      "Questions à choix multiples avec correction immédiate",
      "Classement par chapitre et par domaine",
      "Informatique de niveau licence et mathématiques de Terminale",
      "Banque de questions extensible",
    ],
    status: "Banque de questions en cours d'extension",
  },
];

export const articles = [
  {
    slug: "combien-coute-un-site-web-au-burkina-faso",
    title: "Combien coûte un site web au Burkina Faso ?",
    description:
      "Les prix d'un site vitrine, d'une boutique en ligne et d'une application, ce qui les fait varier et comment préparer votre budget.",
    date: "2026-10-16",
    read: "4 min",
    blocks: [
      { p: "Quand on cherche un site web, la première question est presque toujours celle du prix. Voici des repères clairs, ceux que nous appliquons à Mind Graphix Solution, et les raisons qui font monter ou baisser la facture." },
      { h: "Nos tarifs de départ" },
      { ul: [
        "Site vitrine : à partir de 150 000 FCFA",
        "Boutique en ligne : à partir de 250 000 FCFA",
        "Application mobile : à partir de 300 000 FCFA",
      ] },
      { p: "« À partir de » veut dire que c'est le point de départ pour un projet simple. Le prix final dépend de ce que vous voulez vraiment, et il vous est confirmé par un devis écrit avant de commencer." },
      { h: "Ce qui fait varier le prix" },
      { ul: [
        "Le nombre de pages et de fonctionnalités : quelques pages de présentation, ou un espace client, un paiement en ligne, une gestion de commandes.",
        "Les textes et les images : si vous les fournissez prêts, c'est plus rapide. Sinon, il faut les écrire ou les créer.",
        "La langue : un site en deux langues demande plus de travail.",
        "Le délai : un projet urgent mobilise l'équipe différemment.",
        "L'hébergement, le nom de domaine et la maintenance, qui reviennent chaque année.",
      ] },
      { h: "Comment bien préparer votre budget" },
      { p: "Avant de demander un devis, décidez ce que le site doit faire pour vous : recevoir des appels, vendre, présenter vos réalisations. Un site qui a un objectif précis coûte souvent moins cher qu'un site qui veut tout faire, et il rapporte davantage." },
      { p: "Demandez toujours un devis écrit qui détaille ce qui est inclus, les délais et les étapes de paiement. Méfiez-vous des prix très bas sans détail : il manque souvent l'hébergement, la version téléphone ou la maintenance." },
    ],
  },
  {
    slug: "site-vitrine-ou-boutique-en-ligne",
    title: "Site vitrine ou boutique en ligne : lequel choisir ?",
    description:
      "Une façon simple de choisir entre présenter votre activité et vendre en ligne, selon votre métier et vos clients.",
    date: "2026-10-16",
    read: "3 min",
    blocks: [
      { p: "Les deux se ressemblent de loin, mais ils ne servent pas à la même chose. Choisir le bon dès le départ évite de payer deux fois." },
      { h: "Le site vitrine : se faire connaître et se faire contacter" },
      { p: "Un site vitrine présente votre activité, vos réalisations et vos coordonnées. Le client vous trouve, vous fait confiance, puis vous appelle ou vous écrit sur WhatsApp. C'est le bon choix pour une entreprise de services, un artisan, un cabinet, un freelance ou une association." },
      { h: "La boutique en ligne : vendre sans que vous soyez là" },
      { p: "Une boutique en ligne présente un catalogue, prend les commandes et permet de payer. Elle demande davantage de travail : photos de chaque produit, prix à jour, gestion des commandes et de la livraison. Elle a du sens si vous vendez des produits que le client peut commander à distance." },
      { h: "Comment trancher" },
      { ul: [
        "Votre client vous contacte avant d'acheter ? Un site vitrine suffit.",
        "Vous avez un catalogue de produits avec des prix fixes ? Pensez à la boutique.",
        "Vous débutez ? Commencez par un site vitrine bien fait, vous pourrez ajouter la vente plus tard.",
      ] },
      { p: "Et si vous hésitez, expliquez-nous votre activité : nous vous dirons honnêtement ce qui est utile, et ce qui ne l'est pas." },
    ],
  },
  {
    slug: "preparer-sa-demande-de-devis",
    title: "Ce qu'il faut préparer avant de demander un devis",
    description:
      "Cinq informations qui permettent d'obtenir un devis juste et rapide pour votre site, application ou visuels.",
    date: "2026-10-16",
    read: "3 min",
    blocks: [
      { p: "Un devis juste demande quelques informations. Plus vous êtes précis, plus la réponse est rapide et plus le prix est proche de la réalité." },
      { h: "Les cinq informations utiles" },
      { ul: [
        "Votre activité : ce que vous faites et pour qui.",
        "L'objectif : recevoir des appels, vendre, présenter vos réalisations, gérer un travail interne.",
        "Un exemple que vous aimez : un site, une application ou un visuel dont l'esprit vous plaît.",
        "Ce que vous avez déjà : logo, photos, textes, nom de domaine.",
        "Votre délai : une date ou une période où vous en avez besoin.",
      ] },
      { h: "Ce n'est pas grave si vous ne savez pas tout" },
      { p: "Beaucoup de clients n'ont qu'une idée vague au départ. C'est normal : la première discussion sert justement à la préciser. Sur ce site, le bouton « Démarrer un projet » vous guide en quelques questions et envoie votre brief directement sur WhatsApp." },
    ],
  },
];

export const findProject = (slug) => projects.find((p) => p.slug === slug);
export const findArticle = (slug) => articles.find((a) => a.slug === slug);
