import React, { useState } from 'react';
import { Button, Modal, Row, Col, Typography, Badge, Tooltip } from 'antd';
import { 
  LayoutOutlined, 
  MenuOutlined, 
  AppstoreOutlined, 
  CheckOutlined,
  RocketOutlined
} from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { LAYOUTS, LAYOUT_NAMES, LAYOUT_DESCRIPTIONS } from '../config/layouts';
import { THEME_COLORS } from '../config/themes';

const { Text } = Typography;

const LAYOUT_ICONS = {
  [LAYOUTS.SIDEBAR]: <LayoutOutlined />,
  [LAYOUTS.TOP]: <MenuOutlined />,
  [LAYOUTS.MIXED]: <AppstoreOutlined />,
  [LAYOUTS.SCIFI]: <RocketOutlined />,
};

const LayoutCard = ({ layoutKey, isSelected, onClick, themeColors }) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 12,
        overflow: 'hidden',
        border: `2px solid ${isSelected ? themeColors?.primary : 'transparent'}`,
        boxShadow: isSelected 
          ? `${themeColors?.shadow || '0 4px 12px rgba(0,0,0,0.1)'}, 0 0 20px ${themeColors?.primary}30` 
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        background: themeColors?.bgContainer || '#fff',
      }}
    >
      {/* 布局预览 */}
      <div
        style={{
          height: 100,
          padding: 12,
          background: `linear-gradient(135deg, ${themeColors?.primary}15 0%, ${themeColors?.secondary || themeColors?.primary}15 100%)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {layoutKey === LAYOUTS.SIDEBAR && (
          <div style={{ display: 'flex', height: '100%', gap: 8 }}>
            <div style={{ width: 30, background: themeColors?.primary, borderRadius: 4 }} />
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.5)', borderRadius: 4 }} />
          </div>
        )}
        {layoutKey === LAYOUTS.TOP && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
            <div style={{ height: 20, background: themeColors?.primary, borderRadius: 4 }} />
            <div style={{ flex: 1, background: 'rgba(255,255,255,0.5)', borderRadius: 4 }} />
          </div>
        )}
        {layoutKey === LAYOUTS.MIXED && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>
            <div style={{ height: 20, background: themeColors?.primary, borderRadius: 4 }} />
            <div style={{ display: 'flex', flex: 1, gap: 8 }}>
              <div style={{ width: 20, background: `${themeColors?.primary}80`, borderRadius: 4 }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.5)', borderRadius: 4 }} />
            </div>
          </div>
        )}
        {layoutKey === LAYOUTS.SCIFI && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8, position: 'relative' }}>
            {/* 浮动顶栏 */}
            <div style={{ 
              height: 20, 
              background: themeColors?.primary, 
              borderRadius: 10,
              margin: '0 8px',
              opacity: 0.9
            }} />
            {/* 主内容区带边角装饰 */}
            <div style={{ 
              flex: 1, 
              background: 'rgba(255,255,255,0.5)', 
              borderRadius: 8,
              position: 'relative',
              border: `2px solid ${themeColors?.primary}40`,
            }}>
              {/* 四角装饰 */}
              <div style={{ position: 'absolute', top: 2, left: 2, width: 8, height: 8, borderTop: `2px solid ${themeColors?.primary}`, borderLeft: `2px solid ${themeColors?.primary}` }} />
              <div style={{ position: 'absolute', top: 2, right: 2, width: 8, height: 8, borderTop: `2px solid ${themeColors?.primary}`, borderRight: `2px solid ${themeColors?.primary}` }} />
              <div style={{ position: 'absolute', bottom: 2, left: 2, width: 8, height: 8, borderBottom: `2px solid ${themeColors?.primary}`, borderLeft: `2px solid ${themeColors?.primary}` }} />
              <div style={{ position: 'absolute', bottom: 2, right: 2, width: 8, height: 8, borderBottom: `2px solid ${themeColors?.primary}`, borderRight: `2px solid ${themeColors?.primary}` }} />
            </div>
          </div>
        )}
        
        {isSelected && (
          <div
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            <CheckOutlined style={{ color: themeColors?.primary, fontSize: 14 }} />
          </div>
        )}
      </div>

      {/* 布局信息 */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          {LAYOUT_ICONS[layoutKey]}
          <Text strong style={{ fontSize: 15, color: themeColors?.textPrimary }}>
            {LAYOUT_NAMES[layoutKey]}
          </Text>
          {isSelected && (
            <Badge
              count="当前"
              style={{
                backgroundColor: themeColors?.primary,
                fontSize: 10,
                padding: '0 6px',
              }}
            />
          )}
        </div>
        <Text type="secondary" style={{ fontSize: 12, color: themeColors?.textSecondary }}>
          {LAYOUT_DESCRIPTIONS[layoutKey]}
        </Text>
      </div>
    </div>
  );
};

const LayoutSwitcher = () => {
  const { currentLayout, setCurrentLayout, currentTheme } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const themeColors = THEME_COLORS[currentTheme];

  const handleLayoutSelect = (layoutKey) => {
    setCurrentLayout(layoutKey);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  return (
    <>
      <Tooltip title="切换布局" placement="right">
        <Button
          type="text"
          icon={<LayoutOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            color: themeColors?.textSecondary || 'inherit',
            width: '100%',
            justifyContent: 'flex-start',
            height: 40,
          }}
        >
          布局
        </Button>
      </Tooltip>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LayoutOutlined style={{ color: themeColors?.primary }} />
            <span>选择布局</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        bodyStyle={{ padding: '20px' }}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
          选择您喜欢的导航布局方式
        </Text>

        <Row gutter={[16, 16]}>
          {Object.values(LAYOUTS).map((layoutKey) => (
            <Col xs={24} sm={12} md={8} lg={6} key={layoutKey}>
              <LayoutCard
                layoutKey={layoutKey}
                isSelected={currentLayout === layoutKey}
                onClick={() => handleLayoutSelect(layoutKey)}
                themeColors={themeColors}
              />
            </Col>
          ))}
        </Row>

        <div
          style={{
            marginTop: 20,
            padding: 12,
            background: 'rgba(0,0,0,0.02)',
            borderRadius: 8,
            textAlign: 'center',
          }}
        >
          <Text type="secondary" style={{ fontSize: 12 }}>
            当前布局：<Text strong>{LAYOUT_NAMES[currentLayout]}</Text>
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default LayoutSwitcher;
