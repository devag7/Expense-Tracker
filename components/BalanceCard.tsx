import { Transaction } from '@/lib/types';

interface BalanceCardProps {
  transactions: Transaction[];
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function BalanceCard({ transactions }: BalanceCardProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Income</p>
        <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Expenses</p>
        <p className="text-2xl font-bold text-red-500">{formatCurrency(totalExpense)}</p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Net Balance</p>
        <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {formatCurrency(netBalance)}
        </p>
      </div>
    </div>
  );
}
