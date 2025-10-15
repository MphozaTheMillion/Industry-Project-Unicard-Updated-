"use client";

import { useState, useEffect } from "react";
import CameraCapture from "@/components/dashboard/camera-capture";
import DigitalCard from "@/components/dashboard/digital-card";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, KeyRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CreateCardPage() {
  const { user, setCardImage } = useAuth();
  const [imageData, setImageData] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [isApiKeySaved, setIsApiKeySaved] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const savedApiKey = localStorage.getItem("geminiApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setIsApiKeySaved(true);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("geminiApiKey", apiKey);
    setIsApiKeySaved(true);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved locally.",
    });
  };

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
          {!isApiKeySaved ? (
             <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-background">
                <Alert>
                    <KeyRound className="h-4 w-4" />
                    <AlertTitle>Gemini API Key Required</AlertTitle>
                    <AlertDescription>
                        To use the AI face validation feature, you need to provide a Gemini API key. You can get one from Google AI Studio. This key will be stored securely in your browser's local storage.
                    </AlertDescription>
                </Alert>
               <div className="w-full max-w-md space-y-2">
                 <Input 
                   type="password"
                   placeholder="Enter your Gemini API key"
                   value={apiKey}
                   onChange={(e) => setApiKey(e.target.value)}
                 />
                 <Button onClick={handleSaveApiKey} className="w-full" disabled={!apiKey}>
                   Save API Key
                 </Button>
               </div>
             </div>
          ) : !imageData ? (
            <CameraCapture onPictureTaken={handlePictureTaken} apiKey={apiKey} />
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
