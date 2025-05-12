
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Search, Globe, User, LogOut, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AuthAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(AuthAPI.isAuthenticated());
      setCurrentUser(AuthAPI.getCurrentUser());
    };
    
    checkAuth();
    
    // Add event listener to check auth status when storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = async () => {
    try {
      await AuthAPI.logout();
      setIsAuthenticated(false);
      setCurrentUser(null);
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of TravelTales",
      });
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLoginDemo = async () => {
    try {
      await AuthAPI.login("test@example.com", "Password123");
      setIsAuthenticated(true);
      setCurrentUser(AuthAPI.getCurrentUser());
      toast({
        title: "Logged in successfully",
        description: "You're logged in as the demo user",
      });
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-travel-primary" />
            <span className="text-xl font-bold">TravelTales</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/">
                <NavigationMenuLink className={cn(
                  "inline-flex items-center justify-center px-4 py-2 text-sm font-medium",
                  "hover:text-primary transition-colors"
                )}>
                  Home
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link to="/search">
                <NavigationMenuLink className={cn(
                  "inline-flex items-center justify-center px-4 py-2 text-sm font-medium",
                  "hover:text-primary transition-colors"
                )}>
                  Explore
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Countries</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {["Japan", "Italy", "France", "Thailand", "New Zealand", "Canada"].map((country) => (
                    <li key={country}>
                      <Link
                        to={`/search?country=${country}`}
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">{country}</div>
                        <p className="text-xs leading-snug text-muted-foreground">
                          Discover travel stories about {country}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            {isAuthenticated && (
              <NavigationMenuItem>
                <Link to="/create-post">
                  <NavigationMenuLink className={cn(
                    "inline-flex items-center justify-center px-4 py-2 text-sm font-medium",
                    "hover:text-primary transition-colors"
                  )}>
                    <Plus className="mr-1 h-4 w-4" /> Create Post
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/search"><Search className="h-5 w-5" /></Link>
          </Button>
          
          {isAuthenticated ? (
            <>
              <Button variant="outline" size="sm" asChild className="hidden md:flex">
                <Link to="/create-post">
                  <Plus className="mr-1 h-4 w-4" /> New Story
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage src={currentUser?.avatar || "https://github.com/shadcn.png"} alt={currentUser?.username || "User"} />
                    <AvatarFallback>{currentUser?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/create-post" className="cursor-pointer md:hidden">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Create Post</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="hidden md:flex gap-2">
              <Button variant="ghost" onClick={handleLoginDemo}>
                Demo Login
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Register</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                >
                  <path
                    d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1.5 7C1.22386 7 1 7.22386 1 7.5C1 7.77614 1.22386 8 1.5 8H13.5C13.7761 8 14 7.77614 14 7.5C14 7.22386 13.7761 7 13.5 7H1.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4">
                <Link to="/" className="flex items-center gap-2 py-2">
                  <Globe className="h-5 w-5" />
                  <span className="text-lg font-semibold">TravelTales</span>
                </Link>
                <Link to="/" className="py-2 hover:text-primary transition-colors">Home</Link>
                <Link to="/search" className="py-2 hover:text-primary transition-colors">Explore</Link>
                <Link to="/search" className="py-2 hover:text-primary transition-colors">Countries</Link>
                {!isAuthenticated ? (
                  <>
                    <button onClick={handleLoginDemo} className="text-left py-2 hover:text-primary transition-colors">
                      Demo Login
                    </button>
                    <Link to="/login" className="py-2 hover:text-primary transition-colors">Login</Link>
                    <Link to="/register" className="py-2 hover:text-primary transition-colors">Register</Link>
                  </>
                ) : (
                  <>
                    <Link to="/profile" className="py-2 hover:text-primary transition-colors">Profile</Link>
                    <Link to="/create-post" className="py-2 hover:text-primary transition-colors flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Create Post
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="py-2 text-left text-destructive hover:text-destructive/80 transition-colors flex items-center gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
