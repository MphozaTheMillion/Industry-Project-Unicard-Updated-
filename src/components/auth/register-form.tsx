
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

const baseSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }).regex(/^[a-zA-Z-.' ]+$/, { message: "First name can only contain letters."}),
  lastName: z.string().min(1, { message: "Last name is required." }).regex(/^[a-zA-Z-.' ]+$/, { message: "Last name can only contain letters."}),
  initials: z.string().max(3, { message: "Initials cannot be more than 3 characters."}).optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters." }),
  campusName: z.string().min(1, { message: "Campus name is required." }),
});

const studentSchema = baseSchema.extend({
  role: z.literal("student"),
  studentNumber: z.string().length(9, { message: "Student number must be 9 digits." }).regex(/^\d{9}$/, { message: "Student number must only contain digits." }),
  courseCode: z.string().min(1, { message: "Course code is required." }),
  email: z.string().email({ message: "Invalid email address." }).regex(/^\d{9}@tut4life\.ac\.za$/, { message: "Student email must be a 9-digit number followed by @tut4life.ac.za"}),
}).refine(data => data.email.startsWith(data.studentNumber), {
    message: "Student number must match the number in the email address.",
    path: ['email'],
});

const staffSchema = baseSchema.extend({
  role: z.literal("staff"),
  department: z.string().min(1, { message: "Department is required." }),
  email: z.string().email({ message: "Invalid email address." }),
});

const adminSchema = baseSchema.extend({
  role: z.literal("admin"),
  email: z.string().email({ message: "Invalid email address." }),
});

const technicianSchema = baseSchema.extend({
  role: z.literal("technician"),
  email: z.string().email({ message: "Invalid email address." }),
});

const formSchema = z.discriminatedUnion("role", [studentSchema, staffSchema, adminSchema, technicianSchema]);

type FormData = z.infer<typeof formSchema>;

export function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>("student");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "student",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      campusName: "Main Campus",
      studentNumber: "",
      courseCode: "",
    },
  });
  
  function onSubmit(values: FormData) {
    // We can omit password from the user object we store
    const { password, ...newUser } = values;

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
    const newDefaults = {
        role: newRole,
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        campusName: "Main Campus",
        studentNumber: "",
        courseCode: "",
        department: ""
    };

    if (newRole === 'student') {
        form.reset(newDefaults);
    } else if (newRole === 'staff') {
        form.reset({
            ...newDefaults,
            studentNumber: undefined,
            courseCode: undefined
        });
    } else {
         form.reset({
            ...newDefaults,
            studentNumber: undefined,
            courseCode: undefined,
            department: undefined
        });
    }

    form.setValue("role", newRole);
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
                  onValueChange={(value: UserRole) => handleRoleChange(value)}
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
                 <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="123456789@tut4life.ac.za" {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="courseCode" render={({ field }) => ( <FormItem><FormLabel>Course Code</FormLabel><FormControl><Input placeholder="COS301" {...field} /></FormControl><FormMessage /></FormItem> )} />
            </>
        )}
        
        {role !== 'student' && (
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="name@example.com" {...field} /></FormControl><FormMessage /></FormItem> )} />
        )}
        
        <FormField control={form.control} name="password" render={({ field }) => ( <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl><FormMessage /></FormItem> )} />

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

    