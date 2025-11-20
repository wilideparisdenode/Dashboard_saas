import "./componentStyle.css";
import { motion } from "framer-motion";
import type { TargetAndTransition } from "framer-motion";
import DetailsPanel from "./DetailsPanel";


type Props = {}
const mockData = [
  {
    id: 1,
    user: "John Doe",
    amount: 120.50,
    method: "Credit Card",
    status: "Completed",
    createdAt: "2025-11-20 09:15",
  },
  {
    id: 2,
    user: "Jane Smith",
    amount: 75.00,
    method: "PayPal",
    status: "Pending",
    createdAt: "2025-11-19 14:30",
  },
  {
    id: 3,
    user: "Mike Johnson",
    amount: 200.00,
    method: "Bank Transfer",
    status: "Failed",
    createdAt: "2025-11-18 11:45",
  },
  {
    id: 4,
    user: "Emily Davis",
    amount: 50.75,
    method: "Credit Card",
    status: "Completed",
    createdAt: "2025-11-20 08:00",
  },
  {
    id: 5,
    user: "Chris Lee",
    amount: 300.00,
    method: "PayPal",
    status: "Pending",
    createdAt: "2025-11-17 16:20",
  },
];

const bounce :TargetAndTransition= {
  scale: 0.8,
  transition: { type: "spring", stiffness: 300, damping: 10 }
};

function PaymentMonitoring({}: Props) {
  return (
    <div className="payment_monitoring">
      {/* <h1>Payment monitoring</h1> */}

      <div className="stats_container">
           {/* <h2>search by:</h2> */}
        <div className="filter_panel">
          <input className="id_filter" placeholder="filter: id" />
          <input type="text" className="email_user_filter" placeholder="username/email" />

          <select id="status">
            <option value="">all</option>
            <option value="">success</option>
            <option value="">failed</option>
            <option value="">pending</option>
          </select>

          <select id="method">
            <option value="">card</option>
            <option value="">bank</option>
            <option value="">wallet</option>
          </select>

          <select id="provider">
            <option value="">stripe</option>
            <option value="">paypal</option>
            <option value="">other</option>
          </select>

          <div className="date_range_container">
            <select id="date_range">
              <option value="">today</option>
            </select>
            <input type="date" />
          </div>
        </div>

        <div className="matrixpanel">
          <motion.section whileTap={bounce}>
            <h3>Total payment today</h3>
            <p>2000cfa</p>
          </motion.section>

          <motion.section whileTap={bounce}>
            <h3>Success rate</h3>
            <p>40%</p>
          </motion.section>

          <motion.section whileTap={bounce}>
            <h3>Refund count</h3>
            <p>30</p>
          </motion.section>

          <motion.section whileTap={bounce}>
            <h3>Failed payments</h3>
            <p>7</p>
          </motion.section>
        </div>

      </div>
      <div className="transaction_list">
        <h2>Transaction List</h2>
        <table>
           <thead>
    <tr>
      <th>ID</th>
      <th>User</th>
      <th>Amount</th>
      <th>Method</th>
      <th>Status</th>
      <th>Created at</th>
      <th>More</th>
    </tr>
  </thead>
  {mockData.map((d,i)=>(<tr key={i}>
    <td>{d.id}</td>
    <td>{d.user}</td>
    <td>{d.amount}</td>
    <td>{d.method}</td>
    <td>{d.status}</td>
    <td>{d.createdAt}</td>
    <td>{d.id}</td>
  </tr>))}
        </table>
      </div>
      {/* <DetailsPanel d={mockData[1]}/> */}
    </div>
  );
}

export default PaymentMonitoring;
