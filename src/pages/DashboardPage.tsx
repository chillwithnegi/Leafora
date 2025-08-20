import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  TrendingUp, 
  DollarSign,
  Package,
  Clock,
  Award
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const DashboardPage: React.FC = () => {
  const { user, profile, isAuthenticated, currentMode } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const stats = [
    {
      title: currentMode === 'seller' ? 'Active Services' : 'Orders Placed',
      value: currentMode === 'seller' ? '3' : '12',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: currentMode === 'seller' ? 'Total Earnings' : 'Total Spent',
      value: currentMode === 'seller' ? '$2,450' : '$890',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: currentMode === 'seller' ? 'Orders in Progress' : 'Active Orders',
      value: '5',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Messages',
      value: '8',
      icon: MessageCircle,
      color: 'bg-purple-500'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: currentMode === 'seller' ? 'order_received' : 'order_placed',
      title: currentMode === 'seller' ? 'New order received' : 'Order placed',
      description: currentMode === 'seller' ? 'Website Development - Basic Package' : 'Logo Design - Premium Package',
      time: '2 hours ago',
      amount: currentMode === 'seller' ? '+$150' : '-$299'
    },
    {
      id: 2,
      type: 'message',
      title: 'New message',
      description: 'From Sarah Chen regarding your project',
      time: '4 hours ago',
      amount: null
    },
    {
      id: 3,
      type: currentMode === 'seller' ? 'service_viewed' : 'review_left',
      title: currentMode === 'seller' ? 'Service viewed' : 'Review submitted',
      description: currentMode === 'seller' ? 'React Development service got 15 new views' : 'Left 5-star review for John Doe',
      time: '1 day ago',
      amount: null
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {profile.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                {currentMode === 'seller' 
                  ? 'Manage your services and track your earnings' 
                  : 'Track your orders and discover new services'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{profile.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-600">{profile.total_reviews} reviews</span>
              </div>
              {profile.role === 'seller' && (
                <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                  <Award className="h-4 w-4" />
                  <span className="font-medium capitalize">{profile.seller_level.replace('_', ' ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        {activity.type === 'message' && <MessageCircle className="h-5 w-5 text-green-600" />}
                        {activity.type.includes('order') && <ShoppingBag className="h-5 w-5 text-green-600" />}
                        {activity.type.includes('service') && <Package className="h-5 w-5 text-green-600" />}
                        {activity.type.includes('review') && <Star className="h-5 w-5 text-green-600" />}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        {activity.amount && (
                          <span className={`text-sm font-medium ${
                            activity.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {activity.amount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {currentMode === 'seller' ? (
                  <>
                    <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium">
                      Create New Service
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      View Analytics
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      Manage Orders
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => navigate('/services')}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium"
                    >
                      Browse Services
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      View Orders
                    </button>
                    <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                      Messages
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Profile</h2>
              <div className="flex items-center space-x-4 mb-4">
                {profile.profile_pic ? (
                  <img
                    src={profile.profile_pic}
                    alt={profile.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{profile.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{profile.role}</p>
                  {profile.is_verified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;