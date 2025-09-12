import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref as dbRef, push, serverTimestamp, set, update } from "firebase/database";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { categories as staticCategories } from "@/data/products";
import { useMemo, useState, useEffect } from "react";

type ProductForm = {
    name: string;
    price: string;
    salePrice?: string;
    category: string;
    subcategory?: string;
    description: string;
    colors: string[];
    sizes: string[];
    imagesFiles: File[];
    imagesUrls: string[];
    slug: string;
    shortDescription: string;
    tags: string[];
    brand?: string;
    sku?: string;
    stock: string;
    seo: {
        metaTitle: string;
        metaDescription: string;
        canonicalUrl: string;
    };
};

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

const ProductFormPage = ({ product, onSave }: { product?: any, onSave: () => void }) => {
    const MAX_UPLOAD_BYTES = 200 * 1024; // 200 KB
    const [form, setForm] = useState<ProductForm>(product || initialState);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [slugEdited, setSlugEdited] = useState(!!product?.slug);
    const { toast } = useToast();

    useEffect(() => {
        if (product) {
            setForm({
                ...initialState,
                ...product,
                price: String(product.price || ""),
                salePrice: product.discountRate != null && !isNaN(product.price)
                    ? String(Math.round((product.price * (100 - (product.discountRate || 0))) / 100))
                    : "",
                imagesUrls: product.images || [],
                colors: product.colors?.length ? [...product.colors] : [""],
                sizes: product.sizes?.length ? [...product.sizes] : [""],
                tags: product.tags?.length ? [...product.tags] : [""],
                stock: product.stock != null ? String(product.stock) : "",
                seo: product.seo || { metaTitle: "", metaDescription: "", canonicalUrl: "" },
            });
        }
    }, [product]);

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

    useEffect(() => {
        if (!slugEdited) {
            setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
        }
    }, [form.name, slugEdited]);

    const handleImageFiles = (files: FileList | null) => {
        if (!files) return;
        const valid: File[] = [];
        let skippedType = 0;
        let skippedSize: string[] = [];
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

    const setArrayValue = (key: "colors" | "sizes", idx: number, value: string) => {
        setForm((prev) => {
            const next = [...prev[key]];
            next[idx] = value;
            return { ...prev, [key]: next } as ProductForm;
        });
    };

    const addArrayItem = (key: "colors" | "sizes") => {
        setForm((prev) => ({ ...prev, [key]: [...prev[key], ""] } as ProductForm));
    };

    const removeArrayItem = (key: "colors" | "sizes", idx: number) => {
        setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) } as ProductForm));
    };

    const onSubmit = async () => {
        if (!canSubmit) {
            toast({
                title: "Check required fields",
                description: "Please fill all required fields and check for errors.",
                variant: "destructive",
            });
            return;
        }
        setUploading(true);
        try {
            const urls: string[] = [];
            for (const file of form.imagesFiles) {
                const path = `products/${Date.now()}-${file.name}`;
                const storageRef = ref(storage, path);
                await uploadBytes(storageRef, file);
                const url = await getDownloadURL(storageRef);
                urls.push(url);
            }
            const allUrls = [...form.imagesUrls, ...urls].slice(0, 3);

            const priceNumber = parseFloat(form.price);
            let discountNumber: number | undefined = undefined;
            if (form.salePrice && form.salePrice.trim() !== "") {
                const sale = parseFloat(form.salePrice);
                if (!isNaN(sale) && !isNaN(priceNumber) && priceNumber > 0 && sale < priceNumber) {
                    const pct = ((priceNumber - sale) / priceNumber) * 100;
                    discountNumber = Math.max(0, Math.min(100, Math.round(pct)));
                }
            }
            const stockNumber = form.stock !== "" ? Math.max(0, parseInt(form.stock, 10) || 0) : 0;

            const data = {
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
                seo: form.seo,
            };

            if (product?.key) {
                await update(dbRef(db, `products/${product.key}`), {
                    ...data,
                    updatedAt: serverTimestamp(),
                });
                toast({ title: "Product updated", description: `Updated ${form.name}` });
            } else {
                const newRef = await push(dbRef(db, "products"));
                await set(newRef, { ...data, createdAt: serverTimestamp() });
                toast({ title: "Product added", description: `Saved with ID ${newRef.key}` });
            }
            onSave();
        } catch (err: any) {
            console.error(err);
            toast({ title: "Failed to save", description: err?.message || "Something went wrong", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl">{product ? "Edit Product" : "Add Product"}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="name">Product Name *</Label>
                        <Input id="name" placeholder="e.g. Soft Plush Teddy Bear" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input id="price" type="number" min={0} step="0.01" placeholder="e.g. 1299" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <Label htmlFor="slug">Slug</Label>
                        <Input
                            id="slug"
                            placeholder="auto-generated-from-name"
                            value={form.slug}
                            onChange={(e) => {
                                setSlugEdited(true);
                                setForm((p) => ({ ...p, slug: slugify(e.target.value) }));
                            }}
                        />
                    </div>
                    <div>
                        <Label htmlFor="stock">Stock (Qty)</Label>
                        <Input id="stock" type="number" min={0} step="1" placeholder="e.g. 50" value={form.stock} onChange={(e) => setForm((p) => ({ ...p, stock: e.target.value }))} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="salePrice">Sale Price (₹)</Label>
                        <Input id="salePrice" type="number" min={0} step="0.01" placeholder="e.g. 999" value={form.salePrice} onChange={(e) => setForm((p) => ({ ...p, salePrice: e.target.value }))} />
                    </div>
                    <div>
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" placeholder="e.g. MyBrand" value={form.brand} onChange={(e) => setForm((p) => ({ ...p, brand: e.target.value }))} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Label>Category *</Label>
                        <Select value={form.category} onValueChange={(val) => setForm((p) => ({ ...p, category: val }))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {staticCategories.map((c) => (
                                    <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="subcategory">Subcategory</Label>
                        <Input id="subcategory" list="subcats" placeholder="Type or pick a subcategory" value={form.subcategory} onChange={(e) => setForm((p) => ({ ...p, subcategory: e.target.value }))} />
                        <datalist id="subcats">
                            {subcategories.map((s) => (
                                <option key={s} value={s} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div>
                    <Label htmlFor="description">Description (max 1000 characters) *</Label>
                    <Textarea id="description" rows={6} placeholder="Short product description..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                    <p className={`mt-1 text-xs ${charCount(form.description) > 1000 ? "text-red-500" : "text-muted-foreground"}`}>
                        {charCount(form.description)} / 1000 characters
                    </p>
                </div>

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

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Colors</Label>
                        <Button type="button" variant="secondary" size="sm" onClick={() => addArrayItem("colors")}>
                            <Plus className="mr-1 h-4 w-4" /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {form.colors.map((color, i) => (
                            <div key={`color-${i}`} className="flex items-center gap-2">
                                <Input placeholder="e.g. Red" value={color} onChange={(e) => setArrayValue("colors", i, e.target.value)} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem("colors", i)} disabled={form.colors.length === 1}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Sizes</Label>
                        <Button type="button" variant="secondary" size="sm" onClick={() => addArrayItem("sizes")}>
                            <Plus className="mr-1 h-4 w-4" /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {form.sizes.map((size, i) => (
                            <div key={`size-${i}`} className="flex items-center gap-2">
                                <Input placeholder="e.g. S, M, L" value={size} onChange={(e) => setArrayValue("sizes", i, e.target.value)} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem("sizes", i)} disabled={form.sizes.length === 1}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Tags</Label>
                        <Button type="button" variant="secondary" size="sm" onClick={() => setForm(p => ({ ...p, tags: [...p.tags, ""] }))}>
                            <Plus className="mr-1 h-4 w-4" /> Add
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {form.tags.map((tag, i) => (
                            <div key={`tag-${i}`} className="flex items-center gap-2">
                                <Input placeholder="e.g. cotton, tshirt" value={tag} onChange={(e) => setForm((prev) => { const next = [...prev.tags]; next[i] = e.target.value; return { ...prev, tags: next }; })} />
                                <Button type="button" variant="destructive" size="icon" onClick={() => setForm((prev) => ({ ...prev, tags: prev.tags.filter((_, idx) => idx !== i) }))} disabled={form.tags.length === 1}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Product Images (1–3)</Label>
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
                                    <img src={u} alt="existing" className="h-28 w-full rounded-md object-cover" />
                                    <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-6 w-6" onClick={() => removeUrlAt(idx)}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                            {form.imagesFiles.map((file, idx) => {
                                const url = URL.createObjectURL(file);
                                return (
                                    <div key={`file-${idx}`} className="relative">
                                        <img src={url} alt={file.name} className="h-28 w-full rounded-md object-cover" />
                                        <Button type="button" size="icon" variant="destructive" className="absolute right-1 top-1 h-6 w-6" onClick={() => removeFileAt(idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

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

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setForm(initialState)} disabled={uploading}>Reset</Button>
                    <Button type="button" onClick={onSubmit} disabled={!canSubmit || uploading}>
                        {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : product ? "Update Product" : "Save Product"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductFormPage;
