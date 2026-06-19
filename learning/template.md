# 小荧的静态贺卡模板

> 版本：2026-06-19
> 说明：基于CSS动画的动漫风静态贺卡模板，用CSS变量控制主题

---

## 一、模板结构

每个贺卡HTML都包含以下部分：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>贺卡标题</title>
<style>
/* CSS变量 - 控制主题颜色 */
:root {
  --bg-from: #...;         /* 背景起始色 */
  --bg-to: #...;           /* 背景结束色 */
  --border-from: #...;     /* 边框起始色 */
  --border-to: #...;       /* 边框结束色 */
  --glow-color: rgba(...);  /* 发光色 */
  --text-primary: #...;    /* 主文字色 */
  --text-secondary: #...;  /* 次文字色 */
  --text-accent: #...;     /* 强调文字色 */
}

/* 全局重置 */
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  min-height: 100vh;
  background: linear-gradient(180deg, var(--bg-from) 0%, var(--bg-to) 100%);
  font-family: 'Georgia', serif;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

/* === 背景装饰粒子 === */
/* 用JS动态生成，emoji类型根据 --particle-emoji 决定 */

/* === 边框包裹层 === */
.card-wrap {
  position: relative;
  padding: 2px;
  border-radius: 34px;
  background: linear-gradient(135deg, var(--border-from), var(--border-to));
  background-size: 300% 300%;
  animation: borderFlow 4s ease infinite;
  box-shadow: 0 0 25px var(--glow-color);
  z-index: 10;
}
@keyframes borderFlow {
  0%   { background-position: 0% 50%; box-shadow: 0 0 25px var(--glow-color); }
  50%  { background-position: 100% 50%; box-shadow: 0 0 40px var(--glow-color); }
  100% { background-position: 0% 50%; box-shadow: 0 0 25px var(--glow-color); }
}

/* === 卡片主体 === */
.card {
  background: rgba(255,255,255,0.x);  /* 透明度可调 */
  border-radius: 32px;
  padding: 48px 56px;
  text-align: center;
  max-width: 520px;
  width: 90vw;
  box-shadow: 0 16px 48px rgba(0,0,0,0.x);  /* 阴影深度可调 */
  animation: cardFloat 4s ease-in-out infinite;
  position: relative; overflow: hidden;
}
@keyframes cardFloat {
  0%, 100% { transform: translateY(0) rotate(-0.5deg); }
  50% { transform: translateY(-10px) rotate(0.5deg); }
}

/* === 文字样式 === */
.name {
  font-size: clamp(28px, 7vw, 52px);
  color: var(--text-primary);
  letter-spacing: 8px;
  margin-bottom: 16px;
  opacity: 1;
  animation: textSlideIn 1.2s cubic-bezier(0.34,1.56,0.64,1) both;
}
@keyframes textSlideIn {
  from { opacity: 0; transform: translateY(24px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* 其他文字类推... */
</style>
</head>
<body>

<div class="card-wrap">
  <div class="card">
    <span class="card-icon">🎂</span>
    <div class="name" id="nameEl"></div>
    <div class="date" id="dateEl"></div>
    <div class="blessing" id="blessingEl"></div>
    <div class="from" id="fromEl"></div>
  </div>
</div>

<script>
/* URL参数解析 */
const p = new URLSearchParams(location.search);
document.getElementById('nameEl').textContent = p.get('n') || '';
document.getElementById('dateEl').textContent = p.get('d') || '';
document.getElementById('blessingEl').textContent = p.get('b') || '';
document.getElementById('fromEl').textContent = p.get('f') ? '— ' + p.get('f') : '';

/* 动态生成装饰粒子 */
for (let i = 0; i < 数量; i++) {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.left = Math.random() * 100 + 'vw';
  el.style.animationDuration = (时间) + 's';
  el.style.animationDelay = Math.random() * 延迟 + 's';
  document.body.appendChild(el);
}
</script>
</body>
</html>
```

---

## 二、目前4个贺卡的CSS变量

### 🌸 樱花祝福 (card-sakura.html)
```css
:root {
  --bg-from: #ffeef2;
  --bg-to: #ffb8c8;
  --border-from: #ff9a9e;
  --border-to: #fbc2eb;
  --glow-color: rgba(255,150,180,0.35);
  --text-primary: #8b4557;
  --text-secondary: #b87085;
  --text-accent: #c0607a;
}
```

### 🎂 生日气球 (card-birthday.html)
```css
:root {
  --bg-from: #1a1a2e;
  --bg-to: #0f3460;
  --border-from: #ffd700;
  --border-to: #daa520;
  --glow-color: rgba(255,215,0,0.4);
  --text-primary: #ffffff;
  --text-secondary: rgba(255,255,255,0.7);
  --text-accent: #ffd700;
}
```

### ⭐ 星空许愿 (card-star.html)
```css
:root {
  --bg-from: #050510;
  --bg-to: #1a0a3a;
  --border-from: rgba(200,180,255,0.6);
  --border-to: rgba(150,100,255,0.4);
  --glow-color: rgba(150,100,255,0.3);
  --text-primary: #ffffff;
  --text-secondary: rgba(200,180,255,0.6);
  --text-accent: rgba(255,255,255,0.85);
}
```

### 💌 纪念日 (card-anniversary.html)
```css
:root {
  --bg-from: #1a0515;
  --bg-to: #3a1535;
  --border-from: rgba(255,150,180,0.7);
  --border-to: rgba(180,60,110,0.4);
  --glow-color: rgba(255,100,150,0.35);
  --text-primary: #ffffff;
  --text-secondary: rgba(255,200,220,0.7);
  --text-accent: rgba(255,255,255,0.88);
}
```

---

## 三、可以优化的方向

1. **统一模板结构** - 提取公共部分，用CSS变量控制差异
2. **边框动画增强** - 可以尝试多色渐变、脉冲闪烁等
3. **粒子系统优化** - 共用一个JS粒子生成函数
4. **3D翻页卡片** - 纪念日的3D效果可以模块化
5. **响应式优化** - 确保手机端效果和电脑一致
6. **性能优化** - 减少DOM元素数量（目前粒子较多）
7. **无障碍** - 文字对比度、减少动画选项等

---

## 四、待做的贺卡类型

- 🎄 圣诞主题（雪花+红绿边框流光）
- ✏️ 鼓励卡（阳光+暖色+手写字效果）
- 🎉 毕业/升学祝福
- 💐 花束静态版（替代canvas版）
