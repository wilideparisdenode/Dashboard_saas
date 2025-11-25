import  { useState } from 'react';
import { BarChart,  AreaChart, PieChart, ResponsiveContainer,Bar,
XAxis,
YAxis,
Tooltip,
Legend } from 'recharts';
import {  Users, DollarSign, Activity, Eye, Download, Filter } from 'lucide-react';
import KPICard from '../components/KPICard';
import FilterModal from '../components/FilterModal';
import ExportModal from '../components/ExportModal';
import "./Analytics.css"
// Sample data
const revenueData = [
  { month: 'Jan', revenue: 4200, users: 240 },
  { month: 'Feb', revenue: 5100, users: 320 },
  { month: 'Mar', revenue: 4800, users: 290 },
  { month: 'Apr', revenue: 6200, users: 410 },
  { month: 'May', revenue: 7100, users: 480 },
  { month: 'Jun', revenue: 8300, users: 550 },
];

const trafficData = [
  { source: 'Organic', value: 4500, color: '#3b82f6' },
  { source: 'Direct', value: 2400, color: '#8b5cf6' },
  { source: 'Referral', value: 1800, color: '#ec4899' },
  { source: 'Social', value: 1200, color: '#10b981' },
];

const performanceData = [
  { day: 'Mon', views: 3200, clicks: 1200, conversions: 340 },
  { day: 'Tue', views: 2800, clicks: 1100, conversions: 290 },
  { day: 'Wed', views: 4100, clicks: 1500, conversions: 420 },
  { day: 'Thu', views: 3800, clicks: 1350, conversions: 380 },
  { day: 'Fri', views: 4500, clicks: 1600, conversions: 450 },
  { day: 'Sat', views: 2900, clicks: 980, conversions: 260 },
  { day: 'Sun', views: 2400, clicks: 850, conversions: 220 },
];

// Main Dashboard Component
export default function AnalyticsDashboard() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [dateRange, setDateRange] = useState('Last 30 days');

  return (<div className="analytics-page">

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
      </div>
    </div>
  </header>

  {/* MAIN CONTENT */}
  <main className="analytics-content">

    {/* KPI CARDS */}
    <div className="kpi-grid">
      <KPICard
        title="Total Revenue"
        value="$45,231"
        change="+12.5%"
        isPositive={true}
        icon={<DollarSign className="icon" />}
        color="blue"
      />
      <KPICard
        title="Active Users"
        value="2,543"
        change="+8.2%"
        isPositive={true}
        icon={<Users className="icon" />}
        color="purple"
      />
      <KPICard
        title="Page Views"
        value="18,942"
        change="-3.1%"
        isPositive={false}
        icon={<Eye className="icon" />}
        color="pink"
      />
      <KPICard
        title="Conversion Rate"
        value="3.24%"
        change="+0.8%"
        isPositive={true}
        icon={<Activity className="icon" />}
        color="green"
      />
    </div>

    {/* CHART ROW 1 */}
    <div className="chart-row-1">

      {/* REVENUE CHART */}
      <div className="chart-card revenue-chart">
        <div className="chart-header">
          <h3 className="chart-title">Revenue Overview</h3>
          <p className="chart-subtitle">Monthly revenue and user growth</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          {/* chart code unchanged */}
          <AreaChart data={revenueData}> ... </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* TRAFFIC SOURCES */}
      <div className="chart-card traffic-chart">
        <div className="chart-header">
          <h3 className="chart-title">Traffic Sources</h3>
          <p className="chart-subtitle">Visitor distribution</p>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <PieChart> ... </PieChart>
        </ResponsiveContainer>

        <div className="traffic-legend">
          {trafficData.map((item) => (
            <div key={item.source} className="traffic-item">
              <div className="traffic-label">
                <div className="traffic-dot" style={{ backgroundColor: item.color }} />
                <span>{item.source}</span>
              </div>
              <span className="traffic-value">{item.value.toLocaleString()}</span>
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
          <p className="chart-subtitle">Views, clicks, and conversions</p>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
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

  <Bar dataKey="views" fill="#3b82f6" radius={[4, 4, 0, 0]} />
  <Bar dataKey="clicks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
  <Bar dataKey="conversions" fill="#10b981" radius={[4, 4, 0, 0]} />
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
