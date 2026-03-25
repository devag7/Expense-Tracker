'use client';

import { useRef, useState } from 'react';
import { addTransactions } from '@/lib/storage';
import { Category, Transaction, TransactionType } from '@/lib/types';

interface CsvToolsProps {
  transactions: Transaction[];
  onSuccess: () => void;
}

const categories = new Set<Category>(['Food', 'Transport', 'Shopping', 'Health', 'Other']);

function parseCsvText(csvText: string): Transaction[] {
  const rows = csvText
    .split(/\r?\n/)
    .map(row => row.trim())
    .filter(Boolean);

  if (rows.length === 0) return [];

  let startIndex = 0;
  const header = rows[0].toLowerCase().replace(/\s+/g, '');
  if (header.includes('description') && header.includes('amount') && header.includes('type')) {
    startIndex = 1;
  }

  const parsed: Transaction[] = [];
  for (let i = startIndex; i < rows.length; i += 1) {
    const cells = rows[i].split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
    if (cells.length < 5) continue;
    const [description, amountRaw, typeRaw, categoryRaw, date] = cells;
    const amount = Number(amountRaw);
    const type = typeRaw.toLowerCase() as TransactionType;
    const category = categoryRaw as Category;

    if (!description || Number.isNaN(amount) || amount <= 0) continue;
    if (type !== 'income' && type !== 'expense') continue;
    if (!categories.has(category)) continue;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;

    parsed.push({
      id: crypto.randomUUID(),
      description,
      amount,
      type,
      category,
      date,
      recurring: 'none',
      lastGeneratedDate: date,
    });
  }

  return parsed;
}

function toCsv(transactions: Transaction[]): string {
  const header = 'description,amount,type,category,date';
  const lines = transactions.map(t =>
    [t.description, t.amount.toFixed(2), t.type, t.category, t.date]
      .map(cell => `"${String(cell).replace(/"/g, '""')}"`)
      .join(',')
  );
  return [header, ...lines].join('\n');
}

export default function CsvTools({ transactions, onSuccess }: CsvToolsProps) {
  const [csvText, setCsvText] = useState('');
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleImport() {
    const parsed = parseCsvText(csvText);
    if (parsed.length === 0) {
      setMessage('No valid rows found in CSV.');
      return;
    }
    addTransactions(parsed);
    setCsvText('');
    setMessage(`Imported ${parsed.length} transaction(s).`);
    onSuccess();
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCsvText(String(reader.result ?? ''));
    };
    reader.readAsText(file);
  }

  function handleExport() {
    const blob = new Blob([toCsv(transactions)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 space-y-3">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">CSV Import / Export</h2>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        CSV format: description,amount,type,category,date (date as YYYY-MM-DD)
      </p>
      <textarea
        value={csvText}
        onChange={e => setCsvText(e.target.value)}
        rows={5}
        placeholder="Paste CSV rows here"
        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleImport}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg px-3 py-2"
        >
          Import CSV
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 text-gray-800 text-sm font-semibold rounded-lg px-3 py-2"
        >
          Upload CSV
        </button>
        <button
          type="button"
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg px-3 py-2"
        >
          Export CSV
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleFileUpload}
      />
      {message ? <p className="text-xs text-indigo-600 dark:text-indigo-300">{message}</p> : null}
    </div>
  );
}
