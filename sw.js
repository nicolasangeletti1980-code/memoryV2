// ===================================================================
// Le "service worker" : un petit programme qui garde une copie du jeu
// dans l'appareil, pour pouvoir jouer même sans internet.
// ===================================================================

// Le nom de la copie. Si on change les fichiers du jeu, on change ce
// numéro pour forcer une copie toute neuve.
const NOM_COPIE = "memory-myrtille-v2-2";

// La liste des fichiers à garder dans l'appareil
const FICHIERS = [
  "./",
  "./index.html",
  "./jeu.html",
  "./jeu.css",
  "./jeu.js",
  "./sons.js",
  "./musique.js",
  "./univers/myrtille.js",
  "./univers/mer.js",
  "./univers/dino.js",
  "./univers/ferme.js",
  "./univers/foret.js",
  "./univers/zoo.js",
  "./manifest.webmanifest",
  "./icone-180.png",
  "./icone-192.png",
  "./icone-512.png"
];

// 1. Installation : on copie tous les fichiers
self.addEventListener("install", function (evenement) {
  evenement.waitUntil(
    caches.open(NOM_COPIE).then(function (copie) {
      return copie.addAll(FICHIERS);
    })
  );
  self.skipWaiting();   // on devient actif tout de suite
});

// 2. Activation : on efface les vieilles copies
self.addEventListener("activate", function (evenement) {
  evenement.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.map(function (nom) {
        if (nom !== NOM_COPIE) {
          return caches.delete(nom);
        }
      }));
    })
  );
  self.clients.claim();
});

// 3. À chaque fichier demandé :
//    - avec internet : on prend la version en ligne (toujours à jour)
//      et on met la copie à jour ;
//    - sans internet : on donne la copie gardée dans l'appareil.
//    "ignoreSearch" permet de retrouver jeu.html même avec ?u=mer au bout.
self.addEventListener("fetch", function (evenement) {
  const demande = evenement.request;
  if (demande.method !== "GET" || new URL(demande.url).origin !== self.location.origin) {
    return;   // on ne s'occupe que des fichiers du jeu
  }
  evenement.respondWith(
    fetch(demande)
      .then(function (reponse) {
        const copieReponse = reponse.clone();
        caches.open(NOM_COPIE).then(function (copie) {
          copie.put(demande, copieReponse);
        });
        return reponse;
      })
      .catch(function () {
        return caches.match(demande, { ignoreSearch: true });
      })
  );
});
