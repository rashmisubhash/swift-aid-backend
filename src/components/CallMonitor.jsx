import React, { useState, useEffect } from 'react'
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  Clock,
  MapPin,
  User,
  MessageSquare,
  Activity
} from 'lucide-react'

function CallMonitor() {
  const [activeCalls, setActiveCalls] = useState([
    {
      id: 'call-live-001',
      contactId: 'c4f8a2b1-3d5e-4f7a-8b9c-1e2f3a4b5c6d',
      callerLocation: 'Downtown District, Block 5',
      emergencyType: 'Medical Emergency',
      duration: 125, // seconds
      status: 'transcribing',
      lastTranscript: "I need help, my neighbor collapsed and isn't responding...",
      lastAiResponse: "I understand this is a medical emergency. Help is on the way. Can you check if the person is breathing?",
      responseTime: 1.8,
      conversationTurns: 3
    },
    {
      id: 'call-live-002',
      contactId: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
      callerLocation: 'Residential Area, Oak Street',
      emergencyType: 'Fire Emergency',
      duration: 67,
      status: 'ai_responding',
      lastTranscript: "There's smoke coming from the building next door and I can see flames...",
      lastAiResponse: "Fire department has been notified and is en route. Please evacuate the area immediately and stay at a safe distance.",
      responseTime: 2.1,
      conversationTurns: 2
    }
  ])

  // Simulate real-time call updates
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCalls(prev => prev.map(call => ({
        ...call,
        duration: call.duration + 1
      })))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'transcribing':
        return 'text-blue-600 bg-blue-100'
      case 'ai_responding':
        return 'text-purple-600 bg-purple-100'
      case 'waiting':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 'transcribing':
        return 'Transcribing Speech'
      case 'ai_responding':
        return 'AI Generating Response'
      case 'waiting':
        return 'Waiting for Caller'
      default:
        return 'Processing'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Call Monitor</h2>
          <p className="text-gray-600 mt-1">Real-time monitoring of active emergency calls</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-2 bg-success-100 rounded-lg">
            <Activity className="w-4 h-4 text-success-600" />
            <span className="text-sm font-medium text-success-800">
              {activeCalls.length} Active Calls
            </span>
          </div>
        </div>
      </div>

      {/* Active Calls */}
      <div className="grid gap-6">
        {activeCalls.map((call) => (
          <div key={call.id} className="card border-l-4 border-l-emergency-500">
            {/* Call Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-emergency-100 rounded-full">
                  <Phone className="w-6 h-6 text-emergency-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{call.emergencyType}</h3>
                  <p className="text-sm text-gray-600">Call ID: {call.contactId.slice(0, 8)}...</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`status-indicator ${getStatusColor(call.status)}`}>
                  {getStatusLabel(call.status)}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatDuration(call.duration)}</p>
                  <p className="text-sm text-gray-500">Duration</p>
                </div>
              </div>
            </div>

            {/* Call Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Location & Info */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Location</p>
                    <p className="text-sm text-gray-600">{call.callerLocation}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Response Time</p>
                    <p className="text-sm text-gray-600">{call.responseTime}s avg</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Conversation Turns</p>
                    <p className="text-sm text-gray-600">{call.conversationTurns} exchanges</p>
                  </div>
                </div>
              </div>

              {/* Latest Transcript */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Mic className="w-4 h-4 text-blue-600" />
                  <p className="text-sm font-medium text-gray-900">Latest Transcript</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-800 italic">"{call.lastTranscript}"</p>
                </div>
              </div>

              {/* AI Response */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Volume2 className="w-4 h-4 text-purple-600" />
                  <p className="text-sm font-medium text-gray-900">AI Response</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <p className="text-sm text-purple-800 italic">"{call.lastAiResponse}"</p>
                </div>
              </div>
            </div>

            {/* Call Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  <User className="w-4 h-4" />
                  <span>View Full Transcript</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                  <Activity className="w-4 h-4" />
                  <span>System Metrics</span>
                </button>
              </div>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-emergency-600 hover:bg-emergency-700 text-white rounded-lg text-sm font-medium transition-colors">
                <PhoneOff className="w-4 h-4" />
                <span>End Call</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeCalls.length === 0 && (
        <div className="card text-center py-12">
          <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Calls</h3>
          <p className="text-gray-600">All emergency lines are currently available</p>
        </div>
      )}
    </div>
  )
}

export default CallMonitor