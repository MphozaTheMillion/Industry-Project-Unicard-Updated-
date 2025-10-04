"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function WelcomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace("/dashboard");
      }
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-24 w-24 text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your session...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background text-center">
      <div className="flex-grow flex flex-col items-center justify-center gap-8">
        <div className="rounded-full bg-primary/10 p-6 border-8 border-primary/20">
          <Logo className="h-24 w-24 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl font-headline">
            Welcome to CampusID
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Your digital student and staff card, always with you.
          </p>
        </div>
         <Button asChild size="lg" className="w-full max-w-xs text-lg py-7 mt-8">
          <Link href="/login">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
       <footer className="py-4">
        <p className="text-xs text-muted-foreground">Powered by Firebase & Google AI</p>
      </footer>
    </main>
  );
}
