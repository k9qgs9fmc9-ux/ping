// 布局配置
export const LAYOUTS = {
  SIDEBAR: 'sidebar',     // 侧边栏导航
  TOP: 'top',            // 顶部导航
  MIXED: 'mixed',        // 混合布局
  SCIFI: 'scifi',        // 大气科幻布局
};

export const LAYOUT_NAMES = {
  [LAYOUTS.SIDEBAR]: '侧边栏布局',
  [LAYOUTS.TOP]: '顶部导航',
  [LAYOUTS.MIXED]: '混合布局',
  [LAYOUTS.SCIFI]: '大气科幻',
};

export const LAYOUT_ICONS = {
  [LAYOUTS.SIDEBAR]: 'Layout',
  [LAYOUTS.TOP]: 'Menu',
  [LAYOUTS.MIXED]: 'Appstore',
  [LAYOUTS.SCIFI]: 'Rocket',
};

export const LAYOUT_DESCRIPTIONS = {
  [LAYOUTS.SIDEBAR]: '经典侧边栏菜单，适合模块较多的应用',
  [LAYOUTS.TOP]: '简洁顶部导航，适合模块较少的应用',
  [LAYOUTS.MIXED]: '顶部主导航 + 侧边次子导航，层次分明',
  [LAYOUTS.SCIFI]: '沉浸式设计，大气科幻风格，宽屏体验',
};
