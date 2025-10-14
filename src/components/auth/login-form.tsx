
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth, type UserRole } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import type { User } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(7, { message: "Password must be at least 7 characters." }).regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character."}),
  role: z.enum(["student", "staff", "admin", "technician"], {
    required_error: "You need to select a role.",
  }),
  workCode: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.role === 'student') {
        const studentEmailRegex = /^\d{9}@tut4life\.ac\.za$/;
        if (!studentEmailRegex.test(data.email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['email'],
                message: 'Student email must be a 9-digit number followed by @tut4life.ac.za',
            });
        }
    } else if (data.role === 'staff' || data.role === 'admin' || data.role === 'technician') {
        const staffEmailRegex = /@outlook\.com$/;
        if (!staffEmailRegex.test(data.email)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['email'],
                message: `Campus ${data.role} email must end with @outlook.com`,
            });
        }
    }
    if (data.role === 'admin' || data.role === 'technician') {
      if (!data.workCode || data.workCode.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["workCode"],
          message: `Work code is required for ${data.role}.`,
        });
      }
    }
});


export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "student",
      workCode: "",
    },
  });

  const role = form.watch("role") as UserRole;

  function onSubmit(values: z.infer<typeof formSchema>) {
    const role = values.role as UserRole;
    
    const success = login({
      role,
      email: values.email,
      workCode: values.workCode,
    });

    if (success) {
      if (role === 'admin') {
          router.push("/admin");
      } else if (role === 'technician') {
          router.push('/technician');
      } else {
          router.push("/dashboard");
      }
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials or account not found. Please check your details or sign up.",
      })
    }
  }
  
  const getEmailPlaceholder = (role: UserRole) => {
    switch (role) {
      case 'student':
        return 'studentnumber@tut4life.ac.za';
      case 'staff':
      case 'admin':
      case 'technician':
        return 'name@outlook.com';
      default:
        return 'name@example.com';
    }
  }

  const getWorkCodePlaceholder = (role: UserRole) => {
    switch(role) {
        case 'admin':
            return 'ADMIN123';
        case 'technician':
            return 'TECH123';
        default:
            return '';
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I am a...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 gap-4"
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="student" />
                    </FormControl>
                    <FormLabel className="font-normal">Student</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="staff" />
                    </FormControl>
                    <FormLabel className="font-normal">Campus Staff</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="admin" />
                    </FormControl>
                    <FormLabel className="font-normal">Administrator</FormLabel>
                  </FormItem>
                   <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="technician" />
                    </FormControl>
                    <FormLabel className="font-normal">Technician</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder={getEmailPlaceholder(role)} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {(role === 'admin' || role === 'technician') && (
          <FormField
            control={form.control}
            name="workCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Code</FormLabel>
                <FormControl>
                  <Input placeholder={getWorkCodePlaceholder(role)} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" size="lg">
          Login
        </Button>
      </form>
    </Form>
  );
}
