// MainPage.tsx
import React, { useState } from "react";
import  AddProductModal  from "../components/AddProductModal";
import  EditProductModal  from "../components/EditProductModal";
import { products as p } from "./mockData";
import type { Product } from "../assets/types";
import "./Pmanagement.css"

export const ProductInventoryPage: React.FC = () => {
const [products, setProducts] = useState<Product[]>(p);

const [isAddOpen, setIsAddOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [editingProduct, setEditingProduct] = useState<Product | null>(null);

const handleEdit = (product: Product) => {
setEditingProduct(product);
setIsEditOpen(true);
};

const handleDelete = (id: number) => {
setProducts(products.filter((p) => p.id !== id));
};

return ( <div className="inventory-page"> <header className="page-header"> <h1>Product Inventory</h1>
<button onClick={() => setIsAddOpen(true)}>Add Product +</button> </header>
<div className="filter-panel">
    <h3>search by:</h3>
<form action="">
    <div className="form-group">
        <label htmlFor="name">name</label>
        <input type="text" name="" id="name" placeholder="name.." />
    </div>
      <div className="form-group">
        <label htmlFor="category">category</label>
        <input type="text" name="" id="category" placeholder="category..." />
    </div>
      <div className="form-group">
        <label htmlFor="quantity">quantity</label>
        <input type="text" name="" id="quantity" placeholder="quantity..." />
    </div>
      <div className="form-group">
        <label htmlFor="price">price</label>
        <input type="text" name="" id="price" placeholder="price" />
    </div>
      <div className="form-group">
        <label htmlFor="page" >page</label>
        <input type="text" name="" id="page"  placeholder="page..."/>
    </div>
</form>
</div>

  <table className="product-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Category</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => (
        <tr key={product.id}>
          <td>{product.name}</td>
          <td>{product.category}</td>
          <td>${product.price}</td>
          <td>{product.quantity}</td>
          <td>{product.inStock}</td>
          <td>
            <button className="edit" onClick={() => handleEdit(product)}>Edit <i className="bi bi-pencil"></i>

</button>
            <button className="del" onClick={() => handleDelete(product.id)}>Delete <i className="bi bi-trash"></i></button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {isAddOpen && <AddProductModal closeModal={() => setIsAddOpen(false)} setProducts={setProducts} />}
  {isEditOpen && editingProduct && (
    <EditProductModal closeModal={() => setIsEditOpen(false)} product={editingProduct} setProducts={setProducts} />
  )}
</div>


);
};
