import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'


const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(5))

const light = new THREE.PointLight()
light.position.set(2.5, 7.5, 15)
scene.add(light)

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const deleteButton = document.getElementById('deletebutton');
deleteButton.addEventListener('click', removeAllObjects);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 100

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

let prevObjects = [];

const loadModelsBtn = document.querySelector('#load-models-btn');
loadModelsBtn.addEventListener('click', fetchFromDB);

const select = document.getElementById('model-select');
select.addEventListener('change', function() {
    const value = select.value;
    const loader = new OBJLoader();
    const mtlLoader = new MTLLoader()
    mtlLoader.load(
        `/models/${value}.mtl`,
        (materials) => {
            materials.preload()

            loader.setMaterials(materials);
            loader.load(
                `/models/${value}.obj`,
                (object) => {
                    if (prevObjects.length > 0) {
                        const prevObject = prevObjects[prevObjects.length - 1];
                        const currentBoundingBox = new THREE.Box3().setFromObject(object);
                        const size = currentBoundingBox.getSize(new THREE.Vector3()).length();
                        const prevSize = new THREE.Box3().setFromObject(prevObject).getSize(new THREE.Vector3()).length();
                        const distance = size + prevSize;
                        object.position.copy(prevObject.position.clone().add(new THREE.Vector3(distance, 0, 0)));
                    }
                    prevObjects.push(object);
                    scene.add(object);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
                },
            )
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        })})

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function removeObject(object) {
    scene.remove(object);
}

function removeAllObjects() {
    prevObjects.forEach(obj => {
        removeObject(obj);
    });
    prevObjects = [];
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

}

function fetchFromDB() {
    select.innerHTML = '';
    const option = document.createElement('option');
    select.appendChild(option);
    fetch('http://localhost:5000')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = model.name;
                select.appendChild(option);
            })
        })
        .catch(error => console.error('Ошибка:', error));
}

function render() {
    renderer.render(scene, camera)
}

animate()

const moveStep = 0.5; // шаг перемещения объекта

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowRight':
        case 'ArrowLeft':
            event.preventDefault();
            break;
        default:
            break;
    }
})

document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (prevObjects.length > 0) {
                prevObjects[prevObjects.length -1].position.y += moveStep;
            }
            break;
        case 'ArrowDown':
            if (prevObjects.length > 0) {
                prevObjects[prevObjects.length -1].position.y -= moveStep;
            }
            break;
        case 'ArrowRight':
            if (prevObjects.length > 0) {
                prevObjects[prevObjects.length -1].position.x += moveStep;
            }
            break;
        case 'ArrowLeft':
            if (prevObjects.length > 0) {
                prevObjects[prevObjects.length -1].position.x -= moveStep;
            }
            break;
    }
});