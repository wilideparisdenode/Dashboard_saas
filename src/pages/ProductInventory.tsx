// MainPage.tsx
import React, { useState, useEffect } from "react";
import AddProductModal from "../components/AddProductModal";
import EditProductModal from "../components/EditProductModal";
import { getAllProducts, deleteProducts, type Product } from "../api";
import "./Pmanagement.css"

export const ProductInventoryPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minStock: "",
    maxStock: ""
  });

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  async function fetchProducts() {
    try {
      setLoading(true);
      setError(null);
      const productsData = await getAllProducts();
      setProducts(productsData.data);
      setFilteredProducts(productsData.data);
    } catch (err: any) {
      console.error("Failed to load products:", err);
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  function applyFilters() {
    let filtered = [...products];

    if (filters.name) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter(product =>
        product.price >= parseFloat(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(product =>
        product.price <= parseFloat(filters.maxPrice)
      );
    }

    if (filters.minStock) {
      filtered = filtered.filter(product =>
        product.stock >= parseInt(filters.minStock)
      );
    }

    if (filters.maxStock) {
      filtered = filtered.filter(product =>
        product.stock <= parseInt(filters.maxStock)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }

  function handleFilterChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  }

  function clearFilters() {
    setFilters({
      name: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      minStock: "",
      maxStock: ""
    });
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProducts(id);
        fetchProducts();
        alert("Product deleted successfully");
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert("Failed to delete product");
      }
    }
  };

  function getStockStatus(stock: number) {
    if (stock === 0) return { text: "Out of Stock", className: "out-of-stock" };
    if (stock < 10) return { text: "Low Stock", className: "low-stock" };
    return { text: "In Stock", className: "in-stock" };
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="inventory-page">
      <header className="page-header">
        <h1>Product Inventory</h1>
        <div className="header-actions">
          <button className="refresh-btn" onClick={fetchProducts} disabled={loading}>
            {loading ? "Refreshing..." : "⟳ Refresh"}
          </button>
          <button onClick={() => setIsAddOpen(true)}>Add Product +</button>
        </div>
      </header>

      {error && (
        <div className="error-message">
          Error: {error}
          <button onClick={fetchProducts} className="retry-btn">Retry</button>
        </div>
      )}

      <div className="filter-panel">
        <h3>Search & Filter</h3>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Product name..."
                value={filters.name}
                onChange={handleFilterChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <input
                type="text"
                id="category"
                name="category"
                placeholder="Category..."
                value={filters.category}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minPrice">Min Price</label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min"
                value={filters.minPrice}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxPrice">Max Price</label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="minStock">Min Stock</label>
              <input
                type="number"
                id="minStock"
                name="minStock"
                placeholder="Min"
                value={filters.minStock}
                onChange={handleFilterChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="maxStock">Max Stock</label>
              <input
                type="number"
                id="maxStock"
                name="maxStock"
                placeholder="Max"
                value={filters.maxStock}
                onChange={handleFilterChange}
                min="0"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button type="button" onClick={clearFilters} className="clear-btn">
              Clear Filters
            </button>
            <span className="filter-count">
              Showing {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="no-products">
          No products found. {products.length === 0 ? "Try adding some products." : "Try adjusting your filters."}
        </div>
      ) : (
        <>
          <table className="product-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const status = getStockStatus(product.stock);
                return (
                  <tr key={product._id}>
                    <td>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="product-image" />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </td>
                    <td>
                      <div className="product-name">{product.name}</div>
                      <div className="product-desc">{product.description?.substring(0, 50)}...</div>
                    </td>
                    <td>
                      <span className="category-badge">{product.category}</span>
                    </td>
                    <td className="price-cell">
                      <span className="price">${product.price.toFixed(2)}</span>
                    </td>
                    <td>
                      <div className="stock-info">
                        <span className="stock-amount">{product.stock}</span>
                        <div className="stock-bar">
                          <div
                            className="stock-fill"
                            style={{
                              width: `${Math.min(100, (product.stock / 100) * 100)}%`,
                              backgroundColor: product.stock === 0 ? '#dc3545' : product.stock < 10 ? '#ffc107' : '#28a745'
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${status.className}`}>
                        {status.text}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(product)}
                          title="Edit"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(product._id|| "")}
                          title="Delete"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                        <button
                          className="view-btn"
                          title="View Details"
                          onClick={() => {/* Implement view functionality */}}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="pagination-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="pagination-btn"
              disabled={currentPage === totalPages || filteredProducts.length === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
            <div className="page-info">
              Page {currentPage} of {totalPages} • {filteredProducts.length} products
            </div>
          </div>
        </>
      )}

      {isAddOpen && (
        <AddProductModal
          closeModal={() => setIsAddOpen(false)}
          onProductAdded={fetchProducts}
        />
      )}
      {isEditOpen && editingProduct && (
        <EditProductModal
          closeModal={() => {
            setIsEditOpen(false);
            setEditingProduct(null);
          }}
          product={editingProduct}
          onProductUpdated={fetchProducts}
        />
      )}
    </div>
  );
};