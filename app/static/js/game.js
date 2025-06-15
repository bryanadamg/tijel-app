const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let coins = 10;
let activeCoins = [];
const gravity = 0.5;
const friction = 0.98;
const bounce = 0.3;

const coinCountEl = document.getElementById("coinCount");

const platform = {
    x: 0,
    y: canvas.height - 100,
    width: canvas.width,
    height: 20,
    pushAmount: 0.5,
    offset: 0,
};

class Coin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 15;
        this.vx = 0;
        this.vy = 0;
        this.mass = 1;
    }

    update() {
        this.vy += gravity;

        this.x += this.vx;
        this.y += this.vy;

        // Collide with platform
        if (this.y + this.radius > platform.y + platform.offset &&
            this.y < platform.y + platform.offset + platform.height) {
            this.y = platform.y + platform.offset - this.radius;
            this.vy *= -bounce;
        }

        // Collide with walls
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -bounce;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -bounce;
        }

        // Apply friction
        this.vx *= friction;
        this.vy *= friction;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = "gold";
        ctx.fill();
        ctx.stroke();
    }
}

// Drop coin on click
canvas.addEventListener("click", (e) => {
    if (coins <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    activeCoins.push(new Coin(x, 0));
    coins--;
    coinCountEl.textContent = coins;
});

// Draw platform
function drawPlatform() {
    ctx.fillStyle = "#964B00";
    ctx.fillRect(platform.x, platform.y + platform.offset, platform.width, platform.height);
}

// Simple circle collision and response
function handleCoinCollisions() {
    for (let i = 0; i < activeCoins.length; i++) {
        const a = activeCoins[i];
        for (let j = i + 1; j < activeCoins.length; j++) {
            const b = activeCoins[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = a.radius + b.radius;

            if (dist < minDist) {
                const angle = Math.atan2(dy, dx);
                const overlap = (minDist - dist) / 2;

                // Push each coin away
                const offsetX = Math.cos(angle) * overlap;
                const offsetY = Math.sin(angle) * overlap;

                a.x -= offsetX;
                a.y -= offsetY;
                b.x += offsetX;
                b.y += offsetY;

                // Simple velocity exchange
                const ax = a.vx;
                const ay = a.vy;
                a.vx = b.vx * 0.5;
                a.vy = b.vy * 0.5;
                b.vx = ax * 0.5;
                b.vy = ay * 0.5;
            }
        }
    }
}

// Remove coins that fall off screen
function detectFalls() {
    for (let i = activeCoins.length - 1; i >= 0; i--) {
        const coin = activeCoins[i];
        if (coin.y - coin.radius > canvas.height) {
            activeCoins.splice(i, 1);
            coins++;
            coinCountEl.textContent = coins;
        }
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlatform();

    platform.offset = Math.sin(Date.now() / 200) * 50;

    handleCoinCollisions();

    for (const coin of activeCoins) {
        coin.update();
        coin.draw();
    }

    detectFalls();
    requestAnimationFrame(gameLoop);
}

gameLoop();
