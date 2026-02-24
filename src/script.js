// =============================
// Canvas Manager
// =============================
class CanvasManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// =============================
// Mouse Controller
// =============================
class Mouse {
  constructor(canvas) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;

    window.addEventListener("mousemove", (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
    });
  }
}

// =============================
// Segment Class
// =============================
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
}

// =============================
// Fish Class
// =============================
class Fish {
  constructor(mouse, ctx) {
    this.mouse = mouse;
    this.ctx = ctx;
    this.segmentLength = 20;

    this.segmentRadii = [
      20, 38, 52, 56, 56, 56, 50, 44, 30, 26, 22, 18, 14, 10, 8, 7, 6, 5, 4, 3,
    ];

    this.segments = this.segmentRadii.map(
      (r) => new Segment(this.mouse.x, this.mouse.y, this.segmentLength, r),
    );
  }

  // =============================
  // Atualiza todos os segmentos
  // =============================
  update() {
    this.segments[0].follow(this.mouse.x, this.mouse.y);
    for (let i = 1; i < this.segments.length; i++) {
      this.segments[i].follow(this.segments[i - 1].x, this.segments[i - 1].y);
    }
  }

  // =============================
  // Renderização do peixe
  // =============================
  draw() {
    this.drawBody();
    this.drawHeadShield();
    this.drawFins();
    this.drawEyes();
    this.drawTail();
  }

  // =============================
  // Utilitário para calcular offsets
  // =============================
  getPerpendicularPoint(seg, scale = 1, side = 1, offset = 0) {
    const angle = seg.angle + (Math.PI / 2) * side;
    return {
      x:
        seg.x +
        Math.cos(angle) * seg.radius * scale +
        Math.cos(seg.angle) * seg.radius * offset,
      y:
        seg.y +
        Math.sin(angle) * seg.radius * scale +
        Math.sin(seg.angle) * seg.radius * offset,
    };
  }

  // =============================
  // Corpo do peixe
  // =============================
  drawBody() {
    const ctx = this.ctx;
    ctx.beginPath();

    // lado direito
    this.segments.forEach((seg, i) => {
      const point = this.getPerpendicularPoint(seg, 1, 1);
      i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });

    // lado esquerdo
    [...this.segments].reverse().forEach((seg) => {
      const point = this.getPerpendicularPoint(seg, 1, -1);
      ctx.lineTo(point.x, point.y);
    });

    ctx.closePath();

    const gradient = ctx.createLinearGradient(
      this.segments[0].x,
      this.segments[0].y,
      this.segments[10].x,
      this.segments[10].y,
    );

    gradient.addColorStop(0, "#7a8c4f");
    gradient.addColorStop(1, "#3f4a28");

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // =============================
  // Escudo da cabeça
  // =============================
  drawHeadShield() {
    const ctx = this.ctx;
    const shieldEnd = 7;
    ctx.beginPath();

    for (let i = 0; i <= shieldEnd; i++) {
      const seg = this.segments[i];
      const point = this.getPerpendicularPoint(seg, 1.15, 1);
      i === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    }

    for (let i = shieldEnd; i >= 0; i--) {
      const seg = this.segments[i];
      const point = this.getPerpendicularPoint(seg, 1.15, -1);
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();
    ctx.fillStyle = "#8a6b3d";
    ctx.fill();
  }

  // =============================
  // Nadadeiras
  // =============================
  drawFins() {
    this.drawFin(3, 1);
    this.drawFin(3, -1);
  }

  drawFin(index, side) {
    const ctx = this.ctx;
    const seg = this.segments[index];

    const baseFront = this.getPerpendicularPoint(seg, 1.15, side);
    const baseBack = this.getPerpendicularPoint(seg, 1.5, side, -0.5);
    const tip = this.getPerpendicularPoint(seg, 5, side, -2);

    ctx.beginPath();
    ctx.moveTo(baseFront.x, baseFront.y);
    ctx.quadraticCurveTo(tip.x, tip.y, baseBack.x, baseBack.y);
    ctx.closePath();
    ctx.fillStyle = "#8a6b3d";
    ctx.fill();
  }

  // =============================
  // Olhos
  // =============================
  drawEyes() {
    const ctx = this.ctx;
    const seg = this.segments[1];
    const offset = seg.radius * 0.4;
    const perp = seg.angle + Math.PI / 2;

    const points = [
      {
        x: seg.x + Math.cos(perp) * offset,
        y: seg.y + Math.sin(perp) * offset,
      },
      {
        x: seg.x - Math.cos(perp) * offset,
        y: seg.y - Math.sin(perp) * offset,
      },
    ];

    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#111";
      ctx.fill();
    });
  }

  // =============================
  // Cauda
  // =============================
  drawTail() {
    const ctx = this.ctx;
    const tailStart = this.segments.length - 7;

    ctx.beginPath();

    for (let i = tailStart; i < this.segments.length; i++) {
      const seg = this.segments[i];
      const point = this.getPerpendicularPoint(seg, 1.2, 1);
      i === tailStart
        ? ctx.moveTo(point.x, point.y)
        : ctx.lineTo(point.x, point.y);
    }

    const tip = this.segments.at(-1);
    ctx.quadraticCurveTo(
      tip.x + Math.cos(tip.angle) * tip.radius * 2,
      tip.y + Math.sin(tip.angle) * tip.radius * 2,
      tip.x,
      tip.y,
    );

    for (let i = this.segments.length - 1; i >= tailStart; i--) {
      const seg = this.segments[i];
      const point = this.getPerpendicularPoint(seg, 1.2, -1);
      ctx.lineTo(point.x, point.y);
    }

    ctx.closePath();
    ctx.fillStyle = "#3f4a28";
    ctx.fill();
  }
}

// =============================
// Aplicativo
// =============================
class App {
  constructor() {
    this.canvasManager = new CanvasManager("canvas");
    this.mouse = new Mouse(this.canvasManager.canvas);
    this.fish = new Fish(this.mouse, this.canvasManager.ctx);
    this.animate();
  }

  animate = () => {
    this.canvasManager.clear();
    this.fish.update();
    this.fish.draw();
    requestAnimationFrame(this.animate);
  };
}

// =============================
// Start
// =============================
new App();
