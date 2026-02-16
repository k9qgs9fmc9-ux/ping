import React from 'react';
import { Card, Row, Col, Typography, Badge, Space } from 'antd';
import { 
  RobotOutlined, 
  FilePptOutlined, 
  FileExcelOutlined, 
  FileTextOutlined, 
  VideoCameraOutlined,
  LineChartOutlined,
  ArrowRightOutlined,
  ThunderboltFilled,
  StarFilled,
  WalletOutlined
} from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { THEME_COLORS } from '../config/themes';
import { isModuleAvailable } from '../config/versions';

const { Title, Text } = Typography;

const HomeDashboard = ({ onModuleChange }) => {
  const { currentTheme, version } = useSettings();
  const themeColors = THEME_COLORS[currentTheme];

  const allModules = [
    {
      key: 'chat',
      title: '智能对话',
      description: 'AI 驱动的智能聊天助手，支持多种对话模式',
      icon: <RobotOutlined />,
      color: '#00d4ff',
      badge: '热门',
      stats: '支持多轮对话',
    },
    {
      key: 'ppt',
      title: 'PPT 生成',
      description: '一键生成专业演示文稿，智能排版设计',
      icon: <FilePptOutlined />,
      color: '#ff6b6b',
      badge: null,
      stats: '模板丰富',
    },
    {
      key: 'excel',
      title: 'Excel 助手',
      description: '数据处理与分析专家，公式函数助手',
      icon: <FileExcelOutlined />,
      color: '#51cf66',
      badge: null,
      stats: '智能分析',
    },
    {
      key: 'file',
      title: '文件分析',
      description: '智能文档解析与内容提取，支持多种格式',
      icon: <FileTextOutlined />,
      color: '#fcc419',
      badge: '新功能',
      stats: '多格式支持',
    },
    {
      key: 'video',
      title: '视频生成',
      description: 'AI 视频创作工具，文本生成视频',
      icon: <VideoCameraOutlined />,
      color: '#cc5de8',
      badge: null,
      stats: '创意无限',
    },
    {
      key: 'stock',
      title: '股票分析',
      description: '专业股票数据分析，智能投资建议',
      icon: <LineChartOutlined />,
      color: '#ff922b',
      badge: 'VIP',
      stats: '实时数据',
    },
    {
      key: 'bill',
      title: '账单管理',
      description: '智能记账，收支分析，财务规划助手',
      icon: <WalletOutlined />,
      color: '#1890ff',
      badge: '新功能',
      stats: '智能记账',
    },
  ];

  // 根据版本过滤模块
  const modules = allModules.filter(module => isModuleAvailable(version, module.key));

  const ModuleCard = ({ module }) => (
    <div
      onClick={() => onModuleChange(module.key)}
      style={{
        cursor: 'pointer',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* 外发光效果 */}
      <div
        style={{
          position: 'absolute',
          inset: -2,
          background: `linear-gradient(135deg, ${module.color}40 0%, transparent 50%, ${module.color}20 100%)`,
          borderRadius: 20,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 0,
        }}
        className="card-glow"
      />
      
      <Card
        hoverable
        style={{
          height: '100%',
          background: `linear-gradient(135deg, ${themeColors?.bgContainer || 'rgba(255,255,255,0.9)'} 0%, ${themeColors?.bgContainer || 'rgba(255,255,255,0.7)'} 100%)`,
          border: `1px solid ${module.color}30`,
          borderRadius: 16,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
        }}
        bodyStyle={{ 
          padding: '28px', 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* 顶部装饰条 */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, ${module.color} 0%, ${module.color}60 50%, transparent 100%)`,
          }}
        />

        {/* 角落装饰 */}
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          width: 40,
          height: 40,
          borderTop: `2px solid ${module.color}40`,
          borderRight: `2px solid ${module.color}40`,
          borderTopRightRadius: 8,
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          {/* 图标容器 */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${module.color}20 0%, ${module.color}05 100%)`,
              border: `2px solid ${module.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: module.color,
              boxShadow: `0 8px 24px ${module.color}30`,
            }}
          >
            {module.icon}
          </div>

          {/* 徽章 */}
          {module.badge && (
            <Badge
              count={module.badge}
              style={{
                backgroundColor: module.color,
                fontSize: 11,
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: 12,
              }}
            />
          )}
        </div>

        {/* 标题 */}
        <Title level={4} style={{ 
          margin: '0 0 12px 0', 
          color: themeColors?.textPrimary || '#1f1f1f',
          fontSize: 20,
        }}>
          {module.title}
        </Title>

        {/* 描述 */}
        <Text style={{ 
          color: themeColors?.textSecondary || '#666', 
          fontSize: 14,
          lineHeight: 1.6,
          flex: 1,
          marginBottom: 20,
        }}>
          {module.description}
        </Text>

        {/* 底部信息 */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 16,
          borderTop: `1px solid ${themeColors?.border || 'rgba(0,0,0,0.06)'}`,
        }}>
          <Space size={4} style={{ fontSize: 12, color: themeColors?.textSecondary }}>
            <ThunderboltFilled style={{ color: module.color, fontSize: 14 }} />
            <span>{module.stats}</span>
          </Space>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            color: module.color,
            fontSize: 13,
            fontWeight: 500,
          }}>
            <span>进入</span>
            <ArrowRightOutlined />
          </div>
        </div>

        {/* 悬停时的背景光效 */}
        <div
          style={{
            position: 'absolute',
            bottom: -50,
            right: -50,
            width: 150,
            height: 150,
            background: `radial-gradient(circle, ${module.color}15 0%, transparent 70%)`,
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />
      </Card>

      <style>{`
        .card-glow {
          opacity: 0 !important;
        }
        .ant-card:hover + .card-glow,
        .ant-card:hover .card-glow {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );

  return (
    <div style={{ padding: '20px 0' }}>
      {/* 欢迎区域 */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 48,
        position: 'relative',
      }}>
        {/* 背景装饰 */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 200,
          background: `radial-gradient(ellipse, ${themeColors?.primary}10 0%, transparent 70%)`,
          zIndex: 0,
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Space align="center" style={{ marginBottom: 16 }}>
            <StarFilled style={{ fontSize: 24, color: themeColors?.primary }} />
            <Text style={{ 
              fontSize: 16, 
              color: themeColors?.primary,
              fontWeight: 500,
              letterSpacing: 2,
            }}>
              WELCOME TO
            </Text>
            <StarFilled style={{ fontSize: 24, color: themeColors?.primary }} />
          </Space>
          
          <Title level={2} style={{ 
            margin: '0 0 16px 0',
            fontSize: 42,
            background: `linear-gradient(135deg, ${themeColors?.primary} 0%, ${themeColors?.secondary || themeColors?.primary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 4,
          }}>
            守望 AI 平台
          </Title>
          
          <Text style={{ 
            fontSize: 18, 
            color: themeColors?.textSecondary,
            display: 'block',
            maxWidth: 600,
            margin: '0 auto',
            lineHeight: 1.8,
          }}>
            探索人工智能的无限可能，让创作更加简单高效
          </Text>
        </div>
      </div>

      {/* 模块卡片网格 */}
      <Row gutter={[24, 24]}>
        {modules.map((module) => (
          <Col xs={24} sm={12} lg={8} key={module.key}>
            <ModuleCard module={module} />
          </Col>
        ))}
      </Row>

      {/* 底部装饰 */}
      <div style={{
        marginTop: 48,
        textAlign: 'center',
        padding: '24px',
        borderRadius: 12,
        background: `linear-gradient(135deg, ${themeColors?.primary}08 0%, transparent 100%)`,
        border: `1px dashed ${themeColors?.primary}30`,
      }}>
        <Text style={{ fontSize: 13, color: themeColors?.textSecondary }}>
          💡 点击任意卡片即可进入对应功能模块
        </Text>
      </div>
    </div>
  );
};

export default HomeDashboard;
