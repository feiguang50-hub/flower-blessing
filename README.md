# 🌸 Flower Blessing · 祝福卡片集

> 精美的 HTML 祝福卡片集合，支持生日/节日/纪念日等 **159 个场景**，一键生成可分享的专属贺卡。

## ✨ 项目特点

- **159 种场景**：生日、情人节、圣诞、毕业、感谢、道歉、乔迁……基本覆盖日常祝福场景
- **零依赖**：纯 HTML/CSS/JS，无需后端、可离线
- **轻量**：数据驱动架构，单个场景配置 ~1KB，渲染模板共用
- **可分享**：生成 `card.html?scene=<id>&n=<姓名>&b=<祝福>&f=<署名>` 链接即可发送

## 🚀 快速开始

### 在线使用

打开 [`index.html`](./index.html)，选择主题、填写姓名/祝福/署名，点"生成链接"即可。

### 本地预览

```bash
# 进入仓库根目录
python -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

> 也可以直接双击 `index.html` 打开（不推荐，部分浏览器会限制相对路径）。

## 🏗️ 架构

```
flower-blessing/
├── index.html              # 卡片生成器（表单 UI）
├── card.html               # 通用渲染模板（被所有场景共享）
├── config.js               # 主题配置（生成器侧）
├── assets/
│   ├── scenes.json         # 159 个场景的视觉配置
│   ├── css/card-base.css   # 基础样式
│   └── js/
│       ├── card.js         # 主渲染逻辑
│       └── particles.js    # 粒子效果工厂
├── lib/                    # Three.js（3D demo 使用）
├── photos/                 # 预留图片资源
├── learning/               # 设计笔记
└── card-<scene>.html       # 旧 URL 兼容壳（159 个重定向）
```

### 新增场景

1. 在 `assets/scenes.json` 的 `scenes` 下加一项：
   ```json
   "my-scene": {
     "title": "我的场景",
     "ogEmoji": "🎉",
     "icon": "🎊",
     "defaultBlessing": "愿你心想事成",
     "theme": { "bgGradient": "...", "primary": "#fff", ... },
     "particles": [{ "type": "confetti", "count": 30 }]
   }
   ```
2. （可选）为旧 URL 兼容建一个 `card-my-scene.html`：
   ```bash
   node build-redirects.js
   ```

可用粒子类型见 `assets/js/particles.js`（`stars / petals / hearts / balloons / snowflakes / fireflies / bubbles / leaves / sparkles / confetti / butterflies / feathers / ribbons / rain / birds / clouds / steam / rays / goldParticles / lightDots / speedLines / fireworks / meteors / lanterns / planes / coins / candy / decorations`）。

## 🔧 开发

修改 `card.html` 或 `assets/css/card-base.css` 后无需构建，刷新即可。
修改粒子效果后清空浏览器缓存或加 `?v=<timestamp>`。

## 📜 License

MIT
