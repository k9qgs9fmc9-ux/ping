import React, { useState, useEffect } from 'react';
import { Layout, Menu, Typography, Button, Tooltip, Drawer, Grid } from 'antd';
import {
  RobotOutlined,
  FilePptOutlined,
  FileExcelOutlined,
  FileTextOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
  LineChartOutlined,
  BgColorsOutlined,
  VideoCameraOutlined,
  LayoutOutlined,
  AppstoreOutlined,
  WalletOutlined,
  LockOutlined,
  CompassOutlined,
  HeartOutlined,
  ShopOutlined,
  PayCircleOutlined
} from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import ThemeSwitcher from './ThemeSwitcher';
import LayoutSwitcher from './LayoutSwitcher';
import VersionBadge from './VersionBadge';
import { THEME_COLORS } from '../config/themes';
import { LAYOUTS } from '../config/layouts';
import { isModuleAvailable } from '../config/versions';

const { Sider, Content, Header } = Layout;
const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const MainLayout = ({ activeModule, onModuleChange, onOpenAccessKeyModal, children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentTheme, currentLayout, version, accessKey } = useSettings();
  const screens = useBreakpoint();
  const themeColors = THEME_COLORS[currentTheme];
  
  useEffect(() => {
    if (screens.lg === false) {
      setCollapsed(true);
    }
  }, [screens.lg]);

  const isMobile = !screens.md;

  const allMenuItems = [
    {
      key: 'home',
      icon: <AppstoreOutlined style={{ fontSize: '18px' }} />,
      label: '首页',
    },
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
    {
      key: 'stock',
      icon: <LineChartOutlined style={{ fontSize: '18px' }} />,
      label: '股票分析',
    },
    {
      key: 'bill',
      icon: <WalletOutlined style={{ fontSize: '18px' }} />,
      label: '账单管理',
    },
    {
      key: 'destiny',
      icon: <CompassOutlined style={{ fontSize: '18px' }} />,
      label: '国学命理',
    },
  ];

  const menuItems = allMenuItems.filter(item => isModuleAvailable(version, item.key));

  // 天沐优质邻居广告组件
  const renderNeighborAds = (mobile = false) => (
    <div style={{
      padding: '16px',
      background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.6)',
      borderRadius: '16px',
      border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.8)'}`,
    }}>
      <Title level={5} style={{
        margin: '0 0 12px 0',
        color: themeColors?.textPrimary || '#1f1f1f',
        fontSize: mobile ? '16px' : '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{
          background: `linear-gradient(135deg, ${themeColors?.primary} 0%, ${themeColors?.secondary || themeColors?.primary} 100%)`,
          color: '#fff',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: mobile ? '13px' : '12px',
          fontWeight: 600
        }}>优质服务</span>
      </Title>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : 'repeat(2, 1fr)',
        gap: mobile ? '12px' : '10px',
      }}>
        {[
          { id: '1105', name: '银新4-1105', description: '全屋定制设计', icon: HomeOutlined, color: '#722ed1' },
          { id: '609', name: '头发乱了~中中', description: '瘦身达人', icon: HeartOutlined, color: '#fa541c' },
          { id: '888', name: '美食推荐', description: '周边美食', icon: ShopOutlined, color: '#faad14' },
          { id: '168', name: '理财顾问', description: '财富规划', icon: PayCircleOutlined, color: '#52c41a' },
        ].map((item) => (
          <div
            key={item.id}
            style={{
              padding: mobile ? '12px' : '10px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.7)',
              border: `1px solid ${item.color}30`,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: mobile ? 'row' : 'column',
              alignItems: mobile ? 'center' : 'center',
              gap: mobile ? '12px' : '6px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.98)';
              e.currentTarget.style.background = `${item.color}25`;
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.7)';
            }}
          >
            <div style={{
              width: mobile ? '48px' : '36px',
              height: mobile ? '48px' : '36px',
              borderRadius: '12px',
              background: `${item.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <item.icon style={{ fontSize: mobile ? '24px' : '18px', color: item.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text style={{
                fontSize: mobile ? '15px' : '13px',
                color: themeColors?.textPrimary || '#1f1f1f',
                textAlign: mobile ? 'left' : 'center',
                fontWeight: 600,
                lineHeight: '1.3',
                display: 'block',
                marginBottom: mobile ? '2px' : '0',
              }}>
                {item.name}
              </Text>
              {!mobile && (
                <Text style={{
                  fontSize: '11px',
                  color: themeColors?.textSecondary || '#666',
                  textAlign: 'center',
                  fontWeight: 400,
                  display: 'block',
                }}>
                  领域：{item.description}
                </Text>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 侧边栏布局
  const renderSidebarLayout = () => (
    <Layout style={{ minHeight: '100vh', width: '100%', background: 'transparent' }}>
      {!isMobile ? (
        <>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
            theme="light"
            width={240}
            style={{
              background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(20px)',
              borderRight: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 0,
              height: '100vh',
            }}
            trigger={null}
          >
            <SidebarContent />
          </Sider>
          {/* 右侧广告边栏 */}
          <Sider
            width={320}
            theme="light"
            style={{
              background: 'transparent',
              borderLeft: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              position: 'sticky',
              top: 0,
              height: '100vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ padding: '16px' }}>
              {renderNeighborAds()}
            </div>
          </Sider>
        </>
      ) : (
        <Drawer
          placement="left"
          onClose={() => setMobileOpen(false)}
          open={mobileOpen}
          width="85%"
          bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.95)' }}
          headerStyle={{ display: 'none' }}
        >
          <div style={{ padding: '16px' }}>
            {renderNeighborAds(true)}
          </div>
          <SidebarContent />
        </Drawer>
      )}

      <Layout style={{ background: 'transparent' }}>
        {isMobile && (
          <Header style={{
            padding: '0 16px',
            background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
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
            <span style={{ fontWeight: 'bold', fontSize: 18, color: themeColors?.textPrimary || '#1f1f1f' }}>
              守望
            </span>
          </Header>
        )}
        <Content style={{
          margin: isMobile ? '16px' : '16px 0',
          padding: isMobile ? 12 : 24,
          background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          borderRadius: isMobile ? 16 : 24,
          boxShadow: themeColors?.shadow || '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.4)'}`,
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

  // 顶部导航布局
  const renderTopLayout = () => (
    <Layout style={{ minHeight: '100vh', width: '100%', background: 'transparent' }}>
      <Header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: 64,
        padding: '0 24px',
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <HomeOutlined style={{ fontSize: 24, color: themeColors?.primary }} />
            <span style={{ fontWeight: 'bold', fontSize: 20, color: themeColors?.textPrimary }}>
              守望
            </span>
          </div>
          
          <Menu
            mode="horizontal"
            selectedKeys={[activeModule]}
            onClick={({ key }) => onModuleChange(key)}
            items={menuItems}
            style={{
              background: 'transparent',
              border: 0,
              minWidth: 400,
              lineHeight: '64px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!accessKey && (
            <Tooltip title="输入访问密钥以解锁更多功能">
              <Button 
                type="text" 
                icon={<LockOutlined />} 
                onClick={onOpenAccessKeyModal}
                style={{ fontSize: '16px' }}
              />
            </Tooltip>
          )}
          <ThemeSwitcher />
          <LayoutSwitcher />
        </div>
      </Header>

      <Content style={{ 
        margin: '24px', 
        padding: 24, 
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)', 
        backdropFilter: 'blur(10px)',
        borderRadius: 24,
        boxShadow: themeColors?.shadow || '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.4)'}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 280
      }}>
        {children}
      </Content>
    </Layout>
  );

  // 混合布局
  const renderMixedLayout = () => (
    <Layout style={{ minHeight: '100vh', width: '100%', background: 'transparent' }}>
      <Header style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: 64,
        padding: '0 24px',
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <HomeOutlined style={{ fontSize: 24, color: themeColors?.primary }} />
          <span style={{ fontWeight: 'bold', fontSize: 20, color: themeColors?.textPrimary }}>
            守望
          </span>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {!accessKey && (
            <Tooltip title="输入访问密钥以解锁更多功能">
              <Button 
                type="text" 
                icon={<LockOutlined />} 
                onClick={onOpenAccessKeyModal}
                style={{ fontSize: '16px' }}
              />
            </Tooltip>
          )}
          <ThemeSwitcher />
          <LayoutSwitcher />
        </div>
      </Header>

      <Layout style={{ background: 'transparent' }}>
        <Sider
          width={200}
          style={{
            background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
            borderRight: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
            position: 'sticky',
            top: 64,
            height: 'calc(100vh - 64px)',
            zIndex: 9,
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeModule]}
            onClick={({ key }) => onModuleChange(key)}
            items={menuItems}
            style={{
              background: 'transparent',
              border: 0,
              paddingTop: 16,
            }}
          />
        </Sider>

        <Content style={{ 
          margin: '24px', 
          padding: 24, 
          background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(10px)',
          borderRadius: 24,
          boxShadow: themeColors?.shadow || '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
          border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.4)'}`,
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

  // 侧边栏内容组件
  const SidebarContent = () => (
    <>
      <div style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        padding: collapsed ? 0 : '0 24px',
        borderBottom: `1px solid ${themeColors?.border || 'rgba(0, 0, 0, 0.03)'}`,
        background: themeColors?.bgContainer || 'transparent',
      }}>
        <div
          onClick={() => !isMobile && setCollapsed(!collapsed)}
          style={{
            cursor: isMobile ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: themeColors?.primary || '#0062ff'
          }}
        >
          <HomeOutlined style={{ fontSize: 24 }} />
          {(!collapsed || isMobile) && (
            <span style={{ marginLeft: 12, fontWeight: 'bold', fontSize: 18, color: themeColors?.textPrimary || '#1f1f1f' }}>
              守望
            </span>
          )}
        </div>
      </div>

      {/* 移动端显示优质服务广告 */}
      {isMobile && (
        <div style={{ padding: '16px' }}>
          {renderNeighborAds(true)}
        </div>
      )}

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

      {/* 移动端不显示底部按钮区（已有广告和菜单） */}
      {!isMobile && (
        <div style={{
          padding: collapsed ? '12px 0' : '12px 16px',
          display: 'flex',
          justifyContent: 'center',
          borderTop: `1px solid ${themeColors?.border || 'rgba(0,0,0,0.03)'}`,
          background: themeColors?.bgContainer || 'transparent',
          flexDirection: 'column',
          gap: 8
        }}>
        {!accessKey && (
          collapsed ? (
            <Tooltip title="输入访问密钥以解锁更多功能" placement="right">
              <Button
                type="text"
                icon={<LockOutlined />}
                onClick={onOpenAccessKeyModal}
                style={{
                  color: themeColors?.textSecondary || 'inherit',
                  width: 40,
                  height: 40,
                  fontSize: '16px'
                }}
              />
            </Tooltip>
          ) : (
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={onOpenAccessKeyModal}
              block
              style={{
                marginBottom: 8
              }}
            >
              输入密钥
            </Button>
          )
        )}
        {collapsed ? (
          <>
            <Tooltip title="切换主题" placement="right">
              <Button
                type="text"
                icon={<BgColorsOutlined />}
                style={{
                  color: themeColors?.textSecondary || 'inherit',
                  width: 40,
                  height: 40,
                }}
              />
            </Tooltip>
            <Tooltip title="切换布局" placement="right">
              <Button
                type="text"
                icon={<LayoutOutlined />}
                style={{
                  color: themeColors?.textSecondary || 'inherit',
                  width: 40,
                  height: 40,
                }}
              />
            </Tooltip>
          </>
        ) : (
          <>
            <ThemeSwitcher />
            <LayoutSwitcher />
            <VersionBadge />
          </>
        )}
      </div>
      )}
    </>
  );

  // 大气科幻布局
  const renderSciFiLayout = () => (
    <Layout style={{ 
      minHeight: '100vh', 
      width: '100%', 
      background: 'transparent',
      position: 'relative'
    }}>
      {/* 科幻感浮动顶栏 */}
      <div style={{
        position: 'fixed',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        width: 'calc(100% - 80px)',
        maxWidth: 1400,
        height: 72,
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        borderRadius: 16,
        border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.3)'}`,
        boxShadow: `${themeColors?.shadow || '0 8px 32px rgba(0,0,0,0.1)'}, 0 0 0 1px rgba(255,255,255,0.1) inset`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12,
            padding: '8px 16px',
            background: `linear-gradient(135deg, ${themeColors?.primary}20 0%, ${themeColors?.primary}05 100%)`,
            borderRadius: 12,
            border: `1px solid ${themeColors?.primary}30`,
          }}>
            <HomeOutlined style={{ fontSize: 24, color: themeColors?.primary }} />
            <span style={{ 
              fontWeight: 'bold', 
              fontSize: 22, 
              color: themeColors?.textPrimary,
              letterSpacing: '2px'
            }}>
              守望
            </span>
          </div>
          
          <Menu
            mode="horizontal"
            selectedKeys={[activeModule]}
            onClick={({ key }) => onModuleChange(key)}
            items={menuItems}
            style={{
              background: 'transparent',
              border: 0,
              lineHeight: '56px',
              fontSize: '15px',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!accessKey && (
            <Tooltip title="输入访问密钥以解锁更多功能">
              <Button 
                type="text" 
                icon={<LockOutlined />} 
                onClick={onOpenAccessKeyModal}
                style={{ fontSize: '18px', color: themeColors?.textSecondary }}
              />
            </Tooltip>
          )}
          <div style={{
            padding: '6px 12px',
            background: `linear-gradient(135deg, ${themeColors?.primary}15 0%, transparent 100%)`,
            borderRadius: 8,
            border: `1px solid ${themeColors?.primary}20`,
            fontSize: '12px',
            color: themeColors?.textSecondary,
          }}>
            v2.0
          </div>
          <ThemeSwitcher />
          <LayoutSwitcher />
        </div>
      </div>

      {/* 主内容区 - 全宽沉浸式设计 */}
      <Content style={{ 
        marginTop: 112,
        marginLeft: 40,
        marginRight: 40,
        marginBottom: 40,
        minHeight: 'calc(100vh - 152px)',
      }}>
        {/* 装饰性边框容器 */}
        <div style={{
          position: 'relative',
          height: '100%',
          background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          borderRadius: 24,
          border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.4)'}`,
          boxShadow: `${themeColors?.shadow || '0 8px 32px rgba(0,0,0,0.07)'}, 0 0 0 1px rgba(255,255,255,0.2) inset`,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* 角落装饰 */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 60,
            height: 60,
            borderTop: `3px solid ${themeColors?.primary}`,
            borderLeft: `3px solid ${themeColors?.primary}`,
            borderTopLeftRadius: 24,
          }} />
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 60,
            height: 60,
            borderTop: `3px solid ${themeColors?.primary}`,
            borderRight: `3px solid ${themeColors?.primary}`,
            borderTopRightRadius: 24,
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 60,
            height: 60,
            borderBottom: `3px solid ${themeColors?.primary}`,
            borderLeft: `3px solid ${themeColors?.primary}`,
            borderBottomLeftRadius: 24,
          }} />
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 60,
            height: 60,
            borderBottom: `3px solid ${themeColors?.primary}`,
            borderRight: `3px solid ${themeColors?.primary}`,
            borderBottomRightRadius: 24,
          }} />
          
          {/* 内容 */}
          <div style={{ 
            padding: 40, 
            flex: 1,
            position: 'relative',
            zIndex: 1,
          }}>
            {children}
          </div>
        </div>
      </Content>

      {/* 底部装饰线 */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        background: `linear-gradient(90deg, transparent 0%, ${themeColors?.primary} 50%, transparent 100%)`,
        opacity: 0.5,
      }} />
    </Layout>
  );

  // 根据当前布局返回对应的布局
  switch (currentLayout) {
    case LAYOUTS.TOP:
      return renderTopLayout();
    case LAYOUTS.MIXED:
      return renderMixedLayout();
    case LAYOUTS.SCIFI:
      return renderSciFiLayout();
    case LAYOUTS.SIDEBAR:
    default:
      return renderSidebarLayout();
  }
};

export default MainLayout;
