console.log('🎬 main.js v13.0 - 테스트');

let threeInitialized = false;

window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        const openingScene = document.getElementById('opening-scene');
        if (loadingScreen) loadingScreen.style.display = 'none';
        if (openingScene) {
            openingScene.classList.remove('hidden');
            openingScene.style.display = 'flex';
        }
    }, 1000);

    const enterBtn = document.getElementById('enter-btn');
    if (enterBtn) {
        enterBtn.addEventListener('click', function() {
            const openingScene = document.getElementById('opening-scene');
            const exhibitionSpace = document.getElementById('exhibition-space');
            if (openingScene) openingScene.style.display = 'none';
            if (exhibitionSpace) {
                exhibitionSpace.classList.remove('hidden');
                exhibitionSpace.style.display = 'block';
                exhibitionSpace.style.position = 'fixed';
                exhibitionSpace.style.top = '0';
                exhibitionSpace.style.left = '0';
                exhibitionSpace.style.width = '100vw';
                exhibitionSpace.style.height = '100vh';
                exhibitionSpace.style.zIndex = '9999';
            }
            setTimeout(initThreeJS, 100);
        }, { once: true });
    }
});

function initThreeJS() {
    if (threeInitialized) return;
    threeInitialized = true;
    console.log('🚀 Three.js v13.0');

    const container = document.getElementById('exhibition-space');
    if (!container) return;

    const scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x87CEEB); // 주석 처리
    scene.fog = new THREE.Fog(0x87CEEB, 10, 200);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 2, 0);

    const canvas = document.createElement('canvas');
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // 테스트: 빨간 하늘 구체
    const testSkyGeometry = new THREE.SphereGeometry(450, 60, 40);
    const testSkyMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        side: THREE.BackSide
    });
    const testSky = new THREE.Mesh(testSkyGeometry, testSkyMaterial);
    scene.add(testSky);
    console.log('🔴 빨간 하늘 테스트');

    // 바닥
    const groundLoader = new THREE.TextureLoader();
    groundLoader.load('/images/background/khuvsgul_lake.jpg', (groundTexture) => {
        const groundGeometry = new THREE.PlaneGeometry(300, 300);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            roughness: 0.3,
            metalness: 0.1
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        scene.add(ground);
    });

    const artworks = [];
    const artworkData = [];
    const radius = 8;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    for (let i = 0; i < 15; i++) {
        const angle = (i / 15) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const frameGroup = new THREE.Group();
        frameGroup.userData = { artworkIndex: i + 1 };

        const imgNum = String(i + 1).padStart(2, '0');
        const imagePath = `/images/artworks/artwork_${imgNum}.jpg`;
        artworkData[i] = imagePath;

        const loader = new THREE.TextureLoader();
        loader.load(imagePath, (texture) => {
            const imgGeometry = new THREE.PlaneGeometry(2.0, 1.3);
            const imgMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
            frameGroup.add(imgMesh);
        });

        frameGroup.position.set(x, 2, z);
        frameGroup.lookAt(0, 2, 0);
        scene.add(frameGroup);
        artworks.push(frameGroup);
    }

    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let cameraAngleH = 0;
    let cameraAngleV = 0.1;
    let cameraRadius = 10;

    function updateCameraPosition() {
        const y = Math.sin(cameraAngleV) * cameraRadius + 2;
        const horizontalRadius = Math.cos(cameraAngleV) * cameraRadius;
        const x = Math.sin(cameraAngleH) * horizontalRadius;
        const z = Math.cos(cameraAngleH) * horizontalRadius;
        camera.position.set(x, y, z);
        camera.lookAt(0, 2, 0);
        
        const minFOV = 15;
        const maxFOV = 75;
        const t = Math.max(0, Math.min(1, (cameraRadius - 0.5) / 29.5));
        camera.fov = minFOV + (maxFOV - minFOV) * t;
        camera.updateProjectionMatrix();
    }

    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        cameraAngleH += deltaX * 0.002;
        cameraAngleV += deltaY * 0.001;
        cameraAngleV = Math.max(0, Math.min(Math.PI / 4, cameraAngleV));
        updateCameraPosition();
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });

    canvas.addEventListener('mouseup', () => { isDragging = false; });

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        cameraRadius += e.deltaY * 0.005;
        if (cameraRadius < 0.5) cameraRadius = 0.5;
        if (cameraRadius > 30) cameraRadius = 30;
        updateCameraPosition();
    }, { passive: false });

    let lastClickTime = 0;
    canvas.addEventListener('click', (event) => {
        const currentTime = Date.now();
        const isDoubleClick = currentTime - lastClickTime < 300;
        lastClickTime = currentTime;
        if (isDragging) return;

        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(artworks, true);
        
        if (intersects.length > 0 && isDoubleClick) {
            const clicked = intersects[0].object.parent;
            const artworkIndex = clicked.userData.artworkIndex;
            const imagePath = artworkData[artworkIndex - 1];
            
            const popup = document.createElement('div');
            popup.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:10000;display:flex;align-items:center;justify-content:center;cursor:pointer;';
            const img = document.createElement('img');
            img.src = imagePath;
            img.style.cssText = 'max-width:90vw;max-height:90vh;object-fit:contain;';
            popup.appendChild(img);
            document.body.appendChild(popup);
            popup.onclick = () => document.body.removeChild(popup);
        }
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
    animate();

    console.log('✅ v13.0 완료');
}

console.log('✅ main.js v13.0');
