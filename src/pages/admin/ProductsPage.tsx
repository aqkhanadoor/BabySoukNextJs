"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref as dbRef, onValue, remove, get, set, serverTimestamp } from "firebase/database";
import { ref, deleteObject } from "firebase/storage";
import { categories as staticCategories } from "@/data/products";
import { generateSitemapXml } from "@/lib/sitemap";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import ProductFormPage from "./ProductFormPage";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ProductRecord = {
    name: string;
    price: number;
    discountRate: number | null;
    category: string;
    subcategory: string | null;
    description: string;
    colors: string[];
    sizes: string[];
    images: string[];
    createdAt?: number | { [k: string]: any };
    updatedAt?: number | { [k: string]: any };
    slug?: string;
    shortDescription?: string;
    tags?: string[];
    brand?: string | null;
    sku?: string | null;
    stock?: number;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        canonicalUrl?: string;
    };
};

const ProductsPage = () => {
    const [products, setProducts] = useState<Array<{ key: string; data: ProductRecord }>>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const [search, setSearch] = useState("");
    const [filterCategory, setFilterCategory] = useState<string>("all");
    const [deleting, setDeleting] = useState<Record<string, boolean>>({});
    const { toast } = useToast();
    const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    useEffect(() => {
        setLoadingProducts(true);
        const productsRef = dbRef(db, "products");
        const unsub = onValue(productsRef, (snap) => {
            const val = snap.val() as Record<string, ProductRecord> | null;
            const list = val ? Object.entries(val).map(([key, data]) => ({ key, data })) : [];
            list.sort(
                (a, b) => (Number(b.data.createdAt ?? 0) || 0) - (Number(a.data.createdAt ?? 0) || 0)
            );
            setProducts(list);
            setLoadingProducts(false);
        });
        return () => unsub();
    }, []);

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
    }, [filteredProducts, currentPage, pageSize]);

    useEffect(() => {
        setPage(1);
    }, [search, filterCategory]);

    const startEdit = (product: { key: string; data: ProductRecord }) => {
        setEditingProduct({ ...product.data, key: product.key });
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingProduct(null);
        setIsFormOpen(true);
    };

    const handleSave = () => {
        setIsFormOpen(false);
        // editingProduct is cleared in onOpenChange
        regenerateSitemap().catch((e) => console.warn("Sitemap regeneration failed", e));
    };

    const handleOpenChange = (isOpen: boolean) => {
        setIsFormOpen(isOpen);
        if (!isOpen) {
            setEditingProduct(null);
        }
    };

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
            await remove(dbRef(db, `products/${item.key}`));
            toast({ title: "Product deleted", description: `${item.data.name} has been removed.` });
            regenerateSitemap().catch((e) => console.warn("Sitemap regeneration failed", e));
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

    const regenerateSitemap = async () => {
        if (regeneratingSitemap) return;
        setRegeneratingSitemap(true);
        try {
            const snap = await get(dbRef(db, "products"));
            const val = snap.val();
            const list: any[] = val ? Object.values(val) : [];
            const envBase = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
            const baseUrl = envBase || (typeof window !== 'undefined' ? window.location.origin : "https://example.com");
            const basePages = [
                "/", "/products", "/categories", "/collections", "/search", "/cart", "/contact",
                "/terms", "/privacy", "/shipping", "/returns", "/cancellation", "/faq"
            ];
            const categoryQueryPaths = staticCategories.map(c => `/categories?cat=${encodeURIComponent(c.name)}`);
            const staticPaths = [...basePages, ...categoryQueryPaths];
            const xml = generateSitemapXml({ baseUrl, products: list, staticPaths });
            await set(dbRef(db, "sitemap/latestXml"), { xml, updatedAt: serverTimestamp() });
            toast({ title: "Sitemap updated", description: "Latest sitemap stored in database." });
        } catch (e: any) {
            console.error(e);
            toast({ title: "Sitemap failed", description: e?.message || "Unexpected error", variant: "destructive" });
        } finally {
            setRegeneratingSitemap(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Products</h1>
                <div className="flex gap-2">
                    <Button onClick={handleAddNew}>Add New Product</Button>
                    <Button variant="outline" onClick={regenerateSitemap} disabled={regeneratingSitemap}>
                        {regeneratingSitemap ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Regenerate Sitemap'}
                    </Button>
                </div>
            </div>

            <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end">
                <div className="flex-1">
                    <Input
                        placeholder="Search by name"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-60">
                    <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v)}>
                        <SelectTrigger>
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
            </div>

            {loadingProducts ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading Products...</div>
            ) : (
                <>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginated.map((p) => (
                                    <TableRow key={p.key}>
                                        <TableCell>
                                            {p.data.images?.[0] ? (
                                                <img src={p.data.images[0]} className="h-12 w-12 rounded object-cover" />
                                            ) : (
                                                <div className="h-12 w-12 rounded bg-muted" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{p.data.name}</TableCell>
                                        <TableCell>{p.data.category}</TableCell>
                                        <TableCell>₹{p.data.price}</TableCell>
                                        <TableCell>{p.data.stock ?? 'N/A'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                                                    <Edit className="mr-1 h-4 w-4" /> Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => deleteProduct(p)}
                                                    disabled={!!deleting[p.key]}
                                                >
                                                    {deleting[p.key] ? (
                                                        <><Loader2 className="mr-1 h-4 w-4 animate-spin" /> Deleting</>
                                                    ) : (
                                                        'Delete'
                                                    )}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }} />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <PaginationItem key={i + 1}>
                                    <PaginationLink href="#" isActive={i + 1 === currentPage} onClick={(e) => { e.preventDefault(); setPage(i + 1); }}>
                                        {i + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext href="#" onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    </DialogHeader>
                    <ProductFormPage product={editingProduct} onSave={handleSave} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductsPage;
