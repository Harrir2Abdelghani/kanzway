"use client";
import { useEffect, useState } from "react";
import productsData from "./data/products.json";
import Modal from "./components/Modal";
import { calculateDiscount } from "./utils/calculateDiscount";
import { motion } from "framer-motion";
import { FiShoppingCart } from "react-icons/fi";
import "./globals.css";

export default function Products() {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem("products");
    return savedProducts ? JSON.parse(savedProducts) : productsData;
  });

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [animateCart, setAnimateCart] = useState(false);

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId, quantity) => {
    const product = products.find((item) => item.id === productId);
    if (product && quantity <= product.stock) {
      const updatedProducts = products.map((item) =>
        item.id === productId ? { ...item, stock: item.stock - quantity } : item
      );
      setProducts(updatedProducts);

      setCart((prevCart) => [
        ...prevCart,
        { ...product, quantity, animationKey: Math.random() },
      ]);

      setAnimateCart(true);
      setTimeout(() => setAnimateCart(false), 1000);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const { discount, finalTotal } = calculateDiscount(total);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "in-stock" && product.stock > 0) ||
      (filter === "out-of-stock" && product.stock === 0);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-teal-100 mx-auto p-8 rounded-lg shadow-xl max-w-7xl">
      <h1 className="text-3xl mt-4 font-extrabold mb-8 text-center text-black tracking-wide">
        KanzWay Products
      </h1>

      {/* Search and Filter */}
      <div className="mb-6 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3 p-2 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="all">All</option>
          <option value="in-stock">In Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            className="bg-gray-100 border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="font-bold text-xl text-black mb-2">{product.name}</h2>
            <div className="relative w-full h-60 mb-4 rounded-2xl overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
              {product.stock === 0 && (
                <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold">
                  Out of Stock
                </div>
              )}
            </div>
            <p
              className={`text-sm font-medium mt-2 ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
            </p>

            <div className="mt-4 flex items-center space-x-2 w-full">
              <input
                type="number"
                min="1"
                max={product.stock}
                defaultValue="1"
                className="border rounded p-2 w-20 text-center focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                id={`quantity-${product.id}`}
              />
              <button
                onClick={() =>
                  addToCart(
                    product.id,
                    parseInt(document.getElementById(`quantity-${product.id}`).value)
                  )
                }
                disabled={product.stock === 0}
                className={`flex-1 py-2 rounded-xl text-white bg-blue-600 transition-all ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-500 hover:bg-teal-600"
                }`}
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="fixed top-1 right-10"
        animate={{ scale: animateCart ? 1.2 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.button
          onClick={openModal}
          className="p-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-teal-700 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <FiShoppingCart size={24} />
        </motion.button>

      </motion.div>
      {isModalOpen && (
        <Modal
          cart={cart}
          total={total}
          discount={discount}
          finalTotal={finalTotal}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
