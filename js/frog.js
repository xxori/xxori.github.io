const img = document.getElementById("frog")

function loop() {
    if (Math.random() > 0.9) {
        img.className = ""
        setTimeout(function() {img.className="hidden"}, 1000)
    }
}

setInterval(loop, 500)