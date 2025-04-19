"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/components/dashboard-page"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts"

interface SpendingChartProps {
  transactions: Transaction[]
  fullWidth?: boolean
}

export function SpendingChart({ transactions, fullWidth = false }: SpendingChartProps) {
  // Only include expenses for the charts
  const expenses = transactions.filter((t) => t.type === "expense")

  // Prepare data for category pie chart
  const categoryData = useMemo(() => {
    const categories: Record<string, number> = {}

    expenses.forEach((transaction) => {
      if (categories[transaction.category]) {
        categories[transaction.category] += transaction.amount
      } else {
        categories[transaction.category] = transaction.amount
      }
    })

    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
    }))
  }, [expenses])

  // Prepare data for monthly bar chart
  const monthlyData = useMemo(() => {
    const months: Record<string, number> = {}

    expenses.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthYear = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (months[monthYear]) {
        months[monthYear] += transaction.amount
      } else {
        months[monthYear] = transaction.amount
      }
    })

    return Object.entries(months)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => {
        const dateA = new Date(a.name)
        const dateB = new Date(b.name)
        return dateA.getTime() - dateB.getTime()
      })
  }, [expenses])

  // Colors for the pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Spending Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-center">Spending by Category</h3>
            <div className="h-[300px]">
              {categoryData.length > 0 ? (
                <ChartContainer
                  config={{
                    category: {
                      label: "Category",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No expense data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-center">Monthly Expenses</h3>
            <div className="h-[300px]">
              {monthlyData.length > 0 ? (
                <ChartContainer
                  config={{
                    expenses: {
                      label: "Expenses",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <BarChart data={monthlyData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar dataKey="value" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No monthly data available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
