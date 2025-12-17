import React, { useState, useEffect } from "react";
import "./OrderStyles.css";
import { 
  getAllOrders, 
  UpdateOrder, 
  cancelOrders, 
  type Order, 
  OrderStatus, 
  getAllUsers, 
  type Product,
  getAllProducts, 
  deleteOrder,
  type UserResponse
} from "../api";
import CreateOrderModal from "../components/CreateOrderModal";
import { useAuth } from "../components/AuthContext";

const OrderManagement: React.FC = () => {
  // Auth context
  const { user } = useAuth();
  
  // Create order modal state
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Order state
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selection state
  const [selectMode, setSelectMode] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  // User state
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map());
  
  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    sortBy: ""
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0
  });

  // Load initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  // Create user map for quick lookup
  useEffect(() => {
    if (users.length > 0) {
      const map = new Map<string, string>();
      users.forEach(user => {
        if (user._id) {
          map.set(user._id, user.name);
        }
      });
      setUserMap(map);
    }
  }, [users]);

  // Apply filters when orders or filters change
  useEffect(() => {
    applyFilters();
    calculateStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders, filters]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch in parallel for better performance
      const [ordersData, usersData, productsData] = await Promise.all([
        fetchOrders(),
        fetchUsers(),
        fetchProducts()
      ]);
      setOrders(ordersData);
      console.log(ordersData);
      setUsers(usersData);
      setProducts(productsData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (): Promise<Order[]> => {
    try {
      const response = await getAllOrders();
      
      // Handle different response formats
      if (response && typeof response === 'object' && 'data' in response) {
        // Response is like { data: Order[] }
        return (response as { data: Order[] }).data;
      } else if (Array.isArray(response)) {
        // Response is already an array
        return response;
      } else {
        console.error("Unexpected API response format:", response);
        return [];
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load orders";
      console.error("Failed to load orders:", err);
      setError(errorMessage);
      return [];
    }
  };

  const fetchUsers = async (): Promise<UserResponse[]> => {
    try {
      const users = await getAllUsers();
      return users ;
    } catch (err) {
      console.error("Failed to load users:", err);
      return [];
    }
  };

  const fetchProducts = async (): Promise<Product[]> => {
    try {
      const response = await getAllProducts();
      // Handle different response formats
      if (response && typeof response === 'object' && 'data' in response) {
        return (response as { data: Product[] }).data;
      } else if (Array.isArray(response)) {
        return response;
      }
      return [];
    } catch (err) {
      console.error("Failed to load products:", err);
      return [];
    }
  };

  const applyFilters = () => {
    let filtered = [...orders];

    // Search filter
    if (filters.search.trim()) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = getOrderId(order);
        const userName = userMap.get(order.userId as string) || "";
        return (
          orderId?.toLowerCase().includes(searchLower) ||
          userName.toLowerCase().includes(searchLower) ||
          order.status?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(order => order?.status === filters.status);
    }

    // Sort filter
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case "Newest":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case "Oldest":
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case "AmountHigh":
            return calculateOrderTotal(b) - calculateOrderTotal(a);
          case "AmountLow":
            return calculateOrderTotal(a) - calculateOrderTotal(b);
          default:
            return 0;
        }
      });
    }

    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const calculateStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o?.status === OrderStatus.PENDING).length;
    const confirmed = orders.filter(o => o?.status === OrderStatus.CONFIRMED).length;
    const shipped = orders.filter(o => o?.status === OrderStatus.SHIPPED).length;
    const delivered = orders.filter(o => o?.status === OrderStatus.DELIVERED).length;
    const cancelled = orders.filter(o => o?.status === OrderStatus.CANCELLED).length;
    
    setStats({ total, pending, confirmed, shipped, delivered, cancelled });
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSelect = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const pageOrderIds = paginatedOrders.map(order => getOrderId(order));
    setSelectedOrders(prev =>
      prev.length === pageOrderIds.length ? [] : pageOrderIds
    );
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await deleteOrder(orderId);
        await fetchAllData();
        alert("Order deleted successfully");
      } catch (err) {
        console.error("Failed to cancel order:", err);
        alert("Failed to cancel order");
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedOrders.length === 0) {
      alert("No orders selected");
      return;
    }

    if (window.confirm(`Cancel ${selectedOrders.length} selected orders?`)) {
      try {
        await Promise.all(selectedOrders.map(id => cancelOrders(id)));
        await fetchAllData();
        setSelectedOrders([]);
        alert("Selected orders cancelled successfully");
      } catch (err) {
        console.error("Failed to cancel orders:", err);
        alert("Failed to cancel orders");
      }
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const order = orders.find(o => getOrderId(o) === orderId);
      if (order) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date()
        };
        await UpdateOrder(updatedOrder, orderId);
        await fetchAllData();
      }
    } catch (err) {
      console.error("Failed to update order:", err);
      alert("Failed to update order status");
    }
  };

  const formatDate = (date: Date | string) => {
    try {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getOrderId = (order: Order): string => {
    return order._id || "";
  };

  const calculateOrderTotal = (order: Order): number => {
    return order.items?.reduce((acc, item) => {
      return acc + (item.quantity * item.price);
    }, 0) || 0;
  };

  const getUserName = (userId: string): string => {
    return userMap.get(userId) || "Unknown User";
  };

  const getStatusClass = (status: string): string => {
    return status;
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="order-management-container">
      <header className="header-section">
        <div className="title_section">
          <h2 className="page-title">Order Management</h2>
          <h3>You can find all of your orders</h3>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary" 
            onClick={() => setShowModal(true)}
          >
            Create Order
          </button>
          {selectMode && selectedOrders.length > 0 && (
            <button className="btn-danger" onClick={handleDeleteSelected}>
              Cancel Selected ({selectedOrders.length})
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={fetchAllData} className="retry-btn">Retry</button>
        </div>
      )}

      <section className="order-overview">
        <div className="overview-card total">
          <h3>Total Orders</h3>
          <p className="quantity">{stats.total}</p>
          <p>Total orders</p>
        </div>
        <div className="overview-card pending">
          <h3>Pending</h3>
          <p className="quantity">{stats.pending}</p>
          <p>Pending orders</p>
        </div>
        <div className="overview-card confirmed">
          <h3>Confirmed</h3>
          <p className="quantity">{stats.confirmed}</p>
          <p>Confirmed orders</p>
        </div>
        <div className="overview-card shipped">
          <h3>Shipped</h3>
          <p className="quantity">{stats.shipped}</p>
          <p>Shipped orders</p>
        </div>
        <div className="overview-card delivered">
          <h3>Delivered</h3>
          <p className="quantity">{stats.delivered}</p>
          <p>Delivered orders</p>
        </div>
        <div className="overview-card cancelled">
          <h3>Cancelled</h3>
          <p className="quantity">{stats.cancelled}</p>
          <p>Cancelled orders</p>
        </div>
      </section>

      <section className="order-list-section">
        <div className="list-header">
          <input
            type="text"
            placeholder="Search orders..."
            className="search-input"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
          <div className="filter-panel-order">
            <select 
              className="filter-select" 
              name="status" 
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              {Object.values(OrderStatus).map(status => (
                <option key={status} value={status}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <select 
              className="filter-select" 
              name="sortBy" 
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="">Sort by</option>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="AmountHigh">Amount: High → Low</option>
              <option value="AmountLow">Amount: Low → High</option>
            </select>
            <div className="action-buttons">
              <button 
                className="select-btn" 
                onClick={() => setSelectMode(!selectMode)}
              >
                {selectMode ? "Cancel Select" : "Select"}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="no-orders">
            {orders.length === 0 
              ? "No orders found. Create your first order!" 
              : "No orders match your filters. Try adjusting your search."}
          </div>
        ) : (
          <>
            <table className="order-table">
              <thead>
                <tr>
                  {selectMode && (
                    <th style={{ width: '50px' }}>
                      <input 
                        type="checkbox" 
                        checked={paginatedOrders.length > 0 && 
                                selectedOrders.length === paginatedOrders.length}
                        onChange={handleSelectAll}
                      />
                    </th>
                  )}
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const orderId = getOrderId(order);
                  const totalAmount = calculateOrderTotal(order);
                  const userName = getUserName(order.userId as string);
                  
                  return (
                    <tr key={orderId}>
                      {selectMode && (
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedOrders.includes(orderId)}
                            onChange={() => handleOrderSelect(orderId)}
                          />
                        </td>
                      )}
                      <td className="order-id-cell">
                        <span className="order-id">{orderId?.substring(0, 8)}...</span>
                      </td>
                      <td className="user-cell">
                        <span className="user-name">{userName}</span>
                      </td>
                      <td className="date-cell">
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </td>
                      <td className="status-cell">
                        <select 
                          value={order.status} 
                          onChange={(e) => updateOrderStatus(orderId, e.target.value as OrderStatus)}
                          className={`status-select ${getStatusClass(order.status)}`}
                        >
                          {Object.values(OrderStatus).map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0) + status.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="total-cell">
                        <span className="order-total">{formatCurrency(totalAmount)}</span>
                      </td>
                      <td className="items-cell">
                        <span className="items-count">{order.items?.length || 0} items</span>
                      </td>
                      <td className="actions-cell">
                        <button className="btn-link view-btn">View</button>
                        <button 
                          className="btn-link danger-btn" 
                          onClick={() => handleDeleteOrder(orderId)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pagination-section">
              <button 
                className="pagination-btn prev-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages} • Showing {paginatedOrders.length} of {filteredOrders.length} orders
              </span>
              <button 
                className="pagination-btn next-btn" 
                disabled={currentPage === totalPages || filteredOrders.length === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </button>
            </div>
          </>
        )}
      </section>

      {/* Create Order Modal */}
      {showModal && (
        <CreateOrderModal
          closeModal={() => setShowModal(false)}
          setOrders={(newOrders: Order[] | ((prev: Order[]) => Order[])) => {
            if (typeof newOrders === 'function') {
              setOrders(newOrders);
            } else {
              setOrders(prev => [...prev, ...newOrders]);
            }
          }}
          products={products}
          userId={user?._id || ''}
        />
      )}
    </div>
  );
};

export default OrderManagement;