import React, { useState } from 'react';
import { Layout, Button, Input, Card, Table, Empty, Typography, Space, Tooltip } from 'antd';
import { FileExcelOutlined, SendOutlined, DownloadOutlined, TableOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title, Text } = Typography;

const ExcelGenerator = () => {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [data, setData] = useState(null);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    
    // Simulate generation
    setTimeout(() => {
      setLoading(false);
      setData([
        { key: '1', date: '2024-01-01', category: '餐饮', amount: 120, remark: '工作午餐' },
        { key: '2', date: '2024-01-02', category: '交通', amount: 45, remark: '打车' },
        { key: '3', date: '2024-01-03', category: '办公', amount: 350, remark: '购买文具' },
        { key: '4', date: '2024-01-04', category: '餐饮', amount: 200, remark: '团队聚餐' },
        { key: '5', date: '2024-01-05', category: '其他', amount: 88, remark: '杂费' },
      ]);
    }, 1500);
  };

  const columns = [
    { title: '日期', dataIndex: 'date', key: 'date' },
    { title: '类别', dataIndex: 'category', key: 'category' },
    { title: '金额 (元)', dataIndex: 'amount', key: 'amount', render: (text) => `¥${text}` },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ];

  return (
    <div style={{ height: '100%', padding: '24px', overflowY: 'auto' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Title level={2} style={{ marginBottom: 32, textAlign: 'center' }}>
          <Space>
            <FileExcelOutlined style={{ color: '#52c41a' }} />
            AI Excel 智能表格
          </Space>
        </Title>

        <Card className="glass-panel" bordered={false} style={{ marginBottom: 24 }}>
          <Space.Compact style={{ width: '100%' }}>
            <Input 
              size="large" 
              placeholder="描述你需要生成的表格，例如：生成一份1月份的公司日常报销明细表..." 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onPressEnter={handleGenerate}
            />
            <Button 
              type="primary" 
              size="large" 
              icon={<SendOutlined />} 
              loading={loading}
              onClick={handleGenerate}
            >
              生成
            </Button>
          </Space.Compact>
        </Card>

        <Card className="glass-panel" bordered={false} bodyStyle={{ padding: 0 }}>
          {data ? (
            <div>
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space>
                  <TableOutlined />
                  <Text strong>生成结果预览</Text>
                </Space>
                <Button type="primary" icon={<DownloadOutlined />} ghost>
                  导出 .xlsx
                </Button>
              </div>
              <Table 
                columns={columns} 
                dataSource={data} 
                pagination={false} 
                style={{ background: 'transparent' }}
              />
            </div>
          ) : (
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE} 
              description="暂无数据，请在上方输入描述生成表格"
              style={{ padding: 48 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
};

export default ExcelGenerator;
