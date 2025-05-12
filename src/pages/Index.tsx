import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/posts/PostCard";
import { CountrySelector } from "@/components/countries/CountrySelector";
import { Button } from "@/components/ui/button";
import { PostAPI, Post, CountryAPI, Country } from "@/services/api";
import { ArrowRight, Heart, MessageCircle } from "lucide-react";

const Index = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [popularPosts, setPopularPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await PostAPI.getAll();
        const popular = await PostAPI.getPopular();
        
        // Sort by date for recent posts
        const recent = [...allPosts].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 6);
        
        setRecentPosts(recent);
        setPopularPosts(popular);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-travel-primary text-white">
        <div className="absolute inset-0 z-0 bg-black/40" />
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1469474968028-56623f02e42e')", 
            filter: "brightness(0.7)" 
          }}
        />
        <div className="container relative z-10 py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Discover Extraordinary Journeys</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Share your travel adventures and explore inspiring stories from around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-travel-primary hover:bg-white/90">
              <Link to="/search" className="flex items-center">Explore Stories</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/20">
              <Link to="/register" className="flex items-center">Start Writing</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="container py-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Recent Adventures</h2>
          <Link to="/search">
            <Button variant="ghost" className="group">
              View all 
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[360px] bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Posts & Country Selector */}
      <section className="bg-muted/50 py-16">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8">Popular Stories</h2>
              {loading ? (
                <div className="space-y-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-[160px] bg-muted rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {popularPosts.map((post) => (
                    <div key={post.id} className="flex flex-col md:flex-row gap-4 items-start bg-background rounded-lg p-4 border">
                      <Link to={`/post/${post.id}`} className="md:w-1/3 shrink-0">
                        <div className="aspect-[16/9] md:aspect-square rounded-md overflow-hidden">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Link to={`/search?country=${post.country}`} className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                            {post.country}
                          </Link>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link to={`/post/${post.id}`}>
                          <h3 className="font-bold text-xl mb-2 hover:text-primary transition-colors">{post.title}</h3>
                        </Link>
                        <p className="text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                            <div className="h-8 w-8 rounded-full overflow-hidden">
                              <img src={post.author.avatar} alt={post.author.name} className="object-cover" />
                            </div>
                            <span className="text-sm font-medium">{post.author.username}</span>
                          </Link>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Heart className="h-4 w-4 text-travel-secondary" />
                              <span className="text-sm">{post.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-sm">{post.comments}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-8">Explore Countries</h2>
              <div className="bg-background p-6 rounded-lg border">
                <p className="text-muted-foreground mb-4">
                  Select a country to discover travel details and stories from that destination
                </p>
                <CountrySelector onSelectCountry={handleSelectCountry} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="container py-16">
        <div className="bg-travel-dark text-white rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">Ready to share your travel story?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Join our community of travel enthusiasts and share your adventures with the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="default" className="bg-travel-primary hover:bg-travel-primary/90">
              <Link to="/register">Create an Account</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
