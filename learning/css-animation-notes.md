# 小荧的CSS特效学习笔记

> 学习日期：2026-06-19
> 重点：静态贺卡能用的CSS动画特效

---

## 一、transform 变换属性（核心）

### 基础变换函数
```css
transform: translate(120px, 50%);   /* 平移 x,y */
transform: scale(2, 0.5);            /* 缩放 x,y */
transform: rotate(0.5turn);         /* 旋转（可用deg/turn/rad） */
transform: skew(30deg, 20deg);      /* 倾斜 */
```

### 3D变换
```css
transform: perspective(500px) rotateY(30deg) translateZ(50px);
```
- `perspective(px)` - 透视距离，值越小透视越强
- `rotateX/Y/Z(deg)` - 沿各轴旋转
- `translateZ(px)` - 沿Z轴移动（前后）

### 贺卡可用特效
- **3D翻页卡片**：perspective + rotateY + backface-visibility
- **悬浮放大**：scale(1.05) + transition
- **倾斜效果**：skewX/skewY

---

## 二、animation 动画属性

### 完整语法
```css
animation: name duration timing-function delay iteration-count direction fill-mode;
```

### 关键帧 @keyframes
```css
@keyframes slideIn {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}
```

### fill-mode 填充模式（重要！）
| 值 | 效果 |
|----|------|
| `none` | 动画前后保持原样 |
| `forwards` | 动画结束后保持最后一帧 |
| `backwards` | 动画开始前显示第一帧 |
| `both` | forwards + backwards，动画前后都保持状态 |

**贺卡文字显示问题根源**：用了 `animation: fadeIn 1.5s ease-out` 但没有加 `fill-mode: both`，动画结束后文字会消失变回 `opacity: 0`

**正确写法**：
```css
.name {
  opacity: 1;  /* 先确保默认可见 */
  animation: fadeIn 1.2s ease-out both;
}
```

### timing-function 缓动曲线
```css
ease-out   /* 开始快，结束慢 → 适合入场动画 */
ease-in    /* 开始慢，结束快 → 适合退场动画 */
ease-in-out /* 慢进慢出 → 适合循环动画 */
cubic-bezier(0.34, 1.56, 0.64, 1) /* 特殊弹跳感，适合强调效果 */
linear     /* 匀速 → 适合循环动画 */
```

---

## 三、贺卡特效灵感

### 1. 3D翻页贺卡
```css
.scene { perspective: 1000px; }
.card-inner {
  transform-style: preserve-3d;
  transition: transform 0.8s;
}
.card-inner.flipped { transform: rotateY(180deg); }
.card-front, .card-back {
  backface-visibility: hidden;
  position: absolute;
}
.card-back { transform: rotateY(180deg); }
```

### 2. 文字打字机效果
```css
.blessing {
  overflow: hidden;
  white-space: nowrap;
  animation: typing 3s steps(20) forwards;
}
@keyframes typing {
  from { width: 0; }
  to   { width: 100%; }
}
```

### 3. 边框流光效果
```css
.card {
  position: relative;
  background: linear-gradient(#fff, #fff) padding-box,
              linear-gradient(45deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #ff6b6b) border-box;
  background-size: 200% 200%;
  animation: borderFlow 3s linear infinite;
}
@keyframes borderFlow {
  0%   { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
```

### 4. 呼吸发光效果
```css
.card {
  animation: glow 2s ease-in-out infinite alternate;
}
@keyframes glow {
  from { box-shadow: 0 0 20px rgba(255,150,150,0.3); }
  to   { box-shadow: 0 0 40px rgba(255,150,150,0.7), 0 0 80px rgba(255,150,150,0.3); }
}
```

### 5. 悬浮上浮效果
```css
.card:hover {
  transform: translateY(-12px) scale(1.02);
  transition: transform 0.3s ease-out;
}
```

### 6. 视差背景效果
```css
.layer-bg { transform: translateZ(-20px) scale(1.1); }
.layer-main { transform: translateZ(0); }
.layer-fg { transform: translateZ(20px) scale(0.9); }
```
用CSS perspective做多层视差，滚动时各层移动速度不同

---

## 四、性能优化

### GPU加速
```css
.card {
  will-change: transform;  /* 提前告知浏览器用GPU */
  transform: translateZ(0); /* 强制启用GPU加速 */
}
```

### 避免重排重绘的属性
- ✅ `transform` - GPU加速，性能好
- ✅ `opacity` - 只影响可见性
- ❌ `width/height/margin/padding` - 触发重排，慢
- ❌ `background-color` - 触发重绘

### 循环动画优化
```css
/* 优先用 translate 而非 margin/position */
@keyframes fall {
  0%   { transform: translateY(-20px); }   /* ✅ 好 */
  100% { transform: translateY(100vh); }
}
/* 而不是 */
@keyframes fall {
  0%   { top: -20px; }  /* ❌ 差，触发重排 */
  100% { top: 100vh; }
}
```

---

## 五、CSS变量（贺卡可配置的关键色）

```css
:root {
  --sakura-bg: linear-gradient(180deg, #ffeef2 0%, #ffd6e0 50%, #ffb8c8 100%);
  --sakura-text: #8b4557;
  --sakura-accent: #c0607a;
  --birthday-bg: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  --birthday-gold: #ffd700;
}
```
用CSS变量让不同贺卡共用一套主题色配置

---

## 六、下一步学习方向

1. **CSS Houdini** - 用CSS paint API做自定义图形
2. **scroll-driven animations** - 滚动驱动的动画（CSS scroll-timeline）
3. **GSAP/Framer Motion** - JS动画库，做复杂时间线
4. **Lottie** - JSON动画文件，适合复杂矢量动画

---

## 七、贺卡类型规划

| 类型 | 特效方向 | 状态 |
|------|---------|------|
| 🌸 樱花祝福 | 花瓣飘落 + 文字淡入 | ✅ 已完成 |
| 🎂 生日气球 | 气球飘空 + 蛋糕火焰 | ✅ 已完成 |
| ⭐ 星空许愿 | 星星闪烁 + 流星 | 待做 |
| 🎆 烟花绽放 | 烟花爆开 | 待做 |
| 💐 动漫花束 | 浮动花瓣 | 待做 |
| 💌 纪念日 | 3D翻页 + 玫瑰 | 待做 |
| 🎄 圣诞主题 | 雪花 + 边框流光 | 待做 |
| ✏️ 打字机贺卡 | 文字逐字出现 | 待做 |

---

## 八、问题记录

### Q: 为什么文字动画结束后消失了？
A: 没有加 `fill-mode: both`，动画结束后回到 `opacity: 0`。解法：元素默认 `opacity: 1`，动画只做过渡效果。

### Q: 为什么手机上看不到文字？
A: 可能是 `backdrop-filter: blur()` 不支持，或者是 `animation-fill-mode` 老浏览器不支持。解法：不用这些属性，用更通用的写法。

### Q: 为什么动画很卡？
A: 用到了触发重排的属性（margin/top等）。解法：全部用 `transform` 和 `opacity`。
