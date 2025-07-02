'use client';

import Image from "next/image";
import { useState, useEffect } from 'react';

interface Product {
  _id: string;
  title: string;
  description: string;
  drawing: string;
  approved: boolean;
  contractAddress: string;
  createdAt: string;
}

type FilterType = 'recent' | 'pending' | 'approved';

export default function Home() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [feesEarned, setFeesEarned] = useState('0');
  const [feesDistributed, setFeesDistributed] = useState('0');
  const [distributionWallet, setDistributionWallet] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchFees();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [allProducts, filter]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        setAllProducts(data.products);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFees = async () => {
    try {
      const response = await fetch('/api/fees');
      const data = await response.json();

      if (data.success) {
        setFeesEarned(data.feesEarned);
        setFeesDistributed(data.feesDistributed);
        setDistributionWallet(data.distributionWallet);
      }
    } catch (err) {
      console.error('Error loading fees:', err);
    }
  };

  const filterProducts = () => {
    let filtered = [...allProducts];
    
    switch (filter) {
      case 'recent':
        // Show all products sorted by most recent
        filtered = allProducts;
        break;
      case 'pending':
        filtered = allProducts.filter(product => !product.approved);
        break;
      case 'approved':
        filtered = allProducts.filter(product => product.approved);
        break;
      default:
        filtered = allProducts;
        break;
    }
    
    // Sort by creation date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getFilterLabel = (filterType: FilterType) => {
    switch (filterType) {
      case 'recent': return 'Recent';
      case 'pending': return 'Pending';
      case 'approved': return 'Approved';
      default: return 'Recent';
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setVerifying(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch('/api/shareholders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setWalletAddress('');
        setTimeout(() => {
          setShowVerifyModal(false);
          setMessage('');
        }, 2000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to verify wallet. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen flex flex-col items-center px-4 py-8">
      {/* Company Title */}
      <h1 className="text-4xl font-bold text-white mb-6 text-center">
        Company
      </h1>

      {/* Fee Distribution Section - Horizontal Layout */}
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] rounded-xl p-4 mb-6 max-w-4xl w-full shadow-xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Title and Description */}
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-white font-bold text-lg">Fee Distribution</h3>
            </div>
            <p className="text-gray-400 text-xs">Live ecosystem revenue sharing</p>
          </div>
          
          {/* Wallet */}
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Distribution Wallet</p>
            <p className="text-white font-mono text-xs">
              {distributionWallet}
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <div className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-300 bg-clip-text text-transparent">${feesEarned}</div>
              <div className="text-gray-400 text-xs font-medium">Fees Earned</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-300 bg-clip-text text-transparent">${feesDistributed}</div>
              <div className="text-gray-400 text-xs font-medium">Fees Distributed</div>
            </div>
          </div>
        </div>
      </div>

      {/* Flywheel Image */}
      <div className="relative mb-6">
        <Image
          src="/Create Fantasy Products.png"
          alt="Company Flywheel - Create Fantasy Products"
          width={400}
          height={400}
          className="max-w-full h-auto"
          priority
        />
      </div>

      {/* Navigation Cards - Removed Products Card */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {/* Create Card */}
        <a
          href="/create"
          className="group bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-xl p-4 transition-all duration-200 cursor-pointer min-w-[120px] text-center"
        >
          <div className="mb-2">
            <svg className="w-6 h-6 mx-auto text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-sm mb-1">Create</h3>
          <p className="text-gray-400 text-xs">Design products</p>
        </a>

        {/* Shareholders Card */}
        <a
          href="/shareholders"
          className="group bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-xl p-4 transition-all duration-200 cursor-pointer min-w-[120px] text-center"
        >
          <div className="mb-2">
            <svg className="w-6 h-6 mx-auto text-purple-400 group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-sm mb-1">Shareholders</h3>
          <p className="text-gray-400 text-xs">Leaderboard</p>
        </a>

        {/* Verify Card */}
        <button
          onClick={() => setShowVerifyModal(true)}
          className="group bg-[#1a1a1a] hover:bg-[#222] border border-[#333] hover:border-[#555] rounded-xl p-4 transition-all duration-200 cursor-pointer min-w-[120px] text-center"
        >
          <div className="mb-2">
            <svg className="w-6 h-6 mx-auto text-green-400 group-hover:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-white font-bold text-sm mb-1">Verify</h3>
          <p className="text-gray-400 text-xs">Shareholder</p>
        </button>
      </div>

      {/* Products Section */}
      <div className="w-full max-w-6xl">
        {/* Products Title */}
        <h2 className="text-2xl font-bold text-white mb-4">Products</h2>
        
        {/* Header with Filters and Pagination */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-8">
            {(['recent', 'pending', 'approved'] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`pb-2 text-sm font-medium transition-all cursor-pointer relative ${
                  filter === filterType
                    ? 'text-orange-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {getFilterLabel(filterType)}
                {filter === filterType && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>
                )}
              </button>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="p-2 text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <span className="text-white text-sm px-2 font-medium">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="p-2 text-white hover:text-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Products Grid Container with Fixed Height */}
        <div className="min-h-[600px] flex flex-col">
          {loading ? (
            <div className="text-center text-gray-300 py-8 flex-1 flex items-center justify-center">
              <p>Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center text-gray-300 py-8 flex-1 flex flex-col items-center justify-center">
              <p className="mb-4">
                {filter === 'recent' 
                  ? 'No products created yet.' 
                  : `No ${filter} products found.`
                }
              </p>
              {filter === 'recent' && (
                <a
                  href="/create"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Create First Product
                </a>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {currentProducts.map((product) => (
                  <a
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="bg-[#1a1a1a] rounded-lg border border-[#333] hover:border-[#555] transition-all duration-200 overflow-hidden cursor-pointer block"
                  >
                    {/* Product Drawing */}
                    <div className="bg-white p-3">
                      <img
                        src={product.drawing}
                        alt={product.title}
                        className="w-full h-24 object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-3">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white font-bold text-sm flex-1 mr-2">
                          {product.title}
                        </h3>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                            product.approved
                              ? 'bg-green-600 text-white'
                              : 'bg-yellow-600 text-white'
                          }`}
                        >
                          {product.approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          {new Date(product.createdAt).toLocaleDateString()} • {new Date(product.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        
                        {product.approved && product.contractAddress && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://letsbonk.fun/token/${product.contractAddress}`, '_blank');
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Trade
                          </button>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Results Summary */}
              <div className="text-center text-gray-400 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} {getFilterLabel(filter).toLowerCase()}
              </div>
            </>
          )}
        </div>

        {/* Verification Modal */}
        {showVerifyModal && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowVerifyModal(false);
                setWalletAddress('');
                setMessage('');
                setError('');
              }
            }}
          >
            <div className="bg-[#1a1a1a] rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Verify Shareholding</h2>
                <button
                  onClick={() => {
                    setShowVerifyModal(false);
                    setWalletAddress('');
                    setMessage('');
                    setError('');
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <p className="text-gray-400 text-sm mb-4">
                Enter your Solana wallet address to verify your $Company token holdings.
              </p>
              
              <form onSubmit={handleVerification} className="space-y-4">
                <input
                  type="text"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f0f0f] text-white placeholder-gray-400 focus:outline-none rounded-lg transition-colors"
                  placeholder="Enter Solana wallet address"
                  disabled={verifying}
                  required
                />
                
                {message && (
                  <div className="text-green-400 text-sm">{message}</div>
                )}
                
                {error && (
                  <div className="text-red-400 text-sm">{error}</div>
                )}
                
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-bold transition-all cursor-pointer backdrop-blur-sm disabled:bg-gray-600/50 disabled:cursor-not-allowed"
                >
                  {verifying ? 'Verifying...' : 'Verify Shareholding'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
