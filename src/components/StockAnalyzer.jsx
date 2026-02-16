import React, { useRef, useEffect, useState } from 'react';
import { Card, Typography, Button, Space, message, Alert } from 'antd';
import { LineChartOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { ACCESS_KEYS } from '../config/versions';

const { Title, Text } = Typography;

const StockAnalyzer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const { accessKey } = useSettings();

  // 检查是否有权限访问股票分析工具
  const hasAccess = accessKey === ACCESS_KEYS.PRIVATE || accessKey === ACCESS_KEYS.CREATION;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 无权限界面
  const renderNoAccess = () => (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      textAlign: 'center'
    }}>
      <Alert
        message="访问受限"
        description="股票分析工具仅限私有版及以上用户使用。请输入访问密钥以解锁此功能。"
        type="warning"
        showIcon
        style={{ marginBottom: 24, maxWidth: 500 }}
      />
    </div>
  );

  // 主要内容界面
  const renderMainContent = () => (
    <>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            <LineChartOutlined style={{ marginRight: 8 }} />
            股票分析
          </Title>
          <Text type="secondary">专业的股票数据分析工具</Text>
        </div>
        <Space>
          <Button
            type="primary"
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? '退出全屏' : '全屏显示'}
          </Button>
        </Space>
      </div>
      
      <Card 
        style={{ 
          flex: 1, 
          padding: 0,
          overflow: 'hidden'
        }}
        bodyStyle={{ 
          padding: 0, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <iframe
          src="https://k9qgs9fmc9-ux.github.io/ai-test"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            flex: 1,
            minHeight: 600,
            background: '#fff',
            borderRadius: 8,
          }}
          title="股票分析工具"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Card>
    </>
  );

  return (
    <div ref={containerRef} style={{ height: '100%', display: 'flex', flexDirection: 'column', background: isFullscreen ? '#fff' : 'transparent' }}>
      {hasAccess ? renderMainContent() : renderNoAccess()}
    </div>
  );
};

export default StockAnalyzer;
