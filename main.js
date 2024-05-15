import * as THREE from 'three';

import { OrbitControls } from '/controls/OrbitControls.js';

function setCamera(camera) {
    camera.position.set(0, 0, 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function getDirectionalLights(intensity) {
    for (var i = 0; i < 4; i++) {
        var light = new THREE.DirectionalLight({color: 0x010201, intensity});
        switch (i) {
            case 0:
                light.position.set(0, 0, 1000);
                break;
            case 1: 
                light.position.set(0, 0, -1000);
            case 2: 
                light.position.set(1000, 0, 0);
            case 3: 
                light.position.set(-1000, 0, 0);
        }
        scene.add(light);
    }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5 * Math.pow(10,8));
setCamera(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

function getTexture(src) { 
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(src);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

function createSun() {
    var texture = getTexture('/textures/sun_detailed.png');
    texture.minFilter = THREE.NearestFilter;

    var geometry = new THREE.SphereGeometry(10, 64, 42);

    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    
    var sun = new THREE.Mesh(geometry, material);

    var sunLight = new THREE.PointLight(0xffffff, 5.0, 1000000, 0.01);

    sun.add(sunLight);
    return sun;
}

const time = new Date().getTime();

function createPlanet(radius, src, distanceFromParent, cloud = false, ring = false)  {
    var texture = getTexture(src);
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshPhongMaterial({
        map: texture,
        flatShading: false
    });
    var planet = new THREE.Mesh(geometry, material);
    planet.distanceFromParent = distanceFromParent;

    planet.position.set(Math.cos(2.5) * planet.distanceFromParent, 0, Math.sin(2.5) * planet.distanceFromParent);
    return planet;
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    })
}


var controls = new OrbitControls( camera, renderer.domElement);

var earth = createPlanet(2, "textures/earth_10k.jpg", 140);
var sun = createSun();

scene.add(sun);
scene.add(earth);
scene.add(controls);
var intensity = 2.0;
//getDirectionalLights(intensity);


update(renderer, scene, camera, controls);
