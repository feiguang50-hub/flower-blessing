#!/usr/bin/env node
'use strict';
const fs=require('fs');const path=require('path');const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const script=fs.readFileSync(path.join(root,'assets/js/generator.js'),'utf8');
const scenes=JSON.parse(fs.readFileSync(path.join(root,'assets/scenes.json'),'utf8')).scenes;
const required=['sceneSearch','sceneGrid','nameInput','blessingInput','resultUrl','cardPreview'];
const missing=required.filter(id=>!html.includes(`id="${id}"`));
if(missing.length)throw Error('生成器缺少界面目标: '+missing.join(', '));
if(Object.keys(scenes).length!==159)throw Error('场景数量异常');
if(!script.includes("new URL('card.html#'"))throw Error('新链接没有以隐私友好的片段统一指向 card.html');
if(script.includes('undefined.html'))throw Error('生成器仍可能生成 undefined.html');
if(!script.includes('s.hasFlipBack'))throw Error('生成器没有读取 hasFlipBack');
if(!script.includes('featuredIds')||!script.includes('recentIds'))throw Error('生成器缺少精选或最近使用场景');
if(!html.includes('id="toggleAll"')||!html.includes('id="collectionTitle"'))throw Error('生成器缺少精选/全部切换界面');
if(/仅授权购买者|永久有效/.test(html))throw Error('生成器仍包含与许可证或托管事实冲突的文案');
console.log('generator contract OK: 159 个场景、统一链接、关键字段与文案通过');
