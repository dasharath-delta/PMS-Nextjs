'use client';

import { useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const AddProductPage = () => {
  const { addProduct, isLoading } = useProductStore();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const categories = ['Clothing', 'Electronics', 'Books', 'Furniture', 'Other'];

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      const file = files[0];
      setFormData({ ...formData, image: file });
      if (file) setImagePreview(URL.createObjectURL(file));
      else setImagePreview(null);
    } else if (name === 'price' || name === 'stock') {
      // Ensure price/stock cannot be negative
      const numericValue = Math.max(0, Number(value));
      setFormData({ ...formData, [name]: numericValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addProduct(formData);
      toast.success('Product added successfully!');
      setFormData({
        name: '',
        category: '',
        description: '',
        price: '',
        stock: '',
        image: null,
      });
      setImagePreview(null);
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Add New Product
        </h1>

        {/* Instructions */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-gray-700">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Provide a clear and descriptive product name.</li>
            <li>Select the appropriate category for this product.</li>
            <li>Write a short description to highlight product features.</li>
            <li>Price and stock cannot be negative.</li>
            <li>You can upload a product image (optional).</li>
          </ul>
        </div>

        {/* Name */}
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          placeholder="Enter product name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={val => setFormData({ ...formData, category: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Description */}
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Enter product description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        {/* Price */}
        <Label htmlFor="price">Price ($) *</Label>
        <Input
          type="number"
          id="price"
          placeholder="Enter price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min={0}
          required
        />

        {/* Stock */}
        <Label htmlFor="stock">Stock *</Label>
        <Input
          type="number"
          id="stock"
          placeholder="Enter stock quantity"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          min={0}
          required
        />

        {/* Image */}
        <Label htmlFor="image">Product Image</Label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-2">
            <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
          </div>
        )}

        {/* Submit */}
        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Product'}
        </Button>
      </form>
    </main>
  );
};

export default AddProductPage;
