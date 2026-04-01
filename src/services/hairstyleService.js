import axios from 'axios';

// Hair style presets
export const HAIRSTYLE_PRESETS = {
  short_cut: {
    name: '清爽短发',
    prompt: 'short hair cut, neat and clean, modern style'
  },
  long_hair: {
    name: '飘逸长发',
    prompt: 'long natural hair, flowing, elegant style'
  },
  curly_hair: {
    name: '时尚卷发',
    prompt: 'curly hair, fashionable, voluminous'
  },
  fringe: {
    name: '齐刘海',
    prompt: 'straight fringe bangs, cute style'
  },
  side_swept: {
    name: '侧分刘海',
    prompt: 'side swept bangs, professional style'
  },
  undercut: {
    name: '渐变Undercut',
    prompt: 'undercut fade, modern men haircut, stylish'
  },
  bob: {
    name: '波波头',
    prompt: 'bob haircut, classic women style, chic'
  },
  ponytail: {
    name: '高马尾',
    prompt: 'high ponytail, energetic, youthful'
  },
  bald: {
    name: '光头寸头',
    prompt: 'bald head, buzz cut, clean cut'
  },
  messy: {
    name: '纹理烫蓬松',
    prompt: 'messy textured hair, perm, voluminous, trendy'
  }
};

/**
 * Generate new hairstyle based on input face image
 * Uses DashScope image generation API
 * @param {Object} params
 * @param {String} params.imageBase64 - Base64 encoded input image (without data:image prefix)
 * @param {String} params.prompt - User custom prompt
 * @param {String} params.style - Hairstyle style key
 * @param {String} [params.apiKey] - API Key
 * @param {String} [params.baseUrl] - Base URL
 */
export const generateHairstyle = async ({ imageBase64, prompt, style, apiKey, baseUrl }) => {
  // Combine prompt
  let fullPrompt = 'Change the hairstyle on this person to: ';

  if (style && HAIRSTYLE_PRESETS[style]) {
    fullPrompt += HAIRSTYLE_PRESETS[style].prompt;
  }
  if (prompt) {
    fullPrompt += '. ' + prompt;
  }
  fullPrompt += '. Keep the person face and original composition, only change the hairstyle, make it look natural and harmonious.';

  // 1. Proxy Mode via backend (recommended)
  try {
    const apiBase = '/api/hairstyle/generate';
    const response = await axios.post(apiBase, {
      image: imageBase64,
      prompt: fullPrompt
    });

    // Response should have image_url or base64
    if (response.data && response.data.output && response.data.output.image_url) {
      return {
        prompt: prompt || style,
        imageUrl: response.data.output.image_url,
        style: style
      };
    } else if (response.data && response.data.image) {
      return {
        prompt: prompt || style,
        imageBase64: response.data.image,
        imageUrl: `data:image/png;base64,${response.data.image}`,
        style: style
      };
    }
    throw new Error('返回格式不正确');
  } catch (proxyError) {
    // If proxy fails and we have apiKey, try direct? But image generation APIs usually don't allow CORS
    if (apiKey) {
      throw new Error(`后端代理请求失败: ${proxyError.message}。由于 CORS 限制，图像生成必须使用后端代理。请确保后端服务已启动。`);
    }
    throw proxyError;
  }
};

/**
 * Convert uploaded file to Base64
 * @param {File} file
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove data:image... prefix
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
