import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js';

import { NoiseField } from './noisefield.js'

var renderer, scene, camera, clock;

function setupScene() {
  renderer = new THREE.WebGLRenderer();
  clock = new THREE.Clock();
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  document.body.appendChild(renderer.domElement);
  
  renderer.setClearColor(new THREE.Color(0x444444))
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 1000);
  
  window.addEventListener( 'resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);}, false );
  
  let mySize = 51;
  
  let n = new NoiseField({noiseScale: 0.1, power: 1.4});
  let n2 = new NoiseField({minHeight: mySize / 3, maxHeight: mySize * 2 / 3, power: 2, octaves: 3, persistence: 0.5, noiseScale: 0.1});
  
  let geo = new THREE.BufferGeometry();
  let scl = 0.5;
  let m = -mySize / 2 * scl;
  let vertex = new Float32Array(mySize * mySize * mySize * 3);
  for(let x = 0; x < mySize; x++) {
    for(let y = 0; y < mySize; y++) {
      for(let z = 0; z < mySize; z++) {
        let i = (x * mySize * mySize + y * mySize + z) * 3;
        let v = n2.getValue(x, 0, z);
        if((n.getNormalizedValue(x, y, z) > 0.5 || v - y < 3) && v - y >= 0) {
          vertex[i] = x * scl + m;
          vertex[i + 1] = y * scl + m;
          vertex[i + 2] = z * scl + m;
        } else {
          vertex[i] = -100;
          vertex[i + 1] = -100;
          vertex[i + 2] = -100;
        }
      }
    }
  }
  geo.setAttribute('position', new THREE.BufferAttribute(vertex, 3));
  let mat = new THREE.PointsMaterial({ color: new THREE.Color("red"), size: 0.3, sizeAttenuation: true});
  let mesh = new THREE.Points(geo, mat);
  scene.add(mesh);
  
  mesh.onBeforeRender = () => mesh.rotation.y += 0.001;
  camera.position.z = 30;
}

function animate(now) {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  renderer.render(scene, camera);
}

setupScene();
animate();