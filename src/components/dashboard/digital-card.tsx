import Image from "next/image";
import type { User } from "@/context/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Logo } from "../logo";
import { QrCode } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface DigitalCardProps {
  user: User;
  imageSrc: string | null;
}

export default function DigitalCard({ user, imageSrc }: DigitalCardProps) {
  const campusLogo = PlaceHolderImages.find(p => p.id === 'campus-logo');

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden border-4 border-primary/20 bg-card">
      <CardContent className="p-0">
        <div className="bg-primary/10 p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            {campusLogo && (
              <Image 
                src={campusLogo.imageUrl} 
                alt="Campus Logo" 
                width={40} 
                height={40}
                data-ai-hint={campusLogo.imageHint}
                className="rounded-full"
              />
            )}
            <span className="font-bold text-lg text-primary-foreground font-headline">CampusID</span>
          </div>
          <div className="text-right">
             <div className="font-bold text-sm uppercase text-primary-foreground tracking-wider">
               {user.role}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
              <Image
                src={imageSrc || PlaceHolderImages.find(p => p.id === 'user-photo-placeholder')?.imageUrl || ''}
                alt="User photo"
                layout="fill"
                objectFit="cover"
                className="rounded-lg border-4 border-white shadow-md"
                data-ai-hint={imageSrc ? '' : PlaceHolderImages.find(p => p.id === 'user-photo-placeholder')?.imageHint}
              />
            </div>
            
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              <p className="text-muted-foreground font-medium">{user.initials}</p>
              {user.role === 'student' ? (
                 <p className="text-primary font-semibold">{user.studentNumber}</p>
              ) : (
                <p className="text-primary font-semibold">{user.department}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-4">
            <div className="flex justify-between items-center">
                 <div className="text-sm space-y-1">
                    <p><span className="font-semibold">Course:</span> {user.courseCode}</p>
                    <p><span className="font-semibold">Campus:</span> {user.campusName}</p>
                </div>
                 <div className="p-1 bg-white rounded-md">
                    <QrCode className="w-12 h-12 text-foreground" />
                 </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
