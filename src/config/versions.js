/**
 * 版本控制配置
 */

export const VERSIONS = {
  PUBLIC: 'public',      // 公开版
  PRIVATE: 'private',    // 私有版
  CREATION: 'creation',  // 创造版
};

export const ACCESS_KEYS = {
  PRIVATE: 'ai999',  // 私有版密钥
  CREATION: 'ai888', // 创造版密钥
};

export const VERSION_INFO = {
  [VERSIONS.PUBLIC]: {
    name: '公开版',
    description: '免费使用基础功能',
    features: ['智能对话', 'PPT生成', 'Excel助手', '文件分析'],
  },
  [VERSIONS.PRIVATE]: {
    name: '私有版',
    description: '解锁更多高级功能',
    features: ['公开版所有功能', '视频生成', '股票分析'],
  },
  [VERSIONS.CREATION]: {
    name: '创造版',
    description: '体验全部功能',
    features: ['私有版所有功能', '账单管理', '国学命理', '优先技术支持'],
  },
};

/**
 * 根据密钥获取版本
 */
export const getVersionByKey = (key) => {
  if (!key) return VERSIONS.PUBLIC;
  if (key === ACCESS_KEYS.CREATION) return VERSIONS.CREATION;
  if (key === ACCESS_KEYS.PRIVATE) return VERSIONS.PRIVATE;
  return VERSIONS.PUBLIC;
};

/**
 * 为每个版本定义可用的模块
 */
export const MODULE_PERMISSIONS = {
  [VERSIONS.PUBLIC]: ['home', 'chat', 'ppt', 'excel', 'file'],
  [VERSIONS.PRIVATE]: ['home', 'chat', 'ppt', 'excel', 'file', 'video', 'stock'],
  [VERSIONS.CREATION]: ['home', 'chat', 'ppt', 'excel', 'file', 'video', 'stock', 'bill', 'destiny'],
};

/**
 * 检查某个模块在版本中是否可用
 */
export const isModuleAvailable = (version, moduleKey) => {
  return MODULE_PERMISSIONS[version]?.includes(moduleKey) || false;
};
