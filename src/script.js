const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

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

// Raio de cada segmento do peixe
const radiuses = [
  20, 38, 52, 56, 56, 56, 50, 44, 30, 26, 22, 18, 14, 10, 8, 7, 6, 5, 4, 3,
];

const segments = [];
for (let i = 0; i < radiuses.length; i++) {
  segments.push(new Segment(mouse.x, mouse.y, 20, radiuses[i]));
}

function drawBody() {
  ctx.beginPath();

  //lado direito do corpo
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const angle = seg.angle + Math.PI / 2; // Ajusta o ângulo para a direção do segmento
    const x = seg.x + Math.cos(angle) * seg.radius; // Calcula a posição do corpo com base no segmento
    const y = seg.y + Math.sin(angle) * seg.radius;

    if (i === 0) {
      ctx.moveTo(x, y); // Move para o primeiro ponto do corpo
    } else {
      ctx.lineTo(x, y); // Desenha linha para os próximos pontos do corpo
    }
  }

  //lado esquerdo do corpo
  for (let i = segments.length - 1; i >= 0; i--) {
    const seg = segments[i];
    const angle = seg.angle - Math.PI / 2; // Ajusta o ângulo para a direção do segmento
    const x = seg.x + Math.cos(angle) * seg.radius;
    const y = seg.y + Math.sin(angle) * seg.radius;

    ctx.lineTo(x, y); // Desenha linha para os próximos pontos do corpo
  }

  ctx.closePath(); // Fecha o caminho para formar o corpo completo
  const gradient = ctx.createLinearGradient(
    segments[0].x,
    segments[0].y,
    segments[10].x,
    segments[10].y,
  );

  gradient.addColorStop(0, "#7a8c4f");

  gradient.addColorStop(1, "#3f4a28");

  ctx.fillStyle = gradient;
  ctx.fill();
}

function drawRoundFin(index, side) {
  const seg = segments[index];
  const angle = seg.angle;
  const perp = angle + (Math.PI / 2) * side;

  const baseFrontX = seg.x + Math.cos(perp) * seg.radius * 1.15;
  const baseFrontY = seg.y + Math.sin(perp) * seg.radius * 1.15;

  const baseBackX =
    seg.x +
    Math.cos(perp) * seg.radius * 1.5 -
    Math.cos(angle) * seg.radius * 0.5;
  const baseBackY =
    seg.y +
    Math.sin(perp) * seg.radius * 1.5 -
    Math.sin(angle) * seg.radius * 0.5;

  const tipX =
    seg.x + Math.cos(perp) * seg.radius * 5 - Math.cos(angle) * seg.radius * 2;
  const tipY =
    seg.y + Math.sin(perp) * seg.radius * 5 - Math.sin(angle) * seg.radius * 2;

  ctx.beginPath();
  ctx.moveTo(baseFrontX, baseFrontY);
  ctx.quadraticCurveTo(tipX, tipY, baseBackX, baseBackY);
  ctx.lineTo(baseFrontX, baseFrontY);
  ctx.fillStyle = "#8a6b3d";
  ctx.fill();
}

function drawFins() {
  // Nadadeira direita
  drawRoundFin(3, 1);
  // Nadadeira esquerda
  drawRoundFin(3, -1);
}

function drawHeadShield() {
  const shieldEnd = 7;
  ctx.beginPath();

  // lado direito
  for (let i = 0; i <= shieldEnd; i++) {
    const seg = segments[i];
    const angle = seg.angle + Math.PI / 2;
    const scale = 1.15; // escudo um pouco maior que corpo
    const x = seg.x + Math.cos(angle) * seg.radius * scale;
    const y = seg.y + Math.sin(angle) * seg.radius * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }

  // lado esquerdo
  for (let i = shieldEnd; i >= 0; i--) {
    const seg = segments[i];
    const angle = seg.angle - Math.PI / 2;
    const scale = 1.15;
    const x = seg.x + Math.cos(angle) * seg.radius * scale;
    const y = seg.y + Math.sin(angle) * seg.radius * scale;
    ctx.lineTo(x, y);
  }
  ctx.closePath();

  ctx.fillStyle = "#8a6b3d";
  ctx.fill();
  // linhas das placas
  ctx.strokeStyle = "#3b2a17";
  ctx.lineWidth = 2;

  for (let i = 1; i < shieldEnd; i++) {
    ctx.beginPath();
    ctx.moveTo(segments[i].x, segments[i].y);
    const perp = segments[i].angle + Math.PI / 2;
    ctx.lineTo(
      segments[i].x + Math.cos(perp) * segments[i].radius,
      segments[i].y + Math.sin(perp) * segments[i].radius,
    );
    ctx.stroke();
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  segments[0].follow(mouse.x, mouse.y); // O primeiro segmento segue o mouse
  for (let i = 1; i < segments.length; i++) {
    segments[i].follow(segments[i - 1].x, segments[i - 1].y);
  }

  ctx.beginPath();
  ctx.moveTo(segments[0].x, segments[0].y);

  for (let i = 1; i < segments.length; i++) {
    ctx.lineTo(segments[i].x, segments[i].y);
  }
  drawBody();
  drawHeadShield();
  drawFins();

  requestAnimationFrame(animate);
}

animate();
