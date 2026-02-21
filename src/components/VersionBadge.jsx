import React from 'react';
import { Tag, Tooltip, Space, Badge } from 'antd';
import { CrownOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { VERSIONS, VERSION_INFO, ACCESS_KEYS } from '../config/versions';
import { THEME_COLORS } from '../config/themes';

const VersionBadge = ({ showDetails = false }) => {
  const { version, currentTheme } = useSettings();
  const themeColors = THEME_COLORS[currentTheme];
  const info = VERSION_INFO[version];

  const getIcon = () => {
    switch (version) {
      case VERSIONS.CREATION:
        return <CrownOutlined />;
      case VERSIONS.PRIVATE:
        return <SafetyOutlined />;
      default:
        return <TeamOutlined />;
    }
  };

  const getColor = () => {
    switch (version) {
      case VERSIONS.CREATION:
        return '#faad14';
      case VERSIONS.PRIVATE:
        return themeColors?.primary || '#0062ff';
      default:
        return '#8c8c8c';
    }
  };

  if (showDetails) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 12,
        padding: '8px 16px',
        background: `${getColor()}10`,
        borderRadius: 20,
        border: `1px solid ${getColor()}30`
      }}>
        <div style={{ 
          width: 32, 
          height: 32, 
          borderRadius: '50%', 
          background: getColor(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ color: '#fff', fontSize: 16 }}>{getIcon()}</span>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: themeColors?.textPrimary }}>
            {info.name}
          </div>
          <div style={{ fontSize: 12, color: themeColors?.textSecondary }}>
            {info.description}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tooltip 
      title={
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{info.name}</div>
          <div style={{ fontSize: 12 }}>{info.description}</div>
        </div>
      }
    >
      <Tag 
        icon={getIcon()}
        color={getColor()}
        style={{ 
          margin: 0,
          padding: '4px 12px',
          borderRadius: 12,
          fontWeight: 500
        }}
      >
        v2.0 · {info.name}
      </Tag>
    </Tooltip>
  );
};

export default VersionBadge;
