import React, { useState } from "react";
import type { Order, OrderItem, Product, Address } from "../api";
import { createOrer } from "../api";
import { OrderStatus } from "../api";
import "./componentStyle.css";

interface CreateOrderModalProps {
  closeModal: () => void;
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  products: Product[];
  userId: string;
}

export const PaymentMethod = {
  CREDIT_CARD: "credit_card",
  DEBIT_CARD: "debit_card",
  PAYPAL: "paypal",
  BANK_TRANSFER: "bank_transfer",
  CASH_ON_DELIVERY: "cash_on_delivery",
} as const;

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ 
  closeModal, 
  setOrders,
  products,
  userId
}) => {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [shippingAddress, setShippingAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddItem = () => {
    setItems([...items, { productId: "", quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updated = [...items];
    
    if (field === "productId") {
      const product = products.find(p => p._id === value);
      updated[index].productId = value as string;
      updated[index].price = product ? product.price : 0;
      updated[index].quantity = 1;
    } else if (field === "quantity") {
      const numValue = Number(value);
      const productId = updated[index].productId;
      const product = products.find(p => p._id === productId);
      
      if (product && numValue > product.stock) {
        setError(`Cannot order ${numValue} units. Only ${product.stock} available.`);
        return;
      }
      
      if (numValue < 1) {
        setError("Quantity must be at least 1");
        return;
      }
      
      updated[index].quantity = numValue;
    }
    
    setItems(updated);
    setError("");
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingAddress({ ...shippingAddress, [field]: value });
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

 type PaymentMethod =
  typeof PaymentMethod[keyof typeof PaymentMethod];
  const getPaymentMethodLabel = (method: PaymentMethod) => {
    const labels = {
      [PaymentMethod.CREDIT_CARD]: "Credit Card",
      [PaymentMethod.DEBIT_CARD]: "Debit Card",
      [PaymentMethod.PAYPAL]: "PayPal",
      [PaymentMethod.BANK_TRANSFER]: "Bank Transfer",
      [PaymentMethod.CASH_ON_DELIVERY]: "Cash on Delivery",
    };
    return labels[method];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (items.length === 0) {
      setError("Please add at least one item");
      return;
    }
    
    if (items.some(item => !item.productId)) {
      setError("Please select a product for all items");
      return;
    }
    
    for (const item of items) {
      const product = products.find(p => p._id === item.productId);
      if (product && item.quantity > product.stock) {
        setError(`Product "${product.name}" has only ${product.stock} units available`);
        return;
      }
    }
    
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode || !shippingAddress.country) {
      setError("Please fill in all required address fields");
      return;
    }

    const newOrder: Order = {
      userId: userId,
      items: items,
      totalAmount: calculateTotal(),
      status: OrderStatus.PENDING,
      shippingAddress: shippingAddress,
      method: paymentMethod,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      setLoading(true);
      const createdOrder = await createOrer(newOrder);
      setOrders((prev) => [...prev, createdOrder]);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-parent">
      <div className="darklayout" onClick={closeModal}></div>
      <div className="modal">
        <h2>Create New Order</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Order Items</h3>
            {items.map((item, index) => {
              const product = products.find(p => p._id === item.productId);
              const availableStock = product ? product.stock : 0;
              
              return (
                <div key={index} className="product-row">
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map((product) => (
                      <option 
                        key={product._id} 
                        value={product._id}
                        disabled={product.stock <= 0}
                        className={product.stock <= 0 ? "out-of-stock" : ""}
                      >
                        {product.name} - ${product.price} 
                        {product.stock <= 0 ? " (Out of Stock)" : ` (Stock: ${product.stock})`}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="number"
                    min="1"
                    max={availableStock}
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    required
                    disabled={!item.productId}
                  />
                  
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={item.price}
                    readOnly
                    className="price-input"
                  />
                  
                  <button 
                    type="button" 
                    onClick={() => handleRemoveItem(index)}
                    className="remove-btn"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
            
            <button type="button" onClick={handleAddItem} className="add-btn">
              + Add Item
            </button>
          </div>

          <div className="form-section">
            <h3>Payment Method</h3>
            <div className="payment-methods">
              {Object.values(PaymentMethod).map((method) => (
                <label key={method} className={`payment-option ${paymentMethod === method ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  />
                  <span>{getPaymentMethodLabel(method)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h3>Shipping Address</h3>
            
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                placeholder="Enter street address"
                value={shippingAddress.street}
                onChange={(e) => handleAddressChange("street", e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={shippingAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State/Province</label>
                <input
                  type="text"
                  placeholder="Enter state/province"
                  value={shippingAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Zip/Postal Code *</label>
                <input
                  type="text"
                  placeholder="Enter zip code"
                  value={shippingAddress.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  placeholder="Enter country"
                  value={shippingAddress.country}
                  onChange={(e) => handleAddressChange("country", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items:</span>
              <span>{items.length}</span>
            </div>
            <div className="summary-row">
              <span>Payment Method:</span>
              <span>{getPaymentMethodLabel(paymentMethod)}</span>
            </div>
            <div className="total-row">
              <span>Total Amount:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? (
                <span className="loading">
                  <span className="spinner"></span>
                  Creating...
                </span>
              ) : "Create Order"}
            </button>
            <button type="button" onClick={closeModal} disabled={loading} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderModal;