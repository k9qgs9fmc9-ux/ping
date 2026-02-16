import React, { useState, useRef, useEffect } from 'react';
import { Card, Typography, Button, Input, Space, message } from 'antd';
import { LineChartOutlined, FullscreenOutlined, FullscreenExitOutlined, SafetyOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const StockAnalyzer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const containerRef = useRef(null);

  const CORRECT_KEY = 'ai666';

  const handleVerify = () => {
    if (inputKey === CORRECT_KEY) {
      setIsAuthenticated(true);
      message.success('验证成功！欢迎访问股票分析工具');
    } else {
      message.error('访问密钥错误，请重试');
      setInputKey('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setInputKey('');
    message.info('已退出登录');
  };

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

  // 欢迎界面/验证界面
  const renderWelcomeScreen = () => (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
      textAlign: 'center'
    }}>
      <div style={{ 
        width: 80, 
        height: 80, 
        borderRadius: '50%', 
        background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24
      }}>
        <SafetyOutlined style={{ fontSize: 40, color: '#fff' }} />
      </div>
      
      <Title level={3} style={{ marginBottom: 8 }}>
        欢迎使用股票分析工具
      </Title>
      <Text type="secondary" style={{ marginBottom: 32, fontSize: 16 }}>
        这是一个专业的股票数据分析平台，请输入访问密钥以继续
      </Text>

      <Card style={{ width: 360, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong style={{ display: 'block', marginBottom: 8 }}>
              <LockOutlined style={{ marginRight: 8 }} />
              访问密钥
            </Text>
            <Input.Password
              placeholder="请输入访问密钥"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              onPressEnter={handleVerify}
              size="large"
              prefix={<LockOutlined />}
            />
          </div>
          <Button 
            type="primary" 
            size="large" 
            onClick={handleVerify}
            block
            style={{ height: 44 }}
          >
            验证并进入
          </Button>
        </Space>
      </Card>

      <Text type="secondary" style={{ marginTop: 24, fontSize: 12 }}>
        提示：请联系管理员获取访问密钥
      </Text>
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
          <Button onClick={handleLogout}>
            退出登录
          </Button>
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
      {isAuthenticated ? renderMainContent() : renderWelcomeScreen()}
    </div>
  );
};

export default StockAnalyzer;
