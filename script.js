function typeText(element, text, speed) {
  let index = 0;
  const timer = setInterval(function() {
      if (index < text.length) {
          element.textContent += text[index];
          index++;
      } else {
          clearInterval(timer);
      }
  }, speed);
}

function animateText() {
  const titleElement = document.querySelector(".title");
  titleElement.style.opacity = '1';
  typeText(titleElement, "zuot", 800);
}

function playMusic() {
  var audio = document.getElementById("background-music");
  audio.play();
}

function startScripts() {
  playMusic();

  setTimeout(function() {
      animateText();
  }, 20);

  const title = document.querySelector('.title');
  function toggleCase() {
      const text = title.textContent;
      let modifiedText = '';

      for (let i = 0; i < text.length; i++) {
          const isUppercase = Math.random() < 0.5;
          modifiedText += isUppercase ? text[i].toUpperCase() : text[i].toLowerCase();
      }

      title.textContent = modifiedText;

      const style = [
          Math.random() < 0.5 ? 'bold' : 'normal',
          Math.random() < 0.5 ? 'underline' : 'none',
          Math.random() < 0.5 ? 'italic' : 'normal',
          Math.random() < 0.5 ? 'line-through' : 'none'
      ];

      title.style.fontWeight = style.includes('bold') ? 'bold' : 'normal';
      title.style.textDecoration = style.includes('underline') ? 'underline' : 'none';
      title.style.fontStyle = style.includes('italic') ? 'italic' : 'normal';
      title.style.textDecorationLine = style.includes('line-through') ? 'line-through' : 'none';
  }

  setInterval(toggleCase, 150);
}

document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");
  const ramecek = document.querySelector(".ramecek");

  overlay.addEventListener("click", function() {
      overlay.style.opacity = '0';
      overlay.style.backdropFilter = 'blur(0)';

      ramecek.classList.add('show');

      setTimeout(function() {
          overlay.remove();
          startScripts();
      }, 1000);
  });
});

const asciiArt = `
SITE MADE BY:
███████╗██╗   ██╗ ██████╗ ████████╗
╚══███╔╝██║   ██║██╔═══██╗╚══██╔══╝
  ███╔╝ ██║   ██║██║   ██║   ██║   
███╔╝   ██║   ██║██║   ██║   ██║   
███████╗╚██████╔╝╚██████╔╝   ██║   
╚══════╝ ╚═════╝  ╚═════╝    ╚═╝ 
`;
console.log(asciiArt);
