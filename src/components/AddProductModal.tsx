// AddProductModal.tsx
import React, { useState } from "react";
import type { Product } from "../assets/types";
import { div } from "framer-motion/client";
interface AddProductModalProps {
closeModal: () => void;
setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

 const AddProductModal: React.FC<AddProductModalProps> = ({ closeModal, setProducts }) => {
const [name, setName] = useState("");
const [category, setCategory] = useState("");
const [price, setPrice] = useState(0);
const [quantity, setQuantity] = useState(0);
const [inStock, setInStock] = useState(true);

const handleSubmit = () => {
setProducts((prev) => [
...prev,
{ id: Date.now(), name, category, price, quantity, inStock},
]);
closeModal();
};

return (
 <div className="modal-parent">
   <div className="darklayout"></div>
    <div className="modal">
    

     <h2>Add Product</h2>
<input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
<input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
<input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
<input type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} /> <button onClick={handleSubmit}>Add</button> <button onClick={closeModal}>Cancel</button> </div>
</div>

);
};export default AddProductModal;
