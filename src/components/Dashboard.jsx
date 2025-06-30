import React, { useState, useEffect } from 'react'
import { 
  Phone, 
  Clock, 
  Users, 
  TrendingUp,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react'
import MetricCard from './MetricCard'
import RecentCalls from './RecentCalls'
import SystemOverview from './SystemOverview'

function Dashboard({ systemHealth }) {
  const [metrics, setMetrics] = useState({
    activeCalls: 3,
    totalCallsToday: 47,
    avgResponseTime: 2.3,
    successRate: 98.7
  })

  // Simulate real-time metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeCalls: Math.max(0, prev.activeCalls + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0)),
        totalCallsToday: prev.totalCallsToday + (Math.random() > 0.9 ? 1 : 0),
        avgResponseTime: Math.max(1.0, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
        successRate: Math.min(100, Math.max(95, prev.successRate + (Math.random() - 0.5) * 0.5))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const metricCards = [
    {
      title: 'Active Calls',
      value: metrics.activeCalls,
      icon: Phone,
      color: 'emergency',
      trend: metrics.activeCalls > 0 ? '+12%' : '0%',
      description: 'Currently in progress'
    },
    {
      title: 'Calls Today',
      value: metrics.totalCallsToday,
      icon: Users,
      color: 'blue',
      trend: '+8%',
      description: 'Total emergency calls'
    },
    {
      title: 'Avg Response Time',
      value: `${metrics.avgResponseTime.toFixed(1)}s`,
      icon: Clock,
      color: 'success',
      trend: '-5%',
      description: 'AI response latency'
    },
    {
      title: 'Success Rate',
      value: `${metrics.successRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'success',
      trend: '+0.3%',
      description: 'Successful completions'
    }
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center py-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Emergency Response Dashboard
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real-time monitoring of SwiftAid's AI-powered emergency response system. 
          Track active calls, system performance, and response metrics.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((metric, index) => (
          <MetricCard key={metric.title} {...metric} delay={index * 100} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Calls */}
        <div className="lg:col-span-2">
          <RecentCalls />
        </div>

        {/* System Overview */}
        <div className="lg:col-span-1">
          <SystemOverview systemHealth={systemHealth} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="w-5 h-5 text-emergency-600 mr-2" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary">
            View Live Calls
          </button>
          <button className="btn-secondary">
            System Diagnostics
          </button>
          <button className="btn-secondary">
            Export Reports
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard