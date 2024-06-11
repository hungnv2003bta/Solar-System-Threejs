import * as THREE from 'three';

import { OrbitControls } from '/controls/OrbitControls.js';

// SOLAR SYSTEM DATAS

const SUN = {
    name: 'Mặt Trời',
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
        name: 'Sao Thuỷ',
        radius: 2440,  // km
        distance: 57.9,  // million km from Sun
        orbitDuration: 88,  // Earth days
        rotationDuration: 1407.6,  // hours
        orbitInclination: 7,  // degrees
        surfaceTemperature: 430,  // Celsius
        num_satellites: 0,
        sound: '/sounds/Mercury.mp3'
    },
    {
        name: 'Sao Kim',
        radius: 6052,  // km
        distance: 108.2,  // million km from Sun
        orbitDuration: 225,  // Earth days
        rotationDuration: 5832.5,  // hours
        orbitInclination: 3.4,  // degrees
        surfaceTemperature: 470,  // Celsius
        num_satellites: 0,
        sound: '/sounds/Venus.mp3'
    },
    {
        name: 'Trái Đất',
        radius: 6371,  // km
        distance: 149.6,  // million km from Sun
        orbitDuration: 365.25,  // days
        rotationDuration: 24,  // hours
        orbitInclination: 0,  // degrees
        surfaceTemperature: 20,  // Celsius
        num_satellites: 1,
        sound: '/sounds/Earth.mp3'
    },
    {
        name: 'Sao Hoả',
        radius: 3390,  // km
        distance: 227.9,  // million km from Sun
        orbitDuration: 687,  // Earth days
        rotationDuration: 24.6,  // hours
        orbitInclination: 1.85,  // degrees
        surfaceTemperature: -25,  // Celsius
        num_satellites: 2,
        sound: '/sounds/Mars.mp3'
    },
    {
        name: 'Sao Mộc',
        radius: 69911,  // km
        distance: 778.5,  // million km from Sun
        orbitDuration: 4333,  // Earth days (11.86 years)
        rotationDuration: 10,  // hours
        orbitInclination: 1.3,  // degrees
        surfaceTemperature: -150,  // Celsius
        num_satellites: 79,
        sound: '/sounds/Jupiter.mp3'
    },
    {
        name: 'Sao Thổ',
        radius: 58232,  // km
        distance: 1400,  // million km from Sun
        orbitDuration: 10759,  // Earth days (29.45 years)
        rotationDuration: 10.7,  // hours
        orbitInclination: 2.48,  // degrees
        surfaceTemperature: -180,  // Celsius
        num_satellites: 83,
        sound: '/sounds/Saturn.mp3'
    },
    {
        name: 'Sao Thiên Vương',
        radius: 25362,  // km
        distance: 2871,  // million km from Sun
        orbitDuration: 30688,  // Earth days (84 years)
        rotationDuration: 17.2,  // hours
        orbitInclination: 0.77,  // degrees
        surfaceTemperature: -210,  // Celsius
        num_satellites: 27,
        sound: '/sounds/Uranus.mp3'
    },
    {
        name: 'Sao Hải Vương',
        radius: 24622,  // km
        distance: 4495,  // million km from Sun
        orbitDuration: 60190,  // Earth days (164.8 years)
        rotationDuration: 16.1,  // hours
        orbitInclination: 1.77,  // degrees
        surfaceTemperature: -220,  // Celsius
        num_satellites: 14,
        sound: '/sounds/Neptune.mp3'
    }
];

const MOON = {
    name: 'Mặt Trăng',
    radius: 1737.4,  // km
    distance: 0.384,  // million km from Earth
    orbitDuration: 27.3,  // Earth days
    rotationDuration: 655.7,  // hours (27.3 Earth days)
    orbitInclination: 5.145,  // degrees to the plane of Earth's orbit
    axialTilt: 1.54,  // degrees
    surfaceTemperature: -180,  // Celsius
    num_satellites: 0,
    sound: '/sounds/Moon.mp3'
};

function setCamera(camera) {
    camera.position.set(0, 400, 250);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
}

var scene = new THREE.Scene();
const texture = new THREE.TextureLoader().load("textures/planetgalaxybackround.jpg");
scene.background = texture;

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5 * Math.pow(10, 8));
setCamera(camera);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);

var controls = new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);

//FUNCTIONS

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
    if (src_base == "textures/moon.jpg") {
        mesh.receiveShadow = true;
    }
    return mesh;
}

function createPlanet(radius, src_base, src_topo, distanceFromParent, rotate, cloud = null) {
    var planet = new THREE.Mesh(new THREE.SphereGeometry(radius - 0.1, 32, 32));
    if (src_base == "textures/earth.jpg") {
        planet.castShadow = true;
    }
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
    var thetaSegments = 80;
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
    // Tính toán số lượng điểm để tạo ra quỹ đạo
    var resolution = distanceFromParent + 15 * 50;  
    // Độ dài mỗi đoạn tính bằng độ, chia thành niều đoạn nhỏ.
    var length = 360 / resolution;
    for (let i = 0; i <= resolution; i++) {
        //Tính toán góc của mỗi đoạn theo radian
        var segment = (i * length) * Math.PI / 180;
        // hêm điểm mới vào mảng points với các tọa độ x, y, z. Ở đây, y luôn bằng 0 vì quỹ đạo nằm trên mặt phẳng xz.
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
    modalRadius.textContent = `Bán kính: ${data.radius} km`;
    modalDistance.textContent = `Khoảng cách từ Mặt Trời: ${data.distance} triệu km`;
    modalOrbitDuration.textContent = `Thời gian quỹ đạo: ${data.orbitDuration} ngày`;
    modalRotationDuration.textContent = `Thời gian quay quanh trục: ${data.rotationDuration} ngày`;
    modalOrbitInclination.textContent = `Độ nghiêng quỹ đạo so với Trái Đất: ${data.orbitInclination} độ`;
    modalSurfaceTemperature.textContent = `Nhiệt độ bề mặt: ${data.surfaceTemperature} °C`;
    modalSatellites.textContent = `Số vệ tinh: ${data.num_satellites}`;

    modal.style.display = 'flex';

    document.getElementById('close-btn').onclick = () => {
        modal.style.display = 'none';
    };
}

function showDataPlanet(planet) {
    const planetData = planet.userData;
    displayDetails(planetData);
    unfocus();
    playFocusSound(planet.userData.sound);
}

let focusedPlanet = null;
let focusAudio = null;

function unfocus() {
    if (focusAudio) {
        focusAudio.pause(); // Stop the audio
        focusAudio.currentTime = 0; // Reset the audio to the start
        focusAudio = null; // Clear the audio object
    }
}

function playFocusSound(sound) {
    // Check if focusAudio exists and stop it properly
    if (focusAudio) {
        focusAudio.pause();
        focusAudio.currentTime = 0;
    }

    // Create a new Audio object and assign it to focusAudio
    focusAudio = new Audio(sound);

    // Ensure the previous audio is fully stopped before starting a new one
    focusAudio.addEventListener('canplaythrough', () => {
        focusAudio.loop = true; // Set to loop
        focusAudio.play().catch((error) => {
            console.error('Audio playback failed:', error);
        });
    });

    // Error handling for playback issues
    focusAudio.addEventListener('error', (event) => {
        console.error('Error playing audio:', event);
    });

    console.log('Playing sound for:', sound);
}

function focusOnPlanet(planet) {

    focusedPlanet = planet;
    //Tính Toán Khoảng Cách Camera
    const offset = planet.radius * 2;

    //Lấy Vị Trí Toàn Cầu của Hành Tinh
    const worldPosition = new THREE.Vector3();
    planet.getWorldPosition(worldPosition);

    //Tính Toán Vị Trí Mới của Camera
    const newPos = new THREE.Vector3().copy(worldPosition).add(new THREE.Vector3(-offset, offset, -offset));

    //Tạo Một Tween để Di Chuyển Camera đến Vị Trí Mới
    new TWEEN.Tween(camera.position)
        .to(newPos, 0)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    // Tạo Một Tween để Di Chuyển Target đến Vị Trí Mới
    new TWEEN.Tween(controls.target)
        .to(worldPosition, 0)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();

    camera.lookAt(worldPosition);
}

function focusOnSun() {
    unfocus();
    playFocusSound('./sounds/Sun.mp3');

    focusedPlanet = sun;
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

function viewSolar() {   
    unfocus();

    focusedPlanet = null 
    new TWEEN.Tween(camera.position)
        .to({ x: 0, y: 400, z: 250 }, 4000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    
    new TWEEN.Tween(controls.target)
        .to({x: 0, y: 0, z: 0}, 4000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start();
    
    camera.lookAt(sun.position);
    }

function highlightOrbit() {
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xFF0000 }),   // Màu đỏ
        new THREE.MeshBasicMaterial({ color: 0xFFA500 }),   // Màu cam
        new THREE.MeshBasicMaterial({ color: 0xFFFF00 }),   // Màu vàng
        new THREE.MeshBasicMaterial({ color: 0x008000 }),   // Màu xanh lá cây
        new THREE.MeshBasicMaterial({ color: 0x0000FF }),   // Màu xanh dương
        new THREE.MeshBasicMaterial({ color: 0x800080 }),   // Màu chàm
        new THREE.MeshBasicMaterial({ color: 0xFFC0CB }),   // Màu hồng
        new THREE.MeshBasicMaterial({ color: 0x00FFFF }),   // Màu xanh da trời
        new THREE.MeshBasicMaterial({ color: 0x800080 })    // Màu tím (Lặp lại màu chàm)
    ];
    orbitMercury.material = materials[0];
    orbitVenus.material = materials[1];
    orbitEarth.material = materials[2];
    orbitMoon.material = materials[3];
    orbitMars.material = materials[4];
    orbitJupiter.material = materials[5];
    orbitSaturn.material = materials[6];
    orbitUranus.material = materials[7];
    orbitNeptune.material = materials[8];
}

function dehighlightOrbit() { 
    const grayMaterial = new THREE.LineBasicMaterial({ color: 0x808080 }); // Màu xám

    orbitMercury.material = grayMaterial;
    orbitVenus.material = grayMaterial;
    orbitEarth.material = grayMaterial;
    orbitMoon.material = grayMaterial;
    orbitMars.material = grayMaterial;
    orbitJupiter.material = grayMaterial;
    orbitSaturn.material = grayMaterial;
    orbitUranus.material = grayMaterial;
    orbitNeptune.material = grayMaterial;
}

var intensity = 1.5;
var speed = 1;
var sunLight;

//moving the planets around the sun on their orbits.
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

    switch (focusedPlanet) {
        case mercury:
            focusOnPlanet(mercury);
            break;
        case venus:
            focusOnPlanet(venus);
            break;
        case earth:
            focusOnPlanet(earth);
            break;
        case mars:
            focusOnPlanet(mars);
            break;
        case jupiter:
            focusOnPlanet(jupiter);
            break;
        case saturn:
            focusOnPlanet(saturn);
            break;
        case neptune:
            focusOnPlanet(neptune);
            break;
        case uranus:
            focusOnPlanet(uranus);
            break;
        case moon:
            focusOnPlanet(moon);
            break;
        default:
            break;
    }

    renderer.render(scene, camera);
    controls.update();
    TWEEN.update();

    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    })
}

// create Speed Controller
const speedControl = document.createElement('input');
speedControl.type = 'range';
speedControl.min = '0';
speedControl.max = '5';
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
var orbitMercury = createOrbit(35, 0x808080, 2);
orbitMercury.add(mercury);
mercury.userData = PLANETS[0];
planets.push(mercury);

//venus
var venus = createPlanet(1.9, "textures/venus.jpg", "textures/venus_topo.jpg", 44, 177.3);
var orbitVenus = createOrbit(44, 0x808080, 3.4);
orbitVenus.add(venus);
venus.userData = PLANETS[1];
planets.push(venus);

//earth and moon
var earth_object = new THREE.Object3D();
var earth = createPlanet(2, "textures/earth.jpg", "textures/earth_topo.jpg", 60, 23.5, "textures/earth_clouds.png");
earth.receiveShadow = true;
var orbitEarth = createOrbit(60, 0x808080, 0);
earth_object.add(earth);

var moon = createPlanet(0.5, "textures/moon.jpg", "textures/moon_topo.jpg", 4, 1.5);
moon.userData = MOON;
moon.castShadow = true;
var orbitMoon = createOrbit(4, 0x808080, 5.1);
orbitMoon.position.z += 60;
orbitMoon.add(moon);
earth_object.add(orbitMoon);

orbitEarth.add(earth_object);

earth.userData = PLANETS[2];
planets.push(earth);

//mars
var mars = createPlanet(1.1, "textures/mars.jpg", "textures/mars_topo.jpg", 90, 25.2);
var orbitMars = createOrbit(90, 0x808080, 1.8);
orbitMars.add(mars);
mars.userData = PLANETS[3];
planets.push(mars);

//jupiter
var jupiter = createPlanet(6, "textures/jupiter.jpg", null, 200, 3.1);
var orbitJupiter = createOrbit(200, 0x808080, 1.3);
orbitJupiter.add(jupiter);
jupiter.userData = PLANETS[4];
planets.push(jupiter)

//saturn
var saturn = createPlanet(5, "textures/saturn.jpg", null, 300, 26.7);
var saturnRing = createRing(saturn, "textures/rings_map.png", "textures/rings_color_map.png", 26.7);
saturn.add(saturnRing);
var orbitSaturn = createOrbit(300, 0x808080, 2.5);
orbitSaturn.add(saturn);
saturn.userData = PLANETS[5];
planets.push(saturn);

//uranus
var uranus = createPlanet(2.5, "textures/uranus.jpg", null, 450, 97.8);
var orbitUranus = createOrbit(450, 0x808080, 0.8);
orbitUranus.add(uranus);
uranus.userData = PLANETS[6];
planets.push(uranus);

//neptune
var neptune = createPlanet(2.5, "textures/neptune.jpg", null, 590, 29.6);
var orbitNeptune = createOrbit(590, 0x808080, 1.7);
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.07);
scene.add(ambientLight);

scene.add(solar_system);


const planetList = document.getElementById('planet-list');

const sunItem = document.createElement('li');
sunItem.textContent = SUN.name;
sunItem.addEventListener('click', () => focusOnSun());
planetList.appendChild(sunItem);

planets.forEach((planet, index) => {
    const li = document.createElement('li');
    li.textContent = PLANETS[index].name;
    li.addEventListener('click', () => { showDataPlanet(planet), focusOnPlanet(planet) });
    planetList.appendChild(li);
});

const moonItem = document.createElement('li');
moonItem.textContent = MOON.name;
moonItem.addEventListener('click', () => { showDataPlanet(moon), focusOnPlanet(moon) });
planetList.appendChild(moonItem);

const checkbox = document.getElementById('Checkbox');

checkbox.addEventListener('change', function() {
    if (this.checked) {
        highlightOrbit(); 
    } else {
        dehighlightOrbit(); 
    }
});

const view = document.getElementById('view-solar');
view.addEventListener('click', () => viewSolar());

update(renderer, scene, camera, controls);


