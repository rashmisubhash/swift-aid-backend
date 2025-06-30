import React from 'react'
import { 
  LayoutDashboard, 
  Phone, 
  Activity, 
  BarChart3, 
  Shield,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const iconMap = {
  LayoutDashboard,
  Phone,
  Activity,
  BarChart3
}

function Header({ navigation, activeTab, onTabChange, systemHealth }) {
  const getSystemStatusIcon = () => {
    const hasWarnings = Object.values(systemHealth.services).some(status => status === 'warning')
    const hasErrors = Object.values(systemHealth.services).some(status => status === 'error')
    
    if (hasErrors) {
      return <AlertTriangle className="w-5 h-5 text-emergency-500" />
    } else if (hasWarnings) {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />
    } else {
      return <CheckCircle className="w-5 h-5 text-success-500" />
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-emergency-600 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gradient">SwiftAid</h1>
              <p className="text-xs text-gray-500">Emergency Response System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-1">
            {navigation.map((item) => {
              const Icon = iconMap[item.icon]
              const isActive = activeTab === item.id
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                    ${isActive 
                      ? 'bg-emergency-50 text-emergency-700 border border-emergency-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* System Status Indicator */}
          <div className="flex items-center space-x-2">
            {getSystemStatusIcon()}
            <span className="text-sm font-medium text-gray-700">
              System Status
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header