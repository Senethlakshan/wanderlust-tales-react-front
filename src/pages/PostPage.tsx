
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostAPI, Post, PostCard } from "@/services/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Calendar, Globe, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        if (!id) return;
        
        const postData = await PostAPI.getById(id);
        setPost(postData);
        
        // Fetch related posts (same country)
        const countryPosts = await PostAPI.getByCountry(postData.country);
        const filtered = countryPosts.filter(p => p.id !== id).slice(0, 3);
        setRelatedPosts(filtered);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = () => {
    if (!post) return;
    
    setLiked(!liked);
    setPost({
      ...post,
      likes: liked ? post.likes - 1 : post.likes + 1
    });
    
    toast({
      title: liked ? "Removed like" : "Added like",
      description: liked ? "You have removed your like from this post" : "You have liked this post",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      }).catch(err => console.error('Share failed:', err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Post link has been copied to your clipboard",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 flex-1">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="aspect-[21/9] bg-muted rounded"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-6">
              The post you are looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/search">Browse Posts</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <article className="flex-1">
        {/* Hero header with background image */}
        <div className="relative h-[50vh] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 container text-white text-center">
            <Link
              to={`/search?country=${post.country}`}
              className="inline-block mb-4 px-3 py-1 bg-travel-primary text-white rounded-full text-sm"
            >
              {post.country}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
            <div className="flex items-center justify-center gap-4">
              <Link to={`/profile/${post.author.id}`} className="flex items-center gap-2">
                <Avatar className="h-10 w-10 border-2 border-white">
                  <AvatarImage src={post.author.avatar} alt={post.author.name} />
                  <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{post.author.name}</span>
              </Link>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none">
                {/* For a real app, this would contain the full formatted post content */}
                <p className="text-lg leading-relaxed mb-6">
                  {post.content} Japan's former capital is home to hundreds of temples and shrines, each with its own unique charm and history. During my week-long journey through Kyoto, I discovered serene gardens, participated in traditional tea ceremonies, and witnessed the stunning contrast between ancient traditions and modern Japanese life.
                </p>
                
                <p className="mb-6">
                  The early morning visit to Fushimi Inari Shrine, with its thousands of vermilion torii gates, was particularly magical. Arriving before the crowds meant I could appreciate the peaceful atmosphere and take photos without tourists in the background. The hike up the mountain took about two hours, with numerous smaller shrines and stunning views along the way.
                </p>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Hidden Gems of Kyoto</h2>
                
                <p className="mb-6">
                  While Kinkaku-ji (the Golden Pavilion) and Kiyomizu-dera are must-see attractions, some of my favorite moments were spent in lesser-known temples. Otagi Nenbutsu-ji, located in Arashiyama, features over 1,200 unique stone statues, each with different expressions and poses. It's rarely crowded and offers a more intimate experience than the famous sites.
                </p>
                
                <p className="mb-6">
                  Another highlight was staying in a traditional ryokan in the Higashiyama district. The tatami mat floors, sliding paper doors, and traditional kaiseki meals provided an authentic glimpse into Japanese culture. The hospitality of the staff made the experience even more memorable.
                </p>
                
                <blockquote className="border-l-4 border-primary pl-4 italic my-8">
                  "In Kyoto, time seems to move differently. The ancient temples stand as they have for centuries, while modern life continues around them." 
                </blockquote>
                
                <h2 className="text-2xl font-bold mt-8 mb-4">Practical Tips</h2>
                
                <p className="mb-6">
                  If you're planning a visit to Kyoto, I'd recommend purchasing a bus pass for convenient transportation between temples. Many of the major sites are spread throughout the city, and the extensive bus network makes it easy to navigate. Additionally, consider visiting during spring for cherry blossoms or fall for autumn foliage - though be prepared for larger crowds during these peak seasons.
                </p>
              </div>
              
              {/* Post actions */}
              <div className="border-t border-b py-6 my-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={liked ? "default" : "outline"}
                    className={liked ? "bg-travel-primary hover:bg-travel-primary/90" : ""}
                    size="sm"
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
                    {post.likes + (liked ? 1 : 0)} Likes
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments} Comments
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
              
              {/* Comments section (simplified placeholder) */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                <div className="bg-muted/50 rounded-lg p-6 text-center">
                  <p>Sign in to leave a comment</p>
                  <div className="flex justify-center gap-4 mt-4">
                    <Button asChild variant="outline">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <aside>
              {/* Author info */}
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4">About the Author</h3>
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">@{post.author.username}</p>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mb-4">
                  Travel photographer and writer exploring the world one country at a time.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <div>
                    <span className="font-medium">{post.author.followers}</span> Followers
                  </div>
                  <div>
                    <span className="font-medium">{post.author.following}</span> Following
                  </div>
                </div>
                <Button className="w-full mt-4">Follow</Button>
              </div>
              
              {/* Country info */}
              <div className="bg-muted/30 rounded-lg p-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="h-5 w-5 text-travel-primary" />
                  <h3 className="text-lg font-semibold">Destination Info</h3>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{post.country === "Japan" ? "🇯🇵" : post.country === "Italy" ? "🇮🇹" : "🌎"}</span>
                  <h4 className="text-lg font-medium">{post.country}</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <p><strong>Capital:</strong> {post.country === "Japan" ? "Tokyo" : post.country === "Italy" ? "Rome" : "N/A"}</p>
                  <p><strong>Currency:</strong> {post.country === "Japan" ? "Japanese Yen (JPY)" : post.country === "Italy" ? "Euro (EUR)" : "N/A"}</p>
                  <p><strong>Languages:</strong> {post.country === "Japan" ? "Japanese" : post.country === "Italy" ? "Italian" : "N/A"}</p>
                </div>
                <Link to={`/search?country=${post.country}`}>
                  <Button variant="outline" className="w-full mt-4">
                    More about {post.country}
                  </Button>
                </Link>
              </div>
              
              {/* Related posts */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Related Stories</h3>
                <div className="space-y-4">
                  {relatedPosts.map(related => (
                    <Link to={`/post/${related.id}`} key={related.id} className="flex gap-3 group">
                      <div className="w-20 h-20 rounded-md overflow-hidden shrink-0">
                        <img src={related.imageUrl} alt={related.title} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">{related.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          by {related.author.name}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
};

export default PostPage;
