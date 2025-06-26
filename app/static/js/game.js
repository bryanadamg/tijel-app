const { Engine, Render, Runner, World, Bodies, Body, Events, Composite, Mouse, MouseConstraint } = Matter;

// Create engine and world
const engine = Engine.create();
const world = engine.world;
world.gravity.y = 1; // standard gravity

const canvas = document.getElementById("gameCanvas");
const width = canvas.width;
const height = canvas.height;

const platformStartX = 100;
const platformAmplitude = 10;

let coins = 10;
const coinCountEl = document.getElementById("coinCount");

// Custom render using canvas
const render = Render.create({
    canvas: canvas,
    engine: engine,
    options: {
        width: width,
        height: height,
        background: "#f4f4f4",
        wireframes: false,
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);

// --- PLATFORM (Oscillating Pusher) ---
const platformHeight = 100;
const platformY = height - height / 2.5;
const platform = Bodies.rectangle(
    platformStartX,
    platformY,
    800,
    platformHeight,
    {
        isStatic: false,
        inertia: Infinity,
        friction: 0.8,
        frictionStatic: 0.8,
        collisionFilter: { group: -1 },
        render: { fillStyle: "#75726f" } }
);
Body.setMass(platform, 100000);
World.add(world, platform);

// --- BASE (end zone to catch coins) ---
const base = Bodies.rectangle(
    (width - 300) / 2,
    platformY + platformHeight + (height / 4),
    width - 300,
    height / 2,
    { isStatic: true, render: { fillStyle: "#3b3838" } }
);
World.add(world, base);

// --- SPAWNER WALL ---
const spawner = Bodies.rectangle(
    150,
    100 + (height - height / 2.5 - 100) / 2,
    300,
    height - height / 2.5 - 100,
    { isStatic: true, render: { fillStyle: "#ccc7c6" } }
);
World.add(world, spawner);

// --- BOUNDARIES ---
const floor = Bodies.rectangle(width / 2, height + 50, width, 100, {
    isStatic: true,
    render: { visible: false }
});
const leftWall = Bodies.rectangle(-50, height / 2, 100, height, {
    isStatic: true,
    render: { visible: false }
});
const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height, {
    isStatic: true,
    render: { visible: false }
});
World.add(world, [floor, leftWall, rightWall]);

// --- COIN SPAWNING ---
function spawnCoin(x, y) {
    const coin = Bodies.rectangle(x, y, 50, 10, {
        restitution: 0.25,       // Slight bounce (0.2–0.3 is realistic for metal-on-metal)
        friction: 0.3,          // Some sliding friction, not too grippy
        frictionStatic: 0.5,     // Slightly sticky when stopped
        frictionAir: 0.005,      // Heavier object = less air drag
        density: 0.005,          // Increase density = heavier (default is ~0.001)
        render: {
            fillStyle: "silver",
            strokeStyle: "#ccaa00",
            lineWidth: 1
        }
    });
    World.add(world, coin);
}

// --- Mouse Drop Control ---
canvas.addEventListener("click", (e) => {
    if (coins <= 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = 10;

    spawnCoin(x, y);
    coins--;
    coinCountEl.textContent = coins;
});


let direction = 1;
// --- Oscillate the platform ---
Events.on(engine, "beforeUpdate", () => {
    const oscillation = Math.sin(engine.timing.timestamp / 200) * 50;
    const targetX = platformStartX + oscillation * platformAmplitude;
    const currentX = platform.position.x;
    const vx = (targetX - currentX) * 0.3;

    Body.setVelocity(platform, { x: vx, y: 0 });
    // Body.setPosition(platform, {
    //     x: width / 2 + offset,
    //     y: platformY
    // });
});

// --- Coin recycling logic ---
Events.on(engine, "afterUpdate", () => {
    const bodies = Composite.allBodies(world);
    for (const body of bodies) {
        // Remove coins off screen
        if (body.position.y > height + 100 && body.label === "Circle Body") {
            World.remove(world, body);
            coins++;
            coinCountEl.textContent = coins;
            continue;
        }

        // Move coins with platform if close to top of platform
        const thresholdY = platform.position.y - platformHeight / 2 - 16;
        const isRestingOnPlatform = (
            body.label === "Circle Body" &&
            Math.abs(body.position.y - thresholdY) < 5 &&
            Math.abs(body.velocity.y) < 0.5
        );

        if (isRestingOnPlatform) {
            Body.setVelocity(body, {
                x: platform.velocity.x,
                y: body.velocity.y
            });
        }
        // if (body.position.y > height + 100 && body.label === "Circle Body") {
        //     World.remove(world, body);
        //     coins++;
        //     coinCountEl.textContent = coins;
        // }
    }
});
