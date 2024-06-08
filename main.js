import * as THREE from 'three';

import { OrbitControls } from '/controls/OrbitControls.js';

function setCamera(camera) {
    camera.position.set(0, 0, 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function getDirectionalLights() {
    for (var i = 0; i < 4; i++) {
        var light = new THREE.DirectionalLight(0xffffff, 0.03);
        switch (i) {
            case 0:
                light.position.set(0, 0, 10000);
                break;
            case 1:
                light.position.set(0, 0, -10000);
            case 2:
                light.position.set(10000, 0, 0);
            case 3:
                light.position.set(-10000, 0, 0);
        }
        scene.add(light);
    }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5 * Math.pow(10, 8));
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

function createSun(intensity) {
    var texture = getTexture('/textures/sun.jpg');
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.NearestFilter;

    var geometry = new THREE.SphereGeometry(10, 64, 32);

    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    var sun = new THREE.Mesh(geometry, material);

    var sunLight = new THREE.PointLight(0xffffff, intensity, 1000000, 0.01);

    sun.add(sunLight);
    return sun;
}

function createAtmosphere(radius, src) {
    var map = getTexture(src);
    map.minFilter = THREE.LinearFilter;
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.01, 32, 32),
        new THREE.MeshPhongMaterial({
            map: map,
            transparent: true,
            opacity: 0.9
        })
    );
    return mesh;
}

function createSurface(radius, src_base, src_topo) {
    var map = getTexture(src_base);
    map.minFilter = THREE.NearestFilter;
    if (src_topo) {
        var bumpMap = getTexture(src_topo);
        bumpMap.minFilter = THREE.NearestFilter;
    }
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius, 32, 32),
        new THREE.MeshPhongMaterial({
            map: map,
            bumpMap: bumpMap || null,
            bumpScale: bumpMap ? 0.15 : null,
        })
    );
    return mesh;
}

function createPlanet(radius, src_base, src_topo, distanceFromParent, cloud = null) {
    var planet = new THREE.Mesh(new THREE.SphereGeometry(radius - 0.1, 32, 32));
    var surface = createSurface(radius, src_base, src_topo);
    planet.add(surface);
    if (cloud) {
        var atmosphere = createAtmosphere(radius, cloud);
        planet.add(atmosphere);
    }
    //planet.distanceFromParent = distanceFromParent;
    planet.position.set(0, 0, distanceFromParent);
    return planet;
}

function createOrbit(distanceFromParent, color) {
    const orbitGeometry = new THREE.BufferGeometry();
    const orbitMaterial = new THREE.LineBasicMaterial({ color: color });
    const points = [];
    var resolution = distanceFromParent + 15 * 50;
    var length = 360 / resolution;
    for (let i = 0; i <= resolution; i++) {
        var segment = (i * length) * Math.PI / 180;
        points.push(new THREE.Vector3(Math.cos(segment) * distanceFromParent, 0, Math.sin(segment) * distanceFromParent));
    }
    orbitGeometry.setFromPoints(points);
    return new THREE.Line(orbitGeometry, orbitMaterial);
}

function update(renderer, scene, camera, controls) {
    sun.rotation.x = 0.1;
    orbitEarth.rotation.y += 0.01;
    earth.rotation.y += 0.1;
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    })
}

var controls = new OrbitControls(camera, renderer.domElement);
var intensity = 4.0;

var sun = createSun(intensity);
var earth = createPlanet(2, "textures/earth.jpg", "textures/earth_topo.jpg", 60, "textures/earth_clouds.png");
var orbitEarth = createOrbit(60, 0xffff00);
orbitEarth.add(earth);
sun.add(orbitEarth);


scene.add(sun);

getDirectionalLights();


update(renderer, scene, camera, controls);

