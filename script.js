const DISCORD_USER_ID = "742377986774270042";

function revealCards(){
  const cards = document.querySelectorAll('.card');
  cards.forEach((card, i) => {
    setTimeout(() => card.classList.add('visible'), 120 * i);
  });
}
document.addEventListener('DOMContentLoaded', revealCards);

let socket;
let heartbeatInterval;

function connectLanyard(){
  socket = new WebSocket('wss://api.lanyard.rest/socket');

  socket.onopen = () => {
    socket.send(JSON.stringify({
      op: 2,
      d: { subscribe_to_id: DISCORD_USER_ID }
    }));
  };

  socket.onmessage = (event) => {
    const payload = JSON.parse(event.data);
    const { op, t, d } = payload;

    switch (op) {
      case 1:
        heartbeatInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 3 }));
          }
        }, d.heartbeat_interval);
        break;

      case 0:
        if (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE') {
          updatePresence(d);
        }
        break;
    }
  };

  socket.onclose = () => {
    clearInterval(heartbeatInterval);
    setTimeout(connectLanyard, 5000);
  };

  socket.onerror = () => {
    fetchLanyardOnce();
  };
}

function fetchLanyardOnce(){
  fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`)
    .then(res => res.json())
    .then(json => { if (json.success) updatePresence(json.data); })
    .catch(err => console.warn('Lanyard REST fallback failed:', err));
}

function updatePresence(data){
  if (!data) return;

  if (data.discord_user && data.discord_user.avatar) {
    const { id, avatar } = data.discord_user;
    const ext = avatar.startsWith('a_') ? 'gif' : 'png';
    document.getElementById('avatar-img').src =
      `https://cdn.discordapp.com/avatars/${id}/${avatar}.${ext}?size=128`;
  }

  const status = data.discord_status || 'offline';

  const dot = document.getElementById('status-dot');
  dot.classList.remove('online', 'idle', 'dnd', 'offline');
  dot.classList.add(status);

  const pill = document.getElementById('status-pill');
  const pillText = document.getElementById('status-pill-text');
  pill.classList.remove('online', 'idle', 'dnd', 'offline');
  pill.classList.add(status);
  const statusLabels = { online: 'Online', idle: 'Idle', dnd: 'Do Not Disturb', offline: 'Offline' };
  pillText.textContent = statusLabels[status] || 'Offline';

  const activityLine = document.getElementById('activity-line');
  const activityText = document.getElementById('activity-text');

  if (status === 'offline') {
    activityLine.style.display = 'none';
  } else if (data.listening_to_spotify && data.spotify) {
    activityLine.style.display = 'flex';
    activityText.textContent = `Listening to: ${data.spotify.song} — ${data.spotify.artist}`;
  } else if (data.activities && data.activities.length > 0) {
    const activity = data.activities.find(a => a.type !== 4) || data.activities[0]; // type 4 = custom status, skip it if possible
    if (activity) {
      const verbByType = { 0: 'Playing', 1: 'Streaming', 2: 'Listening to', 3: 'Watching', 5: 'Competing in' };
      const verb = verbByType[activity.type] || 'Doing';
      activityLine.style.display = 'flex';
      activityText.textContent = `${verb}: ${activity.name}${activity.details ? ' — ' + activity.details : ''}`;
    } else {
      activityLine.style.display = 'none';
    }
  } else {
    activityLine.style.display = 'none';
  }
}
connectLanyard();
