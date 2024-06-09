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

    var geometry = new THREE.SphereGeometry(12, 64, 32);

    var material = new THREE.MeshBasicMaterial({
        map: texture
    });

    var sun = new THREE.Mesh(geometry, material);

    var sunLight = new THREE.PointLight(0xffffff, intensity, 100000, 0.05);

    sun.add(sunLight);
    return sun;
}

function createAtmosphere(radius, src) {
    var map = getTexture(src);
    map.minFilter = THREE.LinearFilter;
    var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(radius * 1.02, 32, 32),
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
            bumpScale: bumpMap ? 0.75 : null,
        })
    );
    return mesh;
}

function createPlanet(radius, src_base, src_topo, distanceFromParent, rotate, cloud = null) {
    var planet = new THREE.Mesh(new THREE.SphereGeometry(radius - 0.1, 32, 32));
    var surface = createSurface(radius, src_base, src_topo);
    planet.add(surface);
    if (cloud) {
        var atmosphere = createAtmosphere(radius, cloud);
        planet.add(atmosphere);
    }
    planet.radius = radius;
    planet.distanceFromParent = distanceFromParent;
    planet.position.set(0, 0, distanceFromParent);
    var radians =  rotate * (Math.PI / 180);
    planet.rotation.x = radians;
    return planet;
}

function createRing(planet, base, color, rotate) {
    var innerRadius = planet.radius * 1.2;
    var outerRadius = innerRadius + planet.radius * 0.5;
    var thetaSegments = 30;
    var geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments);

    var map = getTexture(base);
    map.minFilter = THREE.NearestFilter;

    var colorMap = getTexture(color);
    colorMap.minFilter = THREE.NearestFilter;

    var material = new THREE.MeshLambertMaterial({
        map: colorMap,
        alphaMap: map,
        transparent: true,
        opacity: 0.98,
        side: THREE.DoubleSide
    });

    var ring = new THREE.Mesh(geometry, material);
    ring.position.set(0, 0, 0);
    var radians =  rotate * (Math.PI / 180);
    ring.rotation.x = radians;
    ring.rotation.x = Math.PI / 2;
    return ring;
}

function createOrbit(distanceFromParent, color, rotate) {
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
    var orbit = new THREE.Line(orbitGeometry, orbitMaterial);
    const radians = rotate * Math.PI / 180;
    orbit.rotation.x = radians;
    return orbit;
}


var controls = new OrbitControls(camera, renderer.domElement);

// Ensure the renderer and camera aspect ratio is updated on window resize
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

var speed = 1;
var intensity = 1.5;

function animation(orbit, planet, orbitSpeed, rotateSpeed) {
    orbit.rotation.y += orbitSpeed * speed;
    planet.rotation.y += rotateSpeed * speed;
}

function update(renderer, scene, camera, controls) {
    //animation here
    sun.rotation.y = 0.01 * speed;
    animation(orbitMercury, mercury, 0.001, 0.1);
    animation(orbitVenus, venus, 0.001, 0.1);
    animation(orbitEarth, earth, 0.001, 0.1);
    animation(orbitMars, mars, 0.001, 0.1);
    animation(orbitJupiter, jupiter, 0.001, 0.1);
    animation(orbitSaturn, saturn, 0.001, 0.1);
    animation(orbitUranus, uranus, 0.001, 0.1)
    animation(orbitNeptune, neptune, 0.001, 0.1);

    //-----------------------------------------    
    renderer.render(scene, camera);
    controls.update();
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    })
}

var sun = createSun(intensity);

//mercury
var mercury = createPlanet(0.75, "textures/mercury.jpg", "textures/mercury_topo.jpg", 35, 2);
var orbitMercury = createOrbit(35, 0xffff00, 2);
orbitMercury.add(mercury);

//venus
var venus = createPlanet(1.9, "textures/venus.jpg", "textures/venus_topo.jpg", 44, 177.3);
var orbitVenus = createOrbit(44, 0xffff00, 3.4);
orbitVenus.add(venus);

//earth
var earth = createPlanet(2, "textures/earth.jpg", "textures/earth_topo.jpg", 60, 23.5, "textures/earth_clouds.png");
var orbitEarth = createOrbit(60, 0xffff00, 0);
orbitEarth.add(earth);

//mars
var mars = createPlanet(1.1, "textures/mars.jpg", "textures/mars_topo.jpg", 90, 25.2);
var orbitMars = createOrbit(90, 0xffff00, 1.8);
orbitMars.add(mars);

//jupiter
var jupiter = createPlanet(6, "textures/jupiter.jpg", null, 200, 3.1);
var orbitJupiter = createOrbit(200, 0xffff00, 1.3);
orbitJupiter.add(jupiter);

//saturn
var saturn = createPlanet(5, "textures/saturn.jpg", null, 300, 26.7);
var saturnRing = createRing(saturn, "textures/rings_map.png", "textures/rings_color_map.png", 26.7);
saturn.add(saturnRing);
var orbitSaturn = createOrbit(300, 0xffff00, 2.5);
orbitSaturn.add(saturn);

//uranus
var uranus = createPlanet(2.5, "textures/uranus.jpg", null, 450, 97.8);
var orbitUranus = createOrbit(450, 0xffff00, 0.8);
orbitUranus.add(uranus);

//neptune
var neptune = createPlanet(2.5, "textures/neptune.jpg", null, 590, 29.6);
var orbitNeptune = createOrbit(590, 0xffff00, 1.7);
orbitNeptune.add(neptune);

sun.add(orbitMercury);
sun.add(orbitVenus);
sun.add(orbitEarth);
sun.add(orbitMars);
sun.add(orbitJupiter);
sun.add(orbitSaturn);
sun.add(orbitUranus);
sun.add(orbitNeptune);

scene.add(sun);

getDirectionalLights();

const texture = new THREE.TextureLoader().load( "textures/planetgalaxybackround.jpg" );
scene.background = texture ; 

update(renderer, scene, camera, controls);

