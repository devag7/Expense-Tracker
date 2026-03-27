'use client';

import { Category, BudgetLimits, Transaction } from '@/lib/types';

interface BudgetLimitsCardProps {
  budgetLimits: BudgetLimits;
  onChange: (limits: BudgetLimits) => void;
  transactions: Transaction[];
}

const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Health', 'Other'];

export default function BudgetLimitsCard({ budgetLimits, onChange, transactions }: BudgetLimitsCardProps) {
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce<Record<Category, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] ?? 0) + t.amount;
      return acc;
    }, { Food: 0, Transport: 0, Shopping: 0, Health: 0, Other: 0 });

  function handleLimitChange(category: Category, value: string) {
    const numeric = Number(value);
    const next: BudgetLimits = { ...budgetLimits };
    if (!value || Number.isNaN(numeric) || numeric <= 0) {
      delete next[category];
    } else {
      next[category] = numeric;
    }
    onChange(next);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Category Budgets</h2>
      <div className="space-y-3">
        {categories.map(category => {
          const spent = expensesByCategory[category] ?? 0;
          const limit = budgetLimits[category];
          const ratio = limit ? spent / limit : 0;
          const isWarning = Boolean(limit && ratio >= 0.8 && ratio <= 1);
          const isOver = Boolean(limit && ratio > 1);

          return (
            <div key={category} className="grid grid-cols-[110px_1fr_auto] items-center gap-3">
              <label className="text-sm text-gray-700 dark:text-gray-200">{category}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={limit ?? ''}
                onChange={e => handleLimitChange(category, e.target.value)}
                placeholder="Set limit"
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="text-right min-w-28">
                <p className="text-xs text-gray-500 dark:text-gray-400">₹{spent.toFixed(2)} spent</p>
                {limit ? (
                  <span
                    className={`inline-flex mt-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isOver
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
                        : isWarning
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                          : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
                    }`}
                  >
                    {isOver ? 'Over budget' : isWarning ? 'Budget warning' : 'On track'}
                  </span>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
