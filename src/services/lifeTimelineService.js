import axios from 'axios';
import OpenAI from 'openai';

/**
 * Parse diary content and extract life timeline events using AI
 * @param {Object} params
 * @param {String} params.diaryContent - The raw diary content
 * @param {String} [params.apiKey] - API Key (if direct mode)
 * @param {String} [params.baseUrl] - Base URL (if direct mode)
 */
export const parseDiaryContent = async ({ diaryContent, apiKey, baseUrl }) => {
  const systemPrompt = `你是一个专业的人生轨迹分析助手。请根据用户提供的日记内容，提取出关键的人生事件和时间节点，生成一个结构化的人生时间轴。

请按照以下要求处理：
1. 提取所有重要的人生事件：出生、求学、工作、婚姻、重要成就、重大转折、关键关系等
2. 为每个事件确定准确的年份（如果日记中没有明确年份，请根据上下文推断出大概年份）
3. 为每个事件添加简短的描述
4. 按照时间顺序排序所有事件
5. 识别出人生的不同阶段（童年、青少年、青年、中年等）

你必须返回JSON格式，不要返回其他内容。JSON格式如下：
{
  "title": "人生标题，比如：XXX的人生轨迹",
  "birthYear": 出生年份（数字，如果不知道就不填），
  "currentYear": 当前年份（数字），
  "stages": [
    {
      "name": "阶段名称，比如：童年时期",
      "startYear": 开始年份,
      "endYear": 结束年份,
      "description": "阶段描述"
    }
  ],
  "events": [
    {
      "id": "唯一ID，从1开始递增",
      "year": 年份（数字）,
      "month": 月份（数字，可选，不知道就不填）,
      "title": "事件标题",
      "description": "事件详细描述",
      "category": "事件分类：education/career/family/achievement/milestone/other",
      "importance": 重要程度 1-5，5最重要
    }
  ],
  "summary": "整个人生轨迹的简短总结"
}

分类说明：
- education: 教育相关（上学、毕业、留学等）
- career: 职业相关（工作、换工作、创业等）
- family: 家庭相关（出生、结婚、生子、亲人离世等）
- achievement: 成就、获奖、重要成果
- milestone: 重要里程碑（搬家、移民、重大转折等）
- other: 其他

重要程度说明：
- 1: 一般事件
- 3: 比较重要
- 5: 人生重大事件，请严格控制只有最重要的事件才给5分

请确保输出是合法的JSON，不要有任何其他文字说明。`;

  const userMessage = `请处理以下日记内容，生成我的人生时间轴：\n\n${diaryContent}`;

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
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        response_format: { type: 'json_object' }
      });

      const resultText = completion.choices[0].message.content;
      try {
        return JSON.parse(resultText);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', resultText);
        throw new Error('AI返回格式错误，无法解析，请重试');
      }
    } catch (error) {
      if (error.message && error.message.includes('Network Error')) {
        throw new Error(`网络请求失败。这可能是由于 CORS 跨域限制导致的。在纯前端模式下，请尝试安装允许跨域的浏览器插件，或使用支持 CORS 的代理地址。\n原始错误: ${error.message}`);
      }
      throw error;
    }
  }

  // 2. Proxy Mode: Fallback to backend server
  const apiBase = '/api/life-timeline/parse';

  try {
    const response = await axios.post(apiBase, {
      diaryContent: diaryContent,
      systemPrompt: systemPrompt
    });

    // Backend should return parsed JSON directly
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      throw new Error("检测到无后端服务，且未配置 API Key。请点击左下角“全局设置”填入 API Key 以使用纯前端模式。");
    }
    throw error;
  }
};

/**
 * Export timeline canvas as video file using canvas-capture
 * This is handled client-side, no backend needed
 */
export const exportTimelineVideo = async (canvasRef, options = {}) => {
  const { fps = 30, duration = 15, onProgress } = options;

  // Check if canvas-capture is available
  if (!window.CanvasCapture) {
    throw new Error('CanvasCapture 库未加载，请刷新页面重试');
  }

  const canvas = canvasRef.current;
  if (!canvas) {
    throw new Error('Canvas 元素未找到');
  }

  const mediaRecorder = new window.CanvasCapture.MediaRecorder(canvas, {
    fps: fps,
    videoBitsPerSecond: 5000000 // 5 Mbps
  });

  return new Promise((resolve, reject) => {
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve({ blob, url: URL.createObjectURL(blob) });
    };

    mediaRecorder.onerror = (event) => {
      reject(new Error(`视频录制错误: ${event.error}`));
    };

    mediaRecorder.start();

    // Simulate progress updates
    let elapsed = 0;
    const interval = duration / 100;
    const timer = setInterval(() => {
      elapsed += interval;
      if (onProgress) {
        onProgress(Math.min(elapsed / duration, 1));
      }
      if (elapsed >= duration) {
        clearInterval(timer);
        mediaRecorder.stop();
      }
    }, interval * 1000);
  });
};
