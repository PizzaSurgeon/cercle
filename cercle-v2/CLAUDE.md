# CLAUDE.md — Contexte projet Cercle

> Ce fichier est la source de vérité pour toute instance de Claude (claude.ai ou Claude Code).
> Le lire en entier avant toute modification du projet.

---

## Projet

**Nom :** Cercle (slug EAS : `cercle-v2`)
**Type :** Application mobile React Native / Expo — notation de films entre amis
**Repo :** https://github.com/PizzaSurgeon/cercle
**Branche principale :** `master`
**Expo Dashboard :** https://expo.dev/accounts/pizzasurgeon/projects/cercle-v2

---

## Stack technique

- **Framework :** React Native + Expo SDK 54 (react-native 0.81.5, react 19.1.0)
- **Langage :** TypeScript ~5.5.0
- **Bundler :** Metro (via Expo)
- **Fonts :** `@expo-google-fonts/sora` (400Regular, 500Medium, 600SemiBold, 700Bold)
- **Navigation :** Tab bar custom (`src/components/BottomTabBar.tsx`) — 4 onglets : Fil / Liste / + / Profil
- **Thème :** Dark/light via React Context (`src/context/ThemeContext.tsx`)
- **Entrée de l'app :** `index.ts` → `App.tsx`

---

## Infrastructure de déploiement

### EAS (Expo Application Services)

Tout est configuré et opérationnel :

| Élément | Valeur |
|---|---|
| `owner` | `pizzasurgeon` |
| `projectId` | `9a94c7ff-7fc8-492b-9096-81076d97fbc7` |
| `updates.url` | `https://u.expo.dev/9a94c7ff-7fc8-492b-9096-81076d97fbc7` |
| `runtimeVersion` | `{ "policy": "appVersion" }` |
| Branch EAS active | `main` |

### Ce que fait le hook OTA dans App.tsx

Au démarrage, `expo-updates` vérifie silencieusement si une mise à jour est disponible sur la branche `main`. Si oui, elle est téléchargée et l'app se recharge automatiquement. En développement local (`expo start`), ce hook est inactif.

---

## Workflow de déploiement

### Après chaque modification de code :

```bash
# 1. Commiter et pusher sur GitHub
git add -A
git commit -m "description"
git push

# 2. Publier la mise à jour OTA
eas update --branch main --message "description"
```

### Sur le téléphone :
- Fermer complètement l'app Expo Go
- Rouvrir → mise à jour appliquée automatiquement

### Limitations OTA
Un **rebuild natif** (`eas build`) est nécessaire uniquement si :
- Ajout d'une lib avec du code natif
- Modification des permissions Android/iOS
- Changement de la `version` dans `app.json`

---

## Structure du projet

```
cercle-v2/
├── assets/
├── src/
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── BottomTabBar.tsx       # 4 onglets : fil / liste / + / profil
│   │   ├── ConsensusCard.tsx      # Carte principale du feed (avec progress optionnel)
│   │   ├── Icons.tsx              # Tous les SVG icons
│   │   ├── PosterPlaceholder.tsx  # Miniature poster coloré
│   │   ├── RecommendationCard.tsx
│   │   └── StarRating.tsx
│   ├── context/
│   │   └── ThemeContext.tsx       # Dark/light theme provider
│   ├── screens/
│   │   ├── FeedScreen.tsx         # Onglet Fil
│   │   ├── WatchlistScreen.tsx    # Onglet Liste
│   │   └── ProfileScreen.tsx      # Onglet Profil
│   └── theme.ts                   # Couleurs dark/light + constantes Fonts
├── App.tsx                        # Entry point, fonts Sora, hook OTA
├── app.json                       # Config Expo + EAS
├── eas.json                       # Config EAS Build
├── index.ts
├── package.json
└── tsconfig.json
```

---

## Thème visuel

- **Dark** : background `#0B0D11`, accent `#F2B441` (or), ink `#F5F2EA`
- **Light** : background `#E2D0BB` (crème), accent `#C8603C` (terracotta), ink `#3A2A20`
- Toggle dans le header du Fil et dans l'écran Profil

---

## Conventions importantes

- **Ne pas changer la `version` dans `app.json`** sans raison — cela invalide la `runtimeVersion` et force un rebuild natif
- **Branch EAS = `main`** (pas `master`) — le push Git est sur `master`, les updates EAS publient sur `main`
- Les `LF/CRLF warnings` de Git sur Windows sont normaux et non bloquants
- `npm install --legacy-peer-deps` requis (conflit peer deps @types/react v19)

---

## Historique des sessions

### Session 1 — 17/06/2026 (claude.ai)
- Setup complet EAS CLI, EAS Update, EAS Build
- Création `eas.json`, mise à jour `app.json` avec projectId et config updates
- Installation `expo-updates`, ajout hook OTA dans `App.tsx`
- Premier `eas update` réussi (Update group ID : `1c67152b-1294-4a90-866b-19f237d53bff`)

### Session 2 — 17/06/2026 (Claude Code)
- Refonte complète UI depuis Claude Design : thème sombre/clair, police Sora
- 3 écrans fonctionnels : Fil (feed + filtres), Liste (watchlist), Profil (stats + settings)
- Navigation bottom tab custom (4 onglets)
- Merge config EAS dans la nouvelle UI
