/**
 * 常量
 */
export default {
  // API地址
  apiUrl: import.meta.env.VITE_API_URL,

  // 环境变量
  env: {
    MODE: import.meta.env.MODE,
    PROD: import.meta.env.PROD,
    DEV: import.meta.env.DEV,
    SSR: import.meta.env.SSR
  }
}
