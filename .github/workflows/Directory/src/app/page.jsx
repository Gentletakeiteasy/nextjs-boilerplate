"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Star, Settings } from "lucide-react";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({
    site_title: "Digital Services Store",
    whatsapp_number: "+2348020674070",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and settings
        const [productsRes, settingsRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/settings"),
        ]);

        if (!productsRes.ok) {
          throw new Error("Failed to fetch products");
        }
        if (!settingsRes.ok) {
          throw new Error("Failed to fetch settings");
        }

        const productsData = await productsRes.json();
        const settingsData = await settingsRes.json();

        setProducts(productsData);
        setSettings(settingsData);
      } catch (err) {
        console.error(err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBuyNow = (product) => {
    const message = `Hi! I'm interested in: ${product.title} - ${product.category} (${product.quantity} quantity at ₦${product.price_per_quantity})`;
    const whatsappUrl = `https://wa.me/${settings.whatsapp_number.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-purple-900 to-blue-900">
      {/* Navigation Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">
                {settings.site_title}
              </h1>
            </div>

            {/* Admin Link */}
            <a
              href="/admin"
              className="flex items-center space-x-1 text-white hover:text-red-300 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Premium Digital Services
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Get high-quality social media services, VPN access, and more at
            unbeatable prices
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() =>
                document
                  .getElementById("products")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-blue-600 transition-colors"
            >
              Browse Products
            </button>
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${settings.whatsapp_number.replace("+", "")}`,
                  "_blank",
                )
              }
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Our Services
          </h3>

          {products.length === 0 ? (
            <div className="text-center text-white/80">
              <p className="text-xl">No products available yet.</p>
              <a
                href="/admin"
                className="text-red-300 hover:text-red-400 underline mt-2 inline-block"
              >
                Add products in the admin panel
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/40 transition-colors"
                >
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-2">
                        {product.title}
                      </h4>
                      <p className="text-sm text-white/70 mb-2">
                        {product.category}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <span>Qty: {product.quantity}</span>
                        <span className="text-2xl font-bold text-red-300">
                          ₦{Number(product.price_per_quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    {product.verified && (
                      <div className="flex items-center space-x-1 bg-green-500/20 px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-green-400 fill-green-400" />
                        <span className="text-xs text-green-400">Verified</span>
                      </div>
                    )}
                  </div>

                  {/* Product Description */}
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Buy Now Button */}
                  <button
                    onClick={() => handleBuyNow(product)}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">
              {settings.site_title}
            </h1>
          </div>
          <p className="text-white/70 mb-6">
            Your trusted source for premium digital services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() =>
                window.open(
                  `https://wa.me/${settings.whatsapp_number.replace("+", "")}`,
                  "_blank",
                )
              }
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
            >
              Contact via WhatsApp
            </button>
            <a
              href="/admin"
              className="text-white/70 hover:text-white transition-colors"
            >
              Admin Panel
            </a>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-white/50 text-sm">
            <p>&copy; 2025 {settings.site_title}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
      }
