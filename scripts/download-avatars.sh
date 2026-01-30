#!/bin/bash

# 下载免费宠物头像脚本
# 图片来源：Unsplash (免费商用，无需署名)

AVATAR_DIR="public/avatars"
mkdir -p "$AVATAR_DIR"

echo "开始下载宠物头像..."

# 猫咪头像
echo "下载猫咪头像..."
curl -L -o "$AVATAR_DIR/cat-orange.png" "https://images.unsplash.com/photo-1513245543132-31f507417b26?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/cat-black.png" "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/cat-white.png" "https://images.unsplash.com/photo-1495360010541-f48722b34f73?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/cat-calico.png" "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/cat-grey.png" "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=200&h=200&fit=crop"

# 狗狗头像
echo "下载狗狗头像..."
curl -L -o "$AVATAR_DIR/dog-golden.png" "https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/dog-corgi.png" "https://images.unsplash.com/photo-1612536057832-2ff7ead58194?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/dog-husky.png" "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/dog-poodle.png" "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/dog-shiba.png" "https://images.unsplash.com/photo-1625316708582-7c38734be31d?w=200&h=200&fit=crop"

# 其他宠物头像
echo "下载其他宠物头像..."
curl -L -o "$AVATAR_DIR/rabbit.png" "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/hamster.png" "https://images.unsplash.com/photo-1587596699374-3bbe10ff046c?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/bird.png" "https://images.unsplash.com/photo-1444464126345-29d8a2857a66?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/fish.png" "https://images.unsplash.com/photo-1522512558176-a818cdadbc5c?w=200&h=200&fit=crop"
curl -L -o "$AVATAR_DIR/turtle.png" "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=200&h=200&fit=crop"

echo "✅ 头像下载完成！"
echo "保存位置: $AVATAR_DIR"
echo ""
echo "图片列表:"
ls -lh "$AVATAR_DIR"
