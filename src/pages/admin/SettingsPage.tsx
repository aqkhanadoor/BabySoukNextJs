import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { ref as dbRef, onValue, set, serverTimestamp } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { useToast } from "@/hooks/use-toast";

const HeroManagementPage = ({ heroKey, title, description }: { heroKey: 'hero2' | 'hero3', title: string, description: string }) => {
    const MAX_UPLOAD_BYTES = 200 * 1024; // 200 KB
    const [desktopImages, setDesktopImages] = useState<string[]>(["", "", ""]);
    const [desktopFiles, setDesktopFiles] = useState<(File | null)[]>([null, null, null]);
    const [mobileImages, setMobileImages] = useState<string[]>(["", "", ""]);
    const [mobileFiles, setMobileFiles] = useState<(File | null)[]>([null, null, null]);
    const [links, setLinks] = useState<string[]>(["", "", ""]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [originalDesktop, setOriginalDesktop] = useState<string[]>(["", "", ""]);
    const [originalMobile, setOriginalMobile] = useState<string[]>(["", "", ""]);
    const { toast } = useToast();

    useEffect(() => {
        const refPath = dbRef(db, `homepage/${heroKey}`);
        const unsub = onValue(refPath, (snap) => {
            const val = snap.val() as { desktop?: string[]; mobile?: string[]; links?: string[] } | null;
            const desktop = val?.desktop || ["", "", ""];
            const mobile = val?.mobile || ["", "", ""];
            const links = val?.links || ["", "", ""];

            setDesktopImages([...desktop]);
            setOriginalDesktop([...desktop]);
            setMobileImages([...mobile]);
            setOriginalMobile([...mobile]);
            setLinks([...links]);
            setLoading(false);
        });
        return () => unsub();
    }, [heroKey]);

    const handleFilePick = (kind: "desktop" | "mobile", idx: number, files: FileList | null) => {
        if (!files || !files[0]) return;
        const file = files[0];
        if (!file.type.startsWith("image/")) {
            toast({ title: "Invalid file type", variant: "destructive" });
            return;
        }
        if (file.size > MAX_UPLOAD_BYTES) {
            toast({ title: "File too large", description: "Max 200 KB", variant: "destructive" });
            return;
        }
        const url = URL.createObjectURL(file);
        if (kind === "desktop") {
            setDesktopFiles(prev => { const next = [...prev]; next[idx] = file; return next; });
            setDesktopImages(prev => { const next = [...prev]; next[idx] = url; return next; });
        } else {
            setMobileFiles(prev => { const next = [...prev]; next[idx] = file; return next; });
            setMobileImages(prev => { const next = [...prev]; next[idx] = url; return next; });
        }
    };

    const handleDeleteImage = async (kind: "desktop" | "mobile", idx: number) => {
        const imageUrlToDelete = kind === 'desktop' ? originalDesktop[idx] : originalMobile[idx];
        const isNewFile = kind === 'desktop' ? !!desktopFiles[idx] : !!mobileFiles[idx];

        if (!imageUrlToDelete && !isNewFile) {
            toast({ title: "Nothing to delete", variant: "destructive" });
            return;
        }

        // If it's a new file not yet uploaded, just clear it from state
        if (isNewFile && !imageUrlToDelete.startsWith('https')) {
            if (kind === "desktop") {
                setDesktopFiles(prev => { const next = [...prev]; next[idx] = null; return next; });
                setDesktopImages(prev => { const next = [...prev]; next[idx] = ""; return next; });
            } else {
                setMobileFiles(prev => { const next = [...prev]; next[idx] = null; return next; });
                setMobileImages(prev => { const next = [...prev]; next[idx] = ""; return next; });
            }
            toast({ title: "Image removed" });
            return;
        }

        setSaving(true);
        try {
            // Delete from storage
            if (imageUrlToDelete) {
                await deleteObject(storageRef(storage, imageUrlToDelete));
            }

            // Update database
            const updatedImages = kind === 'desktop' ? [...desktopImages] : [...mobileImages];
            updatedImages[idx] = "";

            const fieldToUpdate = kind === 'desktop' ? 'desktop' : 'mobile';
            await set(dbRef(db, `homepage/${heroKey}/${fieldToUpdate}`), updatedImages);

            toast({ title: "Image deleted successfully" });
        } catch (error: any) {
            toast({ title: "Deletion failed", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const finalDesktop = [...desktopImages];
            const finalMobile = [...mobileImages];
            const toDelete: string[] = [];

            for (let i = 0; i < 3; i++) {
                if (desktopFiles[i]) {
                    const file = desktopFiles[i]!;
                    const path = `${heroKey}/desktop/${Date.now()}-${file.name}`;
                    const sRef = storageRef(storage, path);
                    await uploadBytes(sRef, file);
                    finalDesktop[i] = await getDownloadURL(sRef);
                    if (originalDesktop[i]) toDelete.push(originalDesktop[i]);
                }
                if (mobileFiles[i]) {
                    const file = mobileFiles[i]!;
                    const path = `${heroKey}/mobile/${Date.now()}-${file.name}`;
                    const sRef = storageRef(storage, path);
                    await uploadBytes(sRef, file);
                    finalMobile[i] = await getDownloadURL(sRef);
                    if (originalMobile[i]) toDelete.push(originalMobile[i]);
                }
            }

            await set(dbRef(db, `homepage/${heroKey}`), {
                desktop: finalDesktop,
                mobile: finalMobile,
                links: links.map(l => l.trim()),
                updatedAt: serverTimestamp(),
            });

            await Promise.allSettled(toDelete.map(url => deleteObject(storageRef(storage, url))));

            setDesktopFiles([null, null, null]);
            setMobileFiles([null, null, null]);
            toast({ title: "Hero section updated!" });
        } catch (error: any) {
            toast({ title: "Save failed", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center gap-2"><Loader2 className="animate-spin" /> Loading...</div>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Desktop Images (3:2)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map(i => (
                            <div key={`desktop-${i}`} className="space-y-2">
                                <div className="relative aspect-[3/2] w-full overflow-hidden rounded-md border bg-muted">
                                    {desktopImages[i] && (
                                        <>
                                            <img src={desktopImages[i]} className="h-full w-full object-cover" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => handleDeleteImage("desktop", i)}
                                                disabled={saving}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <Input type="file" accept="image/*" onChange={e => handleFilePick("desktop", i, e.target.files)} />
                                <Input placeholder="Link URL (optional)" value={links[i]} onChange={e => setLinks(prev => { const next = [...prev]; next[i] = e.target.value; return next; })} />
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Mobile Images (1:1)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map(i => (
                            <div key={`mobile-${i}`} className="space-y-2">
                                <div className="relative aspect-square w-full overflow-hidden rounded-md border bg-muted">
                                    {mobileImages[i] && (
                                        <>
                                            <img src={mobileImages[i]} className="h-full w-full object-cover" />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-1 right-1 h-6 w-6"
                                                onClick={() => handleDeleteImage("mobile", i)}
                                                disabled={saving}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <Input type="file" accept="image/*" onChange={e => handleFilePick("mobile", i, e.target.files)} />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
            <div className="p-6 flex justify-end">
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? <><Loader2 className="mr-2 animate-spin" /> Saving...</> : "Save Changes"}
                </Button>
            </div>
        </Card>
    );
};

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <HeroManagementPage
                heroKey="hero2"
                title="Second Hero Section"
                description="Upload three images for Desktop (3:2) and Mobile (1:1). Max 200 KB per image."
            />
            <HeroManagementPage
                heroKey="hero3"
                title="Third Hero Section"
                description="Upload three images for Desktop (3:2) and Mobile (1:1). Max 200 KB per image."
            />
        </div>
    );
};

export default SettingsPage;
