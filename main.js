let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.up.set(0, 0, 1)
let renderer = new THREE.WebGLRenderer({antialias: true});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x87CEEB);
document.getElementById("scene").appendChild(renderer.domElement);

let tLoader = new THREE.TextureLoader();
let samar = tLoader.load('Assets/player.jpg')

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enabled = false;
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: THREE.MOUSE.DOLLY,
    RIGHT: ''
}

let cubeGeo = new THREE.BoxGeometry(1, 1, 1);
let cubeMat = new THREE.MeshBasicMaterial({color: 0xffffff, map: samar});
let cube = new THREE.Mesh(cubeGeo, cubeMat);

cube.rotation.z = Math.PI / 2
scene.add(cube);

camera.position.set(1.91, 1.57, 1.4);
camera.rotation.set(-0.84, 0.73, 2.6);

let tl = new TimelineMax().delay(1);
tl.to(camera.position, 3, {x: 54, y: -33, z: 30});

setTimeout(function(){
    $('#home').fadeIn(1000);
}, 3000);

document.getElementById('play').addEventListener('click', function(){
    $('#black').fadeIn(1000);
    setTimeout(function(){
        document.getElementById('home').style.display = 'none';
        controls.enabled = true;

        camera.position.set(0.86, -16.4, 8.33)
        camera.rotation.set(1.1, 0.05, 0.02);
    }, 1000)
    $('#black').fadeOut(1000);
})

let light = new THREE.SpotLight(0xffffff, 3);
light.position.set(50, 0, 100);
scene.add(light);

let light2 = new THREE.SpotLight(0xffffff, 3);
light2.position.set(-50, 0, 100);
scene.add(light2);

let loader = new THREE.GLTFLoader();
loader.load('Assets/map.glb', function(gltf){
    gltf.scene.position.set(50, 0, -2.5);
    gltf.scene.rotation.x = Math.PI / 2;
    gltf.scene.scale.set(10, 10, 10);
    scene.add(gltf.scene);
})


let keyboard = {};
let player = {
    speed: 0.1
}

function player_movement() {
    if(controls.enabled == false) return
    if(keyboard[37]){ //left arrow key
        cube.rotation.z += Math.PI * 0.01;
    }

    if(keyboard[39]){ //right arrow key
        cube.rotation.z -= Math.PI * 0.01;
    }

    if(keyboard[87]){ //W key
        cube.position.x += Math.cos(cube.rotation.z) * player.speed;
        cube.position.y += Math.sin(cube.rotation.z) * player.speed;
        
        camera.position.x += Math.cos(cube.rotation.z) * player.speed;
        camera.position.y += Math.sin(cube.rotation.z) * player.speed;
    }

    if(keyboard[83]){ //S key
        cube.position.x -= Math.cos(cube.rotation.z) * player.speed;
        cube.position.y -= Math.sin(cube.rotation.z) * player.speed;

        camera.position.x -= Math.cos(cube.rotation.z) * player.speed;
        camera.position.y -= Math.sin(cube.rotation.z) * player.speed;
    }

    controls.target.copy(cube.position);
}

function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    controls.update();

    player_movement();
}

function keyDown(e) {
    keyboard[e.keyCode] = true;
}

function keyUp(e) {
    keyboard[e.keyCode] = false;
}

window.addEventListener('keydown', keyDown)
window.addEventListener('keyup', keyUp)

render();