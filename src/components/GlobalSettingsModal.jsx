import React, { useState, useEffect } from 'react';
import { Modal, Input, Typography, Form, message, Alert } from 'antd';
import { useSettings } from '../context/SettingsContext';

const { Text } = Typography;

const GlobalSettingsModal = () => {
  const { 
    isSettingsOpen, 
    closeSettings, 
    apiKey, 
    setApiKey, 
    chatBaseUrl, 
    setChatBaseUrl 
  } = useSettings();

  const [form] = Form.useForm();

  useEffect(() => {
    if (isSettingsOpen) {
      form.setFieldsValue({
        apiKey,
        chatBaseUrl
      });
    }
  }, [isSettingsOpen, apiKey, chatBaseUrl, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      setApiKey(values.apiKey.trim());
      setChatBaseUrl(values.chatBaseUrl.trim());
      message.success('设置已保存');
      closeSettings();
    });
  };

  return (
    <Modal
      title="全局设置 (纯前端模式)"
      open={isSettingsOpen}
      onOk={handleOk}
      onCancel={closeSettings}
      okText="保存"
      cancelText="取消"
    >
      <Alert
        message="纯前端模式说明"
        description="配置 API Key 后，应用将尝试直接从浏览器请求 API，无需后端服务。请注意：阿里云官方 API 默认不支持浏览器跨域访问(CORS)，您可能需要配合允许跨域的浏览器插件或使用自定义代理地址。"
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />
      
      <Form form={form} layout="vertical">
        <Form.Item
          label="DashScope API Key"
          name="apiKey"
          rules={[{ required: false, message: '请输入 API Key' }]}
          help="从阿里云百炼控制台获取，以 sk- 开头"
        >
          <Input.Password placeholder="sk-..." />
        </Form.Item>

        <Form.Item
          label="Chat API Base URL"
          name="chatBaseUrl"
          rules={[{ required: true, message: '请输入 Base URL' }]}
          help="默认为阿里云 DashScope 兼容接口地址"
        >
          <Input placeholder="https://dashscope.aliyuncs.com/compatible-mode/v1" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GlobalSettingsModal;
