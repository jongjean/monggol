// 전역 변수
let scene, camera, renderer;



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

    scene = new THREE.Scene();
    // scene.fog 제거 - 하늘 이미지 보이도록
    // scene.background = new THREE.Color(0x87CEEB); // 주석 처리
    // scene.fog 제거 - 하늘 이미지 보이도록

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 2, 0);

    const canvas = document.createElement('canvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    
    // 전역 접근을 위해 window에 노출
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;
    
    // 전역 접근을 위해 window에 노출
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    scene.add(directionalLight);

    // 테스트: 빨간 하늘 구체
    // 하늘 구체 (상단만 + 가장자리 블러)
    const skyGeometry = new THREE.SphereGeometry(450, 60, 40);
    const skyLoader = new THREE.TextureLoader();
    skyLoader.load('/images/background/khuvsgul_lake.jpg', (texture) => {
        const img = texture.image;
        const skyCanvas = document.createElement('canvas');
        skyCanvas.width = 2048;
        skyCanvas.height = 1024;
        const ctx = skyCanvas.getContext('2d');
        
        // 이미지 상단 40%만 사용 (하늘 부분만)
        ctx.drawImage(img, 0, 0, img.width, img.height * 0.4, 0, 0, 2048, 1024);
        
        // 좌우 가장자리 블러 (그라데이션)
        const gradient = ctx.createLinearGradient(0, 0, 2048, 0);
        gradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
        gradient.addColorStop(0.1, 'rgba(135, 206, 235, 0)');
        gradient.addColorStop(0.9, 'rgba(135, 206, 235, 0)');
        gradient.addColorStop(1, 'rgba(135, 206, 235, 0.8)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 2048, 1024);
        
        const skyTexture = new THREE.CanvasTexture(skyCanvas);
        const skyMaterial = new THREE.MeshBasicMaterial({
            map: skyTexture,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(sky);
        console.log('🌅 하늘 텍스처 로드 완료 (상단만+블러)');
    }, undefined, (error) => {
        console.error('❌ 하늘 텍스처 로드 실패:', error);
    });
    const groundLoader = new THREE.TextureLoader();
    groundLoader.load('/images/background/khuvsgul_lake.jpg', (groundTexture) => {
        const groundGeometry = new THREE.CircleGeometry(150, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            roughness: 0.3,
            metalness: 0.1
        });
        groundMaterial.transparent = true;
        groundMaterial.opacity = 0.9;
        groundMaterial.transparent = true;
        groundMaterial.opacity = 0.9;
        groundMaterial.transparent = true;
        groundMaterial.opacity = 0.9;
        // 가장자리 페이드 아웃을 위한 쉐이더
        groundMaterial.transparent = true;
        groundMaterial.alphaTest = 0.1;
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
    // 바닥 (원형 + 그라데이션)
    const groundLoader = new THREE.TextureLoader();
    groundLoader.load('/images/background/khuvsgul_lake.jpg', (groundTexture) => {
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

console.log('🔄 v14.0 Cache: 1766671665');

console.log('🔄 v14.0 Cache: 1766671688');
