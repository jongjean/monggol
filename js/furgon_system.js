// ============================================
// 푸르공 시스템
// ============================================

window.initFurgonSystem = function () {
    const loader = new THREE.GLTFLoader();

    loader.load('models/furgon.glb', function (gltf) {
        const furgon = gltf.scene;
        furgon.position.set(0, 1.5, 0);
        furgon.scale.set(1.0966, 1.0966, 1.0966);
        furgon.userData.type = 'furgon';
        furgon.userData.clickable = true; // 클릭 가능 표시
        furgon.name = 'FurgonModel';

        // 모든 자식 메쉬에 userData 설정
        furgon.traverse(function (child) {
            if (child.isMesh) {
                child.userData.type = 'furgon';
                child.userData.clickable = true;
                console.log('푸르공 메쉬 설정:', child.name);
            }
        });

        window.scene.add(furgon);
        window.furgonModel = furgon; // 전역 참조 저장
        console.log('✅ 푸르공 모델 추가 완료, 위치:', furgon.position);

        // 크롬 모바일 전용: 더블탭 감지 강화
        if (/Chrome/.test(navigator.userAgent) && /Android/.test(navigator.userAgent)) {
            console.log('🔧 크롬 모바일 감지 - 푸르공 터치 강화');

            // Canvas에 직접 터치 이벤트 등록
            setTimeout(() => {
                const canvas = document.querySelector('canvas');
                if (!canvas) return;

                let lastTapTime = 0;
                let lastTapX = 0;
                let lastTapY = 0;

                // 터치 핸들러 추가 (더 우선순위 높게)
                canvas.addEventListener('touchend', function (e) {
                    const now = Date.now();
                    const touch = e.changedTouches[0];

                    // 위치 확인
                    const deltaX = Math.abs(touch.clientX - lastTapX);
                    const deltaY = Math.abs(touch.clientY - lastTapY);
                    const deltaTime = now - lastTapTime;

                    // 더블탭: 500ms 이내, 같은 위치
                    if (deltaTime > 50 && deltaTime < 500 && deltaX < 100 && deltaY < 100) {
                        console.log('📱 크롬 더블탭 감지!');

                        // 푸르공 영역 확인 (Raycaster)
                        const mouse = {
                            x: (touch.clientX / window.innerWidth) * 2 - 1,
                            y: -(touch.clientY / window.innerHeight) * 2 + 1
                        };

                        if (window.raycaster && window.camera && window.scene) {
                            window.raycaster.setFromCamera(mouse, window.camera);

                            // 푸르공 찾기 (children과 descendants 모두)
                            const furgonObject = window.scene.children.find(obj =>
                                obj.name === 'FurgonModel' || obj.userData?.type === 'furgon'
                            );

                            if (furgonObject) {
                                // 푸르공 전체를 대상으로 Raycast (더 넓게)
                                const hits = window.raycaster.intersectObjects([furgonObject], true);

                                if (hits.length > 0) {
                                    console.log('🚐 크롬 푸르공 터치 성공!');
                                    e.preventDefault();
                                    window.onFurgonClick();
                                    lastTapTime = 0; // 리셋
                                    return;
                                }
                            }
                        }
                    }

                    lastTapTime = now;
                    lastTapX = touch.clientX;
                    lastTapY = touch.clientY;
                }, { capture: true, passive: false }); // capture로 우선 처리

                console.log('✅ 크롬 푸르공 터치 핸들러 등록');
            }, 500);
        }

        // 더블클릭 아이콘 추가 (푸르공 위)
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // 심플한 클릭 아이콘
        ctx.strokeStyle = 'rgba(220, 70, 180, 0.9)';
        ctx.fillStyle = 'rgba(220, 70, 180, 0.3)';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.arc(64, 64, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↓', 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: 0.9
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(0, 1.2, 0);
        sprite.scale.set(0.8, 0.8, 1);
        sprite.userData.type = 'furgon-icon';
        sprite.userData.noRaycast = true;
        sprite.raycast = function () { return []; };

        furgon.add(sprite);

        // 애니메이션
        let time = 0;
        const originalY = 1.2;
        window.addEventListener('furgonIconAnimate', function () {
            time += 0.03;
            sprite.position.y = originalY + Math.sin(time) * 0.15;
        });

    }, undefined, function (error) {
        console.error('❌ Furgon load failed:', error);
    });
};

window.onFurgonClick = function () {
    // 기존 팝업이 있으면 제거
    const existing = document.getElementById('furgon-popup');
    const existingOverlay = document.getElementById('furgon-overlay');
    if (existing) existing.remove();
    if (existingOverlay) existingOverlay.remove();

    // 팝업 HTML 생성
    const popup = document.createElement('div');
    popup.id = 'furgon-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(20, 20, 20, 0.95);
        border: 3px solid rgba(220, 70, 180, 0.8);
        border-radius: 15px;
        padding: 0;
        z-index: 10000000;
        max-width: 700px;
        width: 90%;
        max-height: 92vh;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
    `;

    popup.innerHTML = `
        <div style="position: relative; padding-top: 40px;">
            <!-- 우상단 X 닫기 버튼 -->
            <button onclick="document.getElementById('furgon-popup').remove(); document.getElementById('furgon-overlay').remove();" style="
                position: absolute;
                top: 10px;
                right: 10px;
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.95);
                border: 2px solid rgba(220, 70, 180, 0.8);
                border-radius: 50%;
                color: rgba(220, 70, 180, 1);
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.2s;
            " onmouseover="this.style.background='rgba(220, 70, 180, 1)'; this.style.color='white'; this.style.transform='scale(1.1)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.95)'; this.style.color='rgba(220, 70, 180, 1)'; this.style.transform='scale(1)';">✕</button>
            <!-- 동영상 플레이어 -->
            <div style="position: relative;">
                <video id="furgon-video" style="width: 100%; max-height: 38vh; border-radius: 12px 12px 0 0; display: block; background: #000; object-fit: cover;">
                    <source src="images/hovsgol.mp4" type="video/mp4">
                </video>
                
                <!-- 동영상 표지 -->
                <div id="furgon-poster" style="
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(50, 20, 40, 0.95));
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    border-radius: 12px 12px 0 0;
                    cursor: pointer;
                ">
                    <h1 style="
                        color: rgba(70, 130, 220, 1);
                        font-size: 32px;
                        margin: 0 0 10px 0;
                        text-align: center;
                        font-weight: 700;
                    ">몽골, 푸른늑대의 후예</h1>
                    <h2 style="
                        color: rgba(255, 255, 255, 0.9);
                        font-size: 20px;
                        margin: 0 0 30px 0;
                        text-align: center;
                        font-weight: 400;
                    ">홉스골 호수위 14시간의 질주</h2>
                    <div style="
                        width: 80px;
                        height: 80px;
                        border-radius: 50%;
                        background: rgba(220, 70, 180, 0.2);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 30px;
                    ">
                        <div style="
                            font-size: 40px;
                            color: rgba(70, 130, 220, 1);
                        ">▶</div>
                    </div>
                    <p style="
                        color: rgba(255, 255, 255, 0.7);
                        font-size: 14px;
                        margin: 0;
                        text-align: center;
                    ">Photo by 강종진</p>
                </div>
            </div>
            
            <!-- 컨트롤러 바 -->
            <div style="padding: 15px 20px; background: rgba(30, 30, 30, 0.9); border-bottom: 1px solid rgba(220, 70, 180, 0.3);">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 8px;">
                    <button id="furgon-play-btn" style="
                        background: rgba(220, 70, 180, 0.8);
                        border: none;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        color: white;
                        font-size: 18px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">▶</button>
                    <input type="range" id="furgon-progress" min="0" max="100" value="0" style="
                        flex: 1;
                        height: 6px;
                        cursor: pointer;
                        -webkit-appearance: none;
                        background: rgba(100, 100, 100, 0.5);
                        border-radius: 3px;
                    ">
                    <span id="furgon-time" style="color: rgba(255, 255, 255, 0.8); font-size: 14px; min-width: 80px; text-align: right;">0:00 / 0:00</span>
                </div>
            </div>
            
            <!-- 제목 -->
            <div style="padding: 20px 30px 15px; background: rgba(30, 30, 30, 0.7);">
                <h2 style="color: rgba(70, 130, 220, 1); margin: 0; font-size: 22px; text-align: center;">
                    ❄️ 얼어붙은 홉스골 호수 위의 극한 여정
                </h2>
            </div>
            
            <!-- 스크롤 가능한 텍스트 -->
            <div id="furgon-text-content" style="
                padding: 20px 30px;
                color: rgba(255, 255, 255, 0.9);
                line-height: 1.8;
                font-size: 15px;
                white-space: pre-line;
                max-height: 150px;
                overflow-y: auto;
                overflow-x: hidden;
                background: rgba(20, 20, 20, 0.8);
                -webkit-overflow-scrolling: touch;
                touch-action: pan-y;
                overscroll-behavior: contain;
            ">이 UAZ-452 푸르공을 타고
영하 30도에 꽁꽁 얼어붙은 홉스골 호수 위를
14시간 동안 목숨 걸고 달렸습니다.

🧊 얼음은 쩡쩡 떵떵 괴성을 지르고
💨 여기저기 크레바스가 수심 200미터의 협곡을 보여주고
🚐 차는 미끄러지지만 속도를 늦출 수 없고
그러다 만일 빠지면 익사, 나와도 동사하는 절체절명의 시간들...

차탄족 사람들을 만나기 위해
두려움을 넘어 달려갔습니다.

호수 위의 얼음길,
그 위를 달리는 14시간의 모험.

- 2005년 2월, 몽골 홉스골 -</div>
            
            <!-- 스크롤바 스타일 (모바일 포함) -->
            <style>
                #furgon-text-content::-webkit-scrollbar {
                    width: 8px;
                }
                #furgon-text-content::-webkit-scrollbar-track {
                    background: rgba(50, 50, 50, 0.5);
                    border-radius: 4px;
                }
                #furgon-text-content::-webkit-scrollbar-thumb {
                    background: rgba(220, 70, 180, 0.7);
                    border-radius: 4px;
                }
                #furgon-text-content::-webkit-scrollbar-thumb:hover {
                    background: rgba(220, 70, 180, 0.9);
                }
            </style>
        </div>
    `;

    // 배경 오버레이
    const overlay = document.createElement('div');
    overlay.id = 'furgon-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9999999;
    `;
    // 외부 클릭으로 닫기 제거 - 닫기 버튼만 사용

    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // 비디오 컨트롤러 설정
    const video = document.getElementById('furgon-video');
    const playBtn = document.getElementById('furgon-play-btn');
    const progress = document.getElementById('furgon-progress');
    const timeDisplay = document.getElementById('furgon-time');
    const poster = document.getElementById('furgon-poster');

    // 표지 클릭 시 재생
    poster.onclick = function () {
        video.play();
        poster.style.display = 'none';
        playBtn.textContent = '⏸';
    };

    playBtn.onclick = function () {
        if (video.paused) {
            video.play();
            poster.style.display = 'none';
            playBtn.textContent = '⏸';
        } else {
            video.pause();
            playBtn.textContent = '▶';
        }
    };

    video.ontimeupdate = function () {
        if (video.duration) {
            progress.value = (video.currentTime / video.duration) * 100;
            const formatTime = (sec) => {
                const m = Math.floor(sec / 60);
                const s = Math.floor(sec % 60);
                return `${m}:${s < 10 ? '0' : ''}${s}`;
            };
            timeDisplay.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
        }
    };

    progress.oninput = function () {
        if (video.duration) {
            video.currentTime = (this.value / 100) * video.duration;
        }
    };

    video.onended = function () {
        playBtn.textContent = '▶';
        poster.style.display = 'flex'; // 동영상 종료 시 표지 다시 표시
        video.currentTime = 0;
        progress.value = 0;
    };
};
