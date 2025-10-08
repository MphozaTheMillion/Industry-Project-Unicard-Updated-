"use client";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { CreditCard, Eye, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'admin') {
      router.replace('/admin');
    } else if (user?.role === 'technician') {
      router.replace('/technician');
    }
  }, [user, router]);

  // Render dashboard for student and staff
  if (user?.role !== 'student' && user?.role !== 'staff') {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Manage your digital ID card from here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/create" className="group">
          <Card className="hover:border-primary hover:shadow-lg transition-all h-full flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              <div className="p-3 rounded-md bg-primary/10">
                <CreditCard className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-grow">
                <CardTitle>Create Digital Card</CardTitle>
                <CardDescription>Get your new ID card.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Use your device's camera to take a professional photo and generate your new digital ID card.
              </p>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end">
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        </Link>
        <Link href="/view" className="group">
          <Card className="hover:border-primary hover:shadow-lg transition-all h-full flex flex-col">
            <CardHeader className="flex-row items-center gap-4">
              <div className="p-3 rounded-md bg-primary/10">
                <Eye className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-grow">
                <CardTitle>View Digital Card</CardTitle>
                <CardDescription>Display your current ID.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">
                Display your existing digital ID card. You can show this card for verification on campus.
              </p>
            </CardContent>
            <div className="p-6 pt-0 flex justify-end">
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
