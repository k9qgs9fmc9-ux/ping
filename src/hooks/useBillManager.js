// 账单数据管理工具
import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';

const STORAGE_KEY = 'bill_management_data';

// 交易类型
export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

// 分类定义
export const CATEGORIES = {
  [TRANSACTION_TYPES.INCOME]: [
    { id: 'salary', name: '工资', icon: '💰' },
    { id: 'bonus', name: '奖金', icon: '🎁' },
    { id: 'investment', name: '投资收益', icon: '📈' },
    { id: 'other_income', name: '其他收入', icon: '💵' },
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    { id: 'food', name: '餐饮', icon: '🍔' },
    { id: 'transport', name: '交通', icon: '🚗' },
    { id: 'shopping', name: '购物', icon: '🛍️' },
    { id: 'entertainment', name: '娱乐', icon: '🎮' },
    { id: 'housing', name: '住房', icon: '🏠' },
    { id: 'medical', name: '医疗', icon: '🏥' },
    { id: 'education', name: '教育', icon: '📚' },
    { id: 'other_expense', name: '其他支出', icon: '📝' },
  ],
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 从localStorage加载数据
const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load data from storage:', error);
  }
  return [];
};

// 保存数据到localStorage
const saveToStorage = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data to storage:', error);
  }
};

// 自定义Hook - 账单管理
export const useBillManager = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 初始加载
  useEffect(() => {
    const data = loadFromStorage();
    setTransactions(data);
    setIsLoaded(true);
  }, []);

  // 自动保存
  useEffect(() => {
    if (isLoaded) {
      saveToStorage(transactions);
    }
  }, [transactions, isLoaded]);

  // 添加交易
  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTransaction, ...prev]);
    return newTransaction;
  }, []);

  // 更新交易
  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  // 删除交易
  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 获取单个交易
  const getTransaction = useCallback((id) => {
    return transactions.find((t) => t.id === id);
  }, [transactions]);

  // 获取统计数据
  const getStatistics = useCallback(() => {
    const income = transactions
      .filter((t) => t.type === TRANSACTION_TYPES.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = transactions
      .filter((t) => t.type === TRANSACTION_TYPES.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      transactionCount: transactions.length,
    };
  }, [transactions]);

  // 导出CSV
  const exportToCSV = useCallback(() => {
    const headers = ['日期', '类型', '分类', '金额', '备注'];
    const rows = transactions.map((t) => [
      dayjs(t.date).format('YYYY-MM-DD'),
      t.type === TRANSACTION_TYPES.INCOME ? '收入' : '支出',
      t.categoryName,
      t.amount.toFixed(2),
      t.note || '',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `账单数据_${dayjs().format('YYYY-MM-DD')}.csv`;
    link.click();
  }, [transactions]);

  // 筛选和搜索
  const filterTransactions = useCallback((filters) => {
    let result = [...transactions];

    // 按类型筛选
    if (filters.type && filters.type !== 'all') {
      result = result.filter((t) => t.type === filters.type);
    }

    // 按分类筛选
    if (filters.category && filters.category !== 'all') {
      result = result.filter((t) => t.category === filters.category);
    }

    // 按日期范围筛选
    if (filters.startDate) {
      result = result.filter((t) => dayjs(t.date).isAfter(filters.startDate, 'day') || dayjs(t.date).isSame(filters.startDate, 'day'));
    }
    if (filters.endDate) {
      result = result.filter((t) => dayjs(t.date).isBefore(filters.endDate, 'day') || dayjs(t.date).isSame(filters.endDate, 'day'));
    }

    // 搜索关键词
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      result = result.filter(
        (t) =>
          (t.note && t.note.toLowerCase().includes(keyword)) ||
          t.categoryName.toLowerCase().includes(keyword)
      );
    }

    // 排序 - 按日期降序
    result.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());

    return result;
  }, [transactions]);

  return {
    transactions,
    isLoaded,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getTransaction,
    getStatistics,
    exportToCSV,
    filterTransactions,
  };
};

// 生成示例数据
export const generateSampleData = () => {
  const sampleData = [];
  const categories = {
    [TRANSACTION_TYPES.INCOME]: ['salary', 'bonus', 'investment', 'other_income'],
    [TRANSACTION_TYPES.EXPENSE]: ['food', 'transport', 'shopping', 'entertainment', 'housing', 'medical'],
  };

  // 生成过去90天的数据
  for (let i = 0; i < 90; i++) {
    const date = dayjs().subtract(i, 'day');
    const isIncome = Math.random() > 0.7;
    const type = isIncome ? TRANSACTION_TYPES.INCOME : TRANSACTION_TYPES.EXPENSE;
    const categoryList = categories[type];
    const category = categoryList[Math.floor(Math.random() * categoryList.length)];
    
    // 每天1-3条记录
    const count = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < count; j++) {
      const amount = isIncome 
        ? Math.floor(Math.random() * 5000) + 1000
        : Math.floor(Math.random() * 300) + 20;
      
      sampleData.push({
        id: generateId(),
        type,
        category,
        categoryName: CATEGORIES[type].find(c => c.id === category)?.name || category,
        amount,
        date: date.format('YYYY-MM-DD'),
        note: isIncome ? '收入记录' : '日常消费',
        createdAt: date.toISOString(),
      });
    }
  }

  return sampleData.sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
};

export default useBillManager;
