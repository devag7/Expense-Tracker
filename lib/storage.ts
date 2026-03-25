import { Transaction } from './types';

const STORAGE_KEY = 'expense-tracker-transactions';

export function getTransactions(): Transaction[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveTransactions(transactions: Transaction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

export function addTransaction(transaction: Transaction): Transaction[] {
  const transactions = getTransactions();
  const updated = [...transactions, transaction];
  saveTransactions(updated);
  return updated;
}

export function deleteTransaction(id: string): Transaction[] {
  const transactions = getTransactions();
  const updated = transactions.filter(t => t.id !== id);
  saveTransactions(updated);
  return updated;
}
