import React from "react";
import "./OrderStyles.css"
const OrderManagement: React.FC = () => {
  return (
    <div className="order-management-container">

      {/* -------------------- HEADER SECTION -------------------- */}
      <header className="header-section">
        <div className="title_section">
              <h2 className="page-title">Order Management</h2>
              <h3>you can find all of your orders</h3>
        </div>
       
        <div className="header-actions">
          {/* Example slot for actions like "Export" or "Create Order" */}
          <button className="btn-primary">Create Order</button>
        </div>
      </header>


      {/* -------------------- ORDER OVERVIEW SECTION -------------------- */}
      <section className="order-overview">
        <div className="overview-card">
          <h3>Total Orders</h3>
          <p className="quantity">1,240</p>
          <p>total orders since 356 days</p>
        </div>

        <div className="overview-card">
          <h3>Pending</h3>
          <p className="quantity">184</p>
                    <p>pending orders since 356 days</p>

        </div>

        <div className="overview-card">
          <h3>Completed</h3>
          <p className="quantity">1,012</p>
                    <p>completed orders since 356 days</p>

        </div>

        <div className="overview-card">
          <h3>Canceled</h3>
          <p className="quantity">44</p>
                    <p>cancelled orders since 356 days</p>

        </div>
      </section>


      {/* -------------------- ORDER LIST SECTION -------------------- */}
      <section className="order-list-section">

        {/* SEARCH + FILTER PANEL */}
        <div className="list-header">
          {/* Search */}
          <input
            type="text"
            placeholder="Search orders..."
            className="search-input"
          />

          {/* Filter Panel */}
          <div className="filter-panel">
            <select className="filter-select">
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </select>

            <select className="filter-select">
              <option value="">Sort by</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="AmountHigh">Amount: High → Low</option>
              <option value="AmountLow">Amount: Low → High</option>
            </select>
          </div>
        </div>


        {/* ORDER TABLE */}
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {/* Example row – populate dynamically */}
            <tr>
              <td>#10234</td>
              <td>John Doe</td>
              <td>2025-01-14</td>
              <td><span className="status pending">Pending</span></td>
              <td>$89.99</td>
              <td>
                <button className="btn-link">View</button>
              </td>
            </tr>

            <tr>
              <td>#10212</td>
              <td>Sarah Williams</td>
              <td>2025-01-10</td>
              <td><span className="status completed">Completed</span></td>
              <td>$129.50</td>
              <td>
                <button className="btn-link">View</button>
              </td>
            </tr>
          </tbody>
        </table>


        {/* -------------------- NEXT PAGE SECTION (Pagination) -------------------- */}
        <div className="pagination-section">
          <button className="pagination-btn">Previous</button>
          <span className="pagination-info">Page 1 of 20</span>
          <button className="pagination-btn">Next</button>
        </div>

      </section>

    </div>
  );
};

export default OrderManagement;
