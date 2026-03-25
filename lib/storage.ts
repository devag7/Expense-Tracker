import { BudgetLimits, Transaction } from './types';

const STORAGE_KEY = 'expense-tracker-transactions';
const BUDGET_KEY = 'expense-tracker-budget-limits';

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

export function addTransactions(newTransactions: Transaction[]): Transaction[] {
  if (newTransactions.length === 0) return getTransactions();
  const transactions = getTransactions();
  const updated = [...transactions, ...newTransactions];
  saveTransactions(updated);
  return updated;
}

function addDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function addMonths(dateStr: string, months: number): string {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setMonth(date.getMonth() + months);
  return date.toISOString().slice(0, 10);
}

export function processRecurringTransactions(existing: Transaction[]): Transaction[] {
  const today = new Date().toISOString().slice(0, 10);
  const generatedKeys = new Set(
    existing
      .filter(t => t.templateId)
      .map(t => `${t.templateId}|${t.date}`)
  );
  let changed = false;
  const generated: Transaction[] = [];

  const updated = existing.map(transaction => {
    if (transaction.templateId || transaction.recurring === 'none' || !transaction.recurring) {
      return transaction;
    }

    let lastDate = transaction.lastGeneratedDate ?? transaction.date;
    const existingTemplateDates = existing
      .filter(t => t.templateId === transaction.id)
      .map(t => t.date)
      .sort((a, b) => a.localeCompare(b));
    if (existingTemplateDates.length > 0) {
      lastDate = existingTemplateDates[existingTemplateDates.length - 1];
    }

    while (true) {
      const nextDate =
        transaction.recurring === 'weekly'
          ? addDays(lastDate, 7)
          : addMonths(lastDate, 1);

      if (nextDate > today) break;

      const key = `${transaction.id}|${nextDate}`;
      if (!generatedKeys.has(key)) {
        generated.push({
          ...transaction,
          id: crypto.randomUUID(),
          date: nextDate,
          recurring: 'none',
          templateId: transaction.id,
        });
        generatedKeys.add(key);
        changed = true;
      }
      lastDate = nextDate;
    }

    if (transaction.lastGeneratedDate !== lastDate) {
      changed = true;
      return { ...transaction, lastGeneratedDate: lastDate };
    }
    return transaction;
  });

  if (!changed) return existing;

  const result = [...updated, ...generated];
  saveTransactions(result);
  return result;
}

export function getBudgetLimits(): BudgetLimits {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(BUDGET_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveBudgetLimits(limits: BudgetLimits): void {
  localStorage.setItem(BUDGET_KEY, JSON.stringify(limits));
}
