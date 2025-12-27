document.addEventListener('DOMContentLoaded', () => {

    const audio = document.getElementById('audio-source');
    const playBtn = document.getElementById('fp-play-btn'); 

    const progressBar = document.getElementById('fp-progress-bar'); 

    const albumArt = document.querySelector('.fp-art'); 

    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';

    let isPlaying = false;

    if (audio && playBtn) {
        audio.volume = 0.5;

        playBtn.addEventListener('click', () => {
            if (isPlaying) audio.pause();
            else audio.play();
        });

        audio.addEventListener('play', () => {
            isPlaying = true;
            playBtn.innerHTML = pauseIcon;
            albumArt.style.animationPlayState = 'running';
        });

        audio.addEventListener('pause', () => {
            isPlaying = false;
            playBtn.innerHTML = playIcon;
            albumArt.style.animationPlayState = 'paused';
        });

        audio.addEventListener('timeupdate', () => {
            if(audio.duration) {
                const percent = (audio.currentTime / audio.duration) * 100;
                progressBar.style.width = `${percent}%`;
            }
        });

        audio.addEventListener('ended', () => {
             if(!audio.loop) {
                 isPlaying = false;
                 playBtn.innerHTML = playIcon;
                 albumArt.style.animationPlayState = 'paused';
             }
        });
    }

    const navItems = document.querySelectorAll('.nav-item');
    const tabs = document.querySelectorAll('.content-tab');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const target = item.getAttribute('data-target');
            tabs.forEach(t => t.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    const cursor = document.getElementById('cursor');
    if (window.matchMedia("(min-width: 600px)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('.hover-trigger, a, button').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }
    if (max-width <= "600px"){
        document.getElementById("tab-header h2").style.margin = "-100px";
    }
});
