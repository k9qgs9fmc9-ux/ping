
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const OpenAI = require('openai');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3003;
const DEFAULT_API_KEY = 'sk-62c624e8f0f2403da26b02aa348ec860';

app.use(cors());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/ping', express.static(path.join(__dirname, '../dist')));

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  const apiKey = process.env.DASHSCOPE_API_KEY || DEFAULT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
  }

  const openai = new OpenAI({
    apiKey: apiKey,
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  });

  try {
    const completion = await openai.chat.completions.create({
      model: 'qwen-max',
      messages: messages,
    });

    res.json(completion);
  } catch (error) {
    console.error('Error calling DashScope:', error);
    res.status(500).json({ 
      error: 'Failed to fetch response from Qwen',
      details: error.message
    });
  }
});

// Proxy for Video Generation (Submit Task)
app.post('/api/video/generation', async (req, res) => {
  const apiKey = req.headers.authorization?.split(' ')[1] || process.env.DASHSCOPE_API_KEY || DEFAULT_API_KEY;
  
  if (!apiKey) {
    return res.status(401).json({ error: 'API Key required' });
  }

  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis',
      req.body,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'X-DashScope-Async': 'enable',
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Video Generation Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// Proxy for Video Task Status
app.get('/api/video/tasks/:taskId', async (req, res) => {
  const apiKey = req.headers.authorization?.split(' ')[1] || process.env.DASHSCOPE_API_KEY || DEFAULT_API_KEY;
  const { taskId } = req.params;

  if (!apiKey) {
    return res.status(401).json({ error: 'API Key required' });
  }

  try {
    const response = await axios.get(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Task Status Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: error.message });
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
