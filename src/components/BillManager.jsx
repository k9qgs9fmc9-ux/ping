import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Tabs, 
  Typography, 
  message, 
  Popconfirm,
  Tooltip,
  Grid,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
  UnorderedListOutlined,
  PieChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useBillManager, generateSampleData, TRANSACTION_TYPES } from '../hooks/useBillManager';
import BillForm from './BillForm';
import BillList from './BillList';
import BillCharts from './BillCharts';
import { useSettings } from '../context/SettingsContext';
import { THEME_COLORS } from '../config/themes';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const BillManager = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { currentTheme } = useSettings();
  const themeColors = THEME_COLORS[currentTheme];

  const {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getStatistics,
    exportToCSV,
    filterTransactions,
  } = useBillManager();

  const [activeTab, setActiveTab] = useState('list');
  const [formVisible, setFormVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [hasGeneratedSample, setHasGeneratedSample] = useState(false);

  // 加载示例数据（仅首次）
  useEffect(() => {
    if (isLoaded && transactions.length === 0 && !hasGeneratedSample) {
      // 自动加载示例数据以便用户体验
      const sampleData = generateSampleData();
      sampleData.forEach(data => {
        addTransaction({
          type: data.type,
          category: data.category,
          categoryName: data.categoryName,
          categoryIcon: data.categoryIcon,
          amount: data.amount,
          date: data.date,
          note: data.note,
        });
      });
      setHasGeneratedSample(true);
      message.success('已加载示例数据，您可以开始体验账单管理功能');
    }
  }, [isLoaded, transactions.length, hasGeneratedSample]);

  // 处理添加
  const handleAdd = (values) => {
    addTransaction(values);
  };

  // 处理编辑
  const handleEdit = (record) => {
    setEditingRecord(record);
    setFormVisible(true);
  };

  // 处理更新
  const handleUpdate = (values) => {
    if (editingRecord) {
      updateTransaction(editingRecord.id, values);
      setEditingRecord(null);
    }
  };

  // 处理删除
  const handleDelete = (id) => {
    deleteTransaction(id);
    message.success('删除成功');
  };

  // 关闭表单
  const handleCloseForm = () => {
    setFormVisible(false);
    setEditingRecord(null);
  };

  // 获取统计数据
  const stats = getStatistics();

  // Tab 配置
  const tabItems = [
    {
      key: 'list',
      label: (
        <Space>
          <UnorderedListOutlined />
          <span>账单列表</span>
        </Space>
      ),
      children: (
        <BillList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={!isLoaded}
        />
      ),
    },
    {
      key: 'charts',
      label: (
        <Space>
          <PieChartOutlined />
          <span>统计分析</span>
        </Space>
      ),
      children: (
        <BillCharts transactions={transactions} />
      ),
    },
  ];

  return (
    <div style={{ height: '100%' }}>
      {/* 头部信息栏 */}
      <Card style={{ marginBottom: 24 }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <div>
            <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
              💰 账单管理
            </Title>
            <Text style={{ color: themeColors?.textSecondary }}>
              记录每一笔收支，掌握财务健康状况
            </Text>
          </div>
          
          <Space wrap>
            {/* 统计概览 */}
            <Card 
              size="small" 
              style={{ 
                background: `${themeColors?.primary}10`,
                border: `1px solid ${themeColors?.primary}30`,
              }}
            >
              <Space>
                <Text style={{ color: themeColors?.textSecondary }}>总收入</Text>
                <Text strong style={{ fontSize: 18, color: '#52c41a' }}>
                  ¥{stats.totalIncome.toFixed(2)}
                </Text>
              </Space>
            </Card>
            
            <Card 
              size="small" 
              style={{ 
                background: '#fff2f0',
                border: '1px solid #ffccc7',
              }}
            >
              <Space>
                <Text style={{ color: themeColors?.textSecondary }}>总支出</Text>
                <Text strong style={{ fontSize: 18, color: '#f5222d' }}>
                  ¥{stats.totalExpense.toFixed(2)}
                </Text>
              </Space>
            </Card>
            
            <Card 
              size="small" 
              style={{ 
                background: `${themeColors?.primary}08`,
                border: `1px solid ${themeColors?.primary}20`,
              }}
            >
              <Space>
                <Text style={{ color: themeColors?.textSecondary }}>结余</Text>
                <Text 
                  strong 
                  style={{ 
                    fontSize: 18,
                    color: stats.balance >= 0 ? '#52c41a' : '#f5222d'
                  }}
                >
                  {stats.balance >= 0 ? '+' : ''}¥{stats.balance.toFixed(2)}
                </Text>
              </Space>
            </Card>
          </Space>
        </div>

        {/* 操作按钮栏 */}
        <div style={{ 
          marginTop: 16, 
          paddingTop: 16, 
          borderTop: `1px solid ${themeColors?.border || '#f0f0f0'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12
        }}>
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              onClick={() => setFormVisible(true)}
            >
              {isMobile ? '记账' : '添加账单'}
            </Button>
            
            <Tooltip title="导出CSV">
              <Button
                icon={<DownloadOutlined />}
                size="large"
                onClick={exportToCSV}
                disabled={transactions.length === 0}
              >
                导出
              </Button>
            </Tooltip>
          </Space>

          <Space>
            {transactions.length > 0 && (
              <Popconfirm
                title="确认清空"
                description="确定要清空所有账单数据吗？此操作不可恢复。"
                onConfirm={() => {
                  transactions.forEach(t => deleteTransaction(t.id));
                  message.success('数据已清空');
                }}
                okText="清空"
                cancelText="取消"
                okButtonProps={{ danger: true }}
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  size="large"
                >
                  清空数据
                </Button>
              </Popconfirm>
            )}
          </Space>
        </div>
      </Card>

      {/* 主内容区 */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        type="card"
        size="large"
      />

      {/* 添加/编辑表单 */}
      <BillForm
        visible={formVisible}
        onCancel={handleCloseForm}
        onSubmit={editingRecord ? handleUpdate : handleAdd}
        initialValues={editingRecord}
        isEdit={!!editingRecord}
      />
    </div>
  );
};

export default BillManager;
