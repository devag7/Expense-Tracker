export type TransactionType = 'income' | 'expense';
export type Category = 'Food' | 'Transport' | 'Shopping' | 'Health' | 'Other';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  date: string; // ISO date string YYYY-MM-DD
}
