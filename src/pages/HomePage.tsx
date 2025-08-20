import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Star, ArrowRight, Users, CheckCircle, TrendingUp, Zap } from 'lucide-react';
import { useServiceStore } from '../store/serviceStore';
import { useAuthStore } from '../store/authStore';
import { mockServices } from '../data/mockData';

const HomePage: React.FC = () => {
  const { categories } = useServiceStore();
  const { user } = useAuthStore();

  const featuredServices = mockServices.slice(0, 6);

  const stats = [
    { label: 'Active Services', value: '10,000+', icon: Zap },
    { label: 'Happy Clients', value: '50,000+', icon: Users },
    { label: 'Orders Completed', value: '100,000+', icon: CheckCircle },
    { label: 'Success Rate', value: '98%', icon: TrendingUp },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Startup Founder',
      content: 'Leafora helped me find the perfect developer for my startup. The quality of work exceeded my expectations!',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?w=100&h=100&fit=crop',
      rating: 5,
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'E-commerce Owner',
      content: 'As a seller on Leafora, I\'ve been able to grow my business and connect with amazing clients worldwide.',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=100&h=100&fit=crop',
      rating: 5,
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Marketing Director',
      content: 'The platform is user-friendly and the talent pool is incredible. I always find exactly what I need.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find the Perfect Freelance
              <span className="block text-green-600">Services for Your Business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover talented freelancers and get your projects done professionally. 
              <span className="block mt-2 font-semibold text-green-700">Grow Your Work, Grow Your Future</span>
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What service are you looking for today?"
                  className="w-full pl-6 pr-16 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none shadow-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['Web Development', 'Logo Design', 'Content Writing', 'Digital Marketing'].map((tag) => (
                <Link
                  key={tag}
                  to={`/services?category=${encodeURIComponent(tag)}`}
                  className="bg-white text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-green-500 hover:text-green-600 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {!user && (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/signup"
                  className="bg-green-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-colors"
                >
                  Join as a Client
                </Link>
                <Link
                  to="/become-seller"
                  className="bg-white text-green-600 border-2 border-green-500 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  Become a Seller
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
            <p className="text-xl text-gray-600">Explore services across different categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <Link
                key={category}
                to={`/services?category=${encodeURIComponent(category)}`}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                  <p className="text-sm text-gray-600">150+ services</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Services</h2>
              <p className="text-xl text-gray-600">Hand-picked services from top sellers</p>
            </div>
            <Link
              to="/services"
              className="flex items-center text-green-600 hover:text-green-700 font-semibold"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <Link
                key={service.id}
                to={`/service/${service.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <img
                      src={service.seller.profilePic}
                      alt={service.seller.name}
                      className="w-8 h-8 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{service.seller.name}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{service.title}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      From ${service.pricing.basic.price}
                    </span>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      {service.totalOrders} orders
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied clients and sellers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Whether you're looking to hire top talent or offer your skills to the world, Leafora is your platform to grow.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/signup"
              className="bg-white text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Buying
            </Link>
            <Link
              to="/become-seller"
              className="bg-green-500 text-white border-2 border-green-400 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-400 transition-colors"
            >
              Start Selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;