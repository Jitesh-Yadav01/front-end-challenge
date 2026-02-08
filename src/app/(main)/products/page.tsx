'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Plus, Pencil, Trash2, Search, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import { useUser } from '@/hooks/useUser';
import { gql } from '@apollo/client';
import { useQuery, useMutation } from '@apollo/client/react';

const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      category
      price
      price
      quantity
      status
      lastUpdated
    }
  }
`;

const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $category: String!, $price: Float!, $quantity: Int!, $status: String!) {
    addProduct(name: $name, category: $category, price: $price, quantity: $quantity, status: $status) {
      id
      name
      category
      price
      quantity
      status
      lastUpdated
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export default function ProductsPage() {
  const { user } = useUser();
  const { data, loading, error, refetch } = useQuery<{ products: Product[] }>(GET_PRODUCTS);
  const [addProduct] = useMutation(ADD_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  
  const [formData, setFormData] = useState<Partial<Product>>({});

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setCurrentProduct(product);
      setFormData(product);
    } else {
      setCurrentProduct(null);
      setFormData({
        name: '',
        category: '',
        price: 0,
        quantity: 0,
        status: 'In Stock',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (currentProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === currentProduct.id ? { ...p, ...formData } as Product : p))
      );
    } else {
      try {
        await addProduct({
          variables: {
            name: formData.name,
            category: formData.category,
            price: Number(formData.price),
            quantity: Number(formData.quantity),
            status: formData.status,
          },
        });
        refetch();
      } catch (error) {
      }
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({
          variables: { id },
        });
        refetch();
      } catch (error) {
      }
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Products
          </h1>
          <p className="text-muted-foreground mt-1">Manage your inventory and stock</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 bg-card/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="shrink-0">
            <Filter className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300">
            <CardHeader className="p-4 bg-muted/20 border-b border-border/50">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="font-semibold leading-none tracking-tight">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className={clsx(
                  "px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider border",
                  product.status === 'In Stock' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  product.status === 'Low Stock' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  "bg-rose-500/10 text-rose-500 border-rose-500/20"
                )}>
                  {product.status}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-4">
              <div className="flex justify-between items-end">
                <div>
                   <p className="text-sm text-muted-foreground">Price</p>
                   <div className="text-2xl font-bold">${product.price}</div>
                </div>
                <div className="text-right">
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <div className="text-lg font-medium">{product.quantity}</div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => handleOpenModal(product)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                {user.role !== 'store_keeper' && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(product.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentProduct ? 'Edit Product' : 'Add Product'}
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{currentProduct ? 'Save Changes' : 'Create Product'}</Button>
          </>
        }
      >
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Product name"
            />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Category</label>
            <Input
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Category"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="grid gap-2">
                <label className="text-sm font-medium">Price ($)</label>
                <Input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
             </div>
             <div className="grid gap-2">
                <label className="text-sm font-medium">Quantity</label>
                <Input
                type="number"
                value={formData.quantity || 0}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                />
             </div>
          </div>
           <div className="grid gap-2">
             <label className="text-sm font-medium">Status</label>
             <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.status || 'In Stock'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
             >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
             </select>
           </div>
        </div>
      </Modal>
    </div>
  );
}
