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
  const placeholderPhoto = PlaceHolderImages.find(p => p.id === 'user-photo-placeholder');

  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-lg overflow-hidden border-4 border-primary/20 bg-card">
      <CardContent className="p-0">
        <div className="bg-primary/90 p-4 flex justify-between items-center text-primary-foreground">
          <div className="flex items-center gap-2">
            {campusLogo && (
              <div className="bg-white rounded-full p-1">
                <Logo className="h-8 w-8 text-primary" />
              </div>
            )}
            <span className="font-bold text-xl font-headline">CampusID</span>
          </div>
          <div className="text-right">
             <div className="font-bold text-sm uppercase tracking-wider">
               {user.role}
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gradient-to-br from-card to-accent/10">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <Image
                src={imageSrc || placeholderPhoto?.imageUrl || ''}
                alt="User photo"
                layout="fill"
                objectFit="cover"
                className="rounded-lg border-4 border-white shadow-md"
                data-ai-hint={imageSrc ? '' : placeholderPhoto?.imageHint}
              />
            </div>
            
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold">{user.firstName} {user.lastName}</h2>
              {user.initials && <p className="text-muted-foreground font-medium">{user.initials}</p>}
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
                    {user.role === "student" && user.courseCode && <p><span className="font-semibold">Course:</span> {user.courseCode}</p>}
                    <p><span className="font-semibold">Campus:</span> {user.campusName}</p>
                </div>
                 <div className="p-1 bg-white rounded-md shadow">
                    <QrCode className="w-12 h-12 text-foreground" />
                 </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
