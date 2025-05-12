
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthAPI, demoUser } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LogIn, UserPlus, Loader } from "lucide-react";
import { useSearchParams } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemoMode = searchParams.get("demo") === "true";
  
  // Check if user is already logged in
  useEffect(() => {
    if (AuthAPI.isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  // Login state
  const [loginData, setLoginData] = useState({
    email: isDemoMode ? demoUser.email : "",
    password: isDemoMode ? demoUser.password : "",
  });
  const [loginLoading, setLoginLoading] = useState(false);

  // Registration state
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerLoading, setRegisterLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      // Check if the user is using demo credentials
      const isUsingDemoCredentials = 
        loginData.email === demoUser.email && loginData.password === demoUser.password;

      await AuthAPI.login(loginData.email, loginData.password);
      
      toast({
        title: "Login successful",
        description: isUsingDemoCredentials ? 
          "Welcome to the TravelTales Demo! You can create posts, like content, and follow users." : 
          "Welcome back to TravelTales!",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.response?.data?.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
      console.error("Login error:", error);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setRegisterLoading(true);

    try {
      await AuthAPI.register(
        registerData.username,
        registerData.email,
        registerData.password
      );
      toast({
        title: "Registration successful",
        description: "Your account has been created. Please sign in.",
      });
      // Switch to login tab
      document.getElementById("login-tab")?.click();
      // Clear the registration form
      setRegisterData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "There was an error creating your account.",
        variant: "destructive",
      });
      console.error("Registration error:", error);
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setLoginData({ email: demoUser.email, password: demoUser.password });
    
    // Show a message to inform user about demo mode
    toast({
      title: "Demo credentials applied",
      description: "You can now log in with the demo account credentials.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="container max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Welcome to TravelTales</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to share your adventures or create a new account
            </p>
          </div>

          {isDemoMode && (
            <div className="bg-primary/10 p-4 rounded-lg mb-6 border border-primary/20">
              <h3 className="font-semibold text-primary mb-1">Demo Mode Activated</h3>
              <p className="text-sm">Login details have been pre-filled with demo credentials. Just click "Sign In" to proceed.</p>
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" id="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="p-6">
                <form onSubmit={handleLoginSubmit} id="login-form" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" id="login-form-submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="pt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleDemoLogin}
                    >
                      Try Demo Account
                    </Button>
                  </div>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="p-6">
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="traveler123"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Password</Label>
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={registerLoading}>
                    {registerLoading ? (
                      <>
                        <Loader className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to TravelTales'
            {" "}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
