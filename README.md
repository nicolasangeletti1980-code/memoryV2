# Les Memory de Myrtille — V2

Un jeu de Memory pour jeunes enfants, à jouer sur téléphone, tablette ou ordinateur.
Il s'installe comme une appli et marche sans internet.

## Les six univers

| Univers | Cartes | Bruitages | Comptine |
|---|---|---|---|
| Myrtille | myrtille, M, prénom, Mimi, hovawart, bonhomme de neige, 2 nounours | clochettes | Au clair de la lune |
| La Mer | hippocampe, poisson clown, étoile de mer, coquille, poissons, sirène, trident | bulles | Ah ! vous dirai-je, maman |
| Les Dinos | T-rex, tricératops, diplodocus, stégosaure, ptéranodon, ankylosaure, bébé dino, volcan | rugissements | Frère Jacques |
| La Ferme | vache, cochon, poule, mouton, cheval, lapin, canard, tracteur | xylophone | Ah ! vous dirai-je, maman |
| La Forêt | renard, hérisson, écureuil, hibou, faon, champignon, escargot, sapin | chants d'oiseaux | Au clair de la lune |
| Le Zoo | lion, éléphant, girafe, zèbre, singe, panda, hippopotame, manchot | tambour | Frère Jacques |

Tous les dessins sont des SVG faits en code (aucune image à télécharger).
Les sons et la musique sont fabriqués par le navigateur (aucun fichier son).

## Les niveaux

- **8 cartes** (4 paires), **12 cartes** (6 paires), **16 cartes** (8 paires).
- Les dessins sont tirés au hasard à chaque partie.
- Le bouton de niveau montre une petite grille de points : on voit le nombre
  de cartes sans savoir lire.

## Ce qui est nouveau par rapport à la première version

- Un seul moteur de jeu (`jeu.js`) pour tous les univers, au lieu d'une copie par jeu.
- 3 univers de plus : la Ferme, la Forêt et le Zoo.
- 3 niveaux au lieu de 2.
- Un bouton **pause** : le chrono s'arrête et un voile cache les cartes.
  Le jeu se met aussi en pause tout seul quand on quitte l'appli.
- Un chrono qui reste juste même si l'appareil ralentit la page.
- La taille des cartes s'adapte à l'écran (téléphone debout ou couché, ordinateur).
- Les records enregistrés sont vérifiés avant d'être affichés.
- Un contour bien visible quand on joue au clavier sur ordinateur.

## Les fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | L'accueil : on choisit un univers |
| `jeu.html`, `jeu.css`, `jeu.js` | La page de jeu et son moteur (`jeu.html?u=ferme`) |
| `univers/*.js` | Un fichier par univers : couleurs, sons, dessins des cartes |
| `sons.js` | Les bruitages (clochette, bulle, rugissement, xylophone, oiseau, tambour) |
| `musique.js` | Les comptines, façon boîte à musique |
| `sw.js` | La copie hors ligne (à mettre à jour si on ajoute un fichier) |
| `manifest.webmanifest`, `icone-*.png` | L'installation comme une appli |

## Ajouter un univers

1. Copier `univers/ferme.js` en `univers/nouveau.js` et changer l'`id`, les couleurs,
   les sons et les 8 dessins (au moins 8, car le niveau 16 cartes en utilise 8).
2. Ajouter `<script src="univers/nouveau.js"></script>` dans `index.html` et `jeu.html`.
3. Ajouter le nom dans la liste des tuiles de `index.html`.
4. Ajouter le fichier dans `sw.js` et changer `NOM_COPIE`.

## Essayer en local

Le mode hors ligne a besoin d'un petit serveur :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 dans le navigateur.
