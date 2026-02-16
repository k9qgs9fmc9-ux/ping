/**
 * 版本控制配置
 */

export const VERSIONS = {
  PUBLIC: 'public',      // 公开版
  PRIVATE: 'private',    // 私有版
  CREATION: 'creation',  // 创造版
};

export const ACCESS_KEYS = {
  PRIVATE: '秘银ai999',  // 私有版密钥
  CREATION: '秘银ai888', // 创造版密钥
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
  [VERSIONS.CREATION]: ['home', 'chat', 'ppt', 'excel', 'file', 'video', 'stock', 'bill'],
};

/**
 * 检查某个模块在版本中是否可用
 */
export const isModuleAvailable = (version, moduleKey) => {
  return MODULE_PERMISSIONS[version]?.includes(moduleKey) || false;
};
