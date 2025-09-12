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
import { useMemo, useState, useEffect, useReducer } from "react";

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

type FormAction =
    | { type: 'SET_FORM'; payload: ProductForm }
    | { type: 'UPDATE_FIELD'; payload: { field: keyof ProductForm; value: any } }
    | { type: 'UPDATE_SEO_FIELD'; payload: { field: keyof ProductForm['seo']; value: string } }
    | { type: 'SET_ARRAY_VALUE'; payload: { field: 'colors' | 'sizes' | 'tags'; index: number; value: string } }
    | { type: 'ADD_ARRAY_ITEM'; payload: { field: 'colors' | 'sizes' | 'tags' } }
    | { type: 'REMOVE_ARRAY_ITEM'; payload: { field: 'colors' | 'sizes' | 'tags'; index: number } }
    | { type: 'ADD_IMAGE_FILES'; payload: File[] }
    | { type: 'REMOVE_IMAGE_FILE'; payload: number }
    | { type: 'REMOVE_IMAGE_URL'; payload: number };


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

const formReducer = (state: ProductForm, action: FormAction): ProductForm => {
    switch (action.type) {
        case 'SET_FORM':
            return action.payload;
        case 'UPDATE_FIELD':
            return { ...state, [action.payload.field]: action.payload.value };
        case 'UPDATE_SEO_FIELD':
            return { ...state, seo: { ...state.seo, [action.payload.field]: action.payload.value } };
        case 'SET_ARRAY_VALUE': {
            const { field, index, value } = action.payload;
            const newArray = [...state[field]];
            newArray[index] = value;
            return { ...state, [field]: newArray };
        }
        case 'ADD_ARRAY_ITEM': {
            const { field } = action.payload;
            return { ...state, [field]: [...state[field], ""] };
        }
        case 'REMOVE_ARRAY_ITEM': {
            const { field, index } = action.payload;
            return { ...state, [field]: state[field].filter((_, i) => i !== index) };
        }
        case 'ADD_IMAGE_FILES': {
            const currentTotal = (state.imagesFiles?.length || 0) + (state.imagesUrls?.length || 0);
            const remainingSlots = Math.max(0, 3 - currentTotal);
            const filesToAdd = action.payload.slice(0, remainingSlots);
            return { ...state, imagesFiles: [...state.imagesFiles, ...filesToAdd] };
        }
        case 'REMOVE_IMAGE_FILE':
            return { ...state, imagesFiles: state.imagesFiles.filter((_, i) => i !== action.payload) };
        case 'REMOVE_IMAGE_URL':
            return { ...state, imagesUrls: state.imagesUrls.filter((_, i) => i !== action.payload) };
        default:
            return state;
    }
};

const charCount = (text: string) => text?.length || 0;

const ProductFormPage = ({ product, onSave }: { product?: any, onSave: () => void }) => {
    const MAX_UPLOAD_BYTES = 200 * 1024; // 200 KB
    const [form, dispatch] = useReducer(formReducer, initialState);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [slugEdited, setSlugEdited] = useState(!!product?.slug);
    const { toast } = useToast();

    useEffect(() => {
        if (product) {
            const newFormState = {
                ...initialState,
                ...product,
                price: String(product.price || ""),
                salePrice: product.discountRate != null && !isNaN(product.price)
                    ? String(Math.round((product.price * (100 - (product.discountRate || 0))) / 100))
                    : "",
                imagesUrls: Array.isArray(product.images) ? product.images : [],
                imagesFiles: [], // Reset file inputs
                colors: Array.isArray(product.colors) && product.colors.length ? [...product.colors] : [""],
                sizes: Array.isArray(product.sizes) && product.sizes.length ? [...product.sizes] : [""],
                tags: Array.isArray(product.tags) && product.tags.length ? [...product.tags] : [""],
                stock: product.stock != null ? String(product.stock) : "",
                seo: (product.seo && typeof product.seo === 'object' && !Array.isArray(product.seo)) ? product.seo : { metaTitle: "", metaDescription: "", canonicalUrl: "" },
            };
            dispatch({ type: 'SET_FORM', payload: newFormState });
            setSlugEdited(!!product.slug);
        } else {
            dispatch({ type: 'SET_FORM', payload: initialState });
            setSlugEdited(false);
        }
    }, [product]);

    useEffect(() => {
        const cat = staticCategories.find((c) => c.name === form.category);
        setSubcategories(cat ? cat.subcategories : []);
    }, [form.category]);

    const totalImages = useMemo(() => (form.imagesFiles?.length || 0) + (form.imagesUrls?.length || 0), [form.imagesFiles, form.imagesUrls]);

    const canSubmit = useMemo(() => {
        return (
            form.name.trim() !== "" &&
            String(form.price).trim() !== "" &&
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
            dispatch({ type: 'UPDATE_FIELD', payload: { field: 'slug', value: slugify(form.name) } });
        }
    }, [form.name, slugEdited]);

    const handleFieldChange = (field: keyof ProductForm, value: any) => {
        dispatch({ type: 'UPDATE_FIELD', payload: { field, value } });
    };

    const handleSeoChange = (field: keyof ProductForm['seo'], value: string) => {
        dispatch({ type: 'UPDATE_SEO_FIELD', payload: { field, value } });
    };

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
        const currentTotal = (form.imagesFiles?.length || 0) + (form.imagesUrls?.length || 0);
        if (valid.length + currentTotal > 3) {
            toast({ title: "Image limit", description: "Maximum 3 images allowed.", variant: "destructive" });
        }
        dispatch({ type: 'ADD_IMAGE_FILES', payload: valid });
    };

    const removeFileAt = (idx: number) => {
        dispatch({ type: 'REMOVE_IMAGE_FILE', payload: idx });
    };

    const removeUrlAt = (idx: number) => {
        dispatch({ type: 'REMOVE_IMAGE_URL', payload: idx });
    };

    const handleArrayChange = (field: 'colors' | 'sizes' | 'tags', index: number, value: string) => {
        dispatch({ type: 'SET_ARRAY_VALUE', payload: { field, index, value } });
    };

    const addArrayItem = (field: 'colors' | 'sizes' | 'tags') => {
        dispatch({ type: 'ADD_ARRAY_ITEM', payload: { field } });
    };

    const removeArrayItem = (field: 'colors' | 'sizes' | 'tags', index: number) => {
        dispatch({ type: 'REMOVE_ARRAY_ITEM', payload: { field, index } });
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
                <div>
                    <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input id="name" placeholder="e.g. Soft Plush Teddy Bear" value={form.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="price">Price (₹) *</Label>
                            <Input id="price" type="number" min={0} step="0.01" placeholder="e.g. 1299" value={form.price} onChange={(e) => handleFieldChange('price', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Pricing & Inventory</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                placeholder="auto-generated-from-name"
                                value={form.slug}
                                onChange={(e) => {
                                    setSlugEdited(true);
                                    handleFieldChange('slug', slugify(e.target.value));
                                }}
                            />
                        </div>
                        <div>
                            <Label htmlFor="stock">Stock (Qty)</Label>
                            <Input id="stock" type="number" min={0} step="1" placeholder="e.g. 50" value={form.stock} onChange={(e) => handleFieldChange('stock', e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label htmlFor="salePrice">Sale Price (₹)</Label>
                            <Input id="salePrice" type="number" min={0} step="0.01" placeholder="e.g. 999" value={form.salePrice} onChange={(e) => handleFieldChange('salePrice', e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="brand">Brand</Label>
                            <Input id="brand" placeholder="e.g. MyBrand" value={form.brand} onChange={(e) => handleFieldChange('brand', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Category & Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Category *</Label>
                            <Select value={form.category} onValueChange={(val) => handleFieldChange('category', val)}>
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
                            <Input id="subcategory" list="subcats" placeholder="Type or pick a subcategory" value={form.subcategory} onChange={(e) => handleFieldChange('subcategory', e.target.value)} />
                            <datalist id="subcats">
                                {subcategories.map((s) => (
                                    <option key={s} value={s} />
                                ))}
                            </datalist>
                        </div>
                    </div>

                    <div className="mt-4">
                        <Label htmlFor="description">Description (max 1000 characters) *</Label>
                        <Textarea id="description" rows={6} placeholder="Short product description..." value={form.description} onChange={(e) => handleFieldChange('description', e.target.value)} />
                        <p className={`mt-1 text-xs ${charCount(form.description) > 1000 ? "text-red-500" : "text-muted-foreground"}`}>
                            {charCount(form.description)} / 1000 characters
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label htmlFor="short-desc">Short Description (~150 chars)</Label>
                            <Textarea id="short-desc" rows={3} placeholder="Brief summary for SEO/meta" value={form.shortDescription} onChange={(e) => handleFieldChange('shortDescription', e.target.value)} />
                            <p className="mt-1 text-xs text-muted-foreground">{charCount(form.shortDescription)} / 150</p>
                        </div>
                        <div>
                            <Label htmlFor="sku">SKU</Label>
                            <Input id="sku" placeholder="e.g. SKU123" value={form.sku} onChange={(e) => handleFieldChange('sku', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Variants</h3>
                    <div className="space-y-4">
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
                                        <Input placeholder="e.g. Red" value={color} onChange={(e) => handleArrayChange("colors", i, e.target.value)} />
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
                                        <Input placeholder="e.g. S, M, L" value={size} onChange={(e) => handleArrayChange("sizes", i, e.target.value)} />
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
                                <Button type="button" variant="secondary" size="sm" onClick={() => addArrayItem("tags")}>
                                    <Plus className="mr-1 h-4 w-4" /> Add
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {form.tags.map((tag, i) => (
                                    <div key={`tag-${i}`} className="flex items-center gap-2">
                                        <Input placeholder="e.g. cotton, tshirt" value={tag} onChange={(e) => handleArrayChange("tags", i, e.target.value)} />
                                        <Button type="button" variant="destructive" size="icon" onClick={() => removeArrayItem("tags", i)} disabled={form.tags.length === 1}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">Images</h3>
                    <div className="space-y-2">
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
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-4">SEO</h3>
                    <div className="space-y-3 border rounded-md p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="metaTitle">Meta Title</Label>
                                <Input id="metaTitle" placeholder="Custom title for <title> tag" value={form.seo.metaTitle} onChange={(e) => handleSeoChange('metaTitle', e.target.value)} />
                            </div>
                            <div>
                                <Label htmlFor="canonical">Canonical URL</Label>
                                <Input id="canonical" placeholder="https://yourdomain.com/products/slug" value={form.seo.canonicalUrl} onChange={(e) => handleSeoChange('canonicalUrl', e.target.value)} />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="metaDescription">Meta Description</Label>
                            <Textarea id="metaDescription" rows={3} placeholder="Custom meta description" value={form.seo.metaDescription} onChange={(e) => handleSeoChange('metaDescription', e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => dispatch({ type: 'SET_FORM', payload: initialState })} disabled={uploading}>Reset</Button>
                    <Button type="button" onClick={onSubmit} disabled={!canSubmit || uploading}>
                        {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : product ? "Update Product" : "Save Product"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default ProductFormPage;
