// ===================================================================
// Univers « Les Dinos » : ses couleurs, ses sons et ses dessins.
// Les dessins viennent tels quels de la première version du jeu.
// ===================================================================

UNIVERS.dino = {
  id: "dino",
  nom: "Les Dinos",
  titre: ["Memory", "des", "Dinos"],
  accroche: "T-rex, volcan, bébé dino…",
  bravo: "ROAAAR ! Bravo Myrtille !",
  couleurs: {
    rose: "#ff8a2a", roseClair: "#ffe3c4", bleuClair: "#d4f7a8",
    violet: "#2f9e44", violetFonce: "#23521a", motDuMilieu: "#8a4fd8",
    fond: "linear-gradient(180deg, #f0ffd9 0%, #c8f5a8 55%, #93dc6e 100%)",
    ombre: "47, 120, 40", voile: "35, 82, 26",
    dos: "linear-gradient(135deg, #8fe05a, #2f9e44)",
    bouton: "linear-gradient(135deg, #ffb02e, #ff6b2c)",
    theme: "#d4f7b0", tuile: "linear-gradient(135deg, #f0ffd9, #c8f5a8)", texteTuile: "#23521a"
  },
  // L'empreinte de dinosaure dessinée au dos de chaque carte
  dos: '<svg viewBox="0 0 100 100" fill="#fff" opacity="0.9">' +
    '<ellipse cx="50" cy="66" rx="20" ry="17"/>' +
    '<ellipse cx="28" cy="36" rx="7" ry="13" transform="rotate(-25 28 36)"/>' +
    '<ellipse cx="50" cy="26" rx="7" ry="14"/>' +
    '<ellipse cx="72" cy="36" rx="7" ry="13" transform="rotate(25 72 36)"/>' +
    '</svg>',
  mascotte: "trex",
  melodie: "frereJacques",
  confettis: ["🦖", "🦕", "🥚", "🌋", "⭐"],
  decor: ["🍃", "🌿", "🦕", "🍃", "🥚"],
  // Les sons (même règle dans les 6 univers) :
  // - paire trouvée : le cri propre au dinosaure de la carte ;
  // - victoire : le GRAND rugissement du T-rex, un grave + un plus aigu (environ 2 s).
  volumePaire: 0.25,
  volumeVictoire: 0.354,
  secousse: true,   // le plateau tremble pendant le rugissement de victoire
  sonPaire: function (carte) {
    // "volume" corrige chaque cri : les cris très graves s'entendent moins
    // sur un téléphone, on les monte un peu pour que tous sonnent aussi fort
    const cri = carte.cri || { hauteur: 110, duree: 0.8, volume: 1 };
    SONS.rugissement(0, cri.duree, cri.hauteur, this.volumePaire * (cri.volume || 1));
  },
  sonVictoire: function () {
    const v = this.volumeVictoire;
    SONS.rugissement(0, 1.9, 90, v);
    SONS.rugissement(0.05, 1.7, 150, v * 0.57);
  },

  // Les dessins des cartes (au moins 8, car une partie en utilise 8)
  cartes: (function () {
    // ===================================================================
    // LES DESSINS DES CARTES (repris de la première version)
    // Chaque dessin est une image "SVG" : des formes simples (cercles,
    // ellipses, traits) décrites dans une boîte de 100 x 100.
    // ===================================================================

    // Petite étoile scintillante, réutilisée sur plusieurs cartes
    function etincelle(x, y, taille, couleur) {
      const t = taille;
      return '<path d="M' + x + ' ' + (y - t) +
        ' Q' + x + ' ' + y + ' ' + (x + t) + ' ' + y +
        ' Q' + x + ' ' + y + ' ' + x + ' ' + (y + t) +
        ' Q' + x + ' ' + y + ' ' + (x - t) + ' ' + y +
        ' Q' + x + ' ' + y + ' ' + x + ' ' + (y - t) + 'Z" fill="' + couleur + '"/>';
    }

    // Astuce de dessin : on dessine les formes une 1re fois en foncé et
    // un peu plus grosses (le contour), puis une 2e fois par-dessus en clair.
    // Résultat : un seul joli contour autour de tout le dinosaure.
    function avecContour(formes, couleur, contour) {
      return '<g fill="' + contour + '" stroke="' + contour + '" stroke-width="5" stroke-linejoin="round">' + formes + '</g>' +
             '<g fill="' + couleur + '">' + formes + '</g>';
    }

    // Un œil avec un petit reflet blanc
    function oeil(x, y, taille) {
      return '<circle cx="' + x + '" cy="' + y + '" r="' + taille + '" fill="#1d2b1a"/>' +
             '<circle cx="' + (x + taille * 0.35) + '" cy="' + (y - taille * 0.35) + '" r="' + (taille * 0.38) + '" fill="#fff"/>';
    }

    // Un petit sourire
    function sourire(x, y, largeur) {
      return '<path d="M' + (x - largeur / 2) + ' ' + y + ' q' + (largeur / 2) + ' ' + (largeur * 0.45) + ' ' + largeur + ' 0" ' +
             'stroke="#1d2b1a" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }

    // Une joue rose
    function joue(x, y) {
      return '<ellipse cx="' + x + '" cy="' + y + '" rx="4" ry="2.5" fill="#ff7fa0" opacity="0.6"/>';
    }

    // La liste des 8 cartes du jeu.
    // - id : un nom unique pour reconnaître les paires
    // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
    // - fond : la couleur pastel de la face de la carte
    // - cri : le bruit du dinosaure quand on trouve la paire
    //         (hauteur : grave si petit nombre, aigu si grand nombre ;
    //          duree : en secondes)
    // - dessin : l'image SVG
    const CARTES = [
      {
        id: "trex", nom: "Un T-rex", fond: "#e4ffd6",
        cri: { hauteur: 110, duree: 0.8, volume: 1.445 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          avecContour(
            // La queue, le corps, les pattes, le cou et la grosse tête
            '<path d="M30 58 Q14 56 5 70 Q20 68 34 72 Z"/>' +
            '<ellipse cx="42" cy="60" rx="18" ry="16"/>' +
            '<path d="M35 70 h10 v17 h-13 Z"/>' +
            '<path d="M49 70 h10 v17 h-13 Z"/>' +
            '<ellipse cx="53" cy="45" rx="10" ry="12"/>' +
            '<ellipse cx="66" cy="33" rx="22" ry="14"/>',
            "#6cc24a", "#3d8a2a") +
          // Le ventre clair
          '<ellipse cx="47" cy="64" rx="9" ry="9" fill="#c8f08a"/>' +
          // Les piquants sur le dos
          '<path d="M30 46 l3 -7 l4 6 M38 42 l4 -7 l3 7" fill="#ffb02e" stroke="#e07a10" stroke-width="1.5" stroke-linejoin="round"/>' +
          // La grande bouche qui rigole avec ses dents
          '<path d="M68 40 Q78 50 88 37 Z" fill="#b0233a"/>' +
          '<path d="M72 41 l2 4 l2 -4 Z M78 41 l2 4 l2 -4 Z M84 39 l1.5 3.5 l2 -4 Z" fill="#fff"/>' +
          // Le tout petit bras (c'est drôle, les T-rex ont des bras minuscules)
          '<path d="M58 53 q7 1 8 7" stroke="#3d8a2a" stroke-width="4" fill="none" stroke-linecap="round"/>' +
          oeil(62, 28, 4.5) +
          '<circle cx="83" cy="30" r="1.5" fill="#1d2b1a"/>' +
          joue(70, 35) +
          '</svg>'
      },
      {
        id: "triceratops", nom: "Un tricératops", fond: "#fff0dc",
        cri: { hauteur: 170, duree: 0.5, volume: 1.109 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La grande collerette derrière la tête
          '<circle cx="66" cy="40" r="19" fill="#ffd35c" stroke="#d0661a" stroke-width="2.5"/>' +
          '<circle cx="56" cy="30" r="2.5" fill="#ff8a2a"/><circle cx="66" cy="25" r="2.5" fill="#ff8a2a"/><circle cx="52" cy="40" r="2.5" fill="#ff8a2a"/><circle cx="77" cy="28" r="2.5" fill="#ff8a2a"/>' +
          avecContour(
            '<path d="M24 58 Q10 56 4 64 Q16 66 28 66 Z"/>' +
            '<ellipse cx="42" cy="60" rx="22" ry="15"/>' +
            '<path d="M24 66 h9 v16 h-9 Z M36 68 h9 v15 h-9 Z M48 68 h9 v15 h-9 Z M58 66 h9 v16 h-9 Z"/>' +
            '<ellipse cx="74" cy="54" rx="14" ry="11"/>',
            "#ff9a3c", "#d0661a") +
          // Les trois cornes
          '<path d="M68 46 L71 26 L75 45 Z M78 46 L86 29 L84 49 Z M86 52 L95 46 L90 57 Z" fill="#fff3d0" stroke="#c9a46a" stroke-width="2" stroke-linejoin="round"/>' +
          oeil(74, 51, 3.8) +
          sourire(79, 59, 8) +
          joue(70, 58) +
          '</svg>'
      },
      {
        id: "diplodocus", nom: "Un diplodocus", fond: "#e0f0ff",
        cri: { hauteur: 75, duree: 1, volume: 1.758 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Le très long cou (trait foncé épais puis trait clair par-dessus)
          '<path d="M56 62 Q66 46 70 22" stroke="#2e6fb5" stroke-width="16" fill="none" stroke-linecap="round"/>' +
          avecContour(
            '<path d="M30 64 Q12 66 3 52 Q12 74 34 76 Z"/>' +
            '<ellipse cx="44" cy="67" rx="20" ry="13"/>' +
            '<path d="M28 72 h8 v14 h-8 Z M38 74 h8 v13 h-8 Z M50 74 h8 v13 h-8 Z M58 72 h8 v14 h-8 Z"/>' +
            '<ellipse cx="76" cy="19" rx="11" ry="8"/>',
            "#5aa8f0", "#2e6fb5") +
          '<path d="M56 62 Q66 46 70 22" stroke="#5aa8f0" stroke-width="11" fill="none" stroke-linecap="round"/>' +
          // Les taches sur le dos
          '<circle cx="36" cy="62" r="3.5" fill="#3f8ad8"/><circle cx="46" cy="58" r="2.5" fill="#3f8ad8"/><circle cx="52" cy="66" r="3" fill="#3f8ad8"/>' +
          oeil(77, 16, 3.2) +
          sourire(82, 22, 6) +
          joue(74, 22) +
          '</svg>'
      },
      {
        id: "stegosaure", nom: "Un stégosaure", fond: "#f0e4ff",
        cri: { hauteur: 140, duree: 0.6, volume: 1.274 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les grandes plaques sur le dos
          '<path d="M24 52 L28 36 L35 48 Z M33 47 L40 27 L46 45 Z M45 45 L53 25 L58 46 Z M57 48 L64 33 L67 51 Z" fill="#ff8fc7" stroke="#d6559a" stroke-width="2.5" stroke-linejoin="round"/>' +
          // Les piques au bout de la queue
          '<path d="M10 54 L4 44 L14 52 Z M13 56 L10 46 L17 54 Z" fill="#fff3d0" stroke="#c9a46a" stroke-width="1.5" stroke-linejoin="round"/>' +
          avecContour(
            '<path d="M26 60 Q14 60 8 54 Q12 66 28 68 Z"/>' +
            '<ellipse cx="45" cy="61" rx="23" ry="14"/>' +
            '<path d="M28 68 h9 v15 h-9 Z M40 70 h9 v14 h-9 Z M52 70 h9 v14 h-9 Z M60 67 h9 v15 h-9 Z"/>' +
            '<ellipse cx="77" cy="64" rx="11" ry="8"/>',
            "#a77bf0", "#6c43b8") +
          oeil(78, 61, 3.2) +
          sourire(83, 67, 6) +
          joue(74, 67) +
          '</svg>'
      },
      {
        id: "pteranodon", nom: "Un ptéranodon", fond: "#ffe3ea",
        cri: { hauteur: 650, duree: 0.45, volume: 0.646 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les deux grandes ailes
          '<path d="M48 52 L6 34 Q14 50 10 62 Q30 54 48 62 Z" fill="#ffb3c6" stroke="#c43c63" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<path d="M52 52 L94 34 Q86 50 90 62 Q70 54 52 62 Z" fill="#ffb3c6" stroke="#c43c63" stroke-width="2.5" stroke-linejoin="round"/>' +
          // La crête, puis le bec jaune
          '<path d="M50 30 L32 18 L54 26 Z" fill="#ff6f91" stroke="#c43c63" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<path d="M60 32 L86 38 L60 41 Z" fill="#ffd23f" stroke="#d9a400" stroke-width="2" stroke-linejoin="round"/>' +
          avecContour(
            '<ellipse cx="50" cy="60" rx="9" ry="14"/>' +
            '<ellipse cx="56" cy="34" rx="10" ry="9"/>' +
            '<path d="M44 72 l-3 10 l6 -2 Z M56 72 l3 10 l-6 -2 Z"/>',
            "#ff6f91", "#c43c63") +
          oeil(56, 31, 3.5) +
          joue(52, 39) +
          '</svg>'
      },
      {
        id: "ankylosaure", nom: "Un ankylosaure", fond: "#fff6d6",
        cri: { hauteur: 120, duree: 0.55, volume: 1.413 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La queue avec sa grosse massue au bout
          '<path d="M26 64 Q18 64 16 57" stroke="#a8741a" stroke-width="9" fill="none" stroke-linecap="round"/>' +
          '<path d="M26 64 Q18 64 16 57" stroke="#e8b04a" stroke-width="5" fill="none" stroke-linecap="round"/>' +
          avecContour(
            '<ellipse cx="13" cy="53" rx="7" ry="6"/>' +
            // Le dos tout bosselé comme une armure
            '<ellipse cx="46" cy="62" rx="26" ry="14"/>' +
            '<circle cx="28" cy="54" r="6"/><circle cx="38" cy="49" r="6"/><circle cx="50" cy="48" r="6"/><circle cx="61" cy="51" r="6"/>' +
            '<path d="M28 70 h9 v13 h-9 Z M40 72 h9 v12 h-9 Z M52 72 h9 v12 h-9 Z M62 70 h9 v13 h-9 Z"/>' +
            '<ellipse cx="78" cy="64" rx="11" ry="9"/>',
            "#e8b04a", "#a8741a") +
          // Les petites bosses plus foncées
          '<circle cx="28" cy="54" r="2.5" fill="#c98a2a"/><circle cx="38" cy="49" r="2.5" fill="#c98a2a"/>' +
          '<circle cx="50" cy="48" r="2.5" fill="#c98a2a"/><circle cx="61" cy="51" r="2.5" fill="#c98a2a"/>' +
          '<circle cx="40" cy="62" r="2" fill="#c98a2a"/><circle cx="52" cy="60" r="2" fill="#c98a2a"/>' +
          oeil(79, 61, 3.4) +
          sourire(84, 68, 6) +
          joue(75, 68) +
          '</svg>'
      },
      {
        id: "bebe", nom: "Un bébé dinosaure dans son œuf", fond: "#e6ffe0",
        cri: { hauteur: 520, duree: 0.3, volume: 0.668 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La tête du bébé qui sort de l'œuf
          '<circle cx="50" cy="44" r="19" fill="#8fe05a" stroke="#4f9e2a" stroke-width="2.5"/>' +
          '<circle cx="42" cy="58" r="2" fill="#4f9e2a"/>' +
          oeil(43, 42, 5) + oeil(58, 42, 5) +
          '<path d="M44 52 Q51 59 58 52 Z" fill="#b0233a"/>' +
          '<path d="M47 52.5 l1.5 3 l1.5 -3 Z" fill="#fff"/>' +
          joue(37, 50) + joue(64, 50) +
          // Le morceau de coquille posé sur la tête comme un chapeau
          '<path d="M37 31 L41 25 L45 30 L50 24 L55 30 L59 25 L63 31 Q58 20 50 19 Q42 20 37 31 Z" fill="#fff4d6" stroke="#c9a46a" stroke-width="2" stroke-linejoin="round"/>' +
          // Le bas de l'œuf cassé, avec ses taches
          '<path d="M24 60 L30 54 L36 60 L42 53 L48 60 L54 53 L60 60 L66 53 L72 60 L77 56 Q80 90 50 91 Q20 90 24 60 Z" fill="#fff4d6" stroke="#c9a46a" stroke-width="2.5" stroke-linejoin="round"/>' +
          '<circle cx="36" cy="74" r="3.5" fill="#b8e6ff"/><circle cx="60" cy="80" r="4" fill="#b8e6ff"/><circle cx="66" cy="68" r="2.5" fill="#b8e6ff"/>' +
          // Les petites mains accrochées au bord
          '<circle cx="34" cy="58" r="4" fill="#8fe05a" stroke="#4f9e2a" stroke-width="2"/>' +
          '<circle cx="66" cy="58" r="4" fill="#8fe05a" stroke="#4f9e2a" stroke-width="2"/>' +
          '</svg>'
      },
      {
        id: "volcan", nom: "Un volcan rigolo", fond: "#ffe6dc",
        cri: { hauteur: 50, duree: 1, volume: 2.213 },
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La fumée et les boules de lave qui sautent
          '<circle cx="40" cy="16" r="8" fill="#d9d9e3"/><circle cx="52" cy="10" r="9" fill="#e6e6ee"/><circle cx="63" cy="17" r="7" fill="#d9d9e3"/>' +
          '<circle cx="30" cy="28" r="4" fill="#ff5a2a"/><circle cx="72" cy="26" r="4.5" fill="#ffb02e"/><circle cx="50" cy="24" r="3.5" fill="#ffd23f"/>' +
          // La montagne
          '<path d="M12 90 L38 36 L62 36 L88 90 Z" fill="#b8734a" stroke="#7a4426" stroke-width="2.5" stroke-linejoin="round"/>' +
          // La lave qui coule du sommet
          '<path d="M38 36 L62 36 L60 44 Q57 40 55 50 Q52 41 49 48 Q46 40 43 46 Q41 40 38 36 Z" fill="#ff5a2a" stroke="#c43c1a" stroke-width="2" stroke-linejoin="round"/>' +
          // Le visage du volcan
          oeil(42, 62, 4) + oeil(58, 62, 4) +
          '<path d="M41 71 Q50 81 59 71 Z" fill="#7a2a1a"/>' +
          joue(35, 70) + joue(65, 70) +
          '</svg>'
      }
    ];

    return CARTES;
  })()
};
