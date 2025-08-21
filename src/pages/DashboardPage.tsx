import React, { useEffect, useState } from 'react';
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
  Award,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalServices: number;
  totalOrders: number;
  totalEarnings: number;
  activeOrders: number;
  totalSpent: number;
  completedOrders: number;
}

interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  time: string;
  amount?: string;
}

const DashboardPage: React.FC = () => {
  const { user, profile, isAuthenticated, currentMode } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    totalOrders: 0,
    totalEarnings: 0,
    activeOrders: 0,
    totalSpent: 0,
    completedOrders: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [isAuthenticated, navigate, profile?.id, currentMode]);

  const fetchDashboardData = async () => {
    if (!profile?.id) return;

    try {
      setLoading(true);
      
      if (currentMode === 'seller') {
        // Fetch seller stats
        const [servicesResult, ordersResult] = await Promise.all([
          supabase
            .from('services')
            .select('id, status, total_orders')
            .eq('seller_id', profile.id),
          supabase
            .from('orders')
            .select('id, status, amount, created_at')
            .eq('seller_id', profile.id)
        ]);

        const services = servicesResult.data || [];
        const orders = ordersResult.data || [];

        const totalEarnings = orders
          .filter(order => order.status === 'completed')
          .reduce((sum, order) => sum + (order.amount * 0.85), 0); // 85% after 15% commission

        setStats({
          totalServices: services.length,
          totalOrders: orders.length,
          totalEarnings,
          activeOrders: orders.filter(order => ['pending', 'in_progress'].includes(order.status)).length,
          totalSpent: 0,
          completedOrders: orders.filter(order => order.status === 'completed').length
        });

        // Generate recent activity for seller
        const activities: RecentActivity[] = orders.slice(0, 5).map((order, index) => ({
          id: order.id,
          type: 'order_received',
          title: 'New order received',
          description: `Order #${order.id.slice(0, 8)} - $${order.amount}`,
          time: formatTimeAgo(order.created_at),
          amount: `+$${(order.amount * 0.85).toFixed(0)}`
        }));

        setRecentActivity(activities);
      } else {
        // Fetch buyer stats
        const { data: orders } = await supabase
          .from('orders')
          .select('id, status, amount, created_at')
          .eq('buyer_id', profile.id);

        const ordersList = orders || [];
        const totalSpent = ordersList.reduce((sum, order) => sum + order.amount, 0);

        setStats({
          totalServices: 0,
          totalOrders: ordersList.length,
          totalEarnings: 0,
          activeOrders: ordersList.filter(order => ['pending', 'in_progress'].includes(order.status)).length,
          totalSpent,
          completedOrders: ordersList.filter(order => order.status === 'completed').length
        });

        // Generate recent activity for buyer
        const activities: RecentActivity[] = ordersList.slice(0, 5).map((order, index) => ({
          id: order.id,
          type: 'order_placed',
          title: 'Order placed',
          description: `Order #${order.id.slice(0, 8)}`,
          time: formatTimeAgo(order.created_at),
          amount: `-$${order.amount}`
        }));

        setRecentActivity(activities);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (!isAuthenticated || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: currentMode === 'seller' ? 'Active Services' : 'Orders Placed',
      value: currentMode === 'seller' ? stats.totalServices : stats.totalOrders,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: currentMode === 'seller' ? 'Total Earnings' : 'Total Spent',
      value: currentMode === 'seller' ? `$${stats.totalEarnings.toFixed(0)}` : `$${stats.totalSpent.toFixed(0)}`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Active Orders',
      value: stats.activeOrders,
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'bg-purple-500'
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
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardStats.map((stat, index) => (
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
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              {loading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-start space-x-4 p-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <ShoppingBag className="h-5 w-5 text-green-600" />
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
              ) : (
                <div className="text-center py-8">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {currentMode === 'seller' ? (
                  <>
                    <button 
                      onClick={() => navigate('/create-service')}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Create New Service</span>
                    </button>
                    <button 
                      onClick={() => navigate('/seller/services')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View My Services</span>
                    </button>
                    <button 
                      onClick={() => navigate('/seller/orders')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                    >
                      <Package className="h-4 w-4" />
                      <span>Manage Orders</span>
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
                    <button 
                      onClick={() => navigate('/orders')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      View Orders
                    </button>
                    <button 
                      onClick={() => navigate('/messages')}
                      className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      Messages
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Profile Card */}
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
              <button 
                onClick={() => navigate('/profile/edit')}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;