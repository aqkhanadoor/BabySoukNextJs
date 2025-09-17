"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HeroManagement from '@/components/HeroManagement';

const HeroSectionsPage = () => {
    return (
        <div className="space-y-6 p-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hero Sections</h1>
                <p className="text-muted-foreground">
                    Manage the hero images and links for your homepage sections
                </p>
            </div>

            {/* Hero Management Tabs */}
            <Tabs defaultValue="hero2" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="hero2">Second Hero</TabsTrigger>
                    <TabsTrigger value="hero3">Third Hero</TabsTrigger>
                </TabsList>

                <TabsContent value="hero2" className="space-y-4">
                    <HeroManagement
                        heroKey="hero2"
                        title="Second Hero Section"
                        description="Upload three images for the second hero section. Desktop images should be 3:2 aspect ratio, mobile images should be 1:1 aspect ratio. Maximum 200KB per image."
                    />
                </TabsContent>

                <TabsContent value="hero3" className="space-y-4">
                    <HeroManagement
                        heroKey="hero3"
                        title="Third Hero Section"
                        description="Upload three images for the third hero section. Desktop images should be 3:2 aspect ratio, mobile images should be 1:1 aspect ratio. Maximum 200KB per image."
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default HeroSectionsPage;