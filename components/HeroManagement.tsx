"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRevalidation } from '@/lib/revalidation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
    Save,
    Loader2,
    ImageIcon,
    X,
    Upload
} from 'lucide-react';
import { realtimeDb, storage } from '@/lib/firebase';
import { ref as dbRef, onValue, set, serverTimestamp } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

interface HeroSectionProps {
    heroKey: 'hero2' | 'hero3';
    title: string;
    description: string;
}

const HeroManagement = ({ heroKey, title, description }: HeroSectionProps) => {
    const { toast } = useToast();
    const { revalidate } = useRevalidation();
    const MAX_UPLOAD_BYTES = 200 * 1024; // 200 KB

    // State for images and files
    const [desktopImages, setDesktopImages] = useState<string[]>(["", "", ""]);
    const [desktopFiles, setDesktopFiles] = useState<(File | null)[]>([null, null, null]);
    const [mobileImages, setMobileImages] = useState<string[]>(["", "", ""]);
    const [mobileFiles, setMobileFiles] = useState<(File | null)[]>([null, null, null]);
    const [links, setLinks] = useState<string[]>(["", "", ""]);

    // Loading and saving states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Track original images for cleanup
    const [originalDesktop, setOriginalDesktop] = useState<string[]>(["", "", ""]);
    const [originalMobile, setOriginalMobile] = useState<string[]>(["", "", ""]);

    // Load hero data from Firebase Realtime Database
    useEffect(() => {
        const heroRef = dbRef(realtimeDb, `homepage/${heroKey}`);
        const unsubscribe = onValue(heroRef, (snapshot) => {
            const data = snapshot.val() as {
                desktop?: string[];
                mobile?: string[];
                links?: string[]
            } | null;

            if (data) {
                const desktop = data.desktop || ["", "", ""];
                const mobile = data.mobile || ["", "", ""];
                const heroLinks = data.links || ["", "", ""];

                setDesktopImages(desktop);
                setMobileImages(mobile);
                setLinks(heroLinks);
                setOriginalDesktop(desktop);
                setOriginalMobile(mobile);
            } else {
                // Initialize with empty data if no existing data
                const emptyData = {
                    desktop: ["", "", ""],
                    mobile: ["", "", ""],
                    links: ["", "", ""]
                };
                set(heroRef, emptyData);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [heroKey]);

    // Handle file selection for desktop images
    const handleDesktopFileChange = (index: number, files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.size > MAX_UPLOAD_BYTES) {
            toast({
                title: "File too large",
                description: `Image must be under 200KB. Current size: ${Math.round(file.size / 1024)}KB`,
                variant: "destructive"
            });
            return;
        }

        const newFiles = [...desktopFiles];
        newFiles[index] = file;
        setDesktopFiles(newFiles);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        const newImages = [...desktopImages];
        newImages[index] = previewUrl;
        setDesktopImages(newImages);
    };

    // Handle file selection for mobile images
    const handleMobileFileChange = (index: number, files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.size > MAX_UPLOAD_BYTES) {
            toast({
                title: "File too large",
                description: `Image must be under 200KB. Current size: ${Math.round(file.size / 1024)}KB`,
                variant: "destructive"
            });
            return;
        }

        const newFiles = [...mobileFiles];
        newFiles[index] = file;
        setMobileFiles(newFiles);

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        const newImages = [...mobileImages];
        newImages[index] = previewUrl;
        setMobileImages(newImages);
    };

    // Remove image
    const removeImage = (type: 'desktop' | 'mobile', index: number) => {
        if (type === 'desktop') {
            const newImages = [...desktopImages];
            const newFiles = [...desktopFiles];
            newImages[index] = "";
            newFiles[index] = null;
            setDesktopImages(newImages);
            setDesktopFiles(newFiles);
        } else {
            const newImages = [...mobileImages];
            const newFiles = [...mobileFiles];
            newImages[index] = "";
            newFiles[index] = null;
            setMobileImages(newImages);
            setMobileFiles(newFiles);
        }
    };

    // Handle link change
    const handleLinkChange = (index: number, value: string) => {
        const newLinks = [...links];
        newLinks[index] = value;
        setLinks(newLinks);
    };

    // Save hero section
    const saveHeroSection = async () => {
        setSaving(true);
        try {
            const finalDesktop = [...desktopImages];
            const finalMobile = [...mobileImages];
            const toDelete: string[] = [];

            // Upload new desktop files
            for (let i = 0; i < 3; i++) {
                const file = desktopFiles[i];
                if (file) {
                    const path = `${heroKey}/desktop/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
                    const uploadRef = storageRef(storage, path);
                    await uploadBytes(uploadRef, file);
                    finalDesktop[i] = await getDownloadURL(uploadRef);

                    // Mark old image for deletion
                    const old = originalDesktop[i];
                    if (old && old.startsWith("https://")) {
                        toDelete.push(old);
                    }
                }
            }

            // Upload new mobile files
            for (let i = 0; i < 3; i++) {
                const file = mobileFiles[i];
                if (file) {
                    const path = `${heroKey}/mobile/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
                    const uploadRef = storageRef(storage, path);
                    await uploadBytes(uploadRef, file);
                    finalMobile[i] = await getDownloadURL(uploadRef);

                    // Mark old image for deletion
                    const old = originalMobile[i];
                    if (old && old.startsWith("https://")) {
                        toDelete.push(old);
                    }
                }
            }

            // Save to Realtime Database
            const heroRef = dbRef(realtimeDb, `homepage/${heroKey}`);
            await set(heroRef, {
                desktop: finalDesktop,
                mobile: finalMobile,
                links: links,
                updatedAt: serverTimestamp()
            });

            // Delete old images from storage
            for (const url of toDelete) {
                try {
                    const deleteRef = storageRef(storage, url);
                    await deleteObject(deleteRef);
                } catch (error) {
                    console.warn('Failed to delete old image:', url);
                }
            }

            // Reset file states
            setDesktopFiles([null, null, null]);
            setMobileFiles([null, null, null]);
            setOriginalDesktop(finalDesktop);
            setOriginalMobile(finalMobile);

            toast({
                title: "Success",
                description: `${title} updated successfully`
            });

            // Trigger ISR revalidation for homepage
            try {
                await revalidate({ type: 'hero-content' });
                console.log('Homepage ISR revalidation triggered successfully');
            } catch (error) {
                console.warn('ISR revalidation failed:', error);
                // Don't show error to user as the hero was saved successfully
            }

        } catch (error) {
            console.error('Error saving hero section:', error);
            toast({
                title: "Error",
                description: "Failed to save hero section",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Desktop Images Section */}
                <div>
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Desktop Images (3:2 aspect ratio)</h3>
                        <p className="text-xs text-muted-foreground">Recommended size: 1200x800px, Max 200KB each</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => (
                            <div key={`desktop-${index}`} className="space-y-2">
                                <div className="aspect-[3/2] w-full overflow-hidden rounded-md border bg-muted relative">
                                    {desktopImages[index] ? (
                                        <>
                                            <Image
                                                src={desktopImages[index]}
                                                alt={`Desktop hero image ${index + 1}`}
                                                width={300}
                                                height={200}
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage('desktop', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleDesktopFileChange(index, e.target.files)}
                                />
                                <div className="space-y-1">
                                    <Label htmlFor={`desktop-link-${index}`} className="text-xs">
                                        Link URL (optional)
                                    </Label>
                                    <Input
                                        id={`desktop-link-${index}`}
                                        placeholder="https://example.com/path"
                                        value={links[index] || ""}
                                        onChange={(e) => handleLinkChange(index, e.target.value)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mobile Images Section */}
                <div>
                    <div className="mb-4">
                        <h3 className="text-sm font-medium text-muted-foreground">Mobile Images (1:1 aspect ratio)</h3>
                        <p className="text-xs text-muted-foreground">Recommended size: 800x800px, Max 200KB each</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[0, 1, 2].map((index) => (
                            <div key={`mobile-${index}`} className="space-y-2">
                                <div className="aspect-square w-full overflow-hidden rounded-md border bg-muted relative">
                                    {mobileImages[index] ? (
                                        <>
                                            <Image
                                                src={mobileImages[index]}
                                                alt={`Mobile hero image ${index + 1}`}
                                                width={200}
                                                height={200}
                                                className="h-full w-full object-cover"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-2 right-2"
                                                onClick={() => removeImage('mobile', index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center">
                                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleMobileFileChange(index, e.target.files)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <Button onClick={saveHeroSection} disabled={saving}>
                        {saving ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        Save {title}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default HeroManagement;