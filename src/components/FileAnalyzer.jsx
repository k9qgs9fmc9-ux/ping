import React, { useState } from 'react';
import { Upload, Button, Card, Typography, Space, List, Tag, Progress, message, Empty, Grid } from 'antd';
import { InboxOutlined, FileTextOutlined, BarChartOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Dragger } = Upload;
const { Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const FileAnalyzer = () => {
  const [fileList, setFileList] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const props = {
    name: 'file',
    multiple: true,
    customRequest({ file, onSuccess }) {
      setTimeout(() => {
        onSuccess("ok");
      }, 0);
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        setFileList(info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} 上传成功`);
      } else if (status === 'error') {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const handleAnalyze = () => {
    if (fileList.length === 0) return;
    setAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        summary: '文档主要讨论了2024年Q1的市场营销策略。核心观点包括：增加社交媒体投入、优化SEO关键词、以及推出新的会员激励计划。',
        keywords: ['市场营销', 'Q1策略', 'SEO优化', '会员增长'],
        sentiment: '积极',
        files: fileList.map(f => f.name)
      });
    }, 2500);
  };

  return (
    <div style={{ height: '100%', padding: isMobile ? '12px' : '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: isMobile ? 24 : 32, textAlign: 'center', fontSize: isMobile ? '24px' : '30px' }}>
          <Space>
            <BarChartOutlined style={{ color: '#722ed1' }} />
            智能文件分析
          </Space>
        </Title>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
          {/* Left Column: Upload */}
          <div>
            <Card className="glass-panel" title="上传文件" bordered={false}>
              <Dragger {...props} style={{ background: 'rgba(255,255,255,0.4)' }}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined style={{ color: '#0062ff' }} />
                </p>
                <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
                <p className="ant-upload-hint">
                  支持 PDF, Word, Excel, TXT 等格式。支持多文件上传分析。
                </p>
              </Dragger>
              
              <Button 
                type="primary" 
                block 
                size="large" 
                style={{ marginTop: 16 }}
                onClick={handleAnalyze}
                loading={analyzing}
                disabled={fileList.length === 0}
              >
                {analyzing ? '正在深度分析...' : '开始智能分析'}
              </Button>
            </Card>

            <Card className="glass-panel" title="已上传文件" bordered={false} style={{ marginTop: 24 }}>
              <List
                dataSource={fileList}
                renderItem={(item) => (
                  <List.Item key={item.uid}>
                    <List.Item.Meta
                      avatar={<FileTextOutlined />}
                      title={item.name}
                      description={((item.size || 0) / 1024).toFixed(2) + ' KB'}
                    />
                    {item.status === 'done' && <CheckCircleOutlined style={{ color: '#52c41a' }} />}
                  </List.Item>
                )}
              />
            </Card>
          </div>

          {/* Right Column: Result */}
          <div>
            <Card className="glass-panel" title="分析结果" bordered={false} style={{ height: '100%' }}>
              {analyzing ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <Progress type="circle" percent={75} status="active" />
                  <p style={{ marginTop: 16 }}>AI 正在阅读文档内容...</p>
                </div>
              ) : result ? (
                <div>
                  <Title level={5}>内容摘要</Title>
                  <Paragraph style={{ background: 'rgba(255,255,255,0.5)', padding: 12, borderRadius: 8 }}>
                    {result.summary}
                  </Paragraph>
                  
                  <Title level={5} style={{ marginTop: 24 }}>关键概念</Title>
                  <div style={{ marginBottom: 24 }}>
                    {result.keywords.map(k => (
                      <Tag color="blue" key={k} style={{ marginBottom: 8 }}>{k}</Tag>
                    ))}
                  </div>

                  <Title level={5}>情感倾向</Title>
                  <Tag color="green">{result.sentiment}</Tag>
                </div>
              ) : (
                <Empty description="暂无分析结果" style={{ marginTop: 60 }} />
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileAnalyzer;
