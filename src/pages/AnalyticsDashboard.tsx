import { useState, useEffect } from 'react';
import { BarChart, AreaChart, PieChart, ResponsiveContainer, Bar, XAxis, Area, Pie, Cell, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Users, DollarSign, Activity, Download, Filter, Package, TrendingUp, TrendingDown } from 'lucide-react';
import KPICard from '../components/KPICard';
import FilterModal from '../components/FilterModal';
import ExportModal from '../components/ExportModal';
import { getAllUsers, getAllOrders, getAllProducts, getAllPament, type Order, type UserResponse, type Product, type Payment } from '../api';
import "./Analytics.css";

// Types for analytics data
interface RevenueData {
  month: string;
  revenue: number;
  users: number;
}

interface TrafficData {
  name: string;  // Changed from 'source' to 'name'
  value: number;
  color: string;
}

interface PerformanceData {
  day: string;
  views: number;
  clicks: number;
  conversions: number;
}

interface AnalyticsData {
  totalRevenue: number;
  activeUsers: number;
  totalProducts: number;
  conversionRate: number;
  totalOrders: number;
  totalPayments: number;
  completedPayments: number;
  pendingPayments: number;
  revenueData: RevenueData[];
  trafficData: TrafficData[];
  performanceData: PerformanceData[];
  recentOrders: Order[];
  topProducts: Product[];
}

// Helper functions
function formatCurrency(amount: number): string {
  const safeAmount = Number.isNaN(amount) || !Number.isFinite(amount) ? 0 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

function formatNumber(num: number): string {
  const safeNum = Number.isNaN(num) || !Number.isFinite(num) ? 0 : num;
  return new Intl.NumberFormat('en-US').format(safeNum);
}

function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function getLastSixMonths(): string[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDate = new Date();
  const result: string[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    result.push(months[date.getMonth()] + ' ' + date.getFullYear().toString().slice(2));
  }
  
  return result;
}

function getLastSevenDays(): string[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const result: string[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    result.push(days[date.getDay()]);
  }
  
  return result;
}

function filterDataByDateRange<T extends { createdAt: string | Date }>(data: T[], dateRange: string): T[] {
  const now = new Date();
  let startDate: Date;

  switch (dateRange) {
    case 'Today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'Last 7 days':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 30 days':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'Last 90 days':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'This year':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return data;
  }

  return data.filter(item => {
    const itemDate = new Date(item.createdAt);
    return itemDate >= startDate;
  });
}

// Main Dashboard Component
export default function AnalyticsDashboard() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalRevenue: 0,
    activeUsers: 0,
    totalProducts: 0,
    conversionRate: 0,
    totalOrders: 0,
    totalPayments: 0,
    completedPayments: 0,
    pendingPayments: 0,
    revenueData: [],
    trafficData: [],
    performanceData: [],
    recentOrders: [],
    topProducts: []
  });

  function getamount(order: Order): number {
    return order.items.reduce((acc, s) => {
      return acc + (s.price * s.quantity);
    }, 0);
  }

  // Calculate analytics from real data
  async function calculateAnalytics() {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [usersResponse, ordersResponse, productsResponse, paymentsResponse] = await Promise.all([
        getAllUsers(),
        getAllOrders(),
        getAllProducts(),
        getAllPament()
      ]);

      // Ensure data is in correct format
      const usersData = Array.isArray(usersResponse) ? usersResponse : (usersResponse as { data?: UserResponse[] })?.data || [];
      const ordersData = Array.isArray(ordersResponse) ? ordersResponse : (ordersResponse as { data?: Order[] })?.data || [];
      const productsData = Array.isArray(productsResponse?.data) ? productsResponse.data : productsResponse?.data || [];
      const paymentsData = Array.isArray(paymentsResponse) ? paymentsResponse : (paymentsResponse as { data?: Payment[] })?.data || [];

      // Filter data by date range
      const filteredOrders = filterDataByDateRange(ordersData, dateRange);
      const filteredPayments = filterDataByDateRange(paymentsData, dateRange);
      const filteredUsers = filterDataByDateRange(usersData, dateRange);

      // Calculate KPIs
      const totalRevenue = filteredPayments
        .filter((payment: Payment) => payment.status === 'COMPLETED')
        .reduce((sum: number, payment: Payment) => sum + (payment.amount || 0), 0);

      const activeUsers = usersData.filter((user: UserResponse) => user.status === 'active').length;
      const totalProducts = productsData.length;
      const totalOrders = filteredOrders.length;
      const totalPayments = filteredPayments.length;
      const completedPayments = filteredPayments.filter((p: Payment) => p.status === 'COMPLETED').length;
      const pendingPayments = filteredPayments.filter((p: Payment) => p.status === 'PENDING').length;
      
      // Calculate conversion rate (completed orders / total orders)
      const conversionRate = totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0;

      // Generate revenue data by month from actual payments
      const revenueByMonth: { [key: string]: { revenue: number; orders: number } } = {};
      const months = getLastSixMonths();
      
      months.forEach(month => {
        revenueByMonth[month] = { revenue: 0, orders: 0 };
      });

      filteredPayments.forEach((payment: Payment) => {
        if (payment.status === 'COMPLETED') {
          const paymentDate = new Date(payment.createdAt);
          const monthKey = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][paymentDate.getMonth()] + 
                          ' ' + paymentDate.getFullYear().toString().slice(2);
          
          if (revenueByMonth[monthKey]) {
            revenueByMonth[monthKey].revenue += payment.amount || 0;
            revenueByMonth[monthKey].orders += 1;
          }
        }
      });

      const revenueData: RevenueData[] = months.map(month => ({
        month,
        revenue: revenueByMonth[month]?.revenue || 0,
        users: revenueByMonth[month]?.orders || 0
      }));

      // Generate traffic data based on user registrations and order sources
      const organicUsers = filteredUsers.length * 0.45; // 45% organic
      const directUsers = filteredUsers.length * 0.25; // 25% direct
      const referralUsers = filteredUsers.length * 0.18; // 18% referral
      const socialUsers = filteredUsers.length * 0.12; // 12% social

      const trafficData: TrafficData[] = [
        { name: 'Organic', value: Math.floor(organicUsers), color: '#10b981' },
        { name: 'Direct', value: Math.floor(directUsers), color: '#059669' },
        { name: 'Referral', value: Math.floor(referralUsers), color: '#047857' },
        { name: 'Social', value: Math.floor(socialUsers), color: '#065f46' },
      ];

      // Generate performance data from last 7 days of orders
      const days = getLastSevenDays();
      const performanceByDay: { [key: string]: { orders: number; revenue: number; users: number } } = {};
      
      days.forEach(day => {
        performanceByDay[day] = { orders: 0, revenue: 0, users: 0 };
      });

      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);

      filteredOrders.forEach((order: Order) => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= last7Days) {
          const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][orderDate.getDay()];
          if (performanceByDay[dayName]) {
            performanceByDay[dayName].orders += 1;
            performanceByDay[dayName].revenue += getamount(order);
            performanceByDay[dayName].users += 1;
          }
        }
      });

      const performanceData: PerformanceData[] = days.map(day => ({
        day,
        views: (performanceByDay[day]?.users || 0) * 10, // Estimate views as 10x users
        clicks: (performanceByDay[day]?.orders || 0) * 3, // Estimate clicks as 3x orders
        conversions: performanceByDay[day]?.orders || 0
      }));

      // Get recent orders (last 5)
      const recentOrders = [...filteredOrders]
        .sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      // Get top products by sales (calculate from orders)
      const productSales: { [key: string]: { product: Product; sales: number; revenue: number } } = {};
      
      filteredOrders.forEach((order: Order) => {
        order.items.forEach(item => {
          if (!productSales[item.productId]) {
            const product = productsData.find((p: Product) => p._id === item.productId);
            if (product) {
              productSales[item.productId] = { product, sales: 0, revenue: 0 };
            }
          }
          if (productSales[item.productId]) {
            productSales[item.productId].sales += item.quantity;
            productSales[item.productId].revenue += item.quantity * item.price;
          }
        });
      });

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5)
        .map(item => item.product);

      setAnalyticsData({
        totalRevenue,
        activeUsers,
        totalProducts,
        conversionRate,
        totalOrders,
        totalPayments,
        completedPayments,
        pendingPayments,
        revenueData,
        trafficData,
        performanceData,
        recentOrders,
        topProducts
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analytics data';
      console.error('Failed to calculate analytics:', err);
      setError(errorMessage);
      
      // Set empty data on error
      setAnalyticsData({
        totalRevenue: 0,
        activeUsers: 0,
        totalProducts: 0,
        conversionRate: 0,
        totalOrders: 0,
        totalPayments: 0,
        completedPayments: 0,
        pendingPayments: 0,
        revenueData: [],
        trafficData: [],
        performanceData: [],
        recentOrders: [],
        topProducts: []
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    calculateAnalytics();
    
    // Refresh data every 5 minutes
    const interval = setInterval(calculateAnalytics, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  // Calculate percentage changes
  const revenueDataLength = analyticsData.revenueData.length;
  const previousRevenue = revenueDataLength > 1 
    ? analyticsData.revenueData.slice(0, -1).reduce((sum, item) => sum + item.revenue, 0) / (revenueDataLength - 1)
    : 0;
  const currentRevenue = analyticsData.revenueData.slice(-1)[0]?.revenue || 0;
  const revenueChange = calculatePercentageChange(currentRevenue, previousRevenue);

  const previousUsers = revenueDataLength > 1
    ? analyticsData.revenueData.slice(0, -1).reduce((sum, item) => sum + item.users, 0) / (revenueDataLength - 1)
    : 0;
  const currentUsers = analyticsData.revenueData.slice(-1)[0]?.users || 0;
  const usersChange = calculatePercentageChange(currentUsers, previousUsers);

  const productsChange = 0; // Static since products don't have historical data
  const conversionChange = calculatePercentageChange(analyticsData.conversionRate, 50); // Compare with 50% baseline

  return (
    <div className="analytics-page">
      {/* HEADER */}
      <header className="analytics-header">
        <div className="header-inner">
          <div className="header-title-group">
            <h1 className="analytics-title">Analytics</h1>
            <p className="analytics-subtitle">Track your performance and growth metrics</p>
          </div>

          <div className="header-actions">
            <button
              onClick={() => setShowFilterModal(true)}
              className="btn-filter"
            >
              <Filter className="icon" />
              {dateRange}
            </button>

            <button
              onClick={() => setShowExportModal(true)}
              className="btn-export"
            >
              <Download className="icon" />
              Export
            </button>
            
            <button
              onClick={calculateAnalytics}
              className="btn-refresh"
              disabled={loading}
            >
              <Activity className="icon" />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="analytics-error">
          <div className="error-message">
            Error: {error}
            <button onClick={calculateAnalytics} className="retry-btn">
              Retry
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="analytics-content">
        {/* KPI CARDS */}
        <div className="kpi-grid">
          <KPICard
            title="Total Revenue"
            value={formatCurrency(analyticsData.totalRevenue)}
            change={`${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`}
            isPositive={revenueChange >= 0}
            icon={<DollarSign className="icon" />}
            color="blue"
          />
          <KPICard
            title="Active Users"
            value={formatNumber(analyticsData.activeUsers)}
            change={`${usersChange >= 0 ? '+' : ''}${usersChange.toFixed(1)}%`}
            isPositive={usersChange >= 0}
            icon={<Users className="icon" />}
            color="purple"
          />
          <KPICard
            title="Total Products"
            value={formatNumber(analyticsData.totalProducts)}
            change={`${productsChange >= 0 ? '+' : ''}${productsChange.toFixed(1)}%`}
            isPositive={productsChange >= 0}
            icon={<Package className="icon" />}
            color="pink"
          />
          <KPICard
            title="Conversion Rate"
            value={`${analyticsData.conversionRate.toFixed(2)}%`}
            change={`${conversionChange >= 0 ? '+' : ''}${conversionChange.toFixed(1)}%`}
            isPositive={conversionChange >= 0}
            icon={<Activity className="icon" />}
            color="green"
          />
        </div>

        {/* ADDITIONAL STATS */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-header">
              <h4>Recent Orders</h4>
              <span className="stats-count">{analyticsData.totalOrders}</span>
            </div>
            <div className="stats-list">
              {analyticsData.recentOrders.slice(0, 3).map((order) => (
                <div key={order._id || Math.random()} className="stats-item">
                  <div className="stats-item-left">
                    <span className="order-id">#{order._id?.substring(0, 8) || 'N/A'}</span>
                    <span className="order-amount">{formatCurrency(getamount(order))}</span>
                  </div>
                  <div className={`order-status ${order.status?.toLowerCase() || ''}`}>
                    {order.status || 'N/A'}
                  </div>
                </div>
              ))}
              {analyticsData.recentOrders.length === 0 && ( 
                <div className="no-data">No recent orders</div>
              )}
            </div>
          </div>

          <div className="stats-card">
            <div className="stats-header">
              <h4>Top Products</h4>
              <span className="stats-count">{analyticsData.topProducts.length}</span>
            </div>
            <div className="stats-list">
              {analyticsData.topProducts.map((product) => (
                <div key={product._id || Math.random()} className="stats-item">
                  <div className="stats-item-left">
                    <span className="product-name">{product.name}</span>
                    <span className="product-price">{formatCurrency(product.price || 0)}</span>
                  </div>
                  <div className="product-stock">
                    Stock: {product.stock || 0}
                  </div>
                </div>
              ))}
              {analyticsData.topProducts.length === 0 && (
                <div className="no-data">No products data</div>
              )}
            </div>
          </div>
        </div>

        {/* CHART ROW 1 */}
        <div className="chart-row-1">
          {/* REVENUE CHART */}
          <div className="chart-card revenue-chart">
            <div className="chart-header">
              <div>
                <h3 className="chart-title">Revenue Overview</h3>
                <p className="chart-subtitle">Monthly revenue and orders</p>
              </div>
              <div className="chart-trend">
                {revenueChange >= 0 ? (
                  <TrendingUp className="trend-icon positive" />
                ) : (
                  <TrendingDown className="trend-icon negative" />
                )}
                <span className={`trend-text ${revenueChange >= 0 ? 'positive' : 'negative'}`}>
                  {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="Area-chart">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number | string) => [formatCurrency(Number(value)), '']}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Orders"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TRAFFIC SOURCES */}
          <div className="chart-card traffic-chart">
            <div className="chart-header">
              <h3 className="chart-title">User Sources</h3>
              <p className="chart-subtitle">User acquisition channels</p>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Tooltip formatter={(value) => [formatNumber(Number(value)), 'Users']} />
                <Pie
                  data={analyticsData.trafficData as any}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={(entry: { payload?: TrafficData; value: number }) =>
                    `${entry.payload?.name || 'Unknown'}: ${formatNumber(entry.value)}`
                  }
                >
                  {analyticsData.trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="traffic-legend">
              {analyticsData.trafficData.map((item) => (
                <div key={item.name} className="traffic-item">
                  <div className="traffic-label">
                    <div className="traffic-dot" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="traffic-value">{formatNumber(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART ROW 2 */}
        <div className="chart-row-2">
          <div className="chart-card performance-chart">
            <div className="chart-header">
              <h3 className="chart-title">Weekly Performance</h3>
              <p className="chart-subtitle">Views, clicks, and conversions (last 7 days)</p>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="views" name="Page Views" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicks" name="Clicks" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="conversions" name="Orders" fill="#047857" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>

      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} />
      <FilterModal 
        isOpen={showFilterModal} 
        onClose={() => setShowFilterModal(false)}
        currentRange={dateRange}
        onSelectRange={setDateRange}
      />
    </div>
  );
}