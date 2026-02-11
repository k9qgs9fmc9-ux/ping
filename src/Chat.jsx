import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { sendMessage, addUserMessage, clearHistory, switchMode } from './features/chat/chatSlice';
import { Input, Button, Typography, Avatar, Tooltip, Modal, Dropdown, Space, Empty, Tag } from 'antd';
import { SendOutlined, UserOutlined, SettingOutlined, DeleteOutlined, ShopOutlined, PayCircleOutlined, RiseOutlined, RobotOutlined, DownOutlined, ThunderboltOutlined, HomeOutlined, HeartOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import ThinkingBubble from './components/ThinkingBubble';
import { MODES, getModeConfig } from './data/modes';

const { TextArea } = Input;
const { Title, Text } = Typography;

const Chat = () => {
  const [inputValue, setInputValue] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Default to the provided key if not found in localStorage
  const [apiKey, setApiKey] = useState(localStorage.getItem('dashscope_api_key') || 'sk-62c624e8f0f2403da26b02aa348ec860');
  
  const dispatch = useDispatch();
  const { messages, status, mode } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  
  const currentConfig = getModeConfig(mode);

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
    dispatch(sendMessage({ messages: newHistory, apiKey }));
    setInputValue('');
  };

  const handleSaveSettings = () => {
    if (apiKey) {
      localStorage.setItem('dashscope_api_key', apiKey);
    } else {
      localStorage.removeItem('dashscope_api_key');
    }
    setIsSettingsOpen(false);
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
        key: MODES.EMOTIONAL,
        label: (
          <Space>
            <ThunderboltOutlined style={{ color: '#0062ff' }} /> 天沐锦江VIP服务
          </Space>
        ),
      },
      {
        key: MODES.PRODUCT,
        label: (
          <Space>
            <ShopOutlined style={{ color: '#0062ff' }} /> 产品专家
          </Space>
        ),
      },
      {
        key: MODES.FINANCE,
        label: (
          <Space>
            <PayCircleOutlined style={{ color: '#0062ff' }} /> 财务金融专家
          </Space>
        ),
      },
      {
        key: MODES.STOCK,
        label: (
          <Space>
            <RiseOutlined style={{ color: '#0062ff' }} /> 股票专家
          </Space>
        ),
      },
      {
        key: MODES.DECORATION,
        label: (
          <Space>
            <HomeOutlined style={{ color: '#0062ff' }} /> 装修专家
          </Space>
        ),
      },
      {
        key: MODES.PARENTING,
        label: (
          <Space>
            <HeartOutlined style={{ color: '#0062ff' }} /> 成都育儿嫂
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
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      zIndex: 10,
    }}>
      {/* Header Panel */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        borderRadius: '16px',
        marginBottom: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(255, 255, 255, 0.8)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0062ff 0%, #722ed1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0, 98, 255, 0.2)'
          }}>
            <HomeOutlined style={{ fontSize: '24px', color: '#fff' }} />
          </div>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1f1f1f' }}>
              天沐锦江VIP服务
            </Title>
            <Space size={4}>
              <Dropdown menu={modeMenuProps} trigger={['click']}>
                <Tag 
                  color="blue" 
                  style={{ 
                    margin: 0, 
                    cursor: 'pointer', 
                    background: 'rgba(0, 98, 255, 0.05)', 
                    border: '1px solid rgba(0, 98, 255, 0.2)',
                    color: '#0062ff'
                  }}
                >
                  {currentConfig.name} <DownOutlined style={{ fontSize: '10px' }} />
                </Tag>
              </Dropdown>
            </Space>
          </div>
        </div>
        <Space>
          <Tooltip title="清空对话">
            <Button 
              icon={<DeleteOutlined />} 
              onClick={handleClear} 
              type="text" 
              style={{ color: 'var(--tech-text-dim)' }}
            />
          </Tooltip>
          <Tooltip title="设置 API Key">
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => setIsSettingsOpen(true)} 
              type="text"
              style={{ color: 'var(--tech-text-dim)' }}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Chat Area */}
      <div className="glass-panel" style={{
        flex: 1,
        borderRadius: '16px',
        marginBottom: '16px',
        padding: '24px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        border: '1px solid rgba(255, 255, 255, 0.8)',
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
            <HomeOutlined style={{ fontSize: '64px', color: '#0062ff', marginBottom: '16px', opacity: 0.2 }} />
            <Text style={{ color: 'var(--tech-text-dim)' }}>开始新的对话...</Text>
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
                  maxWidth: '80%',
                  display: 'flex',
                  gap: '12px',
                  flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                }}
              >
                <Avatar 
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />} 
                  style={{ 
                    backgroundColor: msg.role === 'user' ? '#722ed1' : '#0062ff',
                    boxShadow: msg.role === 'user' ? '0 2px 8px rgba(114, 46, 209, 0.2)' : '0 2px 8px rgba(0, 98, 255, 0.2)',
                    flexShrink: 0
                  }} 
                />
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.role === 'user' ? '20px 4px 20px 20px' : '4px 20px 20px 20px',
                  background: msg.role === 'user' 
                    ? 'linear-gradient(135deg, rgba(114, 46, 209, 0.05) 0%, rgba(114, 46, 209, 0.1) 100%)' 
                    : 'rgba(255, 255, 255, 0.8)',
                  border: msg.role === 'user' 
                    ? '1px solid rgba(114, 46, 209, 0.1)' 
                    : '1px solid rgba(0, 98, 255, 0.1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  color: '#1f1f1f',
                  backdropFilter: 'blur(5px)',
                }}>
                  <div className="markdown-body" style={{ fontSize: '15px', lineHeight: '1.6' }}>
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
        gap: '12px',
        alignItems: 'flex-end',
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        boxShadow: '0 0 20px rgba(0, 98, 255, 0.05)'
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
            padding: '12px',
            fontSize: '16px',
            color: '#1f1f1f'
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
            background: 'linear-gradient(135deg, #0062ff 0%, #00b96b 100%)',
            border: 'none',
            boxShadow: '0 4px 10px rgba(0, 98, 255, 0.2)'
          }}
        />
      </div>

      {/* Settings Modal */}
      <Modal
        title={<span style={{ color: '#1f1f1f' }}>设置 API Key</span>}
        open={isSettingsOpen}
        onOk={handleSaveSettings}
        onCancel={() => setIsSettingsOpen(false)}
        okText="保存"
        cancelText="取消"
        centered
        styles={{ 
          content: { 
            background: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 98, 255, 0.1)'
          },
          mask: {
            backdropFilter: 'blur(4px)',
            background: 'rgba(255, 255, 255, 0.3)'
          }
        }}
      >
        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
          <Text style={{ color: 'var(--tech-text-dim)', display: 'block', marginBottom: '8px' }}>
            请输入您的 DashScope API Key (sk-...)
          </Text>
          <Input.Password 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            placeholder="sk-..." 
            style={{ 
              background: 'rgba(255, 255, 255, 0.5)', 
              borderColor: 'rgba(0, 0, 0, 0.1)',
              color: '#1f1f1f'
            }}
          />
          <Text style={{ fontSize: '12px', color: '#9ca3af', marginTop: '8px', display: 'block' }}>
            Key 仅保存在本地浏览器中，不会上传到其他服务器。
          </Text>
        </div>
      </Modal>
    </div>
  );
};

export default Chat;
