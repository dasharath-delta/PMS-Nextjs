'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

const SingleProductPage = () => {
  const params = useParams();
  const { id } = params;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/products/${id}`);
      if (res.data.success) setProduct(res.data.data);
      else toast.error(res.data.message || 'Failed to fetch product');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProduct();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-gray-50 flex justify-center">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg flex flex-col md:flex-row gap-4 md:gap-6 p-4 sm:p-6">
        {/* Image */}
        {product.imageUrl && (
          <div className="flex-1 flex justify-center items-start">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full md:w-80 h-64 md:h-80 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">{product.name}</h1>
            <p className="text-sm sm:text-base text-gray-500 mb-4">{product.category}</p>
            <p className="text-sm sm:text-base mb-4">{product.description}</p>
            <div className="flex gap-4 mb-4">
              <p className="text-sm sm:text-base font-semibold">Stock: {product.stock}</p>
              <p className="text-sm sm:text-base font-semibold text-green-600">₹{product.price}</p>
            </div>
          </div>

          <Button className="w-full md:w-auto">Add to Cart</Button>
        </div>
      </div>
    </main>
  );
};

export default SingleProductPage;
