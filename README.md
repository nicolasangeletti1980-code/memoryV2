# Les Memory de Myrtille — V2

Un jeu de Memory pour jeunes enfants, à jouer sur téléphone, tablette ou ordinateur.
Il s'installe comme une appli et marche sans internet.

## Les six univers

| Univers | Cartes | Bruitages | Comptine | Victoire |
|---|---|---|---|---|
| Myrtille | myrtille, M, prénom, Mimi, hovawart, bonhomme de neige, 2 nounours | clochettes | Au clair de la lune | Ding ding ! Bravo Myrtille ! |
| La Mer | hippocampe, poisson clown, étoile de mer, coquille, poissons, sirène, trident | bulles | Ah ! vous dirai-je, maman | Splash ! Bravo Myrtille ! |
| Les Dinos | T-rex, tricératops, diplodocus, stégosaure, ptéranodon, ankylosaure, bébé dino, volcan | rugissements | Frère Jacques | ROAAAR ! Bravo Myrtille ! |
| La Ferme | vache, cochon, poule, mouton, cheval, lapin, canard, tracteur | xylophone | Il était une bergère | Cocorico ! Bravo Myrtille ! |
| La Forêt | renard, hérisson, écureuil, hibou, faon, champignon, escargot, sapin | chants d'oiseaux | Promenons-nous dans les bois | Hou hou ! Bravo Myrtille ! |
| Le Zoo | lion, éléphant, girafe, zèbre, singe, panda, hippopotame, manchot | tambour | Une souris verte | Boum boum ! Bravo Myrtille ! |

Tous les dessins sont des SVG faits en code (aucune image à télécharger).
Les sons et la musique sont fabriqués par le navigateur (aucun fichier son).
Les six comptines sont traditionnelles (domaine public). Les trois nouvelles
(*Il était une bergère*, *Promenons-nous dans les bois*, *Une souris verte*) sont
transcrites note par note depuis les partitions des articles Wikipédia en français.

## Les sons : la même règle dans les six univers

- **Paire trouvée** : un court motif dans l'instrument de l'univers, sur une note
  propre à chaque dessin (8 dessins = 8 notes de la gamme). Les dinosaures ont,
  eux, chacun leur cri.
- **Victoire** : un motif d'environ 2 secondes dans le même instrument, puis la fenêtre
  « … Bravo Myrtille ! ».
- **Même volume partout** : chaque son a été mesuré (volume perçu sur un haut-parleur
  de téléphone) et réglé pour que les six univers sonnent aussi fort les uns que les
  autres (moins de 1 dB d'écart). Les réglages sont `volumePaire` et `volumeVictoire`
  en haut de chaque fichier `univers/*.js`.

## Les parties

- Chaque partie se joue avec **16 cartes** (8 paires).
- Les cartes sont mélangées à chaque partie. Chaque univers a 8 dessins :
  ils sont donc tous dans chaque partie. Si on ajoute des dessins à un univers,
  le jeu en tire 8 au hasard.

## Ce qui est nouveau par rapport à la première version

- Un seul moteur de jeu (`jeu.js`) pour tous les univers, au lieu d'une copie par jeu.
- 3 univers de plus : la Ferme, la Forêt et le Zoo.
- Toujours 16 cartes : plus de choix de niveau.
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
   les sons et les dessins (au moins 8, car une partie en utilise 8).
2. Ajouter `<script src="univers/nouveau.js"></script>` dans `index.html` et `jeu.html`.
3. Ajouter le nom dans la liste des tuiles de `index.html`.
4. Ajouter le fichier dans `sw.js` et changer `NOM_COPIE`.

## Essayer en local

Le mode hors ligne a besoin d'un petit serveur :

```
python3 -m http.server 8000
```

puis ouvrir http://localhost:8000 dans le navigateur.
