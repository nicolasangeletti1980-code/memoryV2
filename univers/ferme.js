// ===================================================================
// Univers « La Ferme » : ses couleurs, ses sons et ses dessins.
// ===================================================================

UNIVERS.ferme = {
  id: "ferme",
  nom: "La Ferme",
  titre: ["Memory", "de la", "Ferme"],
  accroche: "Vache, cochon, tracteur…",
  bravo: "Cocorico ! Bravo !",
  couleurs: {
    rose: "#e8553e", roseClair: "#ffe1d6", bleuClair: "#ffe9a8",
    violet: "#c0392b", violetFonce: "#6b3a1f", motDuMilieu: "#e69a00",
    fond: "linear-gradient(180deg, #fff6d9 0%, #ffe6a8 55%, #f5c86a 100%)",
    ombre: "190, 120, 40", voile: "107, 58, 31",
    dos: "linear-gradient(135deg, #ff8a65, #d84315)",
    bouton: "linear-gradient(135deg, #ffb300, #e8553e)",
    modeActif: "#6b3a1f", theme: "#ffe6a8",
    tuile: "linear-gradient(135deg, #fff6d9, #ffd98a)", texteTuile: "#6b3a1f"
  },
  // Une marguerite blanche au dos de chaque carte
  dos: (function () {
    let petales = "";
    for (let i = 0; i < 8; i++) {
      petales += '<ellipse cx="50" cy="27" rx="9" ry="17" transform="rotate(' + i * 45 + ' 50 50)"/>';
    }
    return '<svg viewBox="0 0 100 100" fill="#fff" opacity="0.9">' + petales +
      '<circle cx="50" cy="50" r="11" fill="#ffd54f"/></svg>';
  })(),
  mascotte: "vache",
  melodie: "vousDiraiJe",
  confettis: ["🌻", "🐔", "🐷", "⭐", "✨"],
  decor: ["🌻", "🌾", "🐣", "🌻", "🍎"],
  // Paire trouvée : 3 notes de xylophone qui montent (do, mi, sol)
  sonPaire: function () {
    [523.25, 659.25, 783.99].forEach(function (f, i) { SONS.xylophone(f, i * 0.09, 0.3); });
  },
  // Victoire : une gamme qui monte, puis le do tout en haut
  sonVictoire: function () {
    [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77].forEach(function (f, i) { SONS.xylophone(f, i * 0.1, 0.28); });
    SONS.xylophone(1046.5, 0.8, 0.3);
    SONS.xylophone(1318.5, 0.8, 0.2);
  },

  // Les 8 dessins des cartes
  cartes: (function () {
    // ===================================================================
    // Les outils de dessin, partagés par toutes les cartes de la ferme.
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
        id: "vache", nom: "Une vache", fond: "#fff3d6",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les cornes
          '<path d="M33 26 Q28 14 20 16 Q27 20 29 30Z M67 26 Q72 14 80 16 Q73 20 71 30Z" fill="#fff4d6" ' + CONTOUR + '/>' +
          // Les oreilles (avec l'intérieur rose)
          '<ellipse cx="18" cy="42" rx="11" ry="6" transform="rotate(-20 18 42)" fill="#fff" ' + CONTOUR + '/>' +
          '<ellipse cx="82" cy="42" rx="11" ry="6" transform="rotate(20 82 42)" fill="#fff" ' + CONTOUR + '/>' +
          '<ellipse cx="18" cy="42" rx="6" ry="2.8" transform="rotate(-20 18 42)" fill="#ffb3d1"/>' +
          '<ellipse cx="82" cy="42" rx="6" ry="2.8" transform="rotate(20 82 42)" fill="#ffb3d1"/>' +
          // La tête blanche avec une tache noire
          '<ellipse cx="50" cy="50" rx="29" ry="28" fill="#fff" ' + CONTOUR + '/>' +
          '<path d="M30 34 Q34 24 46 26 Q46 36 38 40 Q31 41 30 34Z" fill="#2b2b2b"/>' +
          // La petite mèche sur le front
          '<path d="M44 24 Q47 18 50 23 Q53 18 56 24" fill="#2b2b2b" stroke="#2b2b2b" stroke-width="2" stroke-linejoin="round"/>' +
          // Le grand museau rose, les narines et le sourire
          '<ellipse cx="50" cy="66" rx="21" ry="13" fill="#ffc4d6" ' + CONTOUR + '/>' +
          '<ellipse cx="42" cy="64" rx="3" ry="4" fill="#b0577a"/><ellipse cx="58" cy="64" rx="3" ry="4" fill="#b0577a"/>' +
          '<path d="M43 72 Q50 77 57 72" stroke="' + TRAIT + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
          yeux(39, 61, 46) + joues(30, 70, 55) +
          '</svg>'
      },
      {
        id: "cochon", nom: "Un cochon", fond: "#ffe3ec",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les oreilles pointues qui retombent un peu
          '<path d="M26 36 L20 14 L42 26Z M74 36 L80 14 L58 26Z" fill="#ffb6c8" ' + CONTOUR + '/>' +
          // La tête ronde
          '<circle cx="50" cy="54" r="30" fill="#ffb6c8" ' + CONTOUR + '/>' +
          // Le groin et ses deux trous
          '<ellipse cx="50" cy="62" rx="14" ry="10" fill="#ff8fab" ' + CONTOUR + '/>' +
          '<ellipse cx="45" cy="62" rx="2.8" ry="4" fill="#9c3b58"/><ellipse cx="55" cy="62" rx="2.8" ry="4" fill="#9c3b58"/>' +
          sourire(50, 76, 10) +
          yeux(38, 62, 46) + joues(28, 72, 58) +
          '</svg>'
      },
      {
        id: "poule", nom: "Une poule", fond: "#fff7e0",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les pattes jaunes
          '<path d="M40 84 v8 M35 94 h10 M60 84 v8 M55 94 h10" stroke="#f0a020" stroke-width="3.5" stroke-linecap="round"/>' +
          // La queue
          '<path d="M78 56 Q96 42 90 24 Q84 40 74 44Z" fill="#fff" ' + CONTOUR + '/>' +
          // Le corps tout rond
          '<ellipse cx="50" cy="56" rx="32" ry="30" fill="#fff" ' + CONTOUR + '/>' +
          // La crête rouge sur la tête
          '<path d="M38 30 Q35 18 43 19 Q44 10 51 14 Q57 9 60 19 Q68 19 63 30Z" fill="#e8413c" ' + CONTOUR + '/>' +
          // L'aile, bien en bas sur le côté
          '<path d="M56 66 Q66 56 78 64 Q70 78 56 66Z" fill="#f3ece0" ' + CONTOUR + '/>' +
          // Le bec et le barbillon rouge juste dessous
          '<path d="M44 46 L56 46 L50 54Z" fill="#ffb02e" ' + CONTOUR + '/>' +
          '<path d="M47 55 Q50 64 53 55Z" fill="#e8413c"/>' +
          yeux(39, 61, 40, 4) + joues(32, 68, 49) +
          '</svg>'
      },
      {
        id: "mouton", nom: "Un mouton", fond: "#e6f4ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La laine : plein de petits nuages blancs en cercle
          (function () {
            let laine = "";
            for (let i = 0; i < 10; i++) {
              const a = i / 10 * Math.PI * 2;
              laine += '<circle cx="' + (50 + 27 * Math.cos(a)).toFixed(1) + '" cy="' + (52 + 25 * Math.sin(a)).toFixed(1) + '" r="12" fill="#fff" ' + CONTOUR + '/>';
            }
            return laine + '<ellipse cx="50" cy="52" rx="28" ry="26" fill="#fff"/>';
          })() +
          // Les oreilles
          '<ellipse cx="25" cy="48" rx="9" ry="5" transform="rotate(20 25 48)" fill="#6d5a52" ' + CONTOUR + '/>' +
          '<ellipse cx="75" cy="48" rx="9" ry="5" transform="rotate(-20 75 48)" fill="#6d5a52" ' + CONTOUR + '/>' +
          // Le visage brun
          '<ellipse cx="50" cy="56" rx="17" ry="20" fill="#8a7268" ' + CONTOUR + '/>' +
          // La touffe de laine sur le front
          '<circle cx="43" cy="37" r="7" fill="#fff"/><circle cx="50" cy="34" r="7" fill="#fff"/><circle cx="57" cy="37" r="7" fill="#fff"/>' +
          '<ellipse cx="50" cy="66" rx="9" ry="6" fill="#a8908a"/>' +
          '<path d="M47 63 L53 63 L50 66Z" fill="#3a2a2a"/>' +
          '<path d="M50 66 v2 M46 70 q4 3 8 0" stroke="#3a2a2a" stroke-width="2" fill="none" stroke-linecap="round"/>' +
          yeux(43, 57, 52, 3.6) +
          '</svg>'
      },
      {
        id: "cheval", nom: "Un cheval", fond: "#f3e6ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les oreilles
          '<path d="M34 28 L32 10 L44 22Z M66 28 L68 10 L56 22Z" fill="#b5764a" ' + CONTOUR + '/>' +
          // La tête allongée
          '<path d="M30 30 Q50 14 70 30 Q74 52 66 70 Q50 82 34 70 Q26 52 30 30Z" fill="#b5764a" ' + CONTOUR + '/>' +
          // La crinière
          '<path d="M40 22 Q48 10 58 20 Q56 30 50 34 Q46 28 40 30Z" fill="#5a3420" ' + CONTOUR + '/>' +
          // Le museau clair et les naseaux
          '<ellipse cx="50" cy="70" rx="16" ry="11" fill="#e8c4a0" ' + CONTOUR + '/>' +
          '<ellipse cx="44" cy="68" rx="2.5" ry="3.5" fill="#5a3420"/><ellipse cx="56" cy="68" rx="2.5" ry="3.5" fill="#5a3420"/>' +
          sourire(50, 75, 8) +
          // L'étoile blanche sur le front
          '<path d="M50 38 L53 44 L50 50 L47 44Z" fill="#fff"/>' +
          yeux(39, 61, 48) + joues(32, 68, 58) +
          '</svg>'
      },
      {
        id: "lapin", nom: "Un lapin", fond: "#e9f7e4",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Les grandes oreilles (avec l'intérieur rose)
          '<ellipse cx="38" cy="24" rx="8" ry="20" transform="rotate(-10 38 24)" fill="#fff" ' + CONTOUR + '/>' +
          '<ellipse cx="62" cy="24" rx="8" ry="20" transform="rotate(10 62 24)" fill="#fff" ' + CONTOUR + '/>' +
          '<ellipse cx="38" cy="26" rx="4" ry="13" transform="rotate(-10 38 26)" fill="#ffb3d1"/>' +
          '<ellipse cx="62" cy="26" rx="4" ry="13" transform="rotate(10 62 26)" fill="#ffb3d1"/>' +
          // La tête
          '<ellipse cx="50" cy="62" rx="28" ry="25" fill="#fff" ' + CONTOUR + '/>' +
          // Le petit nez rose, la bouche et les deux dents
          '<ellipse cx="50" cy="66" rx="4" ry="3" fill="#ff7fa8"/>' +
          '<path d="M50 69 v3 M45 72 q5 4 10 0" stroke="' + TRAIT + '" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
          '<rect x="47" y="74" width="6" height="6" rx="1.5" fill="#fff" stroke="' + TRAIT + '" stroke-width="1.5"/>' +
          '<path d="M50 74 v6" stroke="' + TRAIT + '" stroke-width="1.2"/>' +
          // Les moustaches
          '<path d="M28 64 h12 M28 70 l12 -2 M72 64 h-12 M72 70 l-12 -2" stroke="#b0a0a0" stroke-width="1.5" stroke-linecap="round"/>' +
          yeux(39, 61, 56) + joues(32, 68, 66) +
          '</svg>'
      },
      {
        id: "canard", nom: "Un canard", fond: "#dff3ff",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // Le corps
          '<path d="M14 62 Q14 86 48 86 Q82 86 86 62 Q74 56 60 60 Q40 50 14 62Z" fill="#ffd93b" ' + CONTOUR + '/>' +
          // La queue relevée
          '<path d="M80 62 L92 50 L88 66Z" fill="#ffd93b" ' + CONTOUR + '/>' +
          // La tête
          '<circle cx="38" cy="40" r="18" fill="#ffd93b" ' + CONTOUR + '/>' +
          // Le bec orange
          '<path d="M20 42 Q8 42 8 48 Q16 52 26 48Z" fill="#ff8a1e" ' + CONTOUR + '/>' +
          // L'aile
          '<path d="M46 68 Q60 58 72 68 Q60 78 46 68Z" fill="#ffc400" ' + CONTOUR + '/>' +
          // Un seul œil : on voit le canard de profil
          '<circle cx="34" cy="36" r="3.8" fill="#2b2b2b"/><circle cx="35.3" cy="34.7" r="1.3" fill="#fff"/>' +
          '<ellipse cx="42" cy="46" rx="4" ry="2.5" fill="#ff8fc0" opacity="0.6"/>' +
          '</svg>'
      },
      {
        id: "tracteur", nom: "Un tracteur", fond: "#ffe9d6",
        dessin:
          '<svg viewBox="0 0 100 100">' +
          // La cheminée et sa fumée
          '<rect x="58" y="26" width="5" height="16" fill="#555" ' + CONTOUR + '/>' +
          '<circle cx="62" cy="18" r="4" fill="#e0e0e0"/><circle cx="68" cy="13" r="3" fill="#e0e0e0"/>' +
          // La cabine avec sa vitre
          '<path d="M18 30 h26 v30 h-26Z" fill="#e8413c" ' + CONTOUR + '/>' +
          '<path d="M23 35 h16 v13 h-16Z" fill="#bfe8ff" ' + CONTOUR + '/>' +
          // Le capot
          '<path d="M44 42 h36 q4 0 4 4 v16 h-40Z" fill="#e8413c" ' + CONTOUR + '/>' +
          // Le phare
          '<circle cx="80" cy="50" r="3" fill="#ffe066"/>' +
          // La grande roue arrière et la petite roue avant
          '<circle cx="30" cy="70" r="17" fill="#3a3a3a" ' + CONTOUR + '/>' +
          '<circle cx="30" cy="70" r="7" fill="#ffd93b"/>' +
          '<circle cx="74" cy="74" r="11" fill="#3a3a3a" ' + CONTOUR + '/>' +
          '<circle cx="74" cy="74" r="4.5" fill="#ffd93b"/>' +
          '</svg>'
      }
    ];

    return CARTES;
  })()
};
