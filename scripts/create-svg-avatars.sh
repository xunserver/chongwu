#!/bin/bash

# 创建 SVG 宠物头像脚本
# 使用 SVG 图标代替外部图片，更可靠且性能更好

AVATAR_DIR="public/avatars"
mkdir -p "$AVATAR_DIR"

echo "创建 SVG 宠物头像..."

# 猫咪头像
for i in 1 2 3 4 5; do
  case $i in
    1) color="#f97316" name="orange" ;;  # 橘猫
    2) color="#1f2937" name="black" ;;   # 黑猫
    3) color="#ffffff" name="white" ;;   # 白猫
    4) color="#78716c" name="calico" ;;  # 花猫
    5) color="#9ca3af" name="grey" ;;    # 灰猫
  esac

  cat > "$AVATAR_DIR/cat-$name.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <circle cx="50" cy="50" r="40" fill="$color"/>
  <circle cx="35" cy="45" r="5" fill="#1f2937"/>
  <circle cx="65" cy="45" r="5" fill="#1f2937"/>
  <path d="M45 60 Q50 65 55 60" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M35 25 Q35 20 40 20 L60 20 Q65 20 65 25" stroke="#1f2937" stroke-width="3"/>
  <path d="M30 35 Q25 30 30 25 M70 35 Q75 30 70 25" stroke="#1f2937" stroke-width="3"/>
</svg>
EOF
done

# 狗狗头像
for i in 1 2 3 4 5; do
  case $i in
    1) color="#d97706" name="golden" ;;   # 金毛
    2) color="#f59e0b" name="corgi" ;;    # 柯基
    3) color="#3b82f6" name="husky" ;;    # 哈士奇
    4) color="#e5e7eb" name="poodle" ;;   # 泰迪
    5) color="#dc2626" name="shiba" ;;    # 柴犬
  esac

  cat > "$AVATAR_DIR/dog-$name.svg" <<EOF
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <circle cx="50" cy="50" r="40" fill="$color"/>
  <ellipse cx="50" cy="35" rx="20" ry="18" fill="$color"/>
  <circle cx="42" cy="32" r="5" fill="#1f2937"/>
  <circle cx="58" cy="32" r="5" fill="#1f2937"/>
  <ellipse cx="50" cy="42" rx="8" ry="6" fill="#1f2937"/>
  <path d="M35 50 Q50 55 65 50" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M30 20 Q50 15 70 20" stroke="#1f2937" stroke-width="4" fill="none"/>
  <path d="M25 30 Q20 35 25 40 M75 30 Q80 35 75 40" stroke="#1f2937" stroke-width="4"/>
</svg>
EOF
done

# 其他宠物头像
cat > "$AVATAR_DIR/rabbit.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <ellipse cx="50" cy="55" rx="30" ry="25" fill="#f5f5f4" stroke="#9ca3af" stroke-width="2"/>
  <circle cx="50" cy="35" r="20" fill="#f5f5f4" stroke="#9ca3af" stroke-width="2"/>
  <circle cx="42" cy="32" r="4" fill="#1f2937"/>
  <circle cx="58" cy="32" r="4" fill="#1f2937"/>
  <ellipse cx="50" cy="40" rx="6" ry="4" fill="#fca5a5"/>
  <circle cx="35" cy="25" r="5" fill="#f5f5f4" stroke="#9ca3af" stroke-width="2"/>
  <circle cx="65" cy="25" r="5" fill="#f5f5f4" stroke="#9ca3af" stroke-width="2"/>
</svg>
EOF

cat > "$AVATAR_DIR/hamster.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <ellipse cx="50" cy="55" rx="25" ry="20" fill="#fbbf24"/>
  <circle cx="50" cy="40" r="18" fill="#fbbf24"/>
  <circle cx="43" cy="38" r="3" fill="#1f2937"/>
  <circle cx="57" cy="38" r="3" fill="#1f2937"/>
  <circle cx="50" cy="45" rx="5" ry="3" fill="#fcd34d"/>
  <path d="M38 48 Q50 52 62 48" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/>
  <ellipse cx="38" cy="28" rx="8" ry="10" fill="#fbbf24"/>
  <ellipse cx="62" cy="28" rx="8" ry="10" fill="#fbbf24"/>
</svg>
EOF

cat > "$AVATAR_DIR/bird.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <ellipse cx="50" cy="55" rx="35" ry="25" fill="#3b82f6"/>
  <circle cx="50" cy="35" r="18" fill="#3b82f6"/>
  <circle cx="43" cy="33" r="4" fill="#1f2937"/>
  <circle cx="57" cy="33" r="4" fill="#1f2937"/>
  <path d="M50 40 L50 45" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M20 55 Q50 50 80 55" stroke="#1f2937" stroke-width="2" fill="none"/>
  <path d="M25 50 Q50 45 75 50" stroke="#1f2937" stroke-width="2" fill="none"/>
  <path d="M30 65 Q35 75 40 80 L60 80 Q65 75 70 65" stroke="#1f2937" stroke-width="3" fill="none"/>
</svg>
EOF

cat > "$AVATAR_DIR/fish.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <ellipse cx="50" cy="50" rx="40" ry="25" fill="#06b6d4"/>
  <circle cx="35" cy="45" r="4" fill="#1f2937"/>
  <path d="M50 40 Q60 45 70 50" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/>
  <path d="M30 50 L25 45 M30 50 L25 55 M70 50 L75 45 M70 50 L75 55" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <path d="M10 50 Q15 40 20 45 L10 50 Q15 60 20 55" stroke="#0891b2" stroke-width="3"/>
</svg>
EOF

cat > "$AVATAR_DIR/turtle.svg" <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <rect width="100" height="100" fill="#f3f4f6"/>
  <ellipse cx="50" cy="60" rx="30" ry="20" fill="#22c55e"/>
  <circle cx="50" cy="40" r="18" fill="#22c55e"/>
  <circle cx="43" cy="38" r="3" fill="#1f2937"/>
  <circle cx="57" cy="38" r="3" fill="#1f2937"/>
  <ellipse cx="50" cy="45" rx="4" ry="3" fill="#4ade80"/>
  <path d="M38 42 Q50 45 62 42" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/>
  <path d="M35 20 Q35 15 40 15 L60 15 Q65 15 65 20" stroke="#1f2937" stroke-width="3"/>
  <path d="M35 70 Q40 75 45 80 L55 80 Q60 75 65 70" stroke="#1f2937" stroke-width="3" stroke-linecap="round"/>
  <circle cx="35" cy="75" r="4" fill="#1f2937"/>
  <circle cx="65" cy="75" r="4" fill="#1f2937"/>
</svg>
EOF

# 删除失败的PNG文件
rm -f "$AVATAR_DIR"/*.png

echo "✅ SVG 头像创建完成！"
echo "保存位置: $AVATAR_DIR"
echo ""
echo "文件列表:"
ls -lh "$AVATAR_DIR"
