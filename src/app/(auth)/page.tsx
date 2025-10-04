import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, UserPlus } from "lucide-react";
import { Logo } from "@/components/logo";

export default function AuthPage() {
  return (
    <Card className="w-full max-w-sm shadow-2xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4">
           <div className="bg-primary/10 rounded-full p-4 inline-block border-4 border-primary/20">
             <UserPlus className="w-10 h-10 text-primary" />
            </div>
        </div>
        <CardTitle className="text-3xl font-headline">Get Started</CardTitle>
        <CardDescription>
          Sign in to your account or create a new one.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button asChild size="lg" className="w-full">
          <Link href="/login">
            Login
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/register">
            Sign Up
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
