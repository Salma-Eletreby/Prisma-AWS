import React, { useState } from "react";
import ProductsRepo from "../controller/product-repo";
const repo = new ProductsRepo();

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name || !description || !price || !stockQuantity) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let newProduct = {
        name: name,
        description: description,
        price: parseFloat(price), // Ensure the price is a number
        stock_quantity: parseInt(stockQuantity, 10), // Ensure the stock quantity is an integer
      };

      const response = await repo.createProduct(newProduct);

      if (response.body.success) {
        alert("Product created successfully!");
      } else {
        alert("Error creating product: " + response.body);
      }
    } catch (err) {
      setError("An error occurred: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div>
          <label htmlFor="price">Price:</label>
          <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>

        <div>
          <label htmlFor="stock_quantity">Stock Quantity:</label>
          <input type="number" id="stock_quantity" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
        </div>

        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default App;
