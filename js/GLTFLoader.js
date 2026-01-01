/**
 * GLTFLoader for Three.js (Legacy compatibility wrapper)
 */
(function() {
    'use strict';
    
    // GLTFLoader 생성자
    THREE.GLTFLoader = function(manager) {
        this.manager = (manager !== undefined) ? manager : THREE.DefaultLoadingManager;
        this.path = '';
    };
    
    THREE.GLTFLoader.prototype = {
        constructor: THREE.GLTFLoader,
        
        load: function(url, onLoad, onProgress, onError) {
            var scope = this;
            var loader = new THREE.FileLoader(scope.manager);
            loader.setPath(scope.path);
            loader.setResponseType('arraybuffer');
            
            loader.load(url, function(data) {
                try {
                    scope.parse(data, onLoad, onError);
                } catch (e) {
                    if (onError) {
                        onError(e);
                    } else {
                        console.error('GLTFLoader: Parse error', e);
                    }
                }
            }, onProgress, onError);
        },
        
        setPath: function(value) {
            this.path = value;
            return this;
        },
        
        parse: function(data, onLoad, onError) {
            // 간단한 GLTF 파싱 (실제로는 매우 복잡함)
            // 실제 구현 대신 폴백 처리
            console.warn('⚠️ GLTFLoader: 기본 파서 사용 - 3D 모델 로드 불가');
            
            // 빈 씬 반환
            var scene = new THREE.Group();
            scene.name = 'GLTFScene';
            
            if (onLoad) {
                onLoad({
                    scene: scene,
                    scenes: [scene],
                    cameras: [],
                    animations: [],
                    asset: {}
                });
            }
        }
    };
    
    console.log('✅ GLTFLoader (래퍼) 로드 완료');
})();
