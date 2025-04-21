"use client"

import { useState } from "react"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionList } from "@/components/transaction-list"
import { FinancialSummary } from "@/components/financial-summary"
import { BudgetTracker } from "@/components/budget-tracker"
import { SpendingChart } from "@/components/spending-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type Transaction = {
  id: string
  description: string
  amount: number
  type: "income" | "expense"
  category: string
  date: string
}

export type Budget = {
  category: string
  limit: number
  spent: number
}

export function DashboardPage() {
  // Initialize with empty transactions so all financial values start at $0
  const [transactions, setTransactions] = useState<Transaction[]>([])

  const [budgets, setBudgets] = useState<Budget[]>([
    { category: "Housing", limit: 1500, spent: 0 },
    { category: "Food", limit: 400, spent: 0 },
    { category: "Transportation", limit: 200, spent: 0 },
    { category: "Entertainment", limit: 150, spent: 0 },
    { category: "Utilities", limit: 300, spent: 0 },
  ])

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction])

    // Update budget if it's an expense
    if (transaction.type === "expense") {
      setBudgets(
        budgets.map((budget) =>
          budget.category === transaction.category ? { ...budget, spent: budget.spent + transaction.amount } : budget,
        ),
      )
    }
  }

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id)
    if (transaction && transaction.type === "expense") {
      setBudgets(
        budgets.map((budget) =>
          budget.category === transaction.category ? { ...budget, spent: budget.spent - transaction.amount } : budget,
        ),
      )
    }
    setTransactions(transactions.filter((t) => t.id !== id))
  }

  const updateBudget = (category: string, newLimit: number) => {
    setBudgets(budgets.map((budget) => (budget.category === category ? { ...budget, limit: newLimit } : budget)))
  }

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Quantro</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FinancialSummary balance={balance} income={totalIncome} expenses={totalExpenses} />
      </div>

      <Tabs defaultValue="dashboard" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TransactionForm onAddTransaction={addTransaction} budgetCategories={budgets.map((b) => b.category)} />
            <BudgetTracker budgets={budgets} onUpdateBudget={updateBudget} />
          </div>
          <SpendingChart transactions={transactions} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionList transactions={transactions} onDeleteTransaction={deleteTransaction} />
        </TabsContent>

        <TabsContent value="budgets">
          <BudgetTracker budgets={budgets} fullWidth onUpdateBudget={updateBudget} />
        </TabsContent>

        <TabsContent value="analytics">
          <SpendingChart transactions={transactions} fullWidth />
        </TabsContent>
      </Tabs>
    </div>
  )
}
