
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
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useAuth, type User, type UserRole } from "@/context/auth-context";
import { Eye, EyeOff } from "lucide-react";

const baseSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }).regex(/^[a-zA-Z]+$/, { message: "First name should only contain letters." }),
  lastName: z.string().min(1, { message: "Last name is required." }).regex(/^[a-zA-Z]+$/, { message: "Last name should only contain letters." }),
  initials: z.string().max(3).optional(),
  email: z.string().min(1, { message: "Email is required." }).email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }).regex(/[^a-zA-Z0-9]/, { message: "Password must contain at least one special character."}),
  confirmPassword: z.string().min(1, { message: "Please confirm your password." }),
  campusName: z.string().min(1, { message: "Campus name is required." }),
});

const studentSchema = baseSchema.extend({
  role: z.literal("student"),
  studentNumber: z.string().min(1, { message: "Student number is required." }),
  courseCode: z.string().min(1, { message: "Course code is required." }),
});

const staffSchema = baseSchema.extend({
  role: z.literal("staff"),
  department: z.string().min(1, { message: "Department is required." }),
});

const adminSchema = baseSchema.extend({
  role: z.literal("admin"),
});

const technicianSchema = baseSchema.extend({
  role: z.literal("technician"),
});

const formSchema = z.discriminatedUnion("role", [studentSchema, staffSchema, adminSchema, technicianSchema])
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});


type FormData = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { register, users } = useAuth();
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "student",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      campusName: "Main Campus",
      studentNumber: "",
      courseCode: "",
    },
  });
  
  function onSubmit(values: FormData) {
    if (values.role === 'student') {
      const studentNumberExists = users.some(u => u.role === 'student' && u.studentNumber === values.studentNumber);
      if (studentNumberExists) {
        form.setError("studentNumber", {
            type: "manual",
            message: "This student number has already been used to create an account.",
        });
        return;
      }
    }

    // We can omit password from the user object we store
    const { password, confirmPassword, ...newUser } = values;

    // Generate initials if not provided
    if (!newUser.initials) {
      newUser.initials = `${newUser.firstName?.[0] ?? ''}${newUser.lastName?.[0] ?? ''}`.toUpperCase();
    }
    
    const success = register(newUser as Omit<User, 'lastLogin'>);

    if (success) {
      toast({
        title: "Account Created!",
        description: "You have successfully registered. Please log in.",
      });
      router.push("/login");
    } else {
       toast({
        variant: "destructive",
        title: "Registration Failed",
        description: "An account with this email already exists.",
      });
    }
  }

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    
    // Create a fresh set of default values for the new role
    const newDefaults: any = {
        role: newRole,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        campusName: "Main Campus",
        studentNumber: "",
        courseCode: "",
        department: ""
    };
    
    form.reset(newDefaults);
  }

  const getEmailPlaceholder = (role: UserRole) => {
    switch (role) {
      case 'student':
        return 'studentnumber@tut4life.ac.za';
      case 'staff':
      case 'admin':
        return 'name@outlook.com';
      default:
        return 'name@example.com';
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>I am a...</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleRoleChange(value as UserRole);
                  }}
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
        
        <div className="grid grid-cols-2 gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input placeholder="John" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input placeholder="Doe" {...field} /></FormControl><FormMessage /></FormItem> )} />
        </div>
        
        {role === 'student' && (
            <>
                <FormField control={form.control} name="studentNumber" render={({ field }) => ( <FormItem><FormLabel>Student Number</FormLabel><FormControl><Input placeholder="123456789" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="courseCode" render={({ field }) => ( <FormItem><FormLabel>Course Code</FormLabel><FormControl><Input placeholder="COS301" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </>
        )}
        
        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder={getEmailPlaceholder(role)} {...field} /></FormControl><FormMessage /></FormItem> )} />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {role === 'staff' && (
             <FormField control={form.control} name="department" render={({ field }) => ( <FormItem><FormLabel>Department</FormLabel><FormControl><Input placeholder="School of Computing" {...field} /></FormControl><FormMessage /></FormItem> )} />
        )}
        
        <FormField control={form.control} name="campusName" render={({ field }) => ( <FormItem><FormLabel>Campus Name</FormLabel><FormControl><Input placeholder="Main Campus" {...field} /></FormControl><FormMessage /></FormItem> )} />

        <Button type="submit" className="w-full" size="lg">
          Submit
        </Button>
      </form>
    </Form>
  );
}
