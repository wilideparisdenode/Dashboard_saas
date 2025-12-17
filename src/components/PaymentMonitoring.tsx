import { useState, useEffect } from "react";
import "./componentStyle.css";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import DetailsPanel from "./DetailsPanel";
import { 
  getAllPament, 
  getAllUsers, 
  ProcessPayment, 
  Refund, 
  type Payment, 
  type UserResponse, 
} from "../api";

type Props = {};

interface PaymentStats {
  totalToday: number;
  successRate: number;
  refundCount: number;
  failedCount: number;
}

interface Filters {
  id: string;
  userEmail: string;
  status: string;
  method: string;
  provider: string;
  dateRange: string;
  customDate: string;
}

const bounce: TargetAndTransition = {
  scale: 0.8,
  transition: { type: "spring", stiffness: 300, damping: 10 }
};

function PaymentMonitoring({}: Props) {
  const [payments, setPayments] = useState<Payment[]>([]);
    const [users, setUsers] = useState<UserResponse[]>([]);

  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [stats, setStats] = useState<PaymentStats>({
    totalToday: 0,
    successRate: 0,
    refundCount: 0,
    failedCount: 0
  });
  async function getUsers(){
   const r= await getAllUsers();
   setUsers(r);
  }
  const [filters, setFilters] = useState<Filters>({
    id: "",
    userEmail: "",
    status: "",
    method: "",
    provider: "",
    dateRange: "all",
    customDate: ""
  });

  useEffect(() => {
    async function U() {
    await  getUsers();
    }
    U();
    fetchPayments();
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [payments, filters]);

  async function fetchPayments() {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllPament();
      setPayments(data);
    
      setFilteredPayments(data);
    } catch (err: any) {
      console.error("Failed to load payments:", err);
      setError(err.message || "Failed to load payments");
      setPayments([]);
      setFilteredPayments([]);
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...payments];

    // Filter by ID
    if (filters.id) {
      filtered = filtered.filter(p => 
        p._id?.toLowerCase().includes(filters.id.toLowerCase())
      );
    }

    // Filter by user email/name
    if (filters.userEmail) {
      filtered = filtered.filter(p => 
        p.userId?.toLowerCase().includes(filters.userEmail.toLowerCase())
      );
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(p => p.status === filters.status);
    }

    // Filter by payment method
    if (filters.method) {
      filtered = filtered.filter(p => 
        p.paymentMethod?.toLowerCase() === filters.method.toLowerCase()
      );
    }

    // Filter by provider
    if (filters.provider) {
      filtered = filtered.filter(p => 
        p.provider?.toLowerCase() === filters.provider.toLowerCase()
      );
    }

    // Filter by date range
    if (filters.dateRange === "today") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= today;
      });
    } else if (filters.customDate) {
      const selectedDate = new Date(filters.customDate);
      selectedDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      filtered = filtered.filter(p => {
        const paymentDate = new Date(p.createdAt);
        return paymentDate >= selectedDate && paymentDate < nextDay;
      });
    }

    setFilteredPayments(filtered);
  }

  function calculateStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Payments made today
    const todayPayments = payments.filter(p => {
      const paymentDate = new Date(p.createdAt);
      return paymentDate >= today;
    });

    const totalToday = todayPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

    // Success rate
    const completedPayments = payments.filter(p => p.status === "COMPLETED").length;
    const successRate = payments.length > 0 
      ? Math.round((completedPayments / payments.length) * 100) 
      : 0;

    // Refund count
    const refundCount = payments.filter(p => p.status === "REFUNDED").length;

    // Failed payments
    const failedCount = payments.filter(p => p.status === "FAILED").length;

    setStats({
      totalToday,
      successRate,
      refundCount,
      failedCount
    });
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function formatCurrency(amount: number) {
    return `${amount?.toFixed(2) || "0.00"} CFA`;
  }

  function formatDate(date: Date | string) {
    try {
      return new Date(date).toLocaleString();
    } catch {
      return "Invalid Date";
    }
  }

  function getStatusClass(status: string) {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "status-completed";
      case "PENDING":
        return "status-pending";
      case "FAILED":
        return "status-failed";
      case "REFUNDED":
        return "status-refunded";
      default:
        return "";
    }
  }

  async function handleProcessPayment(paymentId: string) {
    if (window.confirm("Process this payment?")) {
      try {
        await ProcessPayment(paymentId);
        await fetchPayments();
        alert("Payment processed successfully");
      } catch (err) {
        console.error("Failed to process payment:", err);
        alert("Failed to process payment");
      }
    }
  }

  async function handleRefund(paymentId: string) {
    if (window.confirm("Are you sure you want to refund this payment?")) {
      try {
        await Refund(paymentId);
        await fetchPayments();
        alert("Payment refunded successfully");
      } catch (err) {
        console.error("Failed to refund payment:", err);
        alert("Failed to refund payment");
      }
    }
  }

  function handleViewDetails(payment: Payment) {
    setSelectedPayment(payment);
    setShowDetails(true);
  }

  function clearFilters() {
    setFilters({
      id: "",
      userEmail: "",
      status: "",
      method: "",
      provider: "",
      dateRange: "all",
      customDate: ""
    });
  }

  return (
    <div className="payment_monitoring">
      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={fetchPayments} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="stats_container">
        <div className="filter_panel">
          <input 
            className="id_filter" 
            placeholder="Filter by ID" 
            name="id"
            value={filters.id}
            onChange={handleFilterChange}
          />
          <input 
            type="text" 
            className="email_user_filter" 
            placeholder="Username/Email" 
            name="userEmail"
            value={filters.userEmail}
            onChange={handleFilterChange}
          />

          <select 
            id="status" 
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select 
            id="method"
            name="method"
            value={filters.method}
            onChange={handleFilterChange}
          >
            <option value="">All Methods</option>
            <option value="card">Card</option>
            <option value="bank">Bank</option>
            <option value="wallet">Wallet</option>
          </select>

          <select 
            id="provider"
            name="provider"
            value={filters.provider}
            onChange={handleFilterChange}
          >
            <option value="">All Providers</option>
            <option value="stripe">Stripe</option>
            <option value="paypal">PayPal</option>
            <option value="other">Other</option>
          </select>

          <div className="date_range_container">
            <select 
              id="date_range"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleFilterChange}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="custom">Custom Date</option>
            </select>
            {filters.dateRange === "custom" && (
              <input 
                type="date" 
                name="customDate"
                value={filters.customDate}
                onChange={handleFilterChange}
              />
            )}
          </div>

          <button onClick={clearFilters} className="clear-filters-btn">
            Clear Filters
          </button>
        </div>

        <div className="matrixpanel">
          <motion.section whileTap={bounce}>
            <h3>Total Payment Today</h3>
            <p>{formatCurrency(stats.totalToday)}</p>
          </motion.section>

          <motion.section whileTap={bounce}>
            <h3>Success Rate</h3>
            <p>{stats.successRate}%</p>
          </motion.section>

          <motion.section whileTap={bounce}>
            <h3>Refund Count</h3>
            <p>{stats.refundCount}</p>
          </motion.section>

          <motion.section whileTap={bounce}>
            <h3>Failed Payments</h3>
            <p>{stats.failedCount}</p>
          </motion.section>
        </div>
      </div>

      <div className="transaction_list">
        <h2>Transaction List ({filteredPayments.length})</h2>
        
        {loading ? (
          <div className="loading">Loading payments...</div>
        ) : filteredPayments.length === 0 ? (
          <div className="no-payments">
            No payments found. {error ? "Please try again." : "Try adjusting your filters."}
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Method</th>
               
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
             {filteredPayments.map((payment, i) => {
  const user = users.find((e) => e._id == payment.userId);

  return (
    <tr key={payment._id || i}>
      <td>{payment._id?.substring(0, 8)}...</td>
      <td>{user?.name || "Unknown"}</td>
      <td>{formatCurrency(payment.amount)}</td>
      <td>{payment.method || "N/A"}</td>
      
      <td>
        <span className={`payment-status ${getStatusClass(payment.status)}`}>
          {payment.status}
        </span>
      </td>

      <td>{formatDate(payment.createdAt)}</td>

      <td className="action-buttons">
        <button 
          className="btn-view"
          onClick={() => handleViewDetails(payment)}
        >
          View
        </button>

        {payment.status === "PENDING" && (
          <button 
            className="btn-process"
            onClick={() => handleProcessPayment(payment._id||"")}
          >
            Process
          </button>
        )}

        {payment.status === "COMPLETED" && (
          <button 
            className="btn-refund"
            onClick={() => handleRefund(payment._id||"")}
          >
            Refund
          </button>
        )}
      </td>
    </tr>
  );
})}

            </tbody>
          </table>
        )}
      </div>

      {showDetails && selectedPayment && (
        <DetailsPanel 
          payment={selectedPayment}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}

export default PaymentMonitoring;