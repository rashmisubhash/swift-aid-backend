import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Dashboard from './components/Dashboard'
import CallMonitor from './components/CallMonitor'
import SystemStatus from './components/SystemStatus'
import Analytics from './components/Analytics'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [systemHealth, setSystemHealth] = useState({
    overall: 'healthy',
    services: {
      connect: 'healthy',
      transcribe: 'healthy',
      bedrock: 'healthy',
      polly: 'healthy',
      dynamodb: 'healthy',
      s3: 'healthy'
    }
  })

  // Simulate real-time system monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate occasional service fluctuations
      const services = ['connect', 'transcribe', 'bedrock', 'polly', 'dynamodb', 's3']
      const randomService = services[Math.floor(Math.random() * services.length)]
      const statuses = ['healthy', 'healthy', 'healthy', 'warning'] // Bias toward healthy
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)]
      
      setSystemHealth(prev => ({
        ...prev,
        services: {
          ...prev.services,
          [randomService]: randomStatus
        }
      }))
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { id: 'calls', label: 'Live Calls', icon: 'Phone' },
    { id: 'status', label: 'System Status', icon: 'Activity' },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3' }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard systemHealth={systemHealth} />
      case 'calls':
        return <CallMonitor />
      case 'status':
        return <SystemStatus systemHealth={systemHealth} />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard systemHealth={systemHealth} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        navigation={navigation}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        systemHealth={systemHealth}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  )
}

export default App