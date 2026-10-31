// ===================================================================
// jeu.js : le moteur du Memory, le même pour tous les univers.
// L'univers est choisi dans l'adresse de la page : jeu.html?u=mer
// Ses couleurs, ses sons et ses dessins sont dans le dossier univers/.
// ===================================================================

(function () {
  // ===================================================================
  // 1. Quel univers ?
  // ===================================================================
  const parametre = new URLSearchParams(window.location.search).get("u");
  const U = UNIVERS[parametre];
  if (!U) {
    // Univers inconnu : on retourne à l'accueil
    window.location.replace("index.html");
    return;
  }

  // Les trois niveaux : le nombre de paires sur le plateau
  // (4 paires = 8 cartes, 6 paires = 12 cartes, 8 paires = 16 cartes)
  const NIVEAUX = [4, 6, 8];

  // ===================================================================
  // 2. La mémoire du téléphone (niveau, records, son)
  // try/catch évite que le jeu plante si cette mémoire est bloquée.
  // ===================================================================
  function lireMemoire(cle) {
    try {
      return localStorage.getItem(cle);
    } catch (e) {
      return null;
    }
  }

  function ecrireMemoire(cle, valeur) {
    try {
      localStorage.setItem(cle, valeur);
    } catch (e) {
      // Pas grave : l'info ne sera simplement pas gardée
    }
  }

  const CLE_NIVEAU = "memory-v2-niveau";
  const CLE_SON = "memory-v2-son";

  // On reprend le dernier niveau choisi (8 cartes si rien n'est enregistré)
  let paires = Number(lireMemoire(CLE_NIVEAU));
  if (NIVEAUX.indexOf(paires) === -1) {
    paires = NIVEAUX[0];
  }

  // Un record par univers et par niveau
  function cleRecord() {
    return "memory-v2-record-" + U.id + "-" + paires;
  }

  // On vérifie que le record lu est correct (sinon on l'ignore)
  function lireRecord() {
    try {
      const r = JSON.parse(lireMemoire(cleRecord()));
      if (r && Number.isInteger(r.coups) && r.coups > 0 &&
          Number.isInteger(r.secondes) && r.secondes >= 0) {
        return r;
      }
    } catch (e) {}
    return null;
  }

  // ===================================================================
  // 3. On habille la page aux couleurs de l'univers
  // ===================================================================
  const c = U.couleurs;
  const style = document.documentElement.style;
  style.setProperty("--rose", c.rose);
  style.setProperty("--rose-clair", c.roseClair);
  style.setProperty("--bleu-clair", c.bleuClair);
  style.setProperty("--violet", c.violet);
  style.setProperty("--violet-fonce", c.violetFonce);
  style.setProperty("--mot-milieu", c.motDuMilieu);
  style.setProperty("--fond", c.fond);
  style.setProperty("--ombre", c.ombre);
  style.setProperty("--voile", c.voile);
  style.setProperty("--dos", c.dos);
  style.setProperty("--bouton", c.bouton);
  style.setProperty("--mode-actif", c.modeActif);
  document.querySelector('meta[name="theme-color"]').setAttribute("content", c.theme);
  document.title = U.titre.join(" ");
  document.getElementById("titre-1").textContent = U.titre[0];
  document.getElementById("titre-2").textContent = U.titre[1];
  document.getElementById("titre-3").textContent = U.titre[2];
  document.getElementById("titre-victoire").textContent = U.bravo;

  // ===================================================================
  // 4. Les éléments de la page
  // ===================================================================
  const plateau = document.getElementById("plateau");
  const zone = document.getElementById("zone");
  const affichageCoups = document.getElementById("coups");
  const affichageTemps = document.getElementById("temps");
  const affichageRecord = document.getElementById("record");
  const fenetreVictoire = document.getElementById("victoire");
  const fenetrePause = document.getElementById("pause");
  const boutonPause = document.getElementById("bouton-pause");
  const boutonSon = document.getElementById("bouton-son");
  const annonce = document.getElementById("annonce");

  // ===================================================================
  // 5. Les variables qui changent pendant la partie
  // ===================================================================
  // etat : "attente" (pas encore commencé), "en-cours", "pause" ou "fini"
  let etat = "attente";
  let premiereCarte = null;   // la 1re carte retournée
  let deuxiemeCarte = null;   // la 2e carte retournée
  let bloque = false;         // true = on attend, on ne peut pas toucher
  let coups = 0;
  let pairesTrouvees = 0;
  let attente = null;         // le délai en cours (retournement ou victoire)
  let sonActif = lireMemoire(CLE_SON) !== "non";

  // ===================================================================
  // 6. Le chronomètre
  // On note l'heure de départ plutôt que de compter les secondes une à une :
  // le temps reste juste même si le téléphone ralentit la page.
  // ===================================================================
  let tempsCumule = 0;        // millisecondes déjà jouées (avant une pause)
  let departSegment = null;   // heure de la dernière reprise (null = arrêté)
  let affichageChrono = null; // le minuteur qui met l'écran à jour

  function secondesJouees() {
    const enCours = departSegment === null ? 0 : performance.now() - departSegment;
    return Math.floor((tempsCumule + enCours) / 1000);
  }

  function formaterTemps(total) {
    const minutes = Math.floor(total / 60);
    return minutes + ":" + String(total % 60).padStart(2, "0");
  }

  function demarrerChrono() {
    departSegment = performance.now();
    clearInterval(affichageChrono);
    affichageChrono = setInterval(function () {
      affichageTemps.textContent = formaterTemps(secondesJouees());
    }, 250);
  }

  function arreterChrono() {
    if (departSegment !== null) {
      tempsCumule += performance.now() - departSegment;
      departSegment = null;
    }
    clearInterval(affichageChrono);
    affichageTemps.textContent = formaterTemps(secondesJouees());
  }

  // ===================================================================
  // 7. Mélanger un tableau (méthode de Fisher-Yates)
  // ===================================================================
  function melanger(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
  }

  // ===================================================================
  // 8. Les boutons de niveau : une petite grille de points + le nombre
  // ===================================================================
  function dessinNiveau(nombreCartes) {
    const rangees = nombreCartes / 4;
    let points = "";
    for (let r = 0; r < rangees; r++) {
      for (let col = 0; col < 4; col++) {
        points += '<rect x="' + (col * 6.5) + '" y="' + (r * 6.5) + '" width="5" height="5" rx="1.2"/>';
      }
    }
    return '<svg viewBox="0 0 25 25" aria-hidden="true" fill="currentColor">' + points + "</svg>";
  }

  const zoneNiveaux = document.getElementById("niveaux");
  NIVEAUX.forEach(function (n) {
    const bouton = document.createElement("button");
    bouton.className = "niveau";
    bouton.dataset.paires = n;
    bouton.setAttribute("aria-label", (n * 2) + " cartes");
    bouton.innerHTML = dessinNiveau(n * 2) + "<span>" + (n * 2) + "</span>";
    bouton.addEventListener("click", function () {
      paires = n;
      ecrireMemoire(CLE_NIVEAU, String(n));
      nouvellePartie();
    });
    zoneNiveaux.appendChild(bouton);
  });

  // ===================================================================
  // 9. Le record affiché en haut
  // ===================================================================
  function afficherRecord() {
    const record = lireRecord();
    affichageRecord.textContent = record ? record.coups + " coups" : "–";
  }

  // ===================================================================
  // 10. La taille des cartes
  // On essaie plusieurs nombres de colonnes et on garde celui qui donne
  // les plus grandes cartes dans la place disponible.
  // ===================================================================
  function ajusterPlateau() {
    const nombre = paires * 2;
    const largeur = zone.clientWidth;
    const hauteur = zone.clientHeight;
    const ecart = Math.min(largeur, hauteur) < 420 ? 8 : 12;
    let meilleure = { taille: 0, colonnes: 4 };
    [2, 3, 4, 6, 8].forEach(function (colonnes) {
      if (nombre % colonnes !== 0) return;
      const rangees = nombre / colonnes;
      const taille = Math.min(
        (largeur - ecart * (colonnes - 1)) / colonnes,
        (hauteur - ecart * (rangees - 1)) / rangees
      );
      if (taille > meilleure.taille) {
        meilleure = { taille: taille, colonnes: colonnes };
      }
    });
    // Pas plus de 180 px : au-delà, les cartes seraient énormes sur ordinateur
    const taille = Math.max(40, Math.min(180, Math.floor(meilleure.taille)));
    plateau.style.setProperty("--taille", taille + "px");
    plateau.style.setProperty("--ecart", ecart + "px");
    plateau.style.gridTemplateColumns = "repeat(" + meilleure.colonnes + ", " + taille + "px)";
  }

  if ("ResizeObserver" in window) {
    new ResizeObserver(ajusterPlateau).observe(zone);
  } else {
    window.addEventListener("resize", ajusterPlateau);
  }

  // ===================================================================
  // 11. Les bruitages (le bouton 🔔)
  // ===================================================================
  function afficherBoutonSon() {
    boutonSon.textContent = sonActif ? "🔔" : "🔕";
    boutonSon.setAttribute("aria-label", sonActif ? "Couper les bruitages" : "Remettre les bruitages");
    boutonSon.classList.toggle("eteint", !sonActif);
  }

  boutonSon.addEventListener("click", function () {
    sonActif = !sonActif;
    ecrireMemoire(CLE_SON, sonActif ? "oui" : "non");
    afficherBoutonSon();
    if (sonActif) {
      U.sonPaire(U.cartes[0]);   // petit son pour confirmer que c'est remis
    }
  });

  afficherBoutonSon();

  // ===================================================================
  // 12. Créer une nouvelle partie
  // ===================================================================
  function nouvellePartie() {
    clearTimeout(attente);      // annule un retournement encore en attente
    arreterChrono();
    etat = "attente";
    premiereCarte = null;
    deuxiemeCarte = null;
    bloque = false;
    coups = 0;
    pairesTrouvees = 0;
    tempsCumule = 0;
    affichageCoups.textContent = "0";
    affichageTemps.textContent = "0:00";
    fenetreVictoire.classList.remove("visible");
    fenetrePause.classList.remove("visible");
    boutonPause.disabled = true;
    plateau.classList.remove("secousse");
    document.querySelectorAll(".confetti").forEach(function (el) { el.remove(); });
    afficherRecord();

    // On allume le bouton du niveau choisi
    document.querySelectorAll(".niveau").forEach(function (bouton) {
      bouton.setAttribute("aria-pressed", String(Number(bouton.dataset.paires) === paires));
    });

    // On tire au hasard les dessins de la partie, puis on fait les paires
    const choix = melanger(U.cartes.slice()).slice(0, paires);
    const paquet = melanger(choix.concat(choix));

    plateau.innerHTML = "";
    paquet.forEach(function (modele) {
      const carte = document.createElement("button");
      carte.className = "carte";
      carte.dataset.id = modele.id;
      carte.setAttribute("aria-label", "Carte cachée");
      carte.innerHTML =
        '<div class="carte-interieur">' +
          '<div class="dos">' + U.dos + "</div>" +
          '<div class="face" style="background:' + modele.fond + '">' + modele.dessin + "</div>" +
        "</div>";
      carte.addEventListener("click", function () {
        toucherCarte(carte, modele);
      });
      plateau.appendChild(carte);
    });

    ajusterPlateau();
  }

  // ===================================================================
  // 13. Quand on touche une carte
  // ===================================================================
  function toucherCarte(carte, modele) {
    // On ignore le toucher si on attend, si la partie est en pause ou
    // finie, ou si la carte est déjà retournée
    if (bloque || etat === "pause" || etat === "fini" || carte.classList.contains("retournee")) {
      return;
    }

    // Le synthétiseur a besoin d'un toucher pour démarrer
    if (sonActif) {
      SONS.preparer();
    }

    // Le chrono démarre au tout premier toucher
    if (etat === "attente") {
      etat = "en-cours";
      boutonPause.disabled = false;
      demarrerChrono();
    }

    carte.classList.add("retournee");
    carte.setAttribute("aria-label", modele.nom);

    if (premiereCarte === null) {
      premiereCarte = carte;
      return;
    }

    // C'est la 2e carte : un coup est terminé
    deuxiemeCarte = carte;
    coups++;
    affichageCoups.textContent = coups;

    if (premiereCarte.dataset.id === deuxiemeCarte.dataset.id) {
      // Les deux cartes sont identiques : elles restent visibles
      premiereCarte.classList.add("trouvee");
      deuxiemeCarte.classList.add("trouvee");
      premiereCarte = null;
      deuxiemeCarte = null;
      pairesTrouvees++;
      annonce.textContent = "Paire trouvée : " + modele.nom;

      if (pairesTrouvees === paires) {
        victoire();
      } else if (sonActif) {
        U.sonPaire(modele);
      }
    } else {
      // Pas identiques : on attend 1 seconde, puis on les retourne
      bloque = true;
      attente = setTimeout(function () {
        [premiereCarte, deuxiemeCarte].forEach(function (c) {
          c.classList.remove("retournee");
          c.setAttribute("aria-label", "Carte cachée");
        });
        premiereCarte = null;
        deuxiemeCarte = null;
        bloque = false;
      }, 1000);
    }
  }

  // ===================================================================
  // 14. La pause
  // ===================================================================
  function mettreEnPause() {
    if (etat !== "en-cours") return;
    etat = "pause";
    arreterChrono();
    fenetrePause.classList.add("visible");
    document.getElementById("reprendre").focus();
  }

  function reprendre() {
    if (etat !== "pause") return;
    etat = "en-cours";
    fenetrePause.classList.remove("visible");
    demarrerChrono();
    boutonPause.focus();
  }

  boutonPause.addEventListener("click", mettreEnPause);
  document.getElementById("reprendre").addEventListener("click", reprendre);

  // Si on quitte l'appli (autre appli, écran éteint), le jeu se met en pause
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      mettreEnPause();
    }
  });

  // ===================================================================
  // 15. Pluie de confettis quand on gagne
  // ===================================================================
  function lancerConfettis() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < 30; i++) {
      const el = document.createElement("span");
      el.className = "confetti";
      el.setAttribute("aria-hidden", "true");
      el.textContent = U.confettis[i % U.confettis.length];
      el.style.left = Math.random() * 100 + "vw";
      el.style.animationDuration = 2 + Math.random() * 2 + "s";
      el.style.animationDelay = Math.random() * 0.8 + "s";
      document.body.appendChild(el);
      el.addEventListener("animationend", function () { el.remove(); });
    }
  }

  // ===================================================================
  // 16. Fin de partie
  // ===================================================================
  function victoire() {
    etat = "fini";
    arreterChrono();
    boutonPause.disabled = true;
    const secondes = secondesJouees();

    if (sonActif) {
      U.sonVictoire();
    }

    document.getElementById("resultat").textContent =
      "Gagné en " + coups + " coups et " + formaterTemps(secondes) + ".";

    // Meilleur score = le moins de coups. À égalité, le temps le plus court.
    const ancien = lireRecord();
    const texteRecord = document.getElementById("message-record");
    if (ancien === null || coups < ancien.coups || (coups === ancien.coups && secondes < ancien.secondes)) {
      ecrireMemoire(cleRecord(), JSON.stringify({ coups: coups, secondes: secondes }));
      texteRecord.innerHTML = '<span class="record">🏆 Nouveau record !</span>';
    } else {
      texteRecord.textContent = "Record : " + ancien.coups + " coups en " + formaterTemps(ancien.secondes);
    }
    afficherRecord();

    // Le personnage de l'univers saute au-dessus du message
    const mascotte = U.cartes.find(function (carte) { return carte.id === U.mascotte; }) || U.cartes[0];
    document.getElementById("mascotte").innerHTML = mascotte.dessin;

    // Toutes les cartes font la fête : elles sautent l'une après l'autre
    document.querySelectorAll(".carte").forEach(function (carte, i) {
      carte.style.setProperty("--retard", (0.5 + i * 0.06) + "s");
      carte.classList.add("danse");
    });

    // Les dinosaures font trembler le plateau
    if (U.secousse) {
      plateau.classList.add("secousse");
    }

    attente = setTimeout(function () {
      fenetreVictoire.classList.add("visible");
      document.getElementById("rejouer-victoire").focus();
      lancerConfettis();
    }, 800);
  }

  // ===================================================================
  // 17. Les boutons "Rejouer"
  // ===================================================================
  document.getElementById("rejouer").addEventListener("click", nouvellePartie);
  document.getElementById("rejouer-victoire").addEventListener("click", nouvellePartie);

  // ===================================================================
  // 18. Le décor qui flotte derrière le jeu
  // ===================================================================
  const decor = document.getElementById("decor");
  for (let i = 0; i < 12; i++) {
    const el = document.createElement("span");
    const symbole = U.decor[i % U.decor.length];
    const taille = 18 + Math.random() * 22;
    if (symbole === "bulle") {
      el.className = "bulle-decor";   // une bulle dessinée
      el.style.width = taille + "px";
      el.style.height = taille + "px";
    } else {
      el.textContent = symbole;
      el.style.fontSize = taille + "px";
    }
    el.style.left = Math.random() * 95 + "vw";
    el.style.animationDuration = 14 + Math.random() * 12 + "s";
    el.style.animationDelay = -Math.random() * 20 + "s";
    decor.appendChild(el);
  }

  // ===================================================================
  // 19. On lance la première partie, la musique et le mode appli
  // ===================================================================
  nouvellePartie();
  initMusique(MELODIES[U.melodie], document.getElementById("bouton-musique"));

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }
})();
