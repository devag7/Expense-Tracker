'use client';

import { useState } from 'react';
import { addTransaction } from '@/lib/storage';
import { Transaction, TransactionType, Category } from '@/lib/types';

interface AddTransactionFormProps {
  onSuccess: () => void;
}

const categories: Category[] = ['Food', 'Transport', 'Shopping', 'Health', 'Other'];

export default function AddTransactionForm({ onSuccess }: AddTransactionFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Food');
  const [date, setDate] = useState(today);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0)
      newErrors.amount = 'Amount must be a positive number';
    if (!date) newErrors.date = 'Date is required';
    return newErrors;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
    };
    addTransaction(transaction);
    setDescription('');
    setAmount('');
    setType('expense');
    setCategory('Food');
    setDate(today);
    setErrors({});
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Add Transaction</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Grocery shopping"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
        <div className="flex gap-4">
          {(['expense', 'income'] as TransactionType[]).map(t => (
            <label key={t} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={t}
                checked={type === t}
                onChange={() => setType(t)}
                className="accent-indigo-500"
              />
              <span className={`text-sm font-medium capitalize ${t === 'income' ? 'text-green-600' : 'text-red-500'}`}>
                {t}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category}
          onChange={e => setCategory(e.target.value as Category)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg py-2.5 text-sm transition-colors"
      >
        Add Transaction
      </button>
    </form>
  );
}
