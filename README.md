# 🐴 Mongolia Gallery - AI Docent

몽골 사진 전시관 with AI 도슨트 가이드

## 🌐 접속 주소
- 외부: https://uconai.ddns.net/monggol/
- 내부: http://172.30.1.150/monggol/
- Docker: http://172.30.1.150:8080/

## 📂 구조
- /src/ - 개발 소스
- /build.sh - 배포 스크립트

## 🚀 배포
./build.sh

## 🎨 작품
- 총 32점의 몽골 사진 작품
- Three.js 기반 3D 갤러리

# 🏔️ Beyond the Endless Horizon
## 몽골 대자연 메타버스 사진전 | Mongolian Nature Photography Metaverse Exhibition

![Version](https://img.shields.io/badge/version-0.7-blue.svg)
![Three.js](https://img.shields.io/badge/Three.js-r130-green.svg)
![License](https://img.shields.io/badge/license-MIT-orange.svg)

---

## 📖 프로젝트 소개

**Beyond the Endless Horizon**는 몽골의 광활한 대자연을 3D 메타버스로 구현한 인터랙티브 사진 전시관입니다. 

2005년 2월, 극한의 추위 속에서 촬영된 몽골의 절경들을 Three.js 기반의 몰입형 갤러리로 재탄생시켰으며, 관람객은 가상공간을 자유롭게 탐험하며 작품을 감상하고 AI 도슨트의 설명을 들을 수 있습니다.

특히 **UAZ-452 푸르공(소련제 밴)**이 전시관 안에 배치되어 있어, 실제 몽골 여행에서 사용했던 이동수단과 홉스골 호수의 극한 여정 이야기를 직접 경험할 수 있습니다.

---

## 🌐 접속 주소

- **외부**: https://uconai.ddns.net/monggol/
- **내부**: http://172.30.1.150/monggol/
- **Docker**: http://172.30.1.150:8080/

---

## ✨ v0.7 주요 기능

### 🎨 전시 작품 (5개)

| 작품 ID | 제목 | 위치 | 특징 |
|---------|------|------|------|
| 012 | 홉스골 호수 | 중앙 | 영하 30도 얼음 호수 |
| 005 | 고비 사막 | 좌측 | 끝없는 모래 지평선 |
| 009 | 테를지 국립공원 | 우측 | 기암괴석과 초원 |
| 025 | 차강 호수 | 하단 | 에메랄드빛 호수 |
| 019 | 알타이 산맥 | 상단 | 만년설의 장엄함 |

### 🚐 푸르공 (UAZ-452) 인터랙션

- **3D 모델**: 실제 소련제 UAZ-452 푸르공 재현
- **더블클릭 상호작용**: 홉스골 호수 극한 여정 스토리 표시
- **위치**: 전시관 중앙 (0, 1.5, 0)
- **극한 여정 스토리**:
❄️ 얼어붙은 홉스골 호수 위의 극한 여정

이 UAZ-452 푸르공을 타고 영하 30도에 꽁꽁 얼어붙은 홉스골 호수 위를 14시간 동안 목숨 걸고 달렸습니다.

🧊 얼음은 쩡쩡 떵떵 괴성을 지르고 💨 여기저기 크레바스가 수심 200미터의 협곡을 보여주고 🚐 차는 미끄러지지만 속도를 늦출 수 없고 그러다 만일 빠지면 익사, 나와도 동사하는 절체절명의 시간들...

차탄족 사람들을 만나기 위해 두려움을 넘어 달려갔습니다.

호수 위의 얼음길, 그 위를 달리는 14시간의 모험.

2005년 2월, 몽골 홉스골 -

### 🤖 AI 도슨트 시스템

- ✅ **작품 설명**: 각 작품마다 상세한 배경 스토리
- ✅ **음성 지원**: 오디오 도슨트 재생 기능
- ✅ **더블클릭 인터페이스**: 작품 더블클릭으로 팝업 열기
- ✅ **반응형 UI**: 모바일/데스크톱 모두 지원

### 🎮 사용자 인터랙션

- **1인칭 탐험**: WASD 또는 화살표 키로 이동
- **마우스 드래그**: 시야 회전
- **더블클릭**: 작품/푸르공 상호작용
- **스크롤**: 줌 인/아웃

---

## 🏗️ 기술 스택

### Frontend
- **Three.js r130**: 3D 렌더링 엔진
- **GLTFLoader**: 3D 모델 로딩 (GLTF 2.0)
- **Vanilla JavaScript**: 순수 자바스크립트
- **HTML5 Canvas**: 렌더링 타겟

### 3D Assets
- **푸르공 모델**: `models/furgon.glb`
- **갤러리 구조**: Three.js Geometry
- **텍스처**: 고해상도 사진 이미지

### Deployment
- **Nginx**: 웹 서버
- **Docker**: 컨테이너화 (`mongolia-gallery`)
- **로컬 개발**: `~/monggol/`
- **프로덕션**: `/var/www/monggol/` → Docker

---

## 📂 프로젝트 구조

monggol/ ├── index.html # 메인 HTML ├── README.md # 프로젝트 문서 ├── build.sh # 배포 스크립트 │ ├── js/ │ ├── main_v16.js # 메인 로직 │ │ ├── initThreeJS() # Three.js 초기화 │ │ ├── initFurgonSystem() # 푸르공 시스템 │ │ ├── openDocentPopup() # 도슨트 팝업 │ │ └── 더블클릭 핸들러 # 레이캐스터 기반 상호작용 │ │ │ ├── GLTFLoader.js # GLTF 로더 │ └── three.min.js # Three.js 라이브러리 │ ├── models/ │ └── furgon.glb # 푸르공 3D 모델 │ ├── images/ # 작품 이미지 └── audio/ # 도슨트 오디오


---

## 🚀 설치 및 실행

### 로컬 개발

```bash
# 1. 저장소 클론
git clone https://github.com/jongjean/monggol.git
cd monggol

# 2. 로컬 서버 실행
python3 -m http.server 8000

# 3. 브라우저 접속
open http://localhost:8000
배포
Copy# 자동 배포 스크립트
./build.sh

# 또는 수동 배포
sudo cp -r ~/monggol/* /var/www/monggol/
sudo docker cp /var/www/monggol/js/main_v16.js mongolia-gallery:/usr/share/nginx/html/js/
sudo docker cp /var/www/monggol/index.html mongolia-gallery:/usr/share/nginx/html/
docker exec mongolia-gallery nginx -s reload
🎯 사용 방법
1️⃣ 전시관 입장
"전시관 입장" 버튼 클릭
3D 갤러리 로딩 대기
2️⃣ 작품 감상
WASD / 화살표 키로 이동
마우스 드래그로 시야 회전
작품에 가까이 다가가기
3️⃣ 도슨트 듣기
작품 더블클릭 → 도슨트 팝업
▶ 버튼으로 오디오 재생
배경 스토리 감상
4️⃣ 푸르공 체험
중앙의 푸르공(UAZ-452) 찾기
푸르공 더블클릭
홉스골 호수 극한 여정 읽기 🚐❄️
🔧 핵심 기술 구현
푸르공 초기화 시스템
Copywindow.initFurgonSystem = function() {
    const loader = new window.THREE.GLTFLoader();
    
    loader.load('models/furgon.glb', function(gltf) {
        const furgon = gltf.scene;
        furgon.userData.type = 'furgon';
        furgon.position.set(0, 1.5, 0);
        
        // 스케일 자동 조정
        const box = new THREE.Box3().setFromObject(furgon);
        const size = new THREE.Vector3();
        box.getSize(size);
        const scale = 2.2 / Math.max(size.x, size.y, size.z);
        furgon.scale.set(scale, scale, scale);
        
        window.scene.add(furgon);
    });
};
레이캐스터 기반 더블클릭
Copycanvas.addEventListener('click', function(e) {
    if (Date.now() - lastClick < 300) {
        const mouse = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY / window.innerHeight) * 2 + 1
        };
        
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects(scene.children, true);
        
        for (let hit of hits) {
            if (hit.object.userData.artworkId) {
                openDoc(hit.object.userData.artworkId);
                return;
            }
            if (hit.object.userData.type === 'furgon') {
                onFurgonClick();
                return;
            }
        }
    }
    lastClick = Date.now();
});
📊 버전 히스토리
v0.7 (2026-01-03) - 현재 버전 🎉
✅ 푸르공(UAZ-452) 3D 모델 배치
✅ 푸르공 더블클릭 상호작용 및 스토리
✅ 5개 작품 도슨트 시스템 완성
✅ GLTFLoader 통합 및 안정화
✅ 더블클릭 이벤트 최적화
⚠️ 카메라 워킹 안정화 필요
v0.6
도슨트 시스템 구축
오디오 재생 기능
v0.5
3D 갤러리 기본 구조
작품 배치 및 라이팅
🐛 알려진 이슈
우선순위: 높음
 카메라 워킹 안정화 (미끄러짐 현상)
 충돌 감지 시스템 (벽 통과 방지)
우선순위: 중간
 모바일 터치 컨트롤 최적화
 로딩 스피너 개선
우선순위: 낮음
 푸르공 애니메이션 추가
 사운드 이펙트 추가
🛣️ 로드맵
v0.8 (계획 중)
 카메라 워킹 안정화
 충돌 감지 시스템
 푸르공 주변 상호작용 개선
v0.9
 VR 지원 (WebXR)
 멀티플레이어 기능
v1.0
 정식 릴리즈
 성능 최적화
 크로스 브라우저 테스트
📝 개발 노트
푸르공 구현 과정 (2026-01-03)
문제들:

initFurgonSystem() 함수 정의는 있으나 호출 없음
GLTFLoader가 Three.js에 기본 포함되지 않음
2개의 더블클릭 핸들러 충돌로 작품 팝업 미작동
해결책:

initThreeJS() 완료 후 initFurgonSystem() 호출 추가
GLTFLoader.js 다운로드 및 index.html에 스크립트 태그 삽입
오래된 더블클릭 핸들러(1689번 라인) 제거
결과:

✅ 푸르공 3D 모델 정상 렌더링
✅ 더블클릭 시 홉스골 호수 스토리 표시
✅ 작품 더블클릭으로 도슨트 팝업 정상 작동
🤝 기여 방법
Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 라이선스
MIT License - 자유롭게 사용, 수정, 배포 가능합니다.

👨‍💻 제작자
Beyond the Endless Horizon는 몽골의 광활한 자연을 세계에 알리고, 극한 환경에서의 여정을 공유하기 위해 제작되었습니다.

2005년 영하 30도의 혹독한 추위 속에서 촬영된 사진들이 2026년 최신 웹 기술로 재탄생했습니다.

🔗 링크
GitHub: https://github.com/jongjean/monggol
Live Demo: https://uconai.ddns.net/monggol/
Issues: https://github.com/jongjean/monggol/issues
Made with ❤️ and ☕ in Mongolia

"Beyond the Endless Horizon, 끝없는 지평선 너머로..."


**VSCode에 복붙 후 저장하고:**

```bash
cd ~/monggol
git add README.md
git commit -m "docs: Add comprehensive v0.7 README"
git push origin main