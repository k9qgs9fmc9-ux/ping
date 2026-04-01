import React, { useState, useEffect } from 'react';
import {
  Button, Card, Typography, Space, Progress, message, Alert,
  Upload, Avatar, Grid, Radio, Tag, Row, Col, Divider, Empty
} from 'antd';
import {
  UploadOutlined, LeftOutlined, RightOutlined,
  ReloadOutlined, ClearOutlined, DownloadOutlined,
  ScissorOutlined
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { useSettings } from '../context/SettingsContext';
import {
  generateHairstyleAsync, setOriginalImage, nextImage,
  prevImage, clearAll, removeGeneratedImage
} from '../features/hairstyle/hairstyleSlice';
import { HAIRSTYLE_PRESETS, fileToBase64 } from '../services/hairstyleService';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AiHairstyle = () => {
  const [selectedStyle, setSelectedStyle] = useState('short_cut');
  const [customPrompt, setCustomPrompt] = useState('');
  const [pollingTimer, setPollingTimer] = useState(null);

  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { apiKey } = useSettings();
  const dispatch = useDispatch();

  const {
    originalImage,
    generatedImages,
    currentIndex,
    status,
    error
  } = useSelector(state => state.hairstyle);

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingTimer) {
        clearInterval(pollingTimer);
      }
    };
  }, [pollingTimer]);

  const handleUploadChange = async (info) => {
    if (info.file.status === 'uploading') {
      return;
    }

    if (info.file.status === 'done') {
      // Get file and convert to base64
      try {
        const base64 = await fileToBase64(info.file.originFileObj);
        dispatch(setOriginalImage(`data:image/jpeg;base64,${base64}`));
        message.success('头像上传成功');
      } catch (err) {
        message.error('图片处理失败');
        console.error(err);
      }
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) {
      message.warning('请先上传一张人物头像照片');
      return;
    }

    // Extract base64 without prefix
    const imageBase64 = originalImage.split(',')[1];

    dispatch(generateHairstyleAsync({
      imageBase64,
      prompt: customPrompt,
      style: selectedStyle,
      apiKey
    }));
  };

  const handleDownload = () => {
    if (generatedImages.length === 0) return;

    const current = generatedImages[currentIndex];
    if (!current) return;

    const link = document.createElement('a');
    link.href = current.imageUrl;
    link.download = `hairstyle-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteCurrent = () => {
    if (generatedImages.length === 0) return;
    dispatch(removeGeneratedImage(currentIndex));
    message.success('已删除当前发型');
  };

  const currentGenerated = generatedImages[currentIndex];

  return (
    <div style={{ height: '100%', padding: isMobile ? '12px' : '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 16 : 24 }}>
          <Title level={4} style={{ margin: 0, display: 'flex', alignItems: 'center', fontSize: isMobile ? '16px' : '20px' }}>
            <ScissorOutlined style={{ marginRight: 12, color: '#722ed1' }} />
            AI 发型设计
          </Title>
        </div>

        <Row gutter={[16, 16]}>
          {/* Left: Upload and Styles */}
          <Col xs={24} md={8}>
            <Card
              bordered={false}
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
                height: '100%'
              }}
              bodyStyle={{ padding: isMobile ? 16 : 20 }}
            >
              <Text strong style={{ display: 'block', marginBottom: 12 }}>上传人物头像</Text>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                {originalImage ? (
                  <Avatar size={isMobile ? 120 : 160} src={originalImage} />
                ) : (
                  <Avatar size={isMobile ? 120 : 160} icon={<UploadOutlined />} style={{ background: '#ccc' }} />
                )}
              </div>

              <Upload
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => true}
                onChange={handleUploadChange}
                disabled={status === 'loading'}
              >
                <Button icon={<UploadOutlined />} block>
                  {originalImage ? '重新上传' : '选择图片'}
                </Button>
              </Upload>

              <Divider />

              <Text strong style={{ display: 'block', marginBottom: 12 }}>选择发型风格</Text>

              <Radio.Group
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                disabled={status === 'loading'}
                style={{ width: '100%' }}
              >
                <Row gutter={[8, 8]}>
                  {Object.entries(HAIRSTYLE_PRESETS).map(([key, data]) => (
                    <Col span={isMobile ? 12 : 24} key={key}>
                      <Radio.Button value={key} style={{ width: '100%' }}>
                        {data.name}
                      </Radio.Button>
                    </Col>
                  ))}
                </Row>
              </Radio.Group>

              <Divider />

              <Text strong style={{ display: 'block', marginBottom: 12 }}>自定义描述（可选）</Text>

              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="例如：棕色，自然卷，层次感明显..."
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  minHeight: 60,
                  padding: 8,
                  borderRadius: 6,
                  border: '1px solid #d9d9d9',
                  resize: 'vertical'
                }}
              />

              <div style={{ marginTop: 20, gap: 8, display: 'flex', flexDirection: 'column' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={handleGenerate}
                  loading={status === 'loading'}
                  block
                >
                  生成新发型
                </Button>

                {generatedImages.length > 0 && (
                  <Button
                    size="large"
                    icon={<ClearOutlined />}
                    onClick={() => dispatch(clearAll())}
                    disabled={status === 'loading'}
                    block
                  >
                    清空所有
                  </Button>
                )}
              </div>

              <div style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  提示：上传正面清晰头像效果更佳。每次生成会添加到历史记录，可以左右切换查看。
                </Text>
              </div>
            </Card>
          </Col>

          {/* Right: Preview */}
          <Col xs={24} md={16}>
            <Card
              bordered={false}
              style={{
                background: 'rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0, 0, 0, 0.05)',
                height: '100%',
                minHeight: isMobile ? 400 : 600
              }}
              bodyStyle={{ padding: isMobile ? 16 : 24 }}
            >
              {error && (
                <Alert
                  message="生成出错"
                  description={error}
                  type="error"
                  showIcon
                  closable
                  onClose={() => window.location.reload()}
                  style={{ marginBottom: 16 }}
                />
              )}

              {status === 'loading' && (
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                  <Progress type="circle" percent={50} status="active" />
                  <div style={{ marginTop: 24 }}>
                    <Text strong>正在生成发型，请稍候...</Text>
                    <br />
                    <Text type="secondary">AI 正在为你设计新发型，通常需要 10-30 秒</Text>
                  </div>
                </div>
              )}

              {status !== 'loading' && !originalImage && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <Text strong style={{ fontSize: 16 }}>上传头像，开始 AI 发型设计</Text>
                      <br />
                      <Text type="secondary">选择喜欢的风格，AI 会为你生成适配的发型</Text>
                    </div>
                  }
                  style={{ padding: '60px 0' }}
                />
              )}

              {status !== 'loading' && originalImage && generatedImages.length === 0 && (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <Text strong style={{ fontSize: 16 }}>还没有生成任何发型</Text>
                      <br />
                      <Text type="secondary">点击左侧"生成新发型"开始创作</Text>
                    </div>
                  }
                  style={{ padding: '60px 0' }}
                />
              )}

              {currentGenerated && (
                <>
                  <div style={{
                    position: 'relative',
                    textAlign: 'center',
                    marginBottom: 16
                  }}>
                    <div style={{
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                      display: 'inline-block',
                      maxWidth: '100%'
                    }}>
                      <img
                        src={currentGenerated.imageUrl}
                        alt={`Generated hairstyle ${currentIndex + 1}`}
                        style={{
                          maxWidth: '100%',
                          maxHeight: isMobile ? 400 : 500,
                          display: 'block'
                        }}
                      />
                    </div>

                    {/* Navigation arrows */}
                    {generatedImages.length > 1 && (
                      <>
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<LeftOutlined />}
                          onClick={() => dispatch(prevImage())}
                          style={{
                            position: 'absolute',
                            left: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: 0.8
                          }}
                        />
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<RightOutlined />}
                          onClick={() => dispatch(nextImage())}
                          style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            opacity: 0.8
                          }}
                        />
                      </>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 12,
                    padding: '12px 16px',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: 8
                  }}>
                    <div>
                      <Text strong>
                        {currentIndex + 1} / {generatedImages.length}
                      </Text>
                      {' '}
                      <Tag color="blue">
                        {HAIRSTYLE_PRESETS[currentGenerated.style]?.name || currentGenerated.style}
                      </Tag>
                      {customPrompt && currentGenerated.prompt && (
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          {currentGenerated.prompt}
                        </Text>
                      )}
                    </div>

                    <Space wrap>
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={handleDownload}
                        type="primary"
                      >
                        下载
                      </Button>
                      <Button
                        danger
                        icon={<ClearOutlined />}
                        onClick={handleDeleteCurrent}
                      >
                        删除
                      </Button>
                    </Space>
                  </div>

                  {/* Thumbnails */}
                  {generatedImages.length > 1 && (
                    <div style={{ marginTop: 16 }}>
                      <Text strong style={{ display: 'block', marginBottom: 8 }}>历史记录：</Text>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {generatedImages.map((img, idx) => (
                          <div
                            key={img.id}
                            onClick={() => dispatch({ type: 'hairstyle/switchToImage', payload: idx })}
                            style={{
                              width: 60,
                              height: 60,
                              borderRadius: 6,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: idx === currentIndex ? `3px solid #1890ff` : '2px solid #e8e8e8',
                              background: '#f5f5f5'
                            }}
                          >
                            <img
                              src={img.imageUrl}
                              alt={`Thumbnail ${idx + 1}`}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AiHairstyle;
