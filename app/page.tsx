'use client';

import { useState, useEffect, useCallback } from 'react';
import { getTransactions, deleteTransaction } from '@/lib/storage';
import { Transaction } from '@/lib/types';
import AddTransactionForm from '@/components/AddTransactionForm';
import BalanceCard from '@/components/BalanceCard';
import TransactionList from '@/components/TransactionList';
import ExpensePieChart from '@/components/ExpensePieChart';
import MonthFilter from '@/components/MonthFilter';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [monthFilter, setMonthFilter] = useState<{ year: number; month: number } | null>(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  });

  const loadTransactions = useCallback(() => {
    setTransactions(getTransactions());
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  function handleDelete(id: string) {
    const updated = deleteTransaction(id);
    setTransactions(updated);
  }

  const filteredTransactions = monthFilter
    ? transactions.filter(t => {
        const [year, month] = t.date.split('-').map(Number);
        return year === monthFilter.year && month === monthFilter.month;
      })
    : transactions;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-indigo-600">Expense Tracker</h1>
          <p className="text-sm text-gray-500">Track your income and expenses effortlessly</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <BalanceCard transactions={filteredTransactions} />

        <MonthFilter selected={monthFilter} onChange={setMonthFilter} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AddTransactionForm onSuccess={loadTransactions} />
          <ExpensePieChart transactions={filteredTransactions} />
        </div>

        <TransactionList transactions={filteredTransactions} onDelete={handleDelete} />
      </main>
    </div>
  );
}
