"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface ObjectivesPanelProps {
  className?: string
}

export default function ObjectivesPanel({ className }: ObjectivesPanelProps) {
  const [objectives, setObjectives] = useState([
    { id: 1, text: "Complete patient history", completed: false },
    { id: 2, text: "Demonstrate empathy", completed: false },
    { id: 3, text: "Identify key symptoms", completed: false },
    { id: 4, text: "Formulate differential diagnosis", completed: false },
    { id: 5, text: "Recommend appropriate tests", completed: false },
  ])

  const toggleObjective = (id: number) => {
    setObjectives(objectives.map((obj) => (obj.id === id ? { ...obj, completed: !obj.completed } : obj)))
  }

  const completedCount = objectives.filter((obj) => obj.completed).length
  const progress = (completedCount / objectives.length) * 100

  return (
    <Card className={cn(className)}>
      <CardHeader className="bg-slate-50">
        <CardTitle className="flex items-center justify-between">
          <span>Learning Objectives</span>
          <span className="text-sm font-normal">
            {completedCount}/{objectives.length}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="space-y-3">
          {objectives.map((objective) => (
            <div key={objective.id} className="flex items-start space-x-2">
              <Checkbox
                id={`objective-${objective.id}`}
                checked={objective.completed}
                onCheckedChange={() => toggleObjective(objective.id)}
              />
              <label
                htmlFor={`objective-${objective.id}`}
                className={cn(
                  "text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  objective.completed && "line-through text-gray-500",
                )}
              >
                {objective.text}
              </label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
