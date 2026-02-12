import React, { useState } from 'react';
import { Layout, Menu, Button, Input, Card, Steps, Result, Spin, Typography, Space, Grid } from 'antd';
import { FilePptOutlined, DownloadOutlined, BulbOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const PPTGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState('');
  
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);
    // Simulate generation delay
    setTimeout(() => {
      setLoading(false);
      setStep(1);
    }, 2000);
  };

  return (
    <div style={{ height: '100%', padding: isMobile ? '12px' : '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: isMobile ? 24 : 32, textAlign: 'center', fontSize: isMobile ? '24px' : '30px' }}>
          <Space>
            <FilePptOutlined style={{ color: '#ff4d4f' }} />
            AI PPT 生成器
          </Space>
        </Title>
        
        <Card className="glass-panel" bordered={false} bodyStyle={{ padding: isMobile ? 16 : 24 }}>
          <Steps 
            current={step} 
            direction={isMobile ? "vertical" : "horizontal"}
            items={[
              { title: '输入主题', description: '描述PPT内容' },
              { title: '生成大纲', description: 'AI规划结构' },
              { title: '完成生成', description: '下载PPT文件' }
            ]}
            style={{ marginBottom: isMobile ? 24 : 40 }}
          />

          {step === 0 && (
            <div style={{ textAlign: 'center' }}>
              <Title level={4} style={{ marginBottom: 16, fontSize: isMobile ? '16px' : '20px' }}>你想做一个什么样的演示文稿？</Title>
              <TextArea 
                rows={6} 
                placeholder="例如：帮我生成一个关于2024年人工智能发展趋势的PPT，包含大模型应用、算力增长和未来展望..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{ marginBottom: 24, fontSize: 16 }}
              />
              <Button 
                type="primary" 
                size="large" 
                icon={<BulbOutlined />} 
                onClick={handleGenerate}
                loading={loading}
                disabled={!topic.trim()}
                style={{ height: 48, paddingLeft: 32, paddingRight: 32, width: isMobile ? '100%' : 'auto' }}
              >
                开始生成
              </Button>
            </div>
          )}

          {step === 1 && (
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              title="PPT 大纲已生成！"
              subTitle="AI 已为你构建了完整的演示结构，共 12 页。"
              extra={[
                <Button type="primary" key="download" icon={<DownloadOutlined />} size="large" block={isMobile} style={{ marginBottom: isMobile ? 8 : 0 }}>
                  下载 PPT 文件
                </Button>,
                <Button key="regenerate" onClick={() => setStep(0)} block={isMobile}>
                  重新生成
                </Button>,
              ]}
            >
              <div style={{ textAlign: 'left', background: 'rgba(255,255,255,0.5)', padding: 20, borderRadius: 8, marginTop: 16 }}>
                <Text strong>预览大纲：</Text>
                <ul style={{ marginTop: 8 }}>
                  <li>P1: 封面 - 2024人工智能趋势报告</li>
                  <li>P2: 目录</li>
                  <li>P3: 大模型技术的突破性进展</li>
                  <li>P4: 全球算力基础设施概览</li>
                  <li>P5-P8: 垂直领域应用案例 (医疗/金融/教育)</li>
                  <li>P9: 伦理与安全挑战</li>
                  <li>P10: 未来3-5年展望</li>
                  <li>P11: 总结</li>
                  <li>P12: 封底</li>
                </ul>
              </div>
            </Result>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PPTGenerator;
