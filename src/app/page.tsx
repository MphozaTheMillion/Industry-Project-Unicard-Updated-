import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, IdCard } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-background">
      <div className="flex-grow flex flex-col items-center justify-center text-center gap-8">
        <div className="rounded-full bg-primary/10 p-6 border-8 border-primary/20">
          <Logo className="h-24 w-24 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-foreground sm:text-5xl md:text-6xl font-headline">
            Welcome to CampusID
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Your digital student card, always with you.
          </p>
        </div>
      </div>
      <div className="w-full max-w-xs">
        <Button asChild size="lg" className="w-full text-lg py-7">
          <Link href="/login">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </main>
  );
}
