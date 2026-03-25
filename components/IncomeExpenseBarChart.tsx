'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/lib/types';

interface IncomeExpenseBarChartProps {
  transactions: Transaction[];
}

function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getLastSixMonthsKeys(): string[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    keys.push(getMonthKey(date));
  }
  return keys;
}

export default function IncomeExpenseBarChart({ transactions }: IncomeExpenseBarChartProps) {
  const monthKeys = getLastSixMonthsKeys();

  const grouped = monthKeys.reduce<Record<string, { income: number; expense: number }>>((acc, key) => {
    acc[key] = { income: 0, expense: 0 };
    return acc;
  }, {});

  transactions.forEach(transaction => {
    const date = new Date(`${transaction.date}T00:00:00`);
    const key = getMonthKey(date);
    if (!grouped[key]) return;
    grouped[key][transaction.type] += transaction.amount;
  });

  const data = monthKeys.map(key => {
    const [year, month] = key.split('-');
    return {
      month: new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-US', { month: 'short' }),
      income: grouped[key].income,
      expense: grouped[key].expense,
    };
  });

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Income vs Expense (6 Months)</h2>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
          <Legend />
          <Bar dataKey="income" fill="#16a34a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
