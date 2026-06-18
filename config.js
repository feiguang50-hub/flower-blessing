// 配置文件 - 姐姐以后改这里就行，不用动代码

const CONFIG = {
  // 花材选项（显示名称+对应的CSS变量）
  materials: [
    { value: 'amethyst',   label: '紫水晶',   labelEn: 'Amethyst',   color1: '#c084fc', color2: '#7c3aed' },
    { value: 'stream',     label: '流水',     labelEn: 'Stream',     color1: '#7dd3fc', color2: '#0ea5e9' },
    { value: 'stardust',   label: '星尘',     labelEn: 'Stardust',   color1: '#fde68a', color2: '#f59e0b' },
    { value: 'frost',      label: '霜晶',     labelEn: 'Frost',      color1: '#e0f2fe', color2: '#bae6fd' },
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

  // 版权信息
  copyright: '私人定制 · 仅供授权使用',
};
