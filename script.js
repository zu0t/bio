function showConsole() {
        document.getElementById("loading").style.display = "none";
        document.getElementById("console").style.display = "block";
    }

    function showLoading() {
        var loadingText = document.getElementById("loading");
        loadingText.style.display = "block";
        var dots = 0;
        var interval = setInterval(function() {
            dots = (dots + 1) % 4;
            loadingText.innerHTML = "Loading" + Array(dots + 1).join(".");
        }, 500);
        setTimeout(function() {
            clearInterval(interval);
            showConsole();
        }, 5000);
    }

    showLoading();

    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault();
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
        if (password !== "your_password") {
            document.getElementById("message").innerText = "Wrong password. Please try again.";
        } else {
            document.getElementById("message").innerText = "Login successful!";
        }
    });
