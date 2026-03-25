'use client';

import { Transaction } from '@/lib/types';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Food: '#f97316',
  Transport: '#3b82f6',
  Shopping: '#a855f7',
  Health: '#22c55e',
  Other: '#64748b',
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function TransactionList({ transactions, onDelete }: TransactionListProps) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Transactions</h2>
      {sorted.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">No transactions found.</p>
      ) : (
        <ul className="divide-y divide-gray-100">
          {sorted.map(t => (
            <li key={t.id} className="flex items-center justify-between py-3 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[t.category] ?? '#64748b' }}
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{t.description}</p>
                  <p className="text-xs text-gray-400">{formatDate(t.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: CATEGORY_COLORS[t.category] + '20',
                    color: CATEGORY_COLORS[t.category],
                  }}
                >
                  {t.category}
                </span>
                <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
                <button
                  onClick={() => onDelete(t.id)}
                  className="text-gray-300 hover:text-red-400 transition-colors text-xs p-1 rounded"
                  aria-label="Delete transaction"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
