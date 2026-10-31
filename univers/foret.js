// ===================================================================
// Univers « La Forêt » : ses couleurs, ses sons et ses dessins.
// ===================================================================

UNIVERS.foret = {
  id: "foret",
  nom: "La Forêt",
  titre: ["Memory", "de la", "Forêt"],
  accroche: "Renard, hibou, champignon…",
  bravo: "Hou hou ! Bravo !",
  couleurs: {
    rose: "#e07a2e", roseClair: "#ffe6cc", bleuClair: "#cfe8c0",
    violet: "#3f7d3a", violetFonce: "#2f4a22", motDuMilieu: "#a0522d",
    fond: "linear-gradient(180deg, #eef7e4 0%, #cfe8c0 55%, #9ccc86 100%)",
    ombre: "63, 125, 58", voile: "47, 74, 34",
    dos: "linear-gradient(135deg, #7cb342, #33691e)",
    bouton: "linear-gradient(135deg, #e07a2e, #a0522d)",
    theme: "#cfe8c0",
    tuile: "linear-gradient(135deg, #eef7e4, #bfe0a8)", texteTuile: "#2f4a22"
  },
  // Une feuille blanche au dos de chaque carte
  dos: '<svg viewBox="0 0 100 100" opacity="0.9">' +
    '<path d="M50 12 Q84 34 74 64 Q64 86 50 88 Q36 86 26 64 Q16 34 50 12Z" fill="#fff"/>' +
    '<path d="M50 24 V92 M50 46 L64 36 M50 60 L66 50 M50 46 L36 36 M50 60 L34 50" stroke="#7cb342" stroke-width="3.5" stroke-linecap="round" fill="none"/>' +
    '</svg>',
  mascotte: "renard",
  melodie: "clairDeLune",
  confettis: ["🍂", "🍄", "🌰", "⭐", "✨"],
  decor: ["🍃", "🍂", "🌰", "🍃", "🍄"],
  // Paire trouvée : un petit oiseau chante deux fois
  sonPaire: function () {
    SONS.oiseau(1800, 0, 0.18);
    SONS.oiseau(2200, 0.16, 0.18);
  },
  // Victoire : tout un concert d'oiseaux
  sonVictoire: function () {
    [1600, 2000, 1800, 2400, 2100, 2700, 2300, 3000].forEach(function (f, i) { SONS.oiseau(f, i * 0.13, 0.16); });
  },

  // Les 8 dessins des cartes
  cartes: (function () {
    // ===================================================================
    // Les outils de dessin, partagés par toutes les cartes de la forêt.
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

    // - id : un nom unique pour reconnaître les paires
    // - nom : ce qui est lu à voix haute par le téléphone (accessibilité)
    // - fond : la couleur pastel de la face de la carte
    // - dessin : l'image SVG
    const CARTES = [
      {
        id: "renard", nom: "Un renard", fond: "#e4f3dc",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La queue touffue avec le bout blanc
          '<path d="M64 84 Q92 82 90 58 Q88 44 80 48 Q84 66 62 74Z" fill="#f5862e" ' + CONTOUR + '/>' +
          '<path d="M88 54 Q88 44 80 48 Q82 52 82 56Z" fill="#fff" stroke="' + TRAIT + '" stroke-width="1.5"/>' +
          // Le corps assis, le ventre clair et les pattes
          '<ellipse cx="50" cy="75" rx="19" ry="15" fill="#f5862e" ' + CONTOUR + '/>' +
          '<ellipse cx="50" cy="77" rx="10" ry="11" fill="#fff4e6"/>' +
          '<ellipse cx="40" cy="89" rx="7" ry="4" fill="#5a3a2a"/><ellipse cx="60" cy="89" rx="7" ry="4" fill="#5a3a2a"/>' +
          // Les oreilles pointues
          '<path d="M27 38 L22 10 L45 28Z M73 38 L78 10 L55 28Z" fill="#f5862e" ' + CONTOUR + '/>' +
          '<path d="M29 32 L26 17 L39 28Z M71 32 L74 17 L61 28Z" fill="#5a3a2a"/>' +
          // La tête et le masque blanc
          '<path d="M20 42 Q22 64 50 68 Q78 64 80 42 Q72 26 50 26 Q28 26 20 42Z" fill="#f5862e" ' + CONTOUR + '/>' +
          '<path d="M22 46 Q32 64 50 66 Q68 64 78 46 Q64 54 50 51 Q36 54 22 46Z" fill="#fff4e6"/>' +
          // La truffe et le sourire
          '<ellipse cx="50" cy="56" rx="4.5" ry="3.2" fill="#2b2b2b"/>' +
          '<path d="M50 59 v2.5 M45 62 q5 4 10 0" stroke="' + TRAIT + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
          yeux(38, 62, 44) + joues(30, 70, 53) +
          '</svg>'
      },
      {
        id: "herisson", nom: "Un hérisson", fond: "#fff1dc",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les piquants sur le dos
          '<path d="M24 74 L18 60 L28 58 L24 44 L36 46 L36 32 L47 38 L50 24 L58 35 L66 24 L70 38 L80 32 L80 46 L92 46 L86 58 L96 64 L86 70 L88 78Z" fill="#8a5a36" ' + CONTOUR + '/>' +
          // Le ventre clair
          '<ellipse cx="56" cy="76" rx="32" ry="10" fill="#e8c8a0" ' + CONTOUR + '/>' +
          // Le museau pointu (il regarde à gauche)
          '<path d="M46 52 Q30 50 10 68 Q10 76 18 78 Q40 82 52 74Z" fill="#e8c8a0" ' + CONTOUR + '/>' +
          '<circle cx="11" cy="70" r="4" fill="#2b2b2b"/>' +
          // Les petites pattes
          '<ellipse cx="38" cy="87" rx="6" ry="4" fill="#5a3a2a"/><ellipse cx="68" cy="87" rx="6" ry="4" fill="#5a3a2a"/>' +
          '<circle cx="30" cy="62" r="3.8" fill="#2b2b2b"/><circle cx="31.3" cy="60.7" r="1.3" fill="#fff"/>' +
          '<path d="M20 74 q5 3 9 0" stroke="' + TRAIT + '" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          '<ellipse cx="38" cy="70" rx="4.5" ry="2.8" fill="#ff8fc0" opacity="0.6"/>' +
          '</svg>'
      },
      {
        id: "ecureuil", nom: "Un écureuil", fond: "#ffe9d6",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La grande queue en panache
          '<path d="M58 86 Q96 84 92 50 Q90 20 70 22 Q54 24 60 40 Q76 38 76 54 Q76 70 56 72Z" fill="#c8702a" ' + CONTOUR + '/>' +
          // Le corps et le ventre clair
          '<ellipse cx="42" cy="72" rx="18" ry="16" fill="#d9822b" ' + CONTOUR + '/>' +
          '<ellipse cx="42" cy="74" rx="10" ry="11" fill="#fff0dc"/>' +
          // Le gland qu'il tient dans ses pattes
          '<ellipse cx="42" cy="76" rx="5" ry="6" fill="#a8692e" ' + CONTOUR + '/>' +
          '<path d="M36 72 Q42 64 48 72Z" fill="#6b4422" ' + CONTOUR + '/>' +
          // Les oreilles avec leur touffe
          '<path d="M28 32 L26 14 L40 26Z M56 32 L58 14 L44 26Z" fill="#d9822b" ' + CONTOUR + '/>' +
          // La tête
          '<circle cx="42" cy="42" r="19" fill="#d9822b" ' + CONTOUR + '/>' +
          '<ellipse cx="42" cy="50" rx="10" ry="7" fill="#fff0dc"/>' +
          '<ellipse cx="42" cy="47" rx="3.5" ry="2.6" fill="#2b2b2b"/>' +
          sourire(42, 51, 7) +
          yeux(34, 50, 39, 3.8) + joues(28, 56, 47) +
          '</svg>'
      },
      {
        id: "hibou", nom: "Un hibou", fond: "#e6eaff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La branche
          '<path d="M6 90 H94" stroke="#7a4e2a" stroke-width="6" stroke-linecap="round"/>' +
          // Les aigrettes (les "oreilles" en plumes)
          '<path d="M24 34 L20 12 L40 24Z M76 34 L80 12 L60 24Z" fill="#9c6b45" ' + CONTOUR + '/>' +
          // Le corps
          '<ellipse cx="50" cy="56" rx="30" ry="32" fill="#9c6b45" ' + CONTOUR + '/>' +
          // Les ailes
          '<path d="M22 54 Q14 70 26 82 Q30 66 22 54Z M78 54 Q86 70 74 82 Q70 66 78 54Z" fill="#7a5233" ' + CONTOUR + '/>' +
          // Le ventre clair avec des petites plumes
          '<ellipse cx="50" cy="70" rx="17" ry="16" fill="#ecd3ac"/>' +
          '<path d="M43 66 l3 3 l3 -3 M51 66 l3 3 l3 -3 M47 74 l3 3 l3 -3" stroke="#b08a60" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
          // Les grands yeux ronds
          '<circle cx="38" cy="44" r="12" fill="#fff6e0" ' + CONTOUR + '/>' +
          '<circle cx="62" cy="44" r="12" fill="#fff6e0" ' + CONTOUR + '/>' +
          yeux(38, 62, 44, 6) +
          // Le bec
          '<path d="M45 52 L55 52 L50 60Z" fill="#ffa726" ' + CONTOUR + '/>' +
          // Les pattes sur la branche
          '<path d="M42 86 v4 M46 86 v4 M54 86 v4 M58 86 v4" stroke="#ffa726" stroke-width="3" stroke-linecap="round"/>' +
          '</svg>'
      },
      {
        id: "faon", nom: "Un faon", fond: "#fdf0e0",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les grandes oreilles
          '<ellipse cx="20" cy="38" rx="15" ry="7" transform="rotate(-25 20 38)" fill="#c98a52" ' + CONTOUR + '/>' +
          '<ellipse cx="80" cy="38" rx="15" ry="7" transform="rotate(25 80 38)" fill="#c98a52" ' + CONTOUR + '/>' +
          '<ellipse cx="20" cy="38" rx="9" ry="3.5" transform="rotate(-25 20 38)" fill="#f6d9bc"/>' +
          '<ellipse cx="80" cy="38" rx="9" ry="3.5" transform="rotate(25 80 38)" fill="#f6d9bc"/>' +
          // La tête en forme de goutte
          '<path d="M28 34 Q50 14 72 34 Q76 58 60 76 Q50 84 40 76 Q24 58 28 34Z" fill="#c98a52" ' + CONTOUR + '/>' +
          // Les taches blanches sur le front
          '<circle cx="44" cy="30" r="2.6" fill="#fff"/><circle cx="54" cy="27" r="2.2" fill="#fff"/><circle cx="58" cy="34" r="2" fill="#fff"/>' +
          // Le museau clair, la truffe et le sourire
          '<ellipse cx="50" cy="69" rx="11" ry="9" fill="#f6d9bc"/>' +
          '<ellipse cx="50" cy="65" rx="4.5" ry="3.2" fill="#2b2b2b"/>' +
          sourire(50, 71, 7) +
          // Les grands yeux avec des cils
          '<path d="M34 42 l-3 -3 M37 40 l-1 -4 M66 42 l3 -3 M63 40 l1 -4" stroke="' + TRAIT + '" stroke-width="1.8" stroke-linecap="round"/>' +
          yeux(39, 61, 48, 5) + joues(33, 67, 58) +
          '</svg>'
      },
      {
        id: "champignon", nom: "Un champignon", fond: "#e3f5e8",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // L'herbe
          '<path d="M22 90 Q26 82 30 90 Q34 80 38 90 H62 Q66 80 70 90 Q74 82 78 90Z" fill="#7cc46a"/>' +
          // Le pied
          '<path d="M36 56 Q33 84 40 88 H60 Q67 84 64 56Z" fill="#fff4e0" ' + CONTOUR + '/>' +
          // Le chapeau rouge à pois blancs
          '<path d="M10 58 Q12 16 50 14 Q88 16 90 58 Q50 66 10 58Z" fill="#e8413c" ' + CONTOUR + '/>' +
          '<circle cx="32" cy="36" r="6" fill="#fff"/><circle cx="56" cy="26" r="5" fill="#fff"/>' +
          '<circle cx="72" cy="44" r="6.5" fill="#fff"/><circle cx="46" cy="48" r="4" fill="#fff"/><circle cx="20" cy="52" r="3" fill="#fff"/>' +
          // Le petit visage sur le pied
          yeux(44, 56, 70, 3.2) + sourire(50, 77, 6) + joues(40, 60, 76) +
          '</svg>'
      },
      {
        id: "escargot", nom: "Un escargot", fond: "#fffbd6",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Le corps tout mou
          '<path d="M10 82 Q10 70 20 68 Q18 50 26 46 Q34 46 33 60 L36 70 H86 Q94 76 86 84 H16 Q10 84 10 82Z" fill="#b8dd7a" ' + CONTOUR + '/>' +
          // Les antennes
          '<path d="M24 48 L18 30 M30 47 L36 30" stroke="' + TRAIT + '" stroke-width="2.5" stroke-linecap="round"/>' +
          '<circle cx="18" cy="29" r="3.5" fill="#b8dd7a" ' + CONTOUR + '/><circle cx="36" cy="29" r="3.5" fill="#b8dd7a" ' + CONTOUR + '/>' +
          // La coquille avec sa spirale
          '<circle cx="62" cy="52" r="24" fill="#e6a84a" ' + CONTOUR + '/>' +
          (function () {
            let points = [];
            for (let i = 0; i <= 60; i++) {
              const a = i / 60 * Math.PI * 5;
              const r = 2 + i / 60 * 18;
              points.push((62 + r * Math.cos(a)).toFixed(1) + "," + (52 + r * Math.sin(a)).toFixed(1));
            }
            return '<polyline points="' + points.join(" ") + '" fill="none" stroke="#a8692e" stroke-width="3" stroke-linecap="round"/>';
          })() +
          // Le visage
          '<circle cx="23" cy="58" r="3" fill="#2b2b2b"/><circle cx="24" cy="57" r="1" fill="#fff"/>' +
          '<circle cx="31" cy="58" r="3" fill="#2b2b2b"/><circle cx="32" cy="57" r="1" fill="#fff"/>' +
          sourire(27, 64, 6) +
          '</svg>'
      },
      {
        id: "sapin", nom: "Un sapin", fond: "#e0f0ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Le tronc
          '<rect x="43" y="76" width="14" height="16" rx="2" fill="#8a5a36" ' + CONTOUR + '/>' +
          // Les trois étages de branches, du bas vers le haut
          '<path d="M50 40 L86 80 H14Z" fill="#3f9b4a" ' + CONTOUR + '/>' +
          '<path d="M50 24 L78 58 H22Z" fill="#4caf50" ' + CONTOUR + '/>' +
          '<path d="M50 8 L70 36 H30Z" fill="#5cbf60" ' + CONTOUR + '/>' +
          // Le petit visage
          yeux(42, 58, 66, 3.5) + sourire(50, 72, 7) + joues(35, 65, 72) +
          '</svg>'
      }
    ];

    return CARTES;
  })()
};
