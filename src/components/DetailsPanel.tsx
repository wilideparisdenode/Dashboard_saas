import { X } from "lucide-react";
import { type Payment } from "../api";
import "./componentStyle.css";

interface DetailsPanelProps {
  payment: Payment;
  onClose: () => void;
}

function DetailsPanel({ payment, onClose }: DetailsPanelProps) {
  function formatCurrency(amount: number) {
    return `${amount?.toFixed(2) || "0.00"} CFA`;
  }

  function formatDate(date: string | Date) {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  }

  function getStatusColor(status: string) {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "#10b981";
      case "PENDING":
        return "#f59e0b";
      case "FAILED":
        return "#ef4444";
      case "REFUNDED":
        return "#6366f1";
      default:
        return "#6b7280";
    }
  }

  return (
    <>
      <div className="details-overlay" onClick={onClose}></div>
      <div className="details-panel">
        <div className="details-header">
          <h2>Payment Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="details-content">
          <div className="detail-section">
            <h3>Transaction Information</h3>
            <div className="detail-row">
              <span className="detail-label">Payment ID:</span>
              <span className="detail-value">{payment._id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Order ID:</span>
              <span className="detail-value">{payment.orderId || "N/A"}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">User ID:</span>
              <span className="detail-value">{payment.userId}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span 
                className="detail-value status-badge" 
                style={{ backgroundColor: getStatusColor(payment.status) }}
              >
                {payment.status}
              </span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Payment Details</h3>
            <div className="detail-row">
              <span className="detail-label">Amount:</span>
              <span className="detail-value amount-highlight">
                {formatCurrency(payment.amount)}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Payment Method:</span>
              <span className="detail-value">{payment.method || "N/A"}</span>
            </div>
          
            <div className="detail-row">
              <span className="detail-label">Transaction ID:</span>
              <span className="detail-value">{payment.transactionId || "N/A"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Timestamps</h3>
            <div className="detail-row">
              <span className="detail-label">Created At:</span>
              <span className="detail-value">{formatDate(payment.createdAt)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Updated At:</span>
              <span className="detail-value">{formatDate(payment.updatedAt)|| ""}</span>
            </div>
          </div>

          {payment.metadata && Object.keys(payment.metadata).length > 0 && (
            <div className="detail-section">
              <h3>Additional Information</h3>
              {Object.entries(payment.metadata).map(([key, value]) => (
                <div className="detail-row" key={key}>
                  <span className="detail-label">{key}:</span>
                  <span className="detail-value">{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default DetailsPanel;