#!/usr/bin/env node
/**
 * build-redirects.js
 * 把每个 card-<id>.html 替换为轻量级重定向到 card.html?scene=<id>&<原 URL 参数>
 * 保留旧 URL 兼容性，分享出去的链接不会失效
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const cards = fs.readdirSync(ROOT).filter(f => /^card-[^.]+\.html$/.test(f));
console.log(`找到 ${cards.length} 个 card-*.html`);

const TEMPLATE = (id, title, ogEmoji) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta property="og:title" content="${ogEmoji} ${title}">
<meta name="twitter:title" content="${ogEmoji} ${title}">
<title>${title}</title>
<style>
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;
       background:linear-gradient(160deg,#1a1a2e,#16213e);color:#fff;
       font-family:'Georgia','PingFang SC',serif;text-align:center}
  .box{padding:24px;border-radius:16px;background:rgba(255,255,255,.05)}
  .spin{font-size:40px;animation:s 1.4s ease-in-out infinite}
  @keyframes s{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}
</style>
</head>
<body>
<div class="box">
  <div class="spin">${ogEmoji}</div>
  <p>正在打开贺卡…</p>
</div>
<script>
// 兼容：保留所有 URL 参数，把旧路径重定向到统一的 card.html?scene=
(function(){
  var p = new URLSearchParams(location.search);
  // 移除旧的 scene 参数（如果有），强制用文件名里的 scene
  var q = new URLSearchParams();
  p.forEach(function(v,k){ if (k !== 'scene') q.set(k, v); });
  q.set('scene', '${id}');
  // location.replace 不会留下历史记录，体验更好
  location.replace('card.html?' + q.toString());
})();
</script>
</body>
</html>
`;

// 从 scenes.json 读标题/emoji（如果存在）
let scenesData = {};
try {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/scenes.json'), 'utf8'));
  scenesData = data.scenes || {};
} catch (e) {
  console.warn('scenes.json 不可用，使用默认标题');
}

let written = 0;
for (const file of cards) {
  const id = file.match(/^card-(.+)\.html$/)[1];
  const meta = scenesData[id] || {};
  const title = meta.title || id;
  const ogEmoji = meta.ogEmoji || '💌';
  const html = TEMPLATE(id, title, ogEmoji);
  fs.writeFileSync(path.join(ROOT, file), html, 'utf8');
  written++;
}

console.log(`已重写 ${written} 个重定向文件`);
console.log(`平均文件大小：${(written * 800 / 1024).toFixed(1)} KB（旧版本约 ${(written * 9).toFixed(0)} KB）`);
