#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🚀 몽골 갤러리 배포 시작...${NC}"

# 1. 배포 폴더 완전 초기화
echo -e "${GREEN}1단계: 배포 폴더 초기화 (빈방 만들기)...${NC}"
sudo rm -rf /var/www/monggol/*
sudo mkdir -p /var/www/monggol/{js,audio,images,css,data}

# 2. 루트 폴더에서 필수 파일만 복사
echo -e "${GREEN}2단계: 필수 파일 복사 (클린 배포)...${NC}"

# index.html
sudo cp /home/ucon/monggol/index.html /var/www/monggol/

# js (main_v16.js + three.min.js)
sudo cp /home/ucon/monggol/js/main_v16.js /var/www/monggol/js/
sudo cp /home/ucon/monggol/js/three.min.js /var/www/monggol/js/

sudo cp /home/ucon/monggol/js/furgon_system.js /var/www/monggol/js/
sudo cp /home/ucon/monggol/js/GLTFLoader.js /var/www/monggol/js/
# audio (모든 음성 파일)
sudo cp /home/ucon/monggol/audio/*.mp3 /var/www/monggol/audio/
sudo cp /home/ucon/monggol/audio/*.m4a /var/www/monggol/audio/ 2>/dev/null || true

# images (작품 + 프로필 + 배경 + UI)
sudo cp -r /home/ucon/monggol/images/* /var/www/monggol/images/

# css (있으면)
[ -d "/home/ucon/monggol/css" ] && sudo cp /home/ucon/monggol/css/*.css /var/www/monggol/css/ 2>/dev/null || true

# data (있으면)
[ -d "/home/ucon/monggol/data" ] && sudo cp /home/ucon/monggol/data/*.json /var/www/monggol/data/ 2>/dev/null || true

# models (3D 모델) - Docker 동기화 전에 복사 필수!
sudo mkdir -p /var/www/monggol/models
sudo cp /home/ucon/monggol/models/*.glb /var/www/monggol/models/ 2>/dev/null || true

# 3. Docker 컨테이너 완전 동기화
echo -e "${GREEN}3단계: Docker 컨테이너 동기화...${NC}"
sudo docker cp /var/www/monggol/. mongolia-gallery:/usr/share/nginx/html/
sudo docker exec mongolia-gallery nginx -s reload

# 4. 배포 결과 확인
echo -e "${GREEN}✅ 배포 완료!${NC}"
echo -e "${BLUE}📁 배포된 파일:${NC}"
echo ""
echo "📄 HTML:"
ls -lh /var/www/monggol/*.html
echo ""
echo "📜 JavaScript:"
ls -lh /var/www/monggol/js/
echo ""
echo "🔊 Audio:"
ls -lh /var/www/monggol/audio/ | grep -E "docent|intro"
echo ""
echo "🖼️ Images:"
ls -lh /var/www/monggol/images/ | grep -E "author_profile|guide"
echo ""
echo -e "${BLUE}🎯 테스트: http://172.30.1.150${NC}"
