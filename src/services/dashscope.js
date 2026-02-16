import axios from 'axios';
import OpenAI from 'openai';

// API Service to handle both Direct (Frontend-only) and Proxy (Backend) requests

/**
 * Chat Completion Request
 * @param {Object} params
 * @param {Array} params.messages - Chat messages
 * @param {String} [params.apiKey] - API Key (if direct mode)
 * @param {String} [params.baseUrl] - Base URL (if direct mode)
 */
export const sendChatRequest = async ({ messages, apiKey, baseUrl }) => {
  // 1. Direct Mode: If API Key is provided, use OpenAI SDK directly in browser
  if (apiKey) {
    const openai = new OpenAI({
      apiKey: apiKey,
      baseURL: baseUrl || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      dangerouslyAllowBrowser: true 
    });

    try {
      const completion = await openai.chat.completions.create({
        model: 'qwen-max',
        messages: messages,
      });
      return completion.choices[0].message;
    } catch (error) {
      // Enhance error message for CORS
      if (error.message && error.message.includes('Network Error')) { // Axios/Fetch often report CORS as Network Error
        throw new Error(`网络请求失败。这可能是由于 CORS 跨域限制导致的。在纯前端模式下，请尝试安装允许跨域的浏览器插件，或使用支持 CORS 的代理地址。\n原始错误: ${error.message}`);
      }
      throw error;
    }
  }

  // 2. Proxy Mode: Fallback to backend server
  // Always use relative path to rely on Vite Proxy (Dev) or Same-Origin (Prod)
  const apiBase = '/api/chat';
  
  try {
    const response = await axios.post(apiBase, { messages });
    return response.data.choices[0].message;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("检测到无后端服务，且未配置 API Key。请点击左下角“全局设置”填入 API Key 以使用纯前端模式。");
    }
    throw error;
  }
};

/**
 * Video Generation Request
 * @param {Object} params
 * @param {String} params.prompt
 * @param {String} [params.apiKey]
 */
export const submitVideoTask = async ({ prompt, apiKey }) => {
  // 1. Try Proxy Mode first (Recommended to avoid CORS)
  try {
    const apiBase = '/api/video/generation';
    const headers = {
      'Content-Type': 'application/json'
    };
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await axios.post(
      apiBase,
      {
        model: 'wan2.6-t2v',
        input: { prompt },
        parameters: { size: '1280*720' }
      },
      { headers }
    );
    return response.data;
  } catch (proxyError) {
    // If Proxy fails (e.g. 404 Not Found -> No Backend), fallback to Direct Mode
    // Only if apiKey is provided
    if (apiKey && (proxyError.response?.status === 404 || proxyError.code === 'ERR_NETWORK')) {
      console.warn('Proxy mode failed, falling back to direct mode:', proxyError.message);
      try {
        const response = await axios.post(
          'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis',
          {
            model: 'wan2.6-t2v',
            input: { prompt },
            parameters: { size: '1280*720' }
          },
          {
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'X-DashScope-Async': 'enable',
              'Content-Type': 'application/json'
            }
          }
        );
        return response.data;
      } catch (directError) {
        if (directError.code === 'ERR_NETWORK' || directError.message.includes('Network Error')) {
           throw new Error(`网络请求失败 (CORS)。阿里云视频生成 API 不支持浏览器直接跨域访问。请确保本地开启了后端服务 (node server/index.js) 或配置了正确的代理。`);
        }
        throw directError;
      }
    }
    throw proxyError;
  }
};

/**
 * Check Video Task Status
 * @param {String} taskId
 * @param {String} [apiKey]
 */
export const checkVideoTask = async (taskId, apiKey) => {
  // 1. Try Proxy Mode first
  try {
    const apiBase = `/api/video/tasks/${taskId}`;
    const headers = {};
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    const response = await axios.get(apiBase, { headers });
    return response.data;
  } catch (proxyError) {
    // 2. Fallback to Direct Mode if Proxy is unavailable
    if (apiKey && (proxyError.response?.status === 404 || proxyError.code === 'ERR_NETWORK')) {
      try {
        const response = await axios.get(
          `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
          {
            headers: { 'Authorization': `Bearer ${apiKey}` }
          }
        );
        return response.data;
      } catch (directError) {
        throw directError;
      }
    }
    throw proxyError;
  }
};
