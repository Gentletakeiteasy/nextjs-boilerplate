'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft, Settings, ShoppingCart, Star } from 'lucide-react';

export default function AdminPanel() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ site_title: 'Digital Services Store', whatsapp_number: '+2348020674070' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    quantity: '',
    price_per_quantity: '',
    description: '',
    verified: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, settingsRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings')
      ]);

      if (!productsRes.ok || !settingsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const productsData = await productsRes.json();
      const settingsData = await settingsRes.json();

      setProducts(productsData);
      setSettings(settingsData);
    } catch (err) {
      console.error(err);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async () => {
    try {
      const method = editingProduct ? 'PUT' : 'POST';
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          quantity: parseInt(formData.quantity),
          price_per_quantity: parseFloat(formData.price_per_quantity)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      await fetchData();
      setEditingProduct(null);
      setIsAddingProduct(false);
      setFormData({ title: '', category: '', quantity: '', price_per_quantity: '', description: '', verified: true });
    } catch (err) {
      console.error(err);
      setError('Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      category: product.category,
      quantity: product.quantity.toString(),
      price_per_quantity: product.price_per_quantity.toString(),
      description: product.description,
      verified: product.verified
    });
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save settings');
    }
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
            onClick={() => {
              setError(null);
              fetchData();
            }} 
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
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-2 text-white hover:text-red-300 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Site</span>
              </a>
              <div className="w-px h-6 bg-white/20"></div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-1 mb-8 inline-flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'products'
                ? 'bg-white text-black'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <ShoppingCart className="w-4 h-4 inline mr-2" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-md font-medium transition-colors ${
              activeTab === 'settings'
                ? 'bg-white text-black'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-2" />
            Settings
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Products</h2>
              <button
                onClick={() => {
                  setIsAddingProduct(true);
                  setFormData({ title: '', category: '', quantity: '', price_per_quantity: '', description: '', verified: true });
                }}
                className="px-4 py-2 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-blue-600 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Product Form */}
            {(editingProduct || isAddingProduct) && (
              <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setIsAddingProduct(false);
                      setFormData({ title: '', category: '', quantity: '', price_per_quantity: '', description: '', verified: true });
                    }}
                    className="text-white hover:text-red-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                      placeholder="Product title"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                      placeholder="Product category"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Quantity</label>
                    <input
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                      placeholder="Available quantity"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">Price (₦)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price_per_quantity}
                      onChange={(e) => setFormData({ ...formData, price_per_quantity: e.target.value })}
                      className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                      placeholder="Price per quantity"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-white/80 text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                    placeholder="Product description"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.verified}
                      onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      className="rounded"
                    />
                    <span>Verified Product</span>
                  </label>

                  <button
                    onClick={handleSaveProduct}
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="text-lg font-bold text-white">{product.title}</h4>
                        {product.verified && (
                          <Star className="w-4 h-4 text-green-400 fill-green-400" />
                        )}
                      </div>
                      <p className="text-sm text-white/70 mb-2">{product.category}</p>
                      <div className="flex items-center space-x-4 text-sm text-white/60">
                        <span>Qty: {product.quantity}</span>
                        <span className="text-lg font-bold text-red-300">
                          ₦{Number(product.price_per_quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mb-4 leading-relaxed line-clamp-3">
                    {product.description}
                  </p>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="px-3 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center text-white/70 py-12">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">No products yet</p>
                <p>Click "Add Product" to create your first product</p>
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Site Settings</h2>
            
            <div className="bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Site Title</label>
                  <input
                    type="text"
                    value={settings.site_title}
                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                    placeholder="Your site title"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-red-400"
                    placeholder="+2348020674070"
                  />
                  <p className="text-white/50 text-sm mt-1">Include country code (e.g., +234)</p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSaveSettings}
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
