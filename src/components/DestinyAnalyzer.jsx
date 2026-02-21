import React, { useRef, useEffect, useState } from 'react';
import { Card, Typography, Button, Space, message, Alert, Grid } from 'antd';
import { CompassOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { ACCESS_KEYS } from '../config/versions';
import { THEME_COLORS } from '../config/themes';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const DestinyAnalyzer = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const { accessKey, currentTheme } = useSettings();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const themeColors = THEME_COLORS[currentTheme];

  const hasAccess = accessKey === ACCESS_KEYS.CREATION;

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

  const renderNoAccess = () => (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: isMobile ? '20px' : '40px',
      textAlign: 'center'
    }}>
      <div style={{ 
        width: 80, 
        height: 80, 
        borderRadius: '50%', 
        background: `linear-gradient(135deg, ${themeColors?.primary}20 0%, ${themeColors?.primary}05 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        border: `2px solid ${themeColors?.primary}30`
      }}>
        <CompassOutlined style={{ fontSize: 40, color: themeColors?.primary }} />
      </div>
      
      <Title level={3} style={{ marginBottom: 8, color: themeColors?.textPrimary }}>
        国学命理
      </Title>
      <Text type="secondary" style={{ marginBottom: 32, fontSize: 16, maxWidth: 400 }}>
        探索传统智慧，解析人生密码
      </Text>

      <Alert
        message="需要创造版权限"
        description="国学命理工具仅限创造版用户使用。请输入创造版密钥以解锁此功能。"
        type="info"
        showIcon
        style={{ marginBottom: 24, maxWidth: 500 }}
      />

      <Space>
        <Text type="secondary">
          密钥：ai888
        </Text>
      </Space>
    </div>
  );

  const renderMainContent = () => (
    <>
      <div style={{ 
        marginBottom: isMobile ? 12 : 16, 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? 12 : 0
      }}>
        <div>
          <Title level={4} style={{ margin: 0 }}>
            <CompassOutlined style={{ marginRight: 8 }} />
            国学命理
          </Title>
          <Text style={{ color: themeColors?.textSecondary }}>
            传统智慧 · 人生解码
          </Text>
        </div>
        <Button
          type="primary"
          icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={toggleFullscreen}
          size={isMobile ? 'middle' : 'large'}
        >
          {isFullscreen ? '退出全屏' : '全屏显示'}
        </Button>
      </div>
      
      <Card 
        style={{ 
          flex: 1, 
          padding: 0,
          overflow: 'hidden',
          background: themeColors?.bgContainer || '#fff',
          border: `1px solid ${themeColors?.border || '#f0f0f0'}`
        }}
        bodyStyle={{ 
          padding: 0, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <iframe
          src="https://k9qgs9fmc9-ux.github.io/destiny"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            flex: 1,
            minHeight: isMobile ? 400 : 600,
            background: '#fff',
            borderRadius: 8,
          }}
          title="国学命理工具"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Card>
    </>
  );

  return (
    <div ref={containerRef} style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column', 
      background: isFullscreen ? '#fff' : 'transparent',
      padding: isMobile ? '8px' : 0
    }}>
      {hasAccess ? renderMainContent() : renderNoAccess()}
    </div>
  );
};

export default DestinyAnalyzer;
