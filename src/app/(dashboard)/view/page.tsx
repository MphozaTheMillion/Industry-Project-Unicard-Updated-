
"use client";

import { useState } from "react";
import DigitalCard from "@/components/dashboard/digital-card";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CameraCapture from "@/components/dashboard/camera-capture";
import { useToast } from "@/hooks/use-toast";
import { verifyFaceMatch } from "@/ai/flows/verify-face-match-flow";
import { Loader2 } from "lucide-react";

export default function ViewCardPage() {
  const { user, cardData } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleVerificationPicture = async (image: string) => {
    if (!cardData?.image) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No saved card image found to verify against.",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const result = await verifyFaceMatch({
        savedPhotoDataUri: cardData.image,
        verificationPhotoDataUri: image,
      });

      if (result.isMatch) {
        toast({
          title: "Verification Successful",
          description: "You can now view your card.",
        });
        setIsVerified(true);
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: `Faces do not match. Reason: ${result.reason}. Please try again.`,
        });
      }
    } catch (error) {
      console.error("Face verification failed:", error);
      toast({
        variant: "destructive",
        title: "Verification Error",
        description: "An error occurred during verification. Please try again.",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  if (!user) {
    return null; // Or loading state
  }

  if (!cardData) {
    return (
      <div className="container mx-auto">
        <Card className="text-center">
            <CardHeader>
                <CardTitle>No Digital Card Found</CardTitle>
                <CardDescription>
                You haven&apos;t created your digital ID card yet.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button asChild>
                    <Link href="/create">Create Your Card Now</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="container mx-auto flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Your Digital ID Card</h1>
          <p className="text-muted-foreground">
            Present this card for verification on campus.
          </p>
        </div>
        <DigitalCard user={user} imageSrc={cardData.image} />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Verify Your Identity</CardTitle>
          <CardDescription>To view your card, please take a quick verification photo.</CardDescription>
        </CardHeader>
        <CardContent>
          {isVerifying ? (
             <div className="flex flex-col items-center justify-center gap-4 p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Verifying your identity, please wait...</p>
             </div>
          ) : (
             <CameraCapture onPictureTaken={handleVerificationPicture} validationMode={false} captureButtonText="Verify Photo" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
