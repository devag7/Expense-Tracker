# Expense Tracker

A full-featured Expense Tracker built with [Next.js 15](https://nextjs.org) (App Router), TypeScript, Tailwind CSS, and Recharts.

## Features

- Add transactions with description, amount, type (income/expense), category, and date
- Optional recurring schedule (weekly/monthly) for auto-added transactions
- Balance card showing total income, total expenses, and net balance
- Pie chart breakdown of expenses by category (Recharts)
- Bar chart showing income vs expense for the last 6 months
- Filter transactions by month
- Category budget limits with warning/over-budget badges
- CSV import (paste/upload) and CSV export
- Dark mode toggle
- Confetti celebration when balance is positive
- Persistent storage via `localStorage`
- Fully responsive layout

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Next.js 15** – App Router, React Server / Client Components
- **TypeScript** – strict typing throughout
- **Tailwind CSS** – utility-first styling
- **Recharts** – pie chart and bar chart visualizations
- **localStorage** – client-side persistence (no backend required)
