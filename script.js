let canvas = document.getElementById('aurora');
let ctx = canvas.getContext('2d');
let oknoSirka = 0;
let oknoVyska = 0;
let casovac = 0;

function zmenVelikostPlatna() {
  oknoSirka = window.innerWidth;
  oknoVyska = window.innerHeight;
  canvas.width = oknoSirka;
  canvas.height = oknoVyska;
}

window.addEventListener('resize', zmenVelikostPlatna);
zmenVelikostPlatna();
let barevneKruhy = [
  { poziceX: 0.15, poziceY: 0.35, velikost: 0.52, barva: '88, 101, 242', rychlost: 0.00018, posun: 0 },
  { poziceX: 0.75, poziceY: 0.20, velikost: 0.45, barva: '67, 181, 129', rychlost: 0.00013, posun: 1.8 },
  { poziceX: 0.55, poziceY: 0.70, velikost: 0.48, barva: '235, 69, 158', rychlost: 0.00021, posun: 3.5 },
  { poziceX: 0.30, poziceY: 0.80, velikost: 0.38, barva: '88, 101, 242', rychlost: 0.00015, posun: 5.1 },
  { poziceX: 0.85, poziceY: 0.60, velikost: 0.42, barva: '67, 181, 129', rychlost: 0.00019, posun: 2.3 }
];

function vykresliPozadi() {
  ctx.clearRect(0, 0, oknoSirka, oknoVyska);
  casovac++;

  for (let i = 0; i < barevneKruhy.length; i++) {
    let kruh = barevneKruhy[i];
    
    let x = oknoSirka * (kruh.poziceX + 0.07 * Math.sin(casovac * kruh.rychlost + kruh.posun));
    let y = oknoVyska * (kruh.poziceY + 0.05 * Math.cos(casovac * kruh.rychlost * 1.3 + kruh.posun));
    
    let mensiStrana = oknoSirka;
    if (oknoVyska < oknoSirka) {
      mensiStrana = oknoVyska;
    }
    let r = mensiStrana * (kruh.velikost + 0.03 * Math.sin(casovac * kruh.rychlost * 0.7 + kruh.posun));

    let gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, 'rgba(' + kruh.barva + ', 0.13)');
    gradient.addColorStop(0.5, 'rgba(' + kruh.barva + ', 0.05)');
    gradient.addColorStop(1, 'rgba(' + kruh.barva + ', 0)');

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }

  requestAnimationFrame(vykresliPozadi);
}
vykresliPozadi();

let polozkyOdkazu = document.querySelectorAll('.link-item');

for (let i = 0; i < polozkyOdkazu.length; i++) {
  let polozka = polozkyOdkazu[i];
  let textOdkazu = polozka.querySelector('.link-label');

  if (textOdkazu) {
    polozka.addEventListener('mouseenter', function() {
      textOdkazu.textContent = textOdkazu.getAttribute('data-url');
      textOdkazu.style.fontFamily = "'Space Mono', monospace";
      textOdkazu.style.fontSize = "0.72rem";
      textOdkazu.style.fontWeight = "400";
    });

    polozka.addEventListener('mouseleave', function() {
      textOdkazu.textContent = textOdkazu.getAttribute('data-name');
      textOdkazu.style.fontFamily = "";
      textOdkazu.style.fontSize = "";
      textOdkazu.style.fontWeight = "";
    });
  }
}

let blokyNaStrance = document.querySelectorAll('.block');

for (let i = 0; i < blokyNaStrance.length; i++) {
  setTimeout(function() {
    blokyNaStrance[i].classList.add('in');
  }, 80 + (i * 100));
}

let discordId = '742377986774270042';
let webSocketSpojeni;
let intervalPingu;

function pripojLanyard() {
  webSocketSpojeni = new WebSocket('wss://api.lanyard.rest/socket');

  webSocketSpojeni.onopen = function() {
    let pozadavek = {
      op: 2,
      d: { subscribe_to_id: discordId }
    };
    webSocketSpojeni.send(JSON.stringify(pozadavek));
  };

  webSocketSpojeni.onmessage = function(udalost) {
    let prijataData = JSON.parse(udalost.data);

    if (prijataData.op === 1) {
      intervalPingu = setInterval(function() {
        if (webSocketSpojeni.readyState === 1) {
          webSocketSpojeni.send(JSON.stringify({ op: 3 }));
        }
      }, prijataData.d.heartbeat_interval);
    }

    if (prijataData.op === 0) {
      if (prijataData.t === 'INIT_STATE' || prijataData.t === 'PRESENCE_UPDATE') {
        vykresliDiscordData(prijataData.d);
      }
    }
  };

  webSocketSpojeni.onclose = function() {
    clearInterval(intervalPingu);
    setTimeout(pripojLanyard, 5000);
  };

  webSocketSpojeni.onerror = function() {
    fetch('https://api.lanyard.rest/v1/users/' + discordId)
      .then(function(odpoved) { return odpoved.json(); })
      .then(function(jsonZprava) {
        if (jsonZprava.success) {
          vykresliDiscordData(jsonZprava.data);
        }
      }).catch(function() {});
  };
}

function vykresliDiscordData(dataZApi) {
  if (!dataZApi) return;
  if (dataZApi.discord_user && dataZApi.discord_user.avatar) {
    let idUzivatele = dataZApi.discord_user.id;
    let kodAvataru = dataZApi.discord_user.avatar;
    let koncovka = kodAvataru.startsWith("a_") ? "gif" : "png";
    
    document.getElementById('avatar-img').src = 
      "https://cdn.discordapp.com/avatars/" + idUzivatele + "/" + kodAvataru + "." + koncovka + "?size=128";
  }

  // 2. Discord status text & barvy
  let aktualniStatus = dataZApi.discord_status || "offline";
  let textStatusu = "Offline";
  if (aktualniStatus === "online") textStatusu = "Online";
  if (aktualniStatus === "idle")   textStatusu = "Idle";
  if (aktualniStatus === "dnd")    textStatusu = "Do Not Disturb";

  document.getElementById('status-dot').className = "status-dot " + aktualniStatus;
  document.getElementById('status-pill').className = "prof-status " + aktualniStatus;
  document.getElementById('status-label').textContent = textStatusu;

  // 3. Aktivita (Spotify, Hry...)
  let listaAktivity = document.getElementById('activity-bar');
  let textAktivity = document.getElementById('activity-text');
  let vyslednaZprava = "";

  if (aktualniStatus !== "offline") {
    if (dataZApi.listening_to_spotify && dataZApi.spotify) {
      vyslednaZprava = "Listening to " + dataZApi.spotify.song + " — " + dataZApi.spotify.artist;
    } 
    else if (dataZApi.activities && dataZApi.activities.length > 0) {
      let hlavniAktivita = null;
      for (let i = 0; i < dataZApi.activities.length; i++) {
        if (dataZApi.activities[i].type !== 4) {
          hlavniAktivita = dataZApi.activities[i];
          break;
        }
      }

      if (!hlavniAktivita) {
        hlavniAktivita = dataZApi.activities[0];
      }

      if (hlavniAktivita) {
        let druhAktivityText = "";
        if (hlavniAktivita.type === 0) druhAktivityText = "Playing";
        if (hlavniAktivita.type === 1) druhAktivityText = "Streaming";
        if (hlavniAktivita.type === 2) druhAktivityText = "Listening to";
        if (hlavniAktivita.type === 3) druhAktivityText = "Watching";
        if (hlavniAktivita.type === 5) druhAktivityText = "Competing in";

        vyslednaZprava = druhAktivityText + " " + hlavniAktivita.name;
        if (hlavniAktivita.details) {
          vyslednaZprava = vyslednaZprava + " — " + hlavniAktivita.details;
        }
      }
    }
  }

  if (vyslednaZprava !== "") {
    textAktivity.textContent = vyslednaZprava;
    listaAktivity.classList.add('show');
  } else {
    listaAktivity.classList.remove('show');
  }
}

pripojLanyard();
