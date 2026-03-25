'use client';

interface MonthFilterProps {
  selected: { year: number; month: number } | null;
  onChange: (value: { year: number; month: number } | null) => void;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function getLast12Months(): { year: number; month: number; label: string }[] {
  const result = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    result.push({
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return result;
}

export default function MonthFilter({ selected, onChange }: MonthFilterProps) {
  const options = getLast12Months();
  const value = selected ? `${selected.year}-${selected.month}` : 'all';

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === 'all') {
      onChange(null);
    } else {
      const [year, month] = e.target.value.split('-').map(Number);
      onChange({ year, month });
    }
  }

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Filter by month:</label>
      <select
        value={value}
        onChange={handleChange}
        className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-900 dark:text-gray-100"
      >
        <option value="all">All Time</option>
        {options.map(o => (
          <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
