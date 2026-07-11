# CLAUDE.md — Contexte projet Cercle

> Ce fichier est la source de vérité pour toute instance de Claude (claude.ai ou Claude Code).
> Le lire en entier avant toute modification du projet.

---

## Projet

**Nom :** Cercle (slug EAS : `cercle-v2`)
**Type :** Application mobile React Native / Expo — notation de films/séries/animés entre amis
**Repo :** https://github.com/PizzaSurgeon/cercle
**Branche principale :** `master`
**Expo Dashboard :** https://expo.dev/accounts/pizzasurgeon/projects/cercle-v2

---

## Stack technique

- **Framework :** React Native + Expo SDK 54 (react-native 0.81.5, react 19.1.0)
- **Langage :** TypeScript ~5.5.0
- **Bundler :** Metro (via Expo)
- **Fonts :** `@expo-google-fonts/sora` (400Regular, 500Medium, 600SemiBold, 700Bold)
- **Navigation :** Tab bar custom (`src/components/BottomTabBar.tsx`) — 5 boutons : AMIS (non cliquable) · CERCLE · + · LISTE · PROFIL
- **Thème :** Dark/light via React Context (`src/context/ThemeContext.tsx`)
- **Entrée de l'app :** `index.ts` → `App.tsx`
- **Données films :** TMDB API v3, clé dans `src/config.ts`, service dans `src/services/tmdb.ts`

---

## Infrastructure de déploiement

### Workflow actuel (développement)
Le déploiement EAS Update est **automatique via GitHub Actions** à chaque push sur `master`.
Le fichier workflow est à la **racine du repo** : `.github/workflows/eas-update.yml` (pas dans cercle-v2/).

**Attention :** EAS Update ne fonctionne qu'avec un Development Build ou une vraie app compilée.
Avec **Expo Go**, les OTA ne s'appliquent pas. Pour tester les modifs, faire :
```bash
git pull
npm install --legacy-peer-deps
npx expo start
```
Scanner le QR code dans Expo Go → code le plus récent servi en direct.

### EAS (Expo Application Services)

| Élément | Valeur |
|---|---|
| `owner` | `pizzasurgeon` |
| `projectId` | `9a94c7ff-7fc8-492b-9096-81076d97fbc7` |
| `updates.url` | `https://u.expo.dev/9a94c7ff-7fc8-492b-9096-81076d97fbc7` |
| `runtimeVersion` | `{ "policy": "appVersion" }` |
| Branch EAS active | `main` |

### Git — push depuis le container Claude Code
```bash
git add <fichiers>
git commit -m "message"
git push https://TOKEN@github.com/PizzaSurgeon/cercle.git main:master
```
Le GITHUB_TOKEN est dans `cercle-v2/.claude/settings.local.json` (gitignored).

### Prochaine étape déploiement
Faire un **`eas build`** (1 build/mois gratuit) pour générer une vraie app iOS/Android.
Nécessite un compte Apple Developer ($99/an) pour iOS.
Une fois le build installé, les GitHub Actions OTA fonctionneront automatiquement.

---

## Structure du projet

```
repo/
├── .github/workflows/eas-update.yml   ← workflow CI/CD (racine du repo, pas dans cercle-v2/)
└── cercle-v2/
    ├── assets/
    ├── src/
    │   ├── components/
    │   │   ├── Avatar.tsx                  # Cercle coloré avec initiale
    │   │   ├── BottomTabBar.tsx            # Tab bar custom 5 boutons
    │   │   ├── ConsensusCard.tsx           # Carte feed (poster + note cercle + avis)
    │   │   ├── FilmDetailModal.tsx         # Modal détail film (slide-up plein écran)
    │   │   │                               # → gère RatingModal et UserProfileModal en interne
    │   │   ├── Icons.tsx                   # SVG icons (AmisIcon, CercleIcon, etc.)
    │   │   ├── MediaPoster.tsx             # Image TMDB avec fallback PosterPlaceholder
    │   │   ├── PosterPlaceholder.tsx       # Miniature poster coloré (fallback)
    │   │   ├── RatingModal.tsx             # Bottom sheet notation (avis + plateforme + cercle)
    │   │   ├── RecommendationCard.tsx      # Carte "Recommandé pour toi" (cliquable)
    │   │   ├── SearchModal.tsx             # Modal recherche TMDB (bouton +)
    │   │   ├── StarRating.tsx              # Étoiles lecture seule (rendu étoile par étoile)
    │   │   └── UserProfileModal.tsx        # Modal profil ami (stats + listes)
    │   ├── context/
    │   │   └── ThemeContext.tsx            # Dark/light theme provider
    │   ├── screens/
    │   │   ├── FeedScreen.tsx              # Onglet CERCLE (feed + filtres + modals)
    │   │   ├── WatchlistScreen.tsx         # Onglet LISTE (À voir / Vus / Recommandés)
    │   │   └── ProfileScreen.tsx           # Onglet PROFIL (stats + settings)
    │   ├── services/
    │   │   └── tmdb.ts                     # Fonctions TMDB : search, getMediaDetails, getPosterUrl…
    │   ├── types/
    │   │   └── media.ts                    # Types TypeScript : MediaItem, TMDBSearchResult…
    │   └── theme.ts                        # Couleurs dark/light + constantes Fonts
    ├── App.tsx                             # Entry point, fonts Sora, hook OTA, SearchModal
    ├── app.json                            # Config Expo + EAS
    ├── config.ts                           # Clé API TMDB
    ├── eas.json
    ├── index.ts
    └── package.json
```

---

## Thème visuel

- **Dark** : background `#0B0D11`, accent `#F2B441` (or), ink `#F5F2EA`
- **Light** : background `#E2D0BB` (crème), accent `#C8603C` (terracotta), ink `#3A2A20`
- Toggle dans le header du feed (CERCLE) et dans l'écran Profil

---

## Architecture des modals (important)

Les modals s'empilent dans leur propre contexte pour éviter les problèmes de stacking iOS :

- **FeedScreen** → rend `FilmDetailModal` + `UserProfileModal` (pour les cartes du feed)
- **FilmDetailModal** → gère `RatingModal` et `UserProfileModal` en interne (reviewers dans le détail)
- **WatchlistScreen** → rend son propre `FilmDetailModal`
- **App.tsx** → rend `SearchModal` + `RatingModal` (pour la recherche via bouton +)
- **UserProfileModal** : `animationType="slide"` sans `transparent` → fond opaque (couleur du thème)

---

## TMDB API

- **Clé API :** dans `src/config.ts` → `TMDB_API_KEY`
- **Langue :** `fr-FR` par défaut
- **Fournisseurs watch :** région `FR`
- **IDs utilisés dans les mocks :**
  - Shōgun : TV 126308
  - Dune 2 : Movie 693134
  - Attack on Titan : TV 1429
  - Past Lives : Movie 877269
  - Frieren : TV 209867
  - Poor Things : Movie 792307
  - The Bear : TV 136315
  - Jujutsu Kaisen : TV 95479
  - Oppenheimer : Movie 872585
  - The Last of Us : TV 100088

---

## Données mock (temporaires)

Tout le contenu actuel (Shōgun, Dune, AOT, profils Camille/Tom/Sofia/Léa/Maxime) est du **mock data** pour le développement. Il sera remplacé par de vraies données quand le backend sera en place.

**Membres du cercle mock** (couleurs d'avatar réutilisées partout) :
| Nom | Initial | bg | fg |
|---|---|---|---|
| Camille | C | #D9A8B4 | #6B2E3E |
| Tom | T | #A9C0CE | #2E4A57 |
| Sofia | S | #C7B79B | #5A4A30 |
| Léa | L | #E5B98A | #7A3B22 |
| Maxime | M | #B8C8A8 | #42562E |

---

## Fonctionnalités implémentées

### Onglet CERCLE (feed)
- Feed filtrable : Tout / Films / Séries / Animés
- Cartes ConsensusCard avec poster TMDB réel, note moyenne, avis du cercle
- Carte "Recommandé pour toi" (Past Lives) avec poster TMDB, cliquable
- Clic sur carte → FilmDetailModal (poster, synopsis, durée, plateforme, avis, bouton noter)
- Clic sur reviewer → UserProfileModal (stats + listes publiques)
- Bouton "Noter ce titre" → RatingModal (avis texte + plateforme + sélection membres cercle)

### Onglet LISTE
- 3 sections : À voir / Vus & notés / Recommandé par ton cercle
- Posters TMDB réels pour tous les titres
- Chaque titre cliquable → FilmDetailModal avec avis du cercle si disponibles
- Shōgun, Dune 2, Past Lives, AOT ont leurs vraies reviews mock

### Onglet PROFIL
- Stats personnelles (mock), distribution des notes, formats
- Toggle thème dark/light

### Bouton + (SearchModal)
- Recherche TMDB avec debounce 400ms
- Résultats avec poster, année, badge Film/Série/Animé, synopsis tronqué
- Clic sur résultat → RatingModal
- Clavier dark/light selon le thème

### RatingModal
- Champ texte avis (140 car.)
- Chips plateforme de visionnage
- Grille membres du cercle avec avatars (sélection multiple) + bouton "Tout le cercle"
- Les étoiles ont été supprimées (à remplacer par un autre système)

---

## Conventions importantes

- **Ne pas changer la `version` dans `app.json`** → invalide la runtimeVersion, force un rebuild
- **Branch EAS = `main`** (push Git sur `master`, EAS publie sur `main`)
- **`npm install --legacy-peer-deps`** requis (conflit peer deps @types/react v19)
- **LF/CRLF warnings** Git sur Windows → normaux, non bloquants
- **`useSafeAreaInsets()`** appliqué sur tous les écrans pour l'encoche iPhone
- **StarRating** : rendu étoile par étoile avec `lineHeight` explicite (évite le clipping)
- **Pas de `transparent` sur UserProfileModal** → problème de backdrop en mode nuit sur iOS

---

## Backend (à venir)

**Décisions prises :**
- **Auth + DB :** Supabase (plan gratuit pour démarrer, $23/mois en Pro)
- **Métadonnées films :** TMDB reste en read-only (poster, synopsis, durée, plateformes)
- **Hébergement API custom si besoin :** VPS Hostinger ou similaire (indépendant d'EAS)

**Ce qu'il faudra construire :**
- Authentification utilisateurs (email/password via Supabase Auth)
- Tables : users, ratings, watchlists, circles, friendships
- Remplacer le mock data par des appels API réels

---

## Historique des sessions

### Session 1 — 17/06/2026 (claude.ai)
- Setup EAS CLI, EAS Update, EAS Build
- Création `eas.json`, `app.json` avec projectId, hook OTA dans `App.tsx`

### Session 2 — 17/06/2026 (Claude Code)
- Refonte UI complète : thème dark/light, police Sora, 3 écrans

### Session 3 — 18-19/06/2026 (Claude Code)
- GitHub Actions pour EAS Update automatique
- Tab bar : AMIS · CERCLE · + · LISTE · PROFIL
- Fix clipping note ConsensusCard
- Modals : FilmDetailModal, UserProfileModal, RatingModal
- Reviewers cliquables dans les cartes

### Session 4 — 11/07/2026 (Claude Code)
- Intégration TMDB : service complet, types, config
- MediaPoster avec fallback, posters réels dans le feed et la liste
- SearchModal sur bouton + avec debounce
- Suppression barre de progression (AOT)
- Fix stacking modals iOS (RatingModal et UserProfileModal gérés en interne)
- Safe area insets sur tous les écrans
- UserProfileModal : fond opaque, plus de transparence
- WatchlistScreen : titres cliquables + reviews mock par titre
- RatingModal : grille membres cercle avec sélection multiple, étoiles supprimées
- Clavier SearchModal dark/light selon thème
