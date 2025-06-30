import React, { useState } from 'react'
import { 
  Activity, 
  Server, 
  Database, 
  Cloud, 
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Settings
} from 'lucide-react'

function SystemStatus({ systemHealth }) {
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const services = [
    {
      name: 'Amazon Connect',
      key: 'connect',
      description: 'Call routing and media streaming',
      metrics: {
        uptime: '99.9%',
        latency: '45ms',
        throughput: '150 calls/min'
      },
      icon: Server
    },
    {
      name: 'Amazon Transcribe',
      key: 'transcribe',
      description: 'Real-time speech-to-text processing',
      metrics: {
        uptime: '99.8%',
        latency: '1.2s',
        accuracy: '94.5%'
      },
      icon: Activity
    },
    {
      name: 'Amazon Bedrock (Claude)',
      key: 'bedrock',
      description: 'AI response generation and reasoning',
      metrics: {
        uptime: '99.7%',
        latency: '2.1s',
        tokens: '1.2M/hour'
      },
      icon: Zap
    },
    {
      name: 'Amazon Polly',
      key: 'polly',
      description: 'Neural text-to-speech synthesis',
      metrics: {
        uptime: '99.9%',
        latency: '800ms',
        quality: 'Neural HD'
      },
      icon: Cloud
    },
    {
      name: 'DynamoDB',
      key: 'dynamodb',
      description: 'Conversation and metadata storage',
      metrics: {
        uptime: '100%',
        latency: '2ms',
        capacity: '85% utilized'
      },
      icon: Database
    },
    {
      name: 'Amazon S3',
      key: 's3',
      description: 'Audio file storage and delivery',
      metrics: {
        uptime: '100%',
        latency: '12ms',
        storage: '2.4TB used'
      },
      icon: Server
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-success-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'error':
        return <XCircle className="w-5 h-5 text-emergency-600" />
      default:
        return <Activity className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'healthy':
        return 'status-indicator status-active'
      case 'warning':
        return 'status-indicator bg-yellow-100 text-yellow-800'
      case 'error':
        return 'status-indicator status-error'
      default:
        return 'status-indicator status-inactive'
    }
  }

  const healthyCount = Object.values(systemHealth.services).filter(status => status === 'healthy').length
  const warningCount = Object.values(systemHealth.services).filter(status => status === 'warning').length
  const errorCount = Object.values(systemHealth.services).filter(status => status === 'error').length

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Status</h2>
          <p className="text-gray-600 mt-1">Real-time health monitoring of all SwiftAid components</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center space-x-2 btn-secondary"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Overall Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-success-50 border-success-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-success-800">Healthy Services</p>
              <p className="text-2xl font-bold text-success-900">{healthyCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
        </div>

        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">Warnings</p>
              <p className="text-2xl font-bold text-yellow-900">{warningCount}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="card bg-emergency-50 border-emergency-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-emergency-800">Critical Issues</p>
              <p className="text-2xl font-bold text-emergency-900">{errorCount}</p>
            </div>
            <XCircle className="w-8 h-8 text-emergency-600" />
          </div>
        </div>
      </div>

      {/* Service Details */}
      <div className="grid gap-6">
        {services.map((service) => {
          const status = systemHealth.services[service.key]
          const Icon = service.icon
          
          return (
            <div key={service.key} className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                    <Icon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={getStatusBadge(status)}>
                    {status}
                  </span>
                  {getStatusIcon(status)}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(service.metrics).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                      {key}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    View Logs
                  </button>
                  <span className="text-gray-300">•</span>
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    Metrics Dashboard
                  </button>
                </div>
                
                <button className="flex items-center space-x-1 text-sm text-emergency-600 hover:text-emergency-700 font-medium">
                  <Settings className="w-4 h-4" />
                  <span>Configure</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SystemStatus