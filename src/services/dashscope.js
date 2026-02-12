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
  // 1. Direct Mode
  if (apiKey) {
    // DashScope Video API currently does not support OpenAI SDK, using axios
    // Warning: Likely to fail CORS
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
    } catch (error) {
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        throw new Error(`暂不支持该服务！！！`)
        // throw new Error(`网络请求失败 (CORS)。阿里云视频生成 API 不支持浏览器直接跨域访问。纯前端模式下暂无法直接生成视频，除非使用自定义代理。`);
      }
      throw error;
    }
  }

  // 2. Proxy Mode
  const apiBase = '/api/video/generation';
  const response = await axios.post(
    apiBase,
    {
      model: 'wan2.6-t2v',
      input: { prompt },
      parameters: { size: '1280*720' }
    }
  );
  return response.data;
};

/**
 * Check Video Task Status
 * @param {String} taskId
 * @param {String} [apiKey]
 */
export const checkVideoTask = async (taskId, apiKey) => {
  if (apiKey) {
    try {
      const response = await axios.get(
        `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
        {
          headers: { 'Authorization': `Bearer ${apiKey}` }
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  const apiBase = `/api/video/tasks/${taskId}`;
  const response = await axios.get(apiBase);
  return response.data;
};
