'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useProductStore } from '@/store/useProductStore';
import Link from 'next/link';

const ProductsPage = () => {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts().catch(err =>
      toast.error(err.message || 'Failed to fetch products')
    );
  }, [fetchProducts]);

  const handleSearch = e => {
    e.preventDefault();
    fetchProducts(search).catch(err =>
      toast.error(err.message || 'Failed to fetch products')
    );
  };

  return (
    <main className="min-h-screen p-4 sm:p-6 bg-gray-50">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-blue-600">
        Products
      </h1>

      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex justify-center mb-4 sm:mb-6 gap-2"
      >
        <Input
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-48 sm:w-64"
        />
        <Button type="submit" size="sm">
          Search
        </Button>
      </form>

      {/* Products List */}
      {isLoading ? (
        <p className="text-center text-sm sm:text-base">Loading...</p>
      ) : error ? (
        <p className="text-center text-red-500 text-sm sm:text-base">{error}</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500 text-sm sm:text-base">
          No products found
        </p>
      ) : (
        <ScrollArea className="h-[70vh]">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map(product => (
              <Card
                key={product.id}
                className="shadow-md hover:shadow-lg transition p-2 flex flex-col justify-between"
              >
                <CardHeader className="p-0 mb-1">
                  <CardTitle className="text-xs sm:text-sm font-medium leading-tight">
                    {product.name}
                  </CardTitle>
                  <p className="text-[10px] sm:text-xs text-gray-500">
                    {product.category}
                  </p>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 p-0">
                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-24 sm:h-28 object-cover rounded"
                    />
                  )}
                  <p className="text-[11px] sm:text-xs line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-[11px] sm:text-xs font-semibold">
                      Stock: {product.stock}
                    </p>
                    <p className="text-[11px] sm:text-xs font-semibold">
                      ₹{product.price}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="p-1 mt-1">
                  <Link href={`/products/${product.id}`} className="w-full">
                    <Button size="sm" className="w-full text-[11px] sm:text-xs">
                      View
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      )}
    </main>
  );
};

export default ProductsPage;
