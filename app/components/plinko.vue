<template>
  <div @click="dropBall()" ref="gameContainer" class="gameContainer"></div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Matter, { Engine, Render, Runner, Bodies, World, Body } from 'matter-js'

const gameContainer = ref<HTMLElement | null>(null)
const worldRef = ref<Matter.World | null>(null)
const ballPosRef = ref(0)
const isLandscape = ref()

onMounted(() => {
  if (!gameContainer.value) return
  isLandscape.value = window.innerWidth > window.innerHeight
  if (!isLandscape.value) return

  const width = window.innerWidth * 0.9
  const height = window.innerHeight * 0.8
  const pegSpacing = width / 25
  const pegRadius = pegSpacing / 6
  const binCount = 6
  const dividerThickness = 10
  const binHeight = 100
  const ballRadius = width / 100

  const engine = Engine.create()
  const world = engine.world
  worldRef.value = world

  const render = Render.create({
    element: gameContainer.value,
    engine,
    options: {
      width,
      height,
      wireframes: false,
      background: '#111',
    }
  })

  Render.run(render)
  const runner = Runner.create()
  Runner.run(runner, engine)

  // Pegs
  for (let row = 2; row < 22; row++) {
    for (let col = 0; col <= row; col++) {
      const totalRowWidth = row * pegSpacing
      const startX = (width / 2) - (totalRowWidth / 2)
      const x = startX + col * pegSpacing
      const y = (height / 5 + row * (height / 10)) / 3

      const peg = Bodies.circle(x, y, pegRadius, {
        isStatic: true,
        render: { fillStyle: '#eee' }
      })
      World.add(world, peg)
    }
  }

  // Side walls
  const wallThickness = width / 20
  const leftWall = Bodies.rectangle(0, 0, wallThickness, height * 2, { isStatic: true })
  const rightWall = Bodies.rectangle(width, 0, wallThickness, height * 2, { isStatic: true })
  World.add(world, [leftWall, rightWall])

  // Collector bins
  const binSpacing = (width - 2 * wallThickness) / binCount
  for (let i = 0; i <= binCount; i++) {
    const x = wallThickness + i * binSpacing
    const divider = Bodies.rectangle(
      x,
      height - binHeight / 2,
      dividerThickness,
      binHeight,
      {
        isStatic: true,
        render: { fillStyle: '#888' }
      }
    )
    World.add(world, divider)
  }

  // Ground
  const ground = Bodies.rectangle(width / 2, height - 10, width, 20, { isStatic: true })
  World.add(world, ground)

  // Preview ball (moving)
  let previewBall = Bodies.circle(width / 2, 10, ballRadius, {
    isStatic: true,
    render: { fillStyle: '#ff3e00' }
  })
  World.add(world, previewBall)
  ballPosRef.value = width / 2

  // Animate preview ball left-right
  let movingRight = true
  const leftLimit = width / 2.2
  const rightLimit = width - width /2.2

  const previewInterval = setInterval(() => {
    if (movingRight) {
      ballPosRef.value += 3
      if (ballPosRef.value >= rightLimit) movingRight = false
    } else {
      ballPosRef.value -= 3
      if (ballPosRef.value <= leftLimit) movingRight = true
    }
    Body.setPosition(previewBall, { x: ballPosRef.value, y: previewBall.position.y })
  }, 10)

  // Resize handler (optional)
  const handleResize = () => {
    render.canvas.width = window.innerWidth * 0.9
    render.canvas.height = window.innerHeight * 0.8
  }
  window.addEventListener('resize', handleResize)

  onBeforeUnmount(() => {
    Render.stop(render)
    Runner.stop(runner)
    clearInterval(previewInterval)
    window.removeEventListener('resize', handleResize)
  })
})

// Drop a dynamic ball at the current preview position
const dropBall = () => {
  const ball = Bodies.circle(ballPosRef.value, 10, window.innerWidth * 0.9 / 150, {
    restitution: 1,
    render: { fillStyle: '#ff3e00' }
  })
  if (worldRef.value) {
    World.add(worldRef.value, ball)
  }
}


</script>

<style scoped>
.gameContainer {
  margin: auto;
  height: 80vh;
  border: 2px solid #444;
  aspect-ratio: 5, 3;
}
</style>
