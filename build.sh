#!/bin/bash

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🏗️  빌드 시작...${NC}"

# 1. 배포 폴더 초기화
echo -e "${GREEN}1️⃣  배포 폴더 초기화...${NC}"
sudo rm -rf /var/www/monggol/*

# 2. 필수 파일만 복사
echo -e "${GREEN}2️⃣  필수 파일만 복사...${NC}"
sudo mkdir -p /var/www/monggol/{js,images}

# index.html
sudo cp /home/ucon/monggol/src/index.html /var/www/monggol/

# js (필요한 것만)
sudo cp /home/ucon/monggol/src/js/main_v16.js /var/www/monggol/js/
sudo cp /home/ucon/monggol/src/js/three.min.js /var/www/monggol/js/

# images (전체)
sudo cp -r /home/ucon/monggol/src/images/* /var/www/monggol/images/

# css, audio, data가 필요하면 추가
[ -d "/home/ucon/monggol/src/css" ] && sudo cp -r /home/ucon/monggol/src/css /var/www/monggol/
[ -d "/home/ucon/monggol/src/audio" ] && sudo cp -r /home/ucon/monggol/src/audio /var/www/monggol/
[ -d "/home/ucon/monggol/src/data" ] && sudo cp -r /home/ucon/monggol/src/data /var/www/monggol/

# 3. Docker 반영
echo -e "${GREEN}3️⃣  Docker 반영...${NC}"
docker cp /var/www/monggol/. mongolia-gallery:/usr/share/nginx/html/
docker exec mongolia-gallery nginx -s reload

echo -e "${GREEN}✅ 배포 완료!${NC}"
echo -e "${BLUE}📁 /var/www/monggol/${NC}"
ls -lh /var/www/monggol/
