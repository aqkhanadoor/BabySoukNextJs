import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Plus, Image as ImageIcon, Edit, Check, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db, storage } from "@/lib/firebase";
import { ref as dbRef, onValue, push, serverTimestamp, set, update, remove, get } from "firebase/database";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { categories as staticCategories } from "@/config/categories";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ProductForm = {
  name: string;
  price: string; // keep as string for input control
  salePrice?: string; // absolute sale price in ₹ as string
  category: string;
  subcategory?: string;
  description: string; // limit 1000 chars
  colors: string[];
  sizes: string[];
  imagesFiles: File[];
  imagesUrls: string[]; // picked from existing
  slug: string;
  shortDescription: string;
  tags: string[];
  brand?: string;
  sku?: string;
  stock: string; // string for input control, convert to number
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

const Admin = () => {
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
  const [deleting, setDeleting] = useState<Record<string, boolean>>({});
  // Removed: existing images picker state
  const { toast } = useToast();
  // Hero2 state (desktop 3:2 and mobile 1:1)
  const [heroDesktopImages, setHeroDesktopImages] = useState<string[]>(["", "", ""]);
  const [heroDesktopFiles, setHeroDesktopFiles] = useState<(File | null)[]>([null, null, null]);
  const [heroMobileImages, setHeroMobileImages] = useState<string[]>(["", "", ""]);
  const [heroMobileFiles, setHeroMobileFiles] = useState<(File | null)[]>([null, null, null]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroDesktopOriginal, setHeroDesktopOriginal] = useState<string[]>(["", "", ""]);
  const [heroMobileOriginal, setHeroMobileOriginal] = useState<string[]>(["", "", ""]);
  const [heroLinks, setHeroLinks] = useState<string[]>(["", "", ""]);
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);

  // Hero3 state (same shape)
  const [hero3DesktopImages, setHero3DesktopImages] = useState<string[]>(["", "", ""]);
  const [hero3DesktopFiles, setHero3DesktopFiles] = useState<(File | null)[]>([null, null, null]);
  const [hero3MobileImages, setHero3MobileImages] = useState<string[]>(["", "", ""]);
  const [hero3MobileFiles, setHero3MobileFiles] = useState<(File | null)[]>([null, null, null]);
  const [hero3Loading, setHero3Loading] = useState(true);
  const [hero3Saving, setHero3Saving] = useState(false);
  const [hero3DesktopOriginal, setHero3DesktopOriginal] = useState<string[]>(["", "", ""]);
  const [hero3MobileOriginal, setHero3MobileOriginal] = useState<string[]>(["", "", ""]);
  const [hero3Links, setHero3Links] = useState<string[]>(["", "", ""]);

  // One-time sitemap backfill on mount: ensures existing products appear if sitemap is empty or incomplete
  useEffect(() => {
    (async () => {
      try {
        // Fetch current sitemap & products
        const [sitemapSnap, productsSnap] = await Promise.all([
          get(dbRef(db, 'sitemap/latestXml')).catch(() => null),
          get(dbRef(db, 'products')).catch(() => null)
        ]);
        if (!productsSnap || !productsSnap.exists()) return; // no products, nothing to do
        const productsVal = productsSnap.val() as Record<string, any>;
        const productEntries = Object.values(productsVal);
        if (!productEntries.length) return;
        const sitemapVal = sitemapSnap?.val();
        const xml: string | undefined = sitemapVal?.xml;
        // Decide if regeneration needed:
        // 1. No sitemap XML yet
        // 2. Missing at least one product slug URL
        let needsRegenerate = false;
        if (!xml) {
          needsRegenerate = true;
        } else {
          // Build set of expected product URL endings: /{category}/{slug}
          const expected: string[] = productEntries
            .filter((p: any) => p?.category && p?.slug)
            .map((p: any) => `/${encodeURIComponent(p.category)}/${encodeURIComponent(p.slug)}`);
          const missing = expected.some(path => !xml.includes(path));
          // Also guard: if product count greater than number of <url> entries referencing a category path
          if (missing) needsRegenerate = true;
        }
        if (needsRegenerate) {
          regenerateSitemap().catch(e => console.warn('Auto backfill sitemap failed', e));
        }
      } catch (e) {
        console.warn('Sitemap backfill check failed', e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update subcategory options when category changes
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

  // Auto-generate slug from name unless manually edited
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
        await update(dbRef(db, `products/${editKey}`), {
          ...data,
          updatedAt: serverTimestamp(),
        });
        toast({ title: "Product updated", description: `Updated ${form.name}` });
      } else {
        // create new
        const productsRef = dbRef(db, "products");
        const newRef = await push(productsRef);
        await set(newRef, { ...data, createdAt: serverTimestamp() });
        toast({ title: "Product added", description: `Saved with ID ${newRef.key}` });
      }
      // Regenerate sitemap (fire and forget)
      regenerateSitemap().catch((e) => console.warn("Sitemap regeneration failed", e));
      setForm(initialState);
      setEditKey(null);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Failed to save", description: err?.message || "Something went wrong", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // Attach products listener on demand
  const loadProducts = () => {
    if (productsLoaded) return;
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
    unsubscribeRef.current = unsub;
    setProductsLoaded(true);
  };

  // Cleanup listener on unmount
  useEffect(() => {
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  // Load Hero2 images
  useEffect(() => {
    const refPath = dbRef(db, "homepage/hero2");
    const unsub = onValue(refPath, (snap) => {
      const val = snap.val() as { images?: string[]; desktop?: string[]; mobile?: string[]; links?: string[] } | null;
      // Desktop
      if (val?.desktop && Array.isArray(val.desktop)) {
        const arr = val.desktop.slice(0, 3);
        const d = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHeroDesktopImages(d);
        setHeroDesktopOriginal(d);
      } else if (val?.images && Array.isArray(val.images)) {
        const arr = val.images.slice(0, 3);
        const d = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHeroDesktopImages(d);
        setHeroDesktopOriginal(d);
      } else {
        setHeroDesktopImages(["", "", ""]);
        setHeroDesktopOriginal(["", "", ""]);
      }
      // Mobile
      if (val?.mobile && Array.isArray(val.mobile)) {
        const arr = val.mobile.slice(0, 3);
        const m = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHeroMobileImages(m);
        setHeroMobileOriginal(m);
      } else if (val?.images && Array.isArray(val.images)) {
        const arr = val.images.slice(0, 3);
        const m = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHeroMobileImages(m);
        setHeroMobileOriginal(m);
      } else {
        setHeroMobileImages(["", "", ""]);
        setHeroMobileOriginal(["", "", ""]);
      }
      // Links (optional)
      if (val?.links && Array.isArray(val.links)) {
        const l = val.links.slice(0, 3);
        setHeroLinks([l[0] || "", l[1] || "", l[2] || ""]);
      } else {
        setHeroLinks(["", "", ""]);
      }
      setHeroLoading(false);
    });
    return () => unsub();
  }, []);

  // Load Hero3 images
  useEffect(() => {
    const refPath = dbRef(db, "homepage/hero3");
    const unsub = onValue(refPath, (snap) => {
      const val = snap.val() as { images?: string[]; desktop?: string[]; mobile?: string[]; links?: string[] } | null;
      // Desktop
      if (val?.desktop && Array.isArray(val.desktop)) {
        const arr = val.desktop.slice(0, 3);
        const d = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHero3DesktopImages(d);
        setHero3DesktopOriginal(d);
      } else if (val?.images && Array.isArray(val.images)) {
        const arr = val.images.slice(0, 3);
        const d = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHero3DesktopImages(d);
        setHero3DesktopOriginal(d);
      } else {
        setHero3DesktopImages(["", "", ""]);
        setHero3DesktopOriginal(["", "", ""]);
      }
      // Mobile
      if (val?.mobile && Array.isArray(val.mobile)) {
        const arr = val.mobile.slice(0, 3);
        const m = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHero3MobileImages(m);
        setHero3MobileOriginal(m);
      } else if (val?.images && Array.isArray(val.images)) {
        const arr = val.images.slice(0, 3);
        const m = [arr[0] || "", arr[1] || "", arr[2] || ""];
        setHero3MobileImages(m);
        setHero3MobileOriginal(m);
      } else {
        setHero3MobileImages(["", "", ""]);
        setHero3MobileOriginal(["", "", ""]);
      }
      // Links (optional)
      if (val?.links && Array.isArray(val.links)) {
        const l = val.links.slice(0, 3);
        setHero3Links([l[0] || "", l[1] || "", l[2] || ""]);
      } else {
        setHero3Links(["", "", ""]);
      }
      setHero3Loading(false);
    });
    return () => unsub();
  }, []);

  const onPickHeroFile = (kind: "desktop" | "mobile", idx: number, files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image.", variant: "destructive" });
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      toast({ title: "File too large", description: "Max size is 200 KB per image.", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(f);
    if (kind === "desktop") {
      setHeroDesktopFiles((prev) => { const next = [...prev]; next[idx] = f; return next; });
      setHeroDesktopImages((prev) => { const next = [...prev]; next[idx] = url; return next; });
    } else {
      setHeroMobileFiles((prev) => { const next = [...prev]; next[idx] = f; return next; });
      setHeroMobileImages((prev) => { const next = [...prev]; next[idx] = url; return next; });
    }
  };

  // Hero3 file picker
  const onPickHero3File = (kind: "desktop" | "mobile", idx: number, files: FileList | null) => {
    if (!files || !files[0]) return;
    const f = files[0];
    if (!f.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image.", variant: "destructive" });
      return;
    }
    if (f.size > MAX_UPLOAD_BYTES) {
      toast({ title: "File too large", description: "Max size is 200 KB per image.", variant: "destructive" });
      return;
    }
    const url = URL.createObjectURL(f);
    if (kind === "desktop") {
      setHero3DesktopFiles((prev) => { const next = [...prev]; next[idx] = f; return next; });
      setHero3DesktopImages((prev) => { const next = [...prev]; next[idx] = url; return next; });
    } else {
      setHero3MobileFiles((prev) => { const next = [...prev]; next[idx] = f; return next; });
      setHero3MobileImages((prev) => { const next = [...prev]; next[idx] = url; return next; });
    }
  };

  const saveHero = async () => {
    // Validate sizes before uploading
    const offenders: string[] = [];
    heroDesktopFiles.forEach((f, i) => { if (f && f.size > MAX_UPLOAD_BYTES) offenders.push(`Desktop #${i + 1}`); });
    heroMobileFiles.forEach((f, i) => { if (f && f.size > MAX_UPLOAD_BYTES) offenders.push(`Mobile #${i + 1}`); });
    if (offenders.length) {
      toast({ title: "Hero image too large", description: `${offenders.join(", ")} exceed 200 KB. Please compress and try again.`, variant: "destructive" });
      return;
    }
    setHeroSaving(true);
    try {
      const finalDesktop = [...heroDesktopImages];
      const finalMobile = [...heroMobileImages];
      const finalLinks = [...heroLinks];
      const toDelete: string[] = [];
      for (let i = 0; i < 3; i++) {
        const dFile = heroDesktopFiles[i];
        if (dFile) {
          const path = `hero2/desktop/${Date.now()}-${Math.random().toString(36).slice(2)}-${dFile.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, dFile);
          finalDesktop[i] = await getDownloadURL(storageRef);
          const old = heroDesktopOriginal[i];
          if (old && old.startsWith("https://")) toDelete.push(old);
        }
        const mFile = heroMobileFiles[i];
        if (mFile) {
          const path = `hero2/mobile/${Date.now()}-${Math.random().toString(36).slice(2)}-${mFile.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, mFile);
          finalMobile[i] = await getDownloadURL(storageRef);
          const old = heroMobileOriginal[i];
          if (old && old.startsWith("https://")) toDelete.push(old);
        }
        // normalize link string
        finalLinks[i] = (finalLinks[i] || "").trim();
      }
      await set(dbRef(db, "homepage/hero2"), {
        desktop: finalDesktop,
        mobile: finalMobile,
        links: finalLinks,
        updatedAt: serverTimestamp(),
      });
      if (toDelete.length) {
        await Promise.allSettled(toDelete.map((u) => deleteObject(ref(storage, u))));
      }
      setHeroDesktopOriginal(finalDesktop);
      setHeroMobileOriginal(finalMobile);
      setHeroDesktopFiles([null, null, null]);
      setHeroMobileFiles([null, null, null]);
      toast({ title: "Hero updated", description: "Second hero desktop and mobile images saved." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to save hero", description: e?.message || "Unexpected error", variant: "destructive" });
    } finally {
      setHeroSaving(false);
    }
  };

  const saveHero3 = async () => {
    // Validate sizes before uploading
    const offenders: string[] = [];
    hero3DesktopFiles.forEach((f, i) => { if (f && f.size > MAX_UPLOAD_BYTES) offenders.push(`Desktop #${i + 1}`); });
    hero3MobileFiles.forEach((f, i) => { if (f && f.size > MAX_UPLOAD_BYTES) offenders.push(`Mobile #${i + 1}`); });
    if (offenders.length) {
      toast({ title: "Hero image too large", description: `${offenders.join(", ")} exceed 200 KB. Please compress and try again.`, variant: "destructive" });
      return;
    }
    setHero3Saving(true);
    try {
      const finalDesktop = [...hero3DesktopImages];
      const finalMobile = [...hero3MobileImages];
      const finalLinks = [...hero3Links];
      const toDelete: string[] = [];
      for (let i = 0; i < 3; i++) {
        const dFile = hero3DesktopFiles[i];
        if (dFile) {
          const path = `hero3/desktop/${Date.now()}-${Math.random().toString(36).slice(2)}-${dFile.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, dFile);
          finalDesktop[i] = await getDownloadURL(storageRef);
          const old = hero3DesktopOriginal[i];
          if (old && old.startsWith("https://")) toDelete.push(old);
        }
        const mFile = hero3MobileFiles[i];
        if (mFile) {
          const path = `hero3/mobile/${Date.now()}-${Math.random().toString(36).slice(2)}-${mFile.name}`;
          const storageRef = ref(storage, path);
          await uploadBytes(storageRef, mFile);
          finalMobile[i] = await getDownloadURL(storageRef);
          const old = hero3MobileOriginal[i];
          if (old && old.startsWith("https://")) toDelete.push(old);
        }
        finalLinks[i] = (finalLinks[i] || "").trim();
      }
      await set(dbRef(db, "homepage/hero3"), {
        desktop: finalDesktop,
        mobile: finalMobile,
        links: finalLinks,
        updatedAt: serverTimestamp(),
      });
      if (toDelete.length) {
        await Promise.allSettled(toDelete.map((u) => deleteObject(ref(storage, u))));
      }
      setHero3DesktopOriginal(finalDesktop);
      setHero3MobileOriginal(finalMobile);
      setHero3DesktopFiles([null, null, null]);
      setHero3MobileFiles([null, null, null]);
      toast({ title: "Hero updated", description: "Third hero desktop and mobile images saved." });
    } catch (e: any) {
      console.error(e);
      toast({ title: "Failed to save hero", description: e?.message || "Unexpected error", variant: "destructive" });
    } finally {
      setHero3Saving(false);
    }
  };

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };  // Delete a product and its images from Storage
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

  // Build and store sitemap in Realtime DB
  const regenerateSitemap = async () => {
    if (regeneratingSitemap) return;
    setRegeneratingSitemap(true);
    try {
      const snap = await get(dbRef(db, "products"));
      const val = snap.val();
      const list: any[] = val ? Object.values(val) : [];
      const envBase = import.meta.env.VITE_SITE_URL?.replace(/\/$/, "");
      const baseUrl = envBase || (typeof window !== 'undefined' ? window.location.origin : "https://example.com");
      // Base site pages
      const basePages = [
        "/",
        "/products",
        "/categories",
        "/collections",
        "/search",
        "/cart",
        "/contact",
        "/terms",
        "/privacy",
        "/shipping",
        "/returns",
        "/cancellation",
        "/faq"
      ];
      // Derive category listing paths (encode names). We keep them as /categories?cat=Name for now.
      const categoryQueryPaths = staticCategories.map(c => `/categories?cat=${encodeURIComponent(c.name)}`);
      const staticPaths = [...basePages, ...categoryQueryPaths];
      const xml = generateSitemapXml({ baseUrl, products: list, staticPaths });
      await set(dbRef(db, "sitemap/latestXml"), { xml, updatedAt: serverTimestamp() });
      toast({ title: "Sitemap updated", description: "Latest sitemap stored in database." });
      // Show a gentle warning only once per session if running without explicit VITE_SITE_URL
      if (!envBase || /example\.com$/.test(baseUrl)) {
        const key = '__sitemap_base_url_warned__';
        if (typeof sessionStorage !== 'undefined' && !sessionStorage.getItem(key)) {
          sessionStorage.setItem(key, '1');
          if (!/localhost|127\.0\.0\.1/.test(baseUrl)) {
            toast({
              title: 'Base URL not set',
              description: 'Create a .env with VITE_SITE_URL=https://babysouk.in then restart dev/build.',
            });
          } else {
            // Local dev: just info
            toast({
              title: 'Using localhost origin',
              description: 'Set VITE_SITE_URL for production sitemap before deploy.',
            });
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      toast({ title: "Sitemap failed", description: e?.message || "Unexpected error", variant: "destructive" });
    } finally {
      setRegeneratingSitemap(false);
    }
  };

  // Removed: existing images picker helpers

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <Tabs defaultValue="products">
          <TabsList className="mb-6">
            <TabsTrigger value="hero2">Second Hero</TabsTrigger>
            <TabsTrigger value="hero3">Third Hero</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>

          <TabsContent value="hero2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Edit Second Hero Section</CardTitle>
                <CardDescription>Upload three images for Desktop (3:2) and Mobile (1:1). Max 200 KB per image. Backward compatible with previous single set.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {heroLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
                ) : (
                  <>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Desktop Images (3:2)</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                          <div key={`d-${i}`} className="space-y-2">
                            <div className="aspect-[3/2] w-full overflow-hidden rounded-md border bg-muted">
                              {heroDesktopImages[i] ? (
                                <img src={heroDesktopImages[i]} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
                              )}
                            </div>
                            <Input type="file" accept="image/*" onChange={(e) => onPickHeroFile("desktop", i, e.target.files)} />
                            <p className="text-xs text-muted-foreground">Max 200 KB</p>
                            <div>
                              <Label htmlFor={`hero-link-d-${i}`}>Link URL (optional)</Label>
                              <Input
                                id={`hero-link-d-${i}`}
                                placeholder="https://example.com/path"
                                value={heroLinks[i] || ""}
                                onChange={(e) => setHeroLinks((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Mobile Images (1:1)</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                          <div key={`m-${i}`} className="space-y-2">
                            <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted">
                              {heroMobileImages[i] ? (
                                <img src={heroMobileImages[i]} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
                              )}
                            </div>
                            <Input type="file" accept="image/*" onChange={(e) => onPickHeroFile("mobile", i, e.target.files)} />
                            <p className="text-xs text-muted-foreground">Max 200 KB</p>
                            <div>
                              <Label htmlFor={`hero-link-m-${i}`}>Link URL (optional)</Label>
                              <Input
                                id={`hero-link-m-${i}`}
                                placeholder="https://example.com/path"
                                value={heroLinks[i] || ""}
                                onChange={(e) => setHeroLinks((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => { setHeroDesktopFiles([null, null, null]); setHeroMobileFiles([null, null, null]); }} disabled={heroSaving}>Reset</Button>
                <Button onClick={saveHero} disabled={heroSaving}>
                  {heroSaving ? "Saving..." : "Save Images"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="hero3">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Edit Third Hero Section</CardTitle>
                <CardDescription>Upload three images for Desktop (3:2) and Mobile (1:1). Max 200 KB per image.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {hero3Loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
                ) : (
                  <>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Desktop Images (3:2)</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                          <div key={`d3-${i}`} className="space-y-2">
                            <div className="aspect-[3/2] w-full overflow-hidden rounded-md border bg-muted">
                              {hero3DesktopImages[i] ? (
                                <img src={hero3DesktopImages[i]} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
                              )}
                            </div>
                            <Input type="file" accept="image/*" onChange={(e) => onPickHero3File("desktop", i, e.target.files)} />
                            <p className="text-xs text-muted-foreground">Max 200 KB</p>
                            <div>
                              <Label htmlFor={`hero3-link-d-${i}`}>Link URL (optional)</Label>
                              <Input
                                id={`hero3-link-d-${i}`}
                                placeholder="https://example.com/path"
                                value={hero3Links[i] || ""}
                                onChange={(e) => setHero3Links((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Mobile Images (1:1)</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((i) => (
                          <div key={`m3-${i}`} className="space-y-2">
                            <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted">
                              {hero3MobileImages[i] ? (
                                <img src={hero3MobileImages[i]} className="h-full w-full object-cover" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No image</div>
                              )}
                            </div>
                            <Input type="file" accept="image/*" onChange={(e) => onPickHero3File("mobile", i, e.target.files)} />
                            <p className="text-xs text-muted-foreground">Max 200 KB</p>
                            <div>
                              <Label htmlFor={`hero3-link-m-${i}`}>Link URL (optional)</Label>
                              <Input
                                id={`hero3-link-m-${i}`}
                                placeholder="https://example.com/path"
                                value={hero3Links[i] || ""}
                                onChange={(e) => setHero3Links((prev) => { const next = [...prev]; next[i] = e.target.value; return next; })}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-end gap-2">
                <Button variant="outline" onClick={() => { setHero3DesktopFiles([null, null, null]); setHero3MobileFiles([null, null, null]); }} disabled={hero3Saving}>Reset</Button>
                <Button onClick={saveHero3} disabled={hero3Saving}>
                  {hero3Saving ? "Saving..." : "Save Images"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Add Product</CardTitle>
                <CardDescription>Fill details and upload images. Required fields are marked.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Product Name & Price */}
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

                {/* Slug & Stock */}
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

                {/* Sale Price */}
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

                {/* Category & Subcategory */}
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

                {/* Colors */}
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

                {/* Sizes */}
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

                {/* Tags */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Tags</Label>
                    <Button type="button" variant="secondary" size="sm" onClick={() => addArrayItem("tags" as any)}>
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
                {/* Products List */}
                <div className="mt-10">
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Products</h2>
                    {!productsLoaded ? (
                      <Button size="sm" onClick={loadProducts}>
                        Load Products
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => window.location.reload()}>
                          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" onClick={regenerateSitemap} disabled={regeneratingSitemap}>
                          {regeneratingSitemap ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : 'Regenerate Sitemap'}
                        </Button>
                      </div>
                    )}
                  </div>

                  {!productsLoaded ? (
                    <div className="rounded-md border p-6 text-sm text-muted-foreground">
                      Click "Load Products" to fetch and view products.
                    </div>
                  ) : loadingProducts ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
                  ) : products.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No products yet.</div>
                  ) : (
                    <>
                      {/* Filters */}
                      <div className="mb-3 flex flex-col gap-3 md:flex-row md:items-end">
                        <div className="flex-1">
                          <Label htmlFor="p-search">Search</Label>
                          <Input
                            id="p-search"
                            placeholder="Search by name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </div>
                        <div className="w-full md:w-60">
                          <Label>Category</Label>
                          <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              {staticCategories.map((c) => (
                                <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Table */}
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Images</TableHead>
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
                                <TableCell>{p.data.images?.length || 0}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="outline" onClick={() => startEdit(p.key, p.data)}>
                                      <Edit className="mr-1 h-4 w-4" /> Edit
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => deleteProduct(p)}
                                      disabled={!!deleting[p.key]}
                                    >
                                      {deleting[p.key] ? (
                                        <>
                                          <Loader2 className="mr-1 h-4 w-4 animate-spin" /> Deleting
                                        </>
                                      ) : (
                                        <>Delete</>
                                      )}
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Pagination */}
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
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between gap-2">
                <div className="text-xs text-muted-foreground">{editKey ? `Editing ID: ${editKey}` : ""}</div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => { setForm(initialState); setEditKey(null); }} disabled={uploading}>Reset</Button>
                  <Button type="button" onClick={onSubmit} disabled={!canSubmit || uploading}>
                    {uploading ? "Saving..." : editKey ? "Update Product" : "Save Product"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;