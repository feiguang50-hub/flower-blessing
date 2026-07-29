/* ============================================================
 * flower-blessing · card.js
 * 主渲染逻辑 —— 读 URL 参数 → 加载场景配置 → 渲染卡片
 * 安全：所有用户输入通过 textContent 写入，URL 参数不进入 innerHTML
 * ============================================================ */
(function () {
  'use strict';

  // === URL 参数 ===
  const params = new URLSearchParams(location.search);
  const sceneId = params.get('scene') || guessScene();
  const nameInput = params.get('n');
  const blessingInput = params.get('b');
  const fromInput = params.get('f');
  const dateInput = params.get('d');
  const iconInput = params.get('i');
  const backInput = params.get('back');

  // 从当前页 URL 末尾猜测场景（如 card-birthday.html → birthday）
  function guessScene() {
    const file = location.pathname.split('/').pop() || '';
    const m = file.match(/^card-(.+)\.html$/);
    return m ? m[1] : 'birthday';
  }

  // === 加载场景配置 ===
  fetch('assets/scenes.json', { cache: 'no-store' })
    .then(r => {
      if (!r.ok) throw new Error('scenes.json HTTP ' + r.status);
      return r.json();
    })
    .then(data => {
      const scene = data.scenes[sceneId];
      if (!scene) {
        renderError(`未找到场景 "${sceneId}"。可选场景：${Object.keys(data.scenes).slice(0, 8).join(', ')}…`);
        return;
      }
      renderScene(scene);
    })
    .catch(err => {
      console.error('[card] load failed:', err);
      renderError('场景配置加载失败：' + err.message);
    });

  // === 渲染场景 ===
  function renderScene(scene) {
    // 1. 标题与 OG meta
    document.title = scene.title || '贺卡';
    setMeta('og-title', (scene.ogEmoji || '💌') + ' 收到一份专属贺卡');
    setMeta('theme-color', extractFirstColor(scene.theme && scene.theme.bgGradient) || '#1a1a2e');

    // 2. 注入主题 CSS（覆盖默认变量 + 边框动画）
    const themeCss = buildThemeCss(scene);
    injectStyle('scene-theme', themeCss);

    // 3. 卡片内容（全部走 textContent，无 XSS 风险）
    const icon = iconInput || scene.icon || '💌';
    setText('icon', icon);
    setText('happy-label', scene.happyLabel || '');
    setText('title-el', scene.titleEl || scene.title || '');
    setText('nameEl', nameInput || scene.defaultName || '');
    setText('ageEl', computeAge(dateInput) || '');
    setText('dateEl', dateInput || scene.defaultDate || '');
    setText('blessingEl', blessingInput || scene.defaultBlessing || '');
    setText('fromEl', fromInput ? '— ' + fromInput : '');
    setText('trailing', scene.trailing || '');
    setText('backEl', backInput || scene.defaultBack || '点击卡片\n翻开惊喜');

    // 4. 控制 hidden 状态
    toggleVisible('happy-label', !!scene.happyLabel);
    toggleVisible('title-el', !!(scene.titleEl || (scene.title && scene.title !== scene.ogEmoji)));
    toggleVisible('age-row', scene.layout && scene.layout.includes('age'));
    toggleVisible('date', scene.layout && scene.layout.includes('date'));
    toggleVisible('from', !!(fromInput || scene.defaultFrom));
    toggleVisible('trailing', !!scene.trailing);

    // 5. 背景层（极光 / 网格 / 纯色）
    const bgLayer = document.querySelector('[data-bind="bg-layer"]');
    if (bgLayer && scene.background) {
      const bg = scene.background;
      if (bg.aurora) {
        window.Particles.spawn(bgLayer, 'aurora', 0, bg.aurora);
      }
      if (bg.grid) {
        window.Particles.spawn(bgLayer, 'grid', 0, bg.grid);
      }
    }

    // 6. 粒子
    const partLayer = document.querySelector('[data-bind="particle-layer"]');
    if (partLayer && Array.isArray(scene.particles)) {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!reducedMotion) {
        scene.particles.forEach(p => {
          window.Particles.spawn(partLayer, p.type, p.count || 20, p.options || {});
        });
      }
    }

    // 7. 翻转卡片
    if (scene.flipBack) {
      const wrap = document.getElementById('cardWrap');
      wrap.classList.add('flippable');
      wrap.addEventListener('click', () => {
        document.getElementById('flipBack').classList.add('shown');
      });
    }
  }

  // === 错误回退 ===
  function renderError(msg) {
    setText('blessingEl', msg);
    setText('nameEl', '⚠️');
  }

  // === Helpers ===
  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
  }

  function setMeta(bind, content) {
    document.querySelectorAll('[data-bind="' + bind + '"]').forEach(el => {
      el.setAttribute('content', content);
    });
  }

  function toggleVisible(bind, visible) {
    const el = document.querySelector('[data-bind="' + bind + '"]');
    if (el) {
      if (visible) el.removeAttribute('hidden');
      else el.setAttribute('hidden', '');
    }
  }

  function injectStyle(id, css) {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      document.head.appendChild(el);
    }
    el.textContent = css;
  }

  function buildThemeCss(scene) {
    const t = scene.theme || {};
    const vars = [];
    if (t.bgGradient)        vars.push(`--bg-grad: ${t.bgGradient};`);
    if (t.borderGradient)    vars.push(`--border-grad: ${t.borderGradient};`);
    if (t.primary)           vars.push(`--primary: ${t.primary};`);
    if (t.textOnCard)        vars.push(`--text-on-card: ${t.textOnCard};`);
    if (t.textMuted)         vars.push(`--text-on-card-muted: ${t.textMuted};`);
    if (t.textFaint)         vars.push(`--text-on-card-faint: ${t.textFaint};`);
    if (t.cardBg)            vars.push(`--card-bg: ${t.cardBg};`);
    if (t.cardPadding)       vars.push(`--card-padding: ${t.cardPadding};`);
    if (t.cardRadius)        vars.push(`--card-radius: ${t.cardRadius};`);
    if (t.cardMaxWidth)      vars.push(`--card-max-width: ${t.cardMaxWidth};`);
    if (t.fontFamily)        vars.push(`--font-display: ${t.fontFamily};`);
    let css = `:root{${vars.join('')}}`;
    if (t.cardBgBlur !== false) css += `.card{backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);}`;
    if (scene.flipBack) css += `.card-wrap.flippable{cursor:pointer;}`;
    return css;
  }

  function computeAge(dateStr) {
    if (!dateStr) return null;
    const year = parseInt(String(dateStr).split(/[年月日.\-]/)[0], 10);
    if (!year || year < 1900) return null;
    const age = new Date().getFullYear() - year;
    if (age > 0 && age < 150) return age;
    return null;
  }

  function extractFirstColor(gradient) {
    if (!gradient) return null;
    const m = String(gradient).match(/#[0-9a-fA-F]{3,8}/);
    return m ? m[0] : null;
  }

  // 暴露给调试
  window.CardRenderer = { sceneId };
})();
