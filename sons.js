// ===================================================================
// sons.js : les bruitages du jeu (clochettes, bulles, rugissements…).
// Aucun fichier son : le navigateur fabrique les sons lui-même
// grâce à "Web Audio" (un petit synthétiseur intégré).
//
// Chaque univers choisit ses instruments dans ce fichier
// (voir le dossier univers/).
// ===================================================================

const SONS = (function () {
  let audio = null;   // le synthétiseur, créé au premier toucher

  // Le synthétiseur ne peut démarrer qu'après un toucher de l'écran.
  function preparer() {
    if (audio === null) {
      const Synthe = window.AudioContext || window.webkitAudioContext;
      if (!Synthe) {
        return null;   // navigateur trop ancien : on joue sans son
      }
      audio = new Synthe();
    }
    if (audio.state === "suspended") {
      audio.resume();
    }
    return audio;
  }

  // Petit outil : un volume qui monte très vite puis s'éteint
  function enveloppe(t, volume, duree) {
    const gain = audio.createGain();
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duree);
    gain.connect(audio.destination);
    return gain;
  }

  // ----- 1. Clochette de fée (univers Myrtille) -----
  // Une vraie cloche mélange une note principale et des notes plus aiguës.
  function clochette(frequence, debut, duree, volume) {
    const t = audio.currentTime + debut;
    [[1, volume], [2.76, volume * 0.3], [5.4, volume * 0.12]].forEach(function (couche) {
      const oscillateur = audio.createOscillator();
      oscillateur.type = "sine";
      oscillateur.frequency.value = frequence * couche[0];
      oscillateur.connect(enveloppe(t, couche[1], duree));
      oscillateur.start(t);
      oscillateur.stop(t + duree + 0.05);
    });
  }

  // ----- 2. Bulle (univers Mer) : un son qui monte très vite, "bloup" -----
  function bulle(frequence, debut, volume) {
    const t = audio.currentTime + debut;
    const oscillateur = audio.createOscillator();
    oscillateur.type = "sine";
    oscillateur.frequency.setValueAtTime(frequence, t);
    oscillateur.frequency.exponentialRampToValueAtTime(frequence * 2.6, t + 0.1);
    oscillateur.connect(enveloppe(t, volume, 0.16));
    oscillateur.start(t);
    oscillateur.stop(t + 0.2);
  }

  // ----- 3. Rugissement (univers Dinos) -----
  // Un "souffle" (du bruit, comme "chhhh") fabriqué une seule fois.
  let souffle = null;
  function fabriquerSouffle() {
    if (souffle === null) {
      souffle = audio.createBuffer(1, audio.sampleRate, audio.sampleRate);
      const donnees = souffle.getChannelData(0);
      for (let i = 0; i < donnees.length; i++) {
        donnees[i] = Math.random() * 2 - 1;   // des valeurs au hasard = du bruit
      }
    }
    return souffle;
  }

  // Une "saturation" qui rend le son plus rauque
  function fabriquerSaturation() {
    const saturation = audio.createWaveShaper();
    const courbe = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      courbe[i] = Math.tanh((i / 128 - 1) * 4);
    }
    saturation.curve = courbe;
    return saturation;
  }

  // - debut : dans combien de secondes il commence
  // - duree : combien de temps il dure
  // - hauteur : grave (petit nombre) ou aigu (grand nombre)
  function rugissement(debut, duree, hauteur, volume) {
    const t = audio.currentTime + debut;

    // La voix : une note "en dents de scie" qui monte puis redescend
    const voix = audio.createOscillator();
    voix.type = "sawtooth";
    voix.frequency.setValueAtTime(hauteur * 0.8, t);
    voix.frequency.exponentialRampToValueAtTime(hauteur * 1.3, t + duree * 0.25);
    voix.frequency.exponentialRampToValueAtTime(hauteur * 0.6, t + duree);

    // Le souffle de la gorge
    const bruit = audio.createBufferSource();
    bruit.buffer = fabriquerSouffle();
    bruit.loop = true;
    const volumeBruit = audio.createGain();
    volumeBruit.gain.value = 0.5;

    // Un filtre qui garde surtout les sons graves (= gros animal)
    const filtre = audio.createBiquadFilter();
    filtre.type = "lowpass";
    filtre.frequency.value = hauteur * 6;
    filtre.Q.value = 3;

    // Le volume qui tremble très vite : c'est le "grrrr"
    const grr = audio.createOscillator();
    grr.frequency.value = 30;
    const forceGrr = audio.createGain();
    forceGrr.gain.value = 0.4;
    const tremblement = audio.createGain();
    tremblement.gain.value = 0.6;
    grr.connect(forceGrr);
    forceGrr.connect(tremblement.gain);

    // Le volume général : monte vite, tient, puis s'éteint
    const general = audio.createGain();
    general.gain.setValueAtTime(0.0001, t);
    general.gain.exponentialRampToValueAtTime(volume, t + 0.06);
    general.gain.setValueAtTime(volume, t + duree * 0.6);
    general.gain.exponentialRampToValueAtTime(0.0001, t + duree);

    const saturation = fabriquerSaturation();
    voix.connect(filtre);
    bruit.connect(volumeBruit);
    volumeBruit.connect(filtre);
    filtre.connect(saturation);
    saturation.connect(tremblement);
    tremblement.connect(general);
    general.connect(audio.destination);

    [voix, bruit, grr].forEach(function (source) {
      source.start(t);
      source.stop(t + duree + 0.1);
    });
  }

  // ----- 4. Xylophone en bois (univers Ferme) -----
  // Un son bref et rond : la note principale + une note 4 fois plus aiguë
  // qui s'éteint encore plus vite (c'est ce qui fait "bois").
  function xylophone(frequence, debut, volume) {
    const t = audio.currentTime + debut;
    [[1, volume, 0.5], [4, volume * 0.25, 0.08]].forEach(function (couche) {
      const oscillateur = audio.createOscillator();
      oscillateur.type = "sine";
      oscillateur.frequency.value = frequence * couche[0];
      oscillateur.connect(enveloppe(t, couche[1], couche[2]));
      oscillateur.start(t);
      oscillateur.stop(t + couche[2] + 0.05);
    });
  }

  // ----- 5. Petit oiseau (univers Forêt) : un "piou" qui glisse vers l'aigu -----
  function oiseau(frequence, debut, volume) {
    const t = audio.currentTime + debut;
    const oscillateur = audio.createOscillator();
    oscillateur.type = "sine";
    oscillateur.frequency.setValueAtTime(frequence, t);
    oscillateur.frequency.exponentialRampToValueAtTime(frequence * 1.6, t + 0.07);
    oscillateur.frequency.exponentialRampToValueAtTime(frequence * 1.2, t + 0.12);
    oscillateur.connect(enveloppe(t, volume, 0.14));
    oscillateur.start(t);
    oscillateur.stop(t + 0.18);
  }

  // ----- 6. Tambour (univers Zoo) : une note grave qui descend vite, "boum" -----
  function tambour(frequence, debut, volume) {
    const t = audio.currentTime + debut;
    const oscillateur = audio.createOscillator();
    oscillateur.type = "sine";
    oscillateur.frequency.setValueAtTime(frequence * 1.8, t);
    oscillateur.frequency.exponentialRampToValueAtTime(frequence, t + 0.08);
    oscillateur.connect(enveloppe(t, volume, 0.35));
    oscillateur.start(t);
    oscillateur.stop(t + 0.4);
  }

  return {
    preparer: preparer,
    // Chaque fonction ci-dessous vérifie d'abord que le son peut marcher
    clochette: function (f, d, duree, v) { if (preparer()) clochette(f, d, duree, v); },
    bulle: function (f, d, v) { if (preparer()) bulle(f, d, v); },
    rugissement: function (d, duree, h, v) { if (preparer()) rugissement(d, duree, h, v); },
    xylophone: function (f, d, v) { if (preparer()) xylophone(f, d, v); },
    oiseau: function (f, d, v) { if (preparer()) oiseau(f, d, v); },
    tambour: function (f, d, v) { if (preparer()) tambour(f, d, v); }
  };
})();
