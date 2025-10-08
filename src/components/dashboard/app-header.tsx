"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";
import { Logo } from "../logo";
import { CreditCard, Eye, LayoutDashboard, LogOut, Menu, ShieldCheck, UserCog } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { useState } from "react";

export default function AppHeader() {
  const { user, logout, cardImage } = useAuth();
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  
  const initials = `${user?.firstName?.[0] || ""}${user?.lastName?.[0] || ""}`;

  let navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { href: "/create", label: "Create Card", icon: <CreditCard className="mr-2 h-4 w-4" /> },
    { href: "/view", label: "View Card", icon: <Eye className="mr-2 h-4 w-4" /> },
  ];

  if (user?.role === 'admin') {
    navLinks = [{ href: "/admin", label: "User Management", icon: <UserCog className="mr-2 h-4 w-4" /> }];
  } else if (user?.role === 'technician') {
    navLinks = [{ href: "/technician", label: "App Health", icon: <ShieldCheck className="mr-2 h-4 w-4" /> }];
  }

  const NavItems = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant="ghost" asChild onClick={() => setSheetOpen(false)}>
          <Link href={link.href} className="flex items-center justify-start">
            {link.icon}{link.label}
          </Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={user?.role === 'admin' ? '/admin' : user?.role === 'technician' ? '/technician' : '/dashboard'} className="flex items-center gap-2 font-bold">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline hidden sm:inline-block">CampusID</span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <NavItems />
          </nav>
        </div>

        <div className="flex items-center gap-4">
           <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <div className="flex flex-col gap-4 mt-8">
                       <NavItems />
                    </div>
                </SheetContent>
              </Sheet>
           </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.role === 'student' || user?.role === 'staff' ? cardImage || '' : ''} alt="User avatar" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
