# Guide du portfolio

Ce guide explique comment faire vivre le site : le lancer sur ton ordinateur, modifier son contenu,
le vérifier, le publier et le mettre en ligne. Il se termine par un résumé des choix techniques
(sécurité, accessibilité, tests) utile pour préparer l'oral du BTS.

> **Règle d'or :** le site et le dépôt GitHub sont **publics**. Ne jamais y mettre d'adresse IP interne,
> de nom de machine ou de domaine réel de laboratoire, d'identifiant, de mot de passe, de numéro de
> téléphone ni d'adresse postale. Un test automatique vérifie les textes du site (voir partie 5).

---

## Sommaire

1. [Le projet en bref](#1-le-projet-en-bref)
2. [Lancer le site sur ton ordinateur](#2-lancer-le-site-sur-ton-ordinateur)
3. [Modifier le contenu](#3-modifier-le-contenu)
4. [Le formulaire de contact (Formspree)](#4-le-formulaire-de-contact-formspree)
5. [Vérifier avant de publier](#5-vérifier-avant-de-publier)
6. [Publier sur GitHub](#6-publier-sur-github)
7. [Mettre le site en ligne avec Vercel](#7-mettre-le-site-en-ligne-avec-vercel)
8. [Après la mise en ligne](#8-après-la-mise-en-ligne)
9. [Mises à jour régulières](#9-mises-à-jour-régulières)
10. [Pour l'oral : les choix techniques](#10-pour-loral--les-choix-techniques)
11. [Dépannage](#11-dépannage)

---

## 1. Le projet en bref

| Élément | Choix |
|---|---|
| Cadre de développement | **Next.js 15** (React 19), en **TypeScript** (JavaScript avec vérification des types) |
| Mise en forme | **Tailwind CSS 4** (thème vert forêt et or dans `app/globals.css`) |
| Animations | **Framer Motion**, discrètes, désactivées si l'appareil demande moins d'animations |
| Contenu | Fichiers texte dans `content/` (pas de base de données) |
| Formulaire | **Formspree** (service qui transmet les messages par e-mail) |
| Tests | **Vitest** + Testing Library (246 tests) |
| Hébergement | **Vercel**, mise à jour automatique à chaque envoi sur GitHub |

### Où se trouve quoi ?

```
app/                  Pages du site (accueil, /projets/…, mentions légales, 404,
                      plan du site, robots.txt, images d'aperçu)
components/           Briques d'affichage (menu, sections, cartes, formulaire…)
content/              ★ TOUT LE CONTENU DU SITE ★ (textes, projets, parcours…)
lib/                  Logique : validation du formulaire, référencement, adresse du site…
public/               Fichiers publiés tels quels : CV (PDF), ta photo, photos des projets
tests/                Tests automatiques
.github/workflows/    Vérifications automatiques sur GitHub
next.config.ts        Réglages : en-têtes de sécurité, images autorisées
.env.example          Modèle des variables d'environnement (sans valeur secrète)
```

---

## 2. Lancer le site sur ton ordinateur

**Prérequis :** Node.js 24 (déjà installé) et GitHub Desktop.

1. Ouvre un terminal dans le dossier du projet (dans GitHub Desktop : *Repository > Open in Command Prompt*,
   ou dans VS Code : *Terminal > New Terminal*).
2. La première fois seulement (ou après une mise à jour des dépendances), installe les outils :
   ```bash
   npm install
   ```
3. Lance le site en mode développement :
   ```bash
   npm run dev
   ```
4. Ouvre **http://localhost:3000**. Chaque fichier enregistré met la page à jour instantanément.
5. Pour arrêter : `Ctrl + C` dans le terminal.

> Le formulaire de contact affiche « momentanément indisponible » tant que l'identifiant Formspree
> n'est pas renseigné en local (voir partie 4). C'est normal.

---

## 3. Modifier le contenu

Tout le contenu est dans `content/`. Modifie **uniquement les textes entre guillemets** ; ne change pas
les noms à gauche des `:`. Si un champ obligatoire manque, l'éditeur le souligne en rouge et la
vérification (`npm run typecheck`) échoue avant la mise en ligne.

| Je veux changer… | Fichier |
|---|---|
| Mon titre, ma présentation, mes liens, mon e-mail | `content/site.ts` |
| Le parcours (frise) | `content/timeline.ts` |
| Les compétences | `content/skills.ts` |
| La veille technologique | `content/veille.ts` |
| Un projet | `content/projects/<nom-du-projet>.ts` |
| Les compétences du référentiel BTS | `content/bts.ts` (référentiel officiel, à ne pas modifier) |
| Les mentions légales | `app/mentions-legales/page.tsx` |

**Bon à savoir :**
- `description` dans `content/site.ts` est le texte affiché sous le titre dans Google : **160 caractères maximum** (un test le vérifie).
- Dans le parcours, une seule étape porte `current: true` (point doré « En cours »).
- Les accroches de projets (`pitch`) font aussi 160 caractères maximum.

### Ajouter un projet

1. Dans `content/projects/`, duplique un fichier existant (ex. `labo-stormshield.ts`) et renomme-le.
2. Remplis ses champs :
   - `slug` : identifiant dans l'adresse (`/projets/<slug>`), en minuscules, chiffres et tirets, **unique** ;
   - `domains` : onglet(s) où il apparaît (`"systemes-reseaux"` et/ou `"cybersecurite"`) ;
   - `tech` : outils (les 4 premiers s'affichent sur la carte) ;
   - `bts` : compétences du référentiel avec, pour chacune, la preuve concrète (identifiants dans `content/bts.ts`).
3. Ajoute-le dans la liste de `content/projects/index.ts` (l'ordre de la liste = l'ordre d'affichage).
4. Lance `npm test` : les tests vérifient que rien ne manque.

Le plan du site, les pages `/projets/…` et les images d'aperçu se mettent à jour tout seuls.

### Changer la photo d'un projet

Deux possibilités, à renseigner dans le champ `cover` du projet :

- **Photo Unsplash** (libre de droits) : `src` = l'adresse `https://images.unsplash.com/photo-…`,
  `source: "Unsplash"`, auteur et page de la photo. Elle est autorisée automatiquement.
- **Photo rangée dans le site** (ex. une photo que tu as prise toi-même) : place-la dans
  `public/images/projets/` et indique `src: "/images/projets/nom-du-fichier.jpg"`.
  Pour ta propre photo : `author: "Erhan Aslan"`, pas de `license`.

Une photo sous licence Creative Commons (CC BY, CC BY-SA…) **doit** être créditée avec sa licence
(champ `license`) : le crédit apparaît dans la fiche du projet et dans les mentions légales.

> Les photos optimisées sont gardées 31 jours en cache : pour **remplacer** une photo, donne au
> nouveau fichier **un autre nom**.

> **Captures d'écran :** avant d'en ajouter une, masque toute adresse IP, nom de machine, nom de
> domaine interne, identifiant ou information personnelle.

### Changer ta photo (bulle du haut de page)

1. Prépare une photo **carrée**, visage au centre, d'environ 800 × 800 pixels (plus grand alourdit
   le site pour rien).
2. **Retire ses informations cachées** : une photo de téléphone contient la date, le modèle du
   téléphone et parfois **la position GPS**. Clic droit sur le fichier > *Propriétés* > onglet
   *Détails* > *Supprimer les propriétés et les informations personnelles* > *Créer une copie en
   supprimant toutes les propriétés possibles*.
3. Place la copie dans `public/images/` avec **un nouveau nom** (cache de 31 jours, voir plus haut)
   et indique ce nom dans `photo.src` de `content/site.ts`.
4. Lance `npm test` : un test refuse la photo s'il y reste des informations cachées.

### Changer le CV

1. Exporte ton CV en PDF (dans Canva : *Partager > Télécharger > PDF Standard*).
2. Vérifie-le : **pas de numéro de téléphone ni d'adresse précise**, pas de mots collés.
3. Remplace `public/cv-erhan-aslan.pdf` (même nom de fichier exactement, une seule fois `.pdf`).

Le bouton du haut de page devient automatiquement « Télécharger mon CV » quand le fichier existe,
et « Demander mon CV » (vers le formulaire) s'il est absent.

> Les PDF contiennent des informations cachées (auteur, logiciel). Canva y met par exemple le nom de
> ton compte : vérifie-les dans Acrobat Reader (*Fichier > Propriétés*) si tu veux qu'il n'apparaisse pas.

### Images d'aperçu (partage sur LinkedIn, Discord…)

Elles sont dessinées automatiquement à partir des textes (`app/opengraph-image.tsx` pour l'accueil,
`app/projets/[slug]/opengraph-image.tsx` pour chaque projet) ; celle de l'accueil reprend ta photo.
Si tu modifies leur **dessin** (couleurs, disposition), augmente `OG_DESIGN_VERSION` dans `lib/og.tsx`
(3 → 4) pour que les réseaux sociaux rechargent la nouvelle image. Les changements de textes et de nom
de photo sont pris en compte tout seuls.

---

## 4. Le formulaire de contact (Formspree)

Les messages sont transmis par **Formspree**, qui te les envoie par e-mail. Aucune clé secrète
n'est dans le code : l'identifiant du formulaire passe par une **variable d'environnement**
(un réglage gardé en dehors du code).

### Créer le formulaire (une seule fois)

1. Crée un compte gratuit sur **https://formspree.io** avec ton adresse de contact.
2. *New Form* → nom « Portfolio » → l'adresse de réception est ton e-mail.
3. Formspree affiche une adresse du type `https://formspree.io/f/xyzabcde` :
   l'**identifiant** est la fin, ici `xyzabcde`.

### En local (sur ton ordinateur)

1. Copie `.env.example` et renomme la copie en **`.env.local`** (ce fichier n'est jamais envoyé sur GitHub).
2. Renseigne : `NEXT_PUBLIC_FORMSPREE_ID=xyzabcde`
3. Relance `npm run dev`.

### En ligne (Vercel)

Voir la partie 7, étape 5. **Important :** après avoir ajouté ou modifié la variable sur Vercel,
il faut **redéployer** le site, car la valeur est intégrée au moment de la construction.

### Protection anti-spam et données personnelles

- Un **champ piège** invisible arrête les robots : s'il est rempli, rien n'est envoyé.
- La page *Mentions légales* indique que les messages sont conservés **au plus 12 mois après le
  dernier échange** : pense à supprimer les anciens messages dans Formspree et dans ta boîte mail.

---

## 5. Vérifier avant de publier

Quatre commandes, à lancer avant chaque publication (GitHub les relance de toute façon) :

| Commande | Ce qu'elle vérifie |
|---|---|
| `npm run lint` | La qualité du code (erreurs courantes, bonnes pratiques React/Next.js) |
| `npm run typecheck` | Les types : un champ oublié ou mal écrit dans `content/` est détecté |
| `npm test` | Les 246 tests automatiques (voir ci-dessous) |
| `npm run build` | La construction du site, exactement comme Vercel |

> Arrête `npm run dev` (Ctrl + C) avant `npm run build` : les deux écrivent dans le même dossier `.next`.

### Les tests (dossier `tests/`)

- `npm test` : lance tous les tests (environ 10 secondes).
- `npm run test:watch` : relance les tests à chaque modification.
- `npm run test:coverage` : mesure la part du code testée (rapport détaillé dans `coverage/index.html`).

Ce qui est vérifié :
- **Données** : chaque projet est complet (slug unique, titre, outils, photo créditée, compétences BTS existantes) ;
  le parcours et la veille ne pointent que vers des projets existants ; le CV est un vrai PDF.
- **Données sensibles** : aucune adresse IP, aucun téléphone, identifiant, mot de passe ou nom de domaine
  interne dans les textes publiés.
- **Formulaire** : champs vides, e-mail mal formé, longueurs limites, champ piège, envoi réel simulé
  (ce qui part vers Formspree), erreurs du service, délai de 15 secondes, accessibilité des messages d'erreur.
- **Pages** : projet inconnu → page 404, titres et aperçus de chaque projet, plan du site, robots.txt,
  lien partagé qui ouvre la fiche, fermeture de la fiche sans quitter le site, onglets au clavier.
- **Sécurité** : en-têtes HTTP et politique de sécurité du contenu (CSP), images autorisées.

---

## 6. Publier sur GitHub

### Avec GitHub Desktop (le plus simple)

1. Onglet *Changes* : vérifie la liste des fichiers modifiés (rien de sensible, pas de `.env.local`).
2. En bas à gauche, écris un résumé (ex. « Ajout du projet X ») puis **Commit to main**.
3. Clique **Push origin** : le code part sur GitHub.

### Les mêmes étapes en ligne de commande

```bash
git status
```
Affiche les fichiers modifiés depuis la dernière version enregistrée.

```bash
git add -A
```
Prépare toutes les modifications pour la prochaine version.

```bash
git commit -m "Ajout du projet X"
```
Enregistre une nouvelle version, avec un message qui la décrit.

```bash
git push
```
Envoie les nouvelles versions sur GitHub.

### Les vérifications automatiques (onglet *Actions* sur GitHub)

À chaque envoi, GitHub installe le projet sur une machine neuve et lance lint, types, tests et
construction (fichier `.github/workflows/verifications.yml`). Une **coche verte** apparaît à côté du
dernier envoi si tout va bien, une **croix rouge** sinon (clique dessus pour lire l'erreur).

---

## 7. Mettre le site en ligne avec Vercel

À faire **une seule fois**. Ensuite, chaque envoi sur GitHub met le site à jour tout seul.

1. Va sur **https://vercel.com** → *Sign Up* → **Continue with GitHub** (connexion avec ton compte GitHub).
2. Choisis l'offre gratuite **Hobby**.
3. *Add New… → Project* → à côté de **portfolio-bts-sio**, clique **Import**.
   (Si le dépôt n'apparaît pas : *Adjust GitHub App Permissions* et autorise ce dépôt.)
4. Vercel reconnaît **Next.js** tout seul : ne change ni la commande de construction ni le dossier.
5. Ouvre **Environment Variables** et ajoute :
   - Name : `NEXT_PUBLIC_FORMSPREE_ID`
   - Value : ton identifiant Formspree (ex. `xyzabcde`)
6. Clique **Deploy** et attends 1 à 2 minutes.
7. Ton site est en ligne à une adresse du type `https://portfolio-bts-sio.vercel.app`.

**Si tu ajoutes ou modifies la variable plus tard :** *Settings > Environment Variables*, puis
*Deployments* → menu « … » du dernier déploiement → **Redeploy**.

**Nom de domaine personnel (facultatif) :** *Settings > Domains*. L'adresse du site utilisée dans les
aperçus et le plan du site est trouvée automatiquement ; tu peux aussi la fixer avec la variable
`NEXT_PUBLIC_SITE_URL` (ex. `https://erhan-aslan.fr`).

**Versions de prévisualisation :** Vercel crée aussi une adresse de test pour chaque branche.
Elles ne sont pas indexées par Google.

---

## 8. Après la mise en ligne

1. **Tester le formulaire** : envoie-toi un message depuis le site et vérifie qu'il arrive.
   (Le premier message Formspree demande parfois une confirmation par e-mail.)
2. **Vérifier l'aperçu LinkedIn** : colle l'adresse du site dans
   https://www.linkedin.com/post-inspector/ (fonctionne aussi pour `/projets/<slug>`).
3. **Google** : sur https://search.google.com/search-console, ajoute le site puis soumets
   `https://<ton-adresse>/sitemap.xml` (*Sitemaps*). L'indexation prend quelques jours.
4. **Mettre l'adresse du site** sur LinkedIn, ton CV et dans `README.md`.

---

## 9. Mises à jour régulières

- **Après le BTS** : dans `content/timeline.ts`, retire `current: true` du BTS (et ajoute ton diplôme
  ou ta nouvelle formation) ; adapte le titre (`roleLead`, `roleAccent`) et la présentation (`tagline`)
  dans `content/site.ts`.
- **Mentions légales** : mets à jour la date (`UPDATED_ON`) si tu changes d'hébergeur, de formulaire
  ou d'outil.
- **Dépendances** (une fois par trimestre) :
  ```bash
  npm outdated
  ```
  Liste les outils qui ont une nouvelle version.
  ```bash
  npm audit --omit=dev
  ```
  Recherche des failles connues dans le code envoyé aux visiteurs (doit afficher 0).
  Après une mise à jour, relance les quatre vérifications de la partie 5.

> `npm audit` (sans `--omit=dev`) signale une faille dans `braces`, utilisé uniquement par l'outil
> de vérification du code pendant le développement : elle n'atteint jamais le site en ligne.

---

## 10. Pour l'oral : les choix techniques

### Sécurité (bloc 3)

- **Aucun secret dans le code** : l'identifiant Formspree passe par une variable d'environnement
  (`.env.local` en local, réglages Vercel en ligne) ; `.env.local` est exclu de Git (`.gitignore`).
- **En-têtes de sécurité HTTP** (`next.config.ts`) :
  - **CSP** (*Content Security Policy*, politique de sécurité du contenu) : le navigateur ne charge
    que les ressources du site lui-même ; le formulaire ne peut envoyer ses données qu'à Formspree ;
    pas de plugins ni de balise `<base>` détournée ; le site ne peut pas être affiché dans un cadre
    d'un autre site (*clickjacking*). Limite assumée : `'unsafe-inline'` reste autorisé pour les
    petits scripts que Next.js insère dans les pages générées à l'avance.
  - **HSTS** : HTTPS obligatoire pendant 2 ans ; **X-Content-Type-Options**, **Referrer-Policy**,
    **Permissions-Policy** (caméra, micro, géolocalisation désactivés), **COOP**.
- **Images** : seules les photos réellement utilisées peuvent être redimensionnées par le site,
  pour éviter qu'un tiers épuise le quota gratuit de Vercel.
- **Formulaire** : validation des champs, **champ piège** anti-robots, délai maximal de 15 s,
  aucun détail technique affiché ni écrit dans la console.
- **Données personnelles (RGPD)** : information sous le formulaire, page *Mentions légales*
  (responsable, finalité, destinataire Formspree aux États-Unis, durée de conservation, droits, CNIL),
  aucun cookie ni outil de mesure d'audience.
- **Chaîne de publication** : vérifications automatiques à chaque envoi, avec des droits minimaux
  (lecture seule) ; `npm audit --omit=dev` à 0.

### Accessibilité (normes WCAG 2.2)

Contrastes de couleurs calculés (4,5 minimum pour le texte), navigation complète au clavier avec
focus visible, lien « Aller au contenu », titres hiérarchisés, messages d'erreur reliés à leur champ
et annoncés aux lecteurs d'écran, fenêtre de projet accessible (`<dialog>`, Échap pour fermer),
animations réduites si l'appareil le demande, animation de la bulle arrêtée après 4 s d'inactivité,
zones cliquables d'au moins 24 px, mode « contraste élevé » de Windows pris en compte.

### Performance

Pages générées à l'avance (aucun calcul à chaque visite), images converties en AVIF/WebP et
chargées seulement quand elles deviennent visibles, polices hébergées par le site, environ 143 Ko
de JavaScript au premier chargement. Mesures en local : affichage du contenu principal en 0,14 s,
aucun décalage de mise en page.

### Tests

246 tests (Vitest), 96 % du code couvert. Pour prouver qu'ils servent à quelque chose, 9 bugs ont été
introduits volontairement (champ piège désactivé, projet inconnu sans page 404, CSP qui bloque
Formspree…) : les tests les ont tous détectés. Ils ont aussi trouvé deux vrais bugs pendant le
développement (description Google trop longue, plantage de la construction sans accès à Google Fonts).

---

## 11. Dépannage

| Problème | Solution |
|---|---|
| `npm run dev` : « port 3000 already in use » | Un autre serveur tourne : ferme l'autre terminal, ou utilise http://localhost:3001 proposé par Next.js |
| Le formulaire affiche « momentanément indisponible » | L'identifiant Formspree manque (`.env.local` en local, variable Vercel en ligne + **Redeploy**) |
| Une photo ne s'affiche pas | Adresse Unsplash mal copiée (elle doit commencer par `https://images.unsplash.com/photo-`), ou fichier local absent de `public/images/projets/` |
| `npm run build` échoue après `npm run dev` | Arrête `npm run dev` avant de construire |
| Un test échoue | Lis le message : il indique le fichier et ce qui est attendu (ex. « slug en double ») |
| Croix rouge sur GitHub | Onglet *Actions* → clique sur l'envoi en échec → l'étape en rouge montre l'erreur ; corrige, puis renvoie |
| Les aperçus LinkedIn montrent une ancienne image | Augmente `OG_DESIGN_VERSION` (si le dessin a changé), puis redemande l'analyse dans le Post Inspector |
