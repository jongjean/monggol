console.log('🚀 scene.js v3.0 시작');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87CEEB);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('exhibition-space');
if (container) {
    container.appendChild(renderer.domElement);
    console.log('✅ 렌더러 추가 완료');
} else {
    console.error('❌ exhibition-space 없음!');
}
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);
const groundGeometry = new THREE.PlaneGeometry(50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0xD2B48C });
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);
console.log('📦 15개 액자 생성 시작');
const textureLoader = new THREE.TextureLoader();
const artworkMeshes = [];
const radius = 8;
const angleStep = (Math.PI * 1.5) / 14;
for (let i = 0; i < 15; i++) {
    const angle = -Math.PI * 0.75 + angleStep * i;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const frameGroup = new THREE.Group();
    const frameGeometry = new THREE.BoxGeometry(2.2, 1.5, 0.1);
    const frameMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.6, roughness: 0.4 });
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frameGroup.add(frame);
    const imgGeometry = new THREE.PlaneGeometry(2, 1.3);
    const imgMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
    const imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
    imgMesh.position.z = 0.06;
    const imgNum = String(i + 1).padStart(2, '0');
    const imagePath = '/images/artworks/artwork_' + imgNum + '.jpg';
    console.log('🖼️ [' + (i+1) + '/15] 로드 시작:', imagePath);
    textureLoader.load(imagePath, function(texture) {
        imgMesh.material.map = texture;
        imgMesh.material.color.set(0xFFFFFF);
        imgMesh.material.needsUpdate = true;
        console.log('✅ [' + (i+1) + '/15] 로드 성공');
    }, undefined, function(error) {
        console.error('❌ [' + (i+1) + '/15] 로드 실패');
        imgMesh.material.color.set(0xFF0000);
    });
    imgMesh.userData = { artworkId: i + 1 };
    frameGroup.add(imgMesh);
    frameGroup.position.set(x, 1.6, z);
    frameGroup.lookAt(0, 1.6, 0);
    scene.add(frameGroup);
    artworkMeshes.push(imgMesh);
}
console.log('✅ 15개 액자 배치 완료');
let isDragging = false;
let previousMouseX = 0;
let cameraRotationY = 0;
renderer.domElement.addEventListener('mousedown', function(e) {isDragging = true; previousMouseX = e.clientX;});
renderer.domElement.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        cameraRotationY += deltaX * 0.005;
        camera.position.x = Math.sin(cameraRotationY) * 5;
        camera.position.z = Math.cos(cameraRotationY) * 5;
        camera.lookAt(0, 1.6, 0);
        previousMouseX = e.clientX;
    }
});
renderer.domElement.addEventListener('mouseup', function() {isDragging = false;});
renderer.domElement.addEventListener('click', function(e) {
    if (isDragging) return;
    const mouse = new THREE.Vector2();
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(artworkMeshes);
    if (intersects.length > 0) {
        const artworkId = intersects[0].object.userData.artworkId;
        console.log('🖱️ 작품 클릭:', artworkId);
        if (typeof window.showArtworkPopup === 'function') window.showArtworkPopup(artworkId);
    }
});
function animate() {requestAnimationFrame(animate); renderer.render(scene, camera);}
animate();
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
console.log('✅ Three.js 초기화 완료 - v3.0');
