import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import styles from "@/styles/Home.module.css";
import ProductsRepo from "../controller/product-repo";
const repo = new ProductsRepo();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const updateProduct = async (updatedProduct) => {
  const response = await repo.updateProduct(updatedProduct);
  return response;
};

const deleteProduct = async (product_id) => {
  const response = await repo.deleteProduct(product_id);
  return response;
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_id: "",
    name: "",
    description: "",
    stock_quantity: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await repo.getProducts();
      const data = await response.data;
  
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products.");
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      product_id: product.product_id,
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
    });
  };

  const handleDeleteClick = async (product_id) => {
    try {
      await deleteProduct(product_id);
      setProducts(products.filter((product) => product.product_id !== product_id)); // Remove deleted product from the list
    } catch (err) {
      setError("Failed to delete product.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = await updateProduct(formData);
    setProducts(
      products.map((product) =>
        product.product_id === updatedProduct.product_id ? updatedProduct : product
      )
    );
    setEditingProduct(null); // Close the editing form
    fetchProducts(); // Refresh the product list
  };

  return (
    <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
      <main className={styles.main}>
        <h1>Product List</h1>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.stock_quantity}</td>
                <td>
                  <button onClick={() => handleEditClick(product)}>Update</button>
                  <button onClick={() => handleDeleteClick(product.product_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Render form for updating product */}
        {editingProduct && (
          <div>
            <h2>Update Product</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Product ID:
                <input
                  type="text"
                  name="product_id"
                  value={formData.product_id}
                  disabled // Disable the product ID field since it's not editable
                />
              </label>
              <br />
              <label>
                Name:
                <input type="text" name="name" value={formData.name} onChange={handleChange} />
              </label>
              <br />
              <label>
                Description:
                <input type="text" name="description" value={formData.description} onChange={handleChange} />
              </label>
              <br />
              <label>
                Price:
                <input type="number" name="price" value={formData.price} onChange={handleChange} />
              </label>
              <br />
              <label>
                Stock Quantity:
                <input type="number" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} />
              </label>
              <br />
              <button type="submit">Submit</button>
              <br />
              <button type="button" onClick={() => setEditingProduct(null)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
