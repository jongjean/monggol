// 푸르공 3D 시스템
console.log('📄 furgon_system.js 로드');

let furgonModel = null;

function loadFurgon3D() {
    console.log('🚐 푸르공 생성 시작');
    
    // 더 큰 푸르공 박스 (기존 4.4 → 6m)
    const geometry = new THREE.BoxGeometry(6, 3, 3);
    const material = new THREE.MeshStandardMaterial({
        color: 0x2d5016,  // 진한 초록
        roughness: 0.8,
        metalness: 0.2,
        emissive: 0x1a3010,  // 약간 발광 효과
        emissiveIntensity: 0.3
    });
    
    const furgonBody = new THREE.Mesh(geometry, material);
    furgonBody.castShadow = true;
    furgonBody.receiveShadow = true;
    
    // Mesh에 userData 설정
    furgonBody.userData = {
        type: 'furgon',
        clickable: true,
        name: '푸르공 UAZ-452'
    };
    
    // 위치: 바닥에서 1.5m 위 (박스 높이의 절반)
    furgonBody.position.set(0, 1.5, 0);
    
    furgonModel = furgonBody;
    
    if (window.scene) {
        window.scene.add(furgonBody);
        console.log('✅ 푸르공 배치 완료!');
        console.log('   위치:', furgonBody.position);
        console.log('   크기:', geometry.parameters);
        console.log('   userData:', furgonBody.userData);
    } else {
        console.error('❌ scene이 없습니다!');
    }
}

// 푸르공 클릭 이벤트
function onFurgonClick() {
    console.log('🚐 푸르공 클릭됨!');
    alert(`🏔️ 홉스골 호수로 가는 14시간 극한 여정

이 UAZ-452 푸르공을 타고 
울란바토르에서 홉스골 호수까지 
비포장도로 780km를 14시간 동안 달렸습니다.

🚐 차는 흔들리고
💨 먼지는 날리고  
⛰️ 산은 끝없이 이어지고

하지만 도착한 그곳은
지구상 가장 아름다운 호수였습니다.

- 2024년 여름, 몽골 -`);
}

// 전역 함수로 노출
window.loadFurgon3D = loadFurgon3D;
window.onFurgonClick = onFurgonClick;

// Three.js 준비 후 로드
function initFurgonSystem() {
    console.log('🚐 푸르공 시스템 초기화 시작...');
    
    const checkInterval = setInterval(() => {
        if (window.scene && window.camera && window.renderer) {
            console.log('✅ Three.js 준비 완료, 푸르공 로드');
            clearInterval(checkInterval);
            loadFurgon3D();
        }
    }, 100);
    
    setTimeout(() => {
        clearInterval(checkInterval);
        if (!furgonModel) {
            console.error('❌ Three.js 초기화 타임아웃');
        }
    }, 10000);
}

// 페이지 로드 시 자동 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFurgonSystem);
} else {
    initFurgonSystem();
}
