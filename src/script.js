// ===============================
// CONFIGURAÇÃO DO CANVAS
// ===============================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

// ===============================
// CONFIGURAÇÃO DO MOUSE
// ===============================

const mouse = {
  x: canvas.width / 2,
  y: canvas.height / 2,
};

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

//Segmentos do peixe
class Segment {
  constructor(x, y, length, radius) {
    this.x = x;
    this.y = y;

    this.length = length;

    this.radius = radius;

    this.angle = 0;
  }

  follow(targetX, targetY) {
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    this.angle = Math.atan2(dy, dx);

    this.x = targetX - Math.cos(this.angle) * this.length;
    this.y = targetY - Math.sin(this.angle) * this.length;
  }

  draw() {
    ctx.beginPath();

    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);

    ctx.fill();
  }
}

const segments = [];
for (let i = 0; i < 10; i++) {
  segments.push(new Segment(mouse.x, mouse.y, 20, 10));
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  segments[0].follow(mouse.x, mouse.y); // O primeiro segmento segue o mouse
  for (let i = 1; i < segments.length; i++) {
    segments[i].follow(segments[i - 1].x, segments[i - 1].y);
  }

  segments.forEach((segment) => segment.draw());

  requestAnimationFrame(animate);
}

animate();
