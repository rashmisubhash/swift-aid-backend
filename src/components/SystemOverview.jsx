import React from 'react'
import { 
  Activity, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Database,
  Cloud,
  Mic,
  MessageSquare,
  Volume2,
  HardDrive
} from 'lucide-react'

function SystemOverview({ systemHealth }) {
  const services = [
    { 
      name: 'Amazon Connect', 
      key: 'connect', 
      icon: Phone, 
      description: 'Call routing & streaming' 
    },
    { 
      name: 'Transcribe', 
      key: 'transcribe', 
      icon: Mic, 
      description: 'Speech-to-text processing' 
    },
    { 
      name: 'Bedrock (Claude)', 
      key: 'bedrock', 
      icon: MessageSquare, 
      description: 'AI response generation' 
    },
    { 
      name: 'Polly', 
      key: 'polly', 
      icon: Volume2, 
      description: 'Text-to-speech synthesis' 
    },
    { 
      name: 'DynamoDB', 
      key: 'dynamodb', 
      icon: Database, 
      description: 'Conversation storage' 
    },
    { 
      name: 'S3', 
      key: 's3', 
      icon: HardDrive, 
      description: 'Audio file storage' 
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-success-600" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />
      case 'error':
        return <XCircle className="w-4 h-4 text-emergency-600" />
      default:
        return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-emergency-600'
      default:
        return 'text-gray-400'
    }
  }

  const healthyCount = Object.values(systemHealth.services).filter(status => status === 'healthy').length
  const totalServices = Object.keys(systemHealth.services).length

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Activity className="w-5 h-5 text-emergency-600 mr-2" />
          System Health
        </h3>
        <div className="text-sm text-gray-600">
          {healthyCount}/{totalServices} services healthy
        </div>
      </div>

      {/* Overall Health Indicator */}
      <div className="mb-6 p-4 bg-success-50 rounded-lg border border-success-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-success-600" />
            <span className="font-medium text-success-800">System Operational</span>
          </div>
          <div className="text-sm text-success-700">
            {((healthyCount / totalServices) * 100).toFixed(0)}% uptime
          </div>
        </div>
      </div>

      {/* Service Status List */}
      <div className="space-y-3">
        {services.map((service) => {
          const status = systemHealth.services[service.key]
          const Icon = service.icon
          
          return (
            <div 
              key={service.key}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {getStatusIcon(status)}
                <span className={`text-sm font-medium capitalize ${getStatusColor(status)}`}>
                  {status}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <button className="w-full btn-secondary text-sm">
          View Detailed Metrics
        </button>
      </div>
    </div>
  )
}

export default SystemOverview