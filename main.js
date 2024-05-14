import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function setCamera(camera) {
    camera.position.set(0, 0, 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function getDirectionalLights(intensity) {
    for (var i = 0; i < 4; i++) {
        var light = new THREE.DirectionalLight({color: 0xffffff, intensity});
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
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.05, 5 * Math.pow(10,13));
setCamera(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
var textureLoader = new THREE.TextureLoader();

document.body.appendChild(renderer.domElement);

function createPlanet(radius, texture, distance, speed, rotation, cloud = false, ring = false)  {
    var geometry = new THREE.SphereGeometry(radius, 32, 32);
    var material = new THREE.MeshBasicMaterial({

    });
    var planet = new THREE.Mesh(geometry, material);
    planet.distance = distance;
    planet.speed = speed;
    return planet;
}

function getTexture(src) { 
    var texture = textureLoader.load('/textures/sun_detailed.png');
}

function createSun() {
    var texture = textureLoader.load('/textures/sun_detailed.png');
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    var geometry = new THREE.SphereGeometry(20, 84, 42);
    var material = new THREE.MeshPhongMaterial({
        map: texture,
        lightMap: texture,
        transparent: true,
        opacity: 0.85, // 0.8
        flatShading: false
    });
    var sunLight = new THREE.PointLight(0xffffff, 10, 10000, 0.6);
    var sun = new THREE.Mesh(geometry, material);
    sun.add(sunLight);
    return sun;
}

function update(renderer, scene, camera, controls) {
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function() {
        update(renderer, scene, camera, controls);
    })
}


var controls = new OrbitControls( camera, renderer.domElement);

var planets = []
var sun = createSun();

scene.add(sun);
scene.add(controls);
var intensity = 2.0;
//getDirectionalLights(intensity);

update(renderer, scene, camera, controls);