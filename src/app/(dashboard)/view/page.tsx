"use client";

import DigitalCard from "@/components/dashboard/digital-card";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ViewCardPage() {
  const { user, cardImage } = useAuth();

  if (!user) {
    return null; // Or loading state
  }

  if (!cardImage) {
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

  return (
    <div className="container mx-auto flex flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Your Digital ID Card</h1>
        <p className="text-muted-foreground">
          Present this card for verification on campus.
        </p>
      </div>
      <DigitalCard user={user} imageSrc={cardImage} />
    </div>
  );
}
