
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BlogPostAPI, CountryAPI, Country } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { BookPlus, ImagePlus } from "lucide-react";

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "https://images.unsplash.com/photo-1528127269322-539801943592", // Default image
    country: "",
    tags: "",
  });

  React.useEffect(() => {
    // Fetch countries for the dropdown
    const fetchCountries = async () => {
      try {
        const data = await CountryAPI.getAll();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    
    fetchCountries();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value: string) => {
    setPostData(prev => ({ ...prev, country: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Convert comma-separated tags to array
      const tagsArray = postData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");
      
      // Create post using API
      const newPost = await BlogPostAPI.create({
        ...postData,
        tags: tagsArray,
      });
      
      toast({
        title: "Success!",
        description: "Your travel story has been published.",
      });
      
      // Redirect to the new post
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Error",
        description: "Failed to publish your travel story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 border-b pb-4">
            <h1 className="text-3xl font-bold">Create New Travel Story</h1>
            <p className="text-muted-foreground mt-2">
              Share your travel adventures with the world
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., 'A Week in Kyoto's Ancient Temples'"
                  value={postData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                  Excerpt/Summary
                </label>
                <Input
                  id="excerpt"
                  name="excerpt"
                  placeholder="A brief summary of your travel story"
                  value={postData.excerpt}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <Select onValueChange={handleCountryChange} value={postData.country}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium mb-1">
                    Tags (comma-separated)
                  </label>
                  <Input
                    id="tags"
                    name="tags"
                    placeholder="e.g., temples, culture, history"
                    value={postData.tags}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    placeholder="URL to your cover image"
                    value={postData.imageUrl}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline">
                    <ImagePlus className="mr-2 h-4 w-4" /> Browse
                  </Button>
                </div>
                {postData.imageUrl && (
                  <div className="mt-2 aspect-video rounded-md overflow-hidden bg-muted">
                    <img
                      src={postData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1528127269322-539801943592";
                      }}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="content" className="block text-sm font-medium mb-1">
                  Content
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your travel story here..."
                  value={postData.content}
                  onChange={handleInputChange}
                  className="min-h-[300px]"
                  required
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <BookPlus className="mr-2 h-4 w-4" />
                {loading ? "Publishing..." : "Publish Story"}
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CreatePostPage;
