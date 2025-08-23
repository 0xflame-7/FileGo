import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Shield, Clock, Link2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAuth from "@/hooks/use-auth";

const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6),
});

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register } = useAuth();

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left section */}
        <div className="hidden md:block">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Share Files Securely
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Upload, share, and manage your files with password protection and
              expiry controls.
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center p-4">
                <Upload className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Easy Upload</h3>
                <p className="text-sm text-gray-600">Drag & drop files up to 2GB</p>
              </div>
              <div className="text-center p-4">
                <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
                <p className="text-sm text-gray-600">
                  Password protection available
                </p>
              </div>
              <div className="text-center p-4">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Expires</h3>
                <p className="text-sm text-gray-600">
                  Set automatic expiry dates
                </p>
              </div>
              <div className="text-center p-4">
                <Link2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Shareable</h3>
                <p className="text-sm text-gray-600">
                  Generate secure download links
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right section - Auth forms */}
        <div className="w-full max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={isSignUp ? "signup" : "signin"} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin" onClick={() => setIsSignUp(false)}>
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" onClick={() => setIsSignUp(true)}>
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {/* Sign In */}
                <TabsContent value="signin" className="space-y-4">
                  <Form {...signInForm}>
                    <form
                      onSubmit={signInForm.handleSubmit((data) =>
                        login.mutate(data)
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={signInForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signInForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Enter your password"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={login.isPending}
                      >
                        {login.isPending ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                {/* Sign Up */}
                <TabsContent value="signup" className="space-y-4">
                  <Form {...signUpForm}>
                    <form
                      onSubmit={signUpForm.handleSubmit((data) =>
                        register.mutate(data)
                      )}
                      className="space-y-4"
                    >
                      <FormField
                        control={signUpForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="you@example.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={signUpForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="At least 6 characters"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={register.isPending}
                      >
                        {register.isPending
                          ? "Creating..."
                          : "Create Account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>

              {/* Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google login */}
              <Button variant="outline" className="w-full">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 
                    1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 
                    3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 
                    7.28-2.66l-3.57-2.77c-.98.66-2.23 
                    1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 
                    20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 
                    8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 
                    4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 
                    12 1 7.7 1 3.99 3.47 2.18 
                    7.07l3.66 2.84c.87-2.6 
                    3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
