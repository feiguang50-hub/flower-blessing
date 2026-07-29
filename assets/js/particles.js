/* ============================================================
 * flower-blessing · particles.js
 * 粒子效果工厂 —— 集中实现所有 159 张卡用到的粒子类型
 * 每个 type 接受 (count, options) 并返回初始化的 DOM 元素
 * 通过 window.Particles 暴露
 * ============================================================ */
(function () {
  'use strict';

  // 注入粒子动画 keyframes（去重，已有 keyframes 由 card-base.css 提供）
  function injectKeyframes(name, css) {
    if (document.getElementById('kf-' + name)) return;
    const style = document.createElement('style');
    style.id = 'kf-' + name;
    style.textContent = '@keyframes ' + name + '{' + css + '}';
    document.head.appendChild(style);
  }

  const rand = (min, max) => Math.random() * (max - min) + min;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  // === 通用创建器 ===
  function createParticles(layer, count, factory) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      factory(el, i);
      layer.appendChild(el);
    }
  }

  // === 粒子类型定义 ===
  const TYPES = {

    stars(layer, count, opts = {}) {
      const sizeRange = opts.sizeRange || [1, 3.5];
      const durRange = opts.durationRange || [1, 4];
      const delayRange = opts.delayRange || [0, 5];
      const color = opts.color || '#fff';
      createParticles(layer, count, (el, i) => {
        el.className = 'particle dot';
        const size = rand(sizeRange[0], sizeRange[1]);
        el.style.width = el.style.height = size + 'px';
        el.style.left = rand(0, 100) + 'vw';
        el.style.top = rand(0, 100) + 'vh';
        el.style.background = color;
        el.style.animation = `starTwinkle ${rand(durRange[0], durRange[1])}s ease-in-out ${rand(delayRange[0], delayRange[1])}s infinite`;
      });
      injectKeyframes('starTwinkle', '0%,100%{opacity:.2;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}');
    },

    petals(layer, count, opts = {}) {
      const emojis = opts.emojis || ['🌹', '🌸', '💮', '🏵️', '🌺'];
      const sizeRange = opts.sizeRange || [10, 22];
      createParticles(layer, count, (el, i) => {
        el.className = 'particle emoji';
        el.textContent = pick(emojis);
        el.style.left = rand(0, 100) + 'vw';
        el.style.fontSize = rand(sizeRange[0], sizeRange[1]) + 'px';
        el.style.animation = `petalFall ${rand(5, 12)}s linear ${rand(0, 8)}s infinite`;
        el.style.opacity = rand(0.5, 0.9);
      });
      injectKeyframes('petalFall',
        '0%{transform:translateY(-10vh) rotate(0) translateX(0);opacity:0}' +
        '10%{opacity:.8}' +
        '90%{opacity:.6}' +
        '100%{transform:translateY(108vh) rotate(360deg) translateX(40px);opacity:0}');
    },

    hearts(layer, count, opts = {}) {
      const emojis = opts.emojis || ['❤️', '💕', '💖', '💗', '💓', '💝'];
      createParticles(layer, count, (el, i) => {
        el.className = 'particle emoji';
        el.textContent = pick(emojis);
        el.style.left = rand(0, 100) + 'vw';
        el.style.fontSize = rand(12, 26) + 'px';
        el.style.animation = `heartRise ${rand(6, 12)}s linear ${rand(0, 8)}s infinite`;
      });
      injectKeyframes('heartRise',
        '0%{transform:translateY(105vh) scale(.5);opacity:0}' +
        '10%{opacity:.9;transform:translateY(95vh) scale(1)}' +
        '85%{opacity:.6}' +
        '100%{transform:translateY(-10vh) scale(.8);opacity:0}');
    },

    balloons(layer, count, opts = {}) {
      const colors = opts.colors || ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#ff922b','#cc5de8','#ff85c0'];
      createParticles(layer, count, (el, i) => {
        el.className = 'particle balloon-shape';
        el.style.left = rand(5, 95) + 'vw';
        el.style.width = '38px';
        el.style.height = '50px';
        el.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
        el.style.background = colors[i % colors.length];
        el.style.animation = `balloonRise ${rand(8, 14)}s linear ${rand(0, 8)}s infinite`;
      });
      injectKeyframes('balloonRise',
        '0%{transform:translateY(100vh) rotate(-5deg);opacity:0}' +
        '5%{opacity:.9}95%{opacity:.9}' +
        '100%{transform:translateY(-100px) rotate(5deg);opacity:0}');
    },

    snowflakes(layer, count, opts = {}) {
      const emojis = opts.emojis || ['❄️', '❅', '❆', '✻', '✼'];
      createParticles(layer, count, (el, i) => {
        el.className = 'particle emoji';
        el.textContent = pick(emojis);
        el.style.left = rand(0, 100) + 'vw';
        el.style.fontSize = rand(10, 20) + 'px';
        el.style.animation = `snowFall ${rand(6, 14)}s linear ${rand(0, 8)}s infinite`;
      });
      injectKeyframes('snowFall',
        '0%{transform:translateY(-10vh) translateX(0);opacity:0}' +
        '10%{opacity:.9}' +
        '90%{opacity:.7}' +
        '100%{transform:translateY(108vh) translateX(40px);opacity:0}');
    },

    fireflies(layer, count, opts = {}) {
      const color = opts.color || '#ffe066';
      createParticles(layer, count, (el, i) => {
        el.className = 'particle dot';
        const size = rand(2, 5);
        el.style.width = el.style.height = size + 'px';
        el.style.left = rand(0, 100) + 'vw';
        el.style.top = rand(0, 100) + 'vh';
        el.style.background = color;
        el.style.boxShadow = `0 0 ${size * 2}px ${color}`;
        el.style.animation = `fireflyMove ${rand(6, 12)}s ease-in-out ${rand(0, 5)}s infinite, fireflyGlow ${rand(1, 3)}s ease-in-out infinite`;
      });
      injectKeyframes('fireflyMove',
        '0%,100%{transform:translate(0,0)}25%{transform:translate(20px,-30px)}50%{transform:translate(-15px,-50px)}75%{transform:translate(-25px,20px)}');
      injectKeyframes('fireflyGlow',
        '0%,100%{opacity:.3}50%{opacity:1}');
    },

    bubbles(layer, count, opts = {}) {
      const emojis = opts.emojis || ['🫧', '💧', '✨', '○'];
      createParticles(layer, count, (el, i) => {
        el.className = 'particle emoji';
        el.textContent = pick(emojis);
        el.style.left = rand(0, 100) + 'vw';
        el.style.fontSize = rand(8, 18) + 'px';
        el.style.bottom = '-20px';
        el.style.animation = `bubbleRise ${rand(5, 10)}s ease-in ${rand(0, 6)}s infinite`;
      });
      injectKeyframes('bubbleRise',
        '0%{transform:translateY(0) scale(.8);opacity:0}' +
        '20%{opacity:.8}' +
        '100%{transform:translateY(-90vh) scale(1.1);opacity:0}');
    },

    leaves(layer, count, opts = {}) {
      const emojis = opts.emojis || ['🍃', '🍂', '🌿', '☘️'];
      createParticles(layer, count, (el, i) => {
        el.className = 'particle emoji';
        el.textContent = pick(emojis);
        el.style.left = rand(0, 100) + 'vw';
        el.style.fontSize = rand(14, 24) + 'px';
        el.style.animation = `leafFall ${rand(8, 14)}s linear ${rand(0, 8)}s infinite`;
      });
      injectKeyframes('leafFall',
        '0%{transform:translateY(-10vh) rotate(0);opacity:0}' +
        '10%{opacity:.9}' +
        '100%{transform:translateY(108vh) translateX(80px) rotate(540deg);opacity:0}');
    },

    sparkles(layer, count, opts = {}) {
      createParticles(layer, count, (el, i) => {
        el.className = 'particle dot';
        const size = rand(1, 3);
        el.style.width = el.style.height = size + 'px';
        el.style.left = rand(0, 100) + 'vw';
        el.style.top = rand(0, 100) + 'vh';
        el.style.background = '#fff';
        el.style.animation = `sparkleFade ${rand(2, 4)}s ease-in-out ${rand(0, 5)}s infinite`;
      });
      injectKeyframes('sparkleFade',
        '0%,100%{opacity:.1;transform:scale(.5)}50%{opacity:1;transform:scale(1.2)}');
    },

    // 极光背景层（不是粒子，是一个固定的 div）
    aurora(layer, opts = {}) {
      layer.classList.add('has-aurora');
      const style = document.createElement('style');
      const c1 = opts.color1 || 'rgba(200,50,100,0.3)';
      const c2 = opts.color2 || 'rgba(150,20,80,0.25)';
      const c3 = opts.color3 || 'rgba(255,100,150,0.12)';
      style.textContent = `
        .bg-layer.has-aurora::before, .bg-layer.has-aurora::after {
          content: ''; position: absolute; inset: 0;
          pointer-events: none;
        }
        .bg-layer.has-aurora::before {
          background:
            radial-gradient(ellipse at 30% 20%, ${c1} 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, ${c2} 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, ${c3} 0%, transparent 60%);
          animation: auroraMove 9s ease-in-out infinite;
        }
        .bg-layer.has-aurora::after {
          background:
            radial-gradient(ellipse at 20% 70%, ${c1} 0%, transparent 45%),
            radial-gradient(ellipse at 80% 30%, ${c2} 0%, transparent 50%);
          animation: auroraMove 12s ease-in-out infinite reverse;
        }
        @keyframes auroraMove {
          0%,100% { transform: scale(1) translate(0,0); opacity: .8; }
          50%     { transform: scale(1.05) translate(1%,1%); opacity: 1; }
        }`;
      document.head.appendChild(style);
    },

    // 网格背景
    grid(layer, opts = {}) {
      const color = opts.color || 'rgba(255,255,255,0.05)';
      layer.style.backgroundImage =
        `linear-gradient(${color} 1px, transparent 1px),` +
        `linear-gradient(90deg, ${color} 1px, transparent 1px)`;
      layer.style.backgroundSize = '40px 40px';
    },

    // 装饰 emoji（如顶部"✦ HAPPY BIRTHDAY ✦"）
    decoration: null  // 占位，由 card.js 通过 renderDecorations 处理
  };

  window.Particles = {
    spawn(layer, type, count, options) {
      const fn = TYPES[type];
      if (!fn) {
        console.warn('[particles] unknown type:', type);
        return;
      }
      fn(layer, count, options);
    },
    types: Object.keys(TYPES).filter(k => k !== 'decoration')
  };
})();
