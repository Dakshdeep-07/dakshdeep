"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pencil, Check, X } from "lucide-react"
import type { Budget } from "@/components/dashboard-page"

interface BudgetTrackerProps {
  budgets: Budget[]
  fullWidth?: boolean
  onUpdateBudget?: (category: string, newLimit: number) => void
}

export function BudgetTracker({ budgets, fullWidth = false, onUpdateBudget }: BudgetTrackerProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<string>("")

  const handleEdit = (budget: Budget) => {
    setEditingCategory(budget.category)
    setEditValue(budget.limit.toString())
  }

  const handleSave = (category: string) => {
    if (onUpdateBudget && editValue) {
      const newLimit = Number.parseFloat(editValue)
      if (!isNaN(newLimit) && newLimit > 0) {
        onUpdateBudget(category, newLimit)
      }
    }
    setEditingCategory(null)
  }

  const handleCancel = () => {
    setEditingCategory(null)
  }

  return (
    <Card className={fullWidth ? "col-span-full" : ""}>
      <CardHeader>
        <CardTitle>Budget Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0
            let statusColor = "text-green-600"

            if (percentage > 90) {
              statusColor = "text-red-600"
            } else if (percentage > 75) {
              statusColor = "text-amber-600"
            }

            const isEditing = editingCategory === budget.category

            return (
              <div key={budget.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{budget.category}</span>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 h-8"
                        min="0"
                        step="10"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSave(budget.category)}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={handleCancel} className="h-8 w-8">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className={statusColor}>
                        ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                      </span>
                      {onUpdateBudget && (
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(budget)} className="h-6 w-6 ml-1">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
