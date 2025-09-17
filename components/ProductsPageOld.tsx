"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Package,
  Loader2,
  Save,
  Eye,
  ImageIcon,
  X,
  Check,
  RefreshCw
} from 'lucide-react';
import { db, storage } from '@/lib/firebase';
import { ref as dbRef, onValue, push, serverTimestamp, set, update, remove, get } from "firebase/database";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ProductForm, ProductRecord } from '@/types/product';
import { categories as staticCategories } from '@/config/categories';

const initialState: ProductForm = {
  name: "",
  price: "",
  salePrice: "",
  category: "",
  subcategory: "",
  description: "",
  colors: [""],
  sizes: [""],
  imagesFiles: [],
  imagesUrls: [],
  slug: "",
  shortDescription: "",
  tags: [""],
  brand: "",
  sku: "",
  stock: "",
  seo: { metaTitle: "", metaDescription: "", canonicalUrl: "" },
};

const charCount = (text: string) => text.length;

const ProductsPage = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    category: '',
    subcategory: '',
    status: 'active',
    stock: 0,
    images: [],
    imageFiles: [],
    tags: []
  });

  const categories = [
    'Baby Gear',
    'Toys & Games', 
    'Clothing',
    'Feeding',
    'Bathing & Care',
    'Nursery',
    'Safety',
    'Books & Learning'
  ];

  // Load products from Firebase
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const productsRef = collection(db, 'products');
        const productsQuery = query(productsRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(productsQuery);
        
        const productsList: Product[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          productsList.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            price: data.price || 0,
            originalPrice: data.originalPrice || 0,
            category: data.category || '',
            subcategory: data.subcategory || '',
            status: data.status || 'active',
            stock: data.stock || 0,
            images: data.images || [],
            tags: data.tags || [],
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date()
          });
        });
        
        setProducts(productsList);
      } catch (error) {
        console.error('Error loading products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [toast]);

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      category: '',
      subcategory: '',
      status: 'active',
      stock: 0,
      images: [],
      imageFiles: [],
      tags: []
    });
    setEditingProduct(null);
  };

  // Add new product
  const handleAddProduct = async () => {
    if (!formData.name || !formData.category || formData.price <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      // Upload new images to Firebase Storage
      const uploadedImageUrls: string[] = [...formData.images];
      
      for (const file of formData.imageFiles) {
        const imagePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const imageRef = storageRef(storage, imagePath);
        await uploadBytes(imageRef, file);
        const downloadUrl = await getDownloadURL(imageRef);
        uploadedImageUrls.push(downloadUrl);
      }

      const docData = {
        ...formData,
        images: uploadedImageUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Remove imageFiles from the data being saved to Firestore
      const { imageFiles, ...firestoreData } = docData;
      
      const docRef = await addDoc(collection(db, 'products'), firestoreData);
      
      const newProduct: Product = {
        id: docRef.id,
        ...firestoreData
      };
      
      setProducts(prev => [newProduct, ...prev]);
      setIsAddDialogOpen(false);
      resetForm();
      
      toast({
        title: "Success",
        description: "Product added successfully"
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Edit product
  const handleEditProduct = async () => {
    if (!editingProduct) return;

    setSaving(true);
    try {
      // Upload new images to Firebase Storage
      const uploadedImageUrls: string[] = [...formData.images];
      
      for (const file of formData.imageFiles) {
        const imagePath = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const imageRef = storageRef(storage, imagePath);
        await uploadBytes(imageRef, file);
        const downloadUrl = await getDownloadURL(imageRef);
        uploadedImageUrls.push(downloadUrl);
      }

      const docData = {
        ...formData,
        images: uploadedImageUrls,
        updatedAt: new Date()
      };
      
      // Remove imageFiles from the data being saved to Firestore
      const { imageFiles, ...firestoreData } = docData;
      
      await updateDoc(doc(db, 'products', editingProduct.id), firestoreData);
      
      setProducts(prev => prev.map(product => 
        product.id === editingProduct.id 
          ? { ...product, ...firestoreData }
          : product
      ));
      
      setEditingProduct(null);
      resetForm();
      
      toast({
        title: "Success",
        description: "Product updated successfully"
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts(prev => prev.filter(product => product.id !== productId));
      
      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  // Start editing
  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      category: product.category,
      subcategory: product.subcategory || '',
      status: product.status,
      stock: product.stock,
      images: product.images,
      imageFiles: [],
      tags: product.tags
    });
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Stats calculations
  const stats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    outOfStock: products.filter(p => p.status === 'out-of-stock' || p.stock === 0).length
  };

  // Image upload handling
  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    
    const MAX_UPLOAD_BYTES = 200 * 1024; // 200KB
    const maxImages = 3;
    const currentImages = formData.images.length + formData.imageFiles.length;
    
    const newFiles: File[] = [];
    const oversized: string[] = [];
    
    for (let i = 0; i < files.length && newFiles.length + currentImages < maxImages; i++) {
      const file = files[i];
      if (file.size > MAX_UPLOAD_BYTES) {
        oversized.push(file.name);
      } else {
        newFiles.push(file);
      }
    }
    
    if (oversized.length > 0) {
      toast({
        title: "Files too large",
        description: `${oversized.join(", ")} exceed 200KB. Please compress and try again.`,
        variant: "destructive"
      });
    }
    
    if (newFiles.length > 0) {
      setFormData(prev => ({
        ...prev,
        imageFiles: [...prev.imageFiles, ...newFiles]
      }));
    }
  };

  // Remove image
  const removeImage = (type: 'url' | 'file', index: number) => {
    if (type === 'url') {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        imageFiles: prev.imageFiles.filter((_, i) => i !== index)
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your product catalog ({stats.total} products)
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setIsAddDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <ProductFormDialog />
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Products in catalog</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Products currently available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Products needing restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Manage your products, inventory, and pricing
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">
                {products.length === 0 ? 'No products yet' : 'No products match your search'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                {products.length === 0 
                  ? 'Get started by adding your first product to the catalog.'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
              {products.length === 0 && (
                <Button className="mt-6" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-muted rounded-md flex items-center justify-center">
                      {product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="h-full w-full object-cover rounded-md"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={product.status === 'active' ? 'default' : 
                                     product.status === 'out-of-stock' ? 'destructive' : 'secondary'}>
                          {product.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">${product.price}</span>
                    <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Product</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{product.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <ProductFormDialog isEditing />
        </Dialog>
      )}
    </div>
  );

  // Product Form Dialog Component
  function ProductFormDialog({ isEditing = false }: { isEditing?: boolean }) {
    return (
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update product details' : 'Add a new product to your catalog'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter product name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter product description"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="originalPrice">Original Price</Label>
              <Input
                id="originalPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive' | 'out-of-stock') => 
                  setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
              placeholder="0"
            />
          </div>
          
          {/* Image Upload Section */}
          <div className="grid gap-2">
            <Label>Product Images</Label>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                <div className="text-center">
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageFiles(e.target.files)}
                    className="hidden"
                    disabled={formData.images.length + formData.imageFiles.length >= 3}
                  />
                  <label
                    htmlFor="images"
                    className={`cursor-pointer flex flex-col items-center gap-2 ${
                      formData.images.length + formData.imageFiles.length >= 3
                        ? 'pointer-events-none opacity-50'
                        : 'hover:text-primary'
                    }`}
                  >
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-sm">Click to upload or drag and drop</span>
                    <span className="text-xs text-muted-foreground">
                      Max 3 images, 200KB each
                    </span>
                  </label>
                </div>
              </div>
              
              {/* Image Previews */}
              {(formData.images.length > 0 || formData.imageFiles.length > 0) && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {/* Existing URL Images */}
                  {formData.images.map((url, index) => (
                    <div key={`url-${index}`} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage('url', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* New File Images */}
                  {formData.imageFiles.map((file, index) => (
                    <div key={`file-${index}`} className="relative group">
                      <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`New ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={() => removeImage('file', index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                        New
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              if (isEditing) {
                setEditingProduct(null);
              } else {
                setIsAddDialogOpen(false);
              }
              resetForm();
            }}>
              Cancel
            </Button>
            <Button 
              onClick={isEditing ? handleEditProduct : handleAddProduct}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </DialogContent>
    );
  }
};

export default ProductsPage;