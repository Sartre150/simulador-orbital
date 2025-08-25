<script setup>
import { ref, onMounted, watch } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import CelestialBody from '../simulation/CelestialBody.js'

const props = defineProps({
  cometParams: { type: Object, required: true },
  isPaused: { type: Boolean, default: false },
  simulationSpeed: { type: Number, default: 1.0 },
  visualToggles: { type: Object, required: true },
})
const emit = defineEmits(['dataUpdate'])

const canvasContainer = ref(null)
const G = 6.67428e-11
const M_SOL = 1.989e30
const UA = 149.6e9
const ESCALA = 250 / UA
const TIMESTEP_BASE = 3600 * 24
const DANGER_THRESHOLD_UA = 0.1

let scene, camera, renderer, composer, controls
let sol, tierra, cometa
let solMesh, tierraMesh, cometaMesh
let tierraOrbitLine, cometaOrbitLine, cometaOrbitMaterial
let cuerpos = []
let centroElipseMesh, foco2Mesh, ejeMayorLine

const actualizarVisualesElipse = () => {
  if (centroElipseMesh) scene.remove(centroElipseMesh)
  if (foco2Mesh) scene.remove(foco2Mesh)
  if (ejeMayorLine) scene.remove(ejeMayorLine)
  const e = props.cometParams.excentricidad,
    afelioDist = props.cometParams.afelio * UA
  const a = afelioDist / (1 + e),
    c = a * e
  const perihelioDist = a * (1 - e),
    centroX = (afelioDist - perihelioDist) / 2
  const foco2X = 2 * centroX,
    perihelioX = afelioDist - 2 * a
  const sphereGeom = new THREE.SphereGeometry(9, 16, 16)
  if (props.visualToggles.showFoci) {
    centroElipseMesh = new THREE.Mesh(sphereGeom, new THREE.MeshBasicMaterial({ color: 0x00aaff }))
    centroElipseMesh.position.x = centroX * ESCALA
    scene.add(centroElipseMesh)
    foco2Mesh = new THREE.Mesh(sphereGeom, new THREE.MeshBasicMaterial({ color: 0xff4444 }))
    foco2Mesh.position.x = foco2X * ESCALA
    scene.add(foco2Mesh)
  }
  if (props.visualToggles.showAxis) {
    const points = [
      new THREE.Vector3(afelioDist * ESCALA, 0, 0),
      new THREE.Vector3(perihelioX * ESCALA, 0, 0),
    ]
    ejeMayorLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }),
    )
    scene.add(ejeMayorLine)
  }
}

const reiniciarSimulacion = () => {
  if (tierra) {
    tierra.x = -1 * UA
    tierra.y = 0
    tierra.vx = 0
    tierra.vy = 29.78 * 1000
    tierra.orbita = []
  }
  if (cometaMesh) scene.remove(cometaMesh)
  if (cometaOrbitLine) scene.remove(cometaOrbitLine)
  const e_cometa = props.cometParams.excentricidad
  const r_a_cometa = props.cometParams.afelio * UA
  const a_cometa = r_a_cometa / (1 + e_cometa)
  const vel_afelio_cometa = Math.sqrt(G * sol.masa * (2 / r_a_cometa - 1 / a_cometa))
  cometa = new CelestialBody(r_a_cometa, 0, 8, 0xcccccc, 1e22)
  cometa.vy = -vel_afelio_cometa
  cometaMesh = new THREE.Mesh(
    new THREE.SphereGeometry(cometa.radio, 28, 28),
    new THREE.MeshStandardMaterial({
      color: cometa.color,
      emissive: 0xaaaaaa,
      emissiveIntensity: 1.5,
    }),
  )
  scene.add(cometaMesh)
  cometaOrbitMaterial.color.set(0xcccccc)
  cometaOrbitLine = new THREE.Line(new THREE.BufferGeometry(), cometaOrbitMaterial)
  scene.add(cometaOrbitLine)
  cuerpos = [tierra, cometa]
  actualizarVisualesElipse()
}

watch(() => props.cometParams, reiniciarSimulacion, { deep: true })
watch(() => props.visualToggles, actualizarVisualesElipse, { deep: true })

onMounted(() => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000)
  camera.position.z = 750
  renderer = new THREE.WebGLRenderer({ canvas: canvasContainer.value, antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)

  // <<< INICIO DE MODIFICACIONES PARA MÓVILES >>>
  // 1. Optimizar la resolución en pantallas de alta densidad (móviles)
  const pixelRatio = Math.min(window.devicePixelRatio, 1.5)
  renderer.setPixelRatio(pixelRatio)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  const renderPass = new RenderPass(scene, camera)

  // 2. Reducir la calidad del Bloom en pantallas pequeñas
  const isMobile = window.innerWidth <= 768
  const bloomStrength = isMobile ? 0.8 : 2.5 // Menos intensidad en móviles
  const bloomRadius = isMobile ? 0.2 : 0.4 // Menos dispersión en móviles

  const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    bloomStrength,
    bloomRadius,
    0.0,
  )
  // <<< FIN DE MODIFICACIONES PARA MÓVILES >>>

  composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  composer.addPass(bloomPass)
  const textureLoader = new THREE.TextureLoader()
  sol = new CelestialBody(0, 0, 20, 0xffff00, M_SOL)
  sol.esSol = true
  solMesh = new THREE.Mesh(
    new THREE.SphereGeometry(sol.radio, 32, 32),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('/texture/sun.jpg') }),
  )
  scene.add(solMesh)
  tierra = new CelestialBody(-1 * UA, 0, 10, 0x0099ff, 5.9722e24)
  tierra.vy = 29.78 * 1000
  tierraMesh = new THREE.Mesh(
    new THREE.SphereGeometry(tierra.radio, 32, 32),
    new THREE.MeshStandardMaterial({
      map: textureLoader.load('/texture/eart.jpg'),
      emissive: 0x0055ff,
      emissiveIntensity: 1.5,
    }),
  )
  scene.add(tierraMesh)
  tierraOrbitLine = new THREE.Line(
    new THREE.BufferGeometry(),
    new THREE.LineBasicMaterial({ color: 0x0099ff, transparent: true, opacity: 0.5 }),
  )
  scene.add(tierraOrbitLine)
  cometaOrbitMaterial = new THREE.LineBasicMaterial({
    color: 0xcccccc,
    transparent: true,
    opacity: 0.5,
  })
  scene.add(new THREE.PointLight(0xffffff, 3, 5000))
  scene.add(new THREE.AmbientLight(0xffffff, 0.2))
  textureLoader.load('/texture/stars.jpg', (texture) => {
    scene.add(
      new THREE.Mesh(
        new THREE.SphereGeometry(5000, 64, 64),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide }),
      ),
    )
  })

  reiniciarSimulacion()

  const animate = () => {
    requestAnimationFrame(animate)
    if (props.isPaused) {
      composer.render()
      return
    }
    controls.update()
    const timeStepTotal = TIMESTEP_BASE * props.simulationSpeed
    const subSteps = 200
    const subTimeStep = timeStepTotal / subSteps
    for (let i = 0; i < subSteps; i++) {
      cuerpos.forEach((cuerpo) => {
        const fuerza = cuerpo.fuerzaAtraccion(sol)
        cuerpo.actualizarPosicion(fuerza.x, fuerza.y, subTimeStep)
      })
    }
    tierraOrbitLine.visible = props.visualToggles.showEarthOrbit
    if (cometaOrbitLine) cometaOrbitLine.visible = props.visualToggles.showCometOrbit
    cuerpos.forEach((cuerpo) => {
      const isEarth = cuerpo === tierra
      const mesh = isEarth ? tierraMesh : cometaMesh
      mesh.position.set(cuerpo.x * ESCALA, cuerpo.y * ESCALA, 0)
      if (isEarth) mesh.rotation.y += 0.005
      const orbitLine = isEarth ? tierraOrbitLine : cometaOrbitLine
      const shouldDrawOrbit = isEarth
        ? props.visualToggles.showEarthOrbit
        : props.visualToggles.showCometOrbit
      if (shouldDrawOrbit && orbitLine) {
        const points = cuerpo.orbita
        if (points.length > 1) {
          const positions = points.flatMap((p) => [p.x * ESCALA, p.y * ESCALA, 0])
          orbitLine.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(positions, 3),
          )
          orbitLine.geometry.computeBoundingSphere()
        }
      }
    })
    solMesh.rotation.y += 0.001
    if (tierra && cometa) {
      const separationDistance =
        Math.sqrt((tierra.x - cometa.x) ** 2 + (tierra.y - cometa.y) ** 2) / UA
      const isDangerouslyClose = separationDistance < DANGER_THRESHOLD_UA
      if (cometaOrbitLine)
        cometaOrbitLine.material.color.set(isDangerouslyClose ? 0xff4444 : 0xcccccc)
      emit('dataUpdate', {
        cometVelocity: Math.sqrt(cometa.vx ** 2 + cometa.vy ** 2) / 1000,
        cometDistance: cometa.distanciaAlSol / UA,
        earthVelocity: Math.sqrt(tierra.vx ** 2 + tierra.vy ** 2) / 1000,
        earthDistance: tierra.distanciaAlSol / UA,
        separationDistance,
        isClose: isDangerouslyClose,
      })
    }
    composer.render()
  }
  animate()

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    composer.setSize(window.innerWidth, window.innerHeight)
  })
})
</script>

<template>
  <canvas ref="canvasContainer"></canvas>
</template>

<style scoped>
canvas {
  display: block;
  position: fixed;
  top: 0;
  left: 0;
}
</style>
