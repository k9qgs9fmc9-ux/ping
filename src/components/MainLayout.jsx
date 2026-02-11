import React from 'react';
import { Layout, Menu, Avatar, Space, Typography, theme } from 'antd';
import { 
  RobotOutlined, 
  FilePptOutlined, 
  FileExcelOutlined, 
  FileTextOutlined, 
  MenuUnfoldOutlined, 
  MenuFoldOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Sider, Content } = Layout;
const { Text } = Typography;

const MainLayout = ({ activeModule, onModuleChange, children }) => {
  const [collapsed, setCollapsed] = React.useState(true);
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
            <AppstoreOutlined style={{ fontSize: 24 }} />
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
            padding: '12px 8px' 
          }}
        />
        
        <div style={{ 
          position: 'absolute', 
          bottom: 24, 
          width: '100%', 
          textAlign: 'center' 
        }}>
          <div 
            onClick={() => setCollapsed(!collapsed)}
            style={{ 
              cursor: 'pointer',
              color: 'rgba(0,0,0,0.45)',
              padding: 12
            }}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
      </Sider>
      
      <Layout style={{ background: 'transparent' }}>
        <Content style={{ 
          margin: 0, 
          height: '100vh', 
          overflow: 'hidden',
          position: 'relative'
        }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
