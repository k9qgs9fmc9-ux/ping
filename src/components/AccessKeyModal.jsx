import React, { useState } from 'react';
import { Modal, Input, Button, Alert } from 'antd';
import { KeyOutlined } from '@ant-design/icons';
import { ACCESS_KEYS } from '../config/versions';

const AccessKeyModal = ({ visible, onClose, onKeySubmit }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!key.trim()) {
      setError('请输入访问密钥');
      return;
    }
    
    if (key !== ACCESS_KEYS.PRIVATE && key !== ACCESS_KEYS.CREATION) {
      setError('访问密钥无效');
      return;
    }

    onKeySubmit(key);
    setKey('');
    setError('');
  };

  const handleCancel = () => {
    setKey('');
    setError('');
    onClose();
  };

  return (
    <Modal
      title="输入访问密钥"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确认
        </Button>,
      ]}
      centered
    >
      <div style={{ padding: '20px 0' }}>
        <Input
          placeholder="请输入访问密钥"
          prefix={<KeyOutlined />}
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            setError('');
          }}
          onPressEnter={handleSubmit}
          type="password"
        />
        {error && (
          <Alert
            type="error"
            message={error}
            style={{ marginTop: '12px' }}
            showIcon
          />
        )}
      </div>
    </Modal>
  );
};

export default AccessKeyModal;
