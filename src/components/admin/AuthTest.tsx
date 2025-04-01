
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const API_URL = "http://localhost:5000";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  domain: z.string().optional(),
});

const AuthTest = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [authResult, setAuthResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      domain: "example.com",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setAuthResult(null);
    
    try {
      // In a real app, this would call your Flask backend
      console.log("Testing authentication for:", data);
      
      /* Uncomment this for actual backend integration
      const response = await fetch(`${API_URL}/api/admin/test-auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Authentication test failed');
      }
      
      setAuthResult({
        success: result.authenticated,
        message: result.message
      });
      */
      
      // For demo purposes, we'll simulate a successful auth test
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate success or failure based on username
      const isSuccess = data.username.toLowerCase() !== "invalid";
      
      setAuthResult({
        success: isSuccess,
        message: isSuccess 
          ? "Authentication successful. User credentials are valid."
          : "Authentication failed. Invalid username or password."
      });
      
    } catch (error) {
      setAuthResult({
        success: false,
        message: error instanceof Error 
          ? error.message 
          : "An error occurred during authentication test"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
      <p className="mb-6 text-gray-600">
        Test user credentials against Active Directory to verify authentication.
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username to test" {...field} />
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
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Testing..." : "Test Authentication"}
          </Button>
        </form>
      </Form>
      
      {authResult && (
        <div className={`mt-6 p-4 rounded-md ${
          authResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
        }`}>
          <div className="flex items-center">
            {authResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            )}
            <h3 className={`font-medium ${
              authResult.success ? "text-green-800" : "text-red-800"
            }`}>
              {authResult.success ? "Authentication Successful" : "Authentication Failed"}
            </h3>
          </div>
          <p className={`mt-2 text-sm ${
            authResult.success ? "text-green-700" : "text-red-700"
          }`}>
            {authResult.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default AuthTest;
