import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Button, 
  Space, 
  Tag, 
  Input, 
  Select, 
  DatePicker, 
  Card, 
  Typography, 
  Popconfirm,
  Empty,
  Pagination,
  Tooltip,
  Badge,
  Grid
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { TRANSACTION_TYPES, CATEGORIES } from '../hooks/useBillManager';
import { useSettings } from '../context/SettingsContext';
import { THEME_COLORS } from '../config/themes';

const { Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { useBreakpoint } = Grid;

const BillList = ({ 
  transactions, 
  onEdit, 
  onDelete, 
  loading = false 
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { currentTheme } = useSettings();
  const themeColors = THEME_COLORS[currentTheme];

  // 筛选状态
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    dateRange: null,
    keyword: '',
  });

  // 分页状态
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
  });

  // 应用筛选
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (filters.type !== 'all') {
      result = result.filter(t => t.type === filters.type);
    }

    if (filters.category !== 'all') {
      result = result.filter(t => t.category === filters.category);
    }

    if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
      const startDate = filters.dateRange[0].format('YYYY-MM-DD');
      const endDate = filters.dateRange[1].format('YYYY-MM-DD');
      result = result.filter(t => {
        const tDate = dayjs(t.date);
        return (tDate.isAfter(startDate, 'day') || tDate.isSame(startDate, 'day')) &&
               (tDate.isBefore(endDate, 'day') || tDate.isSame(endDate, 'day'));
      });
    }

    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(t => 
        (t.note && t.note.toLowerCase().includes(keyword)) ||
        t.categoryName.toLowerCase().includes(keyword)
      );
    }

    return result.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [transactions, filters]);

  // 分页数据
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, pagination]);

  // 重置筛选
  const handleReset = () => {
    setFilters({
      type: 'all',
      category: 'all',
      dateRange: null,
      keyword: '',
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 统计
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense, count: filteredTransactions.length };
  }, [filteredTransactions]);

  // 所有分类选项
  const allCategories = useMemo(() => {
    return [
      ...CATEGORIES[TRANSACTION_TYPES.INCOME],
      ...CATEGORIES[TRANSACTION_TYPES.EXPENSE],
    ];
  }, []);

  // 表格列
  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      sorter: (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
      render: (date) => (
        <Text style={{ fontWeight: 500 }}>
          {dayjs(date).format('MM-DD')}
        </Text>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => (
        <Tag 
          color={type === TRANSACTION_TYPES.INCOME ? 'success' : 'error'}
          style={{ fontWeight: 'bold' }}
        >
          {type === TRANSACTION_TYPES.INCOME ? (
            <><ArrowUpOutlined /> 收入</>
          ) : (
            <><ArrowDownOutlined /> 支出</>
          )}
        </Tag>
      ),
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'category',
      width: 120,
      render: (name, record) => (
        <Space>
          <span style={{ fontSize: 18 }}>{record.categoryIcon}</span>
          <span>{name}</span>
        </Space>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount, record) => (
        <Text 
          strong 
          style={{ 
            fontSize: 16,
            color: record.type === TRANSACTION_TYPES.INCOME ? '#52c41a' : '#f5222d'
          }}
        >
          {record.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}
          ¥{amount.toFixed(2)}
        </Text>
      ),
    },
    {
      title: '备注',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (note) => note || '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <Space>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确认删除"
            description="确定要删除这条账单记录吗？"
            onConfirm={() => onDelete(record.id)}
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 移动端简化列
  const mobileColumns = [
    {
      title: '账单记录',
      key: 'mobile',
      render: (_, record) => (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Space style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 20 }}>{record.categoryIcon}</span>
              <Text strong>{record.categoryName}</Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                {dayjs(record.date).format('MM-DD')}
              </Text>
            </Space>
            <div>
              <Text type="secondary" ellipsis style={{ maxWidth: 200, fontSize: 12 }}>
                {record.note || '无备注'}
              </Text>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <Text 
              strong 
              style={{ 
                fontSize: 16,
                color: record.type === TRANSACTION_TYPES.INCOME ? '#52c41a' : '#f5222d',
                display: 'block'
              }}
            >
              {record.type === TRANSACTION_TYPES.INCOME ? '+' : '-'}
              ¥{record.amount.toFixed(2)}
            </Text>
            <Space size={4} style={{ marginTop: 4 }}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
              />
              <Popconfirm
                title="确认删除"
                onConfirm={() => onDelete(record.id)}
                okText="删除"
                cancelText="取消"
              >
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                />
              </Popconfirm>
            </Space>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <Card style={{ marginBottom: 16 }}>
        <Space wrap style={{ width: '100%' }}>
          <Select
            placeholder="交易类型"
            value={filters.type}
            onChange={(value) => setFilters({ ...filters, type: value })}
            style={{ width: 120 }}
            allowClear
          >
            <Option value="all">全部类型</Option>
            <Option value={TRANSACTION_TYPES.INCOME}>收入</Option>
            <Option value={TRANSACTION_TYPES.EXPENSE}>支出</Option>
          </Select>

          <Select
            placeholder="分类"
            value={filters.category}
            onChange={(value) => setFilters({ ...filters, category: value })}
            style={{ width: 140 }}
            allowClear
          >
            <Option value="all">全部分类</Option>
            {allCategories.map(cat => (
              <Option key={cat.id} value={cat.id}>
                <Space>
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                </Space>
              </Option>
            ))}
          </Select>

          <RangePicker
            value={filters.dateRange}
            onChange={(dates) => setFilters({ ...filters, dateRange: dates })}
            placeholder={['开始日期', '结束日期']}
            style={{ width: 240 }}
          />

          <Input
            placeholder="搜索备注或分类"
            value={filters.keyword}
            onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            allowClear
          />

          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
          >
            重置
          </Button>
        </Space>

        {/* 统计信息 */}
        <div style={{ 
          marginTop: 16, 
          padding: '12px 16px', 
          background: themeColors?.bgContainer || '#f6ffed', 
          borderRadius: 8,
          border: `1px solid ${themeColors?.border || '#d9f7be'}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16
        }}>
          <Space size={24}>
            <span>
              <Text style={{ color: themeColors?.textSecondary }}>筛选结果：</Text>
              <Badge count={stats.count} style={{ backgroundColor: themeColors?.primary || '#1890ff' }} />
              <Text style={{ marginLeft: 4, color: themeColors?.textSecondary }}>条</Text>
            </span>
            <span>
              <Text style={{ color: themeColors?.textSecondary }}>收入：</Text>
              <Text strong style={{ fontSize: 16, color: '#52c41a' }}>
                +¥{stats.income.toFixed(2)}
              </Text>
            </span>
            <span>
              <Text style={{ color: themeColors?.textSecondary }}>支出：</Text>
              <Text strong style={{ fontSize: 16, color: '#f5222d' }}>
                -¥{stats.expense.toFixed(2)}
              </Text>
            </span>
            <span>
              <Text style={{ color: themeColors?.textSecondary }}>结余：</Text>
              <Text strong style={{ 
                fontSize: 16,
                color: stats.income - stats.expense >= 0 ? '#52c41a' : '#f5222d'
              }}>
                {(stats.income - stats.expense) >= 0 ? '+' : ''}
                ¥{(stats.income - stats.expense).toFixed(2)}
              </Text>
            </span>
          </Space>
        </div>
      </Card>

      {/* 表格 */}
      <Card>
        <Table
          columns={isMobile ? mobileColumns : columns}
          dataSource={paginatedData}
          rowKey="id"
          loading={loading}
          pagination={false}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无账单记录"
              />
            ),
          }}
        />

        {/* 分页 */}
        {filteredTransactions.length > 0 && (
          <div style={{ 
            marginTop: 16, 
            display: 'flex', 
            justifyContent: 'flex-end' 
          }}>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={filteredTransactions.length}
              onChange={(page, pageSize) => setPagination({ current: page, pageSize })}
              showSizeChanger={false}
              showTotal={(total) => `共 ${total} 条`}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default BillList;
