import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// -- Debug
const gui = new GUI()

// -- Canvas
const canvas = document.querySelector('canvas.webgl')

// -- Scene
const scene = new THREE.Scene()

// -- Helpers
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper)

const axesFolder = gui.addFolder('axes');
axesFolder.add(axesHelper, 'visible');

axesFolder.close()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
// const _Texture = texttureLoader.load('/textures/_');

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial()
)
scene.add(cube)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

const cameraFolder = gui.addFolder('camera');
cameraFolder.add(camera.position, 'x').min(-10).max(10).step(0.01)
cameraFolder.add(camera.position, 'y').min(-10).max(10).step(0.01)
cameraFolder.add(camera.position, 'z').min(-10).max(10).step(0.01)

/**
 * Lights
 */
const lightsFolder = gui.addFolder('lights');
lightsFolder.close()

// -- Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight)

const ambientLightFolder = lightsFolder.addFolder('ambient light');
ambientLightFolder.addColor(ambientLight, 'color');
ambientLightFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.01);
ambientLightFolder.add(ambientLight, 'visible');
ambientLightFolder.close()


// -- Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff,0.5)
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
scene.add(directionalLight)
scene.add(directionalLightHelper)
directionalLightHelper.visible = false


const directionalLightFolder = lightsFolder.addFolder('directional light');
directionalLightFolder.addColor(directionalLight, 'color');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(2).step(0.01);
directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.01);
directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.01);
directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.01);

directionalLightFolder.add(directionalLight, 'visible').name("light visible");
directionalLightFolder.add(directionalLightHelper, 'visible').name("helper visible");
directionalLightFolder.close()

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Change background color of scene
//renderer.setClearColor(0xffffff)

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

	// Helper controls
	directionalLightHelper.update();

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()