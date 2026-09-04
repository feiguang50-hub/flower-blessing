#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'card.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'assets/js/card.js'), 'utf8');
const scenes = JSON.parse(
  fs.readFileSync(path.join(root, 'assets/scenes.json'), 'utf8')
);

function hasTarget(name) {
  return html.includes(`id="${name}"`) ||
    html.includes(`data-bind="${name}"`);
}

function literalCalls(functionName) {
  const pattern = new RegExp(`${functionName}\\('([^']+)'`, 'g');
  return [...script.matchAll(pattern)].map(match => match[1]);
}

const targets = new Set([
  ...literalCalls('setText'),
  ...literalCalls('toggleVisible')
]);
const missing = [...targets].filter(name => !hasTarget(name));

if (missing.length) {
  throw new Error(`card.html 缺少渲染目标: ${missing.join(', ')}`);
}
if (!script.includes("flipBack.removeAttribute('hidden')")) {
  throw new Error('翻面遮罩显示时必须移除 hidden 属性');
}
if (!scenes.scenes || Object.keys(scenes.scenes).length === 0) {
  throw new Error('assets/scenes.json 中没有可用场景');
}
if (script.includes('scene.flipBack')) {
  throw new Error('渲染器必须使用场景契约字段 hasFlipBack');
}
if (!script.includes('scene.hasFlipBack')) {
  throw new Error('渲染器没有读取场景契约字段 hasFlipBack');
}
if (!script.includes('location.hash')) {
  throw new Error('渲染器不支持隐私友好的 URL 片段参数');
}
if (!script.includes('normalizeBreaks(scene.defaultBlessing')) {
  throw new Error('渲染器没有兼容旧场景中的 HTML 换行');
}

console.log(
  `card contract OK: ${targets.size} 个绑定目标，` +
  `${Object.keys(scenes.scenes).length} 个场景`
);
