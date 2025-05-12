
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PostCard } from "@/components/posts/PostCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserAPI, PostAPI, Post, User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Calendar, Users, Mail } from "lucide-react";

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        // Default to first user if no ID provided (for demo)
        const userId = id || "1";
        
        const userData = await UserAPI.getProfile(userId);
        setUser(userData);
        
        const userPosts = await UserAPI.getUserPosts(userId);
        setPosts(userPosts);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id]);

  const handleFollow = () => {
    if (!user) return;
    
    setIsFollowing(!isFollowing);
    setUser({
      ...user,
      followers: isFollowing ? user.followers - 1 : user.followers + 1
    });
    
    toast({
      title: isFollowing ? "Unfollowed" : "Followed",
      description: isFollowing 
        ? `You have unfollowed @${user.username}`
        : `You are now following @${user.username}`,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 animate-pulse">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-muted"></div>
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted rounded"></div>
              <div className="h-4 w-24 bg-muted rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-muted rounded"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="container py-12 flex items-center justify-center flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <p className="text-muted-foreground mb-6">
              The profile you are looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/">Return Home</a>
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
      
      <div className="container py-12">
        {/* Profile Header */}
        <div className="bg-muted/30 rounded-xl p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <Avatar className="w-24 h-24 border-4 border-background">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
              <p className="text-muted-foreground mb-4">@{user.username}</p>
              
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-6">
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4 text-travel-primary" />
                  <span>World Traveler</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4 text-travel-primary" />
                  <span>Joined 2023</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="h-4 w-4 text-travel-primary" />
                  <span>{user.followers} followers</span>
                </div>
              </div>
              
              <p className="text-sm mb-6">
                {user.bio || "Travel enthusiast exploring the world and sharing adventures through stories and photography."}
              </p>
              
              <div className="flex items-center gap-3">
                <Button onClick={handleFollow}>
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button variant="outline">
                  <Mail className="h-4 w-4 mr-2" /> Message
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Profile Content */}
        <Tabs defaultValue="posts">
          <TabsList className="mb-8">
            <TabsTrigger value="posts">Posts ({posts.length})</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="following">Following ({user.following})</TabsTrigger>
            <TabsTrigger value="followers">Followers ({user.followers})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground">
                  This user hasn't shared any travel stories yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6">About {user.name}</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-medium mb-3">Bio</h4>
                  <p className="text-muted-foreground">
                    Travel photographer and writer exploring the world one country at a time. 
                    Passionate about authentic cultural experiences and capturing unique moments
                    through photography. Always planning the next adventure!
                  </p>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3">Countries Visited</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Japan", "Italy", "France", "Thailand", "Spain", "USA", "Canada", "Australia"].map(country => (
                      <div key={country} className="px-3 py-1 bg-background rounded-full text-sm">
                        {country}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Photography", "Hiking", "Food", "Architecture", "Culture", "History"].map(interest => (
                      <div key={interest} className="px-3 py-1 bg-background rounded-full text-sm">
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="following">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature is under development
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="followers">
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                This feature is under development
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
