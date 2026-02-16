import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, addUserMessage, clearHistory, switchMode } from './features/chat/chatSlice';
import { Input, Button, Typography, Avatar, Tooltip, Dropdown, Space, Empty, Tag, Grid } from 'antd';
import { SendOutlined, UserOutlined, DeleteOutlined, ShopOutlined, PayCircleOutlined, RiseOutlined, HomeOutlined, HeartOutlined, DownOutlined, SettingOutlined, RobotOutlined, CommentOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import ThinkingBubble from './components/ThinkingBubble';
import { MODES, getModeConfig } from './data/modes';
import { useSettings } from './context/SettingsContext';
import { THEME_COLORS } from './config/themes';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const MODE_ICONS = {
  [MODES.GENERAL]: CommentOutlined,
  [MODES.PRODUCT]: ShopOutlined,
  [MODES.FINANCE]: PayCircleOutlined,
  [MODES.STOCK]: RiseOutlined,
  [MODES.DECORATION]: HomeOutlined,
  [MODES.PARENTING]: HeartOutlined,
};

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const { apiKey, chatBaseUrl, openSettings, currentTheme } = useSettings();
  const themeColors = THEME_COLORS[currentTheme];
  
  const dispatch = useDispatch();
  const { messages, status, mode } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  
  const currentConfig = getModeConfig(mode);
  const CurrentIcon = MODE_ICONS[mode] || CommentOutlined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    dispatch(addUserMessage(inputValue));
    const newHistory = [...messages, { role: 'user', content: inputValue }];
    dispatch(sendMessage({ messages: newHistory, apiKey, baseUrl: chatBaseUrl }));
    setInputValue('');
  };

  const handleClear = () => {
    dispatch(clearHistory());
  };
  
  const handleModeChange = ({ key }) => {
    dispatch(switchMode(key));
  };

  const modeMenuProps = {
    items: [
      {
        key: MODES.GENERAL,
        label: (
          <Space style={{ color: themeColors?.textPrimary || '#1f1f1f', fontSize: '14px' }}>
            <CommentOutlined style={{ color: themeColors?.primary, fontSize: '16px' }} /> 
            <span style={{ fontWeight: 500 }}>通用咨询</span>
          </Space>
        ),
      },
      {
        key: MODES.PRODUCT,
        label: (
          <Space style={{ color: themeColors?.textPrimary || '#1f1f1f', fontSize: '14px' }}>
            <ShopOutlined style={{ color: themeColors?.primary, fontSize: '16px' }} /> 
            <span style={{ fontWeight: 500 }}>产品专家</span>
          </Space>
        ),
      },
      {
        key: MODES.FINANCE,
        label: (
          <Space style={{ color: themeColors?.textPrimary || '#1f1f1f', fontSize: '14px' }}>
            <PayCircleOutlined style={{ color: themeColors?.primary, fontSize: '16px' }} /> 
            <span style={{ fontWeight: 500 }}>财务金融专家</span>
          </Space>
        ),
      },
      {
        key: MODES.STOCK,
        label: (
          <Space style={{ color: themeColors?.textPrimary || '#1f1f1f', fontSize: '14px' }}>
            <RiseOutlined style={{ color: themeColors?.primary, fontSize: '16px' }} /> 
            <span style={{ fontWeight: 500 }}>股票专家</span>
          </Space>
        ),
      },
      {
        key: MODES.DECORATION,
        label: (
          <Space style={{ color: themeColors?.textPrimary || '#1f1f1f', fontSize: '14px' }}>
            <HomeOutlined style={{ color: themeColors?.primary, fontSize: '16px' }} /> 
            <span style={{ fontWeight: 500 }}>装修专家</span>
          </Space>
        ),
      },
      {
        key: MODES.PARENTING,
        label: (
          <Space style={{ color: themeColors?.textPrimary || '#1f1f1f', fontSize: '14px' }}>
            <HeartOutlined style={{ color: themeColors?.primary, fontSize: '16px' }} /> 
            <span style={{ fontWeight: 500 }}>成都育儿嫂</span>
          </Space>
        ),
      }
    ],
    onClick: handleModeChange,
  };

  const displayMessages = messages.filter(m => m.role !== 'system');

  return (
    <div style={{
      width: '100%',
      maxWidth: '1000px',
      height: '100%',
      margin: '0 auto',
      padding: isMobile ? '12px' : '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{
        padding: isMobile ? '12px' : '16px 24px',
        borderRadius: '16px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.8)'}`,
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            borderRadius: '12px',
            background: `linear-gradient(135deg, ${themeColors?.primary} 0%, ${themeColors?.secondary || themeColors?.primary} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 10px ${themeColors?.primary}33`,
            flexShrink: 0
          }}>
            <CurrentIcon style={{ fontSize: isMobile ? '18px' : '24px', color: '#fff' }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: themeColors?.textPrimary || '#1f1f1f', fontSize: isMobile ? '16px' : '20px' }}>
              天沐锦江VIP服务
            </Title>
            <Space size={4}>
              <Dropdown 
                menu={modeMenuProps} 
                trigger={['click']}
                dropdownRender={(menu) => (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
                    border: `1px solid ${themeColors?.border || 'rgba(0,0,0,0.1)'}`,
                    padding: '8px 0',
                  }}>
                    {menu}
                  </div>
                )}
                overlayClassName="mode-dropdown-menu"
              >
                <Tag 
                  style={{ 
                    margin: 0, 
                    cursor: 'pointer', 
                    background: `${themeColors?.primary}15`, 
                    border: `1px solid ${themeColors?.primary}40`,
                    color: themeColors?.primary,
                    fontSize: isMobile ? '12px' : '14px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {currentConfig.name} <DownOutlined style={{ fontSize: '10px' }} />
                </Tag>
              </Dropdown>
            </Space>
          </div>
        </div>
        <Space size={isMobile ? 0 : 8}>
          <Tooltip title="清空对话">
            <Button 
              icon={<DeleteOutlined />} 
              onClick={handleClear} 
              type="text" 
              style={{ color: 'var(--tech-text-dim)' }}
            />
          </Tooltip>
          {/* <Tooltip title="设置 API Key">
            <Button 
              icon={<SettingOutlined />} 
              onClick={openSettings} 
              type="text"
              style={{ color: 'var(--tech-text-dim)' }}
            />
          </Tooltip> */}
        </Space>
      </div>

      {/* Chat Area */}
      <div className="glass-panel" style={{
        flex: 1,
        borderRadius: '16px',
        marginBottom: '16px',
        padding: isMobile ? '16px' : '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.8)'}`,
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.7)',
      }}>
        {displayMessages.length === 0 ? (
          <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            opacity: 0.6 
          }}>
            <HomeOutlined style={{ fontSize: isMobile ? '48px' : '64px', color: themeColors?.primary, marginBottom: '16px', opacity: 0.2 }} />
            <Text style={{ color: themeColors?.textSecondary }}>开始新的对话...</Text>
          </div>
        ) : (
          <AnimatePresence>
            {displayMessages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: isMobile ? '90%' : '80%',
                  display: 'flex',
                  gap: isMobile ? '8px' : '12px',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar 
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                  style={{ 
                    backgroundColor: msg.role === 'user' ? '#722ed1' : '#0062ff',
                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(114, 46, 209, 0.2)' : '0 2px 8px rgba(0, 98, 255, 0.2)',
                    flexShrink: 0,
                    width: isMobile ? 32 : 32,
                    height: isMobile ? 32 : 32
                  }} 
                />
                <div style={{
                  padding: isMobile ? '8px 12px' : '12px 16px',
                  borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.1) 100%)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  border: msg.role === 'user' 
                    ? '1px solid rgba(114, 46, 209, 0.1)' 
                    : '1px solid rgba(0, 98, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  color: themeColors?.textPrimary || '#1f1f1f',
                  backdropFilter: 'blur(5px)',
                }}>
                  <div className="markdown-body" style={{ fontSize: isMobile ? '14px' : '15px', lineHeight: '1.6' }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ alignSelf: 'flex-start', marginLeft: '44px' }}
          >
            <ThinkingBubble />
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="glass-panel" style={{
        padding: '8px',
        borderRadius: '16px',
        display: 'flex',
        gap: isMobile ? '8px' : '12px',
        alignItems: 'flex-end',
        background: themeColors?.bgContainer || 'rgba(255, 255, 255, 0.8)',
        border: `1px solid ${themeColors?.border || 'rgba(255, 255, 255, 0.8)'}`,
        boxShadow: `0 0 20px ${themeColors?.primary}0D`
      }}>
        <TextArea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={(e) => {
            if (!e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="输入消息..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ 
            resize: 'none', 
            border: 'none', 
            background: 'transparent',
            padding: isMobile ? '8px' : '12px',
            fontSize: isMobile ? '14px' : '16px',
            color: themeColors?.textPrimary || '#1f1f1f'
          }}
        />
        <Button 
          type="primary" 
          shape="circle" 
          icon={<SendOutlined />} 
          size="large"
          onClick={handleSend}
          disabled={!inputValue.trim() || status === 'loading'}
          style={{ 
            marginBottom: '4px', 
            marginRight: '4px',
            background: `linear-gradient(135deg, ${themeColors?.primary} 0%, ${themeColors?.secondary || themeColors?.primary} 100%)`,
            border: 'none',
            boxShadow: `0 4px 10px ${themeColors?.primary}33`
          }}
        />
      </div>

      {/* Settings Modal - Moved to GlobalSettingsModal */}
      
      {/* 下拉菜单样式覆盖 */}
      <style>{`
        .mode-dropdown-menu .ant-dropdown-menu {
          background: #ffffff !important;
          border-radius: 12px !important;
          box-shadow: none !important;
          border: none !important;
          padding: 0 !important;
        }
        .mode-dropdown-menu .ant-dropdown-menu-item {
          padding: 12px 20px !important;
          color: #1f1f1f !important;
          font-size: 14px !important;
          transition: all 0.2s ease;
          background: transparent !important;
        }
        .mode-dropdown-menu .ant-dropdown-menu-item:hover {
          background: #f0f0f0 !important;
        }
        .mode-dropdown-menu .ant-space,
        .mode-dropdown-menu .ant-space-item {
          color: #1f1f1f !important;
        }
      `}</style>
    </div>
  );
};

export default Chat;
