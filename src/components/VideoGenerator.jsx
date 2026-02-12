import React, { useState, useEffect } from 'react';
import { Button, Input, Card, Typography, Space, Progress, Result, Empty, message, Alert, Modal, Tooltip, Grid } from 'antd';
import { VideoCameraOutlined, PlayCircleOutlined, DownloadOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { submitVideoTask, checkVideoTask } from '../services/dashscope';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const VideoGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const [statusText, setStatusText] = useState('');
  
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  // Use Global Settings
  const { apiKey, openSettings } = useSettings();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Allow empty apiKey for Proxy Mode (Backend)
    // if (!apiKey) {
    //   openSettings();
    //   message.warning('请先配置 DashScope API Key');
    //   return;
    // }

    setLoading(true);
    setProgress(0);
    setVideoUrl(null);
    setError(null);
    setStatusText('正在提交任务...');

    try {
      // Step 1: Submit Task
      let data;
      try {
        data = await submitVideoTask({ prompt, apiKey });
      } catch (submitError) {
        throw submitError;
      }

      if (!data || !data.output || !data.output.task_id) {
        throw new Error(data.message || '任务提交失败，未获取到 Task ID');
      }

      const taskId = data.output.task_id;
      setStatusText('任务提交成功，正在生成视频...');
      setProgress(10);

      // Step 2: Poll Status
      const pollInterval = setInterval(async () => {
        try {
          const statusData = await checkVideoTask(taskId, apiKey);
          
          if (statusData.output && statusData.output.task_status === 'SUCCEEDED') {
            clearInterval(pollInterval);
            setVideoUrl(statusData.output.video_url);
            setLoading(false);
            setProgress(100);
            setStatusText('生成完成！');
            message.success('视频生成成功！');
          } else if (statusData.output && statusData.output.task_status === 'FAILED') {
            clearInterval(pollInterval);
            setLoading(false);
            setError(statusData.output.message || '生成失败');
            message.error('视频生成失败');
          } else {
             // Update progress (fake or estimated)
             setProgress((prev) => prev < 90 ? prev + 5 : 90);
          }
        } catch (err) {
          console.error('Polling Error:', err);
          // Don't stop polling immediately on network transient error, but maybe warn?
          // For simplicity, we just log. If it persists, user will see stuck progress.
        }
      }, 3000);

    } catch (err) {
      console.error('Generation Error:', err);
      setError(err.message || '请求失败');
      setLoading(false);
      message.error(err.message || '请求失败');
    }
  };

  return (
    <div style={{ height: '100%', padding: isMobile ? '12px' : '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 16 : 32 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: isMobile ? '16px' : '20px' }}>
            <VideoCameraOutlined style={{ marginRight: 12, color: '#0062ff' }} />
            视频生成助手 (Wan2.1)
          </Title>
          {/* <Tooltip title="设置 API Key">
            <Button 
              icon={<SettingOutlined />} 
              onClick={openSettings}
              type="text"
              size="large"
            />
          </Tooltip> */}
        </div>

        <Card 
          bordered={false} 
          style={{ 
            background: 'rgba(255, 255, 255, 0.6)', 
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
            marginBottom: 24
          }}
          bodyStyle={{ padding: isMobile ? 16 : 24 }}
        >
          {isMobile ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Input 
                size="large" 
                placeholder="描述你想生成的视频内容..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onPressEnter={handleGenerate}
                disabled={loading}
              />
              <Button 
                type="primary" 
                size="large" 
                icon={<SendOutlined />} 
                loading={loading}
                onClick={handleGenerate}
                block
              >
                生成
              </Button>
            </div>
          ) : (
            <Space.Compact style={{ width: '100%' }}>
              <Input 
                size="large" 
                placeholder="描述你想生成的视频内容，例如：一只在太空中飞翔的熊猫，赛博朋克风格..." 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onPressEnter={handleGenerate}
                disabled={loading}
              />
              <Button 
                type="primary" 
                size="large" 
                icon={<SendOutlined />} 
                loading={loading}
                onClick={handleGenerate}
              >
                生成
              </Button>
            </Space.Compact>
          )}
          <div style={{ marginTop: 8 }}>
            {/* <Text type="secondary" style={{ fontSize: 12 }}>
              * 使用阿里云通义万相 (Wanx) 模型生成，需要消耗 DashScope API Token。生成过程可能需要几分钟。
            </Text> */}
          </div>
        </Card>

        {error && (
          <Alert
            message="生成出错"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 24 }}
          />
        )}

        <Card className="glass-panel" bordered={false} bodyStyle={{ padding: isMobile ? 20 : 40, minHeight: isMobile ? 300 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {loading ? (
            <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
              <Progress type="circle" percent={progress} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} size={isMobile ? 120 : 180} />
              <div style={{ marginTop: 24 }}>
                <Text strong style={{ fontSize: 16 }}>{statusText}</Text>
                <br />
                <Text type="secondary">这可能需要几分钟时间，请耐心等待</Text>
              </div>
            </div>
          ) : videoUrl ? (
            <div style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ 
                width: '100%', 
                maxWidth: 800, 
                aspectRatio: '16/9', 
                background: '#000', 
                borderRadius: 12, 
                margin: '0 auto 24px', 
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
              }}>
                <video 
                  controls 
                  autoPlay 
                  src={videoUrl} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <Space direction={isMobile ? 'vertical' : 'horizontal'} style={{ width: isMobile ? '100%' : 'auto' }}>
                <Button type="primary" icon={<DownloadOutlined />} size="large" href={videoUrl} target="_blank" block={isMobile}>
                  下载视频
                </Button>
                <Button icon={<PlayCircleOutlined />} size="large" onClick={() => {
                  const video = document.querySelector('video');
                  if (video) video.play();
                }} block={isMobile}>
                  重新播放
                </Button>
              </Space>
            </div>
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description={
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ fontSize: 16 }}>准备好生成视频了吗？</Text>
                  <br />
                  <Text type="secondary">在上方输入描述，AI 将为您创造精彩画面</Text>
                </div>
              } 
            />
          )}
        </Card>
      </div>


    </div>
  );
};

export default VideoGenerator;
