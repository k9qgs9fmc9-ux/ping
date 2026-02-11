import React from 'react';
import { Layout, Menu, Avatar, Space, Typography, theme, Button, Tooltip } from 'antd';
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

const { Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ activeModule, onModuleChange, children }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  const { openSettings } = useSettings();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
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
          flexDirection: 'column'
        }}
        trigger={null}
      >
        <div style={{ 
          height: 64, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? 0 : '0 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.03)'
        }}>
          <div 
            onClick={() => setCollapsed(!collapsed)}
            style={{ 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center',
              color: '#0062ff'
            }}
          >
            {collapsed ? <HomeOutlined style={{ fontSize: 24 }} /> : <HomeOutlined style={{ fontSize: 24 }} />}
            {!collapsed && (
              <span style={{ marginLeft: 12, fontWeight: 'bold', fontSize: 18, color: '#1f1f1f' }}>
                守望
              </span>
            )}
          </div>
        </div>
        
        <Menu
          mode="inline"
          selectedKeys={[activeModule]}
          onClick={({ key }) => onModuleChange(key)}
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
          <Tooltip title="全局设置" placement="right">
            <Button 
              type="text" 
              icon={<SettingOutlined style={{ fontSize: 18 }} />} 
              onClick={openSettings}
              style={{ 
                width: collapsed ? 40 : '100%', 
                justifyContent: collapsed ? 'center' : 'flex-start',
                color: 'rgba(0,0,0,0.45)'
              }}
            >
              {!collapsed && <span style={{ marginLeft: 8 }}>全局设置</span>}
            </Button>
          </Tooltip>
        </div>
      </Sider>
      <Layout style={{ background: 'transparent' }}>
        <Content style={{ 
          margin: '24px 16px', 
          padding: 24, 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
