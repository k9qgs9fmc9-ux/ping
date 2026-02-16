import React, { useState } from 'react';
import { Button, Modal, Row, Col, Typography, Badge, Tooltip } from 'antd';
import { BgColorsOutlined, CheckOutlined, CrownOutlined, ThunderboltOutlined, RocketOutlined, StarOutlined } from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { THEMES, THEME_NAMES, THEME_COLORS } from '../config/themes';

const { Text, Title } = Typography;

const THEME_ICONS = {
  [THEMES.DEFAULT]: <StarOutlined />,
  [THEMES.GRAND]: <CrownOutlined />,
  [THEMES.TECH]: <ThunderboltOutlined />,
  [THEMES.COOL]: <RocketOutlined />,
  [THEMES.FUSION]: <CrownOutlined />,
};

const THEME_DESCRIPTIONS = {
  [THEMES.DEFAULT]: '简洁清爽，经典蓝白配色',
  [THEMES.GRAND]: '商务稳重，深蓝金色搭配',
  [THEMES.TECH]: '科技感十足，霓虹电光色调',
  [THEMES.COOL]: '潮流炫酷，赛博朋克风格',
  [THEMES.FUSION]: '融合三种风格，至尊体验',
};

const ThemeCard = ({ themeKey, isSelected, onClick }) => {
  const colors = THEME_COLORS[themeKey];
  const isDark = themeKey !== THEMES.DEFAULT && themeKey !== THEMES.GRAND;

  return (
    <div
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderRadius: 12,
        overflow: 'hidden',
        border: `2px solid ${isSelected ? colors.primary : 'transparent'}`,
        boxShadow: isSelected 
          ? `${colors.glow || colors.shadow}, 0 4px 12px rgba(0,0,0,0.1)` 
          : '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        transform: isSelected ? 'scale(1.02)' : 'scale(1)',
        background: colors.bgContainer,
        position: 'relative',
      }}
    >
      {/* 主题预览区 */}
      <div
        style={{
          height: 80,
          background: colors.gradient !== 'transparent' ? colors.gradient : 
            `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary || colors.primary} 100%)`,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
            <CheckOutlined style={{ color: colors.primary, fontSize: 14 }} />
          </div>
        )}
        <div
          style={{
            fontSize: 28,
            color: '#fff',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {THEME_ICONS[themeKey]}
        </div>
      </div>

      {/* 主题信息区 */}
      <div style={{ padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Text strong style={{ fontSize: 15, color: colors.textPrimary }}>
            {THEME_NAMES[themeKey]}
          </Text>
          {isSelected && (
            <Badge
              count="当前"
              style={{
                backgroundColor: colors.primary,
                fontSize: 10,
                padding: '0 6px',
              }}
            />
          )}
        </div>
        <Text type="secondary" style={{ fontSize: 12, color: colors.textSecondary }}>
          {THEME_DESCRIPTIONS[themeKey]}
        </Text>
      </div>

      {/* 颜色指示条 */}
      <div style={{ display: 'flex', height: 4 }}>
        <div style={{ flex: 1, background: colors.primary }} />
        <div style={{ flex: 1, background: colors.secondary || colors.accent || colors.primary }} />
        <div style={{ flex: 1, background: colors.accent || colors.primary }} />
      </div>
    </div>
  );
};

const ThemeSwitcher = () => {
  const { currentTheme, setCurrentTheme } = useSettings();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleThemeSelect = (themeKey) => {
    setCurrentTheme(themeKey);
    setTimeout(() => setIsModalOpen(false), 300);
  };

  return (
    <>
      <Tooltip title="切换主题" placement="right">
        <Button
          type="text"
          icon={<BgColorsOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            color: THEME_COLORS[currentTheme]?.textSecondary || 'inherit',
            width: '100%',
            justifyContent: 'flex-start',
            height: 40,
          }}
        >
          主题
        </Button>
      </Tooltip>

      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BgColorsOutlined style={{ color: THEME_COLORS[currentTheme]?.primary }} />
            <span>选择主题</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={520}
        bodyStyle={{ padding: '20px' }}
      >
        <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
          选择您喜欢的界面风格，实时预览效果
        </Text>

        <Row gutter={[16, 16]}>
          {Object.values(THEMES).map((themeKey) => (
            <Col span={12} key={themeKey}>
              <ThemeCard
                themeKey={themeKey}
                isSelected={currentTheme === themeKey}
                onClick={() => handleThemeSelect(themeKey)}
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
            当前主题：<Text strong>{THEME_NAMES[currentTheme]}</Text>
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default ThemeSwitcher;
