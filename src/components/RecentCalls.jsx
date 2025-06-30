import React, { useState, useEffect } from 'react'
import { Phone, Clock, CheckCircle, AlertTriangle, User } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

function RecentCalls() {
  const [calls, setCalls] = useState([
    {
      id: 'call-001',
      contactId: 'c4f8a2b1-3d5e-4f7a-8b9c-1e2f3a4b5c6d',
      status: 'completed',
      duration: '4m 32s',
      responseTime: '2.1s',
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      location: 'Downtown District',
      emergencyType: 'Medical'
    },
    {
      id: 'call-002',
      contactId: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      status: 'active',
      duration: '1m 45s',
      responseTime: '1.8s',
      timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
      location: 'Residential Area',
      emergencyType: 'Fire'
    },
    {
      id: 'call-003',
      contactId: 'x9y8z7w6-v5u4-t3s2-r1q0-p9o8n7m6l5k4',
      status: 'completed',
      duration: '6m 18s',
      responseTime: '2.7s',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      location: 'Industrial Zone',
      emergencyType: 'Accident'
    }
  ])

  // Simulate real-time call updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCalls(prev => prev.map(call => {
        if (call.status === 'active') {
          const [minutes, seconds] = call.duration.split('m ').map(s => parseInt(s))
          const totalSeconds = minutes * 60 + seconds + 1
          const newMinutes = Math.floor(totalSeconds / 60)
          const newSeconds = totalSeconds % 60
          
          return {
            ...call,
            duration: `${newMinutes}m ${newSeconds.toString().padStart(2, '0')}s`
          }
        }
        return call
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <Phone className="w-4 h-4 text-emergency-600 animate-pulse-emergency" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-600" />
      case 'failed':
        return <AlertTriangle className="w-4 h-4 text-emergency-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status) => {
    const baseClasses = "status-indicator"
    switch (status) {
      case 'active':
        return `${baseClasses} bg-emergency-100 text-emergency-800`
      case 'completed':
        return `${baseClasses} status-active`
      case 'failed':
        return `${baseClasses} status-error`
      default:
        return `${baseClasses} status-inactive`
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Phone className="w-5 h-5 text-emergency-600 mr-2" />
          Recent Emergency Calls
        </h3>
        <button className="text-sm text-emergency-600 hover:text-emergency-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {calls.map((call) => (
          <div 
            key={call.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-sm">
                {getStatusIcon(call.status)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="font-medium text-gray-900">
                    {call.emergencyType} Emergency
                  </p>
                  <span className={getStatusBadge(call.status)}>
                    {call.status}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {call.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDistanceToNow(call.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{call.duration}</p>
              <p className="text-xs text-gray-500">Response: {call.responseTime}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentCalls