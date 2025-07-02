'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface Product {
  _id: string;
  title: string;
  description: string;
  drawing: string;
  approved: boolean;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string);
    }
  }, [params.id]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();

      if (data.success) {
        const foundProduct = data.products.find((p: Product) => p._id === id);
        if (foundProduct) {
          setProduct(foundProduct);
        } else {
          setError('Product not found');
        }
      } else {
        setError('Failed to fetch product');
      }
    } catch (err) {
      setError('Error loading product');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#121212] min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-300">
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="bg-[#121212] min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
            <p className="text-gray-300 mb-6">{error || 'The product you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-bold transition-all cursor-pointer backdrop-blur-sm border border-white/20 hover:border-white/30"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#121212] min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Product Detail Card */}
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#333] overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Drawing */}
            <div className="bg-white p-8 flex items-center justify-center">
              <img
                src={product.drawing}
                alt={product.title}
                className="max-w-full max-h-96 object-contain"
              />
            </div>

            {/* Product Information */}
            <div className="p-8">
              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    product.approved
                      ? 'bg-green-600 text-white'
                      : 'bg-yellow-600 text-white'
                  }`}
                >
                  {product.approved ? 'Approved' : 'Pending Approval'}
                </span>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl font-bold text-white mb-4">
                {product.title}
              </h1>

              {/* Product Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
                <p className="text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Creation Date */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-white mb-2">Created</h2>
                <p className="text-gray-300">
                  {new Date(product.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} at {new Date(product.createdAt).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>

              {/* Product ID */}
              <div className="border-t border-[#333] pt-4">
                <p className="text-xs text-gray-500">
                  Product ID: {product._id}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
