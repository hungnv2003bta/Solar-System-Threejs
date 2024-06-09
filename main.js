import * as THREE from 'three';

import { OrbitControls } from '/controls/OrbitControls.js';

// SOLAR SYSTEM DATAS

const SUN = {
    name: 'Sun',
    radius: 696340,  // km
    distance: 0,  // km from itself
    orbitDuration: 0,  // N/A
    rotationDuration: 609.12,  // hours (25.38 Earth days)
    orbitInclination: 7.25,  // degrees to the plane of the Earth's orbit
    surfaceTemperature: 5505,  // Celsius
    num_satellites: 8  // number of recognized planets orbiting the Sun
};

const PLANETS = [
    {
        name: 'Mercury',
        radius: 2440,  // km
        distance: 57.9,  // million km from Sun
        orbitDuration: 88,  // Earth days
        rotationDuration: 1407.6,  // hours
        orbitInclination: 7,  // degrees
        surfaceTemperature: 430,  // Celsius
        num_satellites: 0
    },
    {
        name: 'Venus',
        radius: 6052,  // km
        distance: 108.2,  // million km from Sun
        orbitDuration: 225,  // Earth days
        rotationDuration: 5832.5,  // hours
        orbitInclination: 3.4,  // degrees
        surfaceTemperature: 470,  // Celsius
        num_satellites: 0
    },
    {
        name: 'Earth',
        radius: 6371,  // km
        distance: 149.6,  // million km from Sun
        orbitDuration: 365.25,  // days
        rotationDuration: 24,  // hours
        orbitInclination: 0,  // degrees
        surfaceTemperature: 20,  // Celsius
        num_satellites: 1
    },
    {
        name: 'Mars',
        radius: 3390,  // km
        distance: 227.9,  // million km from Sun
        orbitDuration: 687,  // Earth days
        rotationDuration: 24.6,  // hours
        orbitInclination: 1.85,  // degrees
        surfaceTemperature: -25,  // Celsius
        num_satellites: 2
    },
    {
        name: 'Jupiter',
        radius: 69911,  // km
        distance: 778.5,  // million km from Sun
        orbitDuration: 4333,  // Earth days (11.86 years)
        rotationDuration: 10,  // hours
        orbitInclination: 1.3,  // degrees
        surfaceTemperature: -150,  // Celsius
        num_satellites: 79
    },
    {
        name: 'Saturn',
        radius: 58232,  // km
        distance: 1400,  // million km from Sun
        orbitDuration: 10759,  // Earth days (29.45 years)
        rotationDuration: 10.7,  // hours
        orbitInclination: 2.48,  // degrees
        surfaceTemperature: -180,  // Celsius
        num_satellites: 83
    },
    {
        name: 'Uranus',
        radius: 25362,  // km
        distance: 2871,  // million km from Sun
        orbitDuration: 30688,  // Earth days (84 years)
        rotationDuration: 17.2,  // hours
        orbitInclination: 0.77,  // degrees
        surfaceTemperature: -210,  // Celsius
        num_satellites: 27
    },
    {
        name: 'Neptune',
        radius: 24622,  // km
        distance: 4495,  // million km from Sun
        orbitDuration: 60190,  // Earth days (164.8 years)
        rotationDuration: 16.1,  // hours
        orbitInclination: 1.77,  // degrees
        surfaceTemperature: -220,  // Celsius
        num_satellites: 14
    }
];

const MOON = {
        name: 'Moon',
        radius: 1737.4,  // km
        distance: 0.384,  // million km from Earth
        orbitDuration: 27.3,  // Earth days
        rotationDuration: 655.7,  // hours (27.3 Earth days)
        orbitInclination: 5.145,  // degrees to the plane of Earth's orbit
        axialTilt: 1.54,  // degrees
        surfaceTemperature: -180,  // Celsius
        num_satellites: 0
};

function setCamera(camera) {
    camera.position.set(0, 0, 300);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var scene = new THREE.Scene();
const texture = new THREE.TextureLoader().load("textures/planetgalaxybackround.jpg");
scene.background = texture;

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5 * Math.pow(10, 8));
setCamera(camera);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

function getDirectionalLights() {
    for (var i = 0; i < 4; i++) {
        var light = new THREE.DirectionalLight(0xffffff, 0.02);
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

function getTexture(src) {
    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(src);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

function createSun() {
    var texture = getTexture('/textures/sun.jpg');
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.NearestFilter;

    var geometry = new THREE.SphereGeometry(12, 64, 32);

    var material = new THREE.MeshBasicMaterial({
        map: texture
    });
    var sun = new THREE.Mesh(geometry, material);
    sun.position.set(0, 0, 0);
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
            bumpScale: bumpMap ? 0.5 : null,
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
    var radians = rotate * (Math.PI / 180);
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
    var radians = rotate * (Math.PI / 180);
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

// Update the displayDetails function to populate the modal
function displayDetails(data) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalRadius = document.getElementById('modal-radius');
    const modalDistance = document.getElementById('modal-distance');
    const modalOrbitDuration = document.getElementById('modal-orbit-duration');
    const modalRotationDuration = document.getElementById('modal-rotation-duration');
    const modalOrbitInclination = document.getElementById('modal-orbit-inclination');
    const modalSurfaceTemperature = document.getElementById('modal-surface-temperature');
    const modalSatellites = document.getElementById('modal-num_satellites');

    modalTitle.textContent = data.name;
    modalRadius.textContent = `Radius: ${data.radius} km`;
    modalDistance.textContent = `Distance from Sun: ${data.distance} million km`;
    modalOrbitDuration.textContent = `Orbit Duration: ${data.orbitDuration} days`;
    modalRotationDuration.textContent = `Rotation Duration: ${data.rotationDuration} days`;
    modalOrbitInclination.textContent = `Orbit Inclination: ${data.orbitInclination} degrees`;
    modalSurfaceTemperature.textContent = `Surface Temperature: ${data.surfaceTemperature} °C`;
    modalSatellites.textContent = `Satellites: ${data.num_satellites}`;

    modal.style.display = 'flex';

    document.getElementById('close-btn').onclick = () => {
        modal.style.display = 'none';
    };
}

function focusOnPlanet(planet) {
    const planetData = planet.userData;
    const offset = planet.radius * 2;

    const newPos = new THREE.Vector3().copy(planet.position).add(new THREE.Vector3(offset, offset, offset));

    new TWEEN.Tween(camera.position)
        .to(newPos, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(controls.target)
        .to(planet.position, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    displayDetails(planetData);

}

function focusOnSun() {
    const sunData = sun.userData;
    new TWEEN.Tween(camera.position)
        .to({ x: 20, y: 20, z: 20 }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    new TWEEN.Tween(controls.target)
        .to({ x: sun.position.x, y: sun.position.y, z: sun.position.z }, 2000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    camera.lookAt(sun.position);
    displayDetails(sunData);
}

var intensity = 1.5;
var speed = 1;
var sunLight;

// Update animations

function animation(orbit, planet) {
    const adjustedOrbitSpeed = 0.001 * (365.25 / planet.userData.orbitDuration) * speed;
    const adjustedRotateSpeed = 0.1 * (24 / planet.userData.rotationDuration) * speed;

    orbit.rotation.y += adjustedOrbitSpeed;
    planet.rotation.y += adjustedRotateSpeed;
}

function update(renderer, scene, camera, controls) {

    intensityControl.value = intensity.toFixed(1);

    speedControl.value = speed.toFixed(1);

    intensityValue.textContent = intensity.toFixed(1);

    speedValue.textContent = speed.toFixed(1);

    //animation here
    sun.rotation.y += 0.1 * (24 / sun.userData.rotationDuration) * speed;
    animation(orbitMercury, mercury);
    animation(orbitVenus, venus);
    animation(orbitEarth, earth);
    animation(orbitMoon, moon);
    animation(orbitMars, mars);
    animation(orbitJupiter, jupiter);
    animation(orbitSaturn, saturn);
    animation(orbitUranus, uranus)
    animation(orbitNeptune, neptune);
 
    renderer.render(scene, camera);
    controls.update();

    requestAnimationFrame(function () {
        TWEEN.update();
        update(renderer, scene, camera, controls);
    })
}

// create Speed Controller
const speedControl = document.createElement('input');
speedControl.type = 'range';
speedControl.min = '0.1';
speedControl.max = '3';
speedControl.step = '0.1';
speedControl.value = '1'; 
speedControl.addEventListener('input', function () {
    speed = parseFloat(this.value); 
});

const speedValue = document.createElement('span');
speedValue.textContent = speed.toFixed(1);

const speedControlPanel = document.createElement('div');
speedControlPanel.id = 'speedControlPanel';
speedControlPanel.appendChild(document.createTextNode('Tốc độ mô phỏng: '));
speedControlPanel.appendChild(speedControl);
speedControlPanel.appendChild(speedValue);

document.body.appendChild(speedControlPanel);

speedControlPanel.style.color = 'white'; 
speedControlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; 
speedControlPanel.style.padding = '10px'; 
speedControlPanel.style.borderRadius = '5px'; 
speedControlPanel.style.fontSize = '16px';
speedControlPanel.style.position = 'fixed'; 
speedControlPanel.style.bottom = '20px'; 
speedControlPanel.style.left = '20px';

// Create Sensity Controller
const intensityControl = document.createElement('input');
intensityControl.type = 'range';
intensityControl.min = '0';
intensityControl.max = '5';
intensityControl.step = '0.1';
intensityControl.value = '1.5'; 
intensityControl.addEventListener('input', function () {
    intensity = parseFloat(this.value); 
    sunLight.intensity = intensity;
});

const intensityValue = document.createElement('span');
intensityValue.textContent = intensity.toFixed(1);

const intensityControlPanel = document.createElement('div');
intensityControlPanel.id = 'intensityControlPanel';
intensityControlPanel.appendChild(document.createTextNode('Độ sáng: '));
intensityControlPanel.appendChild(intensityControl);
intensityControlPanel.appendChild(intensityValue);

document.body.appendChild(intensityControlPanel);

intensityControlPanel.style.color = 'white';
intensityControlPanel.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
intensityControlPanel.style.padding = '10px'; 
intensityControlPanel.style.borderRadius = '5px'; 
intensityControlPanel.style.fontSize = '16px'; 
intensityControlPanel.style.position = 'fixed'; 
intensityControlPanel.style.bottom = '80px'; 
intensityControlPanel.style.left = '20px';

//Create Solar System

//sun
sunLight = new THREE.PointLight(0xffffff, intensity, 100000, 0.05);
sunLight.castShadow = true;
var sun = createSun();
sun.userData = SUN;
sun.add(sunLight);

let planets = [];

//mercury
var mercury = createPlanet(0.75, "textures/mercury.jpg", "textures/mercury_topo.jpg", 35, 2);
var orbitMercury = createOrbit(35, 0xffff00, 2);
orbitMercury.add(mercury);
mercury.userData = PLANETS[0];
planets.push(mercury);

//venus
var venus = createPlanet(1.9, "textures/venus.jpg", "textures/venus_topo.jpg", 44, 177.3);
var orbitVenus = createOrbit(44, 0xffff00, 3.4);
orbitVenus.add(venus);
venus.userData = PLANETS[1];
planets.push(venus);

//earth and moon
var earth_object = new THREE.Object3D();
var earth = createPlanet(2, "textures/earth.jpg", "textures/earth_topo.jpg", 60, 23.5, "textures/earth_clouds.png");
earth.receiveShadow = true;
var orbitEarth = createOrbit(60, 0xffff00, 0);
earth_object.add(earth);

var moon = createPlanet(0.5, "textures/moon.jpg", "textures/moon_topo.jpg", 4, 1.5);
moon.userData = MOON;
moon.castShadow = true;
var orbitMoon = createOrbit(4, 0xffff00, 5.1);
orbitMoon.position.z += 60;
orbitMoon.add(moon);
earth_object.add(orbitMoon);

orbitEarth.add(earth_object);

earth.userData = PLANETS[2];
planets.push(earth);

//mars
var mars = createPlanet(1.1, "textures/mars.jpg", "textures/mars_topo.jpg", 90, 25.2);
var orbitMars = createOrbit(90, 0xffff00, 1.8);
orbitMars.add(mars);
mars.userData = PLANETS[3];
planets.push(mars);

//jupiter
var jupiter = createPlanet(6, "textures/jupiter.jpg", null, 200, 3.1);
var orbitJupiter = createOrbit(200, 0xffff00, 1.3);
orbitJupiter.add(jupiter);
jupiter.userData = PLANETS[4];
planets.push(jupiter)

//saturn
var saturn = createPlanet(5, "textures/saturn.jpg", null, 300, 26.7);
var saturnRing = createRing(saturn, "textures/rings_map.png", "textures/rings_color_map.png", 26.7);
saturn.add(saturnRing);
var orbitSaturn = createOrbit(300, 0xffff00, 2.5);
orbitSaturn.add(saturn);
saturn.userData = PLANETS[5];
planets.push(saturn);

//uranus
var uranus = createPlanet(2.5, "textures/uranus.jpg", null, 450, 97.8);
var orbitUranus = createOrbit(450, 0xffff00, 0.8);
orbitUranus.add(uranus);
uranus.userData = PLANETS[6];
planets.push(uranus);

//neptune
var neptune = createPlanet(2.5, "textures/neptune.jpg", null, 590, 29.6);
var orbitNeptune = createOrbit(590, 0xffff00, 1.7);
orbitNeptune.add(neptune);
neptune.userData = PLANETS[7];
planets.push(neptune);

var solar_system = new THREE.Object3D();

solar_system.position.set(0, 0, 0);

solar_system.add(sun);
solar_system.add(orbitMercury);
solar_system.add(orbitVenus);
solar_system.add(orbitEarth);
solar_system.add(orbitMars);
solar_system.add(orbitJupiter);
solar_system.add(orbitSaturn);
solar_system.add(orbitUranus);
solar_system.add(orbitNeptune);

scene.add(solar_system);

getDirectionalLights();

const planetList = document.getElementById('planet-list');

const sunItem = document.createElement('li');
sunItem.textContent = SUN.name;
sunItem.addEventListener('click', () => focusOnSun());
planetList.appendChild(sunItem);

planets.forEach((planet, index) => {
    const li = document.createElement('li');
    li.textContent = PLANETS[index].name;
    li.addEventListener('click', () => focusOnPlanet(planet));
    planetList.appendChild(li);
});

update(renderer, scene, camera, controls);


