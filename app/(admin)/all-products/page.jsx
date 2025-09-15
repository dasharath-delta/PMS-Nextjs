'use client';

import { useEffect, useState } from 'react';
import { useProductStore } from '@/store/useProductStore';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

const ProductsPage = () => {
    const { products, isLoading, error, fetchProducts, editProduct } = useProductStore();
    const [editingId, setEditingId] = useState(null);
    const [editedProduct, setEditedProduct] = useState({});

    useEffect(() => {
        fetchProducts().catch((err) => toast.error(err.message || 'Failed to fetch products'));
    }, [fetchProducts]);

    const handleEdit = (product) => {
        setEditingId(product.id);
        setEditedProduct({ ...product });
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditedProduct({});
    };

    const handleSave = async () => {
        try {
            await editProduct(editingId, editedProduct);
            toast.success('Product updated successfully');
            setEditingId(null);
        } catch (err) {
            toast.error(err.message || 'Failed to update product');
        }
    };

    return (
        <main className="min-h-screen p-4 sm:p-6 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
                Products Management
            </h1>

            {isLoading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Image</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products.map((product,i) => (
                                <TableRow key={product.id}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>
                                        {product.imageUrl && (
                                            <img
                                                src={product.imageUrl}
                                                alt={product.name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.id ? (
                                            <Input
                                                value={editedProduct.name}
                                                onChange={(e) =>
                                                    setEditedProduct({ ...editedProduct, name: e.target.value })
                                                }
                                            />
                                        ) : (
                                            product.name
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.id ? (
                                            <Input
                                                value={editedProduct.category}
                                                onChange={(e) =>
                                                    setEditedProduct({ ...editedProduct, category: e.target.value })
                                                }
                                            />
                                        ) : (
                                            product.category
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.id ? (
                                            <Input
                                                type="number"
                                                min="1"
                                                value={editedProduct.price}
                                                onChange={(e) =>
                                                    setEditedProduct({ ...editedProduct, price: Number(e.target.value) })
                                                }
                                            />
                                        ) : (
                                            `₹${product.price}`
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.id ? (
                                            <Input
                                                type="number"
                                                min="0"
                                                value={editedProduct.stock}
                                                onChange={(e) =>
                                                    setEditedProduct({ ...editedProduct, stock: Number(e.target.value) })
                                                }
                                            />
                                        ) : (
                                            product.stock
                                        )}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {editingId === product.id ? (
                                            <Input
                                                value={editedProduct.description}
                                                onChange={(e) =>
                                                    setEditedProduct({ ...editedProduct, description: e.target.value })
                                                }
                                            />
                                        ) : (
                                            product.description
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {editingId === product.id ? (
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={handleSave}>
                                                    Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={handleCancel}>
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button size="sm" onClick={() => handleEdit(product)}>
                                                Edit
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </main>
    );
};

export default ProductsPage;
