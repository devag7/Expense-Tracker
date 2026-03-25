'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  getTransactions,
  deleteTransaction,
  processRecurringTransactions,
  getBudgetLimits,
  saveBudgetLimits,
} from '@/lib/storage';
import { Transaction, BudgetLimits } from '@/lib/types';
import AddTransactionForm from '@/components/AddTransactionForm';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';
import ExpensePieChart from '@/components/ExpensePieChart';
import MonthFilter from '@/components/MonthFilter';
import IncomeExpenseBarChart from '@/components/IncomeExpenseBarChart';
import BudgetLimitsCard from '@/components/BudgetLimitsCard';
import CsvTools from '@/components/CsvTools';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetLimits, setBudgetLimits] = useState<BudgetLimits>({});
  const [darkMode, setDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [monthFilter, setMonthFilter] = useState<{ year: number; month: number } | null>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const loadTransactions = useCallback(() => {
    const loaded = processRecurringTransactions(getTransactions());
    setTransactions(loaded);
  }, []);

  useEffect(() => {
    loadTransactions();
    setBudgetLimits(getBudgetLimits());
    const savedTheme = localStorage.getItem('expense-tracker-theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, [loadTransactions]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('expense-tracker-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleBudgetChange = useCallback((next: BudgetLimits) => {
    setBudgetLimits(next);
    saveBudgetLimits(next);
  }, []);

  function handleDelete(id: string) {
    const updated = deleteTransaction(id);
    setTransactions(updated);
  }

  const filteredTransactions = useMemo(
    () =>
      monthFilter
        ? transactions.filter(t => {
            const [year, month] = t.date.split('-').map(Number);
            return year === monthFilter.year && month === monthFilter.month;
          })
        : transactions,
    [transactions, monthFilter]
  );

  const netBalance = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  }, [filteredTransactions]);

  useEffect(() => {
    setShowConfetti(netBalance > 0);
  }, [netBalance]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {showConfetti ? (
        <div className="pointer-events-none fixed inset-0 overflow-hidden z-20" aria-hidden="true">
          {Array.from({ length: 18 }).map((_, idx) => (
            <span
              key={`confetti-${idx}`}
              className="confetti-piece"
              style={{ left: `${(idx * 97) % 100}%`, animationDelay: `${(idx % 6) * 0.2}s` }}
            >
              🎉
            </span>
          ))}
        </div>
      ) : null}

      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-indigo-600">Expense Tracker</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track your income and expenses effortlessly</p>
            </div>
            <button
              type="button"
              onClick={() => setDarkMode(v => !v)}
              className="text-sm px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <BalanceCard transactions={filteredTransactions} />

        <MonthFilter selected={monthFilter} onChange={setMonthFilter} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AddTransactionForm onSuccess={loadTransactions} />
          <ExpensePieChart transactions={filteredTransactions} />
        </div>
        <IncomeExpenseBarChart transactions={transactions} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetLimitsCard
            transactions={filteredTransactions}
            budgetLimits={budgetLimits}
            onChange={handleBudgetChange}
          />
          <CsvTools transactions={transactions} onSuccess={loadTransactions} />
        </div>

        <TransactionList transactions={filteredTransactions} onDelete={handleDelete} />
      </main>
    </div>
  );
}
