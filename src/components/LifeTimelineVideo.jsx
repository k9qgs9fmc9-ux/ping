import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Card, Typography, Space, Progress, Result, Empty, message, Alert, Row, Col, Tag, Divider, Grid, Input } from 'antd';

const { TextArea } = Input;
import { VideoCameraOutlined, DownloadOutlined, ClearOutlined, PlayCircleOutlined, SendOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useSettings } from '../context/SettingsContext';
import { parseDiary } from '../features/lifeTimeline/lifeTimelineSlice';
import { exportTimelineVideo } from '../services/lifeTimelineService';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

// Category color mapping
const CATEGORY_COLORS = {
  education: 'blue',
  career: 'green',
  family: 'orange',
  achievement: 'red',
  milestone: 'purple',
  other: 'default'
};

const CATEGORY_LABELS = {
  education: '教育',
  career: '职业',
  family: '家庭',
  achievement: '成就',
  milestone: '里程碑',
  other: '其他'
};

const LifeTimelineVideo = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState(0);
  const [visibleEvents, setVisibleEvents] = useState([]);

  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { apiKey, baseUrl } = useSettings();
  const dispatch = useDispatch();

  const {
    diaryContent,
    timelineEvents,
    parsedData,
    status,
    error,
    videoGenerationStatus
  } = useSelector(state => state.lifeTimeline);

  // Load canvas-capture script dynamically
  useEffect(() => {
    if (!window.CanvasCapture) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-capture@1.0.0/dist/canvas-capture.min.js';
      script.async = true;
      script.onload = () => {
        console.log('CanvasCapture loaded successfully');
      };
      script.onerror = () => {
        message.warning('CanvasCapture 加载失败，视频导出功能可能无法使用');
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);

  // Redraw canvas when data changes
  useEffect(() => {
    if (canvasRef.current && parsedData) {
      drawStaticCanvas();
    }
  }, [parsedData, isMobile]);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    const width = container.clientWidth;
    const height = isMobile ? 400 : 600;

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    if (parsedData) {
      drawStaticCanvas();
    }
  }, [isMobile, parsedData]);

  const handleParseDiary = useCallback(() => {
    if (!diaryContent.trim() || diaryContent.trim().length < 50) {
      message.warning('请输入至少50字的日记内容');
      return;
    }

    dispatch(parseDiary({ diaryContent, apiKey, baseUrl }));
    setRecordedVideoUrl(null);
    setAnimationProgress(0);
    setVisibleEvents([]);
    setIsPlaying(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [diaryContent, apiKey, baseUrl, dispatch]);

  const drawStaticCanvas = () => {
    if (!canvasRef.current || !parsedData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#1a2a6c');
    gradient.addColorStop(0.5, '#b21f1f');
    gradient.addColorStop(1, '#1a2a6c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw title
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(parsedData.title || '人生轨迹', width / 2, 50);

    if (parsedData.summary) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(parsedData.summary.substring(0, 60) + (parsedData.summary.length > 60 ? '...' : ''), width / 2, 75);
    }
  };

  const drawTimeline = (progress) => {
    if (!canvasRef.current || !parsedData || timelineEvents.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;

    drawStaticCanvas();

    // Timeline parameters
    const startY = 120;
    const endY = height - 80;
    const timelineX = width / 2;
    const totalHeight = endY - startY;

    // Get min and max years
    const years = timelineEvents.map(e => e.year);
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearRange = maxYear - minYear || 1;

    // Draw main timeline line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(timelineX, startY);
    const currentEndY = startY + (totalHeight * progress);
    ctx.lineTo(timelineX, currentEndY);
    ctx.stroke();

    // Calculate which events should be visible
    const visibleCount = Math.floor(timelineEvents.length * progress);
    const currentEvents = timelineEvents.slice(0, visibleCount);
    setVisibleEvents(currentEvents);

    // Draw events
    currentEvents.forEach((event, index) => {
      const yearProgress = (event.year - minYear) / yearRange;
      const y = startY + (totalHeight * yearProgress);

      // Draw dot
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(timelineX, y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = getEventColor(event.category);
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw event on alternating sides
      const isLeft = index % 2 === 0;
      const textX = isLeft ? timelineX - 30 : timelineX + 30;
      const align = isLeft ? 'right' : 'left';

      // Draw connecting line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(timelineX, y);
      ctx.lineTo(isLeft ? timelineX - 20 : timelineX + 20, y);
      ctx.stroke();

      // Draw year tag background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fillRect(
        isLeft ? textX - 65 : textX - 5,
        y - 12,
        50,
        24
      );

      // Draw year
      ctx.fillStyle = '#1a2a6c';
      ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = align;
      ctx.fillText(String(event.year), textX + (isLeft ? -8 : 8), y + 5);

      // Draw title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(event.title, textX, y - 30);

      // Draw description
      if (event.description) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '12px -apple-system, BlinkMacSystemFont, sans-serif';
        const maxWidth = (width / 2) - 60;
        wrapText(ctx, event.description, textX, y - 10, maxWidth, 18, isLeft ? 'right' : 'left');
      }

      // Update current year
      if (index === currentEvents.length - 1) {
        setCurrentYear(event.year);
      }
    });

    // Draw current year display at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, height - 50, width, 50);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(String(currentYear || minYear), width / 2, height - 18);
  };

  const getEventColor = (category) => {
    const colors = {
      education: '#1890ff',
      career: '#52c41a',
      family: '#fa8c16',
      achievement: '#f5222d',
      milestone: '#722ed1',
      other: '#8c8c8c'
    };
    return colors[category] || colors.other;
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight, align) => {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  };

  const animate = (timestamp) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    const duration = 15000; // 15 seconds animation
    const progress = Math.min(elapsed / duration, 1);

    setAnimationProgress(progress);
    drawTimeline(progress);

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
      drawTimeline(1);
    }
  };

  const handlePlay = () => {
    if (!parsedData || timelineEvents.length === 0) {
      message.warning('请先解析日记内容');
      return;
    }

    if (isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    setRecordedVideoUrl(null);
    startTimeRef.current = null;
    animationRef.current = requestAnimationFrame(animate);
  };

  const handleReset = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
    setRecordingProgress(0);
    setRecordedVideoUrl(null);
    setAnimationProgress(0);
    setVisibleEvents([]);
    drawStaticCanvas();
  };

  const handleExportVideo = async () => {
    if (!window.CanvasCapture) {
      message.error('CanvasCapture 未加载，请刷新页面重试');
      return;
    }

    if (!parsedData || timelineEvents.length === 0) {
      message.warning('请先解析日记内容');
      return;
    }

    setIsRecording(true);
    setRecordingProgress(0);
    setRecordedVideoUrl(null);

    try {
      handleReset();

      const result = await exportTimelineVideo(canvasRef, {
        fps: 30,
        duration: 15,
        onProgress: (progress) => {
          setRecordingProgress(progress * 100);
          // Redraw with current progress
          drawTimeline(progress);
        }
      });

      setRecordedVideoUrl(result.url);
      message.success('视频导出成功！');
    } catch (error) {
      console.error('Export error:', error);
      message.error('视频导出失败: ' + error.message);
    } finally {
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (!recordedVideoUrl) return;

    const link = document.createElement('a');
    link.href = recordedVideoUrl;
    link.download = `${parsedData?.title || 'life-timeline'}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ height: '100%', padding: isMobile ? '12px' : '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 16 : 24 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: isMobile ? '16px' : '20px' }}>
            <VideoCameraOutlined style={{ marginRight: 12, color: '#1890ff' }} />
            人生轨迹视频生成器
          </Title>
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
          <TextArea
            value={diaryContent}
            onChange={(e) => dispatch({ type: 'lifeTimeline/setDiaryContent', payload: e.target.value })}
            placeholder="请粘贴你的日记内容，AI 会自动提取关键事件生成人生时间轴..."
            rows={isMobile ? 6 : 8}
            disabled={status === 'loading' || isRecording}
            style={{ marginBottom: 16, fontSize: 14 }}
          />

          {isMobile ? (
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                loading={status === 'loading'}
                onClick={handleParseDiary}
                block
              >
                解析日记生成时间轴
              </Button>
              {parsedData && (
                <>
                  <Button
                    size="large"
                    icon={isPlaying ? <ClearOutlined /> : <PlayCircleOutlined />}
                    onClick={handlePlay}
                    disabled={isRecording}
                    block
                  >
                    {isPlaying ? '停止' : '播放动画'}
                  </Button>
                  <Button
                    size="large"
                    icon={<ClearOutlined />}
                    onClick={handleReset}
                    disabled={isRecording}
                    block
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={handleExportVideo}
                    loading={isRecording}
                    disabled={!parsedData}
                    block
                  >
                    导出视频
                  </Button>
                </>
              )}
            </Space>
          ) : (
            <Space>
              <Button
                type="primary"
                size="large"
                icon={<SendOutlined />}
                loading={status === 'loading'}
                onClick={handleParseDiary}
              >
                解析日记生成时间轴
              </Button>
              {parsedData && (
                <>
                  <Button
                    size="large"
                    icon={isPlaying ? <ClearOutlined /> : <PlayCircleOutlined />}
                    onClick={handlePlay}
                    disabled={isRecording}
                  >
                    {isPlaying ? '停止' : '播放动画'}
                  </Button>
                  <Button
                    size="large"
                    icon={<ClearOutlined />}
                    onClick={handleReset}
                    disabled={isRecording}
                  >
                    重置
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    icon={<DownloadOutlined />}
                    onClick={handleExportVideo}
                    loading={isRecording}
                  >
                    导出视频
                  </Button>
                </>
              )}
            </Space>
          )}

          <div style={{ marginTop: 12 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ClockCircleOutlined /> 整个动画时长为 15 秒，导出后可下载 WebM 格式视频。需要配置 API Key 才能使用 AI 解析功能。
            </Text>
          </div>
        </Card>

        {error && (
          <Alert
            message="解析出错"
            description={error}
            type="error"
            showIcon
            closable
            onClose={() => dispatch({ type: 'lifeTimeline/clearTimeline' })}
            style={{ marginBottom: 24 }}
          />
        )}

        {parsedData && (
          <Card
            bordered={false}
            style={{ marginBottom: 24 }}
            bodyStyle={{ padding: isMobile ? 16 : 24 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={5} style={{ margin: 0 }}>{parsedData.title}</Title>
                <Paragraph type="secondary" style={{ marginTop: 8 }}>
                  {parsedData.summary}
                </Paragraph>
              </Col>
              <Col span={24}>
                <Divider style={{ margin: '8px 0' }} />
                <Text strong>已提取 {timelineEvents.length} 个关键事件：</Text>
                <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {timelineEvents.slice(0, 10).map(event => (
                    <Tag color={CATEGORY_COLORS[event.category]} key={event.id}>
                      {event.year} - {event.title}
                    </Tag>
                  ))}
                  {timelineEvents.length > 10 && (
                    <Tag>+{timelineEvents.length - 10}</Tag>
                  )}
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <Card
          className="glass-panel"
          bordered={false}
          bodyStyle={{ padding: 0, borderRadius: 16, overflow: 'hidden' }}
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
            marginBottom: 24
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: '100%',
              height: isMobile ? 400 : 600,
              display: 'block',
              borderRadius: 16
            }}
          />
        </Card>

        {isRecording && (
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Progress percent={Math.round(recordingProgress)} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} />
              <Text strong style={{ marginTop: 16, display: 'block' }}>
                正在录制视频... {Math.round(recordingProgress)}%
              </Text>
            </div>
          </Card>
        )}

        {recordedVideoUrl && (
          <Card style={{ marginBottom: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '100%',
                maxWidth: 800,
                aspectRatio: '16/9',
                background: '#000',
                borderRadius: 12,
                margin: '0 auto 24px',
                overflow: 'hidden'
              }}>
                <video
                  controls
                  autoPlay
                  src={recordedVideoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                size="large"
                onClick={handleDownload}
              >
                下载视频
              </Button>
            </div>
          </Card>
        )}

        {!parsedData && status !== 'loading' && (
          <Card
            bordered={false}
            bodyStyle={{
              padding: isMobile ? 40 : 60,
              minHeight: 300,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div style={{ textAlign: 'center' }}>
                  <Text strong style={{ fontSize: 16 }}>准备好回顾你的人生了吗？</Text>
                  <br />
                  <Text type="secondary" style={{ marginTop: 8, display: 'block' }}>
                    在上方粘贴你的日记内容，AI 将为你提取人生关键事件，并生成动画时间轴视频
                  </Text>
                </div>
              }
            />
          </Card>
        )}
      </div>
    </div>
  );
};

export default LifeTimelineVideo;
