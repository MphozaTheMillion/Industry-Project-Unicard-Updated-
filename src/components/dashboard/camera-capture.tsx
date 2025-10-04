"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CameraCaptureProps {
  onPictureTaken: (image: string) => void;
}

export default function CameraCapture({ onPictureTaken }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startCamera = useCallback(async () => {
    setError(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      let message = "Could not access the camera. Please check permissions.";
      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          message = "Camera access was denied. Please enable it in your browser settings.";
        } else if (err.name === "NotFoundError") {
          message = "No camera found on this device.";
        }
      }
      setError(message);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: message,
      });
    }
  }, [stream, toast]);

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL("image/jpeg");
        onPictureTaken(dataUrl);
        stream?.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-background">
      <div className="w-full max-w-md aspect-video bg-muted rounded-md overflow-hidden flex items-center justify-center">
        {stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center text-muted-foreground p-4">
            <Camera className="mx-auto h-12 w-12 mb-2" />
            <p>Camera feed will appear here.</p>
            {error && <p className="text-destructive-foreground mt-2">{error}</p>}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {stream ? (
        <Button onClick={takePicture} size="lg" className="w-full max-w-md">
          <Camera className="mr-2 h-5 w-5" />
          Take Picture
        </Button>
      ) : (
        <Button onClick={startCamera} size="lg" className="w-full max-w-md">
          <RefreshCw className="mr-2 h-5 w-5" />
          {error ? 'Try Again' : 'Start Camera'}
        </Button>
      )}
       <p className="text-xs text-muted-foreground text-center max-w-md">Please take a professional, forward-facing photo for your ID card.</p>
    </div>
  );
}
