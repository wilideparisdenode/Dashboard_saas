


import * as Icons from "lucide-react";
import "./OverView.css";

import {kpiData} from "./mockData";
import { recentActivities } from "./mockData";
import type { KPICardType } from "../components/KPICard";
import type { LucideIcon } from "lucide-react";

interface QuickAction{
  label: string;
  icon: LucideIconName;
  color: string;
}

const quickActions:QuickAction[] = [
  { icon: "UserPlus", label: "Add User", color: "blue" },
  { icon: "ShoppingBag", label: "Create Order", color: "emerald" },
  { icon: "CreditCard", label: "View Payments", color: "purple" },
  { icon: "PackagePlus", label: "Create Product", color: "orange" }
];

type LucideIconName = keyof typeof Icons;

// ------------------------------------------------------
// KPI CARD COMPONENT
// ------------------------------------------------------
const KPICard = ({ title, value, change, isPositive, icon, color }:KPICardType) => {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div>
          <p className="kpi-title">{title}</p>
          <p className="kpi-value">{value}</p>

          <div className="kpi-change">
            {isPositive ? (
              <Icons.TrendingUp className="kpi-positive" size={16} />
            ) : (
              <Icons.TrendingDown className="kpi-negative" size={16} />
            )}

            <span className={isPositive ? "kpi-positive" : "kpi-negative"}>
              {change}
            </span>

            <span className="text-muted">vs last month</span>
          </div>
        </div>

        <div className={`kpi-icon-box bg-${color}`}>
  {icon}
</div>

      </div>
    </div>
  );
};


// ------------------------------------------------------
// MAIN OVERVIEW PAGE
// ------------------------------------------------------
function Overview() {
  return (
    <div className="overview-container">
      <div className="overview-wrapper">

        {/* Header */}
        <div className="overview-header">
          <h1>Dashboard Overview</h1>
          <p>Monitor your business performance and activities</p>
        </div>

        {/* KPI CARDS */}
        <div className="kpi-grid">
          {kpiData.map((item, i) => (
            <KPICard
              key={i}
              title={item.title}
              value={item.value}
              change={item.change}
              isPositive={item.isPositive}
              icon={item.icon}
              color={item.color}
            />
          ))}
        </div>

        {/* Two-Column Layout */}
        <div className="main-grid">

          {/* RECENT ACTIVITIES */}
          <div className="activities-card" style={{ gridColumn: "span 2" }}>
            <div className="activities-header">
              <div>
                <h2>Recent Activities</h2>
                <p>Latest updates from your business</p>
              </div>

              <select className="activities-select">
                <option value="month">This Month</option>
                <option value="week">This Week</option>
                <option value="day">Today</option>
                <option value="7months">Last 7 Months</option>
              </select>
            </div>

            <div className="activities-list">
              {recentActivities.map((activity, i) => (
                <div key={i} className="activity-row">

                  <div className="activity-left">
                    <div className="activity-dot"></div>

                    <div className="activity-info">
                      <p>{activity.activity}</p>
                      <p>{activity.date}</p>
                    </div>
                  </div>

                  <span className="activity-tag">{activity.atId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <p>Frequently used operations</p>

            <div className="quick-actions-list">
             {quickActions.map((action, i) => {
           const Icon = Icons[action.icon] as LucideIcon;

  return (
    <button key={i} className={`quick-btn btn-${action.color}`}>
      <div className="quick-btn-icon">
        <Icon size={20} />
      </div>
      <span>{action.label}</span>
    </button>
  );
})}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Overview;
