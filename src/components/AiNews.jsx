import React, { useRef, useEffect, useState } from 'react';
import { Card, Typography, Button, Grid, List, Tag, Space } from 'antd';
import { RocketOutlined, FullscreenOutlined, FullscreenExitOutlined, LinkOutlined } from '@ant-design/icons';
import { useSettings } from '../context/SettingsContext';
import { THEME_COLORS } from '../config/themes';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

// AI行业热门资讯来源
const AI_NEWS_SOURCES = [
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog',
    description: 'OpenAI官方博客，发布最新产品和研究'
  },
  {
    name: 'AI Research (arXiv)',
    url: 'https://arxiv.org/search/cs?query=artificial+intelligence&searchtype=all&sort=-submittedDate',
    description: '最新AI研究论文'
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
    description: '麻省理工科技评论AI板块'
  },
  {
    name: 'The Batch',
    url: 'https://www.deeplearning.ai/the-batch/',
    description: 'DeepLearning.AI AI新闻周刊'
  },
  {
    name: 'AI Weekly',
    url: 'https://aiweekly.co/',
    description: 'AI行业新闻周刊'
  },
  {
    name: 'Hacker News AI',
    url: 'https://news.ycombinator.com/search?q=AI&sort=byDate',
    description: 'HN社区AI相关热门讨论'
  }
];

// 热门AI公司官网
const AI_COMPANIES = [
  { name: 'OpenAI', url: 'https://openai.com', color: '#10a37f' },
  { name: 'Anthropic', url: 'https://www.anthropic.com', color: '#9333ea' },
  { name: 'Google DeepMind', url: 'https://deepmind.google', color: '#4285f4' },
  { name: 'Meta AI', url: 'https://ai.meta.com', color: '#1877f2' },
  { name: 'xAI', url: 'https://x.ai', color: '#000000' },
  { name: 'MidJourney', url: 'https://www.midjourney.com', color: '#7289da' },
  { name: 'Stability AI', url: 'https://stability.ai', color: '#ff4b00' },
  { name: 'Hugging Face', url: 'https://huggingface.co', color: '#ffd21e' }
];

// 常用AI工具
const AI_TOOLS = [
  { name: 'ChatGPT', url: 'https://chat.openai.com', color: 'blue' },
  { name: 'Claude', url: 'https://claude.ai', color: 'purple' },
  { name: 'Gemini', url: 'https://gemini.google.com', color: 'green' },
  { name: 'GitHub', url: 'https://github.com', color: 'red' },
  { name: 'Hugging Face', url: 'https://huggingface.co', color: 'cyan' },
  { name: 'Kaggle', url: 'https://www.kaggle.com', color: 'orange' },
  { name: 'arXiv', url: 'https://arxiv.org', color: 'magenta' },
  { name: 'Towards Data Science', url: 'https://towardsdatascience.com', color: 'geekblue' },
  { name: 'LangChain', url: 'https://www.langchain.com', color: '#10a37f' },
  { name: 'LlamaIndex', url: 'https://www.llamaindex.ai', color: '#ff6b6b' },
  { name: 'Weights & Biases', url: 'https://wandb.ai', color: '#fcbf29' },
  { name: 'Replicate', url: 'https://replicate.com', color: 'pink' }
];

const AiNews = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const { currentTheme } = useSettings();
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const themeColors = THEME_COLORS[currentTheme];

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

  const handleOpenLink = (url) => {
    window.open(url, '_blank', 'noopener noreferrer');
  };

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
            <RocketOutlined style={{ marginRight: 8 }} />
            AI 行业动态
          </Title>
          <Text style={{ color: themeColors?.textSecondary }}>
            追踪人工智能领域最新资讯、研究进展和行业动态
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: 16,
        flex: 1,
        overflow: 'auto',
        paddingBottom: 16
      }}>
        {/* AI资讯来源 */}
        <Card
          title="热门资讯平台"
          style={{
            background: themeColors?.bgContainer || '#fff',
            border: `1px solid ${themeColors?.border || '#f0f0f0'}`
          }}
        >
          <List
            dataSource={AI_NEWS_SOURCES}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    icon={<LinkOutlined />}
                    onClick={() => handleOpenLink(item.url)}
                  >
                    访问
                  </Button>
                ]}
              >
                <div>
                  <Text strong>{item.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>
                </div>
              </List.Item>
            )}
          />
        </Card>

        {/* AI领军企业 */}
        <Card
          title="主流AI企业"
          style={{
            background: themeColors?.bgContainer || '#fff',
            border: `1px solid ${themeColors?.border || '#f0f0f0'}`
          }}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12
          }}>
            {AI_COMPANIES.map((company) => (
              <div
                key={company.name}
                onClick={() => handleOpenLink(company.url)}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1px solid ${company.color}30`,
                  background: `${company.color}10`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${company.color}20`;
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `${company.color}10`;
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Text strong style={{ color: company.color }}>
                  {company.name}
                </Text>
              </div>
            ))}
          </div>
        </Card>

        {/* 常用AI工具导航 */}
        <Card
          title="常用AI工具导航"
          style={{
            background: themeColors?.bgContainer || '#fff',
            border: `1px solid ${themeColors?.border || '#f0f0f0'}`,
            gridColumn: isMobile ? '1' : '1 / -1'
          }}
        >
          <Space wrap size={[8, 8]}>
            {AI_TOOLS.map((tool) => (
              <Tag
                key={tool.name}
                color={tool.color}
                style={{ cursor: 'pointer', padding: '4px 12px', fontSize: 14 }}
                onClick={() => handleOpenLink(tool.url)}
              >
                {tool.name}
              </Tag>
            ))}
          </Space>
          <div style={{ marginTop: 16 }}>
            <Text type="secondary">
              💡 点击任意链接可在新标签页打开相应网站，快速获取AI行业最新信息。
            </Text>
          </div>
        </Card>
      </div>
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
      {renderMainContent()}
    </div>
  );
};

export default AiNews;
