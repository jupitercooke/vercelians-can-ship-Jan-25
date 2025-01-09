'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function IncidentTracker() {
  const [daysSinceLastIncident, setDaysSinceLastIncident] = useState(0)
  const [lastIncidentDate, setLastIncidentDate] = useState<Date | null>(null)

  useEffect(() => {
    const storedData = localStorage.getItem('incidentData')
    if (storedData) {
      const { lastIncident } = JSON.parse(storedData)
      const lastIncidentDate = new Date(lastIncident)
      setLastIncidentDate(lastIncidentDate)
      updateDaysSinceLastIncident(lastIncidentDate)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      if (lastIncidentDate) {
        updateDaysSinceLastIncident(lastIncidentDate)
      }
    }, 1000 * 60 * 60) // Update every hour

    return () => clearInterval(timer)
  }, [lastIncidentDate])

  const updateDaysSinceLastIncident = (date: Date) => {
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    setDaysSinceLastIncident(diffDays)
  }

  const handleReset = () => {
    const now = new Date()
    setLastIncidentDate(now)
    setDaysSinceLastIncident(0)
    localStorage.setItem('incidentData', JSON.stringify({ lastIncident: now.toISOString() }))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Days Without Incidents</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-6xl font-bold mb-4">{daysSinceLastIncident}</p>
        {lastIncidentDate && (
          <p className="text-sm text-muted-foreground">
            Last incident: {lastIncidentDate.toLocaleDateString()}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={handleReset} variant="destructive">
          Reset Counter
        </Button>
      </CardFooter>
    </Card>
  )
}
