import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Space, Typography, theme, Button, Tooltip, Drawer, Grid } from 'antd';
import { 
  RobotOutlined, 
  FilePptOutlined, 
  FileExcelOutlined, 
  FileTextOutlined, 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  AppstoreOutlined,
  VideoCameraOutlined,
  SettingOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;
const { useBreakpoint } = Grid;

const MainLayout = ({ activeModule, onModuleChange, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSettings } = useSettings();
  const screens = useBreakpoint();
  
  // Initialize collapsed state based on screen size, but only on mount/resize
  useEffect(() => {
    if (screens.lg === false) {
      setCollapsed(true);
    }
  }, [screens.lg]);

  const isMobile = !screens.md;

  const menuItems = [
    {
      key: 'chat',
      icon: <RobotOutlined style={{ fontSize: '18px' }} />,
      label: '智能对话',
    },
    {
      key: 'ppt',
      icon: <FilePptOutlined style={{ fontSize: '18px' }} />,
      label: 'PPT 生成',
    },
    {
      key: 'excel',
      icon: <FileExcelOutlined style={{ fontSize: '18px' }} />,
      label: 'Excel 助手',
    },
    {
      key: 'file',
      icon: <FileTextOutlined style={{ fontSize: '18px' }} />,
      label: '文件分析',
    },
    {
      key: 'video',
      icon: <VideoCameraOutlined style={{ fontSize: '18px' }} />,
      label: '视频生成',
    },
  ];

  const MenuContent = () => (
    <>
      <div style={{ 
        height: 64, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 24px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.03)'
      }}>
        <div 
          onClick={() => !isMobile && setCollapsed(!collapsed)}
          style={{ 
            cursor: isMobile ? 'default' : 'pointer', 
            display: 'flex', 
            alignItems: 'center',
            color: '#0062ff'
          }}
        >
          <HomeOutlined style={{ fontSize: 24 }} />
          {(!collapsed || isMobile) && (
            <span style={{ marginLeft: 12, fontWeight: 'bold', fontSize: 18, color: '#1f1f1f' }}>
              守望
            </span>
          )}
        </div>
      </div>
      
      <Menu
        mode="inline"
        selectedKeys={[activeModule]}
        onClick={({ key }) => {
          onModuleChange(key);
          if (isMobile) setMobileOpen(false);
        }}
        items={menuItems}
        style={{ 
          background: 'transparent', 
          borderRight: 0,
          flex: 1
        }}
      />

      <div style={{ 
        padding: collapsed ? '12px 0' : '12px 16px', 
        display: 'flex', 
        justifyContent: collapsed ? 'center' : 'flex-start',
        borderTop: '1px solid rgba(0,0,0,0.03)'
      }}>
        <Tooltip title={(!collapsed || isMobile) ? "全局设置" : ""} placement="right">
          <Button 
            type="text" 
            icon={<SettingOutlined style={{ fontSize: 18 }} />} 
            onClick={() => {
              openSettings();
              if (isMobile) setMobileOpen(false);
            }}
            style={{ 
              width: collapsed ? 40 : '100%', 
              justifyContent: collapsed ? 'center' : 'flex-start',
              color: 'rgba(0,0,0,0.45)'
            }}
          >
            {(!collapsed || isMobile) && <span style={{ marginLeft: 8 }}>全局设置</span>}
          </Button>
        </Tooltip>
      </div>
    </>
  );

  return (
    <Layout style={{ minHeight: '100vh', width: '100%', background: 'transparent' }}>
      {!isMobile ? (
        <Sider 
          collapsible 
          collapsed={collapsed} 
          onCollapse={(value) => setCollapsed(value)}
          theme="light"
          width={240}
          style={{
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.3)',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            position: 'sticky',
            top: 0,
            height: '100vh',
          }}
          trigger={null}
        >
          <MenuContent />
        </Sider>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setMobileOpen(false)}
          open={mobileOpen}
          width={240}
          bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: 'rgba(255, 255, 255, 0.95)' }}
          headerStyle={{ display: 'none' }}
        >
          <MenuContent />
        </Drawer>
      )}

      <Layout style={{ background: 'transparent' }}>
        {isMobile && (
          <Header style={{ 
            padding: '0 16px', 
            background: 'rgba(255, 255, 255, 0.7)', 
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
            display: 'flex', 
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 9,
            height: 64
          }}>
            <Button 
              type="text" 
              icon={<MenuUnfoldOutlined />} 
              onClick={() => setMobileOpen(true)}
              style={{ fontSize: '16px', width: 64, height: 64, marginLeft: -16 }}
            />
            <span style={{ fontWeight: 'bold', fontSize: 18, color: '#1f1f1f' }}>
              守望
            </span>
          </Header>
        )}
        <Content style={{ 
          margin: isMobile ? '16px' : '24px 16px', 
          padding: isMobile ? 12 : 24, 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(10px)',
          borderRadius: isMobile ? 16 : 24,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 280
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
