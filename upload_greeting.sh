#!/bin/bash
cd /home/ucon/monggol

echo "=== greeting.mp3 배포 ==="

# src에서 배포 폴더로 복사
cp src/audio/greeting.mp3 /var/www/monggol/audio/greeting.mp3

# Docker 컨테이너에도 복사
docker cp src/audio/greeting.mp3 mongolia-gallery:/usr/share/nginx/html/audio/greeting.mp3

echo "✅ 배포 완료!"
ls -lh src/audio/greeting.mp3
ls -lh /var/www/monggol/audio/greeting.mp3

echo ""
echo "🌐 http://172.30.1.150/monggol/"
echo "🔄 F5 새로고침 후 테스트!"
