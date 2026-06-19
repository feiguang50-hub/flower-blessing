// 配置文件 - 姐姐以后改这里就行

const CONFIG = {
  // 花材选项
  materials: [
    { value: 'amethyst',  label: '紫水晶',  labelEn: 'Amethyst',  color1: '#c084fc', color2: '#7c3aed', glow: '#c084fc' },
    { value: 'stream',     label: '流水',    labelEn: 'Stream',     color1: '#7dd3fc', color2: '#0ea5e9', glow: '#7dd3fc' },
    { value: 'stardust',   label: '星尘',    labelEn: 'Stardust',   color1: '#fde68a', color2: '#f59e0b', glow: '#fde68a' },
    { value: 'frost',      label: '霜晶',    labelEn: 'Frost',      color1: '#e0f2fe', color2: '#bae6fd', glow: '#e0f2fe' },
    { value: 'gold',       label: '熔金',    labelEn: 'Molten Gold', color1: '#fde68a', color2: '#d97706', glow: '#fbbf24' },
    { value: 'ruby',       label: '红宝石',  labelEn: 'Ruby',       color1: '#fda4af', color2: '#e11d48', glow: '#fb7185' },
    { value: 'jade',       label: '翡翠',    labelEn: 'Jade',       color1: '#86efac', color2: '#059669', glow: '#34d399' },
  ],

  // 花材形态选项
  shapes: [
    { value: 'round',    label: '圆形',    labelEn: 'Classic',  desc: '经典六瓣花' },
    { value: 'tulip',    label: '郁金香',  labelEn: 'Tulip',    desc: '优雅长瓣' },
    { value: 'rose',     label: '玫瑰',    labelEn: 'Rose',     desc: '层叠花瓣' },
    { value: 'carnation',label: '康乃馨',  labelEn: 'Carnation',desc: '轻盈羽毛' },
  ],

  // 排布选项
  arrangements: [
    { value: 'hemisphere', label: '半球形', scene: '温馨祝福 · 生日 · 探病' },
    { value: 'vertical',   label: '垂直形', scene: '庄重纪念 · 开业 · 典礼' },
    { value: 'lshape',     label: 'L 形',   scene: '空间装饰 · 壁面 · 餐桌' },
    { value: 'horizontal', label: '水平形', scene: '茶几 · 书桌 · 婚礼' },
    { value: 'triangle',   label: '三角形', scene: '正式场合 · 演讲台 · 典礼' },
  ],

  // 默认祝福语
  defaultBlessing: '愿你如星般璀璨',

  // 主题选项
  themes: [
    { value: 'sakura',   label: '樱花飘落',  icon: '🌸', desc: '粉嫩花瓣·生日祝福' },
    { value: 'star',     label: '星空许愿',  icon: '⭐', desc: '流星划过·许愿专属' },
    { value: 'firework', label: '烟花绽放',  icon: '🎆', desc: '热闹喜庆·节日必备' },
    { value: 'bouquet',  label: '动漫花束',  icon: '💐', desc: '温馨花束·探病祝福' },
  ],

  // 版权信息
  copyright: '私人定制 · 仅供授权使用',

  // 背景音乐URL（留空则不播放，需要音乐可填入URL）
  bgmUrl: '',
};
