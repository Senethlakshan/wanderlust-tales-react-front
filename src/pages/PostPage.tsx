import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { PostAPI, Post } from "@/services/api";
import { Heart, MessageSquare, Share2, Bookmark, Flag } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // Use the id from params to fetch specific post
        const postId = id || "1";
        const fetchedPost = await PostAPI.getById(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The post you are looking for does not exist or has been removed.</p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh] bg-cover bg-center" style={{ backgroundImage: `url(${post.imageUrl})` }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container relative z-10 flex items-end h-full pb-8">
            <div className="max-w-3xl text-white">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>
              <div className="flex items-center space-x-4">
                <Link to={`/profile/${post.author.id}`} className="flex items-center space-x-2">
                  <Avatar className="h-10 w-10 border-2 border-white">
                    <AvatarImage src={post.author.avatar} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm opacity-75">@{post.author.username}</p>
                  </div>
                </Link>
                <div className="text-sm">
                  <p>{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Post Content */}
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <Link 
                  to={`/search?country=${post.country}`} 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                >
                  {post.country}
                </Link>
                {post.tags?.map((tag, i) => (
                  <Link 
                    key={i} 
                    to={`/search?tag=${tag}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary/10 text-secondary"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
              
              <article className="prose prose-lg max-w-none">
                <p className="lead text-xl font-normal text-muted-foreground mb-6">
                  {post.excerpt}
                </p>
                
                <div dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available</p>' }} />
              </article>
              
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors">
                    <MessageSquare className="h-5 w-5" />
                    <span>{post.comments}</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <aside className="lg:col-span-4">
              <div className="sticky top-20 space-y-6">
                <div className="bg-muted/50 rounded-lg p-6 border">
                  <h3 className="font-semibold text-lg mb-4">About the Author</h3>
                  <div className="flex items-center space-x-3 mb-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{post.author.name}</p>
                      <p className="text-sm text-muted-foreground">@{post.author.username}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Travel enthusiast exploring the world one adventure at a time.
                  </p>
                  <Button asChild className="w-full">
                    <Link to={`/profile/${post.author.id}`}>View Profile</Link>
                  </Button>
                </div>
                
                {post.relatedPosts && post.relatedPosts.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-6 border">
                    <h3 className="font-semibold text-lg mb-4">Related Posts</h3>
                    <div className="space-y-4">
                      {post.relatedPosts.map((relatedPost, idx) => (
                        <Link key={idx} to={`/post/${relatedPost.id}`} className="block group">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 h-16 w-16 rounded-md overflow-hidden">
                              <img src={relatedPost.imageUrl} alt={relatedPost.title} className="h-full w-full object-cover" />
                            </div>
                            <div>
                              <h4 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                                {relatedPost.title}
                              </h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(relatedPost.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PostPage;
