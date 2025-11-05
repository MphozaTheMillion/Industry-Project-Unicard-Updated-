
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { User } from "@/context/auth-context";

export default function AdminDashboardPage() {
  const { users, removeUser, user: currentUser } = useAuth();
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
  }

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const dateA = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
      const dateB = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
      return dateB - dateA;
    });
  }, [users]);

  const handleDeleteUser = () => {
    if (userToDelete) {
      removeUser(userToDelete.email);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <div className="container mx-auto">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Administrator Dashboard
          </h1>
          <p className="text-muted-foreground">
            View and manage all registered users.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Avatar>
                              <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-muted-foreground">{user.department || user.studentNumber}</p>
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="capitalize bg-green-500 hover:bg-green-600 text-white">{user.role}</Badge>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.lastLogin ? `${formatDistanceToNow(new Date(user.lastLogin))} ago` : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                       <Button 
                         variant="destructive" 
                         size="icon" 
                         onClick={() => setUserToDelete(user)}
                         disabled={user.email === currentUser?.email}
                        >
                         <Trash2 className="h-4 w-4" />
                         <span className="sr-only">Remove user</span>
                       </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account for <span className="font-semibold">{userToDelete?.email}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Remove User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
