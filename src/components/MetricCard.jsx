import React from 'react'

function MetricCard({ title, value, icon: Icon, color, trend, description, delay = 0 }) {
  const colorClasses = {
    emergency: 'text-emergency-600 bg-emergency-50',
    success: 'text-success-600 bg-success-50',
    blue: 'text-blue-600 bg-blue-50',
    yellow: 'text-yellow-600 bg-yellow-50'
  }

  const trendColor = trend?.startsWith('+') ? 'text-success-600' : trend?.startsWith('-') ? 'text-emergency-600' : 'text-gray-500'

  return (
    <div 
      className="card hover:shadow-md transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
          {trend && (
            <p className={`text-sm font-medium ${trendColor}`}>
              {trend} from yesterday
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default MetricCard