import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import  getStarfield  from './src/getStarfield.js';
import { getFresnelMat } from './src/getFresnelMat.js';
//scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 2;

const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI / 180); 
scene.add(earthGroup); 

//mesh setup
const loader = new THREE.TextureLoader();
const geometry = new THREE.SphereGeometry(1,64,64);
const material = new THREE.MeshStandardMaterial({
   map: loader.load('textures/8081_earthmap10k.jpg'),
  
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const lightsmat = new THREE.MeshBasicMaterial({
    map: loader.load('textures/8081_earthlights10k.jpg'),
  
    blending: THREE.AdditiveBlending,
})

const lightsMesh = new THREE.Mesh(geometry,lightsmat)
earthGroup.add(lightsMesh);

const cloudmat = new THREE.MeshStandardMaterial({
    map: loader.load('textures/8081_earthhiresclouds4k.jpg'),
    blending: THREE.AdditiveBlending,
    transparent: true,
    opacity: 0.4,
    depthWrite: true,
   
  
})

const cloudMesh = new THREE.Mesh(geometry,cloudmat);
cloudMesh.scale.setScalar(1.01);
earthGroup.add(cloudMesh);

// const cloudTrans = new THREE.MeshStandardMaterial({
//     map: loader.load('textures/05_eathcloudmaptrans.jpg'),
//    blending: THREE.AdditiveBlending,
// })

// const cloudTransMesh = new THREE.Mesh(geometry,cloudTrans);
// earthGroup.add(cloudTransMesh);
const fresnelMat = getFresnelMat();
const glowmesh = new THREE.Mesh(geometry,fresnelMat);
glowmesh.scale.setScalar(1.01);

earthGroup.add(glowmesh);

const earthbump = new THREE.MeshStandardMaterial({
    map:loader.load('textures/8081_earthbump10k.jpg'),
    blending: THREE.AdditiveBlending,
})

const bumpmesh = new THREE.Mesh(geometry, earthbump);
bumpmesh.scale.setScalar(1);
earthGroup.add(bumpmesh);
const stars = getStarfield({numStars:2000});
scene.add(stars);


//resize handling
window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});




//lighting setup
const directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(-2, 0.5, 2 );
scene.add(directionalLight);



//controls setup
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;



//animation loop
const animate = ()=>{
    requestAnimationFrame(animate);
    earthMesh.rotation.y += 0.0005;
    lightsMesh.rotation.y += 0.0005;
    cloudMesh.rotation.y += 0.0005;
    bumpmesh.rotation.y += 0.0005;
    glowmesh.rotation.y += 0.0005;
    renderer.render(scene, camera);
}
animate();