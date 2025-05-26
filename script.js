document.addEventListener('DOMContentLoaded', () => {

    const audio = document.getElementById('background-music');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = '<i class="fas fa-play"></i>';
    const pauseIcon = '<i class="fas fa-pause"></i>';
    const volumeSlider = document.getElementById('volume-slider');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    let isPlaying = false;

    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00'; 
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function togglePlayPause() {
        if (!audio) return; 
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => console.log("Play failed:", error));
        }

    }

    function updateProgress() {
        if (!audio || !audio.duration) return;
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    function setProgress(e) {
        if (!audio || !audio.duration) return;
        const width = this.clientWidth;
        const clickX = e.offsetX;
        audio.currentTime = (clickX / width) * audio.duration;
    }

    if (audio) {
        audio.addEventListener('loadedmetadata', () => {
             durationEl.textContent = formatTime(audio.duration);
        });
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('play', () => { 
            isPlaying = true; 
            playPauseBtn.innerHTML = pauseIcon; 
        });
        audio.addEventListener('pause', () => { 
            isPlaying = false; 
            playPauseBtn.innerHTML = playIcon; 
        });
        audio.addEventListener('ended', () => {
            playPauseBtn.innerHTML = playIcon;
            isPlaying = false;
            progress.style.width = '0%';
            audio.currentTime = 0;
            if(audio.loop) audio.play(); 
        });

        audio.volume = volumeSlider.value;
        if (audio.paused) {
            playPauseBtn.innerHTML = playIcon;
            isPlaying = false;
        } else {
            playPauseBtn.innerHTML = pauseIcon;
            isPlaying = true;
        }
        audio.load(); 
    }

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);
    if (volumeSlider) volumeSlider.addEventListener('input', () => { if(audio) audio.volume = volumeSlider.value; });
    if (progressBar) progressBar.addEventListener('click', setProgress);

    function wrapWordsAndLetters(element) {
        const nodes = [...element.childNodes];

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                const fragment = document.createDocumentFragment();
                const wordsAndSpaces = node.textContent.split(/(\s+)/);

                wordsAndSpaces.forEach(item => {
                    if (item.match(/\s+/)) {
                        fragment.appendChild(document.createTextNode(item));
                    } else if (item.length > 0) {
                        const wordSpan = document.createElement('span');
                        wordSpan.className = 'word-wrapper';

                        item.split('').forEach(char => {
                            const letterSpan = document.createElement('span');
                            letterSpan.className = 'letter-hover';
                            letterSpan.textContent = char;
                            wordSpan.appendChild(letterSpan);
                        });
                        fragment.appendChild(wordSpan);
                    }
                });
                element.replaceChild(fragment, node);
            } else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('letter-hover') && !node.classList.contains('word-wrapper')) {
                wrapWordsAndLetters(node);
            }
        });
    }

    const elementsToAnimate = document.querySelectorAll(
        '#hero h1, #hero .subtitle, #about h2, #about p, #glance h2, .widget h3, .widget p, #links h2, .cool-button span'
    );

    elementsToAnimate.forEach(el => {
        wrapWordsAndLetters(el);
    });

}); 
