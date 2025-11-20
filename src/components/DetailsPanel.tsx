import "./componentStyle.css"

export default function DetailsPanel({ d }: any) {
  const {
    id = 3,
    user = "Mike Johnson",
    amount = 200.0,
    method = "Bank Transfer",
    status = "Failed",
    createdAt = "2025-11-18 11:45",
    timeline = "completed",
    risk_score = "12/100",
  } = d || {};

  return (
    <div className="t_details_panel">
      <div className="header">
        <h2>Transaction Details</h2>
        <h2>ID: {id}</h2>
      </div>

      <div>
        <p>Customer: {user}</p>
        <p>Amount: {amount}</p>
        <p>Method: {method}</p>
        <p>Status: {status}</p>
        <p>Timeline: {timeline}</p>
        <p>Risk Score: {risk_score}</p>
      </div>

      <div>
        <h1>Logs / Events:</h1>
        <p>12:23 PM Payment requested</p>
        <p>12:23 PM Gateway authorization</p>
        <p>12:30 PM Payment completed</p>
      </div>
    </div>
  );
}
