import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, DatePicker, Button, Space, message } from 'antd';
import dayjs from 'dayjs';
import { TRANSACTION_TYPES, CATEGORIES } from '../hooks/useBillManager';
import { useSettings } from '../context/SettingsContext';
import { THEME_COLORS } from '../config/themes';

const { Option } = Select;
const { TextArea } = Input;

const BillForm = ({ visible, onCancel, onSubmit, initialValues, isEdit = false }) => {
  const [form] = Form.useForm();
  const [transactionType, setTransactionType] = useState(TRANSACTION_TYPES.EXPENSE);
  const { currentTheme } = useSettings();
  const themeColors = THEME_COLORS[currentTheme];

  useEffect(() => {
    if (visible) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          date: dayjs(initialValues.date),
        });
        setTransactionType(initialValues.type);
      } else {
        form.resetFields();
        form.setFieldsValue({
          type: TRANSACTION_TYPES.EXPENSE,
          date: dayjs(),
        });
        setTransactionType(TRANSACTION_TYPES.EXPENSE);
      }
    }
  }, [visible, initialValues, form]);

  const handleTypeChange = (value) => {
    setTransactionType(value);
    form.setFieldsValue({ category: undefined });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      const categoryInfo = CATEGORIES[values.type].find(c => c.id === values.category);
      
      const data = {
        type: values.type,
        category: values.category,
        categoryName: categoryInfo?.name || values.category,
        categoryIcon: categoryInfo?.icon || '📝',
        amount: parseFloat(values.amount),
        date: values.date.format('YYYY-MM-DD'),
        note: values.note?.trim() || '',
      };

      onSubmit(data);
      message.success(isEdit ? '账单更新成功' : '账单添加成功');
      onCancel();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const typeOptions = [
    { value: TRANSACTION_TYPES.INCOME, label: '收入', color: '#52c41a' },
    { value: TRANSACTION_TYPES.EXPENSE, label: '支出', color: '#f5222d' },
  ];

  const currentCategories = CATEGORIES[transactionType] || [];

  return (
    <Modal
      title={
        <span style={{ color: themeColors?.textPrimary || '#1f1f1f', fontWeight: 600 }}>
          {isEdit ? '编辑账单' : '添加账单'}
        </span>
      }
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={520}
      destroyOnClose
      styles={{
        content: {
          background: themeColors?.bgContainer || '#ffffff',
        },
        header: {
          background: themeColors?.bgContainer || '#ffffff',
          borderBottom: `1px solid ${themeColors?.border || '#f0f0f0'}`,
        },
        body: {
          background: themeColors?.bgContainer || '#ffffff',
        },
      }}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          name="type"
          label={<span style={{ color: themeColors?.textPrimary || '#1f1f1f' }}>交易类型</span>}
          rules={[{ required: true, message: '请选择交易类型' }]}
        >
          <Select
            placeholder="选择交易类型"
            size="large"
            onChange={handleTypeChange}
          >
            {typeOptions.map(opt => (
              <Option key={opt.value} value={opt.value}>
                <span style={{ color: opt.color, fontWeight: 'bold' }}>
                  {opt.label}
                </span>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label={<span style={{ color: themeColors?.textPrimary || '#1f1f1f' }}>分类</span>}
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Select
            placeholder="选择分类"
            size="large"
          >
            {currentCategories.map(cat => (
              <Option key={cat.id} value={cat.id}>
                <Space>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label={<span style={{ color: themeColors?.textPrimary || '#1f1f1f' }}>金额</span>}
          rules={[
            { required: true, message: '请输入金额' },
            { type: 'number', min: 0.01, message: '金额必须大于0' },
          ]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="请输入金额"
            size="large"
            prefix="¥"
            min={0.01}
            step={0.01}
            precision={2}
            formatter={(value) => value ? `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''}
            parser={(value) => value.replace(/¥\s?|(,*)/g, '')}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            size="large"
            placeholder="选择日期"
            format="YYYY-MM-DD"
          />
        </Form.Item>

        <Form.Item
          name="note"
          label="备注"
        >
          <TextArea
            placeholder="添加备注信息（可选）"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button size="large" onClick={onCancel}>
              取消
            </Button>
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSubmit}
              style={{ minWidth: 100 }}
            >
              {isEdit ? '保存' : '添加'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BillForm;
