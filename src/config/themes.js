// 主题配置
export const THEMES = {
  DEFAULT: 'default',  // 简约默认主题
  GRAND: 'grand',
  TECH: 'tech',
  COOL: 'cool',
  FUSION: 'fusion',
};

export const THEME_NAMES = {
  [THEMES.DEFAULT]: '简约默认',
  [THEMES.GRAND]: '大气商务',
  [THEMES.TECH]: '未来科技',
  [THEMES.COOL]: '炫酷赛博',
  [THEMES.FUSION]: '至尊融合',
};

export const THEME_COLORS = {
  [THEMES.DEFAULT]: {
    primary: '#0062ff',      // 科技蓝
    secondary: '#1677ff',    // Ant Design 蓝
    accent: '#722ed1',       // 紫色点缀
    gradient: 'transparent', // 无渐变背景
    bgPrimary: 'transparent',
    bgContainer: 'rgba(255, 255, 255, 0.7)',
    textPrimary: '#1f1f1f',
    textSecondary: '#666666',
    border: 'rgba(0, 98, 255, 0.15)',
    shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
    glow: 'none',
  },
  [THEMES.GRAND]: {
    primary: '#1a365d',      // 深海蓝
    secondary: '#d4af37',    // 金色
    accent: '#2c5282',       // 皇家蓝
    gradient: 'linear-gradient(135deg, #1a365d 0%, #2c5282 50%, #d4af37 100%)',
    bgPrimary: 'rgba(26, 54, 93, 0.05)',
    bgContainer: 'rgba(255, 255, 255, 0.7)',
    textPrimary: '#1a202c',
    textSecondary: '#4a5568',
    border: 'rgba(26, 54, 93, 0.15)',
    shadow: '0 8px 32px 0 rgba(26, 54, 93, 0.1)',
    glow: '0 0 20px rgba(212, 175, 55, 0.3)',
  },
  [THEMES.TECH]: {
    primary: '#00d4ff',      // 电光青
    secondary: '#0066ff',    // 科技蓝
    accent: '#00ff88',       // 霓虹绿
    gradient: 'linear-gradient(135deg, #00d4ff 0%, #0066ff 50%, #00ff88 100%)',
    bgPrimary: 'rgba(0, 212, 255, 0.05)',
    bgContainer: 'rgba(15, 23, 42, 0.8)',
    textPrimary: '#e2e8f0',
    textSecondary: '#94a3b8',
    border: 'rgba(0, 212, 255, 0.3)',
    shadow: '0 8px 32px 0 rgba(0, 212, 255, 0.15)',
    glow: '0 0 20px rgba(0, 212, 255, 0.4)',
  },
  [THEMES.COOL]: {
    primary: '#ff006e',      // 赛博粉
    secondary: '#8338ec',    // 电光紫
    accent: '#3a86ff',       // 数字蓝
    gradient: 'linear-gradient(135deg, #ff006e 0%, #8338ec 50%, #3a86ff 100%)',
    bgPrimary: 'rgba(255, 0, 110, 0.05)',
    bgContainer: 'rgba(20, 0, 40, 0.85)',
    textPrimary: '#fafafa',
    textSecondary: '#c4b5fd',
    border: 'rgba(255, 0, 110, 0.3)',
    shadow: '0 8px 32px 0 rgba(255, 0, 110, 0.2)',
    glow: '0 0 30px rgba(255, 0, 110, 0.5)',
  },
  [THEMES.FUSION]: {
    primary: '#6366f1',      // 紫蓝渐变主色
    secondary: '#8b5cf6',    // 紫罗兰
    accent: '#06b6d4',       // 青色点缀
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 25%, #4c1d95 50%, #701a75 75%, #be185d 100%)',
    bgPrimary: 'rgba(30, 27, 75, 0.3)',
    bgContainer: 'rgba(15, 23, 42, 0.75)',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    border: 'rgba(99, 102, 241, 0.4)',
    shadow: '0 8px 32px 0 rgba(99, 102, 241, 0.25), 0 0 0 1px rgba(99, 102, 241, 0.1)',
    glow: '0 0 40px rgba(99, 102, 241, 0.4), 0 0 80px rgba(139, 92, 246, 0.2)',
    particle: '#8b5cf6',
  },
};

// 获取 Ant Design 主题配置
export const getAntTheme = (themeKey) => {
  const colors = THEME_COLORS[themeKey];
  
  return {
    token: {
      colorPrimary: colors.primary,
      colorBgContainer: colors.bgContainer,
      colorBorder: colors.border,
      colorText: colors.textPrimary,
      colorTextSecondary: colors.textSecondary,
      borderRadius: 12,
      fontFamily: "'JetBrains Mono', 'Fira Code', Inter, system-ui, sans-serif",
    },
    components: {
      Button: {
        colorPrimary: colors.primary,
        algorithm: true,
        borderColorDisabled: 'rgba(0,0,0,0.05)',
        defaultShadow: `0 2px 0 ${colors.primary}20`,
        primaryShadow: `0 2px 0 ${colors.primary}30`,
      },
      Input: {
        colorBgContainer: colors.bgContainer,
        activeBorderColor: colors.primary,
        hoverBorderColor: colors.primary,
        activeShadow: `0 0 0 2px ${colors.primary}20`,
      },
      Card: {
        colorBgContainer: colors.bgContainer,
        boxShadow: colors.shadow,
      },
      Menu: {
        colorBgContainer: colors.bgContainer,
        colorItemBgSelected: colors.primary + '15',
        colorItemTextSelected: colors.primary,
      },
    },
  };
};
