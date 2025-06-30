import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'

function Analytics() {
  const [timeRange, setTimeRange] = useState('7d')

  // Sample data for charts
  const callVolumeData = [
    { name: 'Mon', calls: 12, avgResponse: 2.1 },
    { name: 'Tue', calls: 19, avgResponse: 1.8 },
    { name: 'Wed', calls: 15, avgResponse: 2.3 },
    { name: 'Thu', calls: 22, avgResponse: 1.9 },
    { name: 'Fri', calls: 28, avgResponse: 2.0 },
    { name: 'Sat', calls: 18, avgResponse: 1.7 },
    { name: 'Sun', calls: 14, avgResponse: 2.2 }
  ]

  const emergencyTypeData = [
    { name: 'Medical', value: 45, color: '#ef4444' },
    { name: 'Fire', value: 25, color: '#f97316' },
    { name: 'Accident', value: 20, color: '#eab308' },
    { name: 'Other', value: 10, color: '#6b7280' }
  ]

  const responseTimeData = [
    { time: '00:00', responseTime: 2.1 },
    { time: '04:00', responseTime: 1.8 },
    { time: '08:00', responseTime: 2.4 },
    { time: '12:00', responseTime: 2.8 },
    { time: '16:00', responseTime: 2.2 },
    { time: '20:00', responseTime: 1.9 },
    { time: '23:59', responseTime: 2.0 }
  ]

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600 mt-1">Performance insights and emergency response metrics</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <button className="flex items-center space-x-2 btn-secondary">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Calls</p>
              <p className="text-2xl font-bold text-gray-900">128</p>
              <p className="text-sm text-success-600">+12% from last week</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">2.1s</p>
              <p className="text-sm text-success-600">-0.3s improvement</p>
            </div>
            <Clock className="w-8 h-8 text-success-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">98.7%</p>
              <p className="text-sm text-success-600">+0.5% increase</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Hour</p>
              <p className="text-2xl font-bold text-gray-900">2-4 PM</p>
              <p className="text-sm text-gray-600">28 calls/hour</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Call Volume Chart */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Daily Call Volume</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={callVolumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Emergency Types */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Emergency Types</h3>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={emergencyTypeData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {emergencyTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Response Time Trend */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Response Time Trend (24h)</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={responseTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}s`, 'Response Time']} />
              <Line 
                type="monotone" 
                dataKey="responseTime" 
                stroke="#22c55e" 
                strokeWidth={3}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Peak Performance</h4>
            <p className="text-sm text-blue-800">
              System performs best during 6-10 AM with average response time of 1.7s
            </p>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h4 className="font-medium text-yellow-900 mb-2">Optimization Opportunity</h4>
            <p className="text-sm text-yellow-800">
              Response times increase by 15% during 2-4 PM peak hours
            </p>
          </div>
          
          <div className="bg-success-50 rounded-lg p-4 border border-success-200">
            <h4 className="font-medium text-success-900 mb-2">Success Metric</h4>
            <p className="text-sm text-success-800">
              98.7% of calls successfully processed with AI assistance
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics