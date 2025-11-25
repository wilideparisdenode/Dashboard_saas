import { TrendingDown,TrendingUp } from "lucide-react";

function KPICard({ title, value, change, isPositive, icon, color }) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className={`kpi-icon kpi-icon-${color}`}>
          {icon}
        </div>

        <div className={`kpi-change ${isPositive ? 'positive' : 'negative'}`}>
          {isPositive ? <TrendingUp className="icon-sm" /> : <TrendingDown className="icon-sm" />}
          {change}
        </div>
      </div>

      <h3 className="kpi-value">{value}</h3>
      <p className="kpi-title">{title}</p>
    </div>
  );
} export default KPICard;
