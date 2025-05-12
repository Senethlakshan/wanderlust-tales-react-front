
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/posts/PostCard";
import { CountrySelector } from "@/components/countries/CountrySelector";
import { PostAPI, Post, Country } from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCountry = searchParams.get("country") || "";
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  
  const postsPerPage = 9;

  // Handle search functionality
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Update URL with search parameters
    const params = new URLSearchParams();
    if (searchQuery) params.set("query", searchQuery);
    if (selectedCountry) params.set("country", selectedCountry.name);
    setSearchParams(params);
    
    setCurrentPage(1);
  };

  // Fetch posts based on search parameters
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let results: Post[] = [];
        
        if (initialCountry) {
          results = await PostAPI.getByCountry(initialCountry);
        } else if (initialQuery) {
          results = await PostAPI.searchPosts(initialQuery);
        } else {
          results = await PostAPI.getAll();
        }
        
        // Sort results based on sort order
        switch (sortOrder) {
          case "newest":
            results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case "most_liked":
            results.sort((a, b) => b.likes - a.likes);
            break;
          case "most_commented":
            results.sort((a, b) => b.comments - a.comments);
            break;
          default:
            break;
        }
        
        setPosts(results);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, [initialQuery, initialCountry, sortOrder]);

  // Handle country selection
  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setSearchParams({ country: country.name });
    setCurrentPage(1);
  };

  // Calculate pagination
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8">
          {initialCountry 
            ? `Exploring ${initialCountry}` 
            : initialQuery 
              ? `Search results for "${initialQuery}"` 
              : "Explore Travel Stories"}
        </h1>
        
        {/* Search Form */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search stories, countries, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-[200px]">
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="most_liked">Most Liked</SelectItem>
                  <SelectItem value="most_commented">Most Commented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-[360px] bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or explore different countries
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {currentPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <nav className="flex space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-4 py-2 rounded ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Country Selector */}
            <div className="bg-background border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Explore by Country</h3>
              <CountrySelector onSelectCountry={handleSelectCountry} />
            </div>
            
            {/* Popular Tags */}
            <div className="bg-background border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {["Adventure", "Food", "Culture", "Nature", "City", "Beach", "Mountains", "Wildlife", "Photography", "Budget Travel"].map((tag) => (
                  <div
                    key={tag}
                    className="bg-muted px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-muted/80 transition-colors"
                  >
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SearchPage;
