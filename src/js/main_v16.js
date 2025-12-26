// 전역 변수 v16
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
    // scene.background = new THREE.Color(0x87CEEB); // 주석 처리
    // scene.fog 제거 - 하늘 보이도록

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 1000);
    camera.position.set(0, 3, 10);
    camera.lookAt(0, 2, 0);

    const canvas = document.createElement('canvas');
    canvas.style.touchAction = 'none';
    canvas.style.userSelect = 'none';
    canvas.style.webkitUserSelect = 'none';
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
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
    // 하늘 구체 (khuvsgul_sky_only.jpg?v=1766679064)
    const skyGeometry = new THREE.SphereGeometry(450, 60, 40);
    const skyLoader = new THREE.TextureLoader();
    skyLoader.load('images/background/khuvsgul_sky_only.jpg?v=1766679064', (skyTexture) => {
        const skyMaterial = new THREE.MeshBasicMaterial({
            map: skyTexture,
            side: THREE.BackSide
        });
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        scene.add(sky);
        console.log('🌅 하늘 텍스처 로드 완료');
    });

    // 바닥
    const groundLoader = new THREE.TextureLoader();
    groundLoader.load('images/background/khuvsgul_lake.jpg', (groundTexture) => {
        const groundGeometry = new THREE.CircleGeometry(150, 64);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            map: groundTexture,
            roughness: 0.3,
            metalness: 0.1,
            transparent: true,
            opacity: 0.85
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = 0;
        scene.add(ground);
    });

    // 작품 배치 (32개)
    const artworks = [];
    const artworkData = [];
    const radius = 25; // 간격 넓게
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const frameGroup = new THREE.Group();
        frameGroup.userData = { artworkIndex: i + 1 };

        const imgNum = String(i + 1).padStart(3, '0');
        const imagePath = `images/artworks/${imgNum}.jpg`;
        artworkData[i] = imagePath;

        const loader = new THREE.TextureLoader();
        loader.load(imagePath, (texture) => {
            const imgGeometry = new THREE.PlaneGeometry(3.0, 2.0);
            const imgMaterial = new THREE.MeshBasicMaterial({ map: texture });
            const imgMesh = new THREE.Mesh(imgGeometry, imgMaterial);
            frameGroup.add(imgMesh);
        });

        frameGroup.position.set(x, 2.5, z);
        frameGroup.lookAt(0, 2.5, 0);
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

    // 터치 컨트롤 (스마트폰)
    let initialPinchDistance = 0;

    canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
            isDragging = true;
            previousMouseX = e.touches[0].clientX;
            previousMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            initialPinchDistance = Math.sqrt(dx * dx + dy * dy);
        }
    });

    canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            const deltaX = e.touches[0].clientX - previousMouseX;
            const deltaY = e.touches[0].clientY - previousMouseY;
            cameraAngleH += deltaX * 0.002;
            cameraAngleV += deltaY * 0.001;
            cameraAngleV = Math.max(0, Math.min(Math.PI / 4, cameraAngleV));
            updateCameraPosition();
            previousMouseX = e.touches[0].clientX;
            previousMouseY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const delta = (initialPinchDistance - distance) * 0.05;
            cameraRadius += delta;
            if (cameraRadius < 0.5) cameraRadius = 0.5;
            if (cameraRadius > 30) cameraRadius = 30;
            updateCameraPosition();
            initialPinchDistance = distance;
        }
    }, { passive: false });

    canvas.addEventListener('touchend', () => {
        isDragging = false;
    });
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
    window.scene = scene;
    window.camera = camera;
    window.renderer = renderer;

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

// ============================================
// AI 도슨트 시스템
// ============================================

// 전역 변수
let currentAudio = null;

// 작품 데이터
const artworkData = {
    '012': {
        title: '한 때 한 곳을 스쳐간 사계',
        description: '검푸르게 화창하던 하늘에서 산을 하나 넘어서자 갑자기 눈보라가 휘몰아쳤다...',
        audio: 'audio/docent_012.mp3'
    }
};

// 팝업 HTML 생성
function createPopup() {
    const popupHTML = `
        <div id="artworkPopup" class="popup-overlay">
            <div class="popup-container">
                <button class="popup-close" onclick="closePopup()">×</button>
                <img id="popupImage" class="popup-artwork-image" src="" alt="작품">
                <h2 id="popupTitle" class="popup-artwork-title"></h2>
                
                <div class="docent-section">
                    <img src="images/guide_on_horse.png" class="guide-avatar" alt="AI 가이드">
                    <button id="playDocentBtn" class="play-docent-btn">
                        🎤 AI 강종진 사진가 얘기 듣기
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

// 팝업 열기
function showArtworkPopup(artworkId) {
    const popup = document.getElementById('artworkPopup');
    const image = document.getElementById('popupImage');
    const title = document.getElementById('popupTitle');
    const playBtn = document.getElementById('playDocentBtn');
    
    const artwork = artworkData[artworkId];
    
    if (!artwork) {
        console.warn('작품 데이터 없음:', artworkId);
        return;
    }
    
    image.src = `images/artworks/${artworkId}.jpg`;
    title.textContent = artwork.title;
    
    playBtn.onclick = () => playDocent(artworkId);
    
    popup.classList.add('active');
}

// 팝업 닫기
function closePopup() {
    const popup = document.getElementById('artworkPopup');
    popup.classList.remove('active');
    
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    
    const playBtn = document.getElementById('playDocentBtn');
    playBtn.classList.remove('playing');
    playBtn.textContent = '🎤 AI 강종진 사진가 얘기 듣기';
}

// 도슨트 재생
function playDocent(artworkId) {
    const artwork = artworkData[artworkId];
    const playBtn = document.getElementById('playDocentBtn');
    
    if (!artwork || !artwork.audio) {
        console.warn('오디오 파일 없음:', artworkId);
        return;
    }
    
    if (currentAudio) {
        currentAudio.pause();
    }
    
    currentAudio = new Audio(artwork.audio);
    
    currentAudio.onplay = () => {
        playBtn.classList.add('playing');
        playBtn.textContent = '🔊 재생 중...';
    };
    
    currentAudio.onended = () => {
        playBtn.classList.remove('playing');
        playBtn.textContent = '🎤 AI 강종진 사진가 얘기 듣기';
        currentAudio = null;
    };
    
    currentAudio.onerror = () => {
        console.error('오디오 로드 실패:', artwork.audio);
        playBtn.textContent = '❌ 재생 실패';
        setTimeout(() => {
            playBtn.textContent = '🎤 AI 강종진 사진가 얘기 듣기';
        }, 2000);
    };
    
    currentAudio.play().catch(err => {
        console.error('오디오 재생 실패:', err);
    });
}

// 초기화
window.addEventListener('DOMContentLoaded', () => {
    createPopup();
    console.log('✅ AI 도슨트 시스템 초기화 완료');
});


// ============================================
// 작품 더블클릭 이벤트 연결
// ============================================

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('dblclick', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        
        if (clickedObject.userData && clickedObject.userData.artworkId) {
            const artworkId = clickedObject.userData.artworkId;
            console.log('✅ 작품 더블클릭:', artworkId);
            showArtworkPopup(artworkId);
        }
    }
});

console.log('✅ 더블클릭 이벤트 리스너 등록 완료');

