    const phrases = [
        "Coming Soon",
        "Fr trust me im working on it",
        "This site will be done soon",
        "I'm not capping",
        "Trust the proces",
        "Balls",
        "Rn i'm working on it fr",
        "Just come back soon",
        "Bro why u still here?",
        "Just come back soon and see if site done"
    ];
    let index = 0;
    const consoleText = document.querySelector('.console-text');

    function changeText() {
        const text = phrases[index];
        let i = 0;
        const interval = setInterval(function() {
            consoleText.textContent += text[i];
            i++;
            if (i > text.length - 1) {
                clearInterval(interval);
                setTimeout(function() {
                    eraseText();
                }, 1500); 
            }
        }, 100);
        index = (index + 1) % phrases.length;
    }

    function eraseText() {
        const textLength = consoleText.textContent.length;
        const interval = setInterval(function() {
            consoleText.textContent = consoleText.textContent.slice(0, -1);
            if (consoleText.textContent === '') {
                clearInterval(interval);
                setTimeout(function() {
                    changeText();
                }, 500);
            }
        }, 50);
    }

    setTimeout(changeText, 2000);
