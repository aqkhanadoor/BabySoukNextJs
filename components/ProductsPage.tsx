"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  X,
  Check,
  RefreshCw,
  ImageIcon,
  Eye,
  ArrowLeft,
  Save,
  AlertCircle,
  Info
} from 'lucide-react';
import { realtimeDb, storage } from '@/lib/firebase';
import { ref as dbRef, onValue, push, serverTimestamp, set, update, remove, get } from "firebase/database";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ProductForm, ProductRecord } from '@/types/product';
import { categories as staticCategories } from '@/config/categories';
import { generateSitemapXml } from '@/lib/sitemap';
import { autoRevalidateAfterProductChange, revalidateProducts, useRevalidation } from '@/lib/revalidation';

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
  const MAX_UPLOAD_BYTES = 200 * 1024; // 200 KB
  const [form, setForm] = useState<ProductForm>(initialState);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editKey, setEditKey] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<{ key: string; data: ProductRecord }>>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [slugEdited, setSlugEdited] = useState(false);
  const [slugEditMode, setSlugEditMode] = useState(false);
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);
  const { toast } = useToast();

  // ISR Revalidation hook
  const { revalidate: triggerRevalidation, isLoading: isRevalidating } = useRevalidation();

  // Update subcategory options when category changes
  useEffect(() => {
    const cat = staticCategories.find((c) => c.name === form.category);
    setSubcategories(cat ? cat.subcategories : []);
  }, [form.category]);

  const totalImages = useMemo(() => form.imagesFiles.length + form.imagesUrls.length, [form.imagesFiles.length, form.imagesUrls.length]);
  const canSubmit = useMemo(() => {
    return (
      form.name.trim() !== "" &&
      form.price.trim() !== "" &&
      form.category.trim() !== "" &&
      form.description.trim() !== "" &&
      charCount(form.description) <= 1000 &&
      totalImages >= 1 && totalImages <= 3
    );
  }, [form, totalImages]);

  const slugify = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  // Function to generate unique slug by checking existing slugs
  const generateUniqueSlug = useCallback((baseSlug: string) => {
    const existingSlugs = products.map(p => p.data.slug).filter(Boolean);

    // If editing, exclude current product's slug from check
    const filteredSlugs = editKey
      ? existingSlugs.filter((_, idx) => products[idx]?.key !== editKey)
      : existingSlugs;

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (filteredSlugs.includes(uniqueSlug)) {
      counter++;
      uniqueSlug = `${baseSlug}-${counter}`;
    }

    return uniqueSlug;
  }, [products, editKey]);

  // Auto-generate slug from name unless manually edited
  useEffect(() => {
    if (!slugEdited) {
      const baseSlug = slugify(form.name);
      if (baseSlug) {
        const uniqueSlug = generateUniqueSlug(baseSlug);
        setForm((prev) => ({ ...prev, slug: uniqueSlug }));
      }
    }
  }, [form.name, slugEdited, generateUniqueSlug]);

  const handleImageFiles = (files: FileList | null) => {
    if (!files) return;
    const valid: File[] = [];
    let skippedType = 0;
    const skippedSize: string[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        skippedType++;
        continue;
      }
      if (f.size > MAX_UPLOAD_BYTES) {
        skippedSize.push(f.name);
        continue;
      }
      valid.push(f);
    }
    if (skippedType > 0) {
      toast({
        title: "Some files were skipped",
        description: "Only image files are allowed.",
        variant: "destructive",
      });
    }
    if (skippedSize.length > 0) {
      toast({
        title: "File too large",
        description: `The following exceed 200 KB: ${skippedSize.slice(0, 5).join(", ")}${skippedSize.length > 5 ? "…" : ""}`,
        variant: "destructive",
      });
    }
    setForm((prev) => {
      const remaining = Math.max(0, 3 - (prev.imagesFiles.length + prev.imagesUrls.length));
      const toAdd = valid.slice(0, remaining);
      if (toAdd.length < valid.length) {
        toast({ title: "Image limit", description: "Maximum 3 images allowed.", variant: "destructive" });
      }
      return { ...prev, imagesFiles: [...prev.imagesFiles, ...toAdd] };
    });
  };

  const removeFileAt = (idx: number) => {
    setForm((prev) => ({ ...prev, imagesFiles: prev.imagesFiles.filter((_, i) => i !== idx) }));
  };

  const removeUrlAt = (idx: number) => {
    setForm((prev) => ({ ...prev, imagesUrls: prev.imagesUrls.filter((_, i) => i !== idx) }));
  };

  const setArrayValue = (key: "colors" | "sizes" | "tags", idx: number, value: string) => {
    setForm((prev) => {
      const next = [...prev[key]];
      next[idx] = value;
      return { ...prev, [key]: next } as ProductForm;
    });
  };

  const addArrayItem = (key: "colors" | "sizes" | "tags") => {
    setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] } as ProductForm));
  };

  const removeArrayItem = (key: "colors" | "sizes" | "tags", idx: number) => {
    setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) } as ProductForm));
  };

  // Sitemap regeneration function
  const regenerateSitemap = useCallback(async () => {
    if (regeneratingSitemap) return;
    setRegeneratingSitemap(true);

    try {
      const baseUrl = "https://babysouk.in";
      const staticPaths = [
        "/",
        "/categories",
        "/collections",
        "/products",
        "/contact",
        "/faq",
        "/shipping",
        "/returns",
        "/cancellation",
        "/terms",
        "/privacy"
      ];

      // Convert products to the format expected by sitemap generator
      const list = Object.entries(products).map(([key, product]) => ({
        category: product.data.category,
        slug: product.data.slug,
        name: product.data.name, // Fallback for slug generation if slug is missing
        updatedAt: product.data.updatedAt || product.data.createdAt,
        createdAt: product.data.createdAt
      }));

      console.log(`Generating sitemap for ${list.length} products:`, list.slice(0, 3));
      const xml = generateSitemapXml({ baseUrl, products: list, staticPaths });
      console.log(`Generated sitemap XML length: ${xml.length} characters`);

      // Log a sample of the generated URLs for debugging
      const urlMatches = xml.match(/<loc>(.*?)<\/loc>/g);
      if (urlMatches) {
        console.log(`Sample URLs in sitemap:`, urlMatches.slice(0, 5));
      }
      await set(dbRef(realtimeDb, "sitemap/latestXml"), { xml, updatedAt: serverTimestamp() });

      toast({
        title: "Sitemap updated",
        description: "Sitemap regenerated successfully. Available at /sitemap.xml"
      });
    } catch (e: any) {
      console.error("Sitemap regeneration failed:", e);
      toast({
        title: "Sitemap update failed",
        description: e?.message || "Unexpected error",
        variant: "destructive"
      });
    } finally {
      setRegeneratingSitemap(false);
    }
  }, [regeneratingSitemap, products, toast]);

  const onSubmit = async () => {
    // Basic validation
    if (!canSubmit) {
      toast({
        title: "Check required fields",
        description: !form.description.trim()
          ? "Fill Product Name, Price, Category, and Description."
          : totalImages < 1 || totalImages > 3
            ? "Select 1 to 3 images."
            : charCount(form.description) > 1000
              ? "Description must be 1000 characters or less."
              : "Fix the highlighted errors.",
        variant: "destructive",
      });
      return;
    }
    // Size validation for product images
    const tooBig = form.imagesFiles.filter((f) => f.size > MAX_UPLOAD_BYTES);
    if (tooBig.length > 0) {
      toast({
        title: "Image too large",
        description: `Resize below 200 KB: ${tooBig.slice(0, 5).map((f) => f.name).join(", ")}${tooBig.length > 5 ? "…" : ""}`,
        variant: "destructive",
      });
      return;
    }
    setUploading(true);
    try {
      // Upload images
      const urls: string[] = [];
      for (const file of form.imagesFiles) {
        const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }
      // Merge with selected existing URLs
      const allUrls = [...form.imagesUrls, ...urls].slice(0, 3);

      const priceNumber = parseFloat(form.price);
      // Compute discount percentage from sale price (if provided)
      let discountNumber: number | undefined = undefined;
      if (form.salePrice && form.salePrice.trim() !== "") {
        const sale = parseFloat(form.salePrice);
        if (!isNaN(sale) && !isNaN(priceNumber) && priceNumber > 0 && sale < priceNumber) {
          const pct = ((priceNumber - sale) / priceNumber) * 100;
          discountNumber = Math.max(0, Math.min(100, Math.round(pct)));
        } else {
          discountNumber = undefined;
        }
      }
      const stockNumber = form.stock !== "" ? Math.max(0, parseInt(form.stock, 10) || 0) : 0;
      const seo = {
        metaTitle: form.seo.metaTitle?.trim() || "",
        metaDescription: form.seo.metaDescription?.trim() || "",
        canonicalUrl: form.seo.canonicalUrl?.trim() || "",
      };

      const data: ProductRecord = {
        name: form.name.trim(),
        price: isNaN(priceNumber) ? 0 : priceNumber,
        discountRate: discountNumber ?? null,
        category: form.category,
        subcategory: form.subcategory?.trim() || null,
        description: form.description.trim(),
        colors: form.colors.map((c) => c.trim()).filter(Boolean),
        sizes: form.sizes.map((s) => s.trim()).filter(Boolean),
        images: allUrls,
        slug: (form.slug?.trim() || slugify(form.name)).slice(0, 120),
        shortDescription: form.shortDescription?.trim() || "",
        tags: form.tags.map((t) => t.trim()).filter(Boolean),
        brand: form.brand?.trim() || null,
        sku: form.sku?.trim() || null,
        stock: stockNumber,
        seo,
      };
      if (editKey) {
        // update existing
        await update(dbRef(realtimeDb, `products/${editKey}`), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Product updated", description: `Updated ${form.name}` });
      } else {
        // create new
        const productsRef = dbRef(realtimeDb, "products");
        const newRef = await push(productsRef);
        await set(newRef, { ...data, createdAt: serverTimestamp() });
        toast({ title: "Product added", description: `Saved with ID ${newRef.key}` });
      }

      // Regenerate sitemap after successful save
      regenerateSitemap().catch((e) => console.warn("Sitemap regeneration failed", e));

      // Trigger ISR revalidation
      try {
        const operation = editKey ? 'update' : 'create';
        await autoRevalidateAfterProductChange(operation, {
          category: data.category,
          slug: data.slug
        });
        console.log('ISR revalidation triggered successfully');
      } catch (error) {
        console.warn('ISR revalidation failed:', error);
        // Don't show error to user as the product was saved successfully
      }

      setForm(initialState);
      setEditKey(null);
      setSlugEdited(false);
      setSlugEditMode(false);
      setShowAddForm(false); // Switch back to products view
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to save", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // Auto-load products when component mounts
  useEffect(() => {
    setLoadingProducts(true);
    const productsRef = dbRef(realtimeDb, "products");
    const unsub = onValue(productsRef, (snap) => {
      const val = snap.val() as Record<string, ProductRecord> | null;
      const list = val ? Object.entries(val).map(([key, data]) => ({ key, data })) : [];
      list.sort(
        (a, b) => (Number(b.data.createdAt ?? 0) || 0) - (Number(a.data.createdAt ?? 0) || 0)
      );
      setProducts(list);
      setLoadingProducts(false);
    });
    unsubscribeRef.current = unsub;
    setProductsLoaded(true);
  }, []);

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Auto-regenerate sitemap on first load if needed
  useEffect(() => {
    if (!productsLoaded || products.length === 0) return;

    const checkAndUpdateSitemap = async () => {
      try {
        const sitemapRef = dbRef(realtimeDb, 'sitemap/latestXml');
        const snapshot = await get(sitemapRef);

        const sitemapData = snapshot.val();
        const xml: string | undefined = sitemapData?.xml;

        // If no sitemap exists or if there are products but sitemap is very small, regenerate
        if (!xml || (products.length > 0 && xml.length < 500)) {
          console.log('Auto-regenerating sitemap: missing or incomplete');
          regenerateSitemap().catch(e => console.warn('Auto sitemap regeneration failed', e));
        }
      } catch (e) {
        console.warn('Sitemap check failed', e);
      }
    };

    // Delay the check slightly to ensure products are fully loaded
    const timeout = setTimeout(checkAndUpdateSitemap, 1000);
    return () => clearTimeout(timeout);
  }, [productsLoaded, products.length, regenerateSitemap]);

  // Derived filters and pagination
  const filteredProducts = useMemo(() => {
    const s = search.trim().toLowerCase();
    return products.filter((p) => {
      const nameOk = s ? p.data.name.toLowerCase().includes(s) : true;
      const catOk = filterCategory === "all" ? true : p.data.category === filterCategory;
      return nameOk && catOk;
    });
  }, [products, search, filterCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterCategory]);

  const startEdit = (key: string, p: ProductRecord) => {
    setEditKey(key);
    setForm({
      name: p.name,
      price: String(p.price ?? ""),
      // Derive sale price from price and discount rate if present
      salePrice:
        p.discountRate != null && !isNaN(p.price as any)
          ? String(Math.round((p.price * (100 - (p.discountRate || 0))) / 100))
          : "",
      category: p.category || "",
      subcategory: p.subcategory || "",
      description: p.description || "",
      colors: Array.isArray(p.colors) && p.colors.length ? [...p.colors] : [""],
      sizes: Array.isArray(p.sizes) && p.sizes.length ? [...p.sizes] : [""],
      imagesFiles: [],
      imagesUrls: Array.isArray(p.images) ? [...p.images] : [],
      slug: p.slug || "",
      shortDescription: p.shortDescription || "",
      tags: Array.isArray(p.tags) && p.tags.length ? [...p.tags] : [""],
      brand: p.brand || "",
      sku: p.sku || "",
      stock: p.stock != null ? String(p.stock) : "",
      seo: {
        metaTitle: p.seo?.metaTitle || "",
        metaDescription: p.seo?.metaDescription || "",
        canonicalUrl: p.seo?.canonicalUrl || "",
      },
    });
    setSlugEdited(!!p.slug);
    setSlugEditMode(false);
    setShowAddForm(true); // Switch to form tab
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete a product and its images from Storage
  const deleteProduct = async (item: { key: string; data: ProductRecord }) => {
    const ok = window.confirm(`Delete product "${item.data.name}"? This will also delete its images from storage.`);
    if (!ok) return;
    setDeleting((d) => ({ ...d, [item.key]: true }));
    try {
      const imgs = Array.isArray(item.data.images) ? item.data.images : [];
      const deletions = imgs
        .filter((u) => typeof u === "string" && u.startsWith("https://") && u.includes("/o/products%2F"))
        .map((u) => deleteObject(ref(storage, u)).catch((err) => console.warn("Failed to delete image", err)));
      if (deletions.length) {
        await Promise.allSettled(deletions);
      }
      await remove(dbRef(realtimeDb, `products/${item.key}`));
      toast({ title: "Product deleted", description: `${item.data.name} has been removed.` });

      // Regenerate sitemap after successful deletion
      regenerateSitemap().catch((e) => console.warn("Sitemap regeneration failed", e));

      // Trigger ISR revalidation
      try {
        await autoRevalidateAfterProductChange('delete', {
          category: item.data.category,
          slug: item.data.slug
        });
        console.log('ISR revalidation triggered successfully after deletion');
      } catch (error) {
        console.warn('ISR revalidation failed after deletion:', error);
        // Don't show error to user as the product was deleted successfully
      }

    } catch (e: any) {
      console.error(e);
      toast({ title: "Delete failed", description: e?.message || "Unexpected error", variant: "destructive" });
    } finally {
      setDeleting((d) => {
        const { [item.key]: _omit, ...rest } = d;
        return rest;
      });
    }
  };

  // Stats calculations
  const stats = {
    total: products.length,
    active: products.filter(p => (p.data.stock || 0) > 0).length,
    outOfStock: products.filter(p => (p.data.stock || 0) === 0).length
  };

  const [showAddForm, setShowAddForm] = useState(false);

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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
          <Button
            onClick={() => {
              setShowAddForm(true);
              setEditKey(null);
              setForm(initialState);
              setSlugEdited(false);
              setSlugEditMode(false);
            }}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Products in catalog</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Check className="h-4 w-4 text-green-500" />
              In Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">Products available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <X className="h-4 w-4 text-red-500" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
            <p className="text-xs text-muted-foreground">Products needing restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="h-4 w-4 text-blue-500" />
              Sitemap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={regenerateSitemap}
                disabled={regeneratingSitemap}
                className="w-full"
              >
                {regeneratingSitemap ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.open('/sitemap.xml', '_blank');
                }}
                className="w-full text-xs"
              >
                <Eye className="mr-2 h-3 w-3" />
                View XML
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Available at /sitemap.xml</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Add/View Products */}
      <div className="border-b">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setShowAddForm(false)}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${!showAddForm
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
          >
            <Eye className="inline mr-2 h-4 w-4" />
            View Products ({stats.total})
          </button>
          <button
            onClick={() => {
              setShowAddForm(true);
              setEditKey(null);
              setForm(initialState);
              setSlugEdited(false);
              setSlugEditMode(false);
            }}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${showAddForm
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
              }`}
          >
            <Plus className="inline mr-2 h-4 w-4" />
            {editKey ? 'Edit Product' : 'Add Product'}
          </button>
        </nav>
      </div>

      {/* Add/Edit Product Form */}
      {showAddForm && (
        <div className="space-y-4">
          {/* Sticky Navigation Header */}
          <Card className="sticky top-4 z-50 shadow-lg border-primary/20">
            <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowAddForm(false);
                      setEditKey(null);
                      setForm(initialState);
                      setSlugEdited(false);
                      setSlugEditMode(false);
                    }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Products
                  </Button>
                  <div className="h-6 w-px bg-border" />
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {editKey ? (
                        <>
                          <Edit className="h-5 w-5 text-primary" />
                          Edit Product
                        </>
                      ) : (
                        <>
                          <Plus className="h-5 w-5 text-primary" />
                          Add New Product
                        </>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {editKey ? 'Update product information and save changes' : 'Create a new product for your catalog'}
                    </CardDescription>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${canSubmit ? 'bg-green-500' : 'bg-orange-400'}`} />
                      <span className="text-xs">
                        {canSubmit ? 'Ready to save' : 'Missing required fields'}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setForm(initialState);
                      setEditKey(null);
                      setSlugEdited(false);
                      setSlugEditMode(false);
                    }}
                    disabled={uploading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit || uploading}
                    className="min-w-32 font-medium"
                    size="sm"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editKey ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Product
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Save Product
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Progress & Status */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium text-muted-foreground">Form Progress</span>
                  <div className="flex items-center gap-4">
                    <span className="text-primary font-medium">
                      {Math.round((
                        [form.name, form.price, form.category, form.description].filter(Boolean).length +
                        (totalImages > 0 ? 1 : 0)
                      ) / 5 * 100)}% Complete
                    </span>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${Math.round((
                        [form.name, form.price, form.category, form.description].filter(Boolean).length +
                        (totalImages > 0 ? 1 : 0)
                      ) / 5 * 100)}%`
                    }}
                  />
                </div>

                {/* Status Messages */}
                <div className="mt-3 flex items-center gap-4 text-xs">
                  {editKey && (
                    <Badge variant="secondary" className="text-xs">
                      Editing ID: {editKey}
                    </Badge>
                  )}
                  {!canSubmit && (
                    <div className="flex items-center gap-1 text-orange-600">
                      <AlertCircle className="h-3 w-3" />
                      <span>Complete required fields to save</span>
                    </div>
                  )}
                  {canSubmit && (
                    <div className="flex items-center gap-1 text-green-600">
                      <Check className="h-3 w-3" />
                      <span>All required fields completed</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Main Form */}
          <Card>
            <CardContent className="space-y-8 p-6">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
                  <Badge variant="outline" className="ml-auto text-xs">Required</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                      Product Name
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Soft Plush Teddy Bear"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      className={`transition-all ${!form.name.trim() ? 'border-red-200 focus:border-red-400' : 'focus:border-primary'}`}
                    />
                    {!form.name.trim() && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Product name is required
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      This will be displayed to customers as the main product title
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-sm font-medium flex items-center gap-1">
                      Price (₹)
                      <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="e.g. 1299"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                      className={`transition-all ${!form.price.trim() ? 'border-red-200 focus:border-red-400' : 'focus:border-primary'}`}
                    />
                    {!form.price.trim() && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Price is required
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Set the regular selling price in Indian Rupees
                    </p>
                  </div>
                </div>

                {/* Additional Basic Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="salePrice" className="text-sm font-medium">Sale Price (₹)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="e.g. 999"
                      value={form.salePrice}
                      onChange={(e) => setForm((p) => ({ ...p, salePrice: e.target.value }))}
                      className="focus:border-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      Optional discounted price (leave empty for no discount)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand" className="text-sm font-medium">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="e.g. MyBrand"
                      value={form.brand}
                      onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))}
                      className="focus:border-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      Product manufacturer or brand name
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-sm font-medium">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      min={0}
                      step="1"
                      placeholder="e.g. 50"
                      value={form.stock}
                      onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))}
                      className="focus:border-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      Available inventory count
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: URL & SKU */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-primary/10">
                  <Info className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">URL & Identification</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">URL Slug</Label>
                    <div className="flex items-center gap-2">
                      {slugEditMode ? (
                        <>
                          <Input
                            id="slug"
                            placeholder="auto-generated-from-name"
                            value={form.slug}
                            onChange={(e) => {
                              const newSlug = slugify(e.target.value);
                              setForm((p) => ({ ...p, slug: newSlug }));
                            }}
                            onBlur={() => {
                              const uniqueSlug = generateUniqueSlug(form.slug);
                              if (uniqueSlug !== form.slug) {
                                setForm((p) => ({ ...p, slug: uniqueSlug }));
                                toast({
                                  title: "Slug updated",
                                  description: `Changed to "${uniqueSlug}" to avoid duplicates`,
                                });
                              }
                            }}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSlugEditMode(false);
                              setSlugEdited(true);
                            }}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSlugEditMode(false);
                              const baseSlug = slugify(form.name);
                              const uniqueSlug = generateUniqueSlug(baseSlug);
                              setForm((p) => ({ ...p, slug: uniqueSlug }));
                              setSlugEdited(false);
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 px-3 py-2 bg-muted/50 rounded-md text-sm font-mono">
                            {form.slug || 'auto-generated-from-name'}
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => setSlugEditMode(true)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      URL: /products/{form.slug || 'product-slug'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sku" className="text-sm font-medium">SKU (Stock Keeping Unit)</Label>
                    <Input
                      id="sku"
                      placeholder="e.g. SKU-TEDDY-001"
                      value={form.sku}
                      onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))}
                      className="focus:border-primary transition-all"
                    />
                    <p className="text-xs text-muted-foreground">
                      Unique identifier for inventory tracking
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Categories */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Categories & Classification</h3>
                  <Badge variant="outline" className="ml-auto text-xs">Required</Badge>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-1">
                      Category
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select value={form.category} onValueChange={(val) => setForm((p) => ({ ...p, category: val }))}>
                      <SelectTrigger className={`transition-all ${!form.category ? 'border-red-200 focus:border-red-400' : 'focus:border-primary'}`}>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {staticCategories.map((c) => (
                          <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {!form.category && (
                      <p className="text-xs text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Please select a category
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Main product category for organization and filtering
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-sm font-medium">Subcategory</Label>
                    <Input
                      id="subcategory"
                      list="subcats"
                      placeholder="Type or select subcategory"
                      value={form.subcategory}
                      onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value }))}
                      className="focus:border-primary transition-all"
                    />
                    <datalist id="subcats">
                      {subcategories.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                    <p className="text-xs text-muted-foreground">
                      Optional subcategory for more specific classification
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description">Description (max 1000 characters) *</Label>
                <Textarea id="description" rows={6} placeholder="Short product description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                <p className={`mt-1 text-xs ${charCount(form.description) > 1000 ? "text-red-500" : "text-muted-foreground"}`}>
                  {charCount(form.description)} / 1000 characters
                </p>
              </div>

              {/* Short Description & SKU */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="short-desc">Short Description (~150 chars)</Label>
                  <Textarea id="short-desc" rows={3} placeholder="Brief summary for SEO/meta" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} />
                  <p className="mt-1 text-xs text-muted-foreground">{charCount(form.shortDescription)} / 150</p>
                </div>
                <div>
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" placeholder="e.g. SKU123" value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
                </div>
              </div>

              {/* Section 4: Product Variants */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Product Variants</h3>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Colors */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Available Colors</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem("colors")}
                        className="h-8 px-3"
                      >
                        <Plus className="mr-1 h-3 w-3" /> Add Color
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {form.colors.map((color, i) => (
                        <div key={`color-${i}`} className="flex items-center gap-2 group">
                          <Input
                            placeholder="e.g. Red, Blue, Green"
                            value={color}
                            onChange={(e) => setArrayValue("colors", i, e.target.value)}
                            className="focus:border-primary transition-all"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem("colors", i)}
                            disabled={form.colors.length === 1}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add different color options for this product
                    </p>
                  </div>

                  {/* Sizes */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Available Sizes</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addArrayItem("sizes")}
                        className="h-8 px-3"
                      >
                        <Plus className="mr-1 h-3 w-3" /> Add Size
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {form.sizes.map((size, i) => (
                        <div key={`size-${i}`} className="flex items-center gap-2 group">
                          <Input
                            placeholder="e.g. XS, S, M, L, XL"
                            value={size}
                            onChange={(e) => setArrayValue("sizes", i, e.target.value)}
                            className="focus:border-primary transition-all"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeArrayItem("sizes", i)}
                            disabled={form.sizes.length === 1}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Add different size options for this product
                    </p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Tags</Label>
                  <div className="text-xs text-muted-foreground">
                    {form.tags.filter(Boolean).length} tag{form.tags.filter(Boolean).length !== 1 ? 's' : ''}
                  </div>
                </div>
                {form.tags.some(tag => tag.trim() !== '') ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {form.tags.map((tag, i) => (
                      tag.trim() !== '' && (
                        <div key={`tag-${i}`} className="flex items-center gap-2">
                          <Input placeholder="e.g. cotton, tshirt" value={tag} onChange={(e) => setArrayValue("tags", i, e.target.value)} />
                          <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem("tags", i)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 text-center">
                    No tags added yet. Tags will be created automatically or can be imported.
                  </div>
                )}
              </div>

              {/* Images */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Product Images (1–3)</Label>
                </div>
                <div className="mt-2">
                  <label htmlFor="images" className={`flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-sm ${totalImages >= 3 ? "pointer-events-none opacity-50" : "text-muted-foreground hover:bg-muted/30"}`}>
                    <ImageIcon className="h-5 w-5" />
                    <span>Click to upload or drag and drop</span>
                  </label>
                  <Input id="images" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageFiles(e.target.files)} disabled={totalImages >= 3} />
                  <p className="mt-1 text-xs text-muted-foreground">Selected: {totalImages} / 3 · Max 200 KB per image</p>
                </div>
                {(form.imagesFiles.length > 0 || form.imagesUrls.length > 0) && (
                  <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {form.imagesUrls.map((u, idx) => (
                      <div key={`url-${idx}`} className="relative">
                        <Image src={u} alt="Product image" width={112} height={112} className="h-28 w-full rounded-md object-cover" />
                        <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-6 w-6" onClick={() => removeUrlAt(idx)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {form.imagesFiles.map((file, idx) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div key={`file-${idx}`} className="relative">
                          <Image src={url} alt={`Preview of ${file.name}`} width={112} height={112} className="h-28 w-full rounded-md object-cover" />
                          <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-6 w-6" onClick={() => removeFileAt(idx)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SEO */}
              <div className="space-y-3 border rounded-md p-4">
                <div className="font-medium">SEO</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" placeholder="Custom title for <title> tag" value={form.seo.metaTitle} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))} />
                  </div>
                  <div>
                    <Label htmlFor="canonical">Canonical URL</Label>
                    <Input id="canonical" placeholder="https://yourdomain.com/products/slug" value={form.seo.canonicalUrl} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, canonicalUrl: e.target.value } }))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" rows={3} placeholder="Custom meta description" value={form.seo.metaDescription} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))} />
                </div>
              </div>
            </CardContent>

            <CardFooter className="bg-muted/20 border-t">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {editKey && (
                    <Badge variant="secondary">
                      Editing ID: {editKey}
                    </Badge>
                  )}
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${canSubmit ? 'bg-green-500' : 'bg-orange-400'}`} />
                    <span className="text-xs">
                      {canSubmit ? 'Form ready for submission' : 'Complete required fields'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setForm(initialState);
                      setEditKey(null);
                      setSlugEdited(false);
                      setSlugEditMode(false);
                    }}
                    disabled={uploading}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset Form
                  </Button>
                  <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={!canSubmit || uploading}
                    className="min-w-32"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : editKey ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Product
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Save Product
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Products List */}
      {!showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Product Catalog</CardTitle>
            <CardDescription>
              Manage your products, inventory, and pricing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingProducts ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No products yet</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Get started by adding your first product to the catalog.
                </p>
              </div>
            ) : (
              <>
                {/* Enhanced Search and Filter Bar */}
                <div className="mb-6 p-4 bg-muted/20 rounded-lg">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end">
                    <div className="flex-1">
                      <Label htmlFor="p-search" className="text-sm font-medium">Search Products</Label>
                      <div className="relative mt-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="p-search"
                          placeholder="Search by name, SKU, or description..."
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="w-full md:w-60">
                      <Label className="text-sm font-medium">Category</Label>
                      <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          {staticCategories.map((c) => (
                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearch('');
                          setFilterCategory('all');
                        }}
                        disabled={!search && filterCategory === 'all'}
                        className="h-9"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3 pt-3 border-t">
                    <span>Total: {products.length} products</span>
                    <span>Showing: {filteredProducts.length} results</span>
                    <span className="text-green-600">In Stock: {products.filter(p => (p.data.stock || 0) > 0).length}</span>
                    <span className="text-red-600">Out of Stock: {products.filter(p => (p.data.stock || 0) === 0).length}</span>
                  </div>
                </div>              {filteredProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-medium">No products match your search</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
                    <Button
                      className="mt-4"
                      onClick={() => {
                        setShowAddForm(true);
                        setForm(initialState);
                        setEditKey(null);
                        setSlugEdited(false);
                        setSlugEditMode(false);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Products Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {paginated.map((p) => (
                        <Card key={p.key} className="group hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            {/* Product Image */}
                            <div className="aspect-square w-full mb-4 bg-muted rounded-lg overflow-hidden">
                              {p.data.images?.[0] ? (
                                <Image
                                  src={p.data.images[0]}
                                  alt={`${p.data.name} - Product image`}
                                  width={200}
                                  height={200}
                                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center">
                                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2">
                              <div className="flex items-start justify-between">
                                <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                                  {p.data.name}
                                </h3>
                                <Badge variant={(p.data.stock || 0) > 0 ? "default" : "destructive"} className="ml-2 shrink-0">
                                  {(p.data.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                              </div>

                              <p className="text-sm text-muted-foreground">{p.data.category}</p>

                              <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold">₹{p.data.price}</span>
                                {p.data.discountRate && (
                                  <Badge variant="secondary" className="text-xs">
                                    {p.data.discountRate}% OFF
                                  </Badge>
                                )}
                              </div>

                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>Stock: {p.data.stock || 0}</span>
                                <span>SKU: {p.data.sku || 'N/A'}</span>
                              </div>

                              {/* Description Preview */}
                              {p.data.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">
                                  {p.data.description}
                                </p>
                              )}

                              {/* Tags */}
                              {p.data.tags && p.data.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {p.data.tags.slice(0, 3).map((tag, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {p.data.tags.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{p.data.tags.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                          </CardContent>

                          {/* Action Buttons */}
                          <CardFooter className="p-4 pt-0 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => startEdit(p.key, p.data)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteProduct(p)}
                              disabled={!!deleting[p.key]}
                            >
                              {deleting[p.key] ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="mt-4">
                        <Pagination>
                          <PaginationContent>
                            <PaginationItem>
                              <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage((p) => Math.max(1, p - 1));
                                }}
                              />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, i) => {
                              const pg = i + 1;
                              return (
                                <PaginationItem key={pg}>
                                  <PaginationLink
                                    href="#"
                                    isActive={pg === currentPage}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setPage(pg);
                                    }}
                                  >
                                    {pg}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            })}
                            <PaginationItem>
                              <PaginationNext
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setPage((p) => Math.min(totalPages, p + 1));
                                }}
                              />
                            </PaginationItem>
                          </PaginationContent>
                        </Pagination>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductsPage;