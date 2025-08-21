import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Renderer con buena calidad
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// Escena y cámara
const scene = new THREE.Scene();
// 🎨 Color de fondo (cambiá este valor si querés otro)
scene.background = new THREE.Color("#2b2f36"); // gris azulado oscuro

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 2, 5);

// Luces
scene.add(new THREE.AmbientLight(0xffffff, 0.35));

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// Suelo fijo (un poco más oscuro para contraste)
const suelo = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshStandardMaterial({ color: 0x9aa0a6 }) // gris medio
);
suelo.rotation.x = -Math.PI / 2;
suelo.position.y = 0;
suelo.receiveShadow = true;
scene.add(suelo);

// Rejilla (Grid) de referencia sobre el piso
const grid = new THREE.GridHelper(12, 24, 0xeeeeee, 0x666a73);
grid.position.y = 0.001; // apenas sobre el piso para evitar z-fighting
scene.add(grid);

// Textura de pino
const loader = new THREE.TextureLoader();
const texturaPino = loader.load("/pino.jpg");
texturaPino.wrapS = THREE.RepeatWrapping;
texturaPino.wrapT = THREE.RepeatWrapping;
texturaPino.anisotropy = renderer.capabilities.getMaxAnisotropy(); // más nitidez en ángulos
texturaPino.repeat.set(2.5, 2.5); // ajustá si querés más/menos veta

// Tabla vertical 2.4m (alto) x 1.2m (ancho) x 18mm (espesor)
// Ejes: X = ancho, Y = alto, Z = espesor
const geometry = new THREE.BoxGeometry(1.2, 2.4, 0.018);
const material = new THREE.MeshStandardMaterial({
  map: texturaPino,
  roughness: 0.55,
  metalness: 0.0,
});
const tabla = new THREE.Mesh(geometry, material);
tabla.castShadow = true;
// Apoyada sobre el piso
tabla.position.y = 2.4 / 2;
scene.add(tabla);

// Controles de cámara (el piso y la escena no se mueven, solo la cámara)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1.2, 0); // foco al centro de la placa

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
