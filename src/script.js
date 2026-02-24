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
const radiuses = [16, 36, 50, 52, 54, 54, 52, 46, 40, 36, 30, 28, 26, 22, 18, 14, 10, 7, 5, 3];

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
  ctx.fillStyle = "#606c38"; // Preenche o corpo do peixe
  ctx.fill();
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

  //drawHead();
  drawBody();

  requestAnimationFrame(animate);
}

animate();
