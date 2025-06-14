
const { Engine, Render, Runner, Bodies, Composite, Events } = Matter;

const engine = Engine.create();
const world = engine.world;

const canvas = document.getElementById('gameCanvas');
const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: 400,
    height: 600,
    wireframes: false,
    background: '#1e293b'
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Create tray boundaries
const boundaries = [
  Bodies.rectangle(200, 0, 400, 20, { isStatic: true }), // top
  Bodies.rectangle(200, 600, 400, 20, { isStatic: true }), // bottom
  Bodies.rectangle(0, 300, 20, 600, { isStatic: true }), // left
  Bodies.rectangle(400, 300, 20, 600, { isStatic: true }) // right
];
Composite.add(world, boundaries);

function dropCoin() {
  const coin = Bodies.circle(200, 50, 15, {
    restitution: 0.4,
    render: {
      fillStyle: 'gold'
    }
  });
  Composite.add(world, coin);
}
