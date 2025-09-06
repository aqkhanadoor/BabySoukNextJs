import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const [heroImages, setHeroImages] = useState<(File | null)[]>([null, null, null]);
  const [previews, setPreviews] = useState<(string | null)[]>([null, null, null]);
  const { toast } = useToast();

  const handleImageUpload = (index: number, file: File | null) => {
    if (file && !file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    const newImages = [...heroImages];
    const newPreviews = [...previews];
    
    newImages[index] = file;
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews[index] = e.target?.result as string;
        setPreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    } else {
      newPreviews[index] = null;
      setPreviews(newPreviews);
    }
    
    setHeroImages(newImages);
  };

  const removeImage = (index: number) => {
    handleImageUpload(index, null);
  };

  const handleSave = () => {
    const uploadedImages = heroImages.filter(img => img !== null);
    
    if (uploadedImages.length === 0) {
      toast({
        title: "No images selected",
        description: "Please upload at least one hero image.",
        variant: "destructive",
      });
      return;
    }

    // In a real application, you would upload these images to your server
    // For now, we'll just show a success message
    toast({
      title: "Images saved successfully",
      description: `${uploadedImages.length} hero image(s) have been saved.`,
    });
  };

  const ImageUploadSlot = ({ index }: { index: number }) => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Hero Image {index + 1}</CardTitle>
        <CardDescription>Upload a hero image (max 5MB)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {previews[index] ? (
          <div className="relative">
            <img
              src={previews[index]!}
              alt={`Hero ${index + 1}`}
              className="w-full h-48 object-cover rounded-md border"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="absolute bottom-2 left-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(previews[index]!, '_blank')}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <Label htmlFor={`hero-${index}`} className="cursor-pointer">
              <span className="text-primary hover:underline">Click to upload</span>
              <span className="text-muted-foreground"> or drag and drop</span>
            </Label>
            <p className="text-sm text-muted-foreground mt-2">
              PNG, JPG, GIF up to 5MB
            </p>
          </div>
        )}
        
        <Input
          id={`hero-${index}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            handleImageUpload(index, file);
          }}
        />
        
        {!previews[index] && (
          <Label htmlFor={`hero-${index}`}>
            <Button variant="outline" className="w-full" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Choose Image
              </span>
            </Button>
          </Label>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage your hero images. You can upload up to 3 hero images.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[0, 1, 2].map((index) => (
            <ImageUploadSlot key={index} index={index} />
          ))}
        </div>

        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={handleSave}
            className="px-8"
          >
            Save Hero Images
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Admin;