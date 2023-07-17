import * as THREE from 'three';
// import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
// import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import * as data from './data.js';


var t: number = 0;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x282828);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / (window.innerHeight-document.getElementById("header")!.offsetHeight), 0.1, 1000);
camera.position.set(0,0,50);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight-document.getElementById("header")!.offsetHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;
controls.enablePan = false;

const m1 = new THREE.MeshStandardMaterial({ toneMapped: false, color: 0xff0000, emissiveIntensity: 1, emissive: "red"});
const m2 = new THREE.MeshStandardMaterial({ toneMapped: false, color: 0x00ff00, emissiveIntensity: 1, emissive: "green" });
const m3 = new THREE.MeshStandardMaterial({ toneMapped: false, color: 0x0000ff, emissiveIntensity: 1, emissive: "blue" });
// scene.add(new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xffffff})));

const g1 = new THREE.SphereGeometry(3);
const me1 = new THREE.Mesh(g1, m1);
const g2 = new THREE.SphereGeometry(3);
const me2 = new THREE.Mesh(g2, m2);
const g3 = new THREE.SphereGeometry(3);
const me3 = new THREE.Mesh(g3, m3);
me1.position.set(...data.p1[t]);
me2.position.set(...data.p2[t]);
me3.position.set(...data.p3[t]);
scene.add(me1);
scene.add(me2);
scene.add(me3);

// const ambient = new THREE.AmbientLight(0xffffff, 0.2);
// scene.add(ambient)

// const directional = new THREE.DirectionalLight(0xffffff, 0.5);
// scene.add(directional);

var averagepos = [0, 0, 0];
function aver(p1, p2, p3) {
    return [(p1[0] + p2[0] + p3[0]) / 3, (p1[1] + p2[1] + p3[1]) / 3, (p1[2] + p2[2] + p3[2]) / 3];
}
function avdist(p1,p2,p3,av) {
    let d1 = Math.sqrt((p1[0]-av[0])**2+(p1[1]-av[1])**2+(p1[1]-av[1])**2);
    let d2 = Math.sqrt((p2[0]-av[0])**2+(p2[1]-av[1])**2+(p2[1]-av[1])**2);
    let d3 = Math.sqrt((p3[0]-av[0])**2+(p3[1]-av[1])**2+(p3[1]-av[1])**2);
    return (d1+d2+d3)/3;
}
const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight-document.getElementById("header")!.offsetHeight),1.6,0.1,0.2);

var composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);
// composer.addPass(outputPass);

// function animate() {
//     requestAnimationFrame(animate);
//     if (t > data.max / data.sl) { t = 0; }
//     t++;
//     render();
// }
var p1, p2, p3;
function render() {
    if (t >= 1999) {t=0;}
    t++;
    controls.update();
    p1 = data.p1[t];
    p2 = data.p2[t];
    p3 = data.p3[t];
    me1.position.set(...p1);
    me2.position.set(...p2);
    me3.position.set(...p3);
    averagepos = aver(p1, p2, p3);
    controls.target = new THREE.Vector3(...averagepos);
    controls.zoom0 = avdist(p1,p2,p3,averagepos);
    // camera.position.set(averagepos[0]+Math.max(avdist(p1,p2,p3,averagepos)*10,100),averagepos[1],averagepos[2]);
    composer.render();
    requestAnimationFrame(render);

}
render();
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / (window.innerHeight-document.getElementById("header")!.offsetHeight);
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight-document.getElementById("header")!.offsetHeight);
}
