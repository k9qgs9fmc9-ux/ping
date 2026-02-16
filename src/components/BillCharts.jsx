import React, { useMemo } from 'react';
import { Card, Row, Col, Statistic, Space, Typography, Badge, Empty } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  WalletOutlined,
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import dayjs from 'dayjs';
import { TRANSACTION_TYPES, CATEGORIES } from '../hooks/useBillManager';

const { Title, Text } = Typography;

// 颜色配置
const COLORS = {
  income: '#52c41a',
  expense: '#f5222d',
  balance: '#1890ff',
  categories: [
    '#1890ff', '#52c41a', '#faad14', '#f5222d', 
    '#722ed1', '#eb2f96', '#13c2c2', '#fa541c',
    '#a0d911', '#ffc53d', '#ff7a45', '#36cfc9'
  ],
};

const BillCharts = ({ transactions }) => {
  
  // 总体统计
  const totalStats = useMemo(() => {
    const income = transactions
      .filter(t => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expense,
      balance: income - expense,
      count: transactions.length,
    };
  }, [transactions]);

  // 近30天趋势数据
  const trendData = useMemo(() => {
    const data = [];
    const today = dayjs();
    
    for (let i = 29; i >= 0; i--) {
      const date = today.subtract(i, 'day');
      const dateStr = date.format('YYYY-MM-DD');
      const dayTransactions = transactions.filter(t => t.date === dateStr);
      
      const income = dayTransactions
        .filter(t => t.type === TRANSACTION_TYPES.INCOME)
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = dayTransactions
        .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
        .reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        date: date.format('MM-DD'),
        income: Math.round(income * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        balance: Math.round((income - expense) * 100) / 100,
      });
    }
    
    return data;
  }, [transactions]);

  // 分类支出数据
  const categoryData = useMemo(() => {
    const expenseByCategory = {};
    
    transactions
      .filter(t => t.type === TRANSACTION_TYPES.EXPENSE)
      .forEach(t => {
        if (!expenseByCategory[t.category]) {
          expenseByCategory[t.category] = {
            name: t.categoryName,
            icon: t.categoryIcon,
            value: 0,
          };
        }
        expenseByCategory[t.category].value += t.amount;
      });

    return Object.values(expenseByCategory)
      .sort((a, b) => b.value - a.value)
      .slice(0, 8)
      .map(item => ({
        ...item,
        value: Math.round(item.value * 100) / 100,
      }));
  }, [transactions]);

  // 月度对比数据
  const monthlyData = useMemo(() => {
    const monthly = {};
    
    transactions.forEach(t => {
      const month = dayjs(t.date).format('YYYY-MM');
      if (!monthly[month]) {
        monthly[month] = { month, income: 0, expense: 0 };
      }
      if (t.type === TRANSACTION_TYPES.INCOME) {
        monthly[month].income += t.amount;
      } else {
        monthly[month].expense += t.amount;
      }
    });

    return Object.values(monthly)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-12)
      .map(item => ({
        ...item,
        income: Math.round(item.income * 100) / 100,
        expense: Math.round(item.expense * 100) / 100,
        month: dayjs(item.month).format('YYYY年MM月'),
      }));
  }, [transactions]);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ 
          background: 'rgba(255,255,255,0.95)', 
          padding: '12px 16px', 
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid rgba(0,0,0,0.1)'
        }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>{label}</Text>
          {payload.map((entry, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              <span style={{ color: entry.color }}>●</span>
              <span style={{ marginLeft: 8 }}>{entry.name}:</span>
              <Text strong style={{ marginLeft: 8 }}>
                ¥{entry.value.toFixed(2)}
              </Text>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="暂无数据，请先添加账单记录"
        />
      </Card>
    );
  }

  return (
    <div>
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总收入"
              value={totalStats.income}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#52c41a' }}
              prefix={<ArrowUpOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="总支出"
              value={totalStats.expense}
              precision={2}
              prefix="¥"
              valueStyle={{ color: '#f5222d' }}
              prefix={<ArrowDownOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="结余"
              value={totalStats.balance}
              precision={2}
              prefix="¥"
              valueStyle={{ 
                color: totalStats.balance >= 0 ? '#52c41a' : '#f5222d' 
              }}
              prefix={<WalletOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="交易笔数"
              value={totalStats.count}
              prefix={<BarChartOutlined style={{ marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 趋势图 */}
      <Card 
        title={
          <Space>
            <LineChartOutlined />
            <span>近30天收支趋势</span>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={trendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.income} stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.expense} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={COLORS.expense} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: '#e8e8e8' }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `¥${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="income"
              name="收入"
              stroke={COLORS.income}
              fillOpacity={1}
              fill="url(#colorIncome)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="expense"
              name="支出"
              stroke={COLORS.expense}
              fillOpacity={1}
              fill="url(#colorExpense)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={[24, 24]}>
        {/* 分类饼图 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <PieChartOutlined />
                <span>支出分类占比</span>
              </Space>
            }
          >
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS.categories[index % COLORS.categories.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `¥${Number(value).toFixed(2)}`}
                    contentStyle={{
                      background: 'rgba(255,255,255,0.95)',
                      borderRadius: 8,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无支出数据" />
            )}
            
            {/* 分类图例 */}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px', 
              marginTop: 16,
              justifyContent: 'center'
            }}>
              {categoryData.map((item, index) => (
                <Badge
                  key={item.name}
                  color={COLORS.categories[index % COLORS.categories.length]}
                  text={
                    <Space>
                      <span>{item.icon}</span>
                      <span>{item.name}</span>
                      <Text type="secondary">¥{item.value.toFixed(0)}</Text>
                    </Space>
                  }
                />
              ))}
            </div>
          </Card>
        </Col>

        {/* 月度对比 */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BarChartOutlined />
                <span>月度收支对比</span>
              </Space>
            }
          >
            {monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `¥${value}`}
                  />
                  <Tooltip 
                    content={<CustomTooltip />}
                    cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="income" 
                    name="收入" 
                    fill={COLORS.income}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar 
                    dataKey="expense" 
                    name="支出" 
                    fill={COLORS.expense}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Empty description="暂无月度数据" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BillCharts;
