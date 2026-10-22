// Textes juridiques (français). À faire relire par un juriste avant publication définitive.

import { SITE } from "./site";

export const UPDATED = "17 octobre 2026";

const phones = SITE.phones.join(" ou ");

export const legalPages = {
  "mentions-legales": {
    title: "Mentions légales",
    description: "Éditeur, hébergeur et propriété intellectuelle du site de Mind Graphix Solution.",
    sections: () => {
      const L = SITE.legal;
      const editor = [
        `Le site ${SITE.url.replace("https://", "")} est édité par ${SITE.name}, agence de services numériques (sites web, applications, infographie).`,
        `Siège : ${SITE.city}${L.address ? ", " + L.address : ""}.`,
        `Représentant : ${L.publisher}, fondateur.`,
      ];
      if (L.legalForm) editor.push(`Forme juridique : ${L.legalForm}.`);
      if (L.rccm) editor.push(`RCCM : ${L.rccm}.`);
      if (L.ifu) editor.push(`IFU : ${L.ifu}.`);
      editor.push(`Contact : ${phones}, ou par WhatsApp au +${SITE.whatsappNumber}.`);
      return [
        { h: "Éditeur du site", p: editor },
        { h: "Directeur de la publication", p: [`${L.publisher}.`] },
        {
          h: "Hébergement",
          p: ["Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis (vercel.com)."],
        },
        {
          h: "Propriété intellectuelle",
          p: [
            "Les textes, visuels, affiches, logo, maquettes, éléments graphiques et le code de ce site sont la propriété de Mind Graphix Solution, sauf mention contraire. Toute reproduction, copie ou réutilisation, totale ou partielle, sans accord écrit préalable est interdite.",
            "Les marques et noms cités (WhatsApp, Facebook, Instagram, TikTok, etc.) appartiennent à leurs propriétaires respectifs.",
          ],
        },
        {
          h: "Signaler un problème",
          p: [`Pour signaler un contenu, une erreur ou demander un retrait, écrivez-nous au ${phones} (appel ou WhatsApp).`],
        },
      ];
    },
  },

  confidentialite: {
    title: "Politique de confidentialité",
    description: "Quelles données nous recevons quand vous nous contactez, pourquoi, et comment exercer vos droits.",
    sections: () => [
      {
        h: "L'essentiel",
        p: [
          "Nous ne recueillons que ce que vous nous donnez pour étudier votre projet. Nous ne vendons pas vos données et ce site n'affiche aucune publicité.",
        ],
      },
      {
        h: "Qui est responsable",
        p: [`${SITE.name}, ${SITE.city}. Contact : ${phones}.`],
      },
      {
        h: "Les données que nous recevons",
        p: ["Lorsque vous utilisez le formulaire « Démarrer un projet », nous recevons les informations que vous saisissez :"],
        ul: [
          "votre nom et, si vous le donnez, votre numéro de téléphone ;",
          "le type de projet, les besoins cochés et le délai souhaité ;",
          "le message que vous écrivez.",
        ],
        after: [
          "Vous pouvez aussi nous écrire directement sur WhatsApp ou par téléphone. Dans ce cas, c'est le service concerné (WhatsApp, votre opérateur) qui traite votre message selon ses propres règles.",
        ],
      },
      {
        h: "Pourquoi nous les utilisons",
        p: [
          "Uniquement pour répondre à votre demande, vous envoyer un devis et assurer le suivi de votre projet. Nous ne les utilisons pas à d'autres fins sans vous le dire.",
        ],
      },
      {
        h: "Qui y a accès",
        p: [
          "Notre équipe. Votre brief est transmis par WhatsApp (service de Meta) lorsque vous l'envoyez, et il est enregistré dans notre espace de gestion privé, protégé par une connexion à code, pour suivre vos demandes. Le site est hébergé chez Vercel, qui reçoit les données techniques de connexion (comme l'adresse IP) nécessaires à son fonctionnement, ce qui peut impliquer un traitement hors du Burkina Faso.",
        ],
      },
      {
        h: "Combien de temps",
        p: [
          "Le temps nécessaire pour traiter votre demande et assurer le suivi du projet. Vous pouvez demander la suppression de vos informations à tout moment.",
        ],
      },
      {
        h: "Statistiques de fréquentation",
        p: [
          "Pour savoir combien de personnes visitent le site, nous comptons les visites de façon anonyme : page consultée, langue, type d'appareil (ordinateur, mobile ou tablette), pays et site d'origine. Aucun cookie n'est déposé, votre adresse IP n'est pas conservée et l'identifiant utilisé pour compter une visite change chaque jour, il ne permet donc pas de vous suivre d'un jour à l'autre.",
          "Si votre navigateur envoie le signal « Ne pas me suivre », votre visite n'est pas comptée. Le site n'affiche aucune publicité et n'utilise aucun cookie publicitaire.",
        ],
      },
      {
        h: "Vos droits",
        p: [
          `Vous pouvez demander l'accès à vos données, leur correction ou leur suppression, ou vous opposer à leur utilisation, en nous contactant au ${phones}. Nous répondons dans les meilleurs délais.`,
          "Vous pouvez aussi saisir l'autorité burkinabè chargée de la protection des données personnelles si vous estimez que vos droits ne sont pas respectés.",
        ],
      },
      { h: "Mise à jour", p: [`Dernière mise à jour : ${UPDATED}.`] },
    ],
  },

  "conditions-utilisation": {
    title: "Conditions d'utilisation",
    description: "Les règles simples d'utilisation du site de Mind Graphix Solution.",
    sections: () => [
      {
        h: "Objet",
        p: [
          `Ces conditions encadrent l'utilisation du site ${SITE.url.replace("https://", "")}, qui présente les services de ${SITE.name}. En utilisant le site, vous les acceptez.`,
        ],
      },
      {
        h: "Utilisation du site",
        p: ["Le site est accessible gratuitement. Nous vous demandons de l'utiliser de façon normale et loyale, c'est-à-dire de ne pas :"],
        ul: [
          "tenter de perturber son fonctionnement ou d'accéder à ce qui n'est pas public ;",
          "envoyer de fausses demandes ou des messages abusifs par le formulaire ;",
          "copier ses contenus pour vous les approprier.",
        ],
      },
      {
        h: "Le formulaire de brief et les devis",
        p: [
          "Le formulaire sert à nous décrire votre besoin. L'envoyer ne crée aucun engagement, ni pour vous ni pour nous.",
          "Les tarifs « à partir de » affichés sur le site sont des prix de départ indicatifs pour un projet simple. Seul un devis écrit, détaillé et accepté par vous fixe le prix, le contenu, les délais et les conditions d'un projet.",
        ],
      },
      {
        h: "Propriété intellectuelle",
        p: [
          "Les contenus du site (textes, visuels, logo, maquettes, code) appartiennent à Mind Graphix Solution. Voir les mentions légales. Les droits sur les travaux réalisés pour un client sont précisés dans le devis ou le contrat de ce projet.",
        ],
      },
      {
        h: "Liens et services externes",
        p: [
          "Le site renvoie vers des services tiers (WhatsApp, Facebook, Instagram, TikTok). Nous ne contrôlons pas leur contenu ni leurs règles, que nous vous invitons à lire.",
        ],
      },
      {
        h: "Responsabilité",
        p: [
          "Nous faisons de notre mieux pour que le site soit disponible et que les informations soient exactes, mais nous ne pouvons pas garantir l'absence d'interruption ou d'erreur. Nous pouvons modifier ou retirer des contenus à tout moment.",
        ],
      },
      {
        h: "Droit applicable",
        p: [
          "Ces conditions sont soumises au droit du Burkina Faso. En cas de désaccord, nous cherchons d'abord une solution à l'amiable ; à défaut, les tribunaux compétents de Bobo-Dioulasso seront saisis.",
        ],
      },
      { h: "Mise à jour", p: [`Dernière mise à jour : ${UPDATED}. Nous pouvons modifier ces conditions ; la version en ligne fait foi.`] },
    ],
  },
};
