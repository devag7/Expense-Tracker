'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction, Category } from '@/lib/types';

interface ExpensePieChartProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<Category, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#a855f7',
  Health: '#22c55e',
  Other: '#64748b',
};

export default function ExpensePieChart({ transactions }: ExpensePieChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense');

  const grouped = expenses.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Expense Breakdown</h2>
      {data.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-12">No expense data to display.</p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[entry.name as Category] ?? '#64748b'}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${Number(value ?? 0).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
