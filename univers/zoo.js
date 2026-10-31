// ===================================================================
// Univers « Le Zoo » : ses couleurs, ses sons et ses dessins.
// ===================================================================

UNIVERS.zoo = {
  id: "zoo",
  nom: "Le Zoo",
  titre: ["Memory", "du", "Zoo"],
  accroche: "Lion, éléphant, girafe…",
  bravo: "Boum boum ! Bravo Myrtille !",
  couleurs: {
    rose: "#e67e22", roseClair: "#ffefd0", bleuClair: "#ffe0b3",
    violet: "#d35400", violetFonce: "#5a3412", motDuMilieu: "#16a085",
    fond: "linear-gradient(180deg, #fff5e0 0%, #ffe0b3 55%, #f7c27a 100%)",
    ombre: "200, 120, 30", voile: "90, 52, 18",
    dos: "linear-gradient(135deg, #ffb74d, #e65100)",
    bouton: "linear-gradient(135deg, #16a085, #d35400)",
    theme: "#ffe0b3",
    tuile: "linear-gradient(135deg, #fff5e0, #ffd59a)", texteTuile: "#5a3412"
  },
  // Une empreinte de patte au dos de chaque carte
  dos: '<svg viewBox="0 0 100 100" fill="#fff" opacity="0.9">' +
    '<path d="M50 50 Q70 50 74 70 Q76 86 60 84 Q50 82 40 84 Q24 86 26 70 Q30 50 50 50Z"/>' +
    '<ellipse cx="24" cy="44" rx="8" ry="10"/><ellipse cx="40" cy="28" rx="8" ry="11"/>' +
    '<ellipse cx="60" cy="28" rx="8" ry="11"/><ellipse cx="76" cy="44" rx="8" ry="10"/>' +
    '</svg>',
  mascotte: "lion",
  melodie: "sourisVerte",
  confettis: ["🎈", "🍌", "⭐", "🎉", "✨"],
  decor: ["🍌", "🌴", "🎈", "🍃", "⭐"],
  // Les sons (même règle dans les 6 univers) :
  // - paire trouvée : deux coups de tambour, "boum boum", sur la note propre à la carte ;
  // - victoire : un roulement de tambour qui accélère, puis deux grands "boum" (environ 2 s).
  volumePaire: 0.316,
  volumeVictoire: 0.336,
  sonPaire: function (carte) {
    const h = SONS.hauteur(this.cartes, carte), v = this.volumePaire;
    SONS.tambour(196 * h, 0, v);
    SONS.tambour(262 * h, 0.15, v);
  },
  sonVictoire: function () {
    const v = this.volumeVictoire;
    [0, 0.22, 0.42, 0.6, 0.75, 0.88, 0.98, 1.06, 1.13, 1.19].forEach(function (d, i) { SONS.tambour(220 + i * 10, d, v * 0.8); });
    SONS.tambour(165, 1.4, v);
    SONS.tambour(330, 1.4, v * 0.7);
  },

  // Les 8 dessins des cartes
  cartes: (function () {
    // ===================================================================
    // Les outils de dessin, partagés par toutes les cartes du zoo.
    // Chaque dessin est une image "SVG" dans une boîte de 100 x 100.
    // ===================================================================
    const TRAIT = "#3a2a2a";   // la couleur des contours
    // Les réglages d'un contour : épais, coins arrondis
    const CONTOUR = 'stroke="' + TRAIT + '" stroke-width="2.5" stroke-linejoin="round"';

    // Deux yeux noirs avec un petit reflet blanc
    function yeux(xGauche, xDroite, y, rayon) {
      const r = rayon || 4.2;
      return [xGauche, xDroite].map(function (x) {
        return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#2b2b2b"/>' +
               '<circle cx="' + (x + r * 0.33) + '" cy="' + (y - r * 0.33) + '" r="' + (r * 0.33) + '" fill="#fff"/>';
      }).join("");
    }

    // Les joues roses
    function joues(xGauche, xDroite, y) {
      return '<ellipse cx="' + xGauche + '" cy="' + y + '" rx="5" ry="3" fill="#ff8fc0" opacity="0.6"/>' +
             '<ellipse cx="' + xDroite + '" cy="' + y + '" rx="5" ry="3" fill="#ff8fc0" opacity="0.6"/>';
    }

    // Un petit sourire centré en x
    function sourire(x, y, largeur) {
      return '<path d="M' + (x - largeur / 2) + ' ' + y + ' q' + (largeur / 2) + ' ' + (largeur * 0.45) + ' ' + largeur + ' 0" ' +
             'stroke="' + TRAIT + '" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
    }

    // La crinière du lion : 12 boucles posées en rond
    function criniere() {
      let boucles = "";
      for (let i = 0; i < 12; i++) {
        const a = i / 12 * Math.PI * 2;
        boucles += '<circle cx="' + (50 + 30 * Math.cos(a)).toFixed(1) + '" cy="' + (52 + 30 * Math.sin(a)).toFixed(1) + '" r="12" fill="#e8892a" ' + CONTOUR + '/>';
      }
      return boucles + '<circle cx="50" cy="52" r="30" fill="#e8892a"/>';
    }

    // - id : un nom unique pour reconnaître les paires
    // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
    // - fond : la couleur pastel de la face de la carte
    // - dessin : l'image SVG
    const CARTES = [
      {
        id: "lion", nom: "Un lion", fond: "#ffe6d2",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          criniere() +
          // Les oreilles
          '<circle cx="30" cy="32" r="7.5" fill="#ffd36b" ' + CONTOUR + '/><circle cx="70" cy="32" r="7.5" fill="#ffd36b" ' + CONTOUR + '/>' +
          '<circle cx="30" cy="32" r="3.5" fill="#ffb3d1"/><circle cx="70" cy="32" r="3.5" fill="#ffb3d1"/>' +
          // La tête et le museau
          '<circle cx="50" cy="53" r="24" fill="#ffd36b" ' + CONTOUR + '/>' +
          '<ellipse cx="50" cy="63" rx="12" ry="9" fill="#fff4dc"/>' +
          '<path d="M45 57 Q50 54 55 57 Q53 62 50 62 Q47 62 45 57Z" fill="#8a4a3a"/>' +
          '<path d="M50 62 v3 M44 66 q6 5 12 0" stroke="' + TRAIT + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
          yeux(41, 59, 48) + joues(33, 67, 58) +
          '</svg>'
      },
      {
        id: "elephant", nom: "Un éléphant", fond: "#e3f0ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les grandes oreilles
          '<ellipse cx="22" cy="46" rx="18" ry="22" fill="#9fb4c8" ' + CONTOUR + '/>' +
          '<ellipse cx="78" cy="46" rx="18" ry="22" fill="#9fb4c8" ' + CONTOUR + '/>' +
          '<ellipse cx="22" cy="46" rx="11" ry="15" fill="#f2c4d2"/>' +
          '<ellipse cx="78" cy="46" rx="11" ry="15" fill="#f2c4d2"/>' +
          // La tête
          '<ellipse cx="50" cy="46" rx="23" ry="25" fill="#9fb4c8" ' + CONTOUR + '/>' +
          // La trompe qui se relève au bout
          '<path d="M43 60 Q40 82 52 88 Q62 90 64 82 Q56 82 57 60Z" fill="#9fb4c8" ' + CONTOUR + '/>' +
          '<path d="M46 72 h8 M47 79 h8" stroke="#7a8fa3" stroke-width="1.8" stroke-linecap="round"/>' +
          yeux(40, 60, 42) + joues(34, 66, 54) +
          '</svg>'
      },
      {
        id: "girafe", nom: "Une girafe", fond: "#e8f6ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Le long cou avec ses taches
          '<path d="M40 52 L36 98 H64 L60 52Z" fill="#ffd25a" ' + CONTOUR + '/>' +
          '<circle cx="45" cy="70" r="4" fill="#c98a3a"/><circle cx="55" cy="82" r="4.5" fill="#c98a3a"/><circle cx="54" cy="64" r="3" fill="#c98a3a"/>' +
          // Les petites cornes
          '<path d="M41 24 L38 8 M59 24 L62 8" stroke="' + TRAIT + '" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="38" cy="8" r="4" fill="#a8692e" ' + CONTOUR + '/><circle cx="62" cy="8" r="4" fill="#a8692e" ' + CONTOUR + '/>' +
          // Les oreilles
          '<ellipse cx="24" cy="30" rx="10" ry="5" transform="rotate(-20 24 30)" fill="#ffd25a" ' + CONTOUR + '/>' +
          '<ellipse cx="76" cy="30" rx="10" ry="5" transform="rotate(20 76 30)" fill="#ffd25a" ' + CONTOUR + '/>' +
          // La tête et ses taches
          '<ellipse cx="50" cy="38" rx="20" ry="18" fill="#ffd25a" ' + CONTOUR + '/>' +
          '<circle cx="38" cy="26" r="3.5" fill="#c98a3a"/><circle cx="62" cy="27" r="3" fill="#c98a3a"/>' +
          // Le museau
          '<ellipse cx="50" cy="50" rx="15" ry="10" fill="#ffe9a8" ' + CONTOUR + '/>' +
          '<ellipse cx="45" cy="48" rx="2" ry="2.6" fill="#8a5a36"/><ellipse cx="55" cy="48" rx="2" ry="2.6" fill="#8a5a36"/>' +
          sourire(50, 53, 7) +
          yeux(42, 58, 35, 3.8) + joues(35, 65, 43) +
          '</svg>'
      },
      {
        id: "zebre", nom: "Un zèbre", fond: "#f0e6ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les oreilles
          '<path d="M34 30 L28 8 L44 22Z M66 30 L72 8 L56 22Z" fill="#fff" ' + CONTOUR + '/>' +
          '<path d="M33 24 L30 13 L39 21Z M67 24 L70 13 L61 21Z" fill="#2b2b2b"/>' +
          // La tête blanche
          '<path d="M30 28 Q50 14 70 28 Q74 52 66 70 Q50 82 34 70 Q26 52 30 28Z" fill="#fff" ' + CONTOUR + '/>' +
          // Les rayures noires
          // (sur le front et sur les bords des joues, loin des yeux)
          '<path d="M41 27 Q50 32 59 27 M43 34 Q50 38 57 34 M30 40 Q34 42 35 38 M70 40 Q66 42 65 38 M30 52 Q34 54 35 50 M70 52 Q66 54 65 50 M33 62 Q36 63 37 60 M67 62 Q64 63 63 60" stroke="#2b2b2b" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
          // La crinière noire en brosse
          '<path d="M42 20 L44 10 L48 18 L50 8 L52 18 L56 10 L58 20Z" fill="#2b2b2b"/>' +
          // Le museau gris et les naseaux
          '<ellipse cx="50" cy="70" rx="15" ry="10" fill="#6b6b6b" ' + CONTOUR + '/>' +
          '<ellipse cx="44" cy="68" rx="2.5" ry="3.2" fill="#2b2b2b"/><ellipse cx="56" cy="68" rx="2.5" ry="3.2" fill="#2b2b2b"/>' +
          '<path d="M45 75 q5 3 10 0" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          yeux(40, 60, 46) + joues(34, 66, 56) +
          '</svg>'
      },
      {
        id: "singe", nom: "Un singe", fond: "#fff6d6",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les oreilles rondes
          '<circle cx="18" cy="52" r="11" fill="#8b5a3c" ' + CONTOUR + '/><circle cx="82" cy="52" r="11" fill="#8b5a3c" ' + CONTOUR + '/>' +
          '<circle cx="18" cy="52" r="6" fill="#f2c9a0"/><circle cx="82" cy="52" r="6" fill="#f2c9a0"/>' +
          // La tête et la petite mèche
          '<circle cx="50" cy="52" r="31" fill="#8b5a3c" ' + CONTOUR + '/>' +
          '<path d="M44 22 Q50 12 54 22 Q58 16 60 24" fill="none" stroke="' + TRAIT + '" stroke-width="2.5" stroke-linecap="round"/>' +
          // Le visage clair en forme de cœur
          '<circle cx="39" cy="47" r="12" fill="#f2c9a0"/><circle cx="61" cy="47" r="12" fill="#f2c9a0"/>' +
          '<ellipse cx="50" cy="65" rx="21" ry="15" fill="#f2c9a0"/>' +
          // Les narines et le grand sourire
          '<ellipse cx="46" cy="60" rx="1.8" ry="2.4" fill="#5a3420"/><ellipse cx="54" cy="60" rx="1.8" ry="2.4" fill="#5a3420"/>' +
          '<path d="M38 67 Q50 80 62 67" stroke="' + TRAIT + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
          yeux(40, 60, 47) + joues(32, 68, 60) +
          '</svg>'
      },
      {
        id: "panda", nom: "Un panda", fond: "#e6f7e6",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les oreilles noires
          '<circle cx="25" cy="27" r="11" fill="#2b2b2b"/><circle cx="75" cy="27" r="11" fill="#2b2b2b"/>' +
          // La tête blanche
          '<ellipse cx="50" cy="54" rx="32" ry="29" fill="#fff" ' + CONTOUR + '/>' +
          // Les taches noires autour des yeux
          '<ellipse cx="37" cy="50" rx="8" ry="11" transform="rotate(35 37 50)" fill="#2b2b2b"/>' +
          '<ellipse cx="63" cy="50" rx="8" ry="11" transform="rotate(-35 63 50)" fill="#2b2b2b"/>' +
          // Les yeux brillants au milieu des taches
          '<circle cx="38" cy="49" r="3.4" fill="#fff"/><circle cx="62" cy="49" r="3.4" fill="#fff"/>' +
          '<circle cx="38.6" cy="49.6" r="1.9" fill="#2b2b2b"/><circle cx="62.6" cy="49.6" r="1.9" fill="#2b2b2b"/>' +
          // La truffe et la bouche
          '<ellipse cx="50" cy="63" rx="5" ry="3.5" fill="#2b2b2b"/>' +
          '<path d="M50 66 v3 M45 70 q5 4 10 0" stroke="' + TRAIT + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
          joues(29, 71, 64) +
          '</svg>'
      },
      {
        id: "hippopotame", nom: "Un hippopotame", fond: "#ffe3ec",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les petites oreilles
          '<ellipse cx="30" cy="22" rx="6" ry="7" fill="#a99bd1" ' + CONTOUR + '/><ellipse cx="70" cy="22" rx="6" ry="7" fill="#a99bd1" ' + CONTOUR + '/>' +
          // Le haut de la tête
          '<ellipse cx="50" cy="38" rx="25" ry="19" fill="#a99bd1" ' + CONTOUR + '/>' +
          // Le très grand museau
          '<ellipse cx="50" cy="66" rx="35" ry="22" fill="#c3b8e6" ' + CONTOUR + '/>' +
          '<ellipse cx="38" cy="58" rx="3.5" ry="4.5" fill="#6b5e96"/><ellipse cx="62" cy="58" rx="3.5" ry="4.5" fill="#6b5e96"/>' +
          // La bouche et deux petites dents
          '<path d="M30 72 Q50 86 70 72" stroke="' + TRAIT + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
          '<path d="M40 76 v5 h5 v-3 M60 76 v5 h-5 v-3" fill="#fff" stroke="' + TRAIT + '" stroke-width="1.6" stroke-linejoin="round"/>' +
          yeux(40, 60, 36) + joues(22, 78, 66) +
          '</svg>'
      },
      {
        id: "manchot", nom: "Un manchot", fond: "#ddf2ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les pattes orange
          '<ellipse cx="40" cy="91" rx="8" ry="4" fill="#ff9f1c" ' + CONTOUR + '/><ellipse cx="60" cy="91" rx="8" ry="4" fill="#ff9f1c" ' + CONTOUR + '/>' +
          // Les ailes
          '<path d="M24 50 Q10 66 18 78 Q26 70 28 58Z M76 50 Q90 66 82 78 Q74 70 72 58Z" fill="#2d3540" ' + CONTOUR + '/>' +
          // Le corps noir
          '<ellipse cx="50" cy="54" rx="27" ry="35" fill="#2d3540" ' + CONTOUR + '/>' +
          // Le ventre et le visage blancs
          '<ellipse cx="50" cy="64" rx="19" ry="24" fill="#fff"/>' +
          '<circle cx="42" cy="38" r="10" fill="#fff"/><circle cx="58" cy="38" r="10" fill="#fff"/>' +
          // Le bec
          '<path d="M44 44 L56 44 L50 52Z" fill="#ff9f1c" ' + CONTOUR + '/>' +
          yeux(42, 58, 37, 3.6) + joues(36, 64, 46) +
          '</svg>'
      }
    ];

    return CARTES;
  })()
};
