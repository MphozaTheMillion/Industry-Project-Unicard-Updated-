"use client";

import { useState } from "react";
import CameraCapture from "@/components/dashboard/camera-capture";
import DigitalCard from "@/components/dashboard/digital-card";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateCardPage() {
  const { user, setCardImage } = useAuth();
  const [imageData, setImageData] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handlePictureTaken = (image: string) => {
    setImageData(image);
  };

  const handleSaveCard = () => {
    if (imageData) {
      setCardImage(imageData);
      toast({
        title: "Success!",
        description: "Your digital card has been saved.",
      });
      router.push("/view");
    }
  };

  const handleRetake = () => {
    setImageData(null);
  };

  if (!user) {
    return null; // or a loading skeleton
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {imageData ? "Preview Your Card" : "Create Your Digital Card"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!imageData ? (
            <CameraCapture onPictureTaken={handlePictureTaken} />
          ) : (
            <div className="flex flex-col items-center gap-8">
              <DigitalCard user={user} imageSrc={imageData} />
              <div className="flex flex-wrap gap-4">
                <Button onClick={handleSaveCard} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  Save Card
                </Button>
                <Button onClick={handleRetake} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retake Picture
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
