export function lerp(start, end, t) {
  //Retorna um valor entre start e end, baseado em t (0 a 1)
  return start + (end - start) * t;
}

export function clamp(value, min, max) {
  //Limita um valor entre min e max
  return Math.min(Math.max(value, min), max);
}

export function distance(x1, y1, x2, y2) {
  //Calcula a distância entre dois pontos (x1, y1) e (x2, y2)
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export function angleBetween(x1, y1, x2, y2) {
    //Calcula o ângulo entre dois pontos (x1, y1) e (x2, y2) em radianos
    return Math.atan2(y2 - y1, x2 - x1);
}

export function radtoDeg(radians) {
    //Converte radianos para graus
    return radians * (180 / Math.PI);
}

export function randomRange(min, max) {
    //Gera um número aleatório entre min e max
    return Math.random() * (max - min) + min;
}

export function randomInt(min, max) {
    //Gera um número inteiro aleatório entre min e max
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
