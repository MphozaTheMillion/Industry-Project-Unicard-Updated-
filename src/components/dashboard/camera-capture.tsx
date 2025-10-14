"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface CameraCaptureProps {
  onPictureTaken: (image: string) => void;
}

export default function CameraCapture({ onPictureTaken }: CameraCaptureProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        // Flip the image horizontally for a mirror effect
        context.translate(video.videoWidth, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL("image/jpeg");
        onPictureTaken(dataUrl);

        if (video.srcObject) {
          (video.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-background">
      <div className="w-full max-w-md aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover transform scale-x-[-1]"
        />
        {hasCameraPermission === false && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4">
                <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature. Refresh the page after granting permissions.
                    </AlertDescription>
                </Alert>
            </div>
        )}
        {hasCameraPermission === null && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 p-4 text-center text-muted-foreground">
                <Camera className="mx-auto h-12 w-12 mb-2" />
                <p>Requesting camera access...</p>
             </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
        <Button onClick={takePicture} size="lg" className="w-full max-w-md" disabled={!hasCameraPermission}>
          <Camera className="mr-2 h-5 w-5" />
          Take Picture
        </Button>
       <p className="text-xs text-muted-foreground text-center max-w-md">Please take a professional, forward-facing photo for your ID card.</p>
    </div>
  );
}
