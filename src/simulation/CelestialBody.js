export default class CelestialBody {
  constructor(x, y, radio, color, masa) {
    this.x = x
    this.y = y
    this.radio = radio
    this.color = color
    this.masa = masa
    this.orbita = [] // El array para guardar el historial es crucial
    this.esSol = false
    this.distanciaAlSol = 0
    this.vx = 0
    this.vy = 0
  }

  fuerzaAtraccion(otroCuerpo) {
    const otroX = otroCuerpo.x
    const otroY = otroCuerpo.y
    const distanciaX = otroX - this.x
    const distanciaY = otroY - this.y
    const distancia = Math.sqrt(distanciaX ** 2 + distanciaY ** 2)
    this.distanciaAlSol = distancia
    if (distancia === 0) return { x: 0, y: 0 }
    const G = 6.67428e-11
    const fuerza = (G * this.masa * otroCuerpo.masa) / distancia ** 2
    const angulo = Math.atan2(distanciaY, distanciaX)
    const fuerzaX = Math.cos(angulo) * fuerza
    const fuerzaY = Math.sin(angulo) * fuerza
    return { x: fuerzaX, y: fuerzaY }
  }

  actualizarPosicion(fuerzaX, fuerzaY, timestep) {
    const aceleracionX = fuerzaX / this.masa
    const aceleracionY = fuerzaY / this.masa
    this.vx += aceleracionX * timestep
    this.vy += aceleracionY * timestep
    this.x += this.vx * timestep
    this.y += this.vy * timestep

    // Guardamos la nueva posición en el historial
    this.orbita.push({ x: this.x, y: this.y })

    // Limitamos el historial para no consumir memoria infinita
    if (this.orbita.length > 200000) {
      this.orbita.shift()
    }
  }
}
